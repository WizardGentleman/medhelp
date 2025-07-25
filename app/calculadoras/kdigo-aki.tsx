import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Droplets, Info, TriangleAlert as AlertTriangle, Activity, Clock, Beaker } from 'lucide-react-native';

interface FormData {
  currentCreatinine: string;
  baselineCreatinine: string;
  urineOutput: string;
  urineOutputPeriod: '6h' | '12h' | '24h' | null;
  weight: string;
  hasBaselineCreatinine: boolean;
  age: string;
  gender: 'male' | 'female' | null;
  race: 'black' | 'non-black' | null;
}

interface FormErrors {
  currentCreatinine?: string;
  baselineCreatinine?: string;
  urineOutput?: string;
  weight?: string;
  age?: string;
}

interface KDIGOResult {
  stage: 'No AKI' | 'Stage 1' | 'Stage 2' | 'Stage 3';
  stageColor: string;
  creatinineCriteria: string;
  urineOutputCriteria: string;
  finalStage: string;
  recommendations: string[];
  monitoring: string[];
  prognosis: string;
  estimatedBaseline?: number;
}

export default function KDIGOAKIScreen() {
  const [formData, setFormData] = useState<FormData>({
    currentCreatinine: '',
    baselineCreatinine: '',
    urineOutput: '',
    urineOutputPeriod: null,
    weight: '',
    hasBaselineCreatinine: true,
    age: '',
    gender: null,
    race: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<KDIGOResult | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate current creatinine
    const currentCr = parseFloat(formData.currentCreatinine.replace(',', '.'));
    if (!formData.currentCreatinine) {
      newErrors.currentCreatinine = 'Creatinina atual é obrigatória';
      isValid = false;
    } else if (isNaN(currentCr) || currentCr < 0.1 || currentCr > 30) {
      newErrors.currentCreatinine = 'Creatinina deve estar entre 0,1 e 30 mg/dL';
      isValid = false;
    }

    // Validate baseline creatinine if provided
    if (formData.hasBaselineCreatinine) {
      const baselineCr = parseFloat(formData.baselineCreatinine.replace(',', '.'));
      if (!formData.baselineCreatinine) {
        newErrors.baselineCreatinine = 'Creatinina basal é obrigatória';
        isValid = false;
      } else if (isNaN(baselineCr) || baselineCr < 0.1 || baselineCr > 30) {
        newErrors.baselineCreatinine = 'Creatinina basal deve estar entre 0,1 e 30 mg/dL';
        isValid = false;
      }
    } else {
      // If no baseline, validate age, gender, race for estimation
      const age = parseInt(formData.age);
      if (!formData.age) {
        newErrors.age = 'Idade é obrigatória para estimar creatinina basal';
        isValid = false;
      } else if (isNaN(age) || age < 18 || age > 120) {
        newErrors.age = 'Idade deve estar entre 18 e 120 anos';
        isValid = false;
      }

      if (!formData.gender) {
        newErrors.age = (newErrors.age || '') + ' Sexo é obrigatório para estimar creatinina basal';
        isValid = false;
      }

      if (!formData.race) {
        newErrors.age = (newErrors.age || '') + ' Raça é obrigatória para estimar creatinina basal';
        isValid = false;
      }
    }

    // Validate urine output if provided
    if (formData.urineOutput) {
      const urineOutput = parseFloat(formData.urineOutput.replace(',', '.'));
      const weight = parseFloat(formData.weight.replace(',', '.'));
      
      if (isNaN(urineOutput) || urineOutput < 0 || urineOutput > 10000) {
        newErrors.urineOutput = 'Débito urinário deve estar entre 0 e 10000 mL';
        isValid = false;
      }

      if (!formData.weight) {
        newErrors.weight = 'Peso é obrigatório para avaliar débito urinário';
        isValid = false;
      } else if (isNaN(weight) || weight < 30 || weight > 300) {
        newErrors.weight = 'Peso deve estar entre 30 e 300 kg';
        isValid = false;
      }

      if (!formData.urineOutputPeriod) {
        newErrors.urineOutput = (newErrors.urineOutput || '') + ' Período de coleta é obrigatório';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const estimateBaselineCreatinine = (): number => {
    // Using MDRD equation to estimate baseline creatinine for eGFR = 75 mL/min/1.73m²
    const age = parseInt(formData.age);
    const isFemale = formData.gender === 'female';
    const isBlack = formData.race === 'black';

    // MDRD: eGFR = 175 × (SCr)^-1.154 × (age)^-0.203 × (0.742 if female) × (1.212 if black)
    // Rearranging for SCr when eGFR = 75: SCr = (75 / (175 × age^-0.203 × gender_factor × race_factor))^(1/1.154)
    
    let factor = 175 * Math.pow(age, -0.203);
    if (isFemale) factor *= 0.742;
    if (isBlack) factor *= 1.212;
    
    const estimatedCr = Math.pow(75 / factor, 1 / 1.154);
    return Math.round(estimatedCr * 100) / 100; // Round to 2 decimal places
  };

  const calculateKDIGO = (): KDIGOResult => {
    const currentCr = parseFloat(formData.currentCreatinine.replace(',', '.'));
    let baselineCr: number;
    let estimatedBaseline: number | undefined;

    if (formData.hasBaselineCreatinine) {
      baselineCr = parseFloat(formData.baselineCreatinine.replace(',', '.'));
    } else {
      baselineCr = estimateBaselineCreatinine();
      estimatedBaseline = baselineCr;
    }

    // Calculate creatinine criteria
    const creatinineRatio = currentCr / baselineCr;
    const creatinineIncrease = currentCr - baselineCr;

    let creatinineStage = 'No AKI';
    let creatinineCriteria = '';

    if (creatinineIncrease >= 0.3 || creatinineRatio >= 1.5) {
      creatinineStage = 'Stage 1';
      creatinineCriteria = `Aumento ≥0,3 mg/dL ou ≥1,5x basal (${currentCr} vs ${baselineCr.toFixed(2)} mg/dL)`;
    }
    if (creatinineRatio >= 2.0) {
      creatinineStage = 'Stage 2';
      creatinineCriteria = `Aumento ≥2,0x basal (${creatinineRatio.toFixed(1)}x)`;
    }
    if (creatinineRatio >= 3.0 || currentCr >= 4.0) {
      creatinineStage = 'Stage 3';
      creatinineCriteria = `Aumento ≥3,0x basal (${creatinineRatio.toFixed(1)}x) ou creatinina ≥4,0 mg/dL`;
    }

    // Calculate urine output criteria
    let urineOutputStage = 'No AKI';
    let urineOutputCriteria = 'Não avaliado';

    if (formData.urineOutput && formData.weight && formData.urineOutputPeriod) {
      const urineOutput = parseFloat(formData.urineOutput.replace(',', '.'));
      const weight = parseFloat(formData.weight.replace(',', '.'));
      
      let urineOutputRate: number;
      
      switch (formData.urineOutputPeriod) {
        case '6h':
          urineOutputRate = urineOutput / (weight * 6);
          break;
        case '12h':
          urineOutputRate = urineOutput / (weight * 12);
          break;
        case '24h':
          urineOutputRate = urineOutput / (weight * 24);
          break;
        default:
          urineOutputRate = 0;
      }

      if (urineOutputRate < 0.5) {
        if (formData.urineOutputPeriod === '6h') {
          urineOutputStage = 'Stage 1';
          urineOutputCriteria = `<0,5 mL/kg/h por 6h (${urineOutputRate.toFixed(2)} mL/kg/h)`;
        } else if (formData.urineOutputPeriod === '12h') {
          urineOutputStage = 'Stage 2';
          urineOutputCriteria = `<0,5 mL/kg/h por 12h (${urineOutputRate.toFixed(2)} mL/kg/h)`;
        } else if (formData.urineOutputPeriod === '24h') {
          urineOutputStage = 'Stage 3';
          urineOutputCriteria = `<0,3 mL/kg/h por 24h (${urineOutputRate.toFixed(2)} mL/kg/h)`;
        }
      } else if (urineOutputRate < 0.3 && formData.urineOutputPeriod === '24h') {
        urineOutputStage = 'Stage 3';
        urineOutputCriteria = `<0,3 mL/kg/h por 24h (${urineOutputRate.toFixed(2)} mL/kg/h)`;
      } else {
        urineOutputCriteria = `${urineOutputRate.toFixed(2)} mL/kg/h - Normal`;
      }
    }

    // Determine final stage (highest of both criteria)
    const stages = ['No AKI', 'Stage 1', 'Stage 2', 'Stage 3'];
    const creatinineStageIndex = stages.indexOf(creatinineStage);
    const urineOutputStageIndex = stages.indexOf(urineOutputStage);
    const finalStageIndex = Math.max(creatinineStageIndex, urineOutputStageIndex);
    const finalStage = stages[finalStageIndex];

    // Get stage color
    const getStageColor = (stage: string) => {
      switch (stage) {
        case 'No AKI': return '#4CAF50';
        case 'Stage 1': return '#FF9800';
        case 'Stage 2': return '#FF5722';
        case 'Stage 3': return '#D32F2F';
        default: return theme.colors.text;
      }
    };

    // Get recommendations
    const getRecommendations = (stage: string): string[] => {
      switch (stage) {
        case 'No AKI':
          return [
            'Continuar monitoramento de rotina',
            'Manter hidratação adequada',
            'Evitar nefrotóxicos quando possível'
          ];
        case 'Stage 1':
          return [
            'Identificar e tratar causas reversíveis',
            'Otimizar volemia e perfusão renal',
            'Suspender medicações nefrotóxicas',
            'Monitorar creatinina e débito urinário diariamente',
            'Considerar consulta com nefrologista'
          ];
        case 'Stage 2':
          return [
            'Consulta urgente com nefrologista',
            'Investigação intensiva de causas reversíveis',
            'Monitoramento rigoroso de balanço hídrico',
            'Ajuste de doses de medicações',
            'Considerar biomarcadores de lesão renal'
          ];
        case 'Stage 3':
          return [
            'Consulta imediata com nefrologista',
            'Considerar terapia de substituição renal',
            'Monitoramento em UTI se necessário',
            'Controle rigoroso de eletrólitos e acidemia',
            'Preparação para diálise se indicada'
          ];
        default:
          return [];
      }
    };

    // Get monitoring recommendations
    const getMonitoring = (stage: string): string[] => {
      const baseMonitoring = [
        'Creatinina sérica diária',
        'Débito urinário horário',
        'Balanço hídrico',
        'Eletrólitos (Na, K, Cl, HCO3)',
        'Revisão de medicações'
      ];

      if (stage === 'Stage 2' || stage === 'Stage 3') {
        baseMonitoring.push(
          'Gasometria arterial',
          'Fósforo e cálcio',
          'Hemograma completo',
          'Ultrassom renal se indicado'
        );
      }

      if (stage === 'Stage 3') {
        baseMonitoring.push(
          'Preparação para acesso vascular',
          'Avaliação para diálise',
          'Monitoramento cardíaco contínuo'
        );
      }

      return baseMonitoring;
    };

    // Get prognosis
    const getPrognosis = (stage: string): string => {
      switch (stage) {
        case 'No AKI':
          return 'Função renal normal - prognóstico excelente';
        case 'Stage 1':
          return 'IRA leve - boa chance de recuperação com tratamento adequado';
        case 'Stage 2':
          return 'IRA moderada - recuperação possível, mas requer cuidados intensivos';
        case 'Stage 3':
          return 'IRA severa - alto risco de necessidade de diálise e mortalidade';
        default:
          return '';
      }
    };

    return {
      stage: finalStage as 'No AKI' | 'Stage 1' | 'Stage 2' | 'Stage 3',
      stageColor: getStageColor(finalStage),
      creatinineCriteria,
      urineOutputCriteria,
      finalStage,
      recommendations: getRecommendations(finalStage),
      monitoring: getMonitoring(finalStage),
      prognosis: getPrognosis(finalStage),
      estimatedBaseline
    };
  };

  const handleCalculate = () => {
    if (!validateForm()) return;
    const result = calculateKDIGO();
    setResult(result);
  };

  const resetCalculator = () => {
    setFormData({
      currentCreatinine: '',
      baselineCreatinine: '',
      urineOutput: '',
      urineOutputPeriod: null,
      weight: '',
      hasBaselineCreatinine: true,
      age: '',
      gender: null,
      race: null,
    });
    setErrors({});
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Injúria Renal Aguda (KDIGO)" type="calculator" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Droplets size={20} color={theme.colors.calculator} /> Classificação KDIGO para IRA
            </Text>
            <Text style={styles.infoText}>
              A classificação KDIGO (Kidney Disease: Improving Global Outcomes) é o padrão internacional para 
              diagnóstico e estadiamento da Injúria Renal Aguda, baseada em critérios de creatinina sérica e débito urinário.
            </Text>
          </View>

          {!result ? (
            <>
              {/* Creatinine Section */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                  <Beaker size={20} color={theme.colors.calculator} /> Critério de Creatinina
                </Text>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Creatinina Sérica Atual (mg/dL)</Text>
                  <TextInput
                    style={[styles.input, errors.currentCreatinine && styles.inputError]}
                    placeholder="Ex: 1.5"
                    keyboardType="decimal-pad"
                    value={formData.currentCreatinine}
                    onChangeText={(value) => setFormData({ ...formData, currentCreatinine: value })}
                  />
                  {errors.currentCreatinine && (
                    <Text style={styles.errorText}>{errors.currentCreatinine}</Text>
                  )}
                </View>

                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleLabel}>Creatinina basal conhecida?</Text>
                  <View style={styles.toggleButtons}>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        formData.hasBaselineCreatinine && styles.toggleButtonSelected
                      ]}
                      onPress={() => setFormData({ ...formData, hasBaselineCreatinine: true })}
                    >
                      <Text style={[
                        styles.toggleButtonText,
                        formData.hasBaselineCreatinine && styles.toggleButtonTextSelected
                      ]}>SIM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        !formData.hasBaselineCreatinine && styles.toggleButtonSelected
                      ]}
                      onPress={() => setFormData({ ...formData, hasBaselineCreatinine: false })}
                    >
                      <Text style={[
                        styles.toggleButtonText,
                        !formData.hasBaselineCreatinine && styles.toggleButtonTextSelected
                      ]}>NÃO</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {formData.hasBaselineCreatinine ? (
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Creatinina Sérica Basal (mg/dL)</Text>
                    <TextInput
                      style={[styles.input, errors.baselineCreatinine && styles.inputError]}
                      placeholder="Ex: 1.0"
                      keyboardType="decimal-pad"
                      value={formData.baselineCreatinine}
                      onChangeText={(value) => setFormData({ ...formData, baselineCreatinine: value })}
                    />
                    {errors.baselineCreatinine && (
                      <Text style={styles.errorText}>{errors.baselineCreatinine}</Text>
                    )}
                  </View>
                ) : (
                  <>
                    <Text style={styles.estimationNote}>
                      Para estimar a creatinina basal, precisamos dos seguintes dados:
                    </Text>
                    
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Idade (anos)</Text>
                      <TextInput
                        style={[styles.input, errors.age && styles.inputError]}
                        placeholder="Ex: 65"
                        keyboardType="numeric"
                        value={formData.age}
                        onChangeText={(value) => setFormData({ ...formData, age: value })}
                      />
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Sexo</Text>
                      <View style={styles.radioGroup}>
                        <TouchableOpacity
                          style={[
                            styles.radioButton,
                            formData.gender === 'male' && styles.radioButtonSelected
                          ]}
                          onPress={() => setFormData({ ...formData, gender: 'male' })}
                        >
                          <Text style={[
                            styles.radioText,
                            formData.gender === 'male' && styles.radioTextSelected
                          ]}>Masculino</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.radioButton,
                            formData.gender === 'female' && styles.radioButtonSelected
                          ]}
                          onPress={() => setFormData({ ...formData, gender: 'female' })}
                        >
                          <Text style={[
                            styles.radioText,
                            formData.gender === 'female' && styles.radioTextSelected
                          ]}>Feminino</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Raça</Text>
                      <View style={styles.radioGroup}>
                        <TouchableOpacity
                          style={[
                            styles.radioButton,
                            formData.race === 'black' && styles.radioButtonSelected
                          ]}
                          onPress={() => setFormData({ ...formData, race: 'black' })}
                        >
                          <Text style={[
                            styles.radioText,
                            formData.race === 'black' && styles.radioTextSelected
                          ]}>Negra</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.radioButton,
                            formData.race === 'non-black' && styles.radioButtonSelected
                          ]}
                          onPress={() => setFormData({ ...formData, race: 'non-black' })}
                        >
                          <Text style={[
                            styles.radioText,
                            formData.race === 'non-black' && styles.radioTextSelected
                          ]}>Não-negra</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {errors.age && (
                      <Text style={styles.errorText}>{errors.age}</Text>
                    )}
                  </>
                )}
              </View>

              {/* Urine Output Section */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                  <Clock size={20} color={theme.colors.calculator} /> Critério de Débito Urinário (Opcional)
                </Text>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Peso (kg)</Text>
                  <TextInput
                    style={[styles.input, errors.weight && styles.inputError]}
                    placeholder="Ex: 70"
                    keyboardType="decimal-pad"
                    value={formData.weight}
                    onChangeText={(value) => setFormData({ ...formData, weight: value })}
                  />
                  {errors.weight && (
                    <Text style={styles.errorText}>{errors.weight}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Débito Urinário Total (mL)</Text>
                  <TextInput
                    style={[styles.input, errors.urineOutput && styles.inputError]}
                    placeholder="Ex: 240"
                    keyboardType="decimal-pad"
                    value={formData.urineOutput}
                    onChangeText={(value) => setFormData({ ...formData, urineOutput: value })}
                  />
                  {errors.urineOutput && (
                    <Text style={styles.errorText}>{errors.urineOutput}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Período de Coleta</Text>
                  <View style={styles.periodButtons}>
                    {[
                      { value: '6h', label: '6 horas' },
                      { value: '12h', label: '12 horas' },
                      { value: '24h', label: '24 horas' }
                    ].map((period) => (
                      <TouchableOpacity
                        key={period.value}
                        style={[
                          styles.periodButton,
                          formData.urineOutputPeriod === period.value && styles.periodButtonSelected
                        ]}
                        onPress={() => setFormData({ ...formData, urineOutputPeriod: period.value as '6h' | '12h' | '24h' })}
                      >
                        <Text style={[
                          styles.periodButtonText,
                          formData.urineOutputPeriod === period.value && styles.periodButtonTextSelected
                        ]}>{period.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.calculateButton}
                onPress={handleCalculate}
              >
                <Text style={styles.calculateButtonText}>Calcular KDIGO</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.resultContainer}>
              <View style={[styles.resultCard, { borderColor: result.stageColor }]}>
                <View style={[styles.resultHeader, { backgroundColor: result.stageColor }]}>
                  <Activity size={32} color="white" />
                  <Text style={styles.resultTitle}>KDIGO {result.stage}</Text>
                </View>
                <View style={styles.resultContent}>
                  <Text style={styles.prognosisText}>{result.prognosis}</Text>
                </View>
              </View>

              {result.estimatedBaseline && (
                <View style={styles.estimationCard}>
                  <Text style={styles.estimationTitle}>
                    <Info size={20} color="#FF9800" /> Creatinina Basal Estimada
                  </Text>
                  <Text style={styles.estimationText}>
                    Creatinina basal estimada: {result.estimatedBaseline.toFixed(2)} mg/dL
                  </Text>
                  <Text style={styles.estimationNote}>
                    Baseada em eGFR = 75 mL/min/1.73m² usando equação MDRD
                  </Text>
                </View>
              )}

              <View style={styles.criteriaCard}>
                <Text style={styles.criteriaTitle}>
                  <Beaker size={20} color={theme.colors.calculator} /> Critérios Avaliados
                </Text>
                <View style={styles.criteriaItem}>
                  <Text style={styles.criteriaLabel}>Creatinina:</Text>
                  <Text style={styles.criteriaValue}>{result.creatinineCriteria}</Text>
                </View>
                <View style={styles.criteriaItem}>
                  <Text style={styles.criteriaLabel}>Débito Urinário:</Text>
                  <Text style={styles.criteriaValue}>{result.urineOutputCriteria}</Text>
                </View>
              </View>

              <View style={styles.recommendationsCard}>
                <Text style={styles.recommendationsTitle}>
                  <AlertTriangle size={20} color="#FF5722" /> Recomendações Terapêuticas
                </Text>
                {result.recommendations.map((recommendation, index) => (
                  <Text key={index} style={styles.recommendationText}>
                    • {recommendation}
                  </Text>
                ))}
              </View>

              <View style={styles.monitoringCard}>
                <Text style={styles.monitoringTitle}>
                  <Clock size={20} color={theme.colors.calculator} /> Monitoramento
                </Text>
                {result.monitoring.map((monitor, index) => (
                  <Text key={index} style={styles.monitoringText}>
                    • {monitor}
                  </Text>
                ))}
              </View>

              <View style={styles.kdrigoInfoCard}>
                <Text style={styles.kdrigoInfoTitle}>
                  <Info size={20} color="#4CAF50" /> Critérios KDIGO para IRA
                </Text>
                <Text style={styles.kdrigoInfoSubtitle}>Estágio 1:</Text>
                <Text style={styles.kdrigoInfoText}>
                  • Creatinina: ↑≥0,3 mg/dL ou ≥1,5-1,9x basal{'\n'}
                  • Débito urinário: &lt;0,5 mL/kg/h por 6-12h
                </Text>
                <Text style={styles.kdrigoInfoSubtitle}>Estágio 2:</Text>
                <Text style={styles.kdrigoInfoText}>
                  • Creatinina: ≥2,0-2,9x basal{'\n'}
                  • Débito urinário: &lt;0,5 mL/kg/h por ≥12h
                </Text>
                <Text style={styles.kdrigoInfoSubtitle}>Estágio 3:</Text>
                <Text style={styles.kdrigoInfoText}>
                  • Creatinina: ≥3,0x basal ou ≥4,0 mg/dL{'\n'}
                  • Débito urinário: &lt;0,3 mL/kg/h por ≥24h ou anúria por ≥12h
                </Text>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetCalculator}
              >
                <Text style={styles.resetButtonText}>Nova Avaliação</Text>
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
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
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
  toggleContainer: {
    marginBottom: theme.spacing.lg,
  },
  toggleLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  toggleButtonSelected: {
    backgroundColor: theme.colors.calculator,
    borderColor: theme.colors.calculator,
  },
  toggleButtonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  toggleButtonTextSelected: {
    color: 'white',
  },
  estimationNote: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  radioButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: theme.colors.calculator,
    borderColor: theme.colors.calculator,
  },
  radioText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  radioTextSelected: {
    color: 'white',
  },
  periodButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  periodButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  periodButtonSelected: {
    backgroundColor: theme.colors.calculator,
    borderColor: theme.colors.calculator,
  },
  periodButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  periodButtonTextSelected: {
    color: 'white',
  },
  calculateButton: {
    backgroundColor: theme.colors.calculator,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
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
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  resultContent: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  prognosisText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  estimationCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  estimationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF9800',
    marginBottom: theme.spacing.md,
  },
  estimationText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  criteriaCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  criteriaTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  criteriaItem: {
    marginBottom: theme.spacing.sm,
  },
  criteriaLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  criteriaValue: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  recommendationsCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  recommendationsTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF5722',
    marginBottom: theme.spacing.md,
  },
  recommendationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  monitoringCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  monitoringTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  monitoringText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  kdrigoInfoCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  kdrigoInfoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.md,
  },
  kdrigoInfoSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  kdrigoInfoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
    marginBottom: theme.spacing.xs,
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