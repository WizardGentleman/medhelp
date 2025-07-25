import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Droplets, Clock, Calculator, Info, TriangleAlert as AlertTriangle, Activity } from 'lucide-react-native';

interface FormData {
  volume: string;
  time: string;
  timeUnit: 'minutes' | 'hours';
  outputUnit: 'ml/h' | 'drops/min' | 'microdrops/min';
}

interface FormErrors {
  volume?: string;
  time?: string;
}

interface InfusionResult {
  inputVolume: number;
  inputTime: number;
  inputTimeUnit: string;
  outputUnit: string;
  calculatedRate: number;
  alternativeRates: {
    mlPerHour: number;
    dropsPerMin: number;
    microdropsPerMin: number;
  };
  infusionTime: {
    hours: number;
    minutes: number;
    totalMinutes: number;
  };
  recommendations: string[];
  safetyNotes: string[];
}

export default function TaxaInfusaoScreen() {
  const [formData, setFormData] = useState<FormData>({
    volume: '',
    time: '',
    timeUnit: 'hours',
    outputUnit: 'ml/h',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<InfusionResult | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate volume
    const volume = parseFloat(formData.volume.replace(',', '.'));
    if (!formData.volume) {
      newErrors.volume = 'Volume é obrigatório';
      isValid = false;
    } else if (isNaN(volume) || volume <= 0 || volume > 10000) {
      newErrors.volume = 'Volume deve estar entre 0,1 e 10000 mL';
      isValid = false;
    }

    // Validate time
    const time = parseFloat(formData.time.replace(',', '.'));
    if (!formData.time) {
      newErrors.time = 'Tempo é obrigatório';
      isValid = false;
    } else if (isNaN(time) || time <= 0) {
      newErrors.time = 'Tempo deve ser maior que 0';
      isValid = false;
    } else {
      // Additional validation based on time unit
      if (formData.timeUnit === 'minutes' && time > 1440) {
        newErrors.time = 'Tempo em minutos não deve exceder 1440 (24h)';
        isValid = false;
      } else if (formData.timeUnit === 'hours' && time > 168) {
        newErrors.time = 'Tempo em horas não deve exceder 168 (1 semana)';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateInfusionRate = (): InfusionResult => {
    const volume = parseFloat(formData.volume.replace(',', '.'));
    const time = parseFloat(formData.time.replace(',', '.'));

    // Convert everything to standard units (ml and hours)
    const volumeML = volume;
    const timeInHours = formData.timeUnit === 'minutes' ? time / 60 : time;
    const timeInMinutes = formData.timeUnit === 'minutes' ? time : time * 60;

    // Calculate base rate in ml/h
    const mlPerHour = volumeML / timeInHours;

    // Calculate drops per minute (standard drop factor = 20 drops/ml)
    const dropsPerMin = (volumeML * 20) / timeInMinutes;

    // Calculate microdrops per minute (microdrop factor = 60 microdrops/ml)
    const microdropsPerMin = (volumeML * 60) / timeInMinutes;

    // Get the requested output rate
    let calculatedRate: number;
    switch (formData.outputUnit) {
      case 'ml/h':
        calculatedRate = mlPerHour;
        break;
      case 'drops/min':
        calculatedRate = dropsPerMin;
        break;
      case 'microdrops/min':
        calculatedRate = microdropsPerMin;
        break;
      default:
        calculatedRate = mlPerHour;
    }

    // Calculate infusion time breakdown
    const totalMinutes = timeInMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    // Generate recommendations based on rate and volume
    const recommendations: string[] = [];
    const safetyNotes: string[] = [];

    // Rate-based recommendations
    if (mlPerHour > 500) {
      recommendations.push('Taxa de infusão alta - considerar bomba de infusão');
      safetyNotes.push('⚠️ Monitorar sinais de sobrecarga volêmica');
    } else if (mlPerHour < 10) {
      recommendations.push('Taxa de infusão muito baixa - usar bomba de infusão para precisão');
      safetyNotes.push('⚠️ Risco de obstrução do acesso venoso');
    } else if (mlPerHour <= 50) {
      recommendations.push('Taxa baixa - considerar bomba de infusão ou microgotas');
    }

    // Volume-based recommendations
    if (volume >= 1000) {
      recommendations.push('Grande volume - monitorar balanço hídrico');
      safetyNotes.push('📊 Controlar diurese e sinais vitais');
    }

    // Time-based recommendations
    if (timeInHours > 12) {
      recommendations.push('Infusão prolongada - verificar estabilidade da solução');
      safetyNotes.push('🔄 Trocar equipo a cada 24-72h conforme protocolo');
    } else if (timeInHours < 1) {
      recommendations.push('Infusão rápida - monitorar tolerância do paciente');
      safetyNotes.push('⚡ Observar reações adversas durante infusão');
    }

    // Equipment recommendations
    if (dropsPerMin > 60) {
      recommendations.push('Considerar bomba de infusão para maior precisão');
    } else if (dropsPerMin < 5) {
      recommendations.push('Taxa muito baixa para gotejamento - usar bomba de infusão');
    }

    // General safety notes
    safetyNotes.push(
      '✅ Verificar permeabilidade do acesso venoso',
      '🩺 Monitorar sinais vitais conforme protocolo',
      '📋 Registrar horário de início e término da infusão'
    );

    return {
      inputVolume: volume,
      inputTime: time,
      inputTimeUnit: formData.timeUnit === 'minutes' ? 'minutos' : 'horas',
      outputUnit: formData.outputUnit,
      calculatedRate,
      alternativeRates: {
        mlPerHour: mlPerHour,
        dropsPerMin: dropsPerMin,
        microdropsPerMin: microdropsPerMin,
      },
      infusionTime: {
        hours,
        minutes,
        totalMinutes: Math.round(totalMinutes),
      },
      recommendations,
      safetyNotes,
    };
  };

  const handleCalculate = () => {
    if (!validateForm()) return;
    const result = calculateInfusionRate();
    setResult(result);
  };

  const resetCalculator = () => {
    setFormData({
      volume: '',
      time: '',
      timeUnit: 'hours',
      outputUnit: 'ml/h',
    });
    setErrors({});
    setResult(null);
  };

  const renderTimeUnitButton = (unit: 'minutes' | 'hours', label: string) => (
    <TouchableOpacity
      style={[
        styles.unitButton,
        formData.timeUnit === unit && styles.unitButtonSelected
      ]}
      onPress={() => setFormData({ ...formData, timeUnit: unit })}
    >
      <Text style={[
        styles.unitButtonText,
        formData.timeUnit === unit && styles.unitButtonTextSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderOutputUnitButton = (unit: 'ml/h' | 'drops/min' | 'microdrops/min', label: string) => (
    <TouchableOpacity
      style={[
        styles.unitButton,
        formData.outputUnit === unit && styles.unitButtonSelected
      ]}
      onPress={() => setFormData({ ...formData, outputUnit: unit })}
    >
      <Text style={[
        styles.unitButtonText,
        formData.outputUnit === unit && styles.unitButtonTextSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const formatRate = (rate: number, unit: string): string => {
    if (unit === 'ml/h') {
      return rate.toFixed(1);
    } else {
      return rate.toFixed(0);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Taxa de Infusão" type="calculator" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Droplets size={20} color={theme.colors.calculator} /> Calculadora de Taxa de Infusão
            </Text>
            <Text style={styles.infoText}>
              Calcule a taxa de infusão em ml/h, gotas/min ou microgotas/min com base no volume e tempo desejados. 
              Inclui recomendações de segurança e monitoramento.
            </Text>
          </View>

          {!result ? (
            <>
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>
                  <Calculator size={20} color={theme.colors.calculator} /> Parâmetros da Infusão
                </Text>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Volume a ser infundido (mL)</Text>
                  <TextInput
                    style={[styles.input, errors.volume && styles.inputError]}
                    placeholder="Ex: 500"
                    keyboardType="decimal-pad"
                    value={formData.volume}
                    onChangeText={(value) => setFormData({ ...formData, volume: value })}
                  />
                  {errors.volume && (
                    <Text style={styles.errorText}>{errors.volume}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Tempo de infusão</Text>
                  <TextInput
                    style={[styles.input, errors.time && styles.inputError]}
                    placeholder="Ex: 8"
                    keyboardType="decimal-pad"
                    value={formData.time}
                    onChangeText={(value) => setFormData({ ...formData, time: value })}
                  />
                  {errors.time && (
                    <Text style={styles.errorText}>{errors.time}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Unidade de tempo</Text>
                  <View style={styles.unitButtonsContainer}>
                    {renderTimeUnitButton('minutes', 'Minutos')}
                    {renderTimeUnitButton('hours', 'Horas')}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Resultado desejado</Text>
                  <View style={styles.outputUnitsContainer}>
                    {renderOutputUnitButton('ml/h', 'ml/h')}
                    {renderOutputUnitButton('drops/min', 'gotas/min')}
                    {renderOutputUnitButton('microdrops/min', 'microgotas/min')}
                  </View>
                </View>
              </View>

              <View style={styles.conversionInfoCard}>
                <Text style={styles.conversionInfoTitle}>
                  <Info size={20} color="#4CAF50" /> Fatores de Conversão
                </Text>
                <Text style={styles.conversionInfoText}>
                  • <Text style={styles.conversionBold}>Macrogotas:</Text> 1 mL = 20 gotas{'\n'}
                  • <Text style={styles.conversionBold}>Microgotas:</Text> 1 mL = 60 microgotas{'\n'}
                  • <Text style={styles.conversionBold}>Bomba de infusão:</Text> Programada em ml/h
                </Text>
              </View>

              <TouchableOpacity
                style={styles.calculateButton}
                onPress={handleCalculate}
              >
                <Calculator size={20} color="white" />
                <Text style={styles.calculateButtonText}>Calcular Taxa</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.resultContainer}>
              {/* Main Result */}
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Droplets size={32} color={theme.colors.calculator} />
                  <Text style={styles.resultTitle}>Taxa Calculada</Text>
                </View>
                <View style={styles.resultContent}>
                  <Text style={styles.mainResultText}>
                    {formatRate(result.calculatedRate, result.outputUnit)} {result.outputUnit}
                  </Text>
                  <Text style={styles.inputSummaryText}>
                    {result.inputVolume} mL em {result.inputTime} {result.inputTimeUnit}
                  </Text>
                </View>
              </View>

              {/* Alternative Rates */}
              <View style={styles.alternativeRatesCard}>
                <Text style={styles.alternativeRatesTitle}>
                  <Activity size={20} color={theme.colors.calculator} /> Todas as Taxas de Infusão
                </Text>
                
                <View style={styles.rateRow}>
                  <Text style={styles.rateLabel}>Bomba de infusão:</Text>
                  <Text style={styles.rateValue}>
                    {formatRate(result.alternativeRates.mlPerHour, 'ml/h')} ml/h
                  </Text>
                </View>
                
                <View style={styles.rateRow}>
                  <Text style={styles.rateLabel}>Macrogotas:</Text>
                  <Text style={styles.rateValue}>
                    {formatRate(result.alternativeRates.dropsPerMin, 'drops/min')} gotas/min
                  </Text>
                </View>
                
                <View style={styles.rateRow}>
                  <Text style={styles.rateLabel}>Microgotas:</Text>
                  <Text style={styles.rateValue}>
                    {formatRate(result.alternativeRates.microdropsPerMin, 'microdrops/min')} microgotas/min
                  </Text>
                </View>
              </View>

              {/* Infusion Time */}
              <View style={styles.timeCard}>
                <Text style={styles.timeTitle}>
                  <Clock size={20} color="#FF9800" /> Tempo de Infusão
                </Text>
                <Text style={styles.timeText}>
                  {result.infusionTime.hours > 0 && `${result.infusionTime.hours}h `}
                  {result.infusionTime.minutes > 0 && `${result.infusionTime.minutes}min`}
                </Text>
                <Text style={styles.timeSubtext}>
                  Total: {result.infusionTime.totalMinutes} minutos
                </Text>
              </View>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <View style={styles.recommendationsCard}>
                  <Text style={styles.recommendationsTitle}>
                    <Info size={20} color={theme.colors.calculator} /> Recomendações
                  </Text>
                  {result.recommendations.map((recommendation, index) => (
                    <Text key={index} style={styles.recommendationText}>
                      • {recommendation}
                    </Text>
                  ))}
                </View>
              )}

              {/* Safety Notes */}
              <View style={styles.safetyCard}>
                <Text style={styles.safetyTitle}>
                  <AlertTriangle size={20} color="#FF5722" /> Cuidados de Segurança
                </Text>
                {result.safetyNotes.map((note, index) => (
                  <Text key={index} style={styles.safetyText}>
                    {note}
                  </Text>
                ))}
              </View>

              {/* Clinical Guidelines */}
              <View style={styles.guidelinesCard}>
                <Text style={styles.guidelinesTitle}>
                  <Activity size={20} color="#4CAF50" /> Diretrizes Clínicas
                </Text>
                <Text style={styles.guidelinesText}>
                  <Text style={styles.guidelinesBold}>Indicações para bomba de infusão:</Text>{'\n'}
                  • Taxa {'<'} 50 ml/h ou {'>'} 500 ml/h{'\n'}
                  • Medicações de alta vigilância{'\n'}
                  • Pacientes pediátricos{'\n'}
                  • Necessidade de precisão rigorosa{'\n\n'}
                  
                  <Text style={styles.guidelinesBold}>Monitoramento obrigatório:</Text>{'\n'}
                  • Permeabilidade do acesso venoso{'\n'}
                  • Sinais de infiltração ou flebite{'\n'}
                  • Balanço hídrico{'\n'}
                  • Sinais vitais conforme protocolo
                </Text>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetCalculator}
              >
                <Text style={styles.resetButtonText}>Nova Calculação</Text>
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
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  formCard: {
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
  formTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
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
  unitButtonsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  outputUnitsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  unitButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    minWidth: 100,
  },
  unitButtonSelected: {
    backgroundColor: theme.colors.calculator,
    borderColor: theme.colors.calculator,
  },
  unitButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    textAlign: 'center',
  },
  unitButtonTextSelected: {
    color: 'white',
  },
  conversionInfoCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  conversionInfoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.md,
  },
  conversionInfoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  conversionBold: {
    fontFamily: 'Roboto-Bold',
  },
  calculateButton: {
    backgroundColor: theme.colors.calculator,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  calculateButtonText: {
    color: 'white',
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
    borderColor: theme.colors.calculator,
    overflow: 'hidden',
  },
  resultHeader: {
    backgroundColor: theme.colors.calculator,
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
  mainResultText: {
    fontSize: theme.fontSize.xxl,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.sm,
  },
  inputSummaryText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
  },
  alternativeRatesCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  alternativeRatesTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.lg,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rateLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  rateValue: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
  },
  timeCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF9800',
    alignItems: 'center',
  },
  timeTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF9800',
    marginBottom: theme.spacing.md,
  },
  timeText: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: '#FF9800',
    marginBottom: theme.spacing.sm,
  },
  timeSubtext: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
  },
  recommendationsCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  recommendationsTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  recommendationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  safetyCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  safetyTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF5722',
    marginBottom: theme.spacing.md,
  },
  safetyText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  guidelinesCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  guidelinesTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.md,
  },
  guidelinesText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  guidelinesBold: {
    fontFamily: 'Roboto-Bold',
  },
  resetButton: {
    backgroundColor: theme.colors.calculator,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
});