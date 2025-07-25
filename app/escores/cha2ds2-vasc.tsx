import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Activity, Heart, TriangleAlert as AlertTriangle, Info, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';

interface CHA2DS2VAScFactors {
  congestiveHeartFailure: boolean;
  hypertension: boolean;
  age75orOlder: boolean;
  diabetes: boolean;
  stroke: boolean;
  vascularDisease: boolean;
  age65to74: boolean;
  sexFemale: boolean;
}

interface RiskAssessment {
  score: number;
  riskLevel: 'low' | 'moderate' | 'high';
  riskPercentage: string;
  recommendation: string;
  anticoagulationRecommended: boolean;
  considerations: string[];
}

const initialFactors: CHA2DS2VAScFactors = {
  congestiveHeartFailure: false,
  hypertension: false,
  age75orOlder: false,
  diabetes: false,
  stroke: false,
  vascularDisease: false,
  age65to74: false,
  sexFemale: false,
};

export default function CHA2DS2VAScScreen() {
  const [factors, setFactors] = useState<CHA2DS2VAScFactors>(initialFactors);
  const [showResult, setShowResult] = useState(false);

  const calculateScore = (): number => {
    let score = 0;
    
    // C - Congestive heart failure (1 point)
    if (factors.congestiveHeartFailure) score += 1;
    
    // H - Hypertension (1 point)
    if (factors.hypertension) score += 1;
    
    // A2 - Age ≥75 years (2 points)
    if (factors.age75orOlder) score += 2;
    
    // D - Diabetes mellitus (1 point)
    if (factors.diabetes) score += 1;
    
    // S2 - Stroke/TIA/thromboembolism (2 points)
    if (factors.stroke) score += 2;
    
    // V - Vascular disease (1 point)
    if (factors.vascularDisease) score += 1;
    
    // A - Age 65-74 years (1 point)
    if (factors.age65to74 && !factors.age75orOlder) score += 1;
    
    // Sc - Sex category (female) (1 point)
    if (factors.sexFemale) score += 1;
    
    return score;
  };

  const getRiskAssessment = (score: number): RiskAssessment => {
    if (score === 0) {
      return {
        score,
        riskLevel: 'low',
        riskPercentage: '0%',
        recommendation: 'Nenhuma terapia antitrombótica recomendada',
        anticoagulationRecommended: false,
        considerations: [
          'Risco muito baixo de AVC',
          'Reavaliação anual recomendada',
          'Considerar fatores de risco adicionais'
        ]
      };
    } else if (score === 1) {
      return {
        score,
        riskLevel: 'low',
        riskPercentage: '1.3%',
        recommendation: 'Considerar anticoagulação oral (preferível) ou aspirina',
        anticoagulationRecommended: true,
        considerations: [
          'Risco baixo, mas presente',
          'Anticoagulação oral preferível à aspirina',
          'Avaliar risco de sangramento (HAS-BLED)',
          'Discussão compartilhada com o paciente'
        ]
      };
    } else if (score === 2) {
      return {
        score,
        riskLevel: 'moderate',
        riskPercentage: '2.2%',
        recommendation: 'Anticoagulação oral recomendada',
        anticoagulationRecommended: true,
        considerations: [
          'Risco moderado de AVC',
          'Anticoagulação oral claramente indicada',
          'Avaliar risco de sangramento (HAS-BLED)',
          'Monitoramento regular necessário'
        ]
      };
    } else {
      const riskPercentages: { [key: number]: string } = {
        3: '3.2%',
        4: '4.0%',
        5: '6.7%',
        6: '9.8%',
        7: '9.6%',
        8: '6.7%',
        9: '15.2%'
      };
      
      return {
        score,
        riskLevel: 'high',
        riskPercentage: riskPercentages[score] || '>10%',
        recommendation: 'Anticoagulação oral fortemente recomendada',
        anticoagulationRecommended: true,
        considerations: [
          'Alto risco de AVC',
          'Anticoagulação oral obrigatória (exceto contraindicações)',
          'Avaliar cuidadosamente risco de sangramento',
          'Monitoramento rigoroso necessário',
          'Considerar DOACs como primeira linha'
        ]
      };
    }
  };

  const toggleFactor = (factor: keyof CHA2DS2VAScFactors) => {
    // Special handling for age groups - they are mutually exclusive
    if (factor === 'age75orOlder' && !factors.age75orOlder) {
      setFactors(prev => ({
        ...prev,
        age75orOlder: true,
        age65to74: false
      }));
    } else if (factor === 'age65to74' && !factors.age65to74) {
      setFactors(prev => ({
        ...prev,
        age65to74: true,
        age75orOlder: false
      }));
    } else {
      setFactors(prev => ({
        ...prev,
        [factor]: !prev[factor]
      }));
    }
  };

  const handleCalculate = () => {
    setShowResult(true);
  };

  const resetCalculator = () => {
    setFactors(initialFactors);
    setShowResult(false);
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
      key: 'congestiveHeartFailure' as keyof CHA2DS2VAScFactors,
      label: 'C',
      title: 'Insuficiência Cardíaca Congestiva',
      description: 'História de ICC ou disfunção sistólica do VE',
      points: 1
    },
    {
      key: 'hypertension' as keyof CHA2DS2VAScFactors,
      label: 'H',
      title: 'Hipertensão',
      description: 'História de hipertensão ou PA >140/90 mmHg',
      points: 1
    },
    {
      key: 'age75orOlder' as keyof CHA2DS2VAScFactors,
      label: 'A₂',
      title: 'Idade ≥75 anos',
      description: 'Idade igual ou superior a 75 anos',
      points: 2
    },
    {
      key: 'diabetes' as keyof CHA2DS2VAScFactors,
      label: 'D',
      title: 'Diabetes Mellitus',
      description: 'História de diabetes ou glicemia de jejum >125 mg/dL',
      points: 1
    },
    {
      key: 'stroke' as keyof CHA2DS2VAScFactors,
      label: 'S₂',
      title: 'AVC/AIT/Tromboembolismo',
      description: 'História prévia de AVC, AIT ou embolia sistêmica',
      points: 2
    },
    {
      key: 'vascularDisease' as keyof CHA2DS2VAScFactors,
      label: 'V',
      title: 'Doença Vascular',
      description: 'IAM prévio, doença arterial periférica ou placa aórtica',
      points: 1
    },
    {
      key: 'age65to74' as keyof CHA2DS2VAScFactors,
      label: 'A',
      title: 'Idade 65-74 anos',
      description: 'Idade entre 65 e 74 anos',
      points: 1
    },
    {
      key: 'sexFemale' as keyof CHA2DS2VAScFactors,
      label: 'Sc',
      title: 'Sexo Feminino',
      description: 'Categoria de sexo feminino',
      points: 1
    }
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="CHA₂DS₂-VASc Score" type="score" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Activity size={20} color={theme.colors.success} /> Sobre o CHA₂DS₂-VASc
            </Text>
            <Text style={styles.infoText}>
              O escore CHA₂DS₂-VASc é usado para avaliar o risco de AVC em pacientes com fibrilação atrial e determinar a necessidade de anticoagulação. 
              Cada fator de risco contribui com pontos específicos para o cálculo do risco total.
            </Text>
          </View>

          {!showResult ? (
            <>
              <Text style={styles.instructionText}>
                Selecione os fatores de risco presentes no paciente:
              </Text>

              <View style={styles.factorsContainer}>
                {factorItems.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.factorCard,
                      factors[item.key] && styles.factorCardSelected
                    ]}
                    onPress={() => toggleFactor(item.key)}
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
                          {item.label}
                        </Text>
                      </View>
                      <View style={styles.factorPoints}>
                        <Text style={styles.factorPointsText}>
                          {item.points} pt{item.points > 1 ? 's' : ''}
                        </Text>
                      </View>
                      <View style={styles.factorCheckbox}>
                        {factors[item.key] ? (
                          <CheckCircle size={24} color={theme.colors.success} />
                        ) : (
                          <XCircle size={24} color={theme.colors.border} />
                        )}
                      </View>
                    </View>
                    <Text style={styles.factorTitle}>{item.title}</Text>
                    <Text style={styles.factorDescription}>{item.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.scorePreview}>
                <Text style={styles.scorePreviewText}>
                  Pontuação Atual: <Text style={styles.scorePreviewNumber}>{score}</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={styles.calculateButton}
                onPress={handleCalculate}
              >
                <Text style={styles.calculateButtonText}>Calcular Risco</Text>
              </TouchableOpacity>
            </>
          ) : (
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
                    CHA₂DS₂-VASc: {riskAssessment.score}
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
                    Risco anual de AVC: <Text style={styles.riskPercentageValue}>
                      {riskAssessment.riskPercentage}
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={[
                styles.recommendationCard,
                { borderColor: riskAssessment.anticoagulationRecommended ? theme.colors.success : theme.colors.warning }
              ]}>
                <Text style={styles.recommendationTitle}>
                  <Heart size={20} color={riskAssessment.anticoagulationRecommended ? theme.colors.success : theme.colors.warning} />
                  {' '}Recomendação Terapêutica
                </Text>
                <Text style={styles.recommendationText}>
                  {riskAssessment.recommendation}
                </Text>
                
                {riskAssessment.anticoagulationRecommended && (
                  <View style={styles.anticoagulationInfo}>
                    <Text style={styles.anticoagulationTitle}>Opções de Anticoagulação:</Text>
                    <Text style={styles.anticoagulationOption}>
                      • DOACs (Dabigatrana, Rivaroxabana, Apixabana, Edoxabana) - Primeira linha
                    </Text>
                    <Text style={styles.anticoagulationOption}>
                      • Varfarina (INR alvo 2,0-3,0) - Alternativa
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
                  <AlertTriangle size={20} color="#FF5722" /> Importante
                </Text>
                <Text style={styles.warningText}>
                  • Sempre avaliar o risco de sangramento (escore HAS-BLED){'\n'}
                  • Considerar contraindicações para anticoagulação{'\n'}
                  • Reavaliação periódica do risco-benefício{'\n'}
                  • Discussão compartilhada com o paciente sobre riscos e benefícios
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
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.success,
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
    marginRight: theme.spacing.sm,
    minWidth: 32,
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
  factorPoints: {
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: 'auto',
  },
  factorPointsText: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.textSecondary,
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
  scorePreview: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scorePreviewText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  scorePreviewNumber: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.success,
  },
  calculateButton: {
    backgroundColor: theme.colors.success,
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
  anticoagulationInfo: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  anticoagulationTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  anticoagulationOption: {
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