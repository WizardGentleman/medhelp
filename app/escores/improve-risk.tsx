import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Activity, Heart, TriangleAlert as AlertTriangle, Info, CircleCheck as CheckCircle, Circle as XCircle, Droplets, ChevronDown, ChevronUp } from 'lucide-react-native';

interface ImproveFactors {
  activeGastrointestinalUlcer: boolean;
  recentBleeding: boolean;
  plateletCount: boolean;
  elderlyAge: boolean;
  liverDysfunction: boolean;
  severeRenalInsufficiency: boolean;
  icuAdmission: boolean;
  centralVenousCatheter: boolean;
  rheumatoidCondition: boolean;
  activeCancer: boolean;
  ageBetween40And84: boolean;
  maleSex: boolean;
  moderateRenalInsufficiency: boolean;
}

interface RiskAssessment {
  score: number;
  riskLevel: 'low' | 'moderate' | 'high';
  riskPercentage: string;
  recommendation: string;
  considerations: string[];
}

const initialFactors: ImproveFactors = {
  activeGastrointestinalUlcer: false,
  recentBleeding: false,
  plateletCount: false,
  elderlyAge: false,
  liverDysfunction: false,
  severeRenalInsufficiency: false,
  icuAdmission: false,
  centralVenousCatheter: false,
  rheumatoidCondition: false,
  activeCancer: false,
  ageBetween40And84: false,
  maleSex: false,
  moderateRenalInsufficiency: false,
};

export default function ImproveRiskScreen() {
  const [factors, setFactors] = useState<ImproveFactors>(initialFactors);
  const [isReferenceExpanded, setIsReferenceExpanded] = useState(false);

  const calculateScore = (): number => {
    let score = 0;
    
    if (factors.activeGastrointestinalUlcer) score += 4.5;
    if (factors.recentBleeding) score += 4;
    if (factors.plateletCount) score += 4;
    if (factors.elderlyAge) score += 3.5;
    if (factors.liverDysfunction) score += 2.5;
    if (factors.severeRenalInsufficiency) score += 2.5;
    if (factors.icuAdmission) score += 2.5;
    if (factors.centralVenousCatheter) score += 2;
    if (factors.rheumatoidCondition) score += 2;
    if (factors.activeCancer) score += 2;
    if (factors.ageBetween40And84 && !factors.elderlyAge) score += 1.5;
    if (factors.maleSex) score += 1;
    if (factors.moderateRenalInsufficiency && !factors.severeRenalInsufficiency) score += 1;
    
    return score;
  };

  const getRiskAssessment = (score: number): RiskAssessment => {
    if (score < 7) {
      return {
        score,
        riskLevel: 'low',
        riskPercentage: '0.4%',
        recommendation: 'Manter anticoagulação com monitorização padrão',
        considerations: [
          'Taxa de sangramento maior: 0.4%',
          'Taxa de qualquer sangramento: 1.5%',
          'Continuar com a terapia anticoagulante conforme indicação clínica',
          'Realizar monitoramento de rotina dos parâmetros de coagulação',
          'Observar sinais de sangramento durante a internação',
          'Reavaliar o escore se houver mudança no quadro clínico'
        ]
      };
    } else {
      return {
        score,
        riskLevel: 'high',
        riskPercentage: '4.1%',
        recommendation: 'Alto risco - Evitar anticoagulação quando possível',
        considerations: [
          'Taxa de sangramento maior: 4.1%',
          'Taxa de qualquer sangramento: 7.9%',
          'Priorizar métodos não farmacológicos de profilaxia',
          'Se anticoagulação for absolutamente necessária:',
          'Corrigir fatores de risco modificáveis primeiro',
          'Usar a menor dose eficaz possível',
          'Implementar monitorização intensiva para sangramento',
          'Considerar consulta com hematologia'
        ]
      };
    }
  };

  const toggleFactor = (factor: keyof ImproveFactors) => {
    // Special handling for age groups - they are mutually exclusive
    if (factor === 'elderlyAge' && !factors.elderlyAge) {
      setFactors(prev => ({
        ...prev,
        elderlyAge: true,
        ageBetween40And84: false
      }));
    } else if (factor === 'ageBetween40And84' && !factors.ageBetween40And84) {
      setFactors(prev => ({
        ...prev,
        ageBetween40And84: true,
        elderlyAge: false
      }));
    } else if (factor === 'severeRenalInsufficiency' && !factors.severeRenalInsufficiency) {
      setFactors(prev => ({
        ...prev,
        severeRenalInsufficiency: true,
        moderateRenalInsufficiency: false
      }));
    } else if (factor === 'moderateRenalInsufficiency' && !factors.moderateRenalInsufficiency) {
      setFactors(prev => ({
        ...prev,
        moderateRenalInsufficiency: true,
        severeRenalInsufficiency: false
      }));
    } else {
      setFactors(prev => ({
        ...prev,
        [factor]: !prev[factor]
      }));
    }
  };

  const resetCalculator = () => {
    setFactors(initialFactors);
  };

  const score = calculateScore();
  const riskAssessment = getRiskAssessment(score);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '#4CAF50';
      case 'moderate': return '#FF9800';
      case 'high': return '#F44336';
      default: return theme.colors.text;
    }
  };

  const factorItems = [
    {
      key: 'activeGastrointestinalUlcer' as keyof ImproveFactors,
      title: 'Úlcera gastroduodenal ativa',
      description: 'Evidência de úlcera ativa no momento da internação',
      points: 4.5
    },
    {
      key: 'recentBleeding' as keyof ImproveFactors,
      title: 'Hemorragia três meses antes da internação',
      description: 'Qualquer sangramento clinicamente significativo nos últimos 3 meses',
      points: 4
    },
    {
      key: 'plateletCount' as keyof ImproveFactors,
      title: 'Plaquetas < 50.000 mm³',
      description: 'Plaquetopenia severa',
      points: 4
    },
    {
      key: 'elderlyAge' as keyof ImproveFactors,
      title: 'Idade ≥ 85 anos',
      description: 'Idade igual ou superior a 85 anos',
      points: 3.5
    },
    {
      key: 'ageBetween40And84' as keyof ImproveFactors,
      title: 'Idade 40-84 anos',
      description: 'Idade entre 40 e 84 anos',
      points: 1.5
    },
    {
      key: 'liverDysfunction' as keyof ImproveFactors,
      title: 'Insuficiência hepática (RNI > 1,5)',
      description: 'Razão Normalizada Internacional > 1,5',
      points: 2.5
    },
    {
      key: 'moderateRenalInsufficiency' as keyof ImproveFactors,
      title: 'Insuficiência renal (TFG 30-59 mL/min)',
      description: '',
      points: 1
    },
    {
      key: 'severeRenalInsufficiency' as keyof ImproveFactors,
      title: 'Insuficiência renal (TFG < 30 mL/min)',
      description: '',
      points: 2.5
    },
    {
      key: 'icuAdmission' as keyof ImproveFactors,
      title: 'Internação em unidade de terapia intensiva',
      description: 'Paciente internado em UTI',
      points: 2.5
    },
    {
      key: 'centralVenousCatheter' as keyof ImproveFactors,
      title: 'Cateter venoso central',
      description: 'Presença de cateter venoso central',
      points: 2
    },
    {
      key: 'rheumatoidCondition' as keyof ImproveFactors,
      title: 'Doença reumatológica',
      description: 'Artrite reumatoide, lúpus ou outras doenças autoimunes',
      points: 2
    },
    {
      key: 'activeCancer' as keyof ImproveFactors,
      title: 'Câncer ativo',
      description: 'Evidência ativa nos últimos 6 meses',
      points: 2
    },
    {
      key: 'maleSex' as keyof ImproveFactors,
      title: 'Sexo masculino',
      description: '',
      points: 1
    },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="IMPROVE - Risco de Sangramento" type="score" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Droplets size={20} color={theme.colors.emergency} /> Sobre o Escore IMPROVE
            </Text>
            <Text style={styles.infoText}>
              O IMPROVE Bleeding Risk Score é uma ferramenta validada para avaliar o risco de sangramento maior 
              em pacientes clínicos hospitalizados em uso de profilaxia farmacológica para tromboembolismo venoso (TEV).
              {' '}
              Foi desenvolvido a partir de dados de mais de 15.000 pacientes e identifica aqueles com maior risco 
              de complicações hemorrágicas durante a internação.
            </Text>
          </View>

          <Text style={styles.instructionText}>
            Selecione os fatores de risco presentes no paciente:
          </Text>

          <View style={styles.factorsContainer}>
            {factorItems.map((item) => {
              // Check if this age option should be disabled
              const isAgeOption = item.key === 'elderlyAge' || item.key === 'ageBetween40And84';
              const otherAgeSelected = isAgeOption && (
                (item.key === 'elderlyAge' && factors.ageBetween40And84) ||
                (item.key === 'ageBetween40And84' && factors.elderlyAge)
              );
              
              // Check if this renal option should be disabled
              const isRenalOption = item.key === 'moderateRenalInsufficiency' || item.key === 'severeRenalInsufficiency';
              const otherRenalSelected = isRenalOption && (
                (item.key === 'moderateRenalInsufficiency' && factors.severeRenalInsufficiency) ||
                (item.key === 'severeRenalInsufficiency' && factors.moderateRenalInsufficiency)
              );
              
              const isDisabled = otherAgeSelected || otherRenalSelected;
              
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.factorCard,
                    factors[item.key] && styles.factorCardSelected,
                    isDisabled && styles.factorCardDisabled
                  ]}
                  onPress={() => !isDisabled && toggleFactor(item.key)}
                  disabled={isDisabled}
                >
                <View style={styles.factorHeader}>
                  <View style={[
                    styles.factorLabel,
                    factors[item.key] && styles.factorLabelSelected
                  ]}>
                    <Text style={[
                      styles.factorLabelText,
                      factors[item.key] && styles.factorLabelTextSelected
                    ]}>
                      {item.points} pt{item.points > 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={styles.factorCheckbox}>
                    {factors[item.key] ? (
                      <CheckCircle size={24} color={theme.colors.success} />
                    ) : (
                      <XCircle size={24} color={isDisabled ? '#CCCCCC' : theme.colors.border} />
                    )}
                  </View>
                </View>
                <Text style={[
                  styles.factorTitle,
                  isDisabled && styles.factorTitleDisabled
                ]}>{item.title}</Text>
                {item.description ? (
                  <Text style={[
                    styles.factorDescription,
                    isDisabled && styles.factorDescriptionDisabled
                  ]}>{item.description}</Text>
                ) : null}
                  {isDisabled && (
                    <Text style={styles.disabledHint}>
                      {isAgeOption ? 'Desmarque a outra opção de idade para selecionar esta' : 
                       'Desmarque a outra opção de insuficiência renal para selecionar esta'}
                    </Text>
                  )}
              </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.resultContainer}>
            <View style={[
              styles.scoreResultCard,
              { borderColor: getRiskColor(riskAssessment.riskLevel) }
            ]}>
              <View style={[
                styles.scoreResultHeader,
                { backgroundColor: getRiskColor(riskAssessment.riskLevel) }
              ]}>
                <Text style={styles.scoreResultNumber}>
                  Escore IMPROVE: {riskAssessment.score}
                </Text>
              </View>
              <View style={styles.scoreResultContent}>
                <Text style={styles.riskLevelText}>
                  Risco: <Text style={[
                    styles.riskLevelValue,
                    { color: getRiskColor(riskAssessment.riskLevel) }
                  ]}>
                    {riskAssessment.riskLevel === 'low' ? 'Baixo' : 
                     riskAssessment.riskLevel === 'moderate' ? 'Moderado' : 'Alto'}
                  </Text>
                </Text>
                <Text style={styles.riskPercentageText}>
                  Risco de sangramento maior: <Text style={styles.riskPercentageValue}>
                    {riskAssessment.riskPercentage}
                  </Text>
                </Text>
              </View>
            </View>

            <View style={[
              styles.recommendationCard,
              { borderColor: getRiskColor(riskAssessment.riskLevel) }
            ]}>
              <Text style={styles.recommendationTitle}>
                <Heart size={20} color={getRiskColor(riskAssessment.riskLevel)} />
                {' '}Recomendação Clínica
              </Text>
              <Text style={styles.recommendationText}>
                {riskAssessment.recommendation}
              </Text>
              
              {riskAssessment.riskLevel === 'high' && (
                <View style={styles.prophylaxisInfo}>
                  <Text style={styles.prophylaxisTitle}>Intervenções não farmacológicas recomendadas:</Text>
                  <Text style={styles.prophylaxisOption}>
                    • Compressão pneumática intermitente (CPI)
                  </Text>
                  <Text style={styles.prophylaxisOption}>
                    • Meias elásticas de compressão graduada
                  </Text>
                  <Text style={styles.prophylaxisOption}>
                    • Mobilização precoce e fisioterapia
                  </Text>
                  <Text style={styles.prophylaxisOption}>
                    • Hidratação adequada
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.considerationsCard}>
              <Text style={styles.considerationsTitle}>
                <Info size={20} color={theme.colors.calculator} /> Considerações Clínicas
              </Text>
              {riskAssessment.considerations.map((consideration, index) => (
                <Text key={index} style={styles.considerationText}>
                  • {consideration}
                </Text>
              ))}
            </View>

            <View style={styles.warningCard}>
              <Text style={styles.warningTitle}>
                <AlertTriangle size={20} color="#FF5722" /> Definições de Sangramento
              </Text>
              <Text style={styles.warningText}>
                <Text style={styles.warningSubtitle}>Sangramento Maior:</Text>{' '}
                Sangramento fatal e/ou sintomático em área ou órgão crítico e/ou sangramento que resulte em queda de Hb ≥2g/dL ou leve à transfusão de ≥2 concentrados de hemácias.
                {'\n\n'}
                <Text style={styles.warningSubtitle}>Sangramento Clinicamente Relevante:</Text>{' '}
                Hemorragia gastrointestinal, hematúria macroscópica >24h, epistaxe substancial com necessidade de intervenção, epistaxe recorrente ou ≥5 min, hematomas extensos (>5cm), sangramento intra-articular, menorragia/metrorragia ou outro sangramento importante que necessite intervenção médica.
              </Text>
            </View>
            
            <View style={styles.infoWarningCard}>
              <Text style={styles.infoWarningTitle}>
                <Info size={20} color={theme.colors.calculator} /> Observações Importantes
              </Text>
              <Text style={styles.infoWarningText}>
                • Ponto de corte: Escore ≥7 indica alto risco{' '}
                • Este escore avalia risco de sangramento, não de TEV{' '}
                • Usar em conjunto com escores de risco trombótico{' '}
                • Sempre individualizar a decisão clínica
              </Text>
            </View>

            <TouchableOpacity
              style={styles.referenceCard}
              onPress={() => setIsReferenceExpanded(!isReferenceExpanded)}
            >
              <View style={styles.referenceHeader}>
                <Text style={styles.referenceTitle}>
                  <Info size={20} color={theme.colors.primary} /> Referência Bibliográfica
                </Text>
                {isReferenceExpanded ? (
                  <ChevronUp size={20} color={theme.colors.primary} />
                ) : (
                  <ChevronDown size={20} color={theme.colors.primary} />
                )}
              </View>
              {isReferenceExpanded && (
                <Text style={styles.referenceText}>
                  Decousus H, Tapson VF, Bergmann JF, et al. Factors at admission associated with bleeding risk in medical patients: findings from the IMPROVE investigators. Chest. 2011;139(1):69-79.
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetCalculator}
            >
              <Text style={styles.resetButtonText}>Limpar Seleção</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#FFF3E0',
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
  instructionText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  factorsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  factorCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  factorCardSelected: {
    borderColor: theme.colors.success,
    backgroundColor: '#F0FFF4',
  },
  factorCardDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    opacity: 0.6,
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  factorLabel: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: 'auto',
    minWidth: 50,
    alignItems: 'center',
  },
  factorLabelSelected: {
    backgroundColor: theme.colors.success,
  },
  factorLabelText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  factorLabelTextSelected: {
    color: 'white',
  },
  factorCheckbox: {
    marginLeft: theme.spacing.sm,
  },
  factorTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  factorDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  factorTitleDisabled: {
    color: '#AAAAAA',
  },
  factorDescriptionDisabled: {
    color: '#CCCCCC',
  },
  disabledHint: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#FF9800',
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  resultContainer: {
    gap: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  scoreResultCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
  },
  scoreResultHeader: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  scoreResultNumber: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  scoreResultContent: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  riskLevelText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  riskLevelValue: {
    fontFamily: 'Roboto-Bold',
  },
  riskPercentageText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
  },
  riskPercentageValue: {
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
  },
  recommendationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  recommendationText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  prophylaxisInfo: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  prophylaxisTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  prophylaxisOption: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  considerationsCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  considerationsTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  considerationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
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
    lineHeight: 18,
  },
  warningSubtitle: {
    fontFamily: 'Roboto-Bold',
    color: '#FF5722',
  },
  infoWarningCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  infoWarningTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  infoWarningText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  referenceCard: {
    backgroundColor: '#F8F9FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  referenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referenceTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.primary,
  },
  referenceText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
    marginTop: theme.spacing.md,
    fontStyle: 'italic',
  },
  resetButton: {
    backgroundColor: theme.colors.success,
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

