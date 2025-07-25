import { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { ClipboardList, Info, CircleAlert as AlertCircle, ChevronRight, Activity, Heart, Calculator } from 'lucide-react-native';

interface PPSLevel {
  score: number;
  description: string;
  prognosis: string;
  color: string;
  bgColor: string;
}

interface DomainOption {
  id: string;
  label: string;
  icon: string;
  value: number;
}

interface PPSSelections {
  ambulation: string;
  activity: string;
  selfCare: string;
  intake: string;
  consciousness: string;
}

// Mapeamento da tabela PPS - cada linha representa um nível de PPS
const ppsTable = {
  100: { ambulation: 'completa', activity: 'normal_sem', selfCare: 'completo', intake: 'normal', consciousness: 'completa' },
  90: { ambulation: 'completa', activity: 'normal_alguma', selfCare: 'completo', intake: 'normal', consciousness: 'completa' },
  80: { ambulation: 'completa', activity: 'esforco', selfCare: 'completo', intake: 'normal', consciousness: 'completa' },
  70: { ambulation: 'reduzida', activity: 'incapaz_trabalho', selfCare: 'completo', intake: 'normal_reduzida', consciousness: 'completa' },
  60: { ambulation: 'reduzida', activity: 'incapaz_hobbies', selfCare: 'ocasional', intake: 'normal_reduzida', consciousness: 'periodos_confusao' },
  50: { ambulation: 'sentado', activity: 'incapacitado', selfCare: 'consideravel', intake: 'normal_reduzida', consciousness: 'periodos_confusao' },
  40: { ambulation: 'acamado', activity: 'incapacitado', selfCare: 'quase_completo', intake: 'normal_reduzida', consciousness: 'periodos_confusao' },
  30: { ambulation: 'acamado', activity: 'incapacitado', selfCare: 'dependencia', intake: 'reduzida', consciousness: 'periodos_confusao' },
  20: { ambulation: 'acamado', activity: 'incapacitado', selfCare: 'dependencia', intake: 'ingestao_limitada', consciousness: 'periodos_confusao' },
  10: { ambulation: 'acamado', activity: 'incapacitado', selfCare: 'dependencia', intake: 'cuidados_boca', consciousness: 'confuso_coma' },
  0: { ambulation: 'morte', activity: '-', selfCare: '-', intake: '-', consciousness: '-' }
};

const domainOptions = {
  ambulation: [
    { id: 'completa', label: 'Completa', icon: '🚶', minPPS: 80 },
    { id: 'reduzida', label: 'Reduzida', icon: '🚶‍♂️', minPPS: 60 },
    { id: 'sentado', label: 'Sentado ou deitado', icon: '🪑', minPPS: 50 },
    { id: 'acamado', label: 'Acamado', icon: '🛏️', minPPS: 10 },
    { id: 'morte', label: 'Morte', icon: '⚰️', minPPS: 0 }
  ],
  activity: [
    { id: 'normal_sem', label: 'Normal; sem evidência de doença', icon: '💼', minPPS: 100 },
    { id: 'normal_alguma', label: 'Normal; alguma evidência de doença', icon: '💼', minPPS: 90 },
    { id: 'esforco', label: 'Com esforço; alguma evidência de doença', icon: '⚠️', minPPS: 80 },
    { id: 'incapaz_trabalho', label: 'Incapaz para o trabalho; alguma evidência de doença', icon: '❌', minPPS: 70 },
    { id: 'incapaz_hobbies', label: 'Incapaz de realizar hobbies; doença significativa', icon: '❌', minPPS: 60 },
    { id: 'incapacitado', label: 'Incapacitado para qualquer trabalho; doença extensa', icon: '❌', minPPS: 10 }
  ],
  selfCare: [
    { id: 'completo', label: 'Completo', icon: '✅', minPPS: 70 },
    { id: 'ocasional', label: 'Assistência ocasional', icon: '🤝', minPPS: 60 },
    { id: 'consideravel', label: 'Assistência considerável', icon: '🤝', minPPS: 50 },
    { id: 'quase_completo', label: 'Assistência quase completa', icon: '🏥', minPPS: 40 },
    { id: 'dependencia', label: 'Dependência completa', icon: '🏥', minPPS: 10 }
  ],
  intake: [
    { id: 'normal', label: 'Normal', icon: '🍽️', minPPS: 80 },
    { id: 'normal_reduzida', label: 'Normal ou reduzida', icon: '🍽️', minPPS: 40 },
    { id: 'reduzida', label: 'Reduzida', icon: '🥄', minPPS: 30 },
    { id: 'ingestao_limitada', label: 'Ingestão limitada a colheradas', icon: '💧', minPPS: 20 },
    { id: 'cuidados_boca', label: 'Cuidados com a boca', icon: '💧', minPPS: 10 }
  ],
  consciousness: [
    { id: 'completa', label: 'Completa', icon: '😊', minPPS: 70 },
    { id: 'periodos_confusao', label: 'Períodos de confusão ou completa', icon: '😕', minPPS: 20 },
    { id: 'confuso_coma', label: 'Confuso ou em coma', icon: '😴', minPPS: 10 }
  ]
};

const ppsLevels: PPSLevel[] = [
  {
    score: 100,
    description: "Paciente completamente funcional, sem evidência de doença",
    prognosis: "Meses a anos",
    color: "#16A34A",
    bgColor: "#F0FDF4"
  },
  {
    score: 90,
    description: "Paciente com alguma evidência de doença, mas continua ativo",
    prognosis: "Meses",
    color: "#22C55E",
    bgColor: "#F0FDF4"
  },
  {
    score: 80,
    description: "Paciente com evidência de doença, mas ainda consegue trabalhar com esforço",
    prognosis: "Meses",
    color: "#84CC16",
    bgColor: "#FEFCE8"
  },
  {
    score: 70,
    description: "Paciente com mobilidade reduzida, incapaz de trabalhar",
    prognosis: "Semanas a meses",
    color: "#EAB308",
    bgColor: "#FEF3C7"
  },
  {
    score: 60,
    description: "Paciente com mobilidade reduzida, incapaz de hobbies e necessita assistência ocasional",
    prognosis: "Semanas a meses",
    color: "#F59E0B",
    bgColor: "#FFF7ED"
  },
  {
    score: 50,
    description: "Paciente sentado ou deitado, necessita assistência considerável",
    prognosis: "Semanas",
    color: "#EF4444",
    bgColor: "#FEF2F2"
  },
  {
    score: 40,
    description: "Paciente acamado, necessita assistência quase completa",
    prognosis: "Dias a semanas",
    color: "#DC2626",
    bgColor: "#FEE2E2"
  },
  {
    score: 30,
    description: "Paciente acamado, totalmente dependente",
    prognosis: "Dias a semanas",
    color: "#B91C1C",
    bgColor: "#FEE2E2"
  },
  {
    score: 20,
    description: "Paciente acamado, ingestão limitada",
    prognosis: "Dias",
    color: "#7C3AED",
    bgColor: "#F3E8FF"
  },
  {
    score: 10,
    description: "Paciente em fase final de vida, confuso ou em coma",
    prognosis: "Horas a dias",
    color: "#4338CA",
    bgColor: "#E0E7FF"
  },
  {
    score: 0,
    description: "Morte",
    prognosis: "-",
    color: "#6B7280",
    bgColor: "#F3F4F6"
  }
];

export default function PPSScreen() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<PPSSelections>({
    ambulation: '',
    activity: '',
    selfCare: '',
    intake: '',
    consciousness: ''
  });
  const [showResult, setShowResult] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const questionRefs = useRef<{ [key: string]: View | null }>({});
  
  // Get the selected ambulation option to determine constraints
  const selectedAmbulation = domainOptions.ambulation.find(opt => opt.id === selections.ambulation);

  const questions = [
{ key: 'ambulation' as keyof PPSSelections, title: '🚶 MOBILIDADE - Como o paciente se locomove?', options: domainOptions.ambulation },
    { key: 'activity' as keyof PPSSelections, title: '💼 ATIVIDADES - Qual o nível de atividade diária?', options: domainOptions.activity },
    { key: 'selfCare' as keyof PPSSelections, title: '🤝 AUTOCUIDADO - Consegue cuidar de si mesmo?', options: domainOptions.selfCare },
    { key: 'intake' as keyof PPSSelections, title: '🍽️ ALIMENTAÇÃO - Como está se alimentando?', options: domainOptions.intake },
    { key: 'consciousness' as keyof PPSSelections, title: '🧠 CONSCIÊNCIA - Qual o nível de consciência?', options: domainOptions.consciousness }
  ];

  const toggleCard = (cardIndex: number) => {
    setExpandedCard(expandedCard === cardIndex ? null : cardIndex);
  };

  const calculatePPSScore = (): number => {
    // Find all possible PPS scores based on each selection
    const possibleScores: number[] = [];
    
    // For each PPS score in the table
    Object.entries(ppsTable).forEach(([scoreStr, row]) => {
      const score = parseInt(scoreStr);
      
      // Skip death row unless death is selected
      if (score === 0 && selections.ambulation !== 'morte') return;
      
      // Check if this score is compatible with all selections
      let isCompatible = true;
      
      // Check each domain
      if (selections.ambulation && row.ambulation !== selections.ambulation) {
        isCompatible = false;
      }
      
      if (selections.activity && row.activity !== '-' && row.activity !== selections.activity) {
        isCompatible = false;
      }
      
      if (selections.selfCare && row.selfCare !== '-' && row.selfCare !== selections.selfCare) {
        isCompatible = false;
      }
      
      if (selections.intake && row.intake !== '-' && row.intake !== selections.intake) {
        isCompatible = false;
      }
      
      if (selections.consciousness && row.consciousness !== '-' && row.consciousness !== selections.consciousness) {
        isCompatible = false;
      }
      
      if (isCompatible) {
        possibleScores.push(score);
      }
    });
    
    // Return the highest possible score
    if (possibleScores.length > 0) {
      return Math.max(...possibleScores);
    }
    
    // If no exact match, use the most restrictive domain
    // This ensures we don't overestimate the patient's condition
    let maxPossibleScore = 100;
    
    // Check what's the maximum possible score for each selected option
    if (selections.ambulation === 'acamado') {
      maxPossibleScore = Math.min(maxPossibleScore, 40); // Acamado appears first at PPS 40
    } else if (selections.ambulation === 'sentado') {
      maxPossibleScore = Math.min(maxPossibleScore, 50);
    } else if (selections.ambulation === 'reduzida') {
      maxPossibleScore = Math.min(maxPossibleScore, 70);
    } else if (selections.ambulation === 'morte') {
      return 0;
    }
    
    if (selections.activity === 'incapacitado') {
      maxPossibleScore = Math.min(maxPossibleScore, 50); // Incapacitado appears first at PPS 50
    } else if (selections.activity === 'incapaz_hobbies') {
      maxPossibleScore = Math.min(maxPossibleScore, 60);
    } else if (selections.activity === 'incapaz_trabalho') {
      maxPossibleScore = Math.min(maxPossibleScore, 70);
    }
    
    if (selections.selfCare === 'dependencia') {
      maxPossibleScore = Math.min(maxPossibleScore, 30); // Dependencia appears first at PPS 30
    } else if (selections.selfCare === 'quase_completo') {
      maxPossibleScore = Math.min(maxPossibleScore, 40);
    } else if (selections.selfCare === 'consideravel') {
      maxPossibleScore = Math.min(maxPossibleScore, 50);
    } else if (selections.selfCare === 'ocasional') {
      maxPossibleScore = Math.min(maxPossibleScore, 60);
    }
    
    if (selections.intake === 'cuidados_boca') {
      maxPossibleScore = Math.min(maxPossibleScore, 10);
    } else if (selections.intake === 'ingestao_limitada') {
      maxPossibleScore = Math.min(maxPossibleScore, 20);
    } else if (selections.intake === 'reduzida') {
      maxPossibleScore = Math.min(maxPossibleScore, 30);
    } else if (selections.intake === 'normal_reduzida') {
      maxPossibleScore = Math.min(maxPossibleScore, 70); // First appears at 70
    }
    
    if (selections.consciousness === 'confuso_coma') {
      maxPossibleScore = Math.min(maxPossibleScore, 10);
    } else if (selections.consciousness === 'periodos_confusao') {
      maxPossibleScore = Math.min(maxPossibleScore, 60); // First appears at 60
    }
    
    return maxPossibleScore;
  };

  const handleOptionSelect = (key: keyof PPSSelections, optionId: string, questionIndex: number) => {
    const newSelections = { ...selections, [key]: optionId };
    setSelections(newSelections);
    
    // Automatically move to next question if not the last one
    if (questionIndex < questions.length - 1) {
      setCurrentStep(questionIndex + 1);
      
      // Scroll to next question after a short delay
      setTimeout(() => {
        const nextQuestionKey = questions[questionIndex + 1].key;
        questionRefs.current[nextQuestionKey]?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({
              y: y - 20, // Add some padding
              animated: true
            });
          },
          () => {}
        );
      }, 300);
    }
    
    // Clear subsequent selections when changing a previous one
    const keyIndex = questions.findIndex(q => q.key === key);
    questions.forEach((q, idx) => {
      if (idx > keyIndex) {
        newSelections[q.key] = '';
      }
    });
    setSelections(newSelections);
  };

  const isAllSelected = () => {
    return Object.values(selections).every(val => val !== '');
  };

  const handleCalculate = () => {
    if (isAllSelected()) {
      setShowResult(true);
      // Scroll to result after showing it
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  };

  const resetSelection = () => {
    setSelections({
      ambulation: '',
      activity: '',
      selfCare: '',
      intake: '',
      consciousness: ''
    });
    setShowResult(false);
    setExpandedCard(null);
    setCurrentStep(0);
  };

  const calculatedScore = showResult ? calculatePPSScore() : null;
  const selectedLevel = calculatedScore !== null ? ppsLevels.find(level => level.score === calculatedScore) : null;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Escala PPS" type="score" />
      
      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Card Informativo */}
          <View style={styles.evaluationCard}>
            <TouchableOpacity onPress={() => toggleCard(0)}>
              <Text style={styles.evaluationTitle}>📋 SOBRE A ESCALA PPS - Avaliação Funcional em Cuidados Paliativos</Text>
            </TouchableOpacity>
            {expandedCard === 0 && (
              <Text style={styles.evaluationText}>
                A Palliative Performance Scale (PPS) avalia o estado funcional de pacientes em cuidados paliativos.{"\n\n"}
                
                <Text style={styles.boldText}>Como funciona:</Text>{"\n"}
                • Avalie 5 domínios do paciente{"\n"}
                • O score final é baseado no pior domínio{"\n"}
                • Varia de 10% a 100%{"\n"}
                • Quanto menor o score, pior o prognóstico
              </Text>
            )}
          </View>

          {/* Cards de Avaliação */}
          {questions.map((question, index) => {
            // Check if this question should be visible
            const isVisible = index <= currentStep;
            
            // Check constraints for each option
            const isOptionEnabled = (option: any) => {
              if (index === 0) {
                return true; // All ambulation options are always enabled initially
              }
              
              // Helper function to calculate max possible PPS based on current selections
              const calculateMaxPossiblePPS = () => {
                let maxPPS = 100;
                
                if (selections.ambulation) {
                  const ambulationOpt = domainOptions.ambulation.find(opt => opt.id === selections.ambulation);
                  if (ambulationOpt) {
                    const ppsScores = Object.entries(ppsTable)
                      .filter(([_, row]) => row.ambulation === selections.ambulation)
                      .map(([score, _]) => parseInt(score));
                    maxPPS = Math.min(maxPPS, Math.max(...ppsScores));
                  }
                }
                
                return maxPPS;
              };

              // Get the possible PPS scores based on selections
              let possiblePPSScores: number[] = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
              
              // Filter by ambulation
              if (selections.ambulation) {
                possiblePPSScores = possiblePPSScores.filter(score => {
                  const row = ppsTable[score as keyof typeof ppsTable];
                  return row && row.ambulation === selections.ambulation;
                });
              }
              
              // Filter by activity if selected
              if (selections.activity) {
                possiblePPSScores = possiblePPSScores.filter(score => {
                  const row = ppsTable[score as keyof typeof ppsTable];
                  return row && (row.activity === selections.activity || row.activity === '-');
                });
              }
              
              // Filter by selfCare if selected AND we're not currently evaluating selfCare options
              if (selections.selfCare && question.key !== 'selfCare') {
                possiblePPSScores = possiblePPSScores.filter(score => {
                  const row = ppsTable[score as keyof typeof ppsTable];
                  return row && (row.selfCare === selections.selfCare || row.selfCare === '-');
                });
              }
              
              // Filter by intake if selected AND we're not currently evaluating intake options
              if (selections.intake && question.key !== 'intake') {
                possiblePPSScores = possiblePPSScores.filter(score => {
                  const row = ppsTable[score as keyof typeof ppsTable];
                  return row && (row.intake === selections.intake || row.intake === '-');
                });
              }
              
              // If no exact matches found but we're not at the first question, be more permissive
              if (possiblePPSScores.length === 0 && index > 0) {
                // Fall back to using minPPS logic
                const maxPossiblePPS = calculateMaxPossiblePPS();
                return option.minPPS <= maxPossiblePPS;
              }
              
              // For consciousness options, check if they exist in the possible scores
              if (question.key === 'consciousness' && possiblePPSScores.length > 0) {
                // Check which consciousness options are actually available for these scores
                const availableConsciousnessOptions = new Set<string>();
                possiblePPSScores.forEach(score => {
                  const row = ppsTable[score as keyof typeof ppsTable];
                  if (row && row.consciousness && row.consciousness !== '-') {
                    availableConsciousnessOptions.add(row.consciousness);
                  }
                });
                return availableConsciousnessOptions.has(option.id);
              }
              
              // Get the maximum possible PPS from remaining scores
              const maxPossiblePPS = possiblePPSScores.length > 0 ? Math.max(...possiblePPSScores) : 0;
              
              // Enable option if it's possible with current max PPS
              return option.minPPS <= maxPossiblePPS;
            };
            
            if (!isVisible) return null;
            
            return (
              <View 
                key={question.key} 
                ref={(ref) => questionRefs.current[question.key] = ref}
                style={[
                  styles.targetsCard,
                  index === 0 && styles.mobilityCard,
                  index === 1 && styles.activityCard,
                  index === 2 && styles.selfCareCard,
                  index === 3 && styles.intakeCard,
                  index === 4 && styles.consciousnessCard
                ]}>
                <Text style={styles.targetsTitle}>{question.title}</Text>
                <View>
                  {question.options.map((option) => {
                    const enabled = isOptionEnabled(option);
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.optionCard,
                          selections[question.key] === option.id && styles.selectedOption,
                          !enabled && styles.disabledOption
                        ]}
                        onPress={() => {
                          // Always allow clicking on already selected options or enabled options
                          if (enabled || selections[question.key] === option.id) {
                            handleOptionSelect(question.key, option.id, index);
                          }
                        }}
                        disabled={false}
                      >
                        <View style={styles.optionContent}>
                          <Text style={[styles.optionIcon, !enabled && styles.disabledText]}>{option.icon}</Text>
                          <Text style={[
                            styles.optionLabel,
                            selections[question.key] === option.id && styles.selectedOptionLabel,
                            !enabled && styles.disabledText
                          ]}>
                            {option.label}
                          </Text>
                        </View>
                        {selections[question.key] === option.id && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}

          {/* Botão Calcular */}
          {!showResult && (
            <TouchableOpacity
              style={[styles.calculateButton, !isAllSelected() && styles.calculateButtonDisabled]}
              onPress={handleCalculate}
              disabled={!isAllSelected()}
            >
              <View style={styles.calculateButtonContent}>
                <Calculator 
                  size={20} 
                  color={isAllSelected() ? '#FFFFFF' : '#9E9E9E'} 
                  style={styles.calculateButtonIcon}
                />
                <Text style={styles.calculateButtonText}>
                  {isAllSelected() ? 'Calcular PPS' : 'Preencha todos os campos'}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Resultado */}
          {showResult && selectedLevel && (
            <>
              <View style={[styles.resultCard, { backgroundColor: selectedLevel.bgColor, borderColor: selectedLevel.color }]}>
                <View style={styles.resultHeader}>
                  <Text style={[styles.resultScore, { color: selectedLevel.color }]}>
                    PPS {selectedLevel.score}%
                  </Text>
                  <Text style={styles.resultDescription}>
                    {selectedLevel.description}
                  </Text>
                </View>
                
                <View style={styles.prognosisContainer}>
                  <Text style={styles.prognosisLabel}>Prognóstico estimado:</Text>
                  <Text style={[styles.prognosisValue, { color: selectedLevel.color }]}>
                    {selectedLevel.prognosis}
                  </Text>
                </View>
              </View>

              <View style={styles.interpretationCard}>
                <Text style={styles.interpretationTitle}>
                  <Info size={20} color={theme.colors.calculator} /> Interpretação Clínica
                </Text>
                <Text style={styles.interpretationText}>
                  {selectedLevel.score >= 70 && (
                    "Paciente com boa performance funcional. Adequado para tratamentos mais agressivos e cuidados ambulatoriais."
                  )}
                  {selectedLevel.score >= 50 && selectedLevel.score < 70 && (
                    "Paciente com performance funcional moderadamente reduzida. Pode se beneficiar de cuidados paliativos especializados."
                  )}
                  {selectedLevel.score >= 30 && selectedLevel.score < 50 && (
                    "Paciente com performance funcional muito reduzida. Priorizar conforto e qualidade de vida."
                  )}
                  {selectedLevel.score >= 10 && selectedLevel.score < 30 && (
                    "Paciente em fase final de vida. Cuidados de conforto e suporte familiar são prioridade."
                  )}
                  {selectedLevel.score === 0 && (
                    "Óbito."
                  )}
                </Text>
              </View>

              <View style={styles.complicationsCard}>
                <Text style={styles.complicationsTitle}>
                  <AlertCircle size={20} color="#DC2626" /> Pontos Importantes
                </Text>
                <Text style={styles.complicationsText}>
                  • Reavalie regularmente (estado pode mudar rapidamente){"\n"}
                  • Originalmente desenvolvida para pacientes com câncer, a escala PPS tem demonstrado eficácia comprovada em estudos com diversas outras patologias{"\n"}
                  • Valores de PPS inferiores a 40% estão associados a um prognóstico de sobrevida inferior a 6 meses{"\n"}
                  • Use em conjunto com outros indicadores clínicos{"\n"}
                  • Auxilia no planejamento de cuidados
                </Text>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetSelection}
              >
                <Text style={styles.resetButtonText}>Nova Avaliação</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.md,
    padding: theme.spacing.xl,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginVertical: theme.spacing.xs,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedOption: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
    shadowColor: '#2196F3',
    shadowOpacity: 0.2,
    elevation: 4,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
  },
  selectedOptionLabel: {
    color: theme.colors.primary,
  },
  checkmark: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
  },
  calculateButton: {
    backgroundColor: '#16A34A',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#15803D',
  },
  calculateButtonDisabled: {
    backgroundColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    borderColor: '#BDBDBD',
  },
  calculateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButtonIcon: {
    marginRight: theme.spacing.sm,
  },
  calculateButtonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  resultCard: {
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  resultHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  resultScore: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  resultDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    flexShrink: 1,
    flexWrap: 'wrap',
    paddingRight: theme.spacing.sm,
  },
  prognosisContainer: {
    marginTop: theme.spacing.md,
  },
  prognosisLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  prognosisValue: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
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
  scoresContainer: {
    gap: theme.spacing.md,
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scoreHeader: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  scoreContent: {
    padding: theme.spacing.md,
  },
  scoreLabel: {
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  scoreDomain: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  prognosisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  scorePrognosis: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  resultContainer: {
    gap: theme.spacing.lg,
  },
  selectedScoreCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
  },
  selectedScoreHeader: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  selectedScoreNumber: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  selectedScoreContent: {
    padding: theme.spacing.lg,
  },
  detailRow: {
    marginBottom: theme.spacing.md,
  },
  detailLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  prognosisRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  prognosisValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  prognosisValue: {
    fontFamily: 'Roboto-Bold',
  },
  interpretationCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  interpretationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  interpretationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  clinicalNotesCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  clinicalNotesTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF9800',
    marginBottom: theme.spacing.md,
  },
  clinicalNotesText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  targetsCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.xs,
    padding: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  mobilityCard: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  activityCard: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
  },
  selfCareCard: {
    backgroundColor: '#F3E5F5',
    borderColor: '#9C27B0',
  },
  intakeCard: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  consciousnessCard: {
    backgroundColor: '#FCE4EC',
    borderColor: '#E91E63',
  },
  targetsTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    letterSpacing: 0.3,
    textTransform: 'capitalize',
    paddingVertical: theme.spacing.xs,
  },
  evaluationCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.sm,
    padding: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  evaluationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#1565C0',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  evaluationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 22,
    marginTop: theme.spacing.sm,
  },
  boldText: {
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  optionIcon: {
    fontSize: 18,
    marginRight: theme.spacing.sm,
  },
  complicationsCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#EF5350',
  },
  complicationsTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#C62828',
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  complicationsText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  disabledOption: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    opacity: 0.6,
  },
  disabledText: {
    color: '#9E9E9E',
  },
});
