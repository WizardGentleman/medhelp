import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Wind, Info, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, RotateCcw, ChevronDown, ChevronUp, Activity } from 'lucide-react-native';

interface WellsScores {
  [key: string]: number;
}

interface GenebraScores {
  [key: string]: number;
}

interface WellsResult {
  totalScore: number;
  probability: string;
  probabilityColor: string;
  interpretation: string;
  recommendations: string[];
}

interface GenebraResult {
  totalScore: number;
  probability: string;
  probabilityColor: string;
  interpretation: string;
  recommendations: string[];
}

const wellsItems = [
  {
    id: 'previousThromboembolism',
    title: 'Tromboembolismo venoso prévio',
    description: 'História de TVP ou TEP',
    score: 1.5
  },
  {
    id: 'heartRate',
    title: 'Frequência cardíaca > 100 bpm',
    description: 'Taquicardia',
    score: 1.5
  },
  {
    id: 'surgery',
    title: 'Cirurgia nas últimas 4 semanas',
    description: 'Cirurgia recente',
    score: 1.5
  },
  {
    id: 'hemoptysis',
    title: 'Hemoptise',
    description: 'Tosse com sangue',
    score: 1
  },
  {
    id: 'activeCancer',
    title: 'Câncer ativo',
    description: 'Tratamento nos últimos 6 meses ou cuidados paliativos',
    score: 1
  },
  {
    id: 'clinicalSigns',
    title: 'Sinais clínicos de TVP',
    description: 'Edema unilateral e dor à palpação',
    score: 3
  },
  {
    id: 'alternativeDiagnosis',
    title: 'Diagnóstico alternativo menos provável',
    description: 'TEP é mais provável que outro diagnóstico',
    score: 3
  }
];

const genebraItems = [
  {
    id: 'age',
    title: 'Idade > 65 anos',
    description: 'Fator de risco idade',
    score: 1
  },
  {
    id: 'previousThromboembolism',
    title: 'Tromboembolismo venoso prévio',
    description: 'História de TVP ou TEP',
    score: 3
  },
  {
    id: 'surgery',
    title: 'Cirurgia nas últimas 4 semanas',
    description: 'Cirurgia recente',
    score: 2
  },
  {
    id: 'heartRate',
    title: 'Frequência cardíaca 75-94 bpm',
    description: 'Taquicardia leve',
    score: 3
  },
  {
    id: 'heartRateHigh',
    title: 'Frequência cardíaca ≥ 95 bpm',
    description: 'Taquicardia moderada/severa',
    score: 5
  },
  {
    id: 'paCO2',
    title: 'PaCO2 < 36 mmHg',
    description: 'Hipocapnia',
    score: 2
  },
  {
    id: 'paO2',
    title: 'PaO2 < 65 mmHg',
    description: 'Hipoxemia',
    score: 4
  },
  {
    id: 'xray',
    title: 'Raio-X com atelectasia',
    description: 'Atelectasia laminar',
    score: 1
  },
  {
    id: 'xrayElevated',
    title: 'Raio-X com elevação hemidiafragma',
    description: 'Elevação unilateral do hemidiafragma',
    score: 1
  }
];

export default function TEPScreen() {
  const [activeCalculator, setActiveCalculator] = useState<'wells' | 'genebra' | null>(null);
  const [activeTreatment, setActiveTreatment] = useState<'high' | 'intermediate' | 'low' | null>(null);
  const [wellsScores, setWellsScores] = useState<WellsScores>({});
  const [genebraScores, setGenebraScores] = useState<GenebraScores>({});

  const toggleCalculator = (calculator: 'wells' | 'genebra') => {
    setActiveCalculator(activeCalculator === calculator ? null : calculator);
  };

  const toggleTreatment = (treatment: 'high' | 'intermediate' | 'low') => {
    setActiveTreatment(activeTreatment === treatment ? null : treatment);
  };

  const handleWellsScoreSelect = (itemId: string, hasCondition: boolean) => {
    const item = wellsItems.find(item => item.id === itemId);
    if (item) {
      setWellsScores(prev => ({
        ...prev,
        [itemId]: hasCondition ? item.score : 0
      }));
    }
  };

  const handleGenebraScoreSelect = (itemId: string, hasCondition: boolean) => {
    const item = genebraItems.find(item => item.id === itemId);
    if (item) {
      setGenebraScores(prev => ({
        ...prev,
        [itemId]: hasCondition ? item.score : 0
      }));
    }
  };

  const resetWells = () => {
    setWellsScores({});
  };

  const resetGenebra = () => {
    setGenebraScores({});
  };

  const getWellsTotalScore = (): number => {
    return Object.values(wellsScores).reduce((total, score) => total + score, 0);
  };

  const getGenebraTotalScore = (): number => {
    return Object.values(genebraScores).reduce((total, score) => total + score, 0);
  };

  const getWellsResult = (): WellsResult => {
    const totalScore = getWellsTotalScore();
    
    if (totalScore < 2) {
      return {
        totalScore,
        probability: 'Baixa Probabilidade',
        probabilityColor: '#4CAF50',
        interpretation: 'Probabilidade baixa para TEP (< 5%). D-dímero pode ser útil para exclusão.',
        recommendations: [
          'Solicitar D-dímero',
          'Se D-dímero normal, TEP improvável',
          'Se D-dímero elevado, considerar imagem',
          'Angiotomografia de tórax ou cintilografia',
          'Considerar outras causas dos sintomas'
        ]
      };
    } else if (totalScore <= 6) {
      return {
        totalScore,
        probability: 'Probabilidade Moderada',
        probabilityColor: '#FF9800',
        interpretation: 'Probabilidade moderada para TEP (20-30%). Exames de imagem são recomendados.',
        recommendations: [
          'Angiotomografia de tórax (primeira escolha)',
          'Cintilografia pulmonar se contraindicação à TC',
          'D-dímero tem valor limitado',
          'Considerar anticoagulação se alta suspeita clínica',
          'Ecocardiograma se instabilidade hemodinâmica'
        ]
      };
    } else {
      return {
        totalScore,
        probability: 'Alta Probabilidade',
        probabilityColor: '#D32F2F',
        interpretation: 'Probabilidade alta para TEP (> 65%). Exames de imagem urgentes são necessários.',
        recommendations: [
          'Angiotomografia de tórax urgente',
          'Considerar anticoagulação empírica',
          'Ecocardiograma para avaliar coração direito',
          'Gasometria arterial',
          'Considerar trombolítico se TEP maciço',
          'Monitorização hemodinâmica'
        ]
      };
    }
  };

  const getGenebraResult = (): GenebraResult => {
    const totalScore = getGenebraTotalScore();
    
    if (totalScore <= 3) {
      return {
        totalScore,
        probability: 'Baixa Probabilidade',
        probabilityColor: '#4CAF50',
        interpretation: 'Probabilidade baixa para TEP (< 10%). D-dímero pode ser útil para exclusão.',
        recommendations: [
          'Solicitar D-dímero',
          'Se D-dímero normal, TEP improvável',
          'Se D-dímero elevado, considerar imagem',
          'Angiotomografia de tórax ou cintilografia',
          'Investigar outras causas dos sintomas'
        ]
      };
    } else if (totalScore <= 8) {
      return {
        totalScore,
        probability: 'Probabilidade Moderada',
        probabilityColor: '#FF9800',
        interpretation: 'Probabilidade moderada para TEP (20-30%). Exames de imagem são recomendados.',
        recommendations: [
          'Angiotomografia de tórax (primeira escolha)',
          'Cintilografia pulmonar se contraindicação à TC',
          'D-dímero tem valor limitado nesta faixa',
          'Considerar anticoagulação se alta suspeita',
          'Ecocardiograma se sinais de cor pulmonale'
        ]
      };
    } else {
      return {
        totalScore,
        probability: 'Alta Probabilidade',
        probabilityColor: '#D32F2F',
        interpretation: 'Probabilidade alta para TEP (> 65%). Exames de imagem urgentes são necessários.',
        recommendations: [
          'Angiotomografia de tórax urgente',
          'Considerar anticoagulação empírica',
          'Ecocardiograma para avaliar coração direito',
          'Gasometria arterial',
          'Considerar trombolítico se TEP maciço',
          'Monitorização em ambiente hospitalar'
        ]
      };
    }
  };

  const wellsResult = getWellsResult();
  const genebraResult = getGenebraResult();

  return (
    <View style={styles.container}>
      <ScreenHeader title="TEP - Tromboembolismo Pulmonar" type="calculator" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Wind size={20} color={theme.colors.calculator} /> Sobre os Escores de TEP
            </Text>
            <Text style={styles.infoText}>
              Os escores de Wells e Genebra são ferramentas clínicas validadas para estratificação de risco de tromboembolismo pulmonar. 
              Escolha uma das calculadoras abaixo para avaliar a probabilidade de TEP.
            </Text>
          </View>

          {/* DIAGNÓSTICO Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              <Wind size={20} color={theme.colors.calculator} /> DIAGNÓSTICO
            </Text>
            <Text style={styles.sectionText}>
              Utilize os escores de Wells ou Genebra para avaliar a probabilidade de TEP e orientar a investigação diagnóstica.
            </Text>
            
            {/* Wells Score Calculator */}
            <View style={styles.calculatorCard}>
            <TouchableOpacity
              style={styles.calculatorHeader}
              onPress={() => toggleCalculator('wells')}
            >
              <Text style={styles.calculatorTitle}>Escore de Wells</Text>
              <View style={styles.calculatorHeaderRight}>
                <Text style={styles.calculatorScore}>
                  {getWellsTotalScore().toFixed(1)} pts
                </Text>
                {activeCalculator === 'wells' ? 
                  <ChevronUp size={24} color={theme.colors.calculator} /> : 
                  <ChevronDown size={24} color={theme.colors.calculator} />
                }
              </View>
            </TouchableOpacity>

            {activeCalculator === 'wells' && (
              <View style={styles.calculatorContent}>
                <View style={styles.itemsContainer}>
                  {wellsItems.map((item) => (
                    <View key={item.id} style={styles.itemCard}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemScoreText}>{item.score} pts</Text>
                      </View>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                      
                      <View style={styles.optionsContainer}>
                        <TouchableOpacity
                          style={[
                            styles.optionButton,
                            wellsScores[item.id] === 0 && styles.optionButtonSelected
                          ]}
                          onPress={() => handleWellsScoreSelect(item.id, false)}
                        >
                          <Text style={[
                            styles.optionText,
                            wellsScores[item.id] === 0 && styles.optionTextSelected
                          ]}>
                            Não
                          </Text>
                          {wellsScores[item.id] === 0 && (
                            <CheckCircle size={16} color={theme.colors.calculator} />
                          )}
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[
                            styles.optionButton,
                            wellsScores[item.id] === item.score && styles.optionButtonSelected
                          ]}
                          onPress={() => handleWellsScoreSelect(item.id, true)}
                        >
                          <Text style={[
                            styles.optionText,
                            wellsScores[item.id] === item.score && styles.optionTextSelected
                          ]}>
                            Sim
                          </Text>
                          {wellsScores[item.id] === item.score && (
                            <CheckCircle size={16} color={theme.colors.calculator} />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>

                {getWellsTotalScore() > 0 && (
                  <View style={styles.resultSection}>
                    <View style={[styles.resultCard, { borderColor: wellsResult.probabilityColor }]}>
                      <View style={[styles.resultHeader, { backgroundColor: wellsResult.probabilityColor }]}>
                        <Wind size={24} color="white" />
                        <Text style={styles.resultTitle}>Resultado Wells</Text>
                      </View>
                      <View style={styles.resultContent}>
                        <Text style={[styles.probabilityText, { color: wellsResult.probabilityColor }]}>
                          {wellsResult.probability}
                        </Text>
                        <Text style={styles.interpretationText}>
                          {wellsResult.interpretation}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.recommendationsCard}>
                      <Text style={styles.recommendationsTitle}>
                        <Info size={20} color={theme.colors.calculator} /> Recomendações
                      </Text>
                      {wellsResult.recommendations.map((recommendation, index) => (
                        <Text key={index} style={styles.recommendationText}>
                          • {recommendation}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetWells}
                >
                  <RotateCcw size={20} color="white" />
                  <Text style={styles.resetButtonText}>Resetar Wells</Text>
                </TouchableOpacity>
              </View>
            )}
            </View>
            
            {/* Geneva Score Calculator */}
            <View style={styles.calculatorCard}>
            <TouchableOpacity
              style={styles.calculatorHeader}
              onPress={() => toggleCalculator('genebra')}
            >
              <Text style={styles.calculatorTitle}>Escore de Genebra Revisado</Text>
              <View style={styles.calculatorHeaderRight}>
                <Text style={styles.calculatorScore}>
                  {getGenebraTotalScore()} pts
                </Text>
                {activeCalculator === 'genebra' ? 
                  <ChevronUp size={24} color={theme.colors.calculator} /> : 
                  <ChevronDown size={24} color={theme.colors.calculator} />
                }
              </View>
            </TouchableOpacity>

            {activeCalculator === 'genebra' && (
              <View style={styles.calculatorContent}>
                <View style={styles.itemsContainer}>
                  {genebraItems.map((item) => (
                    <View key={item.id} style={styles.itemCard}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemScoreText}>{item.score} pts</Text>
                      </View>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                      
                      <View style={styles.optionsContainer}>
                        <TouchableOpacity
                          style={[
                            styles.optionButton,
                            genebraScores[item.id] === 0 && styles.optionButtonSelected
                          ]}
                          onPress={() => handleGenebraScoreSelect(item.id, false)}
                        >
                          <Text style={[
                            styles.optionText,
                            genebraScores[item.id] === 0 && styles.optionTextSelected
                          ]}>
                            Não
                          </Text>
                          {genebraScores[item.id] === 0 && (
                            <CheckCircle size={16} color={theme.colors.calculator} />
                          )}
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[
                            styles.optionButton,
                            genebraScores[item.id] === item.score && styles.optionButtonSelected
                          ]}
                          onPress={() => handleGenebraScoreSelect(item.id, true)}
                        >
                          <Text style={[
                            styles.optionText,
                            genebraScores[item.id] === item.score && styles.optionTextSelected
                          ]}>
                            Sim
                          </Text>
                          {genebraScores[item.id] === item.score && (
                            <CheckCircle size={16} color={theme.colors.calculator} />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>

                {getGenebraTotalScore() > 0 && (
                  <View style={styles.resultSection}>
                    <View style={[styles.resultCard, { borderColor: genebraResult.probabilityColor }]}>
                      <View style={[styles.resultHeader, { backgroundColor: genebraResult.probabilityColor }]}>
                        <Wind size={24} color="white" />
                        <Text style={styles.resultTitle}>Resultado Genebra</Text>
                      </View>
                      <View style={styles.resultContent}>
                        <Text style={[styles.probabilityText, { color: genebraResult.probabilityColor }]}>
                          {genebraResult.probability}
                        </Text>
                        <Text style={styles.interpretationText}>
                          {genebraResult.interpretation}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.recommendationsCard}>
                      <Text style={styles.recommendationsTitle}>
                        <Info size={20} color={theme.colors.calculator} /> Recomendações
                      </Text>
                      {genebraResult.recommendations.map((recommendation, index) => (
                        <Text key={index} style={styles.recommendationText}>
                          • {recommendation}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetGenebra}
                >
                  <RotateCcw size={20} color="white" />
                  <Text style={styles.resetButtonText}>Resetar Genebra</Text>
                </TouchableOpacity>
              </View>
            )}
            </View>
          </View>

          {/* ESTRATIFICAÇÃO DE RISCO Section */}
          <View style={styles.riskSectionCard}>
            <Text style={styles.riskSectionTitle}>
              <Activity size={20} color="#4CAF50" /> ESTRATIFICAÇÃO DE RISCO
            </Text>
            <Text style={styles.riskSectionText}>
              Uma vez confirmado o TEP, é essencial classificar o paciente segundo níveis de gravidade: alto, intermediário ou baixo risco. Esta classificação orienta as decisões terapêuticas subsequentes.
            </Text>
            
            <View style={styles.riskCard}>
              <Text style={styles.riskTitle}>Alto Risco</Text>
              <Text style={styles.riskDescription}>
                Cerca de 5% dos casos apresentam-se com TEP de elevada gravidade. Manifestações típicas incluem:
              </Text>
              <View style={styles.riskItemsContainer}>
                <Text style={styles.riskItem}>• Estado de choque circulatório</Text>
                <Text style={styles.riskItem}>• Comprometimento da perfusão tecidual</Text>
                <Text style={styles.riskItem}>• Hipotensão arterial (PAS &lt; 90 mmHg ou redução &gt; 40 mmHg)</Text>
                <Text style={styles.riskItem}>• Parada cardiopulmonar</Text>
              </View>
            </View>

            <View style={styles.riskCard}>
              <Text style={styles.riskTitle}>Risco Intermediário</Text>
              <Text style={styles.riskDescription}>
                Caracteriza-se por sinais de sobrecarga do ventrículo direito detectados por métodos de imagem (ecocardiograma ou angiotomografia) e/ou elevação de marcadores de lesão miocárdica (troponina, BNP/NT-proBNP).
              </Text>
            </View>

            <View style={styles.riskCard}>
              <Text style={styles.riskTitle}>Baixo Risco</Text>
              <Text style={styles.riskDescription}>
                Pacientes hemodinamicamente estáveis, sem evidências de disfunção do coração direito e com marcadores cardíacos dentro da normalidade.
              </Text>
            </View>
          </View>

          {/* TRATAMENTO Section */}
          <View style={styles.treatmentSectionCard}>
            <Text style={styles.treatmentSectionTitle}>
              <Activity size={20} color="#FF6B35" /> TRATAMENTO
            </Text>
            <Text style={styles.treatmentSectionText}>
              O manejo terapêutico do TEP deve ser individualizado com base na estratificação de risco, visando reduzir a mortalidade e prevenir complicações.
            </Text>
            
            <View style={styles.treatmentCard}>
              <TouchableOpacity
                style={styles.treatmentHeader}
                onPress={() => toggleTreatment('high')}
              >
                <Text style={styles.treatmentTitle}>Tratamento do Paciente de Alto Risco</Text>
                {activeTreatment === 'high' ? 
                  <ChevronUp size={24} color="#FF6B35" /> : 
                  <ChevronDown size={24} color="#FF6B35" />
                }
              </TouchableOpacity>

              {activeTreatment === 'high' && (
                <View style={styles.treatmentContent}>
                  <Text style={styles.treatmentDescription}>
                    Recomenda-se terapia de reperfusão urgente, salvo na presença de contraindicações específicas.
                  </Text>
              
              <Text style={styles.treatmentSubtitle}>Contraindicações à Fibrinólise</Text>
              
              <View style={styles.contraindicationContainer}>
                <Text style={styles.contraindicationCategory}>Absolutas</Text>
                <View style={styles.contraindicationList}>
                  <Text style={styles.contraindicationItem}>• Hemorragia intracraniana prévia ou AVC hemorrágico de etiologia indefinida</Text>
                  <Text style={styles.contraindicationItem}>• Neoplasias ou malformações vasculares do sistema nervoso central</Text>
                  <Text style={styles.contraindicationItem}>• Dissecção aórtica</Text>
                </View>
              </View>
              
              <View style={styles.contraindicationContainer}>
                <Text style={styles.contraindicationCategory}>Relativas</Text>
                <View style={styles.contraindicationList}>
                  <Text style={styles.contraindicationItem}>• AVC isquêmico nos últimos 6 meses</Text>
                  <Text style={styles.contraindicationItem}>• Procedimento cirúrgico de grande porte no último mês</Text>
                  <Text style={styles.contraindicationItem}>• Hemorragia digestiva no último mês</Text>
                  <Text style={styles.contraindicationItem}>• Procedimentos invasivos não compressíveis nas últimas 24h</Text>
                  <Text style={styles.contraindicationItem}>• AIT nos últimos 6 meses</Text>
                  <Text style={styles.contraindicationItem}>• Anticoagulação em uso</Text>
                  <Text style={styles.contraindicationItem}>• Gestação ou pós-parto &lt; 1 semana</Text>
                  <Text style={styles.contraindicationItem}>• Hipertensão não controlada (PAS &gt; 180 ou PAD &gt; 110 mmHg)</Text>
                  <Text style={styles.contraindicationItem}>• Hepatopatia avançada</Text>
                  <Text style={styles.contraindicationItem}>• Endocardite infecciosa</Text>
                  <Text style={styles.contraindicationItem}>• Úlcera péptica em atividade</Text>
                  <Text style={styles.contraindicationItem}>• Reanimação cardiopulmonar traumática ou prolongada</Text>
                </View>
              </View>
              
              <Text style={styles.treatmentSubtitle}>Agentes Fibrinolíticos e Posologia</Text>
              <Text style={styles.treatmentDescription}>
                Os principais fibrinolíticos utilizados incluem tenecteplase e alteplase. Para tenecteplase, a dosagem é determinada pelo peso corporal. Esquemas baseados no peso são preferidos em pacientes idosos ou com baixo peso corporal.
              </Text>
              
              <View style={styles.drugTableContainer}>
                <Text style={styles.drugTableTitle}>Fibrinolíticos e Dosagens no TEP</Text>
                
                <View style={styles.drugCard}>
                  <Text style={styles.drugName}>Alteplase (rtPA)</Text>
                  <Text style={styles.drugDose}>• 100 mg infundido em 2 horas</Text>
                  <Text style={styles.drugDose}>• Regime acelerado: 0,6 mg/kg em 15 min (máximo 50mg)</Text>
                </View>
                
                <View style={styles.drugCard}>
                  <Text style={styles.drugName}>Estreptoquinase</Text>
                  <Text style={styles.drugDose}>• Ataque: 250.000 UI em 30 min, manutenção: 100.000 UI/h por 12-24h</Text>
                  <Text style={styles.drugDose}>• Regime acelerado: 1,5 milhão UI em 2 horas</Text>
                </View>
                
                <View style={styles.drugCard}>
                  <Text style={styles.drugName}>Uroquinase</Text>
                  <Text style={styles.drugDose}>• Ataque: 4.400 UI/kg em 10 min, manutenção: 4.400 UI/kg/h por 12-24h</Text>
                  <Text style={styles.drugDose}>• Regime acelerado: 3 milhões UI em 2 horas</Text>
                </View>
              </View>
                </View>
              )}
            </View>

            <View style={styles.treatmentCard}>
              <TouchableOpacity
                style={styles.treatmentHeader}
                onPress={() => toggleTreatment('intermediate')}
              >
                <Text style={styles.treatmentTitle}>Tratamento Agudo do Risco Intermediário</Text>
                {activeTreatment === 'intermediate' ? 
                  <ChevronUp size={24} color="#FF6B35" /> : 
                  <ChevronDown size={24} color="#FF6B35" />
                }
              </TouchableOpacity>

              {activeTreatment === 'intermediate' && (
                <View style={styles.treatmentContent}>
                  <Text style={styles.treatmentDescription}>
                    A fibrinólise não é indicada de forma rotineira neste grupo de pacientes. Recomenda-se monitorização rigorosa para detecção precoce de deterioração do quadro clínico, circunstância na qual a terapia de reperfusão poderá ser considerada.
                  </Text>
              
              <Text style={styles.treatmentSubtitle}>Anticoagulação</Text>
              <Text style={styles.treatmentDescription}>
                A anticoagulação terapêutica está formalmente indicada, sendo preferencialmente utilizada a heparina de baixo peso molecular (HBPM).
              </Text>
              
              <View style={styles.treatmentHighlight}>
                <Text style={styles.treatmentHighlightText}>
                  • A Sociedade Europeia de Cardiologia (ESC) recomenda que após 2-3 dias de anticoagulação plena com HBPM, é possível realizar a transição para terapia oral.
                </Text>
              </View>
              
              <Text style={styles.treatmentSubtitle}>Opções Avançadas</Text>
              <Text style={styles.treatmentDescription}>
                Quando disponível, a fibrinólise dirigida por cateter representa uma alternativa para pacientes de risco intermediário que apresentam trombo em localização proximal.
              </Text>
                </View>
              )}
            </View>

            <View style={styles.treatmentCard}>
              <TouchableOpacity
                style={styles.treatmentHeader}
                onPress={() => toggleTreatment('low')}
              >
                <Text style={styles.treatmentTitle}>Tratamento Agudo do Baixo Risco</Text>
                {activeTreatment === 'low' ? 
                  <ChevronUp size={24} color="#FF6B35" /> : 
                  <ChevronDown size={24} color="#FF6B35" />
                }
              </TouchableOpacity>

              {activeTreatment === 'low' && (
                <View style={styles.treatmentContent}>
                  <Text style={styles.treatmentDescription}>
                    A maioria destes pacientes pode receber tratamento com anticoagulante oral direto (DOAC) e são candidatos ao manejo ambulatorial quando há suporte social adequado e baixo risco hemorrágico.
                  </Text>
              
              <Text style={styles.treatmentSubtitle}>Critérios para Tratamento Ambulatorial</Text>
              <Text style={styles.treatmentDescription}>
                A determinação do tratamento ambulatorial é orientada pelo Índice de Gravidade de Embolia Pulmonar (PESI) simplificado ou pelo escore Hestia. O manejo domiciliar constitui uma opção segura para determinados pacientes com TEP de baixo risco. Estudos randomizados demonstraram baixo risco de eventos adversos em pacientes que não preencheram critérios pelo escore Hestia ou que obtiveram pontuação zero no PESI simplificado.
              </Text>
              
              <View style={styles.scoreTableContainer}>
                <Text style={styles.scoreTableTitle}>PESI Simplificado</Text>
                <Text style={styles.scoreTableSubtitle}>(Índice de Gravidade de Embolia Pulmonar Simplificado)</Text>
                
                <View style={styles.scoreCard}>
                  <Text style={styles.scoreDescription}>Cada item equivale a 1 ponto:</Text>
                  <View style={styles.scoreList}>
                    <Text style={styles.scoreItem}>• Idade &gt; 80 anos</Text>
                    <Text style={styles.scoreItem}>• História de câncer</Text>
                    <Text style={styles.scoreItem}>• História de doença cardiopulmonar crônica</Text>
                    <Text style={styles.scoreItem}>• Frequência cardíaca ≥ 110 bpm</Text>
                    <Text style={styles.scoreItem}>• Pressão arterial sistólica &lt; 100 mmHg</Text>
                    <Text style={styles.scoreItem}>• Saturação de oxigênio &lt; 90%</Text>
                  </View>
                  <View style={styles.scoreResult}>
                    <Text style={styles.scoreResultText}>Pontuação 0 = Baixo risco (elegivel para tratamento ambulatorial)</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.scoreTableContainer}>
                <Text style={styles.scoreTableTitle}>Escore Hestia</Text>
                
                <View style={styles.scoreCard}>
                  <Text style={styles.scoreDescription}>Contraindicações ao tratamento ambulatorial:</Text>
                  <View style={styles.scoreList}>
                    <Text style={styles.scoreItem}>• Instabilidade hemodinâmica</Text>
                    <Text style={styles.scoreItem}>• Paciente elegível para fibrinólise</Text>
                    <Text style={styles.scoreItem}>• Alto risco de sangramento</Text>
                    <Text style={styles.scoreItem}>• Necessidade de oxigenoterapia</Text>
                    <Text style={styles.scoreItem}>• Indicação de analgesia endovenosa</Text>
                    <Text style={styles.scoreItem}>• TEP diagnosticado em paciente já anticoagulado</Text>
                    <Text style={styles.scoreItem}>• Outro diagnóstico que necessite internação</Text>
                    <Text style={styles.scoreItem}>• Suporte social inadequado</Text>
                    <Text style={styles.scoreItem}>• Clearance de creatinina &lt; 30 mL/min</Text>
                    <Text style={styles.scoreItem}>• Gestação</Text>
                    <Text style={styles.scoreItem}>• História de trombocitopenia induzida por heparina</Text>
                  </View>
                  <View style={styles.scoreResult}>
                    <Text style={styles.scoreResultText}>Ausência de todos os critérios = Elegivel para tratamento ambulatorial</Text>
                  </View>
                </View>
              </View>
                </View>
              )}
            </View>
          </View>

          {/* FÁRMACO E DURAÇÃO DE TRATAMENTO Section */}
          <View style={styles.pharmacySectionCard}>
            <Text style={styles.pharmacySectionTitle}>
              <Activity size={20} color="#9C27B0" /> FÁRMACO E DURAÇÃO DE TRATAMENTO
            </Text>
            
            <Text style={styles.pharmacySectionSubtitle}>Indicações de Escolha do Anticoagulante</Text>
            
            <View style={styles.pharmacyIndicationCard}>
              <Text style={styles.pharmacyIndicationTitle}>• DOACs (Primeira Linha)</Text>
              <Text style={styles.pharmacyIndicationText}>Opção preferencial para manutenção. Eficácia similar aos antagonistas de vitamina K com menor risco de sangramento maior. Não necessitam monitorização.</Text>
            </View>
            
            <View style={styles.pharmacyIndicationCard}>
              <Text style={styles.pharmacyIndicationTitle}>• Pacientes Oncológicos</Text>
              <Text style={styles.pharmacyIndicationText}>DOACs (apixabana, edoxabana, rivaroxabana) são alternativa segura e eficaz à HBPM. Escolha baseada no perfil farmacológico e preferência do paciente.</Text>
            </View>
            
            <View style={styles.pharmacyIndicationCard}>
              <Text style={styles.pharmacyIndicationTitle}>• Antagonistas de Vitamina K</Text>
              <Text style={styles.pharmacyIndicationText}>Preferidos em: doença renal crônica avançada, hepatopatia e síndrome antifosfolípide com títulos altos ou trombose arterial prévia.</Text>
            </View>
            
            <View style={styles.pharmacyIndicationCard}>
              <Text style={styles.pharmacyIndicationTitle}>• HBPM</Text>
              <Text style={styles.pharmacyIndicationText}>Tratamento de escolha em gestantes (demais fármacos atravessam a barreira placentária com risco fetal).</Text>
            </View>
            
            <View style={styles.pharmacyImageContainer}>
              <Text style={styles.pharmacyImageTitle}>Regimes de tratamento com anticoagulantes para TEP</Text>
              <View style={styles.pharmacyTable}>
                <View style={styles.pharmacyTableHeader}>
                  <Text style={styles.pharmacyHeaderText}>Fase inicial de anticoagulação</Text>
                  <Text style={styles.pharmacyHeaderText}>3 a 6 meses de anticoagulação</Text>
                  <Text style={styles.pharmacyHeaderText}>Tempo indefinido de anticoagulação (após 3 a 6 meses)</Text>
                </View>
                
                <View style={styles.pharmacyTableRow}>
                  <Text style={styles.pharmacyCell}>Apixabana 10mg, via oral, 12/12h por 7 dias</Text>
                  <Text style={styles.pharmacyCell}>Apixabana 5mg, via oral, 12/12h</Text>
                  <Text style={styles.pharmacyCell}>Apixabana 5mg, 12/12h ou 2,5mg, 12/12h, via oral</Text>
                </View>
                
                <View style={styles.pharmacyTableRow}>
                  <Text style={styles.pharmacyCell}>Rivaroxabana 15mg, via oral, 12/12h por 21 dias</Text>
                  <Text style={styles.pharmacyCell}>Rivaroxabana 20 mg, via oral, uma vez ao dia</Text>
                  <Text style={styles.pharmacyCell}>Rivaroxabana, via oral, 20mg ou 10mg uma vez ao dia</Text>
                </View>
                
                <View style={styles.pharmacyTableRow}>
                  <Text style={styles.pharmacyCell}>Heparina de baixo peso molecular, via subcutânea, por pelo menos 5 dias</Text>
                  <Text style={styles.pharmacyCell}>Dabigatrana 150mg, via oral, 12/12h</Text>
                  <Text style={styles.pharmacyCell}>Dabigatrana 150mg, via oral, 12/12h</Text>
                </View>
                
                <View style={styles.pharmacyTableRow}>
                  <Text style={styles.pharmacyCell}></Text>
                  <Text style={styles.pharmacyCell}>Edoxabana 60mg, via oral, 1 vez ao dia¹</Text>
                  <Text style={styles.pharmacyCell}>Edoxabana 60mg, via oral, 1 vez ao dia¹</Text>
                </View>
                
                <View style={styles.pharmacyTableRow}>
                  <Text style={styles.pharmacyCell}>Heparina de baixo peso molecular, via subcutânea, por pelo menos 5 dias associada a antagonista de vitamina K, via oral, com RNI ≥ 2 por 2 dias</Text>
                  <Text style={styles.pharmacyCell}>Antagonista de vitamina K, via oral, com RNI entre 2 e 3</Text>
                  <Text style={styles.pharmacyCell}>Antagonista de vitamina K, via oral, com RNI entre 2 e 3</Text>
                </View>
              </View>
              
              <Text style={styles.pharmacyFootnote}>¹Edoxabana pode ser administrada na dose de 30mg/dia se o clearance de creatinina estiver entre 15 a 30mL/min e se o paciente tem peso menor que 60kg.</Text>
            </View>
            
            <Text style={styles.pharmacySectionSubtitle}>Resumo das Diretrizes</Text>
            
            <View style={styles.pharmacyGuidelineCard}>
              <Text style={styles.pharmacyGuidelineTitle}>• Duração Mínima</Text>
              <Text style={styles.pharmacyGuidelineText}>Anticoagulação por no mínimo 3 meses para reduzir riscos de reembolização, extensão trombótica e recorrência.</Text>
            </View>
            
            <View style={styles.pharmacyGuidelineCard}>
              <Text style={styles.pharmacyGuidelineTitle}>• TEP Provocado</Text>
              <Text style={styles.pharmacyGuidelineText}>Interrupção após 3 meses em casos com fatores de risco transitórios/reversíveis (cirurgia >30min, internação ≥3 dias, trauma).</Text>
            </View>
            
            <View style={styles.pharmacyGuidelineCard}>
              <Text style={styles.pharmacyGuidelineTitle}>• Extensão para 6 Meses</Text>
              <Text style={styles.pharmacyGuidelineText}>Considerar em TEP com disfunção ventricular direita moderada, sintomas residuais ou extensão significativa.</Text>
            </View>
            
            <View style={styles.pharmacyGuidelineCard}>
              <Text style={styles.pharmacyGuidelineTitle}>• Anticoagulação Indefinida</Text>
              <Text style={styles.pharmacyGuidelineText}>Indicada em fatores persistentes (neoplasia ativa, síndrome antifosfolípide) ou TEV não provocado recorrente.</Text>
            </View>
            
            <View style={styles.pharmacyGuidelineCard}>
              <Text style={styles.pharmacyGuidelineTitle}>• Redução de Dose</Text>
              <Text style={styles.pharmacyGuidelineText}>DOAC pode ter dose reduzida após 6 meses iniciais em anticoagulação indefinida, mantendo eficácia similar.</Text>
            </View>
            
            <View style={styles.pharmacyGuidelineCard}>
              <Text style={styles.pharmacyGuidelineTitle}>• Seguimento</Text>
              <Text style={styles.pharmacyGuidelineText}>Reavaliação em 3-6 meses para sintomas persistentes, investigação de neoplasia oculta e síndrome pós-TEP.</Text>
            </View>
          </View>

          {/* Clinical Notes */}
          <View style={styles.clinicalNotesCard}>
            <Text style={styles.clinicalNotesTitle}>
              <AlertTriangle size={20} color="#FF5722" /> Considerações Clínicas
            </Text>
            <Text style={styles.clinicalNotesText}>
              • Ambos os escores são ferramentas auxiliares, não substituem o julgamento clínico{'\n'}
              • D-dímero tem alta sensibilidade mas baixa especificidade{'\n'}
              • Angiotomografia de tórax é o exame padrão-ouro{'\n'}
              • Considerar contraindicações para contraste iodado{'\n'}
              • TEP maciço pode requerer trombolítico ou embolectomia{'\n'}
              • Profilaxia antitrombótica deve ser considerada em pacientes de risco{'\n'}
              • Sempre correlacionar com quadro clínico e outros exames
            </Text>
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
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  calculatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: '#F0F4FF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  calculatorTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    flex: 1,
  },
  calculatorHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  calculatorScore: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
  },
  calculatorContent: {
    padding: theme.spacing.lg,
  },
  itemsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  itemCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  itemTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    flex: 1,
  },
  itemScoreText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
  },
  itemDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionButtonSelected: {
    backgroundColor: theme.colors.calculator,
    borderColor: theme.colors.calculator,
  },
  optionText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  optionTextSelected: {
    color: 'white',
  },
  resultSection: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
  },
  resultHeader: {
    padding: theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
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
  probabilityText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    marginBottom: theme.spacing.md,
  },
  interpretationText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 22,
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
  clinicalNotesCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  clinicalNotesTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF5722',
    marginBottom: theme.spacing.md,
  },
  clinicalNotesText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  sectionText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  riskCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  riskTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.sm,
  },
  riskDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  riskItemsContainer: {
    gap: theme.spacing.xs,
  },
  riskItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  riskSectionCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  riskSectionTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.md,
  },
  riskSectionText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  treatmentSectionCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  treatmentSectionTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#FF6B35',
    marginBottom: theme.spacing.md,
  },
  treatmentSectionText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  treatmentCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  treatmentTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF6B35',
    marginBottom: theme.spacing.sm,
  },
  treatmentDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  treatmentSubtitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF6B35',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  contraindicationContainer: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  contraindicationCategory: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#D32F2F',
    marginBottom: theme.spacing.xs,
  },
  contraindicationList: {
    paddingLeft: theme.spacing.sm,
  },
  contraindicationItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
    marginBottom: 2,
  },
  drugTableContainer: {
    marginTop: theme.spacing.md,
    backgroundColor: '#FFF8F0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },
  drugTableTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF6B35',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  drugCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
  },
  drugName: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#FF6B35',
    marginBottom: theme.spacing.xs,
  },
  drugDose: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
    marginBottom: 2,
  },
  treatmentHighlight: {
    backgroundColor: '#F0F8FF',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  treatmentHighlightText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  scoreTableContainer: {
    marginTop: theme.spacing.md,
    backgroundColor: '#F8F9FA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  scoreTableTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  scoreTableSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  scoreDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  scoreList: {
    marginBottom: theme.spacing.md,
  },
  scoreItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  scoreResult: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  scoreResultText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  treatmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: '#FFF3E0',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0CC',
  },
  treatmentContent: {
    padding: theme.spacing.md,
  },
  pharmacySectionCard: {
    backgroundColor: '#F3E5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#9C27B0',
  },
  pharmacySectionTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#9C27B0',
    marginBottom: theme.spacing.md,
  },
  pharmacySectionSubtitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#9C27B0',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  pharmacyImageContainer: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E1BEE7',
  },
  pharmacyImageTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#9C27B0',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  pharmacyTable: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: theme.borderRadius.sm,
  },
  pharmacyTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
  },
  pharmacyHeaderText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    padding: theme.spacing.sm,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: 'white',
  },
  pharmacyTableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  pharmacyCell: {
    flex: 1,
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    padding: theme.spacing.sm,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    lineHeight: 16,
  },
  pharmacyFootnote: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
  pharmacyGuidelineCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#9C27B0',
  },
  pharmacyGuidelineTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#9C27B0',
    marginBottom: theme.spacing.xs,
  },
  pharmacyGuidelineText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  pharmacyIndicationCard: {
    backgroundColor: '#F8F5FD',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#9C27B0',
    borderWidth: 1,
    borderColor: '#E1BEE7',
  },
  pharmacyIndicationTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#7B1FA2',
    marginBottom: theme.spacing.xs,
  },
  pharmacyIndicationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
});
