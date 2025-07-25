import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { TriangleAlert as AlertTriangle, Info, Heart, Activity, Zap } from 'lucide-react-native';

interface FormData {
  magnesiumLevel: string;
  hasSevereSymptoms: boolean | null;
  isHemodynamicallyUnstable: boolean | null;
  hasRenalInsufficiency: boolean | null;
  treatmentRoute: 'iv' | 'oral' | null;
  isOnDialysis: boolean | null;
}

interface FormErrors {
  magnesiumLevel?: string;
}

interface TreatmentResult {
  classification: string;
  classificationColor: string;
  treatment: string;
  preparation: string[];
  warnings: string[];
  monitoring: string[];
  isHypermagnesemia?: boolean;
}

interface HypermagnesemiaResult {
  classification: string;
  classificationColor: string;
  treatment: string;
  preparation: string[];
  warnings: string[];
  monitoring: string[];
  dialysisProtocol?: string;
}

export default function MagnesioScreen() {
  const [formData, setFormData] = useState<FormData>({
    magnesiumLevel: '',
    hasSevereSymptoms: null,
    isHemodynamicallyUnstable: null,
    hasRenalInsufficiency: null,
    treatmentRoute: null,
    isOnDialysis: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<TreatmentResult | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showDialysisQuestion, setShowDialysisQuestion] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const level = parseFloat(formData.magnesiumLevel.replace(',', '.'));
    if (!formData.magnesiumLevel) {
      newErrors.magnesiumLevel = 'Nível de magnésio é obrigatório';
      isValid = false;
    } else if (isNaN(level) || level < 0 || level > 10) {
      newErrors.magnesiumLevel = 'Nível deve estar entre 0 e 10 mg/dL';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const tratarHipermagnesemia = (nivelMagnesio: number): HypermagnesemiaResult => {
    try {
      // Validate input
      if (typeof nivelMagnesio !== 'number' || isNaN(nivelMagnesio)) {
        console.error('tratarHipermagnesemia: Invalid magnesium level provided', nivelMagnesio);
        throw new Error('Nível de magnésio inválido');
      }

      if (nivelMagnesio <= 2.6) {
        console.log('tratarHipermagnesemia: Magnesium level within normal range', nivelMagnesio);
        return {
          classification: 'Nível Normal',
          classificationColor: theme.colors.success,
          treatment: 'Nível de magnésio dentro da faixa normal para hipermagnesemia. Monitoramento de rotina.',
          preparation: [],
          warnings: ['Manter monitoramento conforme indicação clínica'],
          monitoring: ['Controle periódico dos níveis séricos']
        };
      }

      console.log('tratarHipermagnesemia: Processing hypermagnesemia case', nivelMagnesio);

      let treatment = '🚨 HIPERMAGNESEMIA CONFIRMADA';
      let preparation: string[] = [];
      let warnings: string[] = [];
      let monitoring: string[] = [];
      let dialysisProtocol = '';

      // Main treatment protocol
      treatment += '\n\n💊 ADMINISTRAÇÃO DE FUROSEMIDA:';
      treatment += '\n• Concentração: 20 mg/2 mL';
      treatment += '\n• Dosagem: 0,5-1 mg/kg';
      treatment += '\n• Dose usual: 40-80 mg EV a cada 4 horas';

      preparation.push(
        'Furosemida 20mg/2mL: Administrar 2-4 ampolas (40-80mg) EV',
        'Repetir a cada 4 horas conforme necessário',
        'Ajustar dose conforme peso: 0,5-1 mg/kg'
      );

      treatment += '\n\n💧 HIDRATAÇÃO:';
      treatment += '\n• Solução isotônica em conjunto com diurético de alça';
      treatment += '\n• Manter balanço hídrico adequado';

      preparation.push(
        'Soro Fisiológico 0,9% ou Ringer Lactato',
        'Volume conforme estado hídrico e função renal',
        'Monitorar balanço hídrico rigorosamente'
      );

      // Dialysis protocol for symptomatic patients
      if (formData.isOnDialysis) {
        treatment += '\n\n🩺 PROTOCOLO PARA PACIENTES EM HEMODIÁLISE SINTOMÁTICOS:';
        
        treatment += '\n\n🔹 GLUCONATO DE CÁLCIO 10%:';
        treatment += '\n• Concentração: 1 g/mL';
        treatment += '\n• Administração: 10 mg + Soro Glicosado 5% 100 mL IV';
        treatment += '\n• Tempo de infusão: 5-10 minutos';

        preparation.push(
          'Gluconato de Cálcio 10%: 1 ampola (10mL) em 100mL de SG 5%',
          'Infundir em 5-10 minutos sob monitorização cardíaca',
          'Pode repetir conforme necessário para estabilização'
        );

        treatment += '\n\n🔹 TRATAMENTO INICIAL:';
        treatment += '\n• Fluidos IV e diuréticos de alça (para pacientes não anúricos)';
        treatment += '\n• Monitorização cardíaca contínua';

        dialysisProtocol = 'Considerar diálise de emergência em casos graves com instabilidade hemodinâmica';
      }

      treatment += '\n\n⚠️ CONSIDERAR DIÁLISE:';
      treatment += '\n• Casos graves com instabilidade hemodinâmica';
      treatment += '\n• Falha do tratamento conservador';
      treatment += '\n• Sintomas neurológicos ou cardíacos severos';

      // Warnings
      warnings.push(
        '🚨 SINAIS DE HIPERMAGNESEMIA GRAVE: rubor facial, hipotensão, abolição de reflexos tendinosos',
        '💓 Monitorização cardíaca contínua obrigatória',
        '🧠 Observar alterações neurológicas: sonolência, confusão, depressão respiratória',
        '⚡ Risco de parada cardiorrespiratória em níveis muito elevados (>12 mg/dL)',
        '💊 Suspender imediatamente qualquer fonte exógena de magnésio'
      );

      if (formData.hasRenalInsufficiency) {
        warnings.push(
          '🔴 ATENÇÃO ESPECIAL: Paciente com insuficiência renal',
          '• Clearance de magnésio reduzido - maior risco de toxicidade',
          '• Considerar diálise precocemente',
          '• Ajustar doses de diuréticos conforme função renal'
        );
      }

      // Monitoring
      monitoring.push(
        '📊 Dosagem de magnésio sérico a cada 2-4 horas inicialmente',
        '💓 Monitorização cardíaca contínua (ECG)',
        '🫁 Avaliação da função respiratória',
        '🧠 Exame neurológico seriado (reflexos tendinosos)',
        '💧 Controle rigoroso do balanço hídrico',
        '🩸 Eletrólitos completos (Ca, K, Na, P)',
        '🔬 Função renal (ureia, creatinina, diurese)',
        '🎯 Meta: reduzir magnésio para <2,6 mg/dL gradualmente'
      );

      console.log('tratarHipermagnesemia: Successfully generated treatment protocol');

      return {
        classification: 'Hipermagnesemia',
        classificationColor: '#D32F2F',
        treatment,
        preparation,
        warnings,
        monitoring,
        dialysisProtocol
      };

    } catch (error) {
      console.error('tratarHipermagnesemia: Error processing hypermagnesemia', error);
      throw new Error(`Erro ao processar hipermagnesemia: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const getMagnesiumClassification = (level: number) => {
    if (level > 2.6) {
      return {
        classification: 'Hipermagnesemia',
        color: '#D32F2F',
        needsTreatment: true,
        isHypermagnesemia: true
      };
    } else if (level > 1.7) {
      return {
        classification: 'Normal',
        color: theme.colors.success,
        needsTreatment: false,
        isHypermagnesemia: false
      };
    } else if (level >= 1.5) {
      return {
        classification: 'Hipomagnesemia Leve',
        color: '#FF9800',
        needsTreatment: true,
        isHypermagnesemia: false
      };
    } else if (level >= 1.0) {
      return {
        classification: 'Hipomagnesemia Moderada',
        color: '#FF5722',
        needsTreatment: true,
        isHypermagnesemia: false
      };
    } else {
      return {
        classification: 'Hipomagnesemia Severa',
        color: theme.colors.emergency,
        needsTreatment: true,
        isHypermagnesemia: false
      };
    }
  };

  const calculateTreatment = (): TreatmentResult => {
    const level = parseFloat(formData.magnesiumLevel.replace(',', '.'));
    const classification = getMagnesiumClassification(level);
    
    // Handle hypermagnesemia
    if (classification.isHypermagnesemia) {
      try {
        const hyperResult = tratarHipermagnesemia(level);
        return {
          ...hyperResult,
          isHypermagnesemia: true
        };
      } catch (error) {
        console.error('Error in hypermagnesemia treatment:', error);
        return {
          classification: 'Erro',
          classificationColor: theme.colors.error,
          treatment: `Erro ao calcular tratamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
          preparation: [],
          warnings: ['Verifique os dados inseridos e tente novamente'],
          monitoring: []
        };
      }
    }
    
    if (!classification.needsTreatment) {
      return {
        classification: classification.classification,
        classificationColor: classification.color,
        treatment: 'Nível de magnésio dentro da normalidade. Nenhuma correção é necessária com base neste valor.',
        preparation: [],
        warnings: ['Manter monitoramento conforme indicação clínica'],
        monitoring: []
      };
    }

    let treatment = '';
    let preparation: string[] = [];
    let warnings: string[] = [];
    let monitoring: string[] = [];

    // Warnings for renal insufficiency
    if (formData.hasRenalInsufficiency) {
      warnings.push('⚠️ ATENÇÃO: Paciente com insuficiência renal - doses devem ser reduzidas e monitoramento rigoroso para hipermagnesemia');
      if (formData.hasSevereSymptoms) {
        warnings.push('• TFG 15-30: Usar 2-4g de Sulfato de Magnésio IV lentamente em 4-12h');
      } else {
        warnings.push('• Paciente assintomático: Usar metade da dose oral recomendada');
      }
    }

    // Treatment based on symptoms and hemodynamic status
    if (formData.hasSevereSymptoms) {
      treatment = 'TRATAMENTO INTRAVENOSO COM MONITORIZAÇÃO CARDÍACA CONTÍNUA';
      
      if (formData.isHemodynamicallyUnstable) {
        // Hemodynamically unstable
        treatment += '\n\n🚨 PACIENTE HEMODINAMICAMENTE INSTÁVEL';
        treatment += '\n\nTratamento de Ataque (Bolus):';
        treatment += '\n• Administrar 1-2g de Sulfato de Magnésio IV em 2-15 minutos';
        
        preparation.push(
          'Opção 1 (Sulfato de Magnésio 10%): 10-20 mL IV em 2-15 minutos',
          'Opção 2 (Sulfato de Magnésio 50%): Diluir 2-4 mL em 100 mL de SG 5% ou SF 0,9% e administrar em 2-15 minutos'
        );
        
        treatment += '\n\nManutenção (após estabilização):';
        treatment += '\n• Infusão de 4-8g de Sulfato de Magnésio IV em 12-24 horas';
        
        preparation.push(
          'Manutenção - Opção 1: Adicionar 40-80 mL (Sulfato Mg 10%) em 500 mL de SG 5% ou SF 0,9% - infundir em 12-24h',
          'Manutenção - Opção 2: Adicionar 8-16 mL (Sulfato Mg 50%) em 500 mL de SG 5% ou SF 0,9% - infundir em 12-24h'
        );
        
      } else {
        // Hemodynamically stable with severe symptoms
        treatment += '\n\n💛 PACIENTE HEMODINAMICAMENTE ESTÁVEL';
        
        if (level < 1.0) {
          treatment += '\n\nTratamento de Ataque:';
          treatment += '\n• Administrar 1-2g de Sulfato de Magnésio IV em 30-60 minutos';
          
          preparation.push(
            'Ataque - Opção 1: 10-20 mL (Sulfato Mg 10%) IV em 30-60 minutos',
            'Ataque - Opção 2: Diluir 2-4 mL (Sulfato Mg 50%) em 100 mL de SG 5% ou SF 0,9% - administrar em 30-60 minutos'
          );
          
          treatment += '\n\nSeguido por Manutenção:';
          treatment += '\n• Infusão de 4-8g de Sulfato de Magnésio IV em 12-24 horas';
          
          preparation.push(
            'Manutenção - Opção 1: Adicionar 40-80 mL (Sulfato Mg 10%) em 500 mL de SG 5% ou SF 0,9% - infundir em 12-24h',
            'Manutenção - Opção 2: Adicionar 8-16 mL (Sulfato Mg 50%) em 500 mL de SG 5% ou SF 0,9% - infundir em 12-24h'
          );
        } else {
          treatment += '\n\nTratamento:';
          treatment += '\n• Administrar 4-8g de Sulfato de Magnésio IV em 12-24 horas';
          
          preparation.push(
            'Opção 1: Adicionar 40-80 mL (Sulfato Mg 10%) em 500 mL de SG 5% ou SF 0,9% - infundir em 12-24h',
            'Opção 2: Adicionar 8-16 mL (Sulfato Mg 50%) em 500 mL de SG 5% ou SF 0,9% - infundir em 12-24h'
          );
        }
      }
    } else {
      // Asymptomatic or minimal symptoms
      treatment = 'PACIENTE ASSINTOMÁTICO OU COM SINTOMAS MÍNIMOS';
      
      if (formData.treatmentRoute === 'oral') {
        treatment += '\n\n💊 TRATAMENTO ORAL (Preferencial em ambulatoriais):';
        treatment += '\n• 240-1000 mg de magnésio elementar por dia em doses divididas';
        treatment += '\n• Preferir preparações de liberação lenta (cloreto de magnésio, lactato de magnésio)';
        
        preparation.push(
          'Dose alvo: 240-1000 mg de magnésio elementar/dia',
          'Dividir em 2-3 doses para minimizar diarreia',
          'Formulações de liberação lenta são preferíveis'
        );
      } else {
        treatment += '\n\n💉 TRATAMENTO INTRAVENOSO (Comum em hospitalizados):';
        
        if (level < 1.0) {
          treatment += '\n• Administrar 4-8g de Sulfato de Magnésio IV em 12-24 horas';
          preparation.push(
            'Opção 1: Adicionar 40-80 mL (Sulfato Mg 10%) em 500 mL de SG 5% ou SF 0,9% - infundir em 12-24h',
            'Opção 2: Adicionar 8-16 mL (Sulfato Mg 50%) em 500 mL de SG 5% ou SF 0,9% - infundir em 12-24h'
          );
        } else if (level >= 1.0 && level <= 1.4) {
          treatment += '\n• Administrar 2-4g de Sulfato de Magnésio IV em 4-12 horas';
          preparation.push(
            'Opção 1: Adicionar 20-40 mL (Sulfato Mg 10%) em 250 mL de SG 5% ou SF 0,9% - infundir em 4-12h',
            'Opção 2: Adicionar 4-8 mL (Sulfato Mg 50%) em 250 mL de SG 5% ou SF 0,9% - infundir em 4-12h'
          );
        } else {
          treatment += '\n• Administrar 1-2g de Sulfato de Magnésio IV em 1-2 horas';
          preparation.push(
            'Opção 1: Adicionar 10-20 mL (Sulfato Mg 10%) em 100 mL de SG 5% ou SF 0,9% - infundir em 1-2h',
            'Opção 2: Adicionar 2-4 mL (Sulfato Mg 50%) em 100 mL de SG 5% ou SF 0,9% - infundir em 1-2h'
          );
        }
      }
    }

    // Standard monitoring and warnings
    monitoring.push(
      '📊 Medir magnésio sérico 6-12h após cada dose IV',
      '⏱️ Continuar reposição por 1-2 dias após normalização para repor estoques intracelulares',
      '💧 Até 50% do magnésio IV pode ser excretado na urina - infusões lentas são mais eficientes'
    );

    warnings.push(
      '🔍 Investigar e corrigir a causa subjacente da hipomagnesemia',
      '⚠️ Monitorar sinais de hipermagnesemia: rubor facial, hipotensão, abolição de reflexos'
    );

    return {
      classification: classification.classification,
      classificationColor: classification.color,
      treatment,
      preparation,
      warnings,
      monitoring
    };
  };

  const handleInitialSubmit = () => {
    if (!validateForm()) return;

    const level = parseFloat(formData.magnesiumLevel.replace(',', '.'));
    const classification = getMagnesiumClassification(level);

    if (!classification.needsTreatment) {
      const result = calculateTreatment();
      setResult(result);
    } else if (classification.isHypermagnesemia) {
      setShowDialysisQuestion(true);
      setShowQuestions(true);
    } else {
      setShowQuestions(true);
    }
  };

  const handleFinalSubmit = () => {
    const result = calculateTreatment();
    setResult(result);
  };

  const resetForm = () => {
    setFormData({
      magnesiumLevel: '',
      hasSevereSymptoms: null,
      isHemodynamicallyUnstable: null,
      hasRenalInsufficiency: null,
      treatmentRoute: null,
      isOnDialysis: null,
    });
    setErrors({});
    setResult(null);
    setShowQuestions(false);
    setShowDialysisQuestion(false);
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

  const level = parseFloat(formData.magnesiumLevel.replace(',', '.'));
  const isHypermagnesemia = !isNaN(level) && level > 2.6;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Distúrbios do Magnésio" type="emergency" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {!result ? (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nível de Magnésio Sérico (mg/dL)</Text>
                <TextInput
                  style={[styles.input, errors.magnesiumLevel && styles.inputError]}
                  keyboardType="decimal-pad"
                  value={formData.magnesiumLevel}
                  onChangeText={(value) => setFormData({ ...formData, magnesiumLevel: value })}
                  placeholder="Ex: 1.2"
                />
                {errors.magnesiumLevel && (
                  <Text style={styles.errorText}>{errors.magnesiumLevel}</Text>
                )}
              </View>

              {!showQuestions ? (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleInitialSubmit}
                >
                  <Text style={styles.submitButtonText}>Avaliar Nível</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <View style={styles.questionSection}>
                    {showDialysisQuestion && isHypermagnesemia && (
                      <View style={styles.questionContainer}>
                        <Text style={styles.questionTitle}>
                          <Zap size={20} color="#D32F2F" /> Paciente em hemodiálise?
                        </Text>
                        <Text style={styles.questionSubtitle}>
                          (necessário para protocolo específico de hipermagnesemia)
                        </Text>
                        <View style={styles.questionButtons}>
                          {renderQuestionButton(
                            true,
                            formData.isOnDialysis,
                            () => setFormData({ ...formData, isOnDialysis: true }),
                            'SIM',
                            '#D32F2F'
                          )}
                          {renderQuestionButton(
                            false,
                            formData.isOnDialysis,
                            () => setFormData({ ...formData, isOnDialysis: false }),
                            'NÃO',
                            '#D32F2F'
                          )}
                        </View>
                      </View>
                    )}

                    {!isHypermagnesemia && (
                      <>
                        <View style={styles.questionContainer}>
                          <Text style={styles.questionTitle}>
                            O paciente apresenta sintomas graves?
                          </Text>
                          <Text style={styles.questionSubtitle}>
                            (tetania, arritmias como Torsades de Pointes, convulsões, fraqueza severa)
                          </Text>
                          <View style={styles.questionButtons}>
                            {renderQuestionButton(
                              true,
                              formData.hasSevereSymptoms,
                              () => setFormData({ ...formData, hasSevereSymptoms: true }),
                              'SIM'
                            )}
                            {renderQuestionButton(
                              false,
                              formData.hasSevereSymptoms,
                              () => setFormData({ ...formData, hasSevereSymptoms: false }),
                              'NÃO'
                            )}
                          </View>
                        </View>

                        {formData.hasSevereSymptoms === true && (
                          <View style={styles.questionContainer}>
                            <Text style={styles.questionTitle}>
                              Paciente hemodinamicamente instável?
                            </Text>
                            <Text style={styles.questionSubtitle}>
                              (arritmia ventricular, Torsades de Pointes)
                            </Text>
                            <View style={styles.questionButtons}>
                              {renderQuestionButton(
                                true,
                                formData.isHemodynamicallyUnstable,
                                () => setFormData({ ...formData, isHemodynamicallyUnstable: true }),
                                'SIM'
                              )}
                              {renderQuestionButton(
                                false,
                                formData.isHemodynamicallyUnstable,
                                () => setFormData({ ...formData, isHemodynamicallyUnstable: false }),
                                'NÃO'
                              )}
                            </View>
                          </View>
                        )}

                        {formData.hasSevereSymptoms === false && (
                          <View style={styles.questionContainer}>
                            <Text style={styles.questionTitle}>
                              Preferência de via de administração:
                            </Text>
                            <View style={styles.questionButtons}>
                              {renderQuestionButton(
                                true,
                                formData.treatmentRoute === 'oral',
                                () => setFormData({ ...formData, treatmentRoute: 'oral' }),
                                'ORAL',
                                theme.colors.calculator
                              )}
                              {renderQuestionButton(
                                true,
                                formData.treatmentRoute === 'iv',
                                () => setFormData({ ...formData, treatmentRoute: 'iv' }),
                                'INTRAVENOSO',
                                theme.colors.emergency
                              )}
                            </View>
                          </View>
                        )}
                      </>
                    )}

                    <View style={styles.questionContainer}>
                      <Text style={styles.questionTitle}>
                        Paciente possui insuficiência renal?
                      </Text>
                      <Text style={styles.questionSubtitle}>
                        (doença renal aguda ou crônica)
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
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      (formData.hasRenalInsufficiency === null || 
                       (isHypermagnesemia && formData.isOnDialysis === null) ||
                       (!isHypermagnesemia && (
                         formData.hasSevereSymptoms === null || 
                         (formData.hasSevereSymptoms === true && formData.isHemodynamicallyUnstable === null) ||
                         (formData.hasSevereSymptoms === false && !formData.treatmentRoute)
                       ))) && styles.submitButtonDisabled
                    ]}
                    onPress={handleFinalSubmit}
                    disabled={
                      formData.hasRenalInsufficiency === null || 
                      (isHypermagnesemia && formData.isOnDialysis === null) ||
                      (!isHypermagnesemia && (
                        formData.hasSevereSymptoms === null || 
                        (formData.hasSevereSymptoms === true && formData.isHemodynamicallyUnstable === null) ||
                        (formData.hasSevereSymptoms === false && !formData.treatmentRoute)
                      ))
                    }
                  >
                    <Text style={styles.submitButtonText}>Gerar Prescrição</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <View style={styles.resultContainer}>
              <View style={[styles.classificationCard, { borderColor: result.classificationColor }]}>
                <Text style={[styles.classificationText, { color: result.classificationColor }]}>
                  {result.classification}
                </Text>
                {result.isHypermagnesemia && (
                  <Text style={styles.hypermagnesemiaSubtext}>
                    Nível: {formData.magnesiumLevel} mg/dL (Normal: 1.7-2.6 mg/dL)
                  </Text>
                )}
              </View>

              <View style={styles.treatmentCard}>
                <Text style={styles.treatmentTitle}>Prescrição</Text>
                <Text style={styles.treatmentText}>{result.treatment}</Text>
              </View>

              {result.preparation.length > 0 && (
                <View style={styles.preparationCard}>
                  <Text style={styles.preparationTitle}>
                    <Activity size={20} color={theme.colors.emergency} /> Preparação
                  </Text>
                  {result.preparation.map((prep, index) => (
                    <Text key={index} style={styles.preparationText}>• {prep}</Text>
                  ))}
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

              {result.monitoring.length > 0 && (
                <View style={styles.monitoringCard}>
                  <Text style={styles.monitoringTitle}>
                    <Info size={20} color={theme.colors.calculator} /> Monitoramento
                  </Text>
                  {result.monitoring.map((monitor, index) => (
                    <Text key={index} style={styles.monitoringText}>{monitor}</Text>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetForm}
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
  questionSection: {
    marginTop: theme.spacing.lg,
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
  submitButton: {
    backgroundColor: theme.colors.emergency,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
  },
  submitButtonText: {
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
    padding: theme.spacing.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  classificationText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
  },
  hypermagnesemiaSubtext: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
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
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
    marginBottom: theme.spacing.md,
  },
  treatmentText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 24,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  preparationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  monitoringText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: theme.colors.calculator,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  resetButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
});