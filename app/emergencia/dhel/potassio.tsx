import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Zap, Info, TriangleAlert as AlertTriangle, Activity, Heart, Droplets, RotateCcw } from 'lucide-react-native';

interface FormData {
  potassiumLevel: string;
  hasSymptoms: boolean | null;
  accessType: 'peripheral' | 'central' | null;
  weight: string;
  hasRenalInsufficiency: boolean | null;
  isOnDialysis: boolean | null;
}

interface FormErrors {
  potassiumLevel?: string;
  weight?: string;
}

interface TreatmentResult {
  classification: string;
  classificationColor: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  treatment: string;
  kclPreparation?: string[];
  infusionRate?: string;
  maxConcentration?: string;
  monitoring: string[];
  warnings: string[];
  contraindications?: string[];
}

export default function PotassioScreen() {
  const [formData, setFormData] = useState<FormData>({
    potassiumLevel: '',
    hasSymptoms: null,
    accessType: null,
    weight: '',
    hasRenalInsufficiency: null,
    isOnDialysis: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<TreatmentResult | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const level = parseFloat(formData.potassiumLevel.replace(',', '.'));
    if (!formData.potassiumLevel) {
      newErrors.potassiumLevel = 'Nível de potássio é obrigatório';
      isValid = false;
    } else if (isNaN(level) || level < 1.0 || level > 10.0) {
      newErrors.potassiumLevel = 'Nível deve estar entre 1,0 e 10,0 mEq/L';
      isValid = false;
    }

    // Validate weight only for hypocalemia requiring IV treatment
    if (level < 3.5 && formData.hasSymptoms === true) {
      const weight = parseFloat(formData.weight.replace(',', '.'));
      if (!formData.weight) {
        newErrors.weight = 'Peso é obrigatório para cálculo da dose IV';
        isValid = false;
      } else if (isNaN(weight) || weight < 1 || weight > 300) {
        newErrors.weight = 'Peso deve estar entre 1 e 300 kg';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const getPotassiumClassification = (level: number) => {
    if (level >= 3.5 && level <= 5.0) {
      return {
        classification: 'Normal',
        color: '#4CAF50',
        severity: 'normal' as const,
        needsTreatment: false
      };
    } else if (level >= 3.0 && level < 3.5) {
      return {
        classification: 'Hipocalemia Leve',
        color: '#FF9800',
        severity: 'mild' as const,
        needsTreatment: true
      };
    } else if (level >= 2.5 && level < 3.0) {
      return {
        classification: 'Hipocalemia Moderada',
        color: '#FF5722',
        severity: 'moderate' as const,
        needsTreatment: true
      };
    } else if (level < 2.5) {
      return {
        classification: 'Hipocalemia Grave',
        color: '#D32F2F',
        severity: 'severe' as const,
        needsTreatment: true
      };
    } else if (level > 5.0 && level <= 5.5) {
      return {
        classification: 'Hipercalemia Leve',
        color: '#FF9800',
        severity: 'mild' as const,
        needsTreatment: true
      };
    } else if (level > 5.5 && level <= 6.5) {
      return {
        classification: 'Hipercalemia Moderada',
        color: '#FF5722',
        severity: 'moderate' as const,
        needsTreatment: true
      };
    } else {
      return {
        classification: 'Hipercalemia Grave',
        color: '#D32F2F',
        severity: 'severe' as const,
        needsTreatment: true
      };
    }
  };

  const calculateTreatment = (): TreatmentResult => {
    const level = parseFloat(formData.potassiumLevel.replace(',', '.'));
    const classification = getPotassiumClassification(level);
    const weight = formData.weight ? parseFloat(formData.weight.replace(',', '.')) : 70;

    let treatment = '';
    let kclPreparation: string[] = [];
    let infusionRate = '';
    let maxConcentration = '';
    let monitoring: string[] = [];
    let warnings: string[] = [];
    let contraindications: string[] = [];

    if (!classification.needsTreatment) {
      return {
        classification: classification.classification,
        classificationColor: classification.color,
        severity: classification.severity,
        treatment: 'Nível de potássio dentro da normalidade. Nenhuma correção é necessária.',
        monitoring: ['Monitoramento de rotina conforme indicação clínica'],
        warnings: ['Manter acompanhamento regular dos eletrólitos']
      };
    }

    // HIPOCALEMIA
    if (level < 3.5) {
      treatment = '🔸 TRATAMENTO DA HIPOCALEMIA\n\n';

      // Assintomático ou sintomas leves
      if (formData.hasSymptoms === false || formData.hasSymptoms === null) {
        treatment += '💊 REPOSIÇÃO ORAL (Primeira linha):\n';
        treatment += '• Cloreto de Potássio 600mg (8 mEq) - 2 a 4 comprimidos, 2-3x/dia\n';
        treatment += '• Dose total: 40-100 mEq/dia dividida em múltiplas doses\n';
        treatment += '• Administrar com alimentos para reduzir irritação gástrica\n\n';

        if (classification.severity === 'moderate' || classification.severity === 'severe') {
          treatment += '⚠️ CONSIDERAR VIA INTRAVENOSA se:\n';
          treatment += '• Intolerância à via oral\n';
          treatment += '• Necessidade de correção rápida\n';
          treatment += '• Hipocalemia grave (< 2,5 mEq/L)\n\n';
        }
      }

      // Sintomático ou grave
      if (formData.hasSymptoms === true || classification.severity === 'severe') {
        treatment += '💉 REPOSIÇÃO INTRAVENOSA:\n\n';

        // Cálculo da dose
        const deficitMEq = (3.5 - level) * weight * 0.4; // Déficit estimado
        const initialDose = Math.min(deficitMEq, 40); // Máximo 40 mEq inicialmente

        treatment += `📊 CÁLCULO DA DOSE:\n`;
        treatment += `• Déficit estimado: ${deficitMEq.toFixed(1)} mEq\n`;
        treatment += `• Dose inicial recomendada: ${initialDose.toFixed(1)} mEq\n\n`;

        // Preparação baseada no acesso
        if (formData.accessType === 'peripheral') {
          const volume = Math.max(100, initialDose * 10); // Mínimo 100ml, ideal 10ml por mEq
          const concentration = (initialDose / volume) * 1000; // mEq/L
          
          treatment += '🔹 ACESSO VENOSO PERIFÉRICO:\n';
          kclPreparation = [
            `KCl 10% (1,34 mEq/ml): ${(initialDose / 1.34).toFixed(1)} ml`,
            `Diluir em ${volume} ml de SF 0,9% ou SG 5%`,
            `Concentração final: ${concentration.toFixed(1)} mEq/L`
          ];
          
          maxConcentration = 'Máximo: 40 mEq/L (3 ml de KCl 10% em 100ml)';
          infusionRate = `Velocidade: ${Math.min(10, initialDose)} mEq/h (máximo 10 mEq/h)`;
          
          warnings.push('⚠️ Concentração máxima em acesso periférico: 40 mEq/L');
          warnings.push('⚠️ Velocidade máxima: 10 mEq/h para evitar flebite');
          
        } else if (formData.accessType === 'central') {
          const volume = Math.max(50, initialDose * 5); // Mínimo 50ml, ideal 5ml por mEq
          const concentration = (initialDose / volume) * 1000;
          
          treatment += '🔹 ACESSO VENOSO CENTRAL:\n';
          kclPreparation = [
            `KCl 10% (1,34 mEq/ml): ${(initialDose / 1.34).toFixed(1)} ml`,
            `Diluir em ${volume} ml de SF 0,9% ou SG 5%`,
            `Concentração final: ${concentration.toFixed(1)} mEq/L`
          ];
          
          maxConcentration = 'Máximo: 200 mEq/L (15 ml de KCl 10% em 100ml)';
          infusionRate = `Velocidade: ${Math.min(20, initialDose)} mEq/h (máximo 20 mEq/h)`;
          
          warnings.push('⚠️ Concentração máxima em acesso central: 200 mEq/L');
          warnings.push('⚠️ Velocidade máxima: 20 mEq/h');
        }

        treatment += '\n🔄 REPETIR DOSE:\n';
        treatment += '• Reavaliar potássio após 2-4 horas\n';
        treatment += '• Repetir dose conforme necessário\n';
        treatment += '• Máximo: 200 mEq/24h em casos graves\n\n';
      }

      // Considerações especiais
      if (formData.hasRenalInsufficiency) {
        warnings.push('⚠️ INSUFICIÊNCIA RENAL: Reduzir doses e monitorar rigorosamente');
        warnings.push('• Risco aumentado de hipercalemia de rebote');
      }

      // Monitoramento
      monitoring = [
        '📊 Potássio sérico a cada 2-4h durante reposição IV',
        '💓 Monitorização cardíaca contínua se K+ < 2,5 mEq/L',
        '🔬 Magnésio sérico (hipomagnesemia dificulta correção)',
        '🫁 Função renal (ureia, creatinina)',
        '📈 Gasometria arterial se acidose metabólica',
        '⚡ ECG para avaliar alterações cardíacas'
      ];

      warnings.push('🚨 NUNCA administrar KCl em bolus - risco de parada cardíaca');
      warnings.push('💡 Corrigir hipomagnesemia concomitante');
      warnings.push('🔍 Investigar e tratar causa subjacente');

    } else {
      // HIPERCALEMIA
      treatment = '🔸 TRATAMENTO DA HIPERCALEMIA\n\n';

      if (classification.severity === 'severe' || formData.hasSymptoms === true) {
        treatment += '🚨 TRATAMENTO DE EMERGÊNCIA:\n\n';
        
        treatment += '1️⃣ ESTABILIZAÇÃO CARDÍACA (se alterações no ECG):\n';
        treatment += '• Gluconato de Cálcio 10%: 10-20 ml IV em 2-5 min\n';
        treatment += '• Pode repetir em 5-10 min se necessário\n';
        treatment += '• Efeito em 1-3 min, duração 30-60 min\n\n';

        treatment += '2️⃣ REDISTRIBUIÇÃO INTRACELULAR:\n';
        treatment += '• Insulina Regular: 10 UI + Glicose 50% 25ml IV\n';
        treatment += '• Salbutamol: 10-20mg inalatório ou 0,5mg IV\n';
        treatment += '• Bicarbonato de Sódio: 50 mEq IV (se acidose)\n\n';

        treatment += '3️⃣ REMOÇÃO DO POTÁSSIO:\n';
        if (formData.isOnDialysis || formData.hasRenalInsufficiency) {
          treatment += '• Hemodiálise de emergência (mais efetiva)\n';
          treatment += '• Patiromer ou Zirconium ciclosilicato\n';
        } else {
          treatment += '• Furosemida: 40-80mg IV (se função renal normal)\n';
          treatment += '• Patiromer: 8,4g VO 1x/dia\n';
          treatment += '• Resinas quelantes (menos efetivas)\n';
        }

      } else {
        treatment += '💊 TRATAMENTO NÃO EMERGENCIAL:\n\n';
        treatment += '• Restrição dietética de potássio\n';
        treatment += '• Suspender medicações que aumentam K+\n';
        treatment += '• Diuréticos de alça se função renal normal\n';
        treatment += '• Patiromer ou Zirconium ciclosilicato\n';
      }

      // Monitoramento hipercalemia
      monitoring = [
        '📊 Potássio sérico a cada 1-2h durante tratamento agudo',
        '💓 Monitorização cardíaca contínua',
        '⚡ ECG seriado para avaliar alterações',
        '🍯 Glicemia (se usar insulina)',
        '🫁 Função renal',
        '🔬 Gasometria arterial'
      ];

      warnings.push('🚨 Risco de arritmias fatais - monitorização cardíaca obrigatória');
      warnings.push('⚠️ Gluconato de cálcio é temporário - tratar causa subjacente');
      warnings.push('🍯 Monitorar glicemia por 6h após insulina');

      contraindications = [
        'Gluconato de Cálcio: intoxicação digitálica',
        'Bicarbonato: alcalose metabólica',
        'Salbutamol: taquiarritmias'
      ];
    }

    return {
      classification: classification.classification,
      classificationColor: classification.color,
      severity: classification.severity,
      treatment,
      kclPreparation,
      infusionRate,
      maxConcentration,
      monitoring,
      warnings,
      contraindications
    };
  };

  const handleCalculate = () => {
    if (!validateForm()) return;
    const result = calculateTreatment();
    setResult(result);
  };

  const resetForm = () => {
    setFormData({
      potassiumLevel: '',
      hasSymptoms: null,
      accessType: null,
      weight: '',
      hasRenalInsufficiency: null,
      isOnDialysis: null,
    });
    setErrors({});
    setResult(null);
  };

  const renderQuestionButton = (
    value: boolean,
    currentValue: boolean | null,
    onPress: () => void,
    text: string,
    color: string = theme.colors.emergency
  ) => (
    <TouchableOpacity
      style={[
        styles.questionButton,
        currentValue === value && { backgroundColor: color, borderColor: color }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.questionButtonText,
        currentValue === value && { color: 'white' }
      ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  const level = parseFloat(formData.potassiumLevel.replace(',', '.'));
  const classification = !isNaN(level) ? getPotassiumClassification(level) : null;
  const isHypocalemia = !isNaN(level) && level < 3.5;
  const isHypercalemia = !isNaN(level) && level > 5.0;
  const needsIVTreatment = isHypocalemia && (formData.hasSymptoms === true || level < 2.5);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Distúrbios do Potássio" type="emergency" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Zap size={20} color={theme.colors.emergency} /> Avaliação dos Distúrbios do Potássio
            </Text>
            <Text style={styles.infoText}>
              Classificação automática e protocolo de tratamento baseado nos níveis séricos de potássio. 
              Valores normais: 3,5 - 5,0 mEq/L.
            </Text>
          </View>

          {!result ? (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nível de Potássio Sérico (mEq/L)</Text>
                <TextInput
                  style={[styles.input, errors.potassiumLevel && styles.inputError]}
                  keyboardType="decimal-pad"
                  value={formData.potassiumLevel}
                  onChangeText={(value) => setFormData({ ...formData, potassiumLevel: value })}
                  placeholder="Ex: 3.2"
                />
                {errors.potassiumLevel && (
                  <Text style={styles.errorText}>{errors.potassiumLevel}</Text>
                )}
                
                {classification && (
                  <View style={[styles.classificationPreview, { borderColor: classification.color }]}>
                    <Text style={[styles.classificationText, { color: classification.color }]}>
                      {classification.classification}
                    </Text>
                  </View>
                )}
              </View>

              {classification && classification.needsTreatment && (
                <>
                  <View style={styles.questionContainer}>
                    <Text style={styles.questionTitle}>
                      <Activity size={20} color={theme.colors.emergency} /> Paciente apresenta sintomas?
                    </Text>
                    <Text style={styles.questionSubtitle}>
                      {isHypocalemia ? 
                        'Hipocalemia: fraqueza muscular, câimbras, arritmias, paralisia' :
                        'Hipercalemia: fraqueza, parestesias, alterações no ECG, arritmias'
                      }
                    </Text>
                    <View style={styles.questionButtons}>
                      {renderQuestionButton(
                        true,
                        formData.hasSymptoms,
                        () => setFormData({ ...formData, hasSymptoms: true }),
                        'SIM'
                      )}
                      {renderQuestionButton(
                        false,
                        formData.hasSymptoms,
                        () => setFormData({ ...formData, hasSymptoms: false }),
                        'NÃO'
                      )}
                    </View>
                  </View>

                  {needsIVTreatment && (
                    <>
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Peso do Paciente (kg)</Text>
                        <TextInput
                          style={[styles.input, errors.weight && styles.inputError]}
                          keyboardType="decimal-pad"
                          value={formData.weight}
                          onChangeText={(value) => setFormData({ ...formData, weight: value })}
                          placeholder="Ex: 70"
                        />
                        {errors.weight && (
                          <Text style={styles.errorText}>{errors.weight}</Text>
                        )}
                      </View>

                      <View style={styles.questionContainer}>
                        <Text style={styles.questionTitle}>
                          <Droplets size={20} color={theme.colors.calculator} /> Tipo de Acesso Venoso
                        </Text>
                        <Text style={styles.questionSubtitle}>
                          Para administração de KCl 10% intravenoso
                        </Text>
                        <View style={styles.accessButtons}>
                          <TouchableOpacity
                            style={[
                              styles.accessButton,
                              formData.accessType === 'peripheral' && styles.accessButtonSelected
                            ]}
                            onPress={() => setFormData({ ...formData, accessType: 'peripheral' })}
                          >
                            <Text style={[
                              styles.accessButtonText,
                              formData.accessType === 'peripheral' && styles.accessButtonTextSelected
                            ]}>
                              Acesso Periférico
                            </Text>
                            <Text style={styles.accessButtonSubtext}>
                              Máx: 40 mEq/L{'\n'}10 mEq/h
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.accessButton,
                              formData.accessType === 'central' && styles.accessButtonSelected
                            ]}
                            onPress={() => setFormData({ ...formData, accessType: 'central' })}
                          >
                            <Text style={[
                              styles.accessButtonText,
                              formData.accessType === 'central' && styles.accessButtonTextSelected
                            ]}>
                              Acesso Central
                            </Text>
                            <Text style={styles.accessButtonSubtext}>
                              Máx: 200 mEq/L{'\n'}20 mEq/h
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  )}

                  <View style={styles.questionContainer}>
                    <Text style={styles.questionTitle}>
                      Paciente possui insuficiência renal?
                    </Text>
                    <View style={styles.questionButtons}>
                      {renderQuestionButton(
                        true,
                        formData.hasRenalInsufficiency,
                        () => setFormData({ ...formData, hasRenalInsufficiency: true }),
                        'SIM',
                        '#FF5722'
                      )}
                      {renderQuestionButton(
                        false,
                        formData.hasRenalInsufficiency,
                        () => setFormData({ ...formData, hasRenalInsufficiency: false }),
                        'NÃO',
                        theme.colors.success
                      )}
                    </View>
                  </View>

                  {isHypercalemia && (
                    <View style={styles.questionContainer}>
                      <Text style={styles.questionTitle}>
                        Paciente está em hemodiálise?
                      </Text>
                      <View style={styles.questionButtons}>
                        {renderQuestionButton(
                          true,
                          formData.isOnDialysis,
                          () => setFormData({ ...formData, isOnDialysis: true }),
                          'SIM',
                          '#FF5722'
                        )}
                        {renderQuestionButton(
                          false,
                          formData.isOnDialysis,
                          () => setFormData({ ...formData, isOnDialysis: false }),
                          'NÃO',
                          theme.colors.success
                        )}
                      </View>
                    </View>
                  )}
                </>
              )}

              <TouchableOpacity
                style={[
                  styles.calculateButton,
                  (!formData.potassiumLevel || 
                   (classification?.needsTreatment && formData.hasSymptoms === null) ||
                   (needsIVTreatment && (!formData.weight || !formData.accessType)) ||
                   formData.hasRenalInsufficiency === null ||
                   (isHypercalemia && formData.isOnDialysis === null)) && styles.calculateButtonDisabled
                ]}
                onPress={handleCalculate}
                disabled={
                  !formData.potassiumLevel || 
                  (classification?.needsTreatment && formData.hasSymptoms === null) ||
                  (needsIVTreatment && (!formData.weight || !formData.accessType)) ||
                  formData.hasRenalInsufficiency === null ||
                  (isHypercalemia && formData.isOnDialysis === null)
                }
              >
                <Text style={styles.calculateButtonText}>Gerar Protocolo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.resultContainer}>
              <View style={[styles.classificationCard, { borderColor: result.classificationColor }]}>
                <View style={[styles.classificationHeader, { backgroundColor: result.classificationColor }]}>
                  <Zap size={32} color="white" />
                  <Text style={styles.classificationTitle}>{result.classification}</Text>
                </View>
                <View style={styles.classificationContent}>
                  <Text style={styles.levelText}>
                    Nível: {formData.potassiumLevel} mEq/L (Normal: 3,5-5,0 mEq/L)
                  </Text>
                </View>
              </View>

              <View style={styles.treatmentCard}>
                <Text style={styles.treatmentTitle}>
                  <Heart size={20} color={theme.colors.emergency} /> Protocolo de Tratamento
                </Text>
                <Text style={styles.treatmentText}>{result.treatment}</Text>
              </View>

              {result.kclPreparation && result.kclPreparation.length > 0 && (
                <View style={styles.kclCard}>
                  <Text style={styles.kclTitle}>
                    <Droplets size={20} color={theme.colors.calculator} /> Preparo KCl 10%
                  </Text>
                  {result.kclPreparation.map((prep, index) => (
                    <Text key={index} style={styles.kclText}>• {prep}</Text>
                  ))}
                  {result.maxConcentration && (
                    <Text style={styles.kclConcentration}>{result.maxConcentration}</Text>
                  )}
                  {result.infusionRate && (
                    <Text style={styles.kclRate}>{result.infusionRate}</Text>
                  )}
                </View>
              )}

              {result.warnings.length > 0 && (
                <View style={styles.warningCard}>
                  <Text style={styles.warningTitle}>
                    <AlertTriangle size={20} color="#FF5722" /> Avisos Importantes
                  </Text>
                  {result.warnings.map((warning, index) => (
                    <Text key={index} style={styles.warningText}>{warning}</Text>
                  ))}
                </View>
              )}

              {result.contraindications && result.contraindications.length > 0 && (
                <View style={styles.contraindicationCard}>
                  <Text style={styles.contraindicationTitle}>
                    <AlertTriangle size={20} color="#D32F2F" /> Contraindicações
                  </Text>
                  {result.contraindications.map((contraindication, index) => (
                    <Text key={index} style={styles.contraindicationText}>• {contraindication}</Text>
                  ))}
                </View>
              )}

              <View style={styles.monitoringCard}>
                <Text style={styles.monitoringTitle}>
                  <Info size={20} color={theme.colors.calculator} /> Monitoramento
                </Text>
                {result.monitoring.map((monitor, index) => (
                  <Text key={index} style={styles.monitoringText}>{monitor}</Text>
                ))}
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetForm}
              >
                <RotateCcw size={20} color="white" />
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
  classificationPreview: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  classificationText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  questionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  questionSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  questionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  questionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  questionButtonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  accessButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  accessButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  accessButtonSelected: {
    backgroundColor: theme.colors.calculator,
    borderColor: theme.colors.calculator,
  },
  accessButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  accessButtonTextSelected: {
    color: 'white',
  },
  accessButtonSubtext: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  calculateButton: {
    backgroundColor: theme.colors.emergency,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
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
  resultContainer: {
    gap: theme.spacing.md,
  },
  classificationCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
  },
  classificationHeader: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  classificationTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  classificationContent: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  levelText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    textAlign: 'center',
  },
  treatmentCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.emergency,
  },
  treatmentTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
    marginBottom: theme.spacing.md,
  },
  treatmentText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  kclCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  kclTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  kclText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  kclConcentration: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#FF9800',
    marginTop: theme.spacing.sm,
  },
  kclRate: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginTop: theme.spacing.xs,
  },
  warningCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  warningTitle: {
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
    lineHeight: 18,
  },
  contraindicationCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
  contraindicationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#D32F2F',
    marginBottom: theme.spacing.md,
  },
  contraindicationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
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
    lineHeight: 18,
  },
  resetButton: {
    backgroundColor: theme.colors.calculator,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  resetButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
});