import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Activity, Heart, TriangleAlert as AlertTriangle, Info, CircleCheck as CheckCircle, Circle as XCircle, ChevronDown, ChevronUp } from 'lucide-react-native';

interface PaduaFactors {
  activeCancer: boolean;
  previousVTE: boolean;
  reducedMobility: boolean;
  traumaSurgery: boolean;
  elderlyAge: boolean;
  heartFailureOrRespiratoryFailure: boolean;
  acuteInfectionOrRheumatologicDisorder: boolean;
  obesity: boolean;
  hormoneTreatment: boolean;
  thrombophilia: boolean;
  acuteMIorStroke: boolean;
}

interface RiskAssessment {
  score: number;
  riskLevel: 'low' | 'high';
  riskPercentage: string;
  recommendation: string;
  prophylaxisRecommended: boolean;
  considerations: string[];
}

const initialFactors: PaduaFactors = {
  activeCancer: false,
  previousVTE: false,
  reducedMobility: false,
  traumaSurgery: false,
  elderlyAge: false,
  heartFailureOrRespiratoryFailure: false,
  acuteInfectionOrRheumatologicDisorder: false,
  obesity: false,
  hormoneTreatment: false,
  thrombophilia: false,
  acuteMIorStroke: false,
};

export default function PaduaRiskScreen() {
  const [factors, setFactors] = useState<PaduaFactors>(initialFactors);
  const [isReferenceExpanded, setIsReferenceExpanded] = useState(false);

  const calculateScore = (): number => {
    let score = 0;
    
    if (factors.activeCancer) score += 3;
    if (factors.previousVTE) score += 3;
    if (factors.reducedMobility) score += 3;
    if (factors.thrombophilia) score += 3;
    if (factors.traumaSurgery) score += 2;
    if (factors.elderlyAge) score += 1;
    if (factors.heartFailureOrRespiratoryFailure) score += 1;
    if (factors.acuteInfectionOrRheumatologicDisorder) score += 1;
    if (factors.obesity) score += 1;
    if (factors.hormoneTreatment) score += 1;
    if (factors.acuteMIorStroke) score += 1;
    
    return score;
  };

  const getRiskAssessment = (score: number): RiskAssessment => {
    if (score < 4) {
      return {
        score,
        riskLevel: 'low',
        riskPercentage: '<0.5%',
        recommendation: 'Profilaxia farmacológica NÃO recomendada',
        prophylaxisRecommended: false,
        considerations: [
          'Baixo risco de TEV',
          'Estimulação de deambulação precoce quando possível e/ou fisioterapia motora',
          'Reavaliação a cada 48 horas do risco OU imediata se mudança significativa do quadro',
          'Sem evidência de benefício de profilaxia mecânica'
        ]
      };
    } else {
      return {
        score,
        riskLevel: 'high',
        riskPercentage: '11%',
        recommendation: 'Profilaxia farmacológica RECOMENDADA',
        prophylaxisRecommended: true,
        considerations: [
          'Alto risco de TEV',
          'Iniciar profilaxia farmacológica o quanto antes',
          'Avaliar contraindicações para anticoagulação',
          'Considerar profilaxia mecânica adicional',
          'Monitoramento regular necessário',
          'Manter profilaxia durante toda a internação'
        ]
      };
    }
  };

  const toggleFactor = (factor: keyof PaduaFactors) => {
    setFactors(prev => ({
      ...prev,
      [factor]: !prev[factor]
    }));
  };

  const resetCalculator = () => {
    setFactors(initialFactors);
  };

  const score = calculateScore();
  const riskAssessment = getRiskAssessment(score);

  const getRiskColor = (riskLevel: string) => {
    return riskLevel === 'low' ? '#4CAF50' : '#F44336';
  };

  const factorItems = [
    {
      key: 'activeCancer' as keyof PaduaFactors,
      title: 'Câncer Ativo',
      description: 'Metástases locais ou à distância e/ou quimioterapia ou radioterapia nos últimos 6 meses',
      points: 3
    },
    {
      key: 'previousVTE' as keyof PaduaFactors,
      title: 'TEV Prévio',
      description: 'História prévia de tromboembolismo venoso (excluindo trombose superficial)',
      points: 3
    },
    {
      key: 'reducedMobility' as keyof PaduaFactors,
      title: 'Mobilidade Reduzida',
      description: 'Repouso no leito com banheiro permitido por pelo menos 3 dias',
      points: 3
    },
    {
      key: 'thrombophilia' as keyof PaduaFactors,
      title: 'Condição Trombofílica Conhecida',
      description: 'Alguma condição trombofílica conhecida',
      points: 3
    },
    {
      key: 'traumaSurgery' as keyof PaduaFactors,
      title: 'Trauma e/ou Cirurgia Recente',
      description: 'Trauma e/ou cirurgia recente (≤1 mês)',
      points: 2
    },
    {
      key: 'elderlyAge' as keyof PaduaFactors,
      title: 'Idade ≥70 anos',
      description: '',
      points: 1
    },
    {
      key: 'heartFailureOrRespiratoryFailure' as keyof PaduaFactors,
      title: 'Insuficiência Cardíaca/Respiratória',
      description: '',
      points: 1
    },
    {
      key: 'acuteInfectionOrRheumatologicDisorder' as keyof PaduaFactors,
      title: 'Infecção Aguda/Doença Reumatológica',
      description: 'Infecção = em uso de antibioticoterapia',
      points: 1
    },
    {
      key: 'obesity' as keyof PaduaFactors,
      title: 'Obesidade',
      description: 'IMC ≥30 kg/m²',
      points: 1
    },
    {
      key: 'hormoneTreatment' as keyof PaduaFactors,
      title: 'Tratamento Hormonal Contínuo',
      description: 'Uso de terapia hormonal ou contraceptivos orais',
      points: 1
    },
    {
      key: 'acuteMIorStroke' as keyof PaduaFactors,
      title: 'IAM ou AVC Isquêmico Agudo',
      description: 'Motivo da internação ou intercorrência durante internação',
      points: 1
    }
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Pádua - Risco de TEV" type="score" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Activity size={20} color={theme.colors.success} /> Sobre o Escore de Pádua
            </Text>
            <Text style={styles.infoText}>
              O Escore de Pádua é usado para avaliar o risco de tromboembolismo venoso (TEV) em pacientes clínicos hospitalizados.
              Um escore ≥4 pontos indica alto risco e necessidade de profilaxia farmacológica.
              {' '}
              Desenvolvido para estratificação de risco em enfermarias de clínica médica geral, este escore não possui validação para populações específicas como pacientes críticos em UTI.
              A ferramenta deve ser utilizada como orientação complementar, não substituindo a avaliação clínica individualizada do médico assistente.
            </Text>
          </View>

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
                    {item.description ? <Text style={styles.factorDescription}>{item.description}</Text> : null}
                  </TouchableOpacity>
                ))}
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
                    Escore de Pádua: {riskAssessment.score}
                  </Text>
                </View>
                <View style={styles.scoreResultContent}>
                  <Text style={styles.riskLevelText}>
                    Risco: <Text style={[
                      styles.riskLevelValue,
                      { color: getRiskColor(riskAssessment.riskLevel) }
                    ]}>
                      {riskAssessment.riskLevel === 'low' ? 'Baixo' : 'Alto'}
                    </Text>
                  </Text>
                  <Text style={styles.riskPercentageText}>
                    Incidência de TEV sem profilaxia: <Text style={styles.riskPercentageValue}>
                      {riskAssessment.riskPercentage}
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={[
                styles.recommendationCard,
                { borderColor: riskAssessment.prophylaxisRecommended ? theme.colors.emergency : theme.colors.success }
              ]}>
                <Text style={styles.recommendationTitle}>
                  <Heart size={20} color={riskAssessment.prophylaxisRecommended ? theme.colors.emergency : theme.colors.success} />
                  {' '}Recomendação de Profilaxia
                </Text>
                <Text style={styles.recommendationText}>
                  {riskAssessment.recommendation}
                </Text>
                
                {riskAssessment.prophylaxisRecommended && (
                  <View>
                    {/* Card 1: Opções Básicas de Profilaxia - Amarelo */}
                    <View style={styles.prophylaxisInfo}>
                      <Text style={styles.prophylaxisTitle}>Opções de Profilaxia Farmacológica:</Text>
                      <Text style={styles.prophylaxisOption}>
                        • Enoxaparina 40mg SC 1x/dia (preferencial)
                      </Text>
                      <Text style={styles.prophylaxisOption}>
                        • Heparina não fracionada 5000 UI SC 8/8h ou 12/12h
                      </Text>
                      <Text style={styles.prophylaxisOption}>
                        • Fondaparinux 2,5mg SC 1x/dia (se HIT prévia)
                      </Text>
                    </View>
                    
                    {/* Card 2: Correção de Dose - Azul */}
                    <View style={styles.renalAdjustmentCard}>
                      <Text style={styles.renalAdjustmentTitle}>Correção de dose na insuficiência renal (TFG &lt; 30 mL/min.):</Text>
                      <Text style={styles.renalAdjustmentOption}>
                        • Enoxaparina 20 mg SC 1x/dia
                      </Text>
                      <Text style={styles.renalAdjustmentOption}>
                        • HNF 5.000 UI SC 8/8h ou 12/12h (ajustar dose de acordo com TTPA)
                      </Text>
                    </View>
                    
                    {/* Card 3: Situações Especiais - Verde */}
                    <View style={styles.specialSituationsCard}>
                      <Text style={[styles.specialSituationsTitle, {fontSize: theme.fontSize.md}]}>Situações especiais:</Text>
                      
                      <Text style={[styles.specialSituationsSubtitle, {fontSize: theme.fontSize.md}]}>1) Ajuste individual:</Text>
                      <Text style={styles.specialSituationsOption}>
                        • Idade &gt; 80 anos
                      </Text>
                      <Text style={styles.specialSituationsOption}>
                        • Sarcopenia
                      </Text>
                      <Text style={styles.specialSituationsOption}>
                        • Peso &lt; 50 kg
                      </Text>
                      <Text style={[styles.specialSituationsOption, {fontWeight: 'bold'}]}>
                        → Enoxaparina 20 mg SC 1x/dia
                      </Text>
                      
                      <Text style={[styles.specialSituationsOption, {marginTop: theme.spacing.md}]}>
                        • IMC &gt; 40 kg/m²
                      </Text>
                      <Text style={[styles.specialSituationsOption, {fontWeight: 'bold'}]}>
                        → Enoxaparina 60 mg SC 1x/dia ou 40mg SC 12/12h
                      </Text>
                      
                      <Text style={[styles.specialSituationsSubtitle, {marginTop: theme.spacing.xl, fontSize: theme.fontSize.md}]}>2) Associação farmacológica + mecânica:</Text>
                      <Text style={styles.specialSituationsOption}>
                        • Considerar em pacientes clínicos de risco particularmente alto.
                      </Text>
                      <Text style={styles.specialSituationsOption}>
                        • Exemplos: Pacientes oncológicos, Escore de Pádua ≥ 8.
                      </Text>
                      
                      <Text style={[styles.specialSituationsSubtitle, {marginTop: theme.spacing.xl, fontSize: theme.fontSize.md}]}>3) Profilaxia Estendida (Pós-alta)</Text>
                      <Text style={styles.specialSituationsOption}>
                        • Indicação: Considerar em casos selecionados de risco muito alto (ex: imobilidade persistente no momento da alta).
                      </Text>
                      <Text style={styles.specialSituationsOption}>
                        • Duração: 30 a 45 dias.
                      </Text>
                      <Text style={styles.specialSituationsOption}>
                        • Opções:
                      </Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>
                        - Enoxaparina 40 mg SC 1x/dia
                      </Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>
                        - Rivaroxabana 10 mg VO 1x/dia
                      </Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>
                        - Dabigatrana 220 mg VO 1x/dia
                      </Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>
                        - Apixabana 2,5 mg VO 12/12h
                      </Text>
                      
                      <Text style={[styles.specialSituationsOption, {fontStyle: 'italic', marginTop: theme.spacing.xs}]}>
                        OBS: Não existe benefício na profilaxia pós-alta em pacientes com imobilidade prolongada (ex: institucionalizados, idosos com demência avançada)
                      </Text>
                      
                      <Text style={[styles.specialSituationsSubtitle, {marginTop: theme.spacing.xl, fontSize: theme.fontSize.md}]}>4) AVC Isquêmico</Text>
                      <Text style={styles.specialSituationsOption}>
                        • Após trombolíse: Evitar anticoagulantes por 24h.
                      </Text>
                      <Text style={styles.specialSituationsOption}>
                        • Profilaxia Farmacológica: Iniciar em até 48h do evento se não houver risco excessivo de sangramento.
                      </Text>
                      <Text style={styles.specialSituationsOption}>
                        • Profilaxia Mecânica (Compressão Pneumática): Pode ser usada nas primeiras 72h, especialmente se a profilaxia farmacológica precisar ser adiada.
                      </Text>
                      
                      <Text style={[styles.specialSituationsSubtitle, {marginTop: theme.spacing.xl, fontSize: theme.fontSize.md}]}>5) AVC Hemorrágico</Text>
                      <Text style={styles.specialSituationsOption}>
                        • Profilaxia Mecânica (Compressão Pneumática): Iniciar precocemente.
                      </Text>
                      <Text style={styles.specialSituationsOption}>
                        • Profilaxia Farmacológica: Iniciar de 1 a 4 dias após o evento, se não houver expansão do sangramento.
                      </Text>
                      <Text style={styles.specialSituationsOption}>
                        • Postergar Profilaxia Farmacológica: Se houver alto risco de expansão do sangramento (ex: extravasamento de contraste, hipertensão não controlada, hematoma volumoso).
                      </Text>
                      
                      <Text style={[styles.specialSituationsOption, {fontStyle: 'italic', marginTop: theme.spacing.xs}]}>
                        OBS: Idealmente, avalie com neurologista o melhor período para início da anticoagulação profilática.
                      </Text>
                      
                      <Text style={[styles.specialSituationsSubtitle, {marginTop: theme.spacing.xl, fontSize: theme.fontSize.md}]}>6) Doença Neoplásica</Text>
                      <Text style={styles.specialSituationsOption}>
                        • Pacientes oncológicos hospitalizados: Devem receber profilaxia farmacológica.
                      </Text>
                      <Text style={styles.specialSituationsOption}>
                        • Profilaxia Ambulatorial (pós-alta):
                      </Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>
                        - Considerar em pacientes com risco particularmente alto.
                      </Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>
                        - <Text style={{fontWeight: 'bold'}}>Escore de Khorana ≥ 3:</Text> Indica alto risco e reforça a consideração para profilaxia ambulatorial.
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.considerationsCard}>
                <Text style={styles.considerationsTitle}>
                  <Info size={20} color={theme.colors.calculator} /> Contraindicações para Profilaxia Medicamentosa
                </Text>
                
                <Text style={[styles.considerationText, {fontWeight: 'bold', marginTop: theme.spacing.md, marginBottom: theme.spacing.sm}]}>Absolutas:</Text>
                <Text style={styles.considerationText}>• Sangramento ativo</Text>
                <Text style={styles.considerationText}>• Úlcera péptica ativa</Text>
                <Text style={styles.considerationText}>• Uso de anticoagulação plena</Text>
                <Text style={styles.considerationText}>• Trombocitopenia induzida por heparina há menos de 100 dias</Text>
                <Text style={styles.considerationText}>• Hipersensibilidade ao anticoagulante</Text>
                <Text style={styles.considerationText}>• Anestesia espinhal ou peridural nas últimas 2 horas</Text>
                
                <Text style={[styles.considerationText, {fontWeight: 'bold', marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm}]}>Relativas:</Text>
                <Text style={styles.considerationText}>• Hipertensão arterial não controlada (PA &gt; 180x110 mmHg)</Text>
                <Text style={styles.considerationText}>• Coagulopatias (plaquetopenia ou INR &gt; 1,5; TTPA &gt; 60s)</Text>
                <Text style={styles.considerationText}>• Contagem plaquetária &lt; 50.000/mm³</Text>
                <Text style={styles.considerationText}>• Insuficiência renal grave (Clearance de creatinina &lt; 30 ml/min)</Text>
                <Text style={styles.considerationText}>• Cirurgia neurológica ou oftalmológica recente (&lt; 2 semanas)</Text>
                <Text style={styles.considerationText}>• Coleta de líquor nas últimas 24 horas</Text>
                <Text style={styles.considerationText}>• Anestesia espinhal ou peridural nas últimas 12-24 horas</Text>
              </View>

              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>
                  <AlertTriangle size={20} color="#FF5722" /> Importante
                </Text>
                <Text style={styles.warningText}>
                  • Avaliar contraindicações para anticoagulação{' '}
                  • Considerar risco de sangramento{' '}
                  • Ajustar dose em insuficiência renal{' '}
                  • Reavaliar necessidade de profilaxia a cada 48 horas OU mudança significativa do quadro clínico
                </Text>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetCalculator}
              >
                <Text style={styles.resetButtonText}>Limpar Seleção</Text>
              </TouchableOpacity>
              
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
    <View>
      <Text style={styles.referenceText}>
        Barbar S, Noventa F, Rossetto V, Ferrari A, Brandolin B, Perlati M, De Bon E, Tormene D, Pagnan A, Prandoni P. A risk assessment model for the identification of hospitalized medical patients at risk for venous thromboembolism: the Padua Prediction Score. J Thromb Haemost. 2010 Nov;8(11):2450-7. doi: 10.1111/j.1538-7836.2010.04044.x.
      </Text>
      <Text style={styles.referenceText}>
        Bahl V e cols. A validation study of a retrospective venous thromboembolism risk scoring method. Ann Surg. 2010 Feb;251(2):344-50.
      </Text>
      <Text style={styles.referenceText}>
        Geerts WH, Bergqvist D, Pineo GF, et al. Prevention of venous thromboembolism. ACCP Evidence-Based Clinical Pratice Guidelines (8th Edition). Chest 2008; 133:381S-453S. Disponível em; http://www.chestjournal.org/content/133/6suppl/381S.full.pdf+html.
      </Text>
      <Text style={styles.referenceText}>
        Guyatt GH, Akl EA, Crowther M, Gutterman DD, Schuünemann HJ; American College of Chest Physicians Antithrombotic Therapy and Prevention of Thrombosis Panel. Executive summary: Antithrombotic Therapy and Prevention of Thrombosis, 9th ed: American College of Chest Physicians Evidence-Based Clinical Practice Guidelines. Chest. 2012 Feb;141(2 Suppl):7S-47S.
      </Text>
      <Text style={styles.referenceText}>
        Lyman GH e cols. American Society of Hematology 2021 guidelines for management of venous thromboembolism: prevention and treatment in patients with cancer. Blood Adv. 2021 Feb 23;5(4):927-974.
      </Text>
    </View>
  )}
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
    marginRight: 'auto',
    minWidth: 45,
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
  // Novos estilos para cards coloridos
  renalAdjustmentCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  renalAdjustmentTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.sm,
  },
  renalAdjustmentOption: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  specialSituationsCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  specialSituationsTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.sm,
  },
  specialSituationsSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  specialSituationsOption: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
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
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },
});
