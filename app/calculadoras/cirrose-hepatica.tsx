import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Activity, Info, TriangleAlert as AlertTriangle, Heart, Zap, RotateCcw } from 'lucide-react-native';

interface ChildPughData {
  bilirubin: string;
  albumin: string;
  inr: string;
  ascites: 'none' | 'mild' | 'moderate' | null;
  encephalopathy: 'none' | 'grade1-2' | 'grade3-4' | null;
}

interface MeldData {
  bilirubin: string;
  inr: string;
  creatinine: string;
  sodium: string;
  dialysis: boolean;
}

interface ChildPughResult {
  score: number;
  class: 'A' | 'B' | 'C';
  classColor: string;
  oneYearSurvival: string;
  twoYearSurvival: string;
  interpretation: string;
  recommendations: string[];
  prognosis: string;
}

interface MeldResult {
  meldScore: number;
  meldNaScore: number;
  threeMonthMortality: string;
  transplantPriority: string;
  interpretation: string;
  recommendations: string[];
  urgency: string;
  urgencyColor: string;
}

interface FormErrors {
  childPugh?: {
    bilirubin?: string;
    albumin?: string;
    inr?: string;
    ascites?: string;
    encephalopathy?: string;
  };
  meld?: {
    bilirubin?: string;
    inr?: string;
    creatinine?: string;
    sodium?: string;
  };
}

export default function CirroseHepaticaScreen() {
  const [childPughData, setChildPughData] = useState<ChildPughData>({
    bilirubin: '',
    albumin: '',
    inr: '',
    ascites: null,
    encephalopathy: null,
  });

  const [meldData, setMeldData] = useState<MeldData>({
    bilirubin: '',
    inr: '',
    creatinine: '',
    sodium: '',
    dialysis: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [childPughResult, setChildPughResult] = useState<ChildPughResult | null>(null);
  const [meldResult, setMeldResult] = useState<MeldResult | null>(null);
  const [activeCalculator, setActiveCalculator] = useState<'both' | 'childpugh' | 'meld'>('both');

  const validateChildPugh = (): boolean => {
    const newErrors: FormErrors['childPugh'] = {};
    let isValid = true;

    // Check if any Child-Pugh field is filled
    const hasAnyChildPughData = childPughData.bilirubin || childPughData.albumin || 
                               childPughData.inr || childPughData.ascites || 
                               childPughData.encephalopathy;

    if (!hasAnyChildPughData) return true; // Skip validation if no data

    const bilirubin = parseFloat(childPughData.bilirubin.replace(',', '.'));
    if (!childPughData.bilirubin) {
      newErrors.bilirubin = 'Bilirrubina é obrigatória';
      isValid = false;
    } else if (isNaN(bilirubin) || bilirubin < 0 || bilirubin > 50) {
      newErrors.bilirubin = 'Bilirrubina deve estar entre 0 e 50 mg/dL';
      isValid = false;
    }

    const albumin = parseFloat(childPughData.albumin.replace(',', '.'));
    if (!childPughData.albumin) {
      newErrors.albumin = 'Albumina é obrigatória';
      isValid = false;
    } else if (isNaN(albumin) || albumin < 1 || albumin > 6) {
      newErrors.albumin = 'Albumina deve estar entre 1 e 6 g/dL';
      isValid = false;
    }

    const inr = parseFloat(childPughData.inr.replace(',', '.'));
    if (!childPughData.inr) {
      newErrors.inr = 'INR é obrigatório';
      isValid = false;
    } else if (isNaN(inr) || inr < 0.8 || inr > 10) {
      newErrors.inr = 'INR deve estar entre 0,8 e 10';
      isValid = false;
    }

    if (!childPughData.ascites) {
      newErrors.ascites = 'Ascite é obrigatória';
      isValid = false;
    }

    if (!childPughData.encephalopathy) {
      newErrors.encephalopathy = 'Encefalopatia é obrigatória';
      isValid = false;
    }

    setErrors(prev => ({ ...prev, childPugh: newErrors }));
    return isValid;
  };

  const validateMeld = (): boolean => {
    const newErrors: FormErrors['meld'] = {};
    let isValid = true;

    // Check if any MELD field is filled
    const hasAnyMeldData = meldData.bilirubin || meldData.inr || 
                          meldData.creatinine || meldData.sodium;

    if (!hasAnyMeldData) return true; // Skip validation if no data

    const bilirubin = parseFloat(meldData.bilirubin.replace(',', '.'));
    if (!meldData.bilirubin) {
      newErrors.bilirubin = 'Bilirrubina é obrigatória';
      isValid = false;
    } else if (isNaN(bilirubin) || bilirubin < 0 || bilirubin > 50) {
      newErrors.bilirubin = 'Bilirrubina deve estar entre 0 e 50 mg/dL';
      isValid = false;
    }

    const inr = parseFloat(meldData.inr.replace(',', '.'));
    if (!meldData.inr) {
      newErrors.inr = 'INR é obrigatório';
      isValid = false;
    } else if (isNaN(inr) || inr < 0.8 || inr > 10) {
      newErrors.inr = 'INR deve estar entre 0,8 e 10';
      isValid = false;
    }

    const creatinine = parseFloat(meldData.creatinine.replace(',', '.'));
    if (!meldData.creatinine) {
      newErrors.creatinine = 'Creatinina é obrigatória';
      isValid = false;
    } else if (isNaN(creatinine) || creatinine < 0.5 || creatinine > 15) {
      newErrors.creatinine = 'Creatinina deve estar entre 0,5 e 15 mg/dL';
      isValid = false;
    }

    const sodium = parseFloat(meldData.sodium.replace(',', '.'));
    if (!meldData.sodium) {
      newErrors.sodium = 'Sódio é obrigatório';
      isValid = false;
    } else if (isNaN(sodium) || sodium < 120 || sodium > 160) {
      newErrors.sodium = 'Sódio deve estar entre 120 e 160 mEq/L';
      isValid = false;
    }

    setErrors(prev => ({ ...prev, meld: newErrors }));
    return isValid;
  };

  const calculateChildPugh = (): ChildPughResult => {
    const bilirubin = parseFloat(childPughData.bilirubin.replace(',', '.'));
    const albumin = parseFloat(childPughData.albumin.replace(',', '.'));
    const inr = parseFloat(childPughData.inr.replace(',', '.'));

    let score = 0;

    // Bilirubin scoring
    if (bilirubin < 2) score += 1;
    else if (bilirubin <= 3) score += 2;
    else score += 3;

    // Albumin scoring
    if (albumin > 3.5) score += 1;
    else if (albumin >= 2.8) score += 2;
    else score += 3;

    // INR scoring
    if (inr < 1.7) score += 1;
    else if (inr <= 2.3) score += 2;
    else score += 3;

    // Ascites scoring
    if (childPughData.ascites === 'none') score += 1;
    else if (childPughData.ascites === 'mild') score += 2;
    else score += 3;

    // Encephalopathy scoring
    if (childPughData.encephalopathy === 'none') score += 1;
    else if (childPughData.encephalopathy === 'grade1-2') score += 2;
    else score += 3;

    // Determine class
    let childClass: 'A' | 'B' | 'C';
    let classColor: string;
    let oneYearSurvival: string;
    let twoYearSurvival: string;
    let interpretation: string;
    let prognosis: string;

    if (score <= 6) {
      childClass = 'A';
      classColor = '#4CAF50';
      oneYearSurvival = '100%';
      twoYearSurvival = '85%';
      interpretation = 'Cirrose compensada com função hepática preservada';
      prognosis = 'Excelente - expectativa de vida próxima ao normal';
    } else if (score <= 9) {
      childClass = 'B';
      classColor = '#FF9800';
      oneYearSurvival = '81%';
      twoYearSurvival = '57%';
      interpretation = 'Cirrose com disfunção hepática moderada';
      prognosis = 'Moderado - considerar avaliação para transplante';
    } else {
      childClass = 'C';
      classColor = '#D32F2F';
      oneYearSurvival = '45%';
      twoYearSurvival = '35%';
      interpretation = 'Cirrose descompensada com disfunção hepática severa';
      prognosis = 'Reservado - transplante hepático indicado';
    }

    const recommendations: string[] = [];

    if (childClass === 'A') {
      recommendations.push(
        'Seguimento ambulatorial regular a cada 6 meses',
        'Rastreamento de varizes esofágicas por endoscopia',
        'Rastreamento de carcinoma hepatocelular (US + AFP a cada 6 meses)',
        'Vacinação para hepatite A e B se não imune',
        'Evitar álcool e hepatotóxicos'
      );
    } else if (childClass === 'B') {
      recommendations.push(
        'Seguimento ambulatorial a cada 3-4 meses',
        'Avaliação para transplante hepático',
        'Profilaxia primária de varizes se indicada',
        'Rastreamento de CHC a cada 3-6 meses',
        'Manejo de complicações (ascite, encefalopatia)',
        'Suporte nutricional'
      );
    } else {
      recommendations.push(
        'Avaliação urgente para transplante hepático',
        'Seguimento em centro especializado',
        'Manejo intensivo de complicações',
        'Profilaxia secundária de sangramento varicoso',
        'Cuidados paliativos se transplante contraindicado',
        'Suporte familiar e psicológico'
      );
    }

    return {
      score,
      class: childClass,
      classColor,
      oneYearSurvival,
      twoYearSurvival,
      interpretation,
      recommendations,
      prognosis
    };
  };

  const calculateMeld = (): MeldResult => {
    let bilirubin = parseFloat(meldData.bilirubin.replace(',', '.'));
    let inr = parseFloat(meldData.inr.replace(',', '.'));
    let creatinine = parseFloat(meldData.creatinine.replace(',', '.'));
    const sodium = parseFloat(meldData.sodium.replace(',', '.'));

    // Apply minimum values
    bilirubin = Math.max(bilirubin, 1.0);
    inr = Math.max(inr, 1.0);
    creatinine = Math.max(creatinine, 1.0);

    // Apply maximum values
    bilirubin = Math.min(bilirubin, 4.0);
    creatinine = Math.min(creatinine, 4.0);

    // If on dialysis, set creatinine to 4.0
    if (meldData.dialysis) {
      creatinine = 4.0;
    }

    // Calculate MELD score
    const meldScore = Math.round(
      3.78 * Math.log(bilirubin) +
      11.2 * Math.log(inr) +
      9.57 * Math.log(creatinine) +
      6.43
    );

    // Calculate MELD-Na score
    const sodiumClamped = Math.max(125, Math.min(sodium, 137));
    const meldNaScore = meldScore + 1.32 * (137 - sodiumClamped) - (0.033 * meldScore * (137 - sodiumClamped));

    // Determine mortality and priority
    let threeMonthMortality: string;
    let transplantPriority: string;
    let interpretation: string;
    let urgency: string;
    let urgencyColor: string;

    if (meldNaScore < 10) {
      threeMonthMortality = '1.9%';
      transplantPriority = 'Baixa';
      interpretation = 'Baixo risco de mortalidade. Cirrose compensada.';
      urgency = 'Baixa Urgência';
      urgencyColor = '#4CAF50';
    } else if (meldNaScore < 15) {
      threeMonthMortality = '6.0%';
      transplantPriority = 'Baixa a Moderada';
      interpretation = 'Risco baixo a moderado. Monitoramento regular necessário.';
      urgency = 'Baixa Urgência';
      urgencyColor = '#8BC34A';
    } else if (meldNaScore < 20) {
      threeMonthMortality = '19.6%';
      transplantPriority = 'Moderada';
      interpretation = 'Risco moderado. Considerar avaliação para transplante.';
      urgency = 'Moderada Urgência';
      urgencyColor = '#FF9800';
    } else if (meldNaScore < 25) {
      threeMonthMortality = '76.0%';
      transplantPriority = 'Alta';
      interpretation = 'Alto risco de mortalidade. Transplante indicado.';
      urgency = 'Alta Urgência';
      urgencyColor = '#FF5722';
    } else {
      threeMonthMortality = '>76.0%';
      transplantPriority = 'Muito Alta';
      interpretation = 'Risco muito alto. Transplante urgente necessário.';
      urgency = 'Urgência Máxima';
      urgencyColor = '#D32F2F';
    }

    const recommendations: string[] = [];

    if (meldNaScore < 15) {
      recommendations.push(
        'Seguimento ambulatorial regular',
        'Rastreamento de complicações',
        'Otimização do tratamento da doença de base',
        'Estilo de vida saudável',
        'Vacinações recomendadas'
      );
    } else if (meldNaScore < 20) {
      recommendations.push(
        'Avaliação para transplante hepático',
        'Seguimento em centro especializado',
        'Manejo proativo de complicações',
        'Suporte nutricional',
        'Preparação para possível transplante'
      );
    } else {
      recommendations.push(
        'Listagem urgente para transplante',
        'Cuidados em centro de transplante',
        'Manejo intensivo de complicações',
        'Suporte multidisciplinar',
        'Preparação familiar para transplante'
      );
    }

    return {
      meldScore: Math.round(meldScore),
      meldNaScore: Math.round(meldNaScore),
      threeMonthMortality,
      transplantPriority,
      interpretation,
      recommendations,
      urgency,
      urgencyColor
    };
  };

  const handleCalculate = () => {
    const childPughValid = validateChildPugh();
    const meldValid = validateMeld();

    // Check if at least one calculator has data
    const hasChildPughData = childPughData.bilirubin || childPughData.albumin || 
                            childPughData.inr || childPughData.ascites || 
                            childPughData.encephalopathy;
    
    const hasMeldData = meldData.bilirubin || meldData.inr || 
                       meldData.creatinine || meldData.sodium;

    if (!hasChildPughData && !hasMeldData) {
      setErrors({
        childPugh: { bilirubin: 'Preencha pelo menos uma das calculadoras' },
        meld: { bilirubin: 'Preencha pelo menos uma das calculadoras' }
      });
      return;
    }

    if (hasChildPughData && childPughValid) {
      const result = calculateChildPugh();
      setChildPughResult(result);
    }

    if (hasMeldData && meldValid) {
      const result = calculateMeld();
      setMeldResult(result);
    }
  };

  const resetCalculators = () => {
    setChildPughData({
      bilirubin: '',
      albumin: '',
      inr: '',
      ascites: null,
      encephalopathy: null,
    });
    setMeldData({
      bilirubin: '',
      inr: '',
      creatinine: '',
      sodium: '',
      dialysis: false,
    });
    setErrors({});
    setChildPughResult(null);
    setMeldResult(null);
  };

  const renderOptionButton = (
    value: string,
    currentValue: string | null,
    onPress: () => void,
    text: string,
    color: string = theme.colors.calculator
  ) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        currentValue === value && { backgroundColor: color, borderColor: color }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.optionButtonText,
        currentValue === value && { color: 'white' }
      ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Cirrose Hepática" type="calculator" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Activity size={20} color={theme.colors.calculator} /> Avaliação da Cirrose Hepática
            </Text>
            <Text style={styles.infoText}>
              Calculadoras Child-Pugh e MELD-Na para avaliação da gravidade da cirrose hepática e priorização para transplante. 
              Você pode preencher uma ou ambas as calculadoras.
            </Text>
          </View>

          {!childPughResult && !meldResult ? (
            <>
              {/* Child-Pugh Calculator */}
              <View style={styles.calculatorCard}>
                <Text style={styles.calculatorTitle}>
                  <Heart size={20} color="#E91E63" /> Classificação Child-Pugh
                </Text>
                <Text style={styles.calculatorSubtitle}>
                  Avalia a gravidade da cirrose e prognóstico
                </Text>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Bilirrubina Total (mg/dL)</Text>
                  <TextInput
                    style={[styles.input, errors.childPugh?.bilirubin && styles.inputError]}
                    placeholder="Ex: 2.0"
                    keyboardType="decimal-pad"
                    value={childPughData.bilirubin}
                    onChangeText={(value) => setChildPughData({ ...childPughData, bilirubin: value })}
                  />
                  {errors.childPugh?.bilirubin && (
                    <Text style={styles.errorText}>{errors.childPugh.bilirubin}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Albumina (g/dL)</Text>
                  <TextInput
                    style={[styles.input, errors.childPugh?.albumin && styles.inputError]}
                    placeholder="Ex: 3.0"
                    keyboardType="decimal-pad"
                    value={childPughData.albumin}
                    onChangeText={(value) => setChildPughData({ ...childPughData, albumin: value })}
                  />
                  {errors.childPugh?.albumin && (
                    <Text style={styles.errorText}>{errors.childPugh.albumin}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>INR</Text>
                  <TextInput
                    style={[styles.input, errors.childPugh?.inr && styles.inputError]}
                    placeholder="Ex: 1.5"
                    keyboardType="decimal-pad"
                    value={childPughData.inr}
                    onChangeText={(value) => setChildPughData({ ...childPughData, inr: value })}
                  />
                  {errors.childPugh?.inr && (
                    <Text style={styles.errorText}>{errors.childPugh.inr}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Ascite</Text>
                  <View style={styles.optionsContainer}>
                    {renderOptionButton(
                      'none',
                      childPughData.ascites,
                      () => setChildPughData({ ...childPughData, ascites: 'none' }),
                      'Ausente',
                      '#4CAF50'
                    )}
                    {renderOptionButton(
                      'mild',
                      childPughData.ascites,
                      () => setChildPughData({ ...childPughData, ascites: 'mild' }),
                      'Leve/Controlada',
                      '#FF9800'
                    )}
                    {renderOptionButton(
                      'moderate',
                      childPughData.ascites,
                      () => setChildPughData({ ...childPughData, ascites: 'moderate' }),
                      'Moderada/Refratária',
                      '#D32F2F'
                    )}
                  </View>
                  {errors.childPugh?.ascites && (
                    <Text style={styles.errorText}>{errors.childPugh.ascites}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Encefalopatia Hepática</Text>
                  <View style={styles.optionsContainer}>
                    {renderOptionButton(
                      'none',
                      childPughData.encephalopathy,
                      () => setChildPughData({ ...childPughData, encephalopathy: 'none' }),
                      'Ausente',
                      '#4CAF50'
                    )}
                    {renderOptionButton(
                      'grade1-2',
                      childPughData.encephalopathy,
                      () => setChildPughData({ ...childPughData, encephalopathy: 'grade1-2' }),
                      'Grau I-II',
                      '#FF9800'
                    )}
                    {renderOptionButton(
                      'grade3-4',
                      childPughData.encephalopathy,
                      () => setChildPughData({ ...childPughData, encephalopathy: 'grade3-4' }),
                      'Grau III-IV',
                      '#D32F2F'
                    )}
                  </View>
                  {errors.childPugh?.encephalopathy && (
                    <Text style={styles.errorText}>{errors.childPugh.encephalopathy}</Text>
                  )}
                </View>
              </View>

              {/* MELD-Na Calculator */}
              <View style={styles.calculatorCard}>
                <Text style={styles.calculatorTitle}>
                  <Zap size={20} color="#3F51B5" /> Escore MELD-Na
                </Text>
                <Text style={styles.calculatorSubtitle}>
                  Priorização para transplante hepático
                </Text>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Bilirrubina Total (mg/dL)</Text>
                  <TextInput
                    style={[styles.input, errors.meld?.bilirubin && styles.inputError]}
                    placeholder="Ex: 2.0"
                    keyboardType="decimal-pad"
                    value={meldData.bilirubin}
                    onChangeText={(value) => setMeldData({ ...meldData, bilirubin: value })}
                  />
                  {errors.meld?.bilirubin && (
                    <Text style={styles.errorText}>{errors.meld.bilirubin}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>INR</Text>
                  <TextInput
                    style={[styles.input, errors.meld?.inr && styles.inputError]}
                    placeholder="Ex: 1.5"
                    keyboardType="decimal-pad"
                    value={meldData.inr}
                    onChangeText={(value) => setMeldData({ ...meldData, inr: value })}
                  />
                  {errors.meld?.inr && (
                    <Text style={styles.errorText}>{errors.meld.inr}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Creatinina (mg/dL)</Text>
                  <TextInput
                    style={[styles.input, errors.meld?.creatinine && styles.inputError]}
                    placeholder="Ex: 1.2"
                    keyboardType="decimal-pad"
                    value={meldData.creatinine}
                    onChangeText={(value) => setMeldData({ ...meldData, creatinine: value })}
                  />
                  {errors.meld?.creatinine && (
                    <Text style={styles.errorText}>{errors.meld.creatinine}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Sódio (mEq/L)</Text>
                  <TextInput
                    style={[styles.input, errors.meld?.sodium && styles.inputError]}
                    placeholder="Ex: 135"
                    keyboardType="decimal-pad"
                    value={meldData.sodium}
                    onChangeText={(value) => setMeldData({ ...meldData, sodium: value })}
                  />
                  {errors.meld?.sodium && (
                    <Text style={styles.errorText}>{errors.meld.sodium}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Diálise nas últimas 2 semanas?</Text>
                  <View style={styles.dialysisContainer}>
                    <TouchableOpacity
                      style={[
                        styles.dialysisButton,
                        !meldData.dialysis && styles.dialysisButtonSelected
                      ]}
                      onPress={() => setMeldData({ ...meldData, dialysis: false })}
                    >
                      <Text style={[
                        styles.dialysisButtonText,
                        !meldData.dialysis && styles.dialysisButtonTextSelected
                      ]}>NÃO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.dialysisButton,
                        meldData.dialysis && styles.dialysisButtonSelected
                      ]}
                      onPress={() => setMeldData({ ...meldData, dialysis: true })}
                    >
                      <Text style={[
                        styles.dialysisButtonText,
                        meldData.dialysis && styles.dialysisButtonTextSelected
                      ]}>SIM</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.calculateButton}
                onPress={handleCalculate}
              >
                <Text style={styles.calculateButtonText}>Calcular Escores</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.resultsContainer}>
              {/* Child-Pugh Results */}
              {childPughResult && (
                <View style={styles.resultSection}>
                  <View style={[styles.resultCard, { borderColor: childPughResult.classColor }]}>
                    <View style={[styles.resultHeader, { backgroundColor: childPughResult.classColor }]}>
                      <Heart size={32} color="white" />
                      <Text style={styles.resultTitle}>Child-Pugh {childPughResult.class}</Text>
                    </View>
                    <View style={styles.resultContent}>
                      <Text style={styles.scoreText}>Pontuação: {childPughResult.score}</Text>
                      <Text style={styles.interpretationText}>{childPughResult.interpretation}</Text>
                    </View>
                  </View>

                  <View style={styles.survivalCard}>
                    <Text style={styles.survivalTitle}>
                      <Info size={20} color={theme.colors.calculator} /> Sobrevida Estimada
                    </Text>
                    <View style={styles.survivalRow}>
                      <Text style={styles.survivalLabel}>1 ano:</Text>
                      <Text style={styles.survivalValue}>{childPughResult.oneYearSurvival}</Text>
                    </View>
                    <View style={styles.survivalRow}>
                      <Text style={styles.survivalLabel}>2 anos:</Text>
                      <Text style={styles.survivalValue}>{childPughResult.twoYearSurvival}</Text>
                    </View>
                    <Text style={styles.prognosisText}>{childPughResult.prognosis}</Text>
                  </View>

                  <View style={styles.recommendationsCard}>
                    <Text style={styles.recommendationsTitle}>
                      <AlertTriangle size={20} color="#FF5722" /> Recomendações
                    </Text>
                    {childPughResult.recommendations.map((recommendation, index) => (
                      <Text key={index} style={styles.recommendationText}>
                        • {recommendation}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {/* MELD-Na Results */}
              {meldResult && (
                <View style={styles.resultSection}>
                  <View style={[styles.resultCard, { borderColor: meldResult.urgencyColor }]}>
                    <View style={[styles.resultHeader, { backgroundColor: meldResult.urgencyColor }]}>
                      <Zap size={32} color="white" />
                      <Text style={styles.resultTitle}>MELD-Na {meldResult.meldNaScore}</Text>
                    </View>
                    <View style={styles.resultContent}>
                      <Text style={styles.scoreText}>MELD: {meldResult.meldScore} | MELD-Na: {meldResult.meldNaScore}</Text>
                      <Text style={styles.interpretationText}>{meldResult.interpretation}</Text>
                    </View>
                  </View>

                  <View style={styles.mortalityCard}>
                    <Text style={styles.mortalityTitle}>
                      <Activity size={20} color="#D32F2F" /> Risco de Mortalidade
                    </Text>
                    <View style={styles.mortalityRow}>
                      <Text style={styles.mortalityLabel}>3 meses:</Text>
                      <Text style={styles.mortalityValue}>{meldResult.threeMonthMortality}</Text>
                    </View>
                    <View style={styles.mortalityRow}>
                      <Text style={styles.mortalityLabel}>Prioridade:</Text>
                      <Text style={[styles.mortalityValue, { color: meldResult.urgencyColor }]}>
                        {meldResult.transplantPriority}
                      </Text>
                    </View>
                    <Text style={[styles.urgencyText, { color: meldResult.urgencyColor }]}>
                      {meldResult.urgency}
                    </Text>
                  </View>

                  <View style={styles.recommendationsCard}>
                    <Text style={styles.recommendationsTitle}>
                      <AlertTriangle size={20} color="#FF5722" /> Recomendações
                    </Text>
                    {meldResult.recommendations.map((recommendation, index) => (
                      <Text key={index} style={styles.recommendationText}>
                        • {recommendation}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {/* Clinical Notes */}
              <View style={styles.clinicalNotesCard}>
                <Text style={styles.clinicalNotesTitle}>
                  <Info size={20} color="#4CAF50" /> Considerações Clínicas
                </Text>
                <Text style={styles.clinicalNotesText}>
                  • Child-Pugh é melhor para prognóstico geral e sobrevida{'\n'}
                  • MELD-Na é usado para priorização em lista de transplante{'\n'}
                  • Ambos os escores devem ser interpretados no contexto clínico{'\n'}
                  • Reavaliação periódica é necessária para monitorar progressão{'\n'}
                  • Complicações podem alterar significativamente o prognóstico
                </Text>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetCalculators}
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
  calculatorCard: {
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
  calculatorTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  calculatorSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
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
  optionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  optionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  optionButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    textAlign: 'center',
  },
  dialysisContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  dialysisButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  dialysisButtonSelected: {
    backgroundColor: theme.colors.calculator,
    borderColor: theme.colors.calculator,
  },
  dialysisButtonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  dialysisButtonTextSelected: {
    color: 'white',
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
  resultsContainer: {
    gap: theme.spacing.lg,
  },
  resultSection: {
    gap: theme.spacing.md,
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
  scoreText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  interpretationText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  survivalCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  survivalTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  survivalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  survivalLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  survivalValue: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
  },
  prognosisText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mortalityCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
  mortalityTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#D32F2F',
    marginBottom: theme.spacing.md,
  },
  mortalityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  mortalityLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  mortalityValue: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#D32F2F',
  },
  urgencyText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    marginTop: theme.spacing.md,
    textAlign: 'center',
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
  clinicalNotesCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  clinicalNotesTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.md,
  },
  clinicalNotesText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: theme.colors.calculator,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  resetButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
});