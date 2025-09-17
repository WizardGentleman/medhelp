import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Syringe, Calculator, Info, TriangleAlert as AlertTriangle, Clock, Activity, Zap, ArrowLeftRight } from 'lucide-react-native';

interface Drug {
  id: string;
  name: string;
  concentration: string;
  preparation: string[];
  access: string;
  stability: string;
  dosage?: string;
  specialInstructions?: string[];
  minDose?: number;
  maxDose?: number;
  unit?: string;
  category: 'anesthetic' | 'inotropic' | 'vasopressor' | 'vasodilator' | 'sedative';
  finalConcentration?: number; // mcg/ml or mg/ml for pump calculations
  concentrationUnit?: 'mcg' | 'mg' | 'UI'; // Unit for final concentration
}

interface DrugResult {
  drug: Drug;
  weight: number;
  minRate?: number;
  maxRate?: number;
  minPumpRate?: number; // ml/h for infusion pump
  maxPumpRate?: number; // ml/h for infusion pump
  preparation: string[];
  administration: string;
  monitoring: string[];
}

interface ReverseCalculatorResult {
  drug: Drug;
  weight: number;
  pumpRate: number;
  calculatedDose: number;
  unit: string;
  isWithinRange: boolean;
  rangeMessage: string;
}

const drugs: Drug[] = [
  {
    id: 'cetamina',
    name: 'Cetamina',
    concentration: '50mg/ml',
    preparation: [
      '01 frasco (500mg) + SG5% 240ml',
      'Concentração final: 2mg/ml'
    ],
    access: 'Acesso Periférico',
    stability: '24 horas após diluição',
    category: 'anesthetic',
    finalConcentration: 2,
    concentrationUnit: 'mg'
  },
  {
    id: 'dobutamina',
    name: 'Dobutamina',
    concentration: '250mg/20ml',
    preparation: [
      '01 ampola (250mg) + SG5% 230ml',
      'Concentração final: 1000mcg/ml'
    ],
    access: 'Acesso Central ou Periférico',
    stability: '24 horas após diluição',
    dosage: '2,5 a 20mcg/kg/min',
    minDose: 2.5,
    maxDose: 20,
    unit: 'mcg/kg/min',
    category: 'inotropic',
    finalConcentration: 1000,
    concentrationUnit: 'mcg'
  },
  {
    id: 'dopamina',
    name: 'Dopamina',
    concentration: '5mg/ml',
    preparation: [
      '50ml (5 ampolas de 50mg/10ml) + SG5% 200ml',
      'Concentração final: 1000mcg/ml (1mg/ml)'
    ],
    access: 'Acesso Central ou Periférico',
    stability: '24 horas após diluição',
    dosage: '2 a 20mcg/kg/min',
    minDose: 2,
    maxDose: 20,
    unit: 'mcg/kg/min',
    specialInstructions: [
      'Dose baixa: 1 a 5 mcg/kg/min – aumento do fluxo sanguíneo renal (receptores dopaminérgicos)',
      'Dose intermediária: 5 a 15 mcg/kg/min – aumento do fluxo sanguíneo renal, da frequência cardíaca, da contratilidade cardíaca e do débito cardíaco',
      'Dose alta: > 15 mcg/kg/min – vasoconstrição e elevação da pressão arterial sistêmica. Vasoconstrição renal, mesentérica, arterial periférica e venosa, com aumento expressivo da resistência vascular sistêmica e pulmonar'
    ],
    category: 'inotropic',
    finalConcentration: 1000,
    concentrationUnit: 'mcg'
  },
  {
    id: 'dormonid',
    name: 'Dormonid (Midazolam)',
    concentration: '50mg/10ml',
    preparation: [
      '04 ampolas (200mg) + SF0,9% 160ml',
      'Concentração final: 1,25mg/ml'
    ],
    access: 'Acesso Central ou Periférico',
    stability: '24 horas após diluição',
    category: 'sedative',
    finalConcentration: 1.25,
    concentrationUnit: 'mg'
  },
  {
    id: 'fentanil',
    name: 'Fentanil',
    concentration: '0,05mg/ml',
    preparation: [
      '04 ampolas (2mg) + SF0,9% 160ml',
      'Concentração final: 12,5mcg/ml'
    ],
    access: 'Acesso Central ou Periférico',
    stability: '24 horas após diluição',
    category: 'sedative',
    finalConcentration: 12.5,
    concentrationUnit: 'mcg'
  },
  {
    id: 'nipride',
    name: 'Nipride (Nitroprussiato)',
    concentration: '50mg',
    preparation: [
      '01 ampola (50mg) + SG5% 250ml',
      'Concentração final: 200mcg/ml'
    ],
    access: 'Acesso Central ou Periférico',
    stability: '24 horas após diluição',
    dosage: '0,5 a 10mcg/kg/min',
    minDose: 0.5,
    maxDose: 10,
    unit: 'mcg/kg/min',
    specialInstructions: ['Usar equipo fotossensível'],
    category: 'vasodilator',
    finalConcentration: 200,
    concentrationUnit: 'mcg'
  },
  {
    id: 'noradrenalina',
    name: 'Noradrenalina',
    concentration: 'Múltiplas concentrações',
    preparation: [
      'Selecione a formulação desejada na página de resultado'
    ],
    access: 'Acesso Central',
    stability: '24 horas após diluição',
    dosage: '0,15 a 3mcg/kg/min',
    minDose: 0.15,
    maxDose: 3,
    unit: 'mcg/kg/min',
    category: 'vasopressor',
    finalConcentration: 50, // Default concentration, will be updated based on selection
    concentrationUnit: 'mcg'
  },
  {
    id: 'tridil',
    name: 'Tridil (Nitroglicerina)',
    concentration: '5mg/ml',
    preparation: [
      '01 ampola (5mg) + SG5% 180ml',
      'Concentração final: 27,7mcg/ml'
    ],
    access: 'Acesso Central ou Periférico',
    stability: '24 horas após diluição',
    dosage: '5 a 200mcg/min',
    minDose: 5,
    maxDose: 200,
    unit: 'mcg/min',
    category: 'vasodilator',
    finalConcentration: 27.7,
    concentrationUnit: 'mcg'
  },
  {
    id: 'precedex',
    name: 'Precedex (Dexmedetomidina)',
    concentration: '10mcg/ml',
    preparation: [
      '2ml (20mcg) + SF0,9% 48ml',
      'Concentração final: 0,4mcg/ml'
    ],
    access: 'Acesso Central ou Periférico',
    stability: '24 horas após diluição',
    category: 'sedative',
    finalConcentration: 0.4,
    concentrationUnit: 'mcg'
  },
  {
    id: 'propofol',
    name: 'Propofol',
    concentration: '10mg/ml',
    preparation: [
      '01 ampola (200mg) + 80ml SG5%',
      'Concentração final: 7,1mg/ml'
    ],
    access: 'Acesso Central ou Periférico',
    stability: '12 horas direto do frasco ou 6 horas quando transferido',
    category: 'sedative',
    finalConcentration: 7.1,
    concentrationUnit: 'mg'
  },
  {
    id: 'vasopressina',
    name: 'Vasopressina',
    concentration: '20U/ml',
    preparation: [
      '1ml (20U) + SG5% 200ml',
      'Concentração final: 0,1U/ml'
    ],
    access: 'Acesso Venoso Central',
    stability: '24 horas após diluição',
    dosage: '0,01 a 0,04 UI/min',
    minDose: 0.01,
    maxDose: 0.04,
    unit: 'UI/min',
    category: 'vasopressor',
    finalConcentration: 0.1,
    concentrationUnit: 'UI'
  }
];

// Noradrenalina formulations
const noradrenalinaFormulations = [
  {
    id: '4mg-64mcg',
    name: '4mg/4ml - 64mcg/ml',
    description: '1 Ampola equivale a 4mg/4ml de noradrenalina base (equivale Noradrenalina 8 mg/4ml)',
    preparation: [
      '1 Ampola equivale a 4mg/4ml de noradrenalina base (equivale Noradrenalina 8 mg/4ml)',
      '⚠️ PREPARE COM: 04 ampolas (16mg) + SG5% 234ml',
      'Concentração final: 64mcg/ml'
    ],
    finalConcentration: 64
  },
  {
    id: '4mg-100mcg',
    name: '4mg/4ml - 100mcg/ml',
    description: '1 Ampola equivale a 4mg/4ml de noradrenalina base (equivale Noradrenalina 8 mg/4ml)',
    preparation: [
      '1 Ampola equivale a 4mg/4ml de noradrenalina base (equivale Noradrenalina 8 mg/4ml)',
      '⚠️ PREPARE COM: 05 ampolas (20mg) + SG5% 180ml',
      'Concentração final: 100mcg/ml'
    ],
    finalConcentration: 100
  },
  {
    id: '4mg-128mcg',
    name: '4mg/4ml - 128mcg/ml',
    description: '1 Ampola equivale a 4mg/4ml de noradrenalina base (equivale Noradrenalina 8 mg/4ml)',
    preparation: [
      '1 Ampola equivale a 4mg/4ml de noradrenalina base (equivale Noradrenalina 8 mg/4ml)',
      '⚠️ PREPARE COM: 08 ampolas (32mg) + SG5% 218ml',
      'Concentração final: 128mcg/ml'
    ],
    finalConcentration: 128
  },
  {
    id: '4mg-200mcg',
    name: '4mg/4ml - 200mcg/ml',
    description: '1 Ampola equivale a 4mg/4ml de noradrenalina base (equivale Noradrenalina 8 mg/4ml)',
    preparation: [
      '1 Ampola equivale a 4mg/4ml de noradrenalina base (equivale Noradrenalina 8 mg/4ml)',
      '⚠️ PREPARE COM: 05 ampolas (20mg) + SG5% 80ml',
      'Concentração final: 200mcg/ml'
    ],
    finalConcentration: 200
  }
];

// Vasopressina formulations
const vasopressinaFormulations = [
  {
    id: '20U-0.1U',
    name: '20U/ml - 0,1U/ml',
    description: 'Formulação padrão',
    preparation: [
      '⚠️ PREPARE COM: 1ml (20U) + SG5% 199ml',
      'Concentração final: 0,1U/ml'
    ],
    finalConcentration: 0.1
  },
  {
    id: '20U-0.2U',
    name: '20U/ml - 0,2U/ml',
    description: 'Indicado para paciente com Insuficiência Renal Aguda ou não queira interferir no balanço hídrico',
    preparation: [
      '⚠️ PREPARE COM: 1ml (20U) + SG5% 99ml',
      'Concentração final: 0,2U/ml'
    ],
    finalConcentration: 0.2
  }
];

export default function DrogasVasoativasScreen() {
  const [weight, setWeight] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState<DrugResult | null>(null);
  const [selectedNoradrenalinaFormulation, setSelectedNoradrenalinaFormulation] = useState(noradrenalinaFormulations[0]);
  const [selectedVasopressinaFormulation, setSelectedVasopressinaFormulation] = useState(vasopressinaFormulations[0]);
  
  // Reverse calculator states
  const [reverseWeight, setReverseWeight] = useState('');
  const [reverseDrug, setReverseDrug] = useState<Drug | null>(null);
  const [pumpRate, setPumpRate] = useState('');
  const [reverseResult, setReverseResult] = useState<ReverseCalculatorResult | null>(null);
  const [reverseError, setReverseError] = useState('');
  
  // Estados para o slider de ajuste dinâmico
  const [sliderValue, setSliderValue] = useState(0);
  const [dynamicDose, setDynamicDose] = useState<number | null>(null);
  
  // Inicializa o slider quando o resultado é calculado
  useEffect(() => {
    if (result && result.minPumpRate) {
      setSliderValue(Math.round(result.minPumpRate));
      handleSliderChange(Math.round(result.minPumpRate));
    }
  }, [result]);

  const validateWeight = (value: string) => {
    const weightNum = parseFloat(value);
    if (!value) {
      setError('Peso é obrigatório');
      return false;
    }
    if (isNaN(weightNum) || weightNum < 1 || weightNum > 300) {
      setError('Peso deve estar entre 1 e 300 kg');
      return false;
    }
    setError('');
    return true;
  };

  const validateReverseInputs = () => {
    const weightNum = parseFloat(reverseWeight);
    const rateNum = parseFloat(pumpRate.replace(',', '.'));
    
    if (!reverseWeight) {
      setReverseError('Peso é obrigatório');
      return false;
    }
    if (isNaN(weightNum) || weightNum < 1 || weightNum > 300) {
      setReverseError('Peso deve estar entre 1 e 300 kg');
      return false;
    }
    if (!pumpRate) {
      setReverseError('Velocidade da bomba é obrigatória');
      return false;
    }
    if (isNaN(rateNum) || rateNum < 0 || rateNum > 999) {
      setReverseError('Velocidade deve estar entre 0 e 999 ml/h');
      return false;
    }
    if (!reverseDrug) {
      setReverseError('Selecione uma droga');
      return false;
    }
    if (!reverseDrug.minDose || !reverseDrug.maxDose || !reverseDrug.unit) {
      setReverseError('Esta droga não possui dosagem calculável');
      return false;
    }
    
    setReverseError('');
    return true;
  };

  const handleWeightChange = (value: string) => {
    setWeight(value.replace(',', '.'));
    if (value) validateWeight(value);
  };
  
  // Função para lidar com mudanças no slider
  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    
    // Calcula a dose baseada no valor do slider (ml/h)
    if (result && result.drug.finalConcentration && weight) {
      const weightNum = parseFloat(weight);
      const drug = result.drug;
      
      // Para noradrenalina e vasopressina, usa a formulação selecionada
      let concentrationToUse = drug.finalConcentration;
      if (drug.id === 'noradrenalina') {
        concentrationToUse = selectedNoradrenalinaFormulation.finalConcentration;
      } else if (drug.id === 'vasopressina') {
        concentrationToUse = selectedVasopressinaFormulation.finalConcentration;
      }
      
      const calculatedDose = calculateDoseFromPumpRate(value, weightNum, {
        ...drug,
        finalConcentration: concentrationToUse
      });
      
      setDynamicDose(calculatedDose);
    }
  };

  const calculatePumpRate = (dose: number, weight: number, concentration: number, unit: string): number => {
    // Para drogas com dosagem em mcg/min ou UI/min (sem peso)
    if (unit === 'mcg/min' || unit === 'UI/min') {
      let dosePerHour = dose * 60; // dose per hour
      return dosePerHour / concentration; // ml/h
    }
    
    // Convert dose to appropriate units and calculate ml/h
    let dosePerMin = dose * weight; // dose per minute
    let dosePerHour = dosePerMin * 60; // dose per hour
    
    // Convert concentration to same units as dose
    let finalConcentration = concentration;
    if (unit === 'mcg/kg/min' && selectedDrug?.concentrationUnit === 'mg') {
      finalConcentration = concentration * 1000; // Convert mg/ml to mcg/ml
    } else if (unit === 'mg/kg/min' && selectedDrug?.concentrationUnit === 'mcg') {
      finalConcentration = concentration / 1000; // Convert mcg/ml to mg/ml
    }
    
    return dosePerHour / finalConcentration; // ml/h
  };

  const calculateDoseFromPumpRate = (pumpRateMLH: number, weight: number, drug: Drug): number => {
    if (!drug.finalConcentration || !drug.unit) return 0;
    
    // Calculate dose per hour from pump rate
    let dosePerHour = pumpRateMLH * drug.finalConcentration;
    
    // Convert to dose per minute
    let dosePerMin = dosePerHour / 60;
    
    // Para drogas com dosagem em mcg/min ou UI/min (sem peso)
    if (drug.unit === 'mcg/min' || drug.unit === 'UI/min') {
      return dosePerMin;
    }
    
    // Convert to dose per kg per minute
    let dosePerKgPerMin = dosePerMin / weight;
    
    // Convert units if necessary
    if (drug.unit === 'mcg/kg/min' && drug.concentrationUnit === 'mg') {
      dosePerKgPerMin = dosePerKgPerMin * 1000; // Convert mg to mcg
    } else if (drug.unit === 'mg/kg/min' && drug.concentrationUnit === 'mcg') {
      dosePerKgPerMin = dosePerKgPerMin / 1000; // Convert mcg to mg
    }
    
    return dosePerKgPerMin;
  };

  const calculateDosage = () => {
    if (!validateWeight(weight) || !selectedDrug) return;

    const weightNum = parseFloat(weight);
    let drugResult: DrugResult = {
      drug: selectedDrug,
      weight: weightNum,
      preparation: selectedDrug.preparation,
      administration: `Via: ${selectedDrug.access}`,
      monitoring: [
        'Monitorização cardíaca contínua',
        'Controle de pressão arterial',
        'Avaliação de sinais vitais a cada 15 minutos',
        `Estabilidade: ${selectedDrug.stability}`
      ]
    };

    // Calculate infusion rates for drugs with dosage
    if (selectedDrug.minDose && selectedDrug.maxDose && selectedDrug.unit && selectedDrug.finalConcentration) {
      // Para drogas com dosagem em mcg/min ou UI/min (sem peso)
      const isWeightIndependent = selectedDrug.unit === 'mcg/min' || selectedDrug.unit === 'UI/min';
      
      const minRate = isWeightIndependent ? selectedDrug.minDose : (selectedDrug.minDose * weightNum);
      const maxRate = isWeightIndependent ? selectedDrug.maxDose : (selectedDrug.maxDose * weightNum);
      
      drugResult.minRate = minRate;
      drugResult.maxRate = maxRate;
      
      // Use selected formulation concentration for noradrenalina and vasopressina
      let concentrationToUse = selectedDrug.finalConcentration;
      if (selectedDrug.id === 'noradrenalina') {
        concentrationToUse = selectedNoradrenalinaFormulation.finalConcentration;
      } else if (selectedDrug.id === 'vasopressina') {
        concentrationToUse = selectedVasopressinaFormulation.finalConcentration;
      }
      
      // Update preparation for noradrenalina and vasopressina
      if (selectedDrug.id === 'noradrenalina') {
        drugResult.preparation = selectedNoradrenalinaFormulation.preparation;
      } else if (selectedDrug.id === 'vasopressina') {
        drugResult.preparation = selectedVasopressinaFormulation.preparation;
      }
      
      // Calculate pump rates in ml/h
      drugResult.minPumpRate = calculatePumpRate(
        selectedDrug.minDose, 
        weightNum, 
        concentrationToUse, 
        selectedDrug.unit
      );
      drugResult.maxPumpRate = calculatePumpRate(
        selectedDrug.maxDose, 
        weightNum, 
        concentrationToUse, 
        selectedDrug.unit
      );
      
      // Add specific monitoring based on drug category
      switch (selectedDrug.category) {
        case 'vasopressor':
          drugResult.monitoring.push(
            'Monitorar perfusão periférica',
            'Avaliar função renal',
            'Controle rigoroso da pressão arterial'
          );
          break;
        case 'inotropic':
          drugResult.monitoring.push(
            'Monitorar ritmo cardíaco',
            'Avaliar débito cardíaco',
            'Controle de arritmias'
          );
          break;
        case 'vasodilator':
          drugResult.monitoring.push(
            'Monitorar hipotensão',
            'Avaliar perfusão cerebral',
            'Controle da frequência cardíaca'
          );
          break;
        case 'sedative':
          drugResult.monitoring.push(
            'Escala de sedação',
            'Monitorar função respiratória',
            'Avaliar nível de consciência'
          );
          break;
      }
    }

    // Add special instructions if available
    if (selectedDrug.specialInstructions) {
      drugResult.monitoring.push(...selectedDrug.specialInstructions);
    }

    setResult(drugResult);
  };

  const calculateReverseDose = () => {
    if (!validateReverseInputs()) return;

    const weightNum = parseFloat(reverseWeight);
    const rateNum = parseFloat(pumpRate.replace(',', '.'));
    
    const calculatedDose = calculateDoseFromPumpRate(rateNum, weightNum, reverseDrug!);
    
    // Check if dose is within therapeutic range
    const isWithinRange = reverseDrug!.minDose! <= calculatedDose && calculatedDose <= reverseDrug!.maxDose!;
    
    let rangeMessage = '';
    if (calculatedDose < reverseDrug!.minDose!) {
      rangeMessage = `⚠️ DOSE ABAIXO DO MÍNIMO (${reverseDrug!.minDose} ${reverseDrug!.unit})`;
    } else if (calculatedDose > reverseDrug!.maxDose!) {
      rangeMessage = `⚠️ DOSE ACIMA DO MÁXIMO (${reverseDrug!.maxDose} ${reverseDrug!.unit})`;
    } else {
      rangeMessage = `✅ DOSE DENTRO DA FAIXA TERAPÊUTICA (${reverseDrug!.minDose} - ${reverseDrug!.maxDose} ${reverseDrug!.unit})`;
    }

    setReverseResult({
      drug: reverseDrug!,
      weight: weightNum,
      pumpRate: rateNum,
      calculatedDose,
      unit: reverseDrug!.unit!,
      isWithinRange,
      rangeMessage
    });
  };

  const resetCalculation = () => {
    setWeight('');
    setSelectedDrug(null);
    setResult(null);
    setError('');
    setSelectedNoradrenalinaFormulation(noradrenalinaFormulations[0]); // Reset to first formulation
    setSelectedVasopressinaFormulation(vasopressinaFormulations[0]); // Reset to first formulation
    setSliderValue(0);
    setDynamicDose(null);
  };

  const resetReverseCalculation = () => {
    setReverseWeight('');
    setReverseDrug(null);
    setPumpRate('');
    setReverseResult(null);
    setReverseError('');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'anesthetic': return '#FF5722';
      case 'inotropic': return '#2196F3';
      case 'vasopressor': return '#F44336';
      case 'vasodilator': return '#4CAF50';
      case 'sedative': return '#FF9800';
      default: return theme.colors.emergency;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'anesthetic': return 'Anestésico';
      case 'inotropic': return 'Inotrópico';
      case 'vasopressor': return 'Vasopressor';
      case 'vasodilator': return 'Vasodilatador';
      case 'sedative': return 'Sedativo';
      default: return 'Medicamento';
    }
  };

  const groupedDrugs = drugs.reduce((acc, drug) => {
    if (!acc[drug.category]) {
      acc[drug.category] = [];
    }
    acc[drug.category].push(drug);
    return acc;
  }, {} as Record<string, Drug[]>);

  // Filter drugs that have dosage calculations for reverse calculator
  const calculableDrugs = drugs.filter(drug => drug.minDose && drug.maxDose && drug.unit);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Drogas Vasoativas" type="emergency" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {!result && !reverseResult ? (
            <>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>
                  <Syringe size={20} color={theme.colors.emergency} /> Calculadora de Drogas Vasoativas
                </Text>
                <Text style={styles.infoText}>
                  Selecione o peso do paciente e a droga desejada para obter as informações de preparo, 
                  dosagem e velocidade de infusão para bomba de infusão contínua.
                </Text>
              </View>

              <View style={styles.weightContainer}>
                <Text style={styles.label}>Peso do Paciente (kg)</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Digite o peso"
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={handleWeightChange}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              <Text style={styles.sectionTitle}>Selecione a Droga:</Text>

              {Object.entries(groupedDrugs).map(([category, categoryDrugs]) => (
                <View key={category} style={styles.categorySection}>
                  <View style={[styles.categoryHeader, { backgroundColor: getCategoryColor(category) }]}>
                    <Text style={styles.categoryTitle}>{getCategoryName(category)}</Text>
                  </View>
                  
                  <View style={styles.drugsGrid}>
                    {categoryDrugs.map((drug) => (
                      <TouchableOpacity
                        key={drug.id}
                        style={[
                          styles.drugCard,
                          selectedDrug?.id === drug.id && styles.drugCardSelected,
                          { borderColor: getCategoryColor(category) }
                        ]}
                        onPress={() => setSelectedDrug(drug)}
                      >
                        <Text style={[
                          styles.drugName,
                          selectedDrug?.id === drug.id && { color: getCategoryColor(category) }
                        ]}>
                          {drug.name}
                        </Text>
                        <Text style={styles.drugConcentration}>
                          {drug.concentration}
                        </Text>
                        <Text style={styles.drugAccess}>
                          {drug.access}
                        </Text>
                        {drug.dosage && (
                          <Text style={styles.drugDosage}>
                            {drug.dosage}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={[
                  styles.calculateButton,
                  (!weight || !selectedDrug || error) && styles.calculateButtonDisabled
                ]}
                onPress={calculateDosage}
                disabled={!weight || !selectedDrug || !!error}
              >
                <Calculator size={20} color="white" />
                <Text style={styles.calculateButtonText}>Calcular Prescrição</Text>
              </TouchableOpacity>

              {/* Reverse Calculator Section */}
              <View style={styles.reverseCalculatorSection}>
                <View style={styles.reverseCalculatorHeader}>
                  <ArrowLeftRight size={24} color="#E91E63" />
                  <Text style={styles.reverseCalculatorTitle}>Calculadora Reversa</Text>
                </View>
                <Text style={styles.reverseCalculatorSubtitle}>
                  Converta ml/h para dose (mcg/kg/min ou UI/min)
                </Text>

                <View style={styles.reverseInputsContainer}>
                  <View style={styles.reverseInputGroup}>
                    <Text style={styles.label}>Peso do Paciente (kg)</Text>
                    <TextInput
                      style={[styles.input, reverseError.includes('Peso') && styles.inputError]}
                      placeholder="Digite o peso"
                      keyboardType="decimal-pad"
                      value={reverseWeight}
                      onChangeText={(value) => setReverseWeight(value.replace(',', '.'))}
                    />
                  </View>

                  <View style={styles.reverseInputGroup}>
                    <Text style={styles.label}>Velocidade da Bomba (ml/h)</Text>
                    <TextInput
                      style={[styles.input, reverseError.includes('Velocidade') && styles.inputError]}
                      placeholder="Digite a velocidade"
                      keyboardType="decimal-pad"
                      value={pumpRate}
                      onChangeText={(value) => setPumpRate(value.replace(',', '.'))}
                    />
                  </View>

                  <View style={styles.reverseInputGroup}>
                    <Text style={styles.label}>Droga (apenas com dosagem calculável)</Text>
                    <View style={styles.reverseDrugSelector}>
                      {calculableDrugs.map((drug) => (
                        <TouchableOpacity
                          key={drug.id}
                          style={[
                            styles.reverseDrugCard,
                            reverseDrug?.id === drug.id && styles.reverseDrugCardSelected,
                            { borderColor: getCategoryColor(drug.category) }
                          ]}
                          onPress={() => setReverseDrug(drug)}
                        >
                          <Text style={[
                            styles.reverseDrugName,
                            reverseDrug?.id === drug.id && { color: getCategoryColor(drug.category) }
                          ]}>
                            {drug.name}
                          </Text>
                          <Text style={styles.reverseDrugDosage}>
                            {drug.dosage}
                          </Text>
                          <Text style={styles.reverseDrugConcentration}>
                            {drug.finalConcentration}{drug.concentrationUnit}/ml
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {reverseError ? <Text style={styles.errorText}>{reverseError}</Text> : null}

                  <TouchableOpacity
                    style={[
                      styles.reverseCalculateButton,
                      (!reverseWeight || !pumpRate || !reverseDrug || reverseError) && styles.calculateButtonDisabled
                    ]}
                    onPress={calculateReverseDose}
                    disabled={!reverseWeight || !pumpRate || !reverseDrug || !!reverseError}
                  >
                    <ArrowLeftRight size={20} color="white" />
                    <Text style={styles.calculateButtonText}>Calcular Dose</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : result ? (
            <View style={styles.resultContainer}>
              <View style={[
                styles.resultCard,
                { borderColor: getCategoryColor(result.drug.category) }
              ]}>
                <View style={[
                  styles.resultHeader,
                  { backgroundColor: getCategoryColor(result.drug.category) }
                ]}>
                  <Syringe size={24} color="white" />
                  <Text style={styles.resultTitle}>{result.drug.name}</Text>
                </View>
                
                <View style={styles.resultContent}>
                  <Text style={styles.patientInfo}>
                    Paciente: {result.weight}kg | Categoria: {getCategoryName(result.drug.category)}
                  </Text>
                </View>
              </View>

              <View style={styles.preparationCard}>
                <Text style={styles.preparationTitle}>
                  <Activity size={20} color={theme.colors.emergency} /> Preparo da Solução
                </Text>
                
                {/* Special selector for Noradrenalina formulations */}
                {result.drug.id === 'noradrenalina' && (
                  <View style={styles.formulationSelector}>
                    <Text style={styles.formulationSelectorTitle}>Selecione a Formulação:</Text>
                    {noradrenalinaFormulations.map((formulation) => (
                      <TouchableOpacity
                        key={formulation.id}
                        style={[
                          styles.formulationOption,
                          selectedNoradrenalinaFormulation.id === formulation.id && styles.formulationOptionSelected
                        ]}
                        onPress={() => {
                          setSelectedNoradrenalinaFormulation(formulation);
                          // Update result immediately with new formulation
                          if (result) {
                            const updatedResult = { ...result };
                            updatedResult.preparation = formulation.preparation;
                            
                            // Recalculate pump rates with new concentration
                            if (result.drug.minDose && result.drug.maxDose && result.drug.unit) {
                              const weightNum = result.weight;
                              updatedResult.minPumpRate = calculatePumpRate(
                                result.drug.minDose,
                                weightNum,
                                formulation.finalConcentration,
                                result.drug.unit
                              );
                              updatedResult.maxPumpRate = calculatePumpRate(
                                result.drug.maxDose,
                                weightNum,
                                formulation.finalConcentration,
                                result.drug.unit
                              );
                            }
                            
                            setResult(updatedResult);
                          }
                        }}
                      >
                        <Text style={[
                          styles.formulationOptionText,
                          selectedNoradrenalinaFormulation.id === formulation.id && styles.formulationOptionTextSelected
                        ]}>
                          {formulation.name}
                        </Text>
                        <Text style={styles.formulationOptionDescription}>
                          {formulation.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                {/* Special selector for Vasopressina formulations */}
                {result.drug.id === 'vasopressina' && (
                  <View style={styles.formulationSelector}>
                    <Text style={styles.formulationSelectorTitle}>Selecione a Formulação:</Text>
                    {vasopressinaFormulations.map((formulation) => (
                      <TouchableOpacity
                        key={formulation.id}
                        style={[
                          styles.formulationOption,
                          selectedVasopressinaFormulation.id === formulation.id && styles.formulationOptionSelected
                        ]}
                        onPress={() => {
                          setSelectedVasopressinaFormulation(formulation);
                          // Update result immediately with new formulation
                          if (result) {
                            const updatedResult = { ...result };
                            updatedResult.preparation = formulation.preparation;
                            
                            // Recalculate pump rates with new concentration
                            if (result.drug.minDose && result.drug.maxDose && result.drug.unit) {
                              const weightNum = result.weight;
                              updatedResult.minPumpRate = calculatePumpRate(
                                result.drug.minDose,
                                weightNum,
                                formulation.finalConcentration,
                                result.drug.unit
                              );
                              updatedResult.maxPumpRate = calculatePumpRate(
                                result.drug.maxDose,
                                weightNum,
                                formulation.finalConcentration,
                                result.drug.unit
                              );
                            }
                            
                            setResult(updatedResult);
                          }
                        }}
                      >
                        <Text style={[
                          styles.formulationOptionText,
                          selectedVasopressinaFormulation.id === formulation.id && styles.formulationOptionTextSelected
                        ]}>
                          {formulation.name}
                        </Text>
                        <Text style={styles.formulationOptionDescription}>
                          {formulation.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                {result.preparation.map((prep, index) => (
                  <Text key={index} style={[
                    styles.preparationText,
                    prep.includes('PREPARE COM:') && {
                      fontFamily: 'Roboto-Bold',
                      fontSize: theme.fontSize.md,
                      color: theme.colors.emergency,
                      backgroundColor: '#FFEBEE',
                      padding: theme.spacing.sm,
                      borderRadius: theme.borderRadius.sm,
                      marginVertical: theme.spacing.xs,
                    }
                  ]}>
                    {prep.includes('PREPARE COM:') ? prep : `• ${prep}`}
                  </Text>
                ))}
              </View>

              {result.minRate && result.maxRate && (
                <View style={styles.dosageCard}>
                  <Text style={styles.dosageTitle}>
                    <Calculator size={20} color={theme.colors.calculator} /> Dosagem Calculada
                  </Text>
                  <Text style={styles.dosageText}>
                    Dose: {result.minRate.toFixed(2)} a {result.maxRate.toFixed(2)} {result.drug.unit}
                  </Text>
                  {(result.drug.unit !== 'mcg/min' && result.drug.unit !== 'UI/min') && (
                    <Text style={styles.dosageSubtext}>
                      Para paciente de {result.weight}kg
                    </Text>
                  )}
                </View>
              )}

              {result.minPumpRate && result.maxPumpRate && (
                <>
                  <View style={styles.pumpRateCard}>
                    <Text style={styles.pumpRateTitle}>
                      <Zap size={20} color="#E91E63" /> Velocidade da Bomba de Infusão
                    </Text>
                    <Text style={styles.pumpRateText}>
                      Programar: {result.minPumpRate.toFixed(1)} a {result.maxPumpRate.toFixed(1)} ml/h
                    </Text>
                    <Text style={styles.pumpRateSubtext}>
                      Concentração: {result.drug.id === 'noradrenalina' ? selectedNoradrenalinaFormulation.finalConcentration : (result.drug.id === 'vasopressina' ? selectedVasopressinaFormulation.finalConcentration : result.drug.finalConcentration)}{result.drug.concentrationUnit}/ml
                    </Text>
                    <View style={styles.pumpInstructions}>
                      <Text style={styles.pumpInstructionsTitle}>Instruções para a Bomba:</Text>
                      <Text style={styles.pumpInstructionsText}>
                        • Conectar seringa ou equipo à bomba de infusão{'\n'}
                        • Programar velocidade inicial: {result.minPumpRate.toFixed(1)} ml/h{'\n'}
                        • Ajustar conforme resposta clínica{'\n'}
                        • Velocidade máxima: {result.maxPumpRate.toFixed(1)} ml/h
                      </Text>
                    </View>
                  </View>
                  
                  {/* Slider de ajuste dinâmico de dose */}
                  <View style={styles.sliderCard}>
                    <View style={styles.sliderTitle}>
                      <ArrowLeftRight size={20} color="#673AB7" />
                      <Text style={[styles.sliderTitle, { marginBottom: 0 }]}>Ajuste Dinâmico de Dose</Text>
                    </View>
                    <Text style={styles.sliderSubtitle}>
                      Ajuste a velocidade da bomba e veja a dose correspondente
                    </Text>
                    
                    <View style={styles.sliderContainer}>
                      <Text style={styles.sliderLabel}>Velocidade (ml/h)</Text>
                      
                      <View style={styles.sliderValues}>
                        <Text style={styles.sliderMinMax}>0 ml/h</Text>
                        <Text style={styles.sliderCurrent}>{sliderValue.toFixed(0)} ml/h</Text>
                        <Text style={styles.sliderMinMax}>{Math.ceil(result.maxPumpRate * 1.2).toFixed(0)} ml/h</Text>
                      </View>
                      
                      <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={Math.ceil(result.maxPumpRate * 1.2)} // 20% acima do máximo recomendado
                        step={1}
                        value={sliderValue}
                        onValueChange={handleSliderChange}
                        minimumTrackTintColor="#673AB7"
                        maximumTrackTintColor="#E0E0E0"
                        thumbTintColor="#673AB7"
                      />
                      
                      {dynamicDose !== null && (
                        <View style={[
                          styles.doseDisplay,
                          {
                            backgroundColor: 
                              dynamicDose < result.drug.minDose! ? '#FFEBEE' :
                              dynamicDose > result.drug.maxDose! ? '#FFEBEE' :
                              '#E8F5E9',
                            borderColor:
                              dynamicDose < result.drug.minDose! ? '#F44336' :
                              dynamicDose > result.drug.maxDose! ? '#F44336' :
                              '#4CAF50'
                          }
                        ]}>
                          <Text style={styles.doseDisplayLabel}>Dose Calculada:</Text>
                          <Text style={[
                            styles.doseDisplayValue,
                            {
                              color: 
                                dynamicDose < result.drug.minDose! ? '#F44336' :
                                dynamicDose > result.drug.maxDose! ? '#F44336' :
                                '#4CAF50'
                            }
                          ]}>
                            {dynamicDose.toFixed(3)} {result.drug.unit}
                          </Text>
                          
                          {dynamicDose < result.drug.minDose! && (
                            <Text style={styles.doseWarning}>
                              ⚠️ Abaixo da dose mínima ({result.drug.minDose} {result.drug.unit})
                            </Text>
                          )}
                          
                          {dynamicDose > result.drug.maxDose! && (
                            <Text style={styles.doseWarning}>
                              ⚠️ Acima da dose máxima ({result.drug.maxDose} {result.drug.unit})
                            </Text>
                          )}
                          
                          {dynamicDose >= result.drug.minDose! && dynamicDose <= result.drug.maxDose! && (
                            <Text style={styles.doseSafe}>
                              ✅ Dentro da faixa terapêutica
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                </>
              )}

              {/* Special section for Dopamine dosage information */}
              {result.drug.id === 'dopamina' && (
                <View style={styles.dopamineDosageCard}>
                  <Text style={styles.dopamineDosageTitle}>
                    <Info size={20} color="#2196F3" /> Dosagem da Dopamina por Efeito
                  </Text>
                  
                  <View style={styles.dopamineDoseSection}>
                    <Text style={styles.dopamineDoseHeader}>Dose Baixa: 1 a 5 mcg/kg/min</Text>
                    <Text style={styles.dopamineDoseDescription}>
                      • Aumento do fluxo sanguíneo renal (receptores dopaminérgicos)
                    </Text>
                    <Text style={styles.dopamineDoseValue}>
                      Para {result.weight}kg: {(1 * result.weight).toFixed(1)} a {(5 * result.weight).toFixed(1)} mcg/min
                    </Text>
                    <Text style={styles.dopaminePumpRate}>
                      Bomba: {(1 * result.weight * 60 / 1000).toFixed(1)} a {(5 * result.weight * 60 / 1000).toFixed(1)} ml/h
                    </Text>
                  </View>

                  <View style={styles.dopamineDoseSection}>
                    <Text style={styles.dopamineDoseHeader}>Dose Intermediária: 5 a 15 mcg/kg/min</Text>
                    <Text style={styles.dopamineDoseDescription}>
                      • Aumento do fluxo sanguíneo renal, da frequência cardíaca, da contratilidade cardíaca e do débito cardíaco
                    </Text>
                    <Text style={styles.dopamineDoseValue}>
                      Para {result.weight}kg: {(5 * result.weight).toFixed(1)} a {(15 * result.weight).toFixed(1)} mcg/min
                    </Text>
                    <Text style={styles.dopaminePumpRate}>
                      Bomba: {(5 * result.weight * 60 / 1000).toFixed(1)} a {(15 * result.weight * 60 / 1000).toFixed(1)} ml/h
                    </Text>
                  </View>

                  <View style={styles.dopamineDoseSection}>
                    <Text style={styles.dopamineDoseHeader}>Dose Alta: > 15 mcg/kg/min</Text>
                    <Text style={styles.dopamineDoseDescription}>
                      • Vasoconstrição e elevação da pressão arterial sistêmica. Vasoconstrição renal, mesentérica, arterial periférica e venosa, com aumento expressivo da resistência vascular sistêmica e pulmonar
                    </Text>
                    <Text style={styles.dopamineDoseValue}>
                      Para {result.weight}kg: > {(15 * result.weight).toFixed(1)} mcg/min
                    </Text>
                    <Text style={styles.dopaminePumpRate}>
                      Bomba: > {(15 * result.weight * 60 / 1000).toFixed(1)} ml/h
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.administrationCard}>
                <Text style={styles.administrationTitle}>
                  <Info size={20} color={theme.colors.calculator} /> Administração
                </Text>
                <Text style={styles.administrationText}>
                  {result.administration}
                </Text>
              </View>

              <View style={styles.monitoringCard}>
                <Text style={styles.monitoringTitle}>
                  <AlertTriangle size={20} color="#FF9800" /> Monitorização e Cuidados
                </Text>
                {result.monitoring.map((monitor, index) => (
                  <Text key={index} style={styles.monitoringText}>
                    • {monitor}
                  </Text>
                ))}
              </View>

              <View style={styles.stabilityCard}>
                <Text style={styles.stabilityTitle}>
                  <Clock size={20} color="#4CAF50" /> Estabilidade
                </Text>
                <Text style={styles.stabilityText}>
                  {result.drug.stability}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetCalculation}
              >
                <Text style={styles.resetButtonText}>Nova Prescrição</Text>
              </TouchableOpacity>
            </View>
          ) : reverseResult ? (
            <View style={styles.reverseResultContainer}>
              <View style={[
                styles.reverseResultCard,
                { borderColor: reverseResult.isWithinRange ? '#4CAF50' : '#F44336' }
              ]}>
                <View style={[
                  styles.reverseResultHeader,
                  { backgroundColor: reverseResult.isWithinRange ? '#4CAF50' : '#F44336' }
                ]}>
                  <ArrowLeftRight size={24} color="white" />
                  <Text style={styles.reverseResultTitle}>Dose Calculada</Text>
                </View>
                
                <View style={styles.reverseResultContent}>
                  <Text style={styles.reverseResultDrug}>
                    {reverseResult.drug.name}
                  </Text>
                  <Text style={styles.reverseResultPatient}>
                    Paciente: {reverseResult.weight}kg | Bomba: {reverseResult.pumpRate}ml/h
                  </Text>
                  <Text style={styles.reverseResultDose}>
                    Dose: {reverseResult.calculatedDose.toFixed(3)} {reverseResult.unit}
                  </Text>
                  <Text style={[
                    styles.reverseResultRange,
                    { color: reverseResult.isWithinRange ? '#4CAF50' : '#F44336' }
                  ]}>
                    {reverseResult.rangeMessage}
                  </Text>
                </View>
              </View>

              <View style={styles.reverseResultInfoCard}>
                <Text style={styles.reverseResultInfoTitle}>
                  <Info size={20} color={theme.colors.calculator} /> Informações da Droga
                </Text>
                <Text style={styles.reverseResultInfoText}>
                  Concentração: {reverseResult.drug.finalConcentration}{reverseResult.drug.concentrationUnit}/ml
                </Text>
                <Text style={styles.reverseResultInfoText}>
                  Faixa terapêutica: {reverseResult.drug.minDose} - {reverseResult.drug.maxDose} {reverseResult.unit}
                </Text>
                <Text style={styles.reverseResultInfoText}>
                  Acesso: {reverseResult.drug.access}
                </Text>
              </View>

              {!reverseResult.isWithinRange && (
                <View style={styles.reverseResultWarningCard}>
                  <Text style={styles.reverseResultWarningTitle}>
                    <AlertTriangle size={20} color="#F44336" /> Atenção
                  </Text>
                  <Text style={styles.reverseResultWarningText}>
                    A dose calculada está fora da faixa terapêutica recomendada. 
                    Verifique a velocidade da bomba e considere ajustar conforme protocolo clínico.
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetReverseCalculation}
              >
                <Text style={styles.resetButtonText}>Nova Conversão</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  infoCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.emergency,
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  weightContainer: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  categorySection: {
    marginBottom: theme.spacing.xl,
  },
  categoryHeader: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  categoryTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    textAlign: 'center',
  },
  drugsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  drugCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '48%',
    minHeight: 120,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  drugCardSelected: {
    borderWidth: 2,
    backgroundColor: '#F8F9FA',
  },
  drugName: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  drugConcentration: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  drugAccess: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  drugDosage: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.emergency,
  },
  calculateButton: {
    backgroundColor: theme.colors.emergency,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  calculateButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  // Reverse Calculator Styles
  reverseCalculatorSection: {
    marginTop: theme.spacing.xxl,
    backgroundColor: '#FCE4EC',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  reverseCalculatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  reverseCalculatorTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#E91E63',
  },
  reverseCalculatorSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  reverseInputsContainer: {
    gap: theme.spacing.lg,
  },
  reverseInputGroup: {
    gap: theme.spacing.xs,
  },
  reverseDrugSelector: {
    gap: theme.spacing.md,
  },
  reverseDrugCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reverseDrugCardSelected: {
    borderWidth: 2,
    backgroundColor: '#F8F9FA',
  },
  reverseDrugName: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  reverseDrugDosage: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.emergency,
    marginBottom: theme.spacing.xs,
  },
  reverseDrugConcentration: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
  },
  reverseCalculateButton: {
    backgroundColor: '#E91E63',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  // Reverse Result Styles
  reverseResultContainer: {
    gap: theme.spacing.lg,
  },
  reverseResultCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
  },
  reverseResultHeader: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  reverseResultTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  reverseResultContent: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  reverseResultDrug: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  reverseResultPatient: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  reverseResultDose: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  reverseResultRange: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  reverseResultInfoCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  reverseResultInfoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  reverseResultInfoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  reverseResultWarningCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  reverseResultWarningTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#F44336',
    marginBottom: theme.spacing.md,
  },
  reverseResultWarningText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Original Result Styles
  resultContainer: {
    gap: theme.spacing.lg,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
  },
  resultHeader: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  resultTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  resultContent: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  patientInfo: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  preparationCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.emergency,
  },
  preparationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
    marginBottom: theme.spacing.md,
  },
  preparationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  dosageCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  dosageTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  dosageText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.xs,
  },
  dosageSubtext: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
  },
  pumpRateCard: {
    backgroundColor: '#FCE4EC',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  pumpRateTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#E91E63',
    marginBottom: theme.spacing.md,
  },
  pumpRateText: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: '#E91E63',
    marginBottom: theme.spacing.xs,
  },
  pumpRateSubtext: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  pumpInstructions: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  pumpInstructionsTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#E91E63',
    marginBottom: theme.spacing.sm,
  },
  pumpInstructionsText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  administrationCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  administrationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  administrationText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  monitoringCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  monitoringTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF9800',
    marginBottom: theme.spacing.md,
  },
  monitoringText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  stabilityCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  stabilityTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.md,
  },
  stabilityText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  resetButton: {
    backgroundColor: theme.colors.emergency,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  // Dopamine specific styles
  dopamineDosageCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  dopamineDosageTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#2196F3',
    marginBottom: theme.spacing.lg,
  },
  dopamineDoseSection: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  dopamineDoseHeader: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#2196F3',
    marginBottom: theme.spacing.sm,
  },
  dopamineDoseDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  dopamineDoseValue: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  dopaminePumpRate: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#E91E63',
    backgroundColor: '#FCE4EC',
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  // Noradrenalina formulation selector styles
  formulationSelector: {
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formulationSelectorTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  formulationOption: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formulationOptionSelected: {
    borderColor: '#F44336',
    borderWidth: 2,
    backgroundColor: '#FFEBEE',
  },
  formulationOptionText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  formulationOptionTextSelected: {
    color: '#F44336',
  },
  formulationOptionDescription: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  // Slider styles
  sliderCard: {
    backgroundColor: '#F3E5F5',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#673AB7',
    marginTop: theme.spacing.lg,
  },
  sliderTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#673AB7',
    marginBottom: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sliderSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  sliderContainer: {
    marginTop: theme.spacing.md,
  },
  sliderLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: theme.spacing.md,
  },
  sliderValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sliderMinMax: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
  },
  sliderCurrent: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#673AB7',
    backgroundColor: 'white',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: '#673AB7',
    overflow: 'hidden',
  },
  doseDisplay: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    borderWidth: 1,
  },
  doseDisplayLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  doseDisplayValue: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    marginBottom: theme.spacing.sm,
  },
  doseWarning: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#F44336',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  doseSafe: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});
