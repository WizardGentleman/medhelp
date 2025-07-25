import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Button } from 'react-native';
import Animated, { 
  withTiming, 
  useAnimatedStyle, 
  useSharedValue,
  interpolate
} from 'react-native-reanimated';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { AlertTriangle, Construction, Heart, Activity, Clock, ChevronDown, Calculator, Info, Brain, BookOpen } from 'lucide-react-native';

// Componente de Menu Colapsável
function CollapsibleCard({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useSharedValue(0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    animation.value = withTiming(isOpen ? 0 : 1, { duration: 300 });
  };

  const containerStyle = useAnimatedStyle(() => ({
    height: isOpen ? 'auto' : 0,
    opacity: animation.value,
    overflow: 'hidden',
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(animation.value, [0, 1], [0, 180])}deg` }],
  }));

  return (
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity 
        onPress={toggleMenu}
        style={styles.collapsibleHeader}
      >
        <View style={styles.collapsibleHeaderContent}>
          {icon && <View style={styles.collapsibleIcon}>{icon}</View>}
          <Text style={styles.collapsibleTitle}>{title}</Text>
        </View>
        <Animated.View style={iconStyle}>
          <ChevronDown size={24} color={theme.colors.text} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[containerStyle, styles.collapsibleContent]}>
        {children}
      </Animated.View>
    </View>
  );
}

export default function SepseScreen() {
  const [qSofaScore, setQSofaScore] = useState(0);
  const [qSofaCriteria, setQSofaCriteria] = useState({
    respiratoryRate: false,
    mentalStatus: false,
    systolicBP: false,
  });

  // PaO2/FiO2 Calculator States
  const [paO2, setPaO2] = useState(0);
  const [fiO2, setFiO2] = useState(0);
  const [o2Supplied, setO2Supplied] = useState(0);
  const [pfRatio, setPfRatio] = useState<number | null>(null);

  // PAM Calculator States
  const [systolic, setSystolic] = useState(0);
  const [diastolic, setDiastolic] = useState(0);
  const [pam, setPam] = useState<number | null>(null);

  // SOFA States
  const [sofaScores, setSofaScores] = useState({
    respiration: 0,
    coagulation: 0,
    liver: 0,
    cardiovascular: 0,
    cns: 0,
    renal: 0,
  });

  const toggleQSofaCriteria = (criteria: keyof typeof qSofaCriteria) => {
    const newCriteria = { ...qSofaCriteria, [criteria]: !qSofaCriteria[criteria] };
    setQSofaCriteria(newCriteria);
    
    // Calculate score
    const score = Object.values(newCriteria).filter(v => v).length;
    setQSofaScore(score);
  };

  const updateSofaScore = (system: keyof typeof sofaScores, score: number) => {
    setSofaScores(prev => ({ ...prev, [system]: score }));
  };

  const getTotalSofaScore = () => {
    return Object.values(sofaScores).reduce((sum, score) => sum + score, 0);
  };

  const calculatePFRatio = () => {
    let calculatedFiO2 = fiO2;
    
    // Se o O2 ofertado foi preenchido, calcular FiO2 usando a fórmula: 21 + 4 x O2 ofertado
    if (o2Supplied > 0) {
      calculatedFiO2 = 21 + 4 * o2Supplied;
    }
    
    // Converter FiO2 de porcentagem para decimal (se necessário)
    if (calculatedFiO2 > 1) {
      calculatedFiO2 = calculatedFiO2 / 100;
    }
    
    // Calcular PaO2/FiO2
    if (paO2 > 0 && calculatedFiO2 > 0) {
      const ratio = paO2 / calculatedFiO2;
      setPfRatio(ratio);
    }
  };

  const calculatePAM = () => {
    if (systolic > 0 && diastolic > 0) {
      const calculatedPAM = (systolic + 2 * diastolic) / 3;
      setPam(calculatedPAM);
    }
  };
  return (
    <View style={styles.container}>
      <ScreenHeader title="Sepse" type="emergency" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Card de Informação */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <AlertTriangle size={24} color={theme.colors.emergency} />
              <Text style={styles.infoTitle}>Protocolo de Sepse</Text>
            </View>
            <Text style={styles.infoText}>
              Protocolo para identificação precoce, tratamento e manejo da sepse e choque séptico, 
              seguindo as diretrizes internacionais da Surviving Sepsis Campaign.
            </Text>
          </View>

          {/* Card de Critério Diagnóstico */}
          <CollapsibleCard 
            title="Critério Diagnóstico" 
            icon={<Calculator size={20} color={theme.colors.emergency} />}
          >
            <View style={styles.diagnosticContent}>
              {/* qSOFA Card */}
              <CollapsibleCard 
                title="qSOFA (quick Sequential Organ Failure Assessment)" 
                icon={<Brain size={20} color="#2196F3" />}
              >
                <View style={styles.qSofaContent}>
                  <Text style={styles.qSofaDescription}>
                    Ferramenta de triagem rápida para identificar pacientes com suspeita de infecção 
                    que estão em risco de desfechos desfavoráveis.
                  </Text>

                  <View style={styles.criteriaSection}>
                    <Text style={styles.criteriaSectionTitle}>Critérios (1 ponto cada):</Text>
                    
                    <TouchableOpacity 
                      style={[
                        styles.criteriaItem,
                        qSofaCriteria.respiratoryRate && styles.criteriaItemSelected
                      ]}
                      onPress={() => toggleQSofaCriteria('respiratoryRate')}
                    >
                      <View style={[
                        styles.criteriaCheckbox,
                        qSofaCriteria.respiratoryRate && styles.criteriaCheckboxSelected
                      ]}>
                        {qSofaCriteria.respiratoryRate && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.criteriaText}>
                        Frequência respiratória ≥ 22/min
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[
                        styles.criteriaItem,
                        qSofaCriteria.mentalStatus && styles.criteriaItemSelected
                      ]}
                      onPress={() => toggleQSofaCriteria('mentalStatus')}
                    >
                      <View style={[
                        styles.criteriaCheckbox,
                        qSofaCriteria.mentalStatus && styles.criteriaCheckboxSelected
                      ]}>
                        {qSofaCriteria.mentalStatus && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.criteriaText}>
                        Alteração do estado mental (Glasgow {'<'} 15)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[
                        styles.criteriaItem,
                        qSofaCriteria.systolicBP && styles.criteriaItemSelected
                      ]}
                      onPress={() => toggleQSofaCriteria('systolicBP')}
                    >
                      <View style={[
                        styles.criteriaCheckbox,
                        qSofaCriteria.systolicBP && styles.criteriaCheckboxSelected
                      ]}>
                        {qSofaCriteria.systolicBP && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.criteriaText}>
                        Pressão arterial sistólica ≤ 100 mmHg
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={[
                    styles.scoreCard,
                    qSofaScore >= 2 && styles.scoreCardHigh
                  ]}>
                    <Text style={styles.scoreLabel}>Pontuação qSOFA:</Text>
                    <Text style={[
                      styles.scoreValue,
                      qSofaScore >= 2 && styles.scoreValueHigh
                    ]}>
                      {qSofaScore}/3
                    </Text>
                  </View>

                  <View style={styles.interpretationSection}>
                    <Text style={styles.interpretationTitle}>
                      <Info size={20} color="#2196F3" /> Interpretação
                    </Text>
                    
                    <View style={[
                      styles.interpretationCard,
                      qSofaScore >= 2 && styles.interpretationCardHigh
                    ]}>
                      <Text style={styles.interpretationText}>
                        {qSofaScore >= 2 ? (
                          <>
                            <Text style={styles.interpretationBold}>qSOFA ≥ 2 pontos: </Text>
                            Paciente com maior probabilidade de desfechos desfavoráveis 
                            (internação prolongada em UTI ou morte hospitalar).
                          </>
                        ) : (
                          <>
                            <Text style={styles.interpretationBold}>qSOFA {'<'} 2 pontos: </Text>
                            Continuar monitoramento e avaliação clínica. A ausência de 
                            critérios não exclui sepse.
                          </>
                        )}
                      </Text>
                    </View>

                    <View style={styles.recommendationsCard}>
                      <Text style={styles.recommendationsTitle}>Recomendações:</Text>
                      <Text style={styles.recommendationsText}>
                        • Útil em ambientes fora do hospital, pronto-socorro ou enfermarias{"\n"}
                        • Não requer exames laboratoriais{"\n"}
                        • Pode ser avaliado de forma rápida e repetida{"\n"}
                        • Quando qSOFA ≥ 2: investigar disfunção orgânica, intensificar terapia e considerar cuidados críticos{"\n"}
                        • Considerar possível infecção em pacientes não previamente reconhecidos como infectados
                      </Text>
                    </View>

                    <View style={styles.warningBox}>
                      <AlertTriangle size={20} color="#FF9800" />
                      <Text style={styles.warningBoxText}>
                        <Text style={styles.warningBold}>Importante: </Text>
                        qSOFA não é uma definição de sepse. Falha em atender 2 ou mais critérios 
                        não deve atrasar investigação ou tratamento de infecção suspeita.
                      </Text>
                    </View>
                  </View>
                </View>
              </CollapsibleCard>

{/* SOFA Card */}
              <CollapsibleCard 
                title="SOFA (Sequential Organ Failure Assessment)" 
                icon={<Activity size={20} color="#4CAF50" />}
              >
                <View style={styles.sofaContent}>
                  <Text style={styles.qSofaDescription}>
                    Avaliação sistemática de disfunções orgânicas. Cada sistema é pontuado de 0 a 4 pontos.
                  </Text>

                  {/* Respiração */}
                  <View style={styles.sofaSystemSection}>
                    <Text style={styles.sofaSystemTitle}>1. Respiração (PaO₂/FiO₂ mmHg)</Text>
                    <View style={styles.sofaOptionsContainer}>
                      {[
                        { score: 0, label: '≥ 400' },
                        { score: 1, label: '< 400' },
                        { score: 2, label: '< 300' },
                        { score: 3, label: '< 200 com suporte' },
                        { score: 4, label: '< 100 com suporte' }
                      ].map(option => (
                        <TouchableOpacity
                          key={option.score}
                          style={[
                            styles.sofaOption,
                            sofaScores.respiration === option.score && styles.sofaOptionSelected
                          ]}
                          onPress={() => updateSofaScore('respiration', option.score)}
                        >
                          <Text style={[
                            styles.sofaOptionText,
                            sofaScores.respiration === option.score && styles.sofaOptionTextSelected
                          ]}>
                            <Text style={[
                              styles.sofaScoreNumber,
                              sofaScores.respiration === option.score && styles.sofaScoreNumberSelected
                            ]}>{option.score}</Text>
                            <Text>: {option.label}</Text>
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* PaO₂/FiO₂ Calculator */}
                  <CollapsibleCard 
                    title="Calculadora PaO₂/FiO₂" 
                    icon={<Calculator size={16} color="#2196F3" />}
                  >
                    <View style={styles.pfCalculatorContent}>
                      <Text style={styles.pfCalculatorDescription}>
                        Calcule o índice de oxigenação utilizando a relação PaO₂/FiO₂.
                      </Text>
                      <View style={styles.calculatorInputSection}>
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>PaO₂ (mmHg):</Text>
                          <TextInput 
                            style={styles.calculatorInput} 
                            placeholder=""
                            keyboardType="numeric"
                            onChangeText={(text) => setPaO2(parseFloat(text) || 0)}
                          />
                        </View>
                        
                        <View style={styles.dividerSection}>
                          <View style={styles.dividerLine} />
                          <Text style={styles.dividerText}>FiO₂</Text>
                          <View style={styles.dividerLine} />
                        </View>
                        
                        <View style={styles.fiO2Container}>
                          <View style={styles.fiO2InputWrapper}>
                            <Text style={styles.inputLabel}>FiO₂ (%):</Text>
                            <TextInput 
                              style={[styles.calculatorInput, o2Supplied > 0 && styles.inputDisabled]}
                              placeholder=""
                              keyboardType="numeric"
                              value={fiO2 > 0 && o2Supplied === 0 ? fiO2.toString() : ''}
                              editable={o2Supplied === 0}
                              onChangeText={(text) => {
                                setFiO2(parseFloat(text) || 0);
                                setO2Supplied(0);
                              }}
                            />
                          </View>
                          
                          <Text style={styles.orDivider}>OU</Text>
                          
                          <View style={styles.fiO2InputWrapper}>
                            <Text style={styles.inputLabel}>O₂ ofertado (L/min):</Text>
                            <TextInput 
                              style={[styles.calculatorInput, fiO2 > 0 && o2Supplied === 0 && styles.inputDisabled]}
                              placeholder=""
                              keyboardType="numeric"
                              value={o2Supplied > 0 ? o2Supplied.toString() : ''}
                              editable={fiO2 === 0 || o2Supplied > 0}
                              onChangeText={(text) => {
                                const value = parseFloat(text) || 0;
                                setO2Supplied(value);
                                if (value > 0) {
                                  const calculatedFiO2 = 21 + 4 * value;
                                  setFiO2(calculatedFiO2);
                                } else {
                                  setFiO2(0);
                                }
                              }}
                            />
                          </View>
                        </View>
                        
                        {((fiO2 > 0 && o2Supplied === 0) || (o2Supplied > 0)) && (
                          <View style={styles.warningContainer}>
                            {fiO2 > 0 && o2Supplied === 0 && (
                              <Text style={styles.fieldWarning}>
                                ⚠ Para usar O₂ ofertado, limpe o campo FiO₂
                              </Text>
                            )}
                            {o2Supplied > 0 && (
                              <>
                                <Text style={styles.fieldWarning}>
                                  ⚠ Para usar FiO₂ direto, limpe o campo O₂ ofertado
                                </Text>
                                <Text style={styles.calculatedFiO2Text}>
                                  FiO₂ calculado: {(21 + 4 * o2Supplied).toFixed(0)}%
                                </Text>
                              </>
                            )}
                          </View>
                        )}
                        
                        <TouchableOpacity 
                          style={styles.calculateButton}
                          onPress={calculatePFRatio}
                        >
                          <Text style={styles.calculateButtonText}>Calcular</Text>
                        </TouchableOpacity>
                        
                        {pfRatio !== null && (
                          <View style={[
                            styles.pfResultCard,
                            pfRatio < 100 && styles.pfResultCardCritical,
                            pfRatio < 200 && pfRatio >= 100 && styles.pfResultCardSevere,
                            pfRatio < 300 && pfRatio >= 200 && styles.pfResultCardModerate,
                            pfRatio < 400 && pfRatio >= 300 && styles.pfResultCardMild
                          ]}>
                            <Text style={styles.pfResultLabel}>Índice PaO₂/FiO₂:</Text>
                            <Text style={styles.pfResultValue}>{pfRatio.toFixed(1)} mmHg</Text>
                            <Text style={styles.pfResultInterpretation}>
                              {pfRatio >= 400 && 'Normal'}
                              {pfRatio < 400 && pfRatio >= 300 && 'Lesão pulmonar leve'}
                              {pfRatio < 300 && pfRatio >= 200 && 'Lesão pulmonar moderada'}
                              {pfRatio < 200 && pfRatio >= 100 && 'Lesão pulmonar grave'}
                              {pfRatio < 100 && 'Lesão pulmonar muito grave'}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </CollapsibleCard>

                  {/* Coagulação */}
                  <View style={styles.sofaSystemSection}>
                    <Text style={styles.sofaSystemTitle}>2. Coagulação (Plaquetas ×10³/µL)</Text>
                    <View style={styles.sofaOptionsContainer}>
                      {[
                        { score: 0, label: '≥ 150' },
                        { score: 1, label: '< 150' },
                        { score: 2, label: '< 100' },
                        { score: 3, label: '< 50' },
                        { score: 4, label: '< 20' }
                      ].map(option => (
                        <TouchableOpacity
                          key={option.score}
                          style={[
                            styles.sofaOption,
                            sofaScores.coagulation === option.score && styles.sofaOptionSelected
                          ]}
                          onPress={() => updateSofaScore('coagulation', option.score)}
                        >
                          <Text style={[
                            styles.sofaOptionText,
                            sofaScores.coagulation === option.score && styles.sofaOptionTextSelected
                          ]}>
                            <Text style={[
                              styles.sofaScoreNumber,
                              sofaScores.coagulation === option.score && styles.sofaScoreNumberSelected
                            ]}>{option.score}</Text>
                            <Text>: {option.label}</Text>
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Fígado */}
                  <View style={styles.sofaSystemSection}>
                    <Text style={styles.sofaSystemTitle}>3. Fígado (Bilirrubina mg/dL)</Text>
                    <View style={styles.sofaOptionsContainer}>
                      {[
                        { score: 0, label: '< 1.2' },
                        { score: 1, label: '1.2 - 1.9' },
                        { score: 2, label: '2.0 - 5.9' },
                        { score: 3, label: '6.0 - 11.9' },
                        { score: 4, label: '> 12.0' }
                      ].map(option => (
                        <TouchableOpacity
                          key={option.score}
                          style={[
                            styles.sofaOption,
                            sofaScores.liver === option.score && styles.sofaOptionSelected
                          ]}
                          onPress={() => updateSofaScore('liver', option.score)}
                        >
                          <Text style={[
                            styles.sofaOptionText,
                            sofaScores.liver === option.score && styles.sofaOptionTextSelected
                          ]}>
                            <Text style={[
                              styles.sofaScoreNumber,
                              sofaScores.liver === option.score && styles.sofaScoreNumberSelected
                            ]}>{option.score}</Text>
                            <Text>: {option.label}</Text>
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Cardiovascular */}
                  <View style={styles.sofaSystemSection}>
                    <Text style={styles.sofaSystemTitle}>4. Cardiovascular</Text>
                    <View style={styles.sofaOptionsContainer}>
                      {[
                        { score: 0, label: 'PAM ≥ 70' },
                        { score: 1, label: 'PAM < 70' },
                        { score: 2, label: 'Dopa < 5 ou Dobuta (qualquer dose)' },
                        { score: 3, label: 'Dopa 5-15 ou Epi/Nora ≤ 0.1' },
                        { score: 4, label: 'Dopa > 15 ou Epi/Nora > 0.1' }
                      ].map(option => (
                        <TouchableOpacity
                          key={option.score}
                          style={[
                            styles.sofaOption,
                            sofaScores.cardiovascular === option.score && styles.sofaOptionSelected
                          ]}
                          onPress={() => updateSofaScore('cardiovascular', option.score)}
                        >
                          <Text style={[
                            styles.sofaOptionText,
                            sofaScores.cardiovascular === option.score && styles.sofaOptionTextSelected
                          ]}>
                            <Text style={[
                              styles.sofaScoreNumber,
                              sofaScores.cardiovascular === option.score && styles.sofaScoreNumberSelected
                            ]}>{option.score}</Text>
                            <Text>: {option.label}</Text>
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <Text style={styles.sofaDoseNote}>Doses em µg/kg/min por ≥ 1 hora</Text>
                  </View>

                  {/* PAM Calculator */}
                  <CollapsibleCard 
                    title="Calculadora PAM (Pressão Arterial Média)" 
                    icon={<Heart size={16} color="#E91E63" />}
                  >
                    <View style={styles.pamCalculatorContent}>
                      <Text style={styles.pamCalculatorDescription}>
                        Calcule a Pressão Arterial Média usando a fórmula:
                      </Text>
                      <Text style={styles.pamFormula}>
                        PAM = (PAS + 2 × PAD) ÷ 3
                      </Text>
                      
                      <View style={styles.pamInputSection}>
                        <View style={styles.pamInputRow}>
                          <View style={styles.pamInputGroup}>
                            <Text style={styles.pamInputLabel}>PAS (mmHg):</Text>
                            <TextInput 
                              style={styles.pamInput} 
                              placeholder=""
                              keyboardType="numeric"
                              value={systolic > 0 ? systolic.toString() : ''}
                              onChangeText={(text) => {
                                setSystolic(parseFloat(text) || 0);
                                setPam(null);
                              }}
                            />
                            <Text style={styles.pamInputHelper}>Pressão Arterial Sistólica</Text>
                          </View>
                          
                          <View style={styles.pamInputGroup}>
                            <Text style={styles.pamInputLabel}>PAD (mmHg):</Text>
                            <TextInput 
                              style={styles.pamInput} 
                              placeholder=""
                              keyboardType="numeric"
                              value={diastolic > 0 ? diastolic.toString() : ''}
                              onChangeText={(text) => {
                                setDiastolic(parseFloat(text) || 0);
                                setPam(null);
                              }}
                            />
                            <Text style={styles.pamInputHelper}>Pressão Arterial Diastólica</Text>
                          </View>
                        </View>
                        
                        <TouchableOpacity 
                          style={styles.pamCalculateButton}
                          onPress={calculatePAM}
                          disabled={systolic === 0 || diastolic === 0}
                        >
                          <Text style={styles.pamCalculateButtonText}>Calcular PAM</Text>
                        </TouchableOpacity>
                        
                        {pam !== null && (
                          <View style={[
                            styles.pamResultCard,
                            pam < 65 && styles.pamResultCardLow,
                            pam >= 65 && pam < 70 && styles.pamResultCardBorderline,
                            pam >= 70 && pam < 110 && styles.pamResultCardNormal,
                            pam >= 110 && styles.pamResultCardHigh
                          ]}>
                            <Text style={styles.pamResultLabel}>Pressão Arterial Média:</Text>
                            <Text style={styles.pamResultValue}>{pam.toFixed(1)} mmHg</Text>
                            <Text style={styles.pamResultInterpretation}>
                              {pam < 65 && 'PAM Baixa - Risco de hipoperfusão'}
                              {pam >= 65 && pam < 70 && 'PAM Limítrofe'}
                              {pam >= 70 && pam < 110 && 'PAM Normal'}
                              {pam >= 110 && 'PAM Elevada'}
                            </Text>
                            
                            {pam < 65 && (
                              <Text style={styles.pamWarning}>
                                ⚠ Considerar suporte vasopressor se necessário
                              </Text>
                            )}
                          </View>
                        )}
                        
                        <View style={styles.pamInfoCard}>
                          <Text style={styles.pamInfoTitle}>Valores de Referência:</Text>
                          <Text style={styles.pamInfoText}>
                            • PAM Normal: 70-110 mmHg{"\n"}
                            • PAM Alvo em choque séptico: ≥ 65 mmHg{"\n"}
                            • PAM {'<'} 65 mmHg: Associada a hipoperfusão orgânica
                          </Text>
                        </View>
                      </View>
                    </View>
                  </CollapsibleCard>

                  {/* SNC */}
                  <View style={styles.sofaSystemSection}>
                    <Text style={styles.sofaSystemTitle}>5. SNC (Escala de Glasgow)</Text>
                    <View style={styles.sofaOptionsContainer}>
                      {[
                        { score: 0, label: '15' },
                        { score: 1, label: '13 - 14' },
                        { score: 2, label: '10 - 12' },
                        { score: 3, label: '6 - 9' },
                        { score: 4, label: '< 6' }
                      ].map(option => (
                        <TouchableOpacity
                          key={option.score}
                          style={[
                            styles.sofaOption,
                            sofaScores.cns === option.score && styles.sofaOptionSelected
                          ]}
                          onPress={() => updateSofaScore('cns', option.score)}
                        >
                          <Text style={[
                            styles.sofaOptionText,
                            sofaScores.cns === option.score && styles.sofaOptionTextSelected
                          ]}>
                            <Text style={[
                              styles.sofaScoreNumber,
                              sofaScores.cns === option.score && styles.sofaScoreNumberSelected
                            ]}>{option.score}</Text>
                            <Text>: {option.label}</Text>
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Renal */}
                  <View style={styles.sofaSystemSection}>
                    <Text style={styles.sofaSystemTitle}>6. Renal (Creatinina mg/dL ou Débito Urinário)</Text>
                    <View style={styles.sofaOptionsContainer}>
                      {[
                        { score: 0, label: '< 1.2' },
                        { score: 1, label: '1.2 - 1.9' },
                        { score: 2, label: '2.0 - 3.4' },
                        { score: 3, label: '3.5 - 4.9 ou Débito urinário < 500ml/dia' },
                        { score: 4, label: '> 5.0 ou Débito urinário < 200ml/dia' }
                      ].map(option => (
                        <TouchableOpacity
                          key={option.score}
                          style={[
                            styles.sofaOption,
                            sofaScores.renal === option.score && styles.sofaOptionSelected
                          ]}
                          onPress={() => updateSofaScore('renal', option.score)}
                        >
                          <Text style={[
                            styles.sofaOptionText,
                            sofaScores.renal === option.score && styles.sofaOptionTextSelected
                          ]}>
                            <Text style={[
                              styles.sofaScoreNumber,
                              sofaScores.renal === option.score && styles.sofaScoreNumberSelected
                            ]}>{option.score}</Text>
                            <Text>: {option.label}</Text>
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Score Total */}
                  <View style={[
                    styles.scoreCard,
                    getTotalSofaScore() >= 2 && styles.scoreCardHigh
                  ]}>
                    <Text style={styles.scoreLabel}>Pontuação SOFA Total:</Text>
                    <Text style={[
                      styles.scoreValue,
                      getTotalSofaScore() >= 2 && styles.scoreValueHigh
                    ]}>
                      {getTotalSofaScore()}/24
                    </Text>
                  </View>

                  {/* Interpretação */}
                  <View style={styles.interpretationSection}>
                    <Text style={styles.interpretationTitle}>
                      <Info size={20} color="#4CAF50" /> Interpretação do SOFA
                    </Text>
                    
                    <View style={[
                      styles.interpretationCard,
                      getTotalSofaScore() >= 2 && styles.interpretationCardHigh
                    ]}>
                      <Text style={styles.interpretationText}>
                        {getTotalSofaScore() >= 2 ? (
                          <>
                            <Text style={styles.interpretationBold}>Aumento ≥ 2 pontos: </Text>
                            Disfunção orgânica identificada. Mortalidade hospitalar superior a 10%. 
                            Risco de morte 2-25 vezes maior comparado a SOFA {'<'} 2.
                          </>
                        ) : (
                          <>
                            <Text style={styles.interpretationBold}>SOFA {'<'} 2 pontos: </Text>
                            Continuar monitoramento. Considerar o contexto clínico completo.
                          </>
                        )}
                      </Text>
                    </View>

                    <View style={styles.recommendationsCard}>
                      <Text style={styles.recommendationsTitle}>Pontos Importantes:</Text>
                      <Text style={styles.recommendationsText}>
                        • <Text style={styles.recommendationsBold}>Definição de Sepse:</Text> Disfunção orgânica com risco de vida por resposta desregulada à infecção{"\n"}
                        • <Text style={styles.recommendationsBold}>Linha de Base:</Text> SOFA basal = 0, exceto se disfunção prévia conhecida{"\n"}
                        • <Text style={styles.recommendationsBold}>Complementaridade:</Text> qSOFA para triagem rápida → SOFA para avaliação completa{"\n"}
                        • <Text style={styles.recommendationsBold}>Atenção:</Text> Não atrasar investigação/tratamento baseado apenas nos escores
                      </Text>
                    </View>

                    <View style={styles.sofaDetailCard}>
                      <Text style={styles.sofaDetailTitle}>Detalhamento dos Sistemas:</Text>
                      {Object.entries(sofaScores).map(([system, score]) => {
                        const systemNames = {
                          respiration: 'Respiração',
                          coagulation: 'Coagulação',
                          liver: 'Fígado',
                          cardiovascular: 'Cardiovascular',
                          cns: 'SNC',
                          renal: 'Renal'
                        };
                        return (
                          <View key={system} style={styles.sofaDetailRow}>
                            <Text style={styles.sofaDetailSystem}>
                              {systemNames[system as keyof typeof systemNames]}:
                            </Text>
                            <Text style={[
                              styles.sofaDetailScore,
                              score > 0 && styles.sofaDetailScoreHigh
                            ]}>
                              {score} pontos
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>
              </CollapsibleCard>
            </View>
          </CollapsibleCard>

          {/* Card Em Construção */}
          <View style={styles.constructionCard}>
            <View style={styles.constructionHeader}>
              <Construction size={32} color="#FF9800" />
              <Text style={styles.constructionTitle}>Página em Construção</Text>
            </View>
            
            <Text style={styles.constructionText}>
              Esta seção está sendo desenvolvida e em breve conterá:
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Heart size={20} color={theme.colors.emergency} />
                <Text style={styles.featureText}>Critérios diagnósticos de SIRS e qSOFA</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Activity size={20} color={theme.colors.emergency} />
                <Text style={styles.featureText}>Pacote de medidas da primeira hora</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Clock size={20} color={theme.colors.emergency} />
                <Text style={styles.featureText}>Protocolo de ressuscitação volêmica</Text>
              </View>
              
              <View style={styles.featureItem}>
                <AlertTriangle size={20} color={theme.colors.emergency} />
                <Text style={styles.featureText}>Escolha e dosagem de vasopressores</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Heart size={20} color={theme.colors.emergency} />
                <Text style={styles.featureText}>Metas hemodinâmicas e de perfusão</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Activity size={20} color={theme.colors.emergency} />
                <Text style={styles.featureText}>Antibioticoterapia empírica por foco</Text>
              </View>
            </View>

            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Em breve!</Text>
            </View>
          </View>

          {/* Card de Aviso */}
          <View style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <AlertTriangle size={20} color="#F44336" />
              <Text style={styles.warningTitle}>Importante</Text>
            </View>
            <Text style={styles.warningText}>
              Enquanto esta página está em desenvolvimento, consulte os protocolos institucionais 
              vigentes e as diretrizes mais recentes da Surviving Sepsis Campaign para o manejo 
              adequado de pacientes com sepse.
            </Text>
          </View>

          {/* Card de Referência */}
          <CollapsibleCard 
            title="Referência" 
            icon={<BookOpen size={20} color={theme.colors.text} />}
          >
            <View style={styles.referenceContent}>
              <View style={styles.referenceCard}>
                <Text style={styles.referenceText}>
                  Singer M, Deutschman CS, Seymour CW, et al. The Third International Consensus 
                  Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA. 2016;315(8):801-810. 
                  doi:10.1001/jama.2016.0287
                </Text>
              </View>
            </View>
          </CollapsibleCard>
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
  // Collapsible Card Styles
  collapsibleContainer: {
    marginBottom: theme.spacing.lg,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: 'white',
  },
  collapsibleHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  collapsibleIcon: {
    marginRight: theme.spacing.md,
  },
  collapsibleTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  collapsibleContent: {
    minHeight: 0,
    overflow: 'hidden',
  },
  diagnosticContent: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  // qSOFA Styles
  qSofaContent: {
    padding: theme.spacing.lg,
  },
  qSofaDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  criteriaSection: {
    marginBottom: theme.spacing.lg,
  },
  criteriaSectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  criteriaItemSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  criteriaCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  criteriaCheckboxSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  criteriaText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    flex: 1,
  },
  scoreCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  scoreCardHigh: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  scoreLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  scoreValue: {
    fontSize: theme.fontSize.xxl,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
  },
  scoreValueHigh: {
    color: '#F44336',
  },
  interpretationSection: {
    gap: theme.spacing.md,
  },
  interpretationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#2196F3',
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  interpretationCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  interpretationCardHigh: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  interpretationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  interpretationBold: {
    fontFamily: 'Roboto-Bold',
  },
  recommendationsCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  recommendationsTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.md,
  },
  recommendationsText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  warningBoxText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
    flex: 1,
  },
  warningBold: {
    fontFamily: 'Roboto-Bold',
  },
  // SOFA Styles
  sofaContent: {
    padding: theme.spacing.lg,
  },
  sofaSystemSection: {
    marginBottom: theme.spacing.lg,
  },
  sofaSystemTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  sofaOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  sofaOption: {
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 80,
  },
  sofaOptionSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  sofaOptionText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    textAlign: 'center',
  },
  sofaOptionTextSelected: {
    color: 'white',
  },
  sofaDoseNote: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  sofaDetailCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  sofaDetailTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.md,
  },
  sofaDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  sofaDetailSystem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  sofaDetailScore: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  sofaDetailScoreHigh: {
    color: '#F44336',
  },
  sofaScoreNumber: {
    fontFamily: 'Roboto-Bold',
    fontSize: theme.fontSize.md,
    marginRight: 4,
    color: '#2196F3', // Azul fixo para todos os números
  },
  sofaScoreNumberSelected: {
    color: 'white',
  },
  recommendationsBold: {
    fontFamily: 'Roboto-Bold',
  },
  // Reference Styles
  referenceContent: {
    padding: theme.spacing.lg,
  },
  referenceCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  referenceText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  infoCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.emergency,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  infoTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  constructionCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  constructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  constructionTitle: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: '#FF9800',
  },
  constructionText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  featuresList: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  featureText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    flex: 1,
  },
  comingSoonBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  comingSoonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF9800',
  },
  warningCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  warningTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#F44336',
  },
  warningText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // PaO2/FiO2 Calculator Styles
  pfCalculatorContent: {
    padding: theme.spacing.lg,
    backgroundColor: '#F8F9FA',
  },
  pfCalculatorDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  calculatorInputSection: {
    gap: theme.spacing.md,
  },
  inputGroup: {
    marginBottom: theme.spacing.sm,
  },
  inputLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  calculatorInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    backgroundColor: 'white',
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.md,
  },
  fiO2Container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  fiO2InputWrapper: {
    flex: 1,
  },
  orDivider: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.textSecondary,
    alignSelf: 'center',
    marginTop: 30,
  },
  inputDisabled: {
    backgroundColor: '#F0F0F0',
    opacity: 0.6,
  },
  calculatedFiO2Text: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#2196F3',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  warningContainer: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  fieldWarning: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: '#F44336',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  calculateButton: {
    backgroundColor: '#2196F3',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  pfResultCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#2196F3',
    alignItems: 'center',
  },
  pfResultCardMild: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
  },
  pfResultCardModerate: {
    backgroundColor: '#FFE0B2',
    borderColor: '#FF6F00',
  },
  pfResultCardSevere: {
    backgroundColor: '#FFCCBC',
    borderColor: '#E64A19',
  },
  pfResultCardCritical: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  pfResultLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  pfResultValue: {
    fontSize: theme.fontSize.xxl,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  pfResultInterpretation: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    textAlign: 'center',
  },
  // PAM Calculator Styles
  pamCalculatorContent: {
    padding: theme.spacing.lg,
    backgroundColor: '#FFF0F8',
  },
  pamCalculatorDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  pamFormula: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    backgroundColor: 'white',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  pamInputSection: {
    gap: theme.spacing.md,
  },
  pamInputRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  pamInputGroup: {
    flex: 1,
  },
  pamInputLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  pamInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    backgroundColor: 'white',
    textAlign: 'center',
  },
  pamInputHelper: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  pamCalculateButton: {
    backgroundColor: '#E91E63',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  pamCalculateButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  pamResultCard: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  pamResultCardLow: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  pamResultCardBorderline: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
  },
  pamResultCardNormal: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  pamResultCardHigh: {
    backgroundColor: '#FFE0B2',
    borderColor: '#FF6F00',
  },
  pamResultLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  pamResultValue: {
    fontSize: theme.fontSize.xxl,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  pamResultInterpretation: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    textAlign: 'center',
  },
  pamWarning: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#F44336',
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  pamInfoCard: {
    backgroundColor: '#FCE4EC',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  pamInfoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#E91E63',
    marginBottom: theme.spacing.sm,
  },
  pamInfoText: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
});
