import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { CircleDot, Info, TriangleAlert as AlertTriangle, Activity, Heart, Droplets, RotateCcw } from 'lucide-react-native';

interface FormData {
  calciumLevel: string;
  calciumType: 'total' | 'ionized' | null;
  hasSymptoms: boolean | null;
  weight: string;
  hasRenalInsufficiency: boolean | null;
  hasCardiacDisease: boolean | null;
  isOnDigoxin: boolean | null;
  albumin?: string;
}

interface FormErrors {
  calciumLevel?: string;
  weight?: string;
  albumin?: string;
}

interface TreatmentResult {
  classification: string;
  classificationColor: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  treatment: string;
  preparation?: string[];
  infusionRate?: string;
  monitoring: string[];
  warnings: string[];
  contraindications?: string[];
  correctedCalcium?: number;
}

export default function CalcioScreen() {
  const [formData, setFormData] = useState<FormData>({
    calciumLevel: '',
    calciumType: null,
    hasSymptoms: null,
    weight: '',
    hasRenalInsufficiency: null,
    hasCardiacDisease: null,
    isOnDigoxin: null,
    albumin: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<TreatmentResult | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const level = parseFloat(formData.calciumLevel.replace(',', '.'));
    if (!formData.calciumLevel) {
      newErrors.calciumLevel = 'Nível de cálcio é obrigatório';
      isValid = false;
    } else if (isNaN(level) || level < 1.0 || level > 20.0) {
      newErrors.calciumLevel = 'Nível deve estar entre 1,0 e 20,0 mg/dL';
      isValid = false;
    }

    // Validate weight for treatment calculations
    if (formData.hasSymptoms === true) {
      const weight = parseFloat(formData.weight.replace(',', '.'));
      if (!formData.weight) {
        newErrors.weight = 'Peso é obrigatório para cálculo da dose';
        isValid = false;
      } else if (isNaN(weight) || weight < 1 || weight > 300) {
        newErrors.weight = 'Peso deve estar entre 1 e 300 kg';
        isValid = false;
      }
    }

    // Validate albumin for total calcium correction
    if (formData.calciumType === 'total' && formData.albumin) {
      const albumin = parseFloat(formData.albumin.replace(',', '.'));
      if (isNaN(albumin) || albumin < 1.0 || albumin > 6.0) {
        newErrors.albumin = 'Albumina deve estar entre 1,0 e 6,0 g/dL';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateCorrectedCalcium = (totalCalcium: number, albumin: number): number => {
    // Fórmula: Cálcio corrigido = Cálcio total + 0,8 × (4,0 - albumina)
    return totalCalcium + 0.8 * (4.0 - albumin);
  };

  const getCalciumClassification = (level: number, isIonized: boolean = false) => {
    let normalRange: [number, number];
    let ranges: { [key: string]: [number, number] };

    if (isIonized) {
      normalRange = [1.15, 1.35]; // mmol/L or mEq/L
      ranges = {
        severeHypo: [0, 0.9],
        moderateHypo: [0.9, 1.0],
        mildHypo: [1.0, 1.15],
        normal: [1.15, 1.35],
        mildHyper: [1.35, 1.5],
        moderateHyper: [1.5, 1.7],
        severeHyper: [1.7, 20]
      };
    } else {
      normalRange = [8.5, 10.5]; // mg/dL
      ranges = {
        severeHypo: [0, 7.0],
        moderateHypo: [7.0, 8.0],
        mildHypo: [8.0, 8.5],
        normal: [8.5, 10.5],
        mildHyper: [10.5, 12.0],
        moderateHyper: [12.0, 14.0],
        severeHyper: [14.0, 20]
      };
    }

    if (level >= normalRange[0] && level <= normalRange[1]) {
      return {
        classification: 'Normal',
        color: '#4CAF50',
        severity: 'normal' as const,
        needsTreatment: false
      };
    } else if (level >= ranges.mildHypo[0] && level < ranges.mildHypo[1]) {
      return {
        classification: 'Hipocalcemia Leve',
        color: '#FF9800',
        severity: 'mild' as const,
        needsTreatment: true
      };
    } else if (level >= ranges.moderateHypo[0] && level < ranges.moderateHypo[1]) {
      return {
        classification: 'Hipocalcemia Moderada',
        color: '#FF5722',
        severity: 'moderate' as const,
        needsTreatment: true
      };
    } else if (level < ranges.moderateHypo[0]) {
      return {
        classification: 'Hipocalcemia Grave',
        color: '#D32F2F',
        severity: 'severe' as const,
        needsTreatment: true
      };
    } else if (level >= ranges.mildHyper[0] && level < ranges.mildHyper[1]) {
      return {
        classification: 'Hipercalcemia Leve',
        color: '#FF9800',
        severity: 'mild' as const,
        needsTreatment: true
      };
    } else if (level >= ranges.moderateHyper[0] && level < ranges.moderateHyper[1]) {
      return {
        classification: 'Hipercalcemia Moderada',
        color: '#FF5722',
        severity: 'moderate' as const,
        needsTreatment: true
      };
    } else {
      return {
        classification: 'Hipercalcemia Grave',
        color: '#D32F2F',
        severity: 'severe' as const,
        needsTreatment: true
      };
    }
  };

  const calculateTreatment = (): TreatmentResult => {
    const level = parseFloat(formData.calciumLevel.replace(',', '.'));
    const weight = formData.weight ? parseFloat(formData.weight.replace(',', '.')) : 70;
    const albumin = formData.albumin ? parseFloat(formData.albumin.replace(',', '.')) : null;
    
    // Calculate corrected calcium if total calcium and albumin provided
    let correctedCalcium: number | undefined;
    let effectiveLevel = level;
    
    if (formData.calciumType === 'total' && albumin) {
      correctedCalcium = calculateCorrectedCalcium(level, albumin);
      effectiveLevel = correctedCalcium;
    }

    const classification = getCalciumClassification(effectiveLevel, formData.calciumType === 'ionized');

    let treatment = '';
    let preparation: string[] = [];
    let infusionRate = '';
    let monitoring: string[] = [];
    let warnings: string[] = [];
    let contraindications: string[] = [];

    if (!classification.needsTreatment) {
      return {
        classification: classification.classification,
        classificationColor: classification.color,
        severity: classification.severity,
        treatment: 'Nível de cálcio dentro da normalidade. Nenhuma correção é necessária.',
        monitoring: ['Monitoramento de rotina conforme indicação clínica'],
        warnings: ['Manter acompanhamento regular dos eletrólitos'],
        correctedCalcium
      };
    }

    // HIPOCALCEMIA
    if (effectiveLevel < (formData.calciumType === 'ionized' ? 1.15 : 8.5)) {
      treatment = '🔸 TRATAMENTO DA HIPOCALCEMIA\n\n';

      // Sintomático ou grave
      if (formData.hasSymptoms === true || classification.severity === 'severe') {
        treatment += '🚨 TRATAMENTO DE EMERGÊNCIA:\n\n';
        
        treatment += '💉 GLUCONATO DE CÁLCIO 10%:\n';
        treatment += '• Dose: 1-2 ampolas (10-20 mL) IV\n';
        treatment += '• Diluir em 50-100 mL de SG 5% ou SF 0,9%\n';
        treatment += '• Administrar em 10-20 minutos\n';
        treatment += '• Pode repetir a cada 10-15 minutos se necessário\n\n';

        preparation = [
          'Gluconato de Cálcio 10% (1g/10mL): 1-2 ampolas',
          'Diluir em 50-100 mL de SG 5% ou SF 0,9%',
          'Administrar em 10-20 minutos',
          'Concentração final: 10-20 mg/mL'
        ];

        infusionRate = 'Velocidade: 0,5-1 mL/min (máximo 2 mL/min)';

        if (classification.severity === 'severe' || formData.hasSymptoms === true) {
          treatment += '🔄 INFUSÃO CONTÍNUA (se necessário):\n';
          treatment += '• 10 ampolas (100 mL) de Gluconato de Cálcio 10%\n';
          treatment += '• Diluir em 400 mL de SG 5%\n';
          treatment += '• Concentração final: 2 mg/mL\n';
          treatment += '• Velocidade: 0,5-2 mg/kg/h\n\n';

          const infusionDose = weight * 1; // 1 mg/kg/h como dose inicial
          const infusionRateMLH = infusionDose / 2; // dividir pela concentração (2 mg/mL)
          
          preparation.push(
            'INFUSÃO CONTÍNUA:',
            '10 ampolas (100 mL) Gluconato Ca 10% + 400 mL SG 5%',
            `Velocidade inicial: ${infusionRateMLH.toFixed(1)} mL/h (${infusionDose} mg/h)`
          );
        }

        warnings.push('⚠️ NUNCA administrar cálcio em bolus rápido - risco de arritmias');
        warnings.push('⚠️ Não misturar com bicarbonato ou fosfato - precipitação');
        
        if (formData.isOnDigoxin) {
          warnings.push('🚨 PACIENTE EM USO DE DIGOXINA: Risco aumentado de toxicidade');
          warnings.push('• Administrar cálcio mais lentamente');
          warnings.push('• Monitorização cardíaca rigorosa');
        }

      } else {
        // Assintomático
        treatment += '💊 TRATAMENTO ORAL (Assintomático):\n';
        treatment += '• Carbonato de Cálcio: 1-2g de cálcio elementar/dia\n';
        treatment += '• Calcitriol: 0,25-0,5 mcg 2x/dia\n';
        treatment += '• Administrar com alimentos\n\n';

        treatment += '⚠️ CONSIDERAR VIA INTRAVENOSA se:\n';
        treatment += '• Má absorção intestinal\n';
        treatment += '• Necessidade de correção rápida\n';
        treatment += '• Hipocalcemia grave\n\n';
      }

      // Causas e correções associadas
      treatment += '🔍 INVESTIGAR E CORRIGIR:\n';
      treatment += '• Hipomagnesemia (corrigir primeiro)\n';
      treatment += '• Deficiência de vitamina D\n';
      treatment += '• Hipoparatireoidismo\n';
      treatment += '• Insuficiência renal\n\n';

      // Monitoramento hipocalcemia
      monitoring = [
        '📊 Cálcio sérico a cada 4-6h durante tratamento IV',
        '💓 Monitorização cardíaca contínua',
        '⚡ ECG para avaliar intervalo QT',
        '🔬 Magnésio, fósforo, albumina',
        '🧪 PTH, vitamina D (25-OH e 1,25-OH)',
        '🫁 Função renal'
      ];

      warnings.push('🔍 Corrigir hipomagnesemia antes ou simultaneamente');
      warnings.push('💡 Monitorar sinais de tetania e laringoespasmo');

    } else {
      // HIPERCALCEMIA
      treatment = '🔸 TRATAMENTO DA HIPERCALCEMIA\n\n';

      if (classification.severity === 'severe' || formData.hasSymptoms === true) {
        treatment += '🚨 TRATAMENTO DE EMERGÊNCIA:\n\n';
        
        treatment += '1️⃣ HIDRATAÇÃO VIGOROSA:\n';
        treatment += '• Soro Fisiológico 0,9%: 200-300 mL/h\n';
        treatment += '• Meta: 2-3 L nas primeiras 24h\n';
        treatment += '• Monitorar função cardíaca e renal\n\n';

        treatment += '2️⃣ DIURÉTICOS DE ALÇA:\n';
        treatment += '• Furosemida: 20-40 mg IV a cada 12h\n';
        treatment += '• Apenas após hidratação adequada\n';
        treatment += '• Monitorar eletrólitos\n\n';

        treatment += '3️⃣ BIFOSFONATOS:\n';
        treatment += '• Ácido Zoledrônico: 4 mg IV em 15 min\n';
        treatment += '• Ou Pamidronato: 60-90 mg IV em 2-4h\n';
        treatment += '• Efeito em 24-48h, pico em 4-7 dias\n\n';

        if (classification.severity === 'severe') {
          treatment += '4️⃣ CALCITONINA (efeito rápido):\n';
          treatment += '• 4-8 UI/kg SC ou IM a cada 12h\n';
          treatment += '• Efeito em 2-6h, duração 6-8h\n';
          treatment += '• Taquifilaxia após 48h\n\n';
        }

        preparation = [
          'SF 0,9%: 200-300 mL/h (monitorar sobrecarga)',
          'Furosemida 20mg/2mL: 1-2 ampolas IV',
          'Ácido Zoledrônico 4mg/5mL: 1 frasco IV em 15 min',
          'Calcitonina: 4-8 UI/kg SC/IM a cada 12h'
        ];

        if (formData.hasCardiacDisease) {
          warnings.push('⚠️ CARDIOPATIA: Hidratação cautelosa - risco de sobrecarga');
          warnings.push('• Monitorar sinais de insuficiência cardíaca');
          warnings.push('• Considerar monitorização hemodinâmica');
        }

        if (formData.hasRenalInsufficiency) {
          warnings.push('⚠️ INSUFICIÊNCIA RENAL: Ajustar hidratação e diuréticos');
          warnings.push('• Evitar bifosfonatos se TFG < 30 mL/min');
        }

      } else {
        // Hipercalcemia leve/moderada assintomática
        treatment += '💊 TRATAMENTO NÃO EMERGENCIAL:\n\n';
        treatment += '• Hidratação oral adequada\n';
        treatment += '• Suspender medicações que aumentam cálcio\n';
        treatment += '• Dieta com restrição de cálcio\n';
        treatment += '• Bifosfonatos se hipercalcemia persistente\n';
        treatment += '• Tratar causa subjacente\n\n';
      }

      // Monitoramento hipercalcemia
      monitoring = [
        '📊 Cálcio sérico a cada 6-12h durante tratamento agudo',
        '💓 Monitorização cardíaca',
        '⚡ ECG para avaliar alterações (QT curto, arritmias)',
        '🫁 Função renal (ureia, creatinina)',
        '💧 Balanço hídrico rigoroso',
        '🔬 Eletrólitos completos',
        '🧪 PTH, PTHrP, vitamina D'
      ];

      warnings.push('🚨 Risco de arritmias e alterações neurológicas');
      warnings.push('💧 Evitar tiazídicos - aumentam reabsorção de cálcio');
      warnings.push('🔍 Investigar malignidade se PTH suprimido');

      contraindications = [
        'Bifosfonatos: insuficiência renal severa (TFG < 30)',
        'Hidratação vigorosa: insuficiência cardíaca descompensada',
        'Furosemida: antes da hidratação adequada'
      ];
    }

    return {
      classification: classification.classification,
      classificationColor: classification.color,
      severity: classification.severity,
      treatment,
      preparation,
      infusionRate,
      monitoring,
      warnings,
      contraindications,
      correctedCalcium
    };
  };

  const handleCalculate = () => {
    if (!validateForm()) return;
    const result = calculateTreatment();
    setResult(result);
  };

  const resetForm = () => {
    setFormData({
      calciumLevel: '',
      calciumType: null,
      hasSymptoms: null,
      weight: '',
      hasRenalInsufficiency: null,
      hasCardiacDisease: null,
      isOnDigoxin: null,
      albumin: '',
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

  const level = parseFloat(formData.calciumLevel.replace(',', '.'));
  const classification = !isNaN(level) ? getCalciumClassification(level, formData.calciumType === 'ionized') : null;
  const isHypocalcemia = !isNaN(level) && level < (formData.calciumType === 'ionized' ? 1.15 : 8.5);
  const isHypercalcemia = !isNaN(level) && level > (formData.calciumType === 'ionized' ? 1.35 : 10.5);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Distúrbios do Cálcio" type="emergency" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <CircleDot size={20} color={theme.colors.emergency} /> Avaliação dos Distúrbios do Cálcio
            </Text>
            <Text style={styles.infoText}>
              Classificação automática e protocolo de tratamento baseado nos níveis séricos de cálcio. 
              Valores normais: Total 8,5-10,5 mg/dL | Ionizado 1,15-1,35 mmol/L.
            </Text>
          </View>

          {!result ? (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tipo de Cálcio</Text>
                <View style={styles.calciumTypeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      formData.calciumType === 'total' && styles.typeButtonSelected
                    ]}
                    onPress={() => setFormData({ ...formData, calciumType: 'total' })}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      formData.calciumType === 'total' && styles.typeButtonTextSelected
                    ]}>
                      Cálcio Total
                    </Text>
                    <Text style={styles.typeButtonSubtext}>8,5-10,5 mg/dL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      formData.calciumType === 'ionized' && styles.typeButtonSelected
                    ]}
                    onPress={() => setFormData({ ...formData, calciumType: 'ionized' })}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      formData.calciumType === 'ionized' && styles.typeButtonTextSelected
                    ]}>
                      Cálcio Ionizado
                    </Text>
                    <Text style={styles.typeButtonSubtext}>1,15-1,35 mmol/L</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Nível de Cálcio ({formData.calciumType === 'ionized' ? 'mmol/L' : 'mg/dL'})
                </Text>
                <TextInput
                  style={[styles.input, errors.calciumLevel && styles.inputError]}
                  keyboardType="decimal-pad"
                  value={formData.calciumLevel}
                  onChangeText={(value) => setFormData({ ...formData, calciumLevel: value })}
                  placeholder={formData.calciumType === 'ionized' ? 'Ex: 1.25' : 'Ex: 9.5'}
                />
                {errors.calciumLevel && (
                  <Text style={styles.errorText}>{errors.calciumLevel}</Text>
                )}
                
                {classification && (
                  <View style={[styles.classificationPreview, { borderColor: classification.color }]}>
                    <Text style={[styles.classificationText, { color: classification.color }]}>
                      {classification.classification}
                    </Text>
                  </View>
                )}
              </View>

              {formData.calciumType === 'total' && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Albumina (g/dL) - Opcional</Text>
                  <TextInput
                    style={[styles.input, errors.albumin && styles.inputError]}
                    keyboardType="decimal-pad"
                    value={formData.albumin}
                    onChangeText={(value) => setFormData({ ...formData, albumin: value })}
                    placeholder="Ex: 3.5"
                  />
                  <Text style={styles.helperText}>
                    Para correção do cálcio total pela albumina
                  </Text>
                  {errors.albumin && (
                    <Text style={styles.errorText}>{errors.albumin}</Text>
                  )}
                </View>
              )}

              {classification && classification.needsTreatment && (
                <>
                  <View style={styles.questionContainer}>
                    <Text style={styles.questionTitle}>
                      <Activity size={20} color={theme.colors.emergency} /> Paciente apresenta sintomas?
                    </Text>
                    <Text style={styles.questionSubtitle}>
                      {isHypocalcemia ? 
                        'Hipocalcemia: tetania, parestesias, laringoespasmo, convulsões, QT longo' :
                        'Hipercalcemia: confusão, letargia, náuseas, constipação, arritmias, QT curto'
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

                  {formData.hasSymptoms === true && (
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

                  {isHypercalcemia && (
                    <View style={styles.questionContainer}>
                      <Text style={styles.questionTitle}>
                        <Heart size={20} color="#E91E63" /> Paciente possui cardiopatia?
                      </Text>
                      <Text style={styles.questionSubtitle}>
                        Insuficiência cardíaca ou outras cardiopatias
                      </Text>
                      <View style={styles.questionButtons}>
                        {renderQuestionButton(
                          true,
                          formData.hasCardiacDisease,
                          () => setFormData({ ...formData, hasCardiacDisease: true }),
                          'SIM',
                          '#E91E63'
                        )}
                        {renderQuestionButton(
                          false,
                          formData.hasCardiacDisease,
                          () => setFormData({ ...formData, hasCardiacDisease: false }),
                          'NÃO',
                          theme.colors.success
                        )}
                      </View>
                    </View>
                  )}

                  {isHypocalcemia && (
                    <View style={styles.questionContainer}>
                      <Text style={styles.questionTitle}>
                        <Heart size={20} color="#9C27B0" /> Paciente usa digoxina?
                      </Text>
                      <Text style={styles.questionSubtitle}>
                        Importante para ajuste da velocidade de infusão de cálcio
                      </Text>
                      <View style={styles.questionButtons}>
                        {renderQuestionButton(
                          true,
                          formData.isOnDigoxin,
                          () => setFormData({ ...formData, isOnDigoxin: true }),
                          'SIM',
                          '#9C27B0'
                        )}
                        {renderQuestionButton(
                          false,
                          formData.isOnDigoxin,
                          () => setFormData({ ...formData, isOnDigoxin: false }),
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
                  (!formData.calciumLevel || !formData.calciumType ||
                   (classification?.needsTreatment && formData.hasSymptoms === null) ||
                   (formData.hasSymptoms === true && !formData.weight) ||
                   formData.hasRenalInsufficiency === null ||
                   (isHypercalcemia && formData.hasCardiacDisease === null) ||
                   (isHypocalcemia && formData.isOnDigoxin === null)) && styles.calculateButtonDisabled
                ]}
                onPress={handleCalculate}
                disabled={
                  !formData.calciumLevel || !formData.calciumType ||
                  (classification?.needsTreatment && formData.hasSymptoms === null) ||
                  (formData.hasSymptoms === true && !formData.weight) ||
                  formData.hasRenalInsufficiency === null ||
                  (isHypercalcemia && formData.hasCardiacDisease === null) ||
                  (isHypocalcemia && formData.isOnDigoxin === null)
                }
              >
                <Text style={styles.calculateButtonText}>Gerar Protocolo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.resultContainer}>
              <View style={[styles.classificationCard, { borderColor: result.classificationColor }]}>
                <View style={[styles.classificationHeader, { backgroundColor: result.classificationColor }]}>
                  <CircleDot size={32} color="white" />
                  <Text style={styles.classificationTitle}>{result.classification}</Text>
                </View>
                <View style={styles.classificationContent}>
                  <Text style={styles.levelText}>
                    Nível: {formData.calciumLevel} {formData.calciumType === 'ionized' ? 'mmol/L' : 'mg/dL'}
                  </Text>
                  {result.correctedCalcium && (
                    <Text style={styles.correctedText}>
                      Cálcio corrigido: {result.correctedCalcium.toFixed(2)} mg/dL
                    </Text>
                  )}
                  <Text style={styles.normalRangeText}>
                    Normal: {formData.calciumType === 'ionized' ? '1,15-1,35 mmol/L' : '8,5-10,5 mg/dL'}
                  </Text>
                </View>
              </View>

              <View style={styles.treatmentCard}>
                <Text style={styles.treatmentTitle}>
                  <Heart size={20} color={theme.colors.emergency} /> Protocolo de Tratamento
                </Text>
                <Text style={styles.treatmentText}>{result.treatment}</Text>
              </View>

              {result.preparation && result.preparation.length > 0 && (
                <View style={styles.preparationCard}>
                  <Text style={styles.preparationTitle}>
                    <Droplets size={20} color={theme.colors.calculator} /> Preparo e Administração
                  </Text>
                  {result.preparation.map((prep, index) => (
                    <Text key={index} style={styles.preparationText}>• {prep}</Text>
                  ))}
                  {result.infusionRate && (
                    <Text style={styles.infusionRateText}>{result.infusionRate}</Text>
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
  helperText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  calciumTypeButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  typeButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: theme.colors.emergency,
    borderColor: theme.colors.emergency,
  },
  typeButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  typeButtonTextSelected: {
    color: 'white',
  },
  typeButtonSubtext: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
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
    marginBottom: theme.spacing.xs,
  },
  correctedText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  normalRangeText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
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
  preparationCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  preparationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  preparationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  infusionRateText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginTop: theme.spacing.sm,
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