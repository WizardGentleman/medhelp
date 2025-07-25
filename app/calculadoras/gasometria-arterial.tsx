import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Wind, Droplets, Info, TriangleAlert as AlertTriangle, Activity, Zap, Heart } from 'lucide-react-native';

interface FormData {
  ph: string;
  paco2: string;
  pao2: string;
  hco3: string;
  be: string;
  na: string;
  k: string;
  cl: string;
}

interface FormErrors {
  ph?: string;
  paco2?: string;
  pao2?: string;
  hco3?: string;
  be?: string;
  na?: string;
  k?: string;
  cl?: string;
}

interface ABGResult {
  primaryDisorder: string;
  primaryDisorderColor: string;
  compensation: string;
  compensationStatus: string;
  anionGap?: number;
  deltaRatio?: number;
  oxygenation: string;
  oxygenationStatus: string;
  electrolyteDisturbances: string[];
  clinicalInterpretation: string;
  possibleDiagnoses: string[];
  recommendations: string[];
  additionalTests: string[];
}

export default function GasometriaArterialScreen() {
  const [formData, setFormData] = useState<FormData>({
    ph: '',
    paco2: '',
    pao2: '',
    hco3: '',
    be: '',
    na: '',
    k: '',
    cl: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<ABGResult | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate pH (required)
    const ph = parseFloat(formData.ph.replace(',', '.'));
    if (!formData.ph) {
      newErrors.ph = 'pH é obrigatório';
      isValid = false;
    } else if (isNaN(ph) || ph < 6.8 || ph > 7.8) {
      newErrors.ph = 'pH deve estar entre 6,8 e 7,8';
      isValid = false;
    }

    // Validate PaCO2 (required)
    const paco2 = parseFloat(formData.paco2.replace(',', '.'));
    if (!formData.paco2) {
      newErrors.paco2 = 'PaCO2 é obrigatório';
      isValid = false;
    } else if (isNaN(paco2) || paco2 < 10 || paco2 > 100) {
      newErrors.paco2 = 'PaCO2 deve estar entre 10 e 100 mmHg';
      isValid = false;
    }

    // Validate PaO2 (required)
    const pao2 = parseFloat(formData.pao2.replace(',', '.'));
    if (!formData.pao2) {
      newErrors.pao2 = 'PaO2 é obrigatório';
      isValid = false;
    } else if (isNaN(pao2) || pao2 < 30 || pao2 > 600) {
      newErrors.pao2 = 'PaO2 deve estar entre 30 e 600 mmHg';
      isValid = false;
    }

    // Validate HCO3 (required)
    const hco3 = parseFloat(formData.hco3.replace(',', '.'));
    if (!formData.hco3) {
      newErrors.hco3 = 'HCO3- é obrigatório';
      isValid = false;
    } else if (isNaN(hco3) || hco3 < 5 || hco3 > 50) {
      newErrors.hco3 = 'HCO3- deve estar entre 5 e 50 mEq/L';
      isValid = false;
    }

    // Validate BE (optional)
    if (formData.be) {
      const be = parseFloat(formData.be.replace(',', '.'));
      if (isNaN(be) || be < -30 || be > 30) {
        newErrors.be = 'BE deve estar entre -30 e +30 mEq/L';
        isValid = false;
      }
    }

    // Validate electrolytes (optional)
    if (formData.na) {
      const na = parseFloat(formData.na.replace(',', '.'));
      if (isNaN(na) || na < 120 || na > 160) {
        newErrors.na = 'Na+ deve estar entre 120 e 160 mEq/L';
        isValid = false;
      }
    }

    if (formData.k) {
      const k = parseFloat(formData.k.replace(',', '.'));
      if (isNaN(k) || k < 2.0 || k > 8.0) {
        newErrors.k = 'K+ deve estar entre 2,0 e 8,0 mEq/L';
        isValid = false;
      }
    }

    if (formData.cl) {
      const cl = parseFloat(formData.cl.replace(',', '.'));
      if (isNaN(cl) || cl < 80 || cl > 120) {
        newErrors.cl = 'Cl- deve estar entre 80 e 120 mEq/L';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateABG = (): ABGResult => {
    const ph = parseFloat(formData.ph.replace(',', '.'));
    const paco2 = parseFloat(formData.paco2.replace(',', '.'));
    const pao2 = parseFloat(formData.pao2.replace(',', '.'));
    const hco3 = parseFloat(formData.hco3.replace(',', '.'));
    const be = formData.be ? parseFloat(formData.be.replace(',', '.')) : null;
    const na = formData.na ? parseFloat(formData.na.replace(',', '.')) : null;
    const k = formData.k ? parseFloat(formData.k.replace(',', '.')) : null;
    const cl = formData.cl ? parseFloat(formData.cl.replace(',', '.')) : null;

    // Step 1: Determine primary disorder
    let primaryDisorder = '';
    let primaryDisorderColor = '';
    
    if (ph < 7.35) {
      if (paco2 > 45) {
        primaryDisorder = 'Acidose Respiratória';
        primaryDisorderColor = '#D32F2F';
      } else if (hco3 < 22) {
        primaryDisorder = 'Acidose Metabólica';
        primaryDisorderColor = '#D32F2F';
      } else {
        primaryDisorder = 'Distúrbio Misto';
        primaryDisorderColor = '#FF5722';
      }
    } else if (ph > 7.45) {
      if (paco2 < 35) {
        primaryDisorder = 'Alcalose Respiratória';
        primaryDisorderColor = '#1976D2';
      } else if (hco3 > 26) {
        primaryDisorder = 'Alcalose Metabólica';
        primaryDisorderColor = '#1976D2';
      } else {
        primaryDisorder = 'Distúrbio Misto';
        primaryDisorderColor = '#FF5722';
      }
    } else {
      primaryDisorder = 'Normal';
      primaryDisorderColor = '#4CAF50';
    }

    // Step 2: Assess compensation
    let compensation = '';
    let compensationStatus = '';

    if (primaryDisorder.includes('Acidose Metabólica')) {
      const expectedPaCO2 = 1.5 * hco3 + 8;
      const lowerLimit = expectedPaCO2 - 2;
      const upperLimit = expectedPaCO2 + 2;
      
      if (paco2 >= lowerLimit && paco2 <= upperLimit) {
        compensationStatus = 'Compensação Respiratória Adequada';
        compensation = `PaCO2 esperado: ${expectedPaCO2.toFixed(1)} ± 2 mmHg (atual: ${paco2} mmHg)`;
      } else if (paco2 < lowerLimit) {
        compensationStatus = 'Hipercompensação Respiratória';
        compensation = `PaCO2 menor que esperado (${expectedPaCO2.toFixed(1)} ± 2 mmHg)`;
      } else {
        compensationStatus = 'Compensação Respiratória Inadequada';
        compensation = `PaCO2 maior que esperado (${expectedPaCO2.toFixed(1)} ± 2 mmHg)`;
      }
    } else if (primaryDisorder.includes('Acidose Respiratória')) {
      const expectedHCO3Acute = 24 + (paco2 - 40) * 0.1;
      const expectedHCO3Chronic = 24 + (paco2 - 40) * 0.35;
      
      if (Math.abs(hco3 - expectedHCO3Acute) < 2) {
        compensationStatus = 'Acidose Respiratória Aguda';
        compensation = `HCO3- compatível com acidose aguda (${expectedHCO3Acute.toFixed(1)} ± 2 mEq/L)`;
      } else if (Math.abs(hco3 - expectedHCO3Chronic) < 2) {
        compensationStatus = 'Acidose Respiratória Crônica';
        compensation = `HCO3- compatível com acidose crônica (${expectedHCO3Chronic.toFixed(1)} ± 2 mEq/L)`;
      } else {
        compensationStatus = 'Compensação Metabólica Atípica';
        compensation = `HCO3- não compatível com padrões esperados`;
      }
    } else if (primaryDisorder.includes('Alcalose Metabólica')) {
      const expectedPaCO2 = 40 + 0.7 * (hco3 - 24);
      const lowerLimit = expectedPaCO2 - 5;
      const upperLimit = expectedPaCO2 + 5;
      
      if (paco2 >= lowerLimit && paco2 <= upperLimit) {
        compensationStatus = 'Compensação Respiratória Adequada';
        compensation = `PaCO2 esperado: ${expectedPaCO2.toFixed(1)} ± 5 mmHg (atual: ${paco2} mmHg)`;
      } else {
        compensationStatus = 'Compensação Respiratória Inadequada';
        compensation = `PaCO2 diferente do esperado (${expectedPaCO2.toFixed(1)} ± 5 mmHg)`;
      }
    } else if (primaryDisorder.includes('Alcalose Respiratória')) {
      const expectedHCO3Acute = 24 - 2 * (40 - paco2) / 10;
      const expectedHCO3Chronic = 24 - 5 * (40 - paco2) / 10;
      
      if (Math.abs(hco3 - expectedHCO3Acute) < 2) {
        compensationStatus = 'Alcalose Respiratória Aguda';
        compensation = `HCO3- compatível com alcalose aguda (${expectedHCO3Acute.toFixed(1)} ± 2 mEq/L)`;
      } else if (Math.abs(hco3 - expectedHCO3Chronic) < 2) {
        compensationStatus = 'Alcalose Respiratória Crônica';
        compensation = `HCO3- compatível com alcalose crônica (${expectedHCO3Chronic.toFixed(1)} ± 2 mEq/L)`;
      } else {
        compensationStatus = 'Compensação Metabólica Atípica';
        compensation = `HCO3- não compatível com padrões esperados`;
      }
    } else {
      compensationStatus = 'Não aplicável';
      compensation = 'Valores dentro da normalidade';
    }

    // Step 3: Calculate anion gap and delta ratio if electrolytes available
    let anionGap: number | undefined;
    let deltaRatio: number | undefined;

    if (na && cl) {
      anionGap = na - cl - hco3;
      
      if (anionGap > 12 && primaryDisorder.includes('Acidose Metabólica')) {
        const deltaAG = anionGap - 12;
        const deltaHCO3 = 24 - hco3;
        deltaRatio = deltaAG / deltaHCO3;
      }
    }

    // Step 4: Assess oxygenation
    let oxygenation = '';
    let oxygenationStatus = '';

    if (pao2 >= 80) {
      oxygenationStatus = 'Normal';
      oxygenation = `PaO2 normal (${pao2} mmHg)`;
    } else if (pao2 >= 60) {
      oxygenationStatus = 'Hipoxemia Leve';
      oxygenation = `Hipoxemia leve (PaO2: ${pao2} mmHg)`;
    } else if (pao2 >= 40) {
      oxygenationStatus = 'Hipoxemia Moderada';
      oxygenation = `Hipoxemia moderada (PaO2: ${pao2} mmHg)`;
    } else {
      oxygenationStatus = 'Hipoxemia Severa';
      oxygenation = `Hipoxemia severa (PaO2: ${pao2} mmHg)`;
    }

    // Step 5: Assess electrolyte disturbances
    const electrolyteDisturbances: string[] = [];

    if (na) {
      if (na < 135) {
        electrolyteDisturbances.push(`Hiponatremia (Na+: ${na} mEq/L)`);
      } else if (na > 145) {
        electrolyteDisturbances.push(`Hipernatremia (Na+: ${na} mEq/L)`);
      }
    }

    if (k) {
      if (k < 3.5) {
        electrolyteDisturbances.push(`Hipocalemia (K+: ${k} mEq/L)`);
      } else if (k > 5.5) {
        electrolyteDisturbances.push(`Hipercalemia (K+: ${k} mEq/L)`);
      }
    }

    if (cl) {
      if (cl < 98) {
        electrolyteDisturbances.push(`Hipocloremia (Cl-: ${cl} mEq/L)`);
      } else if (cl > 106) {
        electrolyteDisturbances.push(`Hipercloremia (Cl-: ${cl} mEq/L)`);
      }
    }

    if (anionGap) {
      if (anionGap > 12) {
        electrolyteDisturbances.push(`Anion gap elevado (${anionGap.toFixed(1)} mEq/L)`);
      } else if (anionGap < 8) {
        electrolyteDisturbances.push(`Anion gap baixo (${anionGap.toFixed(1)} mEq/L)`);
      }
    }

    // Step 6: Clinical interpretation
    let clinicalInterpretation = '';
    
    if (primaryDisorder === 'Normal') {
      clinicalInterpretation = 'Gasometria arterial dentro dos parâmetros normais. Estado ácido-base equilibrado.';
    } else {
      clinicalInterpretation = `${primaryDisorder} com ${compensationStatus.toLowerCase()}. `;
      
      if (oxygenationStatus !== 'Normal') {
        clinicalInterpretation += `Associado a ${oxygenationStatus.toLowerCase()}. `;
      }
      
      if (electrolyteDisturbances.length > 0) {
        clinicalInterpretation += `Distúrbios eletrolíticos presentes.`;
      }
    }

    // Step 7: Possible diagnoses
    const possibleDiagnoses: string[] = [];

    if (primaryDisorder.includes('Acidose Metabólica')) {
      if (anionGap && anionGap > 12) {
        possibleDiagnoses.push('Cetoacidose diabética', 'Acidose láctica', 'Insuficiência renal', 'Intoxicação (metanol, etilenoglicol)', 'Acidose urêmica');
      } else {
        possibleDiagnoses.push('Diarreia', 'Acidose tubular renal', 'Uso de inibidores da anidrase carbônica', 'Ureterossigmoidostomia');
      }
    } else if (primaryDisorder.includes('Alcalose Metabólica')) {
      possibleDiagnoses.push('Vômitos/aspiração gástrica', 'Uso de diuréticos', 'Hiperaldosteronismo', 'Síndrome de Bartter/Gitelman');
    } else if (primaryDisorder.includes('Acidose Respiratória')) {
      if (compensationStatus.includes('Aguda')) {
        possibleDiagnoses.push('Depressão do SNC', 'Obstrução de vias aéreas', 'Pneumotórax', 'Edema pulmonar agudo');
      } else {
        possibleDiagnoses.push('DPOC', 'Fibrose pulmonar', 'Cifoescoliose', 'Síndrome da hipoventilação-obesidade');
      }
    } else if (primaryDisorder.includes('Alcalose Respiratória')) {
      if (compensationStatus.includes('Aguda')) {
        possibleDiagnoses.push('Ansiedade/hiperventilação', 'Dor', 'Hipoxemia', 'Embolia pulmonar');
      } else {
        possibleDiagnoses.push('Doença pulmonar intersticial', 'Residência em altitude', 'Gravidez', 'Cirrose hepática');
      }
    }

    if (oxygenationStatus.includes('Hipoxemia')) {
      possibleDiagnoses.push('Pneumonia', 'SARA', 'Embolia pulmonar', 'Shunt intrapulmonar', 'Edema pulmonar');
    }

    // Step 8: Recommendations
    const recommendations: string[] = [];

    if (primaryDisorder !== 'Normal') {
      recommendations.push('Tratar a causa subjacente do distúrbio ácido-base');
      
      if (primaryDisorder.includes('Acidose')) {
        recommendations.push('Monitorar função renal e eletrólitos');
        if (ph < 7.20) {
          recommendations.push('Considerar correção com bicarbonato se pH < 7,20 e acidose metabólica');
        }
      }
      
      if (primaryDisorder.includes('Respiratória')) {
        recommendations.push('Avaliar função pulmonar e vias aéreas');
        recommendations.push('Considerar suporte ventilatório se necessário');
      }
    }

    if (oxygenationStatus.includes('Hipoxemia')) {
      recommendations.push('Oxigenoterapia conforme necessário');
      if (pao2 < 60) {
        recommendations.push('Considerar suporte ventilatório não-invasivo ou invasivo');
      }
    }

    if (electrolyteDisturbances.length > 0) {
      recommendations.push('Corrigir distúrbios eletrolíticos identificados');
    }

    // Step 9: Additional tests
    const additionalTests: string[] = [
      'Gasometria arterial seriada para monitoramento',
      'Eletrólitos completos se não disponíveis',
      'Função renal (ureia, creatinina)',
      'Glicemia e cetonas (se acidose metabólica)',
      'Lactato sérico (se acidose metabólica com anion gap elevado)'
    ];

    if (oxygenationStatus.includes('Hipoxemia')) {
      additionalTests.push('Radiografia de tórax', 'Tomografia de tórax se indicada');
    }

    if (primaryDisorder.includes('Respiratória')) {
      additionalTests.push('Espirometria', 'Gasometria venosa para comparação');
    }

    return {
      primaryDisorder,
      primaryDisorderColor,
      compensation,
      compensationStatus,
      anionGap,
      deltaRatio,
      oxygenation,
      oxygenationStatus,
      electrolyteDisturbances,
      clinicalInterpretation,
      possibleDiagnoses,
      recommendations,
      additionalTests
    };
  };

  const handleCalculate = () => {
    if (!validateForm()) return;
    const result = calculateABG();
    setResult(result);
  };

  const resetCalculator = () => {
    setFormData({
      ph: '',
      paco2: '',
      pao2: '',
      hco3: '',
      be: '',
      na: '',
      k: '',
      cl: '',
    });
    setErrors({});
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Gasometria Arterial" type="calculator" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Wind size={20} color={theme.colors.calculator} /> Interpretação de Gasometria Arterial
            </Text>
            <Text style={styles.infoText}>
              Análise sistemática do estado ácido-base, compensação, distúrbios eletrolíticos e oxigenação. 
              Preencha os valores obrigatórios (pH, PaCO2, PaO2, HCO3-) e opcionalmente os eletrólitos para análise completa.
            </Text>
          </View>

          {!result ? (
            <>
              {/* Required Parameters */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                  <Activity size={20} color={theme.colors.calculator} /> Parâmetros Obrigatórios
                </Text>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>pH (Normal: 7,35-7,45)</Text>
                  <TextInput
                    style={[styles.input, errors.ph && styles.inputError]}
                    placeholder="Ex: 7.35"
                    keyboardType="decimal-pad"
                    value={formData.ph}
                    onChangeText={(value) => setFormData({ ...formData, ph: value })}
                  />
                  {errors.ph && (
                    <Text style={styles.errorText}>{errors.ph}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>PaCO2 (mmHg) (Normal: 35-45)</Text>
                  <TextInput
                    style={[styles.input, errors.paco2 && styles.inputError]}
                    placeholder="Ex: 40"
                    keyboardType="decimal-pad"
                    value={formData.paco2}
                    onChangeText={(value) => setFormData({ ...formData, paco2: value })}
                  />
                  {errors.paco2 && (
                    <Text style={styles.errorText}>{errors.paco2}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>PaO2 (mmHg) (Normal: 80-100)</Text>
                  <TextInput
                    style={[styles.input, errors.pao2 && styles.inputError]}
                    placeholder="Ex: 90"
                    keyboardType="decimal-pad"
                    value={formData.pao2}
                    onChangeText={(value) => setFormData({ ...formData, pao2: value })}
                  />
                  {errors.pao2 && (
                    <Text style={styles.errorText}>{errors.pao2}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>HCO3- (mEq/L) (Normal: 22-26)</Text>
                  <TextInput
                    style={[styles.input, errors.hco3 && styles.inputError]}
                    placeholder="Ex: 24"
                    keyboardType="decimal-pad"
                    value={formData.hco3}
                    onChangeText={(value) => setFormData({ ...formData, hco3: value })}
                  />
                  {errors.hco3 && (
                    <Text style={styles.errorText}>{errors.hco3}</Text>
                  )}
                </View>
              </View>

              {/* Optional Parameters */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                  <Droplets size={20} color={theme.colors.calculator} /> Parâmetros Opcionais
                </Text>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>BE - Base Excess (mEq/L) (Normal: -2 a +2)</Text>
                  <TextInput
                    style={[styles.input, errors.be && styles.inputError]}
                    placeholder="Ex: 0"
                    keyboardType="decimal-pad"
                    value={formData.be}
                    onChangeText={(value) => setFormData({ ...formData, be: value })}
                  />
                  {errors.be && (
                    <Text style={styles.errorText}>{errors.be}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Na+ (mEq/L) (Normal: 135-145)</Text>
                  <TextInput
                    style={[styles.input, errors.na && styles.inputError]}
                    placeholder="Ex: 140"
                    keyboardType="decimal-pad"
                    value={formData.na}
                    onChangeText={(value) => setFormData({ ...formData, na: value })}
                  />
                  {errors.na && (
                    <Text style={styles.errorText}>{errors.na}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>K+ (mEq/L) (Normal: 3,5-5,5)</Text>
                  <TextInput
                    style={[styles.input, errors.k && styles.inputError]}
                    placeholder="Ex: 4.0"
                    keyboardType="decimal-pad"
                    value={formData.k}
                    onChangeText={(value) => setFormData({ ...formData, k: value })}
                  />
                  {errors.k && (
                    <Text style={styles.errorText}>{errors.k}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Cl- (mEq/L) (Normal: 98-106)</Text>
                  <TextInput
                    style={[styles.input, errors.cl && styles.inputError]}
                    placeholder="Ex: 102"
                    keyboardType="decimal-pad"
                    value={formData.cl}
                    onChangeText={(value) => setFormData({ ...formData, cl: value })}
                  />
                  {errors.cl && (
                    <Text style={styles.errorText}>{errors.cl}</Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={styles.calculateButton}
                onPress={handleCalculate}
              >
                <Text style={styles.calculateButtonText}>Interpretar Gasometria</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.resultContainer}>
              {/* Primary Disorder */}
              <View style={[styles.resultCard, { borderColor: result.primaryDisorderColor }]}>
                <View style={[styles.resultHeader, { backgroundColor: result.primaryDisorderColor }]}>
                  <Wind size={32} color="white" />
                  <Text style={styles.resultTitle}>{result.primaryDisorder}</Text>
                </View>
                <View style={styles.resultContent}>
                  <Text style={styles.interpretationText}>{result.clinicalInterpretation}</Text>
                </View>
              </View>

              {/* Compensation */}
              <View style={styles.compensationCard}>
                <Text style={styles.compensationTitle}>
                  <Activity size={20} color={theme.colors.calculator} /> Compensação
                </Text>
                <Text style={styles.compensationStatus}>{result.compensationStatus}</Text>
                <Text style={styles.compensationText}>{result.compensation}</Text>
              </View>

              {/* Anion Gap and Delta Ratio */}
              {(result.anionGap !== undefined || result.deltaRatio !== undefined) && (
                <View style={styles.anionGapCard}>
                  <Text style={styles.anionGapTitle}>
                    <Zap size={20} color="#FF9800" /> Análise do Anion Gap
                  </Text>
                  {result.anionGap !== undefined && (
                    <Text style={styles.anionGapText}>
                      Anion Gap: {result.anionGap.toFixed(1)} mEq/L 
                      {result.anionGap > 12 ? ' (Elevado)' : result.anionGap < 8 ? ' (Baixo)' : ' (Normal)'}
                    </Text>
                  )}
                  {result.deltaRatio !== undefined && (
                    <Text style={styles.deltaRatioText}>
                      Delta Ratio: {result.deltaRatio.toFixed(2)}
                      {result.deltaRatio < 1 ? ' (Acidose hiperclorêmica concomitante)' : 
                       result.deltaRatio > 2 ? ' (Alcalose metabólica concomitante)' : ' (Acidose pura com anion gap)'}
                    </Text>
                  )}
                </View>
              )}

              {/* Oxygenation */}
              <View style={styles.oxygenationCard}>
                <Text style={styles.oxygenationTitle}>
                  <Heart size={20} color={result.oxygenationStatus === 'Normal' ? '#4CAF50' : '#F44336'} /> Oxigenação
                </Text>
                <Text style={[
                  styles.oxygenationText,
                  { color: result.oxygenationStatus === 'Normal' ? '#4CAF50' : '#F44336' }
                ]}>
                  {result.oxygenation}
                </Text>
              </View>

              {/* Electrolyte Disturbances */}
              {result.electrolyteDisturbances.length > 0 && (
                <View style={styles.electrolyteCard}>
                  <Text style={styles.electrolyteTitle}>
                    <Droplets size={20} color="#9C27B0" /> Distúrbios Eletrolíticos
                  </Text>
                  {result.electrolyteDisturbances.map((disturbance, index) => (
                    <Text key={index} style={styles.electrolyteText}>
                      • {disturbance}
                    </Text>
                  ))}
                </View>
              )}

              {/* Possible Diagnoses */}
              <View style={styles.diagnosesCard}>
                <Text style={styles.diagnosesTitle}>
                  <Info size={20} color={theme.colors.calculator} /> Possíveis Diagnósticos
                </Text>
                {result.possibleDiagnoses.map((diagnosis, index) => (
                  <Text key={index} style={styles.diagnosisText}>
                    • {diagnosis}
                  </Text>
                ))}
              </View>

              {/* Recommendations */}
              <View style={styles.recommendationsCard}>
                <Text style={styles.recommendationsTitle}>
                  <AlertTriangle size={20} color="#FF5722" /> Recomendações Clínicas
                </Text>
                {result.recommendations.map((recommendation, index) => (
                  <Text key={index} style={styles.recommendationText}>
                    • {recommendation}
                  </Text>
                ))}
              </View>

              {/* Additional Tests */}
              <View style={styles.testsCard}>
                <Text style={styles.testsTitle}>
                  <Activity size={20} color="#4CAF50" /> Exames Complementares Sugeridos
                </Text>
                {result.additionalTests.map((test, index) => (
                  <Text key={index} style={styles.testText}>
                    • {test}
                  </Text>
                ))}
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetCalculator}
              >
                <Text style={styles.resetButtonText}>Nova Interpretação</Text>
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
  interpretationText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  compensationCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  compensationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  compensationStatus: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  compensationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  anionGapCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  anionGapTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF9800',
    marginBottom: theme.spacing.md,
  },
  anionGapText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  deltaRatioText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  oxygenationCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  oxygenationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.md,
  },
  oxygenationText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    lineHeight: 20,
  },
  electrolyteCard: {
    backgroundColor: '#F3E5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#9C27B0',
  },
  electrolyteTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#9C27B0',
    marginBottom: theme.spacing.md,
  },
  electrolyteText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  diagnosesCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  diagnosesTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  diagnosisText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
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
  testsCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  testsTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.md,
  },
  testText: {
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
  },
  resetButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
});