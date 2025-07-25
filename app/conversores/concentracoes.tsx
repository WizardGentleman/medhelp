import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Calculator, ArrowLeftRight, Info, TriangleAlert as AlertTriangle, RotateCcw, Activity, Droplets } from 'lucide-react-native';

type ConversionType = 'mlh-mcgkgmin' | 'mlh-drops' | 'percent-mgml' | 'mlh-mcgmin' | 'mcgmin-mlh';

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
    concentrationMcg: ''
  });
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      concentrationMcg: ''
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
                  <Text style={styles.resultValue}>
                    {result.outputValue.toFixed(result.type === 'mlh-drops' && result.inputValue ? 0 : 2)}
                    {result.type === 'mlh-mcgkgmin' ? (data.mlhValue ? ' mcg/kg/min' : ' ml/h') :
                     result.type === 'mlh-drops' ? (data.mlhDropsValue ? ' gotas/min' : ' ml/h') :
                     result.type === 'percent-mgml' ? (data.percentValue ? ' mg/ml' : ' %') :
                     result.type === 'mlh-mcgmin' ? (data.mlhMcgValue ? ' mcg/min' : ' ml/h') : ''}
                  </Text>
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
});