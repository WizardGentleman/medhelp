import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Calculator, ArrowLeftRight, Info, TriangleAlert as AlertTriangle, RotateCcw, Activity, Droplets } from 'lucide-react-native';

type ConversionType = 'mlh-mcgkgmin' | 'mlh-drops' | 'percent-mgml' | 'mlh-mcgmin' | 'mcgmin-mlh' | 'volume-mlh' | 'volume-percent-to-mass' | 'solution-mixture';

interface ConversionData {
  // ml/h ↔ mcg/kg/min
  weight?: string;
  concentration?: string;
  mlhValue?: string;
  mcgkgminValue?: string;
  
  // ml/h ↔ drops/min
  mlhDropsValue?: string;
  dropsValue?: string;
  dropFactor?: string;
  
  // % ↔ mg/ml
  percentValue?: string;
  mgmlValue?: string;
  
  // ml/h ↔ mcg/min
  mlhMcgValue?: string;
  mcgminValue?: string;
  concentrationMcg?: string;
  
  // Volume → ml/h
  volumeValue?: string;
  timeValue?: string;
  timeUnit?: 'hours' | 'minutes';
  
  // Volume + % → Massa
  volumeForMass?: string;
  percentForMass?: string;
  
  // Mistura de Soluções
  solution1Volume?: string;
  solution1Percent?: string;
  solution2Volume?: string;
  solution2Percent?: string;
  targetVolume?: string;
  targetPercent?: string;
}

interface ConversionResult {
  type: ConversionType;
  inputValue: number;
  outputValue: number;
  formula: string;
  warnings: string[];
  examples?: string[];
}

const commonSolutions = [
  { name: 'NaCl 0.9%', percent: 0.9, mgml: 9 },
  { name: 'Glicose 5%', percent: 5, mgml: 50 },
  { name: 'Glicose 10%', percent: 10, mgml: 100 },
  { name: 'NaCl 3%', percent: 3, mgml: 30 },
  { name: 'Lidocaína 1%', percent: 1, mgml: 10 },
  { name: 'Lidocaína 2%', percent: 2, mgml: 20 },
];

export default function ConcentracoesScreen() {
  const [activeConverter, setActiveConverter] = useState<ConversionType>('mlh-mcgkgmin');
  const [data, setData] = useState<ConversionData>({
    weight: '',
    concentration: '',
    mlhValue: '',
    mcgkgminValue: '',
    mlhDropsValue: '',
    dropsValue: '',
    dropFactor: '20',
    percentValue: '',
    mgmlValue: '',
    mlhMcgValue: '',
    mcgminValue: '',
    concentrationMcg: '',
    volumeValue: '',
    timeValue: '',
    timeUnit: 'hours',
    volumeForMass: '',
    percentForMass: '',
    solution1Volume: '',
    solution1Percent: '',
    solution2Volume: '',
    solution2Percent: '',
    targetVolume: '',
    targetPercent: ''
  });
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Função para formatar números com espaçamento a cada 3 dígitos
  const formatNumberWithSpacing = (value: number, decimals: number): string => {
    const formatted = value.toFixed(decimals);
    const [integerPart, decimalPart] = formatted.split('.');
    
    // Adiciona espaço a cada 3 dígitos da parte inteira
    const spacedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    
    return decimalPart ? `${spacedInteger}.${decimalPart}` : spacedInteger;
  };

  const validateInputs = (type: ConversionType): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    switch (type) {
      case 'mlh-mcgkgmin':
        if (!data.weight) {
          newErrors.weight = 'Peso é obrigatório';
          isValid = false;
        } else {
          const weight = parseFloat(data.weight.replace(',', '.'));
          if (isNaN(weight) || weight <= 0 || weight > 300) {
            newErrors.weight = 'Peso deve estar entre 0,1 e 300 kg';
            isValid = false;
          }
        }
        
        if (!data.concentration) {
          newErrors.concentration = 'Concentração é obrigatória';
          isValid = false;
        } else {
          const conc = parseFloat(data.concentration.replace(',', '.'));
          if (isNaN(conc) || conc <= 0 || conc > 1000) {
            newErrors.concentration = 'Concentração deve estar entre 0,1 e 1000 mg/ml';
            isValid = false;
          }
        }

        if (!data.mlhValue && !data.mcgkgminValue) {
          newErrors.input = 'Digite um valor para conversão';
          isValid = false;
        }

        if (data.mlhValue) {
          const mlh = parseFloat(data.mlhValue.replace(',', '.'));
          if (isNaN(mlh) || mlh < 0 || mlh > 999) {
            newErrors.mlhValue = 'ml/h deve estar entre 0 e 999';
            isValid = false;
          }
        }

        if (data.mcgkgminValue) {
          const mcg = parseFloat(data.mcgkgminValue.replace(',', '.'));
          if (isNaN(mcg) || mcg < 0 || mcg > 1000) {
            newErrors.mcgkgminValue = 'mcg/kg/min deve estar entre 0 e 1000';
            isValid = false;
          }
        }
        break;

      case 'mlh-drops':
        if (!data.mlhDropsValue && !data.dropsValue) {
          newErrors.input = 'Digite um valor para conversão';
          isValid = false;
        }

        if (data.mlhDropsValue) {
          const mlh = parseFloat(data.mlhDropsValue.replace(',', '.'));
          if (isNaN(mlh) || mlh < 0 || mlh > 999) {
            newErrors.mlhDropsValue = 'ml/h deve estar entre 0 e 999';
            isValid = false;
          }
        }

        if (data.dropsValue) {
          const drops = parseFloat(data.dropsValue.replace(',', '.'));
          if (isNaN(drops) || drops < 0 || drops > 999) {
            newErrors.dropsValue = 'gotas/min deve estar entre 0 e 999';
            isValid = false;
          }
        }

        const dropFactor = parseFloat(data.dropFactor || '20');
        if (isNaN(dropFactor) || dropFactor <= 0 || dropFactor > 100) {
          newErrors.dropFactor = 'Fator de gotejamento deve estar entre 1 e 100';
          isValid = false;
        }
        break;

      case 'percent-mgml':
        if (!data.percentValue && !data.mgmlValue) {
          newErrors.input = 'Digite um valor para conversão';
          isValid = false;
        }

        if (data.percentValue) {
          const percent = parseFloat(data.percentValue.replace(',', '.'));
          if (isNaN(percent) || percent < 0.1 || percent > 100) {
            newErrors.percentValue = 'Porcentagem deve estar entre 0,1 e 100%';
            isValid = false;
          }
        }

        if (data.mgmlValue) {
          const mgml = parseFloat(data.mgmlValue.replace(',', '.'));
          if (isNaN(mgml) || mgml < 1 || mgml > 1000) {
            newErrors.mgmlValue = 'mg/ml deve estar entre 1 e 1000';
            isValid = false;
          }
        }
        break;

      case 'mlh-mcgmin':
        if (!data.concentrationMcg) {
          newErrors.concentrationMcg = 'Concentração é obrigatória';
          isValid = false;
        } else {
          const conc = parseFloat(data.concentrationMcg.replace(',', '.'));
          if (isNaN(conc) || conc <= 0 || conc > 1000) {
            newErrors.concentrationMcg = 'Concentração deve estar entre 0,1 e 1000 mg/ml';
            isValid = false;
          }
        }

        if (!data.mlhMcgValue && !data.mcgminValue) {
          newErrors.input = 'Digite um valor para conversão';
          isValid = false;
        }

        if (data.mlhMcgValue) {
          const mlh = parseFloat(data.mlhMcgValue.replace(',', '.'));
          if (isNaN(mlh) || mlh < 0 || mlh > 999) {
            newErrors.mlhMcgValue = 'ml/h deve estar entre 0 e 999';
            isValid = false;
          }
        }

        if (data.mcgminValue) {
          const mcg = parseFloat(data.mcgminValue.replace(',', '.'));
          if (isNaN(mcg) || mcg < 0 || mcg > 100000) {
            newErrors.mcgminValue = 'mcg/min deve estar entre 0 e 100000';
            isValid = false;
          }
        }
        break;

      case 'volume-mlh':
        if (!data.volumeValue) {
          newErrors.volumeValue = 'Volume é obrigatório';
          isValid = false;
        } else {
          const volume = parseFloat(data.volumeValue.replace(',', '.'));
          if (isNaN(volume) || volume <= 0 || volume > 10000) {
            newErrors.volumeValue = 'Volume deve estar entre 0,1 e 10000 ml';
            isValid = false;
          }
        }

        if (!data.timeValue) {
          newErrors.timeValue = 'Tempo é obrigatório';
          isValid = false;
        } else {
          const time = parseFloat(data.timeValue.replace(',', '.'));
          const maxTime = data.timeUnit === 'hours' ? 168 : 10080; // 7 dias em horas/minutos
          if (isNaN(time) || time <= 0 || time > maxTime) {
            const unit = data.timeUnit === 'hours' ? 'horas' : 'minutos';
            newErrors.timeValue = `Tempo deve estar entre 0,1 e ${maxTime} ${unit}`;
            isValid = false;
          }
        }
        break;

      case 'volume-percent-to-mass':
        if (!data.volumeForMass) {
          newErrors.volumeForMass = 'Volume é obrigatório';
          isValid = false;
        } else {
          const volume = parseFloat(data.volumeForMass.replace(',', '.'));
          if (isNaN(volume) || volume <= 0 || volume > 10000) {
            newErrors.volumeForMass = 'Volume deve estar entre 0,1 e 10000 ml';
            isValid = false;
          }
        }

        if (!data.percentForMass) {
          newErrors.percentForMass = 'Porcentagem é obrigatória';
          isValid = false;
        } else {
          const percent = parseFloat(data.percentForMass.replace(',', '.'));
          if (isNaN(percent) || percent < 0.1 || percent > 100) {
            newErrors.percentForMass = 'Porcentagem deve estar entre 0,1 e 100%';
            isValid = false;
          }
        }
        break;

      case 'solution-mixture':
        // Validação Solução 1
        if (!data.solution1Volume) {
          newErrors.solution1Volume = 'Volume da Solução 1 é obrigatório';
          isValid = false;
        } else {
          const vol1 = parseFloat(data.solution1Volume.replace(',', '.'));
          if (isNaN(vol1) || vol1 <= 0 || vol1 > 10000) {
            newErrors.solution1Volume = 'Volume deve estar entre 0,1 e 10000 ml';
            isValid = false;
          }
        }

        if (!data.solution1Percent) {
          newErrors.solution1Percent = 'Concentração da Solução 1 é obrigatória';
          isValid = false;
        } else {
          const perc1 = parseFloat(data.solution1Percent.replace(',', '.'));
          if (isNaN(perc1) || perc1 < 0.1 || perc1 > 100) {
            newErrors.solution1Percent = 'Concentração deve estar entre 0,1 e 100%';
            isValid = false;
          }
        }

        // Validação Solução 2
        if (!data.solution2Volume) {
          newErrors.solution2Volume = 'Volume da Solução 2 é obrigatório';
          isValid = false;
        } else {
          const vol2 = parseFloat(data.solution2Volume.replace(',', '.'));
          if (isNaN(vol2) || vol2 <= 0 || vol2 > 10000) {
            newErrors.solution2Volume = 'Volume deve estar entre 0,1 e 10000 ml';
            isValid = false;
          }
        }

        if (!data.solution2Percent) {
          newErrors.solution2Percent = 'Concentração da Solução 2 é obrigatória';
          isValid = false;
        } else {
          const perc2 = parseFloat(data.solution2Percent.replace(',', '.'));
          if (isNaN(perc2) || perc2 < 0.1 || perc2 > 100) {
            newErrors.solution2Percent = 'Concentração deve estar entre 0,1 e 100%';
            isValid = false;
          }
        }

        // Validação Solução Desejada
        if (!data.targetVolume) {
          newErrors.targetVolume = 'Volume desejado é obrigatório';
          isValid = false;
        } else {
          const targetVol = parseFloat(data.targetVolume.replace(',', '.'));
          if (isNaN(targetVol) || targetVol <= 0 || targetVol > 10000) {
            newErrors.targetVolume = 'Volume deve estar entre 0,1 e 10000 ml';
            isValid = false;
          }
        }

        if (!data.targetPercent) {
          newErrors.targetPercent = 'Concentração desejada é obrigatória';
          isValid = false;
        } else {
          const targetPerc = parseFloat(data.targetPercent.replace(',', '.'));
          if (isNaN(targetPerc) || targetPerc < 0.1 || targetPerc > 100) {
            newErrors.targetPercent = 'Concentração deve estar entre 0,1 e 100%';
            isValid = false;
          }
        }

        // Validação lógica adicional
        if (data.solution1Percent && data.solution2Percent && data.targetPercent) {
          const perc1 = parseFloat(data.solution1Percent.replace(',', '.'));
          const perc2 = parseFloat(data.solution2Percent.replace(',', '.'));
          const targetPerc = parseFloat(data.targetPercent.replace(',', '.'));
          
          if (perc1 === perc2) {
            newErrors.solution2Percent = 'As duas soluções devem ter concentrações diferentes';
            isValid = false;
          }
          
          if (targetPerc <= Math.min(perc1, perc2) || targetPerc >= Math.max(perc1, perc2)) {
            newErrors.targetPercent = 'Concentração desejada deve estar entre as duas soluções';
            isValid = false;
          }
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateConversion = (type: ConversionType): ConversionResult => {
    const warnings: string[] = [];
    let inputValue: number;
    let outputValue: number;
    let formula: string;

    switch (type) {
      case 'mlh-mcgkgmin':
        const weight = parseFloat(data.weight!.replace(',', '.'));
        const concentration = parseFloat(data.concentration!.replace(',', '.'));
        
        if (data.mlhValue) {
          // ml/h → mcg/kg/min
          inputValue = parseFloat(data.mlhValue.replace(',', '.'));
          outputValue = (inputValue * concentration * 1000) / (weight * 60);
          formula = `(${inputValue} ml/h × ${concentration} mg/ml × 1000) ÷ (${weight} kg × 60 min) = ${outputValue.toFixed(2)} mcg/kg/min`;
        } else {
          // mcg/kg/min → ml/h
          inputValue = parseFloat(data.mcgkgminValue!.replace(',', '.'));
          outputValue = (inputValue * weight * 60) / (concentration * 1000);
          formula = `(${inputValue} mcg/kg/min × ${weight} kg × 60 min) ÷ (${concentration} mg/ml × 1000) = ${outputValue.toFixed(2)} ml/h`;
        }

        if (outputValue > 50 && data.mlhValue) {
          warnings.push('⚠️ Dose alta - verificar se está dentro da faixa terapêutica');
        }
        if (outputValue > 500 && data.mcgkgminValue) {
          warnings.push('⚠️ Taxa de infusão alta - considerar bomba de infusão');
        }
        break;

      case 'mlh-drops':
        const dropFactor = parseFloat(data.dropFactor || '20');
        
        if (data.mlhDropsValue) {
          // ml/h → drops/min
          inputValue = parseFloat(data.mlhDropsValue.replace(',', '.'));
          outputValue = (inputValue * dropFactor) / 60;
          formula = `(${inputValue} ml/h × ${dropFactor} gotas/ml) ÷ 60 min = ${Math.round(outputValue)} gotas/min`;
          outputValue = Math.round(outputValue);
        } else {
          // drops/min → ml/h
          inputValue = parseFloat(data.dropsValue!.replace(',', '.'));
          outputValue = (inputValue * 60) / dropFactor;
          formula = `(${inputValue} gotas/min × 60 min) ÷ ${dropFactor} gotas/ml = ${outputValue.toFixed(2)} ml/h`;
        }

        if (outputValue > 60 && data.mlhDropsValue) {
          warnings.push('⚠️ Gotejamento muito rápido - considerar bomba de infusão');
        }
        if (outputValue < 5 && data.mlhDropsValue) {
          warnings.push('⚠️ Gotejamento muito lento - verificar permeabilidade do acesso');
        }
        break;

      case 'percent-mgml':
        if (data.percentValue) {
          // % → mg/ml
          inputValue = parseFloat(data.percentValue.replace(',', '.'));
          outputValue = inputValue * 10;
          formula = `${inputValue}% × 10 = ${outputValue.toFixed(1)} mg/ml`;
        } else {
          // mg/ml → %
          inputValue = parseFloat(data.mgmlValue!.replace(',', '.'));
          outputValue = inputValue / 10;
          formula = `${inputValue} mg/ml ÷ 10 = ${outputValue.toFixed(1)}%`;
        }
        break;

      case 'mlh-mcgmin':
        const concMcg = parseFloat(data.concentrationMcg!.replace(',', '.'));
        
        if (data.mlhMcgValue) {
          // ml/h → mcg/min
          inputValue = parseFloat(data.mlhMcgValue.replace(',', '.'));
          outputValue = (inputValue * concMcg * 1000) / 60;
          formula = `(${inputValue} ml/h × ${concMcg} mg/ml × 1000) ÷ 60 min = ${outputValue.toFixed(2)} mcg/min`;
        } else {
          // mcg/min → ml/h
          inputValue = parseFloat(data.mcgminValue!.replace(',', '.'));
          outputValue = (inputValue * 60) / (concMcg * 1000);
          formula = `(${inputValue} mcg/min × 60 min) ÷ (${concMcg} mg/ml × 1000) = ${outputValue.toFixed(2)} ml/h`;
        }

        if (outputValue > 10000 && data.mlhMcgValue) {
          warnings.push('⚠️ Dose muito alta - verificar cálculo e indicação clínica');
        }
        break;

      case 'volume-mlh':
        const volume = parseFloat(data.volumeValue!.replace(',', '.'));
        const time = parseFloat(data.timeValue!.replace(',', '.'));
        const timeUnit = data.timeUnit!;
        
        // Convert time to hours if needed
        const timeInHours = timeUnit === 'minutes' ? time / 60 : time;
        
        inputValue = volume;
        outputValue = volume / timeInHours;
        
        const timeText = timeUnit === 'hours' ? `${time} h` : `${time} min (${timeInHours.toFixed(2)} h)`;
        formula = `${volume} ml ÷ ${timeText} = ${outputValue.toFixed(2)} ml/h`;
        
        if (outputValue > 500) {
          warnings.push('⚠️ Taxa de infusão muito alta - considerar bomba de infusão');
        }
        if (outputValue < 5) {
          warnings.push('⚠️ Taxa de infusão muito baixa - verificar se é clinicamente apropriada');
        }
        if (timeInHours > 24) {
          warnings.push('⚠️ Tempo de infusão longo - monitorar hidratação e função renal');
        }
        break;

      case 'volume-percent-to-mass':
        const volumeForMass = parseFloat(data.volumeForMass!.replace(',', '.'));
        const percentForMass = parseFloat(data.percentForMass!.replace(',', '.'));
        
        // Calcula a massa da substância: volume × concentração / 100
        inputValue = volumeForMass;
        outputValue = (volumeForMass * percentForMass) / 100; // resultado em gramas
        
        formula = `${volumeForMass} ml × ${percentForMass}% ÷ 100 = ${outputValue.toFixed(3)} g`;
        
        if (outputValue > 100) {
          warnings.push('⚠️ Massa muito alta - verificar cálculo e dosagem');
        }
        if (outputValue < 0.001) {
          warnings.push('⚠️ Massa muito baixa - verificar se o cálculo está correto');
        }
        if (percentForMass > 50) {
          warnings.push('⚠️ Concentração muito alta - verificar se é possível na prática');
        }
        break;

      case 'solution-mixture':
        const sol1Vol = parseFloat(data.solution1Volume!.replace(',', '.'));
        const sol1Perc = parseFloat(data.solution1Percent!.replace(',', '.'));
        const sol2Vol = parseFloat(data.solution2Volume!.replace(',', '.'));
        const sol2Perc = parseFloat(data.solution2Percent!.replace(',', '.'));
        const targetVol = parseFloat(data.targetVolume!.replace(',', '.'));
        const targetPerc = parseFloat(data.targetPercent!.replace(',', '.'));
        
        // Usando sistema de equações para calcular as proporções
        // x = volume da solução 1 necessário
        // y = volume da solução 2 necessário
        // Equação 1: x + y = targetVol
        // Equação 2: (x * sol1Perc + y * sol2Perc) / targetVol = targetPerc
        
        // Resolvendo o sistema:
        // x = (targetVol * (targetPerc - sol2Perc)) / (sol1Perc - sol2Perc)
        // y = targetVol - x
        
        const volSol1Needed = (targetVol * (targetPerc - sol2Perc)) / (sol1Perc - sol2Perc);
        const volSol2Needed = targetVol - volSol1Needed;
        
        inputValue = targetVol;
        outputValue = volSol1Needed; // Volume da solução 1 necessário
        
        formula = `Sol.1: ${volSol1Needed.toFixed(1)}ml (${sol1Perc}%) + Sol.2: ${volSol2Needed.toFixed(1)}ml (${sol2Perc}%) = ${targetVol}ml (${targetPerc}%)`;
        
        // Verificações e avisos
        if (volSol1Needed < 0 || volSol2Needed < 0) {
          warnings.push('⚠️ Concentração desejada impossível com essas soluções');
        }
        if (volSol1Needed > sol1Vol) {
          warnings.push(`⚠️ Volume necessário da Solução 1 (${volSol1Needed.toFixed(1)}ml) excede o disponível (${sol1Vol}ml)`);
        }
        if (volSol2Needed > sol2Vol) {
          warnings.push(`⚠️ Volume necessário da Solução 2 (${volSol2Needed.toFixed(1)}ml) excede o disponível (${sol2Vol}ml)`);
        }
        if (Math.abs(targetPerc - ((volSol1Needed * sol1Perc + volSol2Needed * sol2Perc) / targetVol)) > 0.01) {
          warnings.push('⚠️ Verificar cálculo - pode haver imprecisão');
        }
        break;

      default:
        throw new Error('Tipo de conversão não suportado');
    }

    return {
      type,
      inputValue,
      outputValue,
      formula,
      warnings,
      examples: type === 'percent-mgml' ? commonSolutions.map(s => `${s.name}: ${s.percent}% = ${s.mgml} mg/ml`) : undefined
    };
  };

  const handleConvert = () => {
    if (!validateInputs(activeConverter)) return;
    const conversionResult = calculateConversion(activeConverter);
    setResult(conversionResult);
  };

  const clearFields = () => {
    setData({
      weight: '',
      concentration: '',
      mlhValue: '',
      mcgkgminValue: '',
      mlhDropsValue: '',
      dropsValue: '',
      dropFactor: '20',
      percentValue: '',
      mgmlValue: '',
      mlhMcgValue: '',
      mcgminValue: '',
      concentrationMcg: '',
      volumeValue: '',
      timeValue: '',
      timeUnit: 'hours',
      volumeForMass: '',
      percentForMass: '',
      solution1Volume: '',
      solution1Percent: '',
      solution2Volume: '',
      solution2Percent: '',
      targetVolume: '',
      targetPercent: ''
    });
    setResult(null);
    setErrors({});
  };

  const swapValues = () => {
    switch (activeConverter) {
      case 'mlh-mcgkgmin':
        setData(prev => ({
          ...prev,
          mlhValue: prev.mcgkgminValue || '',
          mcgkgminValue: prev.mlhValue || ''
        }));
        break;
      case 'mlh-drops':
        setData(prev => ({
          ...prev,
          mlhDropsValue: prev.dropsValue || '',
          dropsValue: prev.mlhDropsValue || ''
        }));
        break;
      case 'percent-mgml':
        setData(prev => ({
          ...prev,
          percentValue: prev.mgmlValue || '',
          mgmlValue: prev.percentValue || ''
        }));
        break;
      case 'mlh-mcgmin':
        setData(prev => ({
          ...prev,
          mlhMcgValue: prev.mcgminValue || '',
          mcgminValue: prev.mlhMcgValue || ''
        }));
        break;
    }
    setResult(null);
    setErrors({});
  };

  const renderConverterSelector = () => (
    <View style={styles.converterSelector}>
      <Text style={styles.selectorTitle}>Selecione o tipo de conversão:</Text>
      <View style={styles.converterButtons}>
        <TouchableOpacity
          style={[
            styles.converterButton,
            activeConverter === 'mlh-mcgkgmin' && styles.converterButtonSelected
          ]}
          onPress={() => {
            setActiveConverter('mlh-mcgkgmin');
            clearFields();
          }}
        >
          <Text style={[
            styles.converterButtonText,
            activeConverter === 'mlh-mcgkgmin' && styles.converterButtonTextSelected
          ]}>
            ml/h ↔ mcg/kg/min
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.converterButton,
            activeConverter === 'mlh-drops' && styles.converterButtonSelected
          ]}
          onPress={() => {
            setActiveConverter('mlh-drops');
            clearFields();
          }}
        >
          <Text style={[
            styles.converterButtonText,
            activeConverter === 'mlh-drops' && styles.converterButtonTextSelected
          ]}>
            ml/h ↔ gotas/min
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.converterButton,
            activeConverter === 'percent-mgml' && styles.converterButtonSelected
          ]}
          onPress={() => {
            setActiveConverter('percent-mgml');
            clearFields();
          }}
        >
          <Text style={[
            styles.converterButtonText,
            activeConverter === 'percent-mgml' && styles.converterButtonTextSelected
          ]}>
            % ↔ mg/ml
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.converterButton,
            activeConverter === 'mlh-mcgmin' && styles.converterButtonSelected
          ]}
          onPress={() => {
            setActiveConverter('mlh-mcgmin');
            clearFields();
          }}
        >
          <Text style={[
            styles.converterButtonText,
            activeConverter === 'mlh-mcgmin' && styles.converterButtonTextSelected
          ]}>
            ml/h ↔ mcg/min
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.converterButton,
            activeConverter === 'volume-mlh' && styles.converterButtonSelected
          ]}
          onPress={() => {
            setActiveConverter('volume-mlh');
            clearFields();
          }}
        >
          <Text style={[
            styles.converterButtonText,
            activeConverter === 'volume-mlh' && styles.converterButtonTextSelected
          ]}>
            Volume → ml/h
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.converterButton,
            activeConverter === 'volume-percent-to-mass' && styles.converterButtonSelected
          ]}
          onPress={() => {
            setActiveConverter('volume-percent-to-mass');
            clearFields();
          }}
        >
          <Text style={[
            styles.converterButtonText,
            activeConverter === 'volume-percent-to-mass' && styles.converterButtonTextSelected
          ]}>
            Vol. + % → Massa (g/mg/mcg)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.converterButton,
            activeConverter === 'solution-mixture' && styles.converterButtonSelected
          ]}
          onPress={() => {
            setActiveConverter('solution-mixture');
            clearFields();
          }}
        >
          <Text style={[
            styles.converterButtonText,
            activeConverter === 'solution-mixture' && styles.converterButtonTextSelected
          ]}>
            Mistura de Soluções
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMlhMcgkgminConverter = () => (
    <View style={styles.converterCard}>
      <Text style={styles.converterTitle}>
        <Calculator size={20} color="#9333EA" /> ml/h ↔ mcg/kg/min
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Peso do Paciente (kg)</Text>
        <TextInput
          style={[styles.input, errors.weight && styles.inputError]}
          placeholder="Ex: 70"
          placeholderTextColor="rgba(0, 0, 0, 0.3)"
          keyboardType="decimal-pad"
          value={data.weight || ''}
          onChangeText={(value) => setData({ ...data, weight: value })}
        />
        {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Concentração da Solução (mg/ml)</Text>
        <TextInput
          style={[styles.input, errors.concentration && styles.inputError]}
          placeholder="Ex: 1.0"
          placeholderTextColor="rgba(0, 0, 0, 0.3)"
          keyboardType="decimal-pad"
          value={data.concentration || ''}
          onChangeText={(value) => setData({ ...data, concentration: value })}
        />
        {errors.concentration && <Text style={styles.errorText}>{errors.concentration}</Text>}
      </View>

      <View style={styles.conversionRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ml/h</Text>
          <TextInput
            style={[styles.input, errors.mlhValue && styles.inputError]}
            placeholder="0"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            keyboardType="decimal-pad"
            value={data.mlhValue || ''}
            onChangeText={(value) => setData({ ...data, mlhValue: value, mcgkgminValue: '' })}
          />
        </View>

        <TouchableOpacity style={styles.swapButton} onPress={swapValues}>
          <ArrowLeftRight size={20} color="#9333EA" />
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>mcg/kg/min</Text>
          <TextInput
            style={[styles.input, errors.mcgkgminValue && styles.inputError]}
            placeholder="0"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            keyboardType="decimal-pad"
            value={data.mcgkgminValue || ''}
            onChangeText={(value) => setData({ ...data, mcgkgminValue: value, mlhValue: '' })}
          />
        </View>
      </View>

      {(errors.input || errors.mlhValue || errors.mcgkgminValue) && (
        <Text style={styles.errorText}>
          {errors.input || errors.mlhValue || errors.mcgkgminValue}
        </Text>
      )}
    </View>
  );

  const renderMlhDropsConverter = () => (
    <View style={styles.converterCard}>
      <Text style={styles.converterTitle}>
        <Droplets size={20} color="#9333EA" /> ml/h ↔ gotas/min
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Fator de Gotejamento (gotas/ml)</Text>
        <TextInput
          style={[styles.input, errors.dropFactor && styles.inputError]}
          placeholder="20"
          placeholderTextColor="rgba(0, 0, 0, 0.3)"
          keyboardType="decimal-pad"
          value={data.dropFactor || ''}
          onChangeText={(value) => setData({ ...data, dropFactor: value })}
        />
        <Text style={styles.helperText}>Padrão: 20 gotas/ml | Microgotas: 60 gotas/ml</Text>
        {errors.dropFactor && <Text style={styles.errorText}>{errors.dropFactor}</Text>}
      </View>

      <View style={styles.conversionRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ml/h</Text>
          <TextInput
            style={[styles.input, errors.mlhDropsValue && styles.inputError]}
            placeholder="0"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            keyboardType="decimal-pad"
            value={data.mlhDropsValue || ''}
            onChangeText={(value) => setData({ ...data, mlhDropsValue: value, dropsValue: '' })}
          />
        </View>

        <TouchableOpacity style={styles.swapButton} onPress={swapValues}>
          <ArrowLeftRight size={20} color="#9333EA" />
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>gotas/min</Text>
          <TextInput
            style={[styles.input, errors.dropsValue && styles.inputError]}
            placeholder="0"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            keyboardType="decimal-pad"
            value={data.dropsValue || ''}
            onChangeText={(value) => setData({ ...data, dropsValue: value, mlhDropsValue: '' })}
          />
        </View>
      </View>

      {(errors.input || errors.mlhDropsValue || errors.dropsValue) && (
        <Text style={styles.errorText}>
          {errors.input || errors.mlhDropsValue || errors.dropsValue}
        </Text>
      )}
    </View>
  );

  const renderPercentMgmlConverter = () => (
    <View style={styles.converterCard}>
      <Text style={styles.converterTitle}>
        <Activity size={20} color="#9333EA" /> % ↔ mg/ml
      </Text>
      
      <View style={styles.conversionRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Porcentagem (%)</Text>
          <TextInput
            style={[styles.input, errors.percentValue && styles.inputError]}
            placeholder="0.9"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            keyboardType="decimal-pad"
            value={data.percentValue || ''}
            onChangeText={(value) => setData({ ...data, percentValue: value, mgmlValue: '' })}
          />
        </View>

        <TouchableOpacity style={styles.swapButton} onPress={swapValues}>
          <ArrowLeftRight size={20} color="#9333EA" />
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>mg/ml</Text>
          <TextInput
            style={[styles.input, errors.mgmlValue && styles.inputError]}
            placeholder="9"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            keyboardType="decimal-pad"
            value={data.mgmlValue || ''}
            onChangeText={(value) => setData({ ...data, mgmlValue: value, percentValue: '' })}
          />
        </View>
      </View>

      {(errors.input || errors.percentValue || errors.mgmlValue) && (
        <Text style={styles.errorText}>
          {errors.input || errors.percentValue || errors.mgmlValue}
        </Text>
      )}

      <View style={styles.examplesCard}>
        <Text style={styles.examplesTitle}>Exemplos Comuns:</Text>
        {commonSolutions.map((solution, index) => (
          <Text key={index} style={styles.exampleText}>
            • {solution.name}: {solution.percent}% = {solution.mgml} mg/ml
          </Text>
        ))}
      </View>
    </View>
  );

  const renderMlhMcgminConverter = () => (
    <View style={styles.converterCard}>
      <Text style={styles.converterTitle}>
        <Calculator size={20} color="#9333EA" /> ml/h ↔ mcg/min
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Concentração da Solução (mg/ml)</Text>
        <TextInput
          style={[styles.input, errors.concentrationMcg && styles.inputError]}
          placeholder="Ex: 1.0"
          placeholderTextColor="rgba(0, 0, 0, 0.3)"
          keyboardType="decimal-pad"
          value={data.concentrationMcg || ''}
          onChangeText={(value) => setData({ ...data, concentrationMcg: value })}
        />
        {errors.concentrationMcg && <Text style={styles.errorText}>{errors.concentrationMcg}</Text>}
      </View>

      <View style={styles.conversionRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ml/h</Text>
          <TextInput
            style={[styles.input, errors.mlhMcgValue && styles.inputError]}
            placeholder="0"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            keyboardType="decimal-pad"
            value={data.mlhMcgValue || ''}
            onChangeText={(value) => setData({ ...data, mlhMcgValue: value, mcgminValue: '' })}
          />
        </View>

        <TouchableOpacity style={styles.swapButton} onPress={swapValues}>
          <ArrowLeftRight size={20} color="#9333EA" />
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>mcg/min</Text>
          <TextInput
            style={[styles.input, errors.mcgminValue && styles.inputError]}
            placeholder="0"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            keyboardType="decimal-pad"
            value={data.mcgminValue || ''}
            onChangeText={(value) => setData({ ...data, mcgminValue: value, mlhMcgValue: '' })}
          />
        </View>
      </View>

      {(errors.input || errors.mlhMcgValue || errors.mcgminValue) && (
        <Text style={styles.errorText}>
          {errors.input || errors.mlhMcgValue || errors.mcgminValue}
        </Text>
      )}
    </View>
  );

  const renderVolumeToMlhConverter = () => (
    <View style={styles.converterCard}>
      <Text style={styles.converterTitle}>
        <Activity size={20} color="#9333EA" /> Cálculo Volume → ml/h
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Volume a ser Infundido (ml)</Text>
        <TextInput
          style={[styles.input, errors.volumeValue && styles.inputError]}
          placeholder="Ex: 500"
          placeholderTextColor="rgba(0, 0, 0, 0.3)"
          keyboardType="decimal-pad"
          value={data.volumeValue || ''}
          onChangeText={(value) => setData({ ...data, volumeValue: value })}
        />
        {errors.volumeValue && <Text style={styles.errorText}>{errors.volumeValue}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tempo de Infusão</Text>
        <View style={styles.conversionRow}>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, errors.timeValue && styles.inputError]}
              placeholder="Ex: 8"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              keyboardType="decimal-pad"
              value={data.timeValue || ''}
              onChangeText={(value) => setData({ ...data, timeValue: value })}
            />
          </View>
          
          <View style={styles.timeUnitSelector}>
            <TouchableOpacity
              style={[
                styles.timeUnitButton,
                data.timeUnit === 'hours' && styles.timeUnitButtonSelected
              ]}
              onPress={() => setData({ ...data, timeUnit: 'hours' })}
            >
              <Text style={[
                styles.timeUnitButtonText,
                data.timeUnit === 'hours' && styles.timeUnitButtonTextSelected
              ]}>Horas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.timeUnitButton,
                data.timeUnit === 'minutes' && styles.timeUnitButtonSelected
              ]}
              onPress={() => setData({ ...data, timeUnit: 'minutes' })}
            >
              <Text style={[
                styles.timeUnitButtonText,
                data.timeUnit === 'minutes' && styles.timeUnitButtonTextSelected
              ]}>Minutos</Text>
            </TouchableOpacity>
          </View>
        </View>
        {errors.timeValue && <Text style={styles.errorText}>{errors.timeValue}</Text>}
      </View>

      <View style={styles.examplesCard}>
        <Text style={styles.examplesTitle}>Exemplos Comuns:</Text>
        <Text style={styles.exampleText}>
          • Soro fisiológico 500ml em 8h = 62,5 ml/h
        </Text>
        <Text style={styles.exampleText}>
          • Glicose 5% 1000ml em 12h = 83,3 ml/h
        </Text>
        <Text style={styles.exampleText}>
          • Ringer Lactato 250ml em 2h = 125 ml/h
        </Text>
      </View>
    </View>
  );

  const renderVolumePercentToMassConverter = () => (
    <View style={styles.converterCard}>
      <Text style={styles.converterTitle}>
        <Calculator size={20} color="#9333EA" /> Cálculo Volume + % → Massa
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Volume da Solução (ml)</Text>
        <TextInput
          style={[styles.input, errors.volumeForMass && styles.inputError]}
          placeholder="Ex: 10"
          placeholderTextColor="rgba(0, 0, 0, 0.3)"
          keyboardType="decimal-pad"
          value={data.volumeForMass || ''}
          onChangeText={(value) => setData({ ...data, volumeForMass: value })}
        />
        {errors.volumeForMass && <Text style={styles.errorText}>{errors.volumeForMass}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Concentração Percentual (%)</Text>
        <TextInput
          style={[styles.input, errors.percentForMass && styles.inputError]}
          placeholder="Ex: 2"
          placeholderTextColor="rgba(0, 0, 0, 0.3)"
          keyboardType="decimal-pad"
          value={data.percentForMass || ''}
          onChangeText={(value) => setData({ ...data, percentForMass: value })}
        />
        {errors.percentForMass && <Text style={styles.errorText}>{errors.percentForMass}</Text>}
      </View>

      <View style={styles.examplesCard}>
        <Text style={styles.examplesTitle}>Exemplos de Uso:</Text>
        <Text style={styles.exampleText}>
          • Ampola de lidocaína 2% com 10ml = 0,2g (200mg)
        </Text>
        <Text style={styles.exampleText}>
          • Seringa de adrenalina 1% com 1ml = 0,01g (10mg)
        </Text>
        <Text style={styles.exampleText}>
          • Frasco de glicose 50% com 20ml = 10g (10000mg)
        </Text>
      </View>
    </View>
  );

  const renderSolutionMixtureConverter = () => (
    <View style={styles.converterCard}>
      <Text style={styles.converterTitle}>
        <Activity size={20} color="#9333EA" /> Mistura de Soluções
      </Text>
      
      {/* Solução 1 */}
      <View style={styles.solutionSection}>
        <Text style={styles.solutionLabel}>Solução 1 (Disponível)</Text>
        <View style={styles.conversionRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Volume (ml)</Text>
            <TextInput
              style={[styles.input, errors.solution1Volume && styles.inputError]}
              placeholder="Ex: 500"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              keyboardType="decimal-pad"
              value={data.solution1Volume || ''}
              onChangeText={(value) => setData({ ...data, solution1Volume: value })}
            />
            {errors.solution1Volume && <Text style={styles.errorText}>{errors.solution1Volume}</Text>}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Concentração (%)</Text>
            <TextInput
              style={[styles.input, errors.solution1Percent && styles.inputError]}
              placeholder="Ex: 5"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              keyboardType="decimal-pad"
              value={data.solution1Percent || ''}
              onChangeText={(value) => setData({ ...data, solution1Percent: value })}
            />
            {errors.solution1Percent && <Text style={styles.errorText}>{errors.solution1Percent}</Text>}
          </View>
        </View>
      </View>

      {/* Solução 2 */}
      <View style={styles.solutionSection}>
        <Text style={styles.solutionLabel}>Solução 2 (Disponível)</Text>
        <View style={styles.conversionRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Volume (ml)</Text>
            <TextInput
              style={[styles.input, errors.solution2Volume && styles.inputError]}
              placeholder="Ex: 10"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              keyboardType="decimal-pad"
              value={data.solution2Volume || ''}
              onChangeText={(value) => setData({ ...data, solution2Volume: value })}
            />
            {errors.solution2Volume && <Text style={styles.errorText}>{errors.solution2Volume}</Text>}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Concentração (%)</Text>
            <TextInput
              style={[styles.input, errors.solution2Percent && styles.inputError]}
              placeholder="Ex: 50"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              keyboardType="decimal-pad"
              value={data.solution2Percent || ''}
              onChangeText={(value) => setData({ ...data, solution2Percent: value })}
            />
            {errors.solution2Percent && <Text style={styles.errorText}>{errors.solution2Percent}</Text>}
          </View>
        </View>
      </View>

      {/* Solução Desejada */}
      <View style={styles.targetSection}>
        <Text style={styles.targetLabel}>Solução Desejada</Text>
        <View style={styles.conversionRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Volume (ml)</Text>
            <TextInput
              style={[styles.input, errors.targetVolume && styles.inputError]}
              placeholder="Ex: 500"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              keyboardType="decimal-pad"
              value={data.targetVolume || ''}
              onChangeText={(value) => setData({ ...data, targetVolume: value })}
            />
            {errors.targetVolume && <Text style={styles.errorText}>{errors.targetVolume}</Text>}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Concentração (%)</Text>
            <TextInput
              style={[styles.input, errors.targetPercent && styles.inputError]}
              placeholder="Ex: 10"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              keyboardType="decimal-pad"
              value={data.targetPercent || ''}
              onChangeText={(value) => setData({ ...data, targetPercent: value })}
            />
            {errors.targetPercent && <Text style={styles.errorText}>{errors.targetPercent}</Text>}
          </View>
        </View>
      </View>

      <View style={styles.examplesCard}>
        <Text style={styles.examplesTitle}>Exemplos Práticos:</Text>
        <Text style={styles.exampleText}>
          • Glicose 5% (500ml) + Glicose 50% (10ml) = Glicose 10% (500ml)
        </Text>
        <Text style={styles.exampleText}>
          • NaCl 0.9% (500ml) + NaCl 20% (10ml) = NaCl 3% (500ml)
        </Text>
        <Text style={styles.exampleText}>
          • Resultado mostra quanto de cada solução usar
        </Text>
      </View>
    </View>
  );

  const renderActiveConverter = () => {
    switch (activeConverter) {
      case 'mlh-mcgkgmin':
        return renderMlhMcgkgminConverter();
      case 'mlh-drops':
        return renderMlhDropsConverter();
      case 'percent-mgml':
        return renderPercentMgmlConverter();
      case 'mlh-mcgmin':
        return renderMlhMcgminConverter();
      case 'volume-mlh':
        return renderVolumeToMlhConverter();
      case 'volume-percent-to-mass':
        return renderVolumePercentToMassConverter();
      case 'solution-mixture':
        return renderSolutionMixtureConverter();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Conversor de Concentrações" type="converter" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Calculator size={20} color="#9333EA" /> Conversor de Concentrações Médicas
            </Text>
            <Text style={styles.infoText}>
              Ferramenta para conversões bidirecionais entre diferentes unidades de concentração e 
              velocidades de infusão utilizadas na prática clínica.
            </Text>
          </View>

          {!result ? (
            <>
              {renderConverterSelector()}
              {renderActiveConverter()}

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.convertButton}
                  onPress={handleConvert}
                >
                  <Calculator size={20} color="white" />
                  <Text style={styles.convertButtonText}>Converter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearFields}
                >
                  <RotateCcw size={20} color="#9333EA" />
                  <Text style={styles.clearButtonText}>Limpar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.resultContainer}>
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Calculator size={32} color="#9333EA" />
                  <Text style={styles.resultTitle}>Resultado da Conversão</Text>
                </View>
                <View style={styles.resultContent}>
                  {result.type === 'volume-percent-to-mass' ? (
                    <>
                      <Text style={styles.resultValue}>
                        {result.outputValue.toFixed(result.outputValue < 1 ? 3 : 1)} g
                      </Text>
                      <Text style={styles.resultSubValue}>
                        {formatNumberWithSpacing(result.outputValue * 1000, result.outputValue < 1 ? 1 : 0)} mg
                      </Text>
                      <Text style={styles.resultSubValue}>
                        {formatNumberWithSpacing(result.outputValue * 1000000, 0)} mcg
                      </Text>
                    </>
                  ) : result.type === 'solution-mixture' ? (
                    <>
                      <Text style={styles.resultValue}>
                        Solução 1: {result.outputValue.toFixed(1)}ml ({data.solution1Percent}%)
                      </Text>
                      <Text style={styles.resultValue}>
                        Solução 2: {(parseFloat(data.targetVolume!) - result.outputValue).toFixed(1)}ml ({data.solution2Percent}%)
                      </Text>
                      <Text style={styles.resultSubValue}>
                        Total: {parseFloat(data.targetVolume!).toFixed(1)}ml ({data.targetPercent}%)
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.resultValue}>
                      {result.outputValue.toFixed(result.type === 'mlh-drops' && result.inputValue ? 0 : 2)}
                      {result.type === 'mlh-mcgkgmin' ? (data.mlhValue ? ' mcg/kg/min' : ' ml/h') :
                       result.type === 'mlh-drops' ? (data.mlhDropsValue ? ' gotas/min' : ' ml/h') :
                       result.type === 'percent-mgml' ? (data.percentValue ? ' mg/ml' : ' %') :
                       result.type === 'mlh-mcgmin' ? (data.mlhMcgValue ? ' mcg/min' : ' ml/h') :
                       result.type === 'volume-mlh' ? ' ml/h' : ''}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.formulaCard}>
                <Text style={styles.formulaTitle}>
                  <Info size={20} color="#9333EA" /> Fórmula Utilizada
                </Text>
                <Text style={styles.formulaText}>{result.formula}</Text>
              </View>

              {result.warnings.length > 0 && (
                <View style={styles.warningsCard}>
                  <Text style={styles.warningsTitle}>
                    <AlertTriangle size={20} color="#FF5722" /> Avisos
                  </Text>
                  {result.warnings.map((warning, index) => (
                    <Text key={index} style={styles.warningText}>
                      {warning}
                    </Text>
                  ))}
                </View>
              )}

              {result.examples && (
                <View style={styles.examplesCard}>
                  <Text style={styles.examplesTitle}>Exemplos de Referência:</Text>
                  {result.examples.map((example, index) => (
                    <Text key={index} style={styles.exampleText}>
                      • {example}
                    </Text>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.newConversionButton}
                onPress={() => setResult(null)}
              >
                <Text style={styles.newConversionButtonText}>Nova Conversão</Text>
              </TouchableOpacity>
            </View>
          )}
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
    backgroundColor: '#F3E8FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#9333EA',
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#9333EA',
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  converterSelector: {
    marginBottom: theme.spacing.lg,
  },
  selectorTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  converterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  converterButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  converterButtonSelected: {
    backgroundColor: '#9333EA',
    borderColor: '#9333EA',
  },
  converterButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    textAlign: 'center',
  },
  converterButtonTextSelected: {
    color: 'white',
  },
  converterCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  converterTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#9333EA',
    marginBottom: theme.spacing.lg,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
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
  helperText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  inputGroup: {
    flex: 1,
  },
  swapButton: {
    backgroundColor: '#F3E8FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#9333EA',
  },
  examplesCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  examplesTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.sm,
  },
  exampleText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  convertButton: {
    flex: 2,
    backgroundColor: '#9333EA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  convertButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  clearButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#9333EA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  clearButtonText: {
    color: '#9333EA',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  resultContainer: {
    gap: theme.spacing.lg,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: '#9333EA',
    overflow: 'hidden',
  },
  resultHeader: {
    backgroundColor: '#9333EA',
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
  resultValue: {
    fontSize: theme.fontSize.xxl,
    fontFamily: 'Roboto-Bold',
    color: '#9333EA',
    textAlign: 'center',
  },
  resultSubValue: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Medium',
    color: '#7C2D92',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  formulaCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#9333EA',
  },
  formulaTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#9333EA',
    marginBottom: theme.spacing.md,
  },
  formulaText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  warningsCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  warningsTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF5722',
    marginBottom: theme.spacing.md,
  },
  warningText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  newConversionButton: {
    backgroundColor: '#9333EA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  newConversionButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  timeUnitSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  timeUnitButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: theme.spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timeUnitButtonSelected: {
    backgroundColor: '#9333EA',
  },
  timeUnitButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  timeUnitButtonTextSelected: {
    color: 'white',
  },
  solutionSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  solutionLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#495057',
    marginBottom: theme.spacing.sm,
  },
  targetSection: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  targetLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.sm,
  },
});
