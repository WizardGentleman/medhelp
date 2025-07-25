import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Brain, Info, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, RotateCcw } from 'lucide-react-native';

interface NIHSSItem {
  id: string;
  title: string;
  description: string;
  options: {
    score: number;
    text: string;
    description?: string;
  }[];
}

interface NIHSSScores {
  [key: string]: number | null;
}

interface NIHSSResult {
  totalScore: number;
  severity: string;
  severityColor: string;
  interpretation: string;
  recommendations: string[];
  prognosis: string;
}

const nihssItems: NIHSSItem[] = [
  {
    id: 'consciousness',
    title: '1a. Nível de Consciência',
    description: 'Avalie o estado de alerta do paciente',
    options: [
      { score: 0, text: 'Alerta', description: 'Responsivo e atento' },
      { score: 1, text: 'Sonolento', description: 'Desperta com estímulo verbal mínimo' },
      { score: 2, text: 'Estupor', description: 'Desperta apenas com estímulo repetido ou doloroso' },
      { score: 3, text: 'Coma', description: 'Não responsivo ou reflexos apenas' }
    ]
  },
  {
    id: 'questions',
    title: '1b. Perguntas de Orientação',
    description: 'Pergunte idade e mês atual',
    options: [
      { score: 0, text: 'Ambas corretas', description: 'Responde corretamente idade e mês' },
      { score: 1, text: 'Uma correta', description: 'Responde corretamente apenas uma' },
      { score: 2, text: 'Nenhuma correta', description: 'Não responde ou ambas incorretas' }
    ]
  },
  {
    id: 'commands',
    title: '1c. Comandos',
    description: 'Peça para abrir/fechar os olhos e apertar/soltar a mão',
    options: [
      { score: 0, text: 'Ambos corretos', description: 'Executa ambos os comandos' },
      { score: 1, text: 'Um correto', description: 'Executa apenas um comando' },
      { score: 2, text: 'Nenhum correto', description: 'Não executa nenhum comando' }
    ]
  },
  {
    id: 'gaze',
    title: '2. Movimentos Oculares',
    description: 'Teste movimentos oculares horizontais',
    options: [
      { score: 0, text: 'Normal', description: 'Movimentos oculares normais' },
      { score: 1, text: 'Paralisia parcial', description: 'Paralisia parcial do olhar' },
      { score: 2, text: 'Desvio forçado', description: 'Desvio forçado ou paralisia total' }
    ]
  },
  {
    id: 'visual',
    title: '3. Campos Visuais',
    description: 'Teste campos visuais por confrontação',
    options: [
      { score: 0, text: 'Sem perda', description: 'Campos visuais normais' },
      { score: 1, text: 'Hemianopsia parcial', description: 'Hemianopsia parcial' },
      { score: 2, text: 'Hemianopsia completa', description: 'Hemianopsia completa' },
      { score: 3, text: 'Cegueira bilateral', description: 'Cegueira bilateral (incluindo cortical)' }
    ]
  },
  {
    id: 'facial',
    title: '4. Paralisia Facial',
    description: 'Teste simetria facial (sorriso, mostrar dentes)',
    options: [
      { score: 0, text: 'Normal', description: 'Movimentos faciais normais ou simétricos' },
      { score: 1, text: 'Paralisia menor', description: 'Paralisia menor (apagamento do sulco nasolabial)' },
      { score: 2, text: 'Paralisia parcial', description: 'Paralisia parcial (paralisia total ou quase total da face inferior)' },
      { score: 3, text: 'Paralisia completa', description: 'Paralisia completa (ausência de movimentos faciais)' }
    ]
  },
  {
    id: 'motorArm',
    title: '5. Motor - Braços',
    description: 'Teste força dos braços (elevar por 10 segundos)',
    options: [
      { score: 0, text: 'Sem queda', description: 'Mantém por 10 segundos sem queda' },
      { score: 1, text: 'Queda gradual', description: 'Queda gradual, toca a cama em 10 segundos' },
      { score: 2, text: 'Esforço contra gravidade', description: 'Algum esforço contra a gravidade, mas não sustenta' },
      { score: 3, text: 'Sem esforço', description: 'Sem esforço contra a gravidade' },
      { score: 4, text: 'Sem movimento', description: 'Sem movimento' }
    ]
  },
  {
    id: 'motorLeg',
    title: '6. Motor - Pernas',
    description: 'Teste força das pernas (elevar por 5 segundos)',
    options: [
      { score: 0, text: 'Sem queda', description: 'Mantém por 5 segundos sem queda' },
      { score: 1, text: 'Queda gradual', description: 'Queda gradual, toca a cama em 5 segundos' },
      { score: 2, text: 'Esforço contra gravidade', description: 'Algum esforço contra a gravidade, mas não sustenta' },
      { score: 3, text: 'Sem esforço', description: 'Sem esforço contra a gravidade' },
      { score: 4, text: 'Sem movimento', description: 'Sem movimento' }
    ]
  },
  {
    id: 'ataxia',
    title: '7. Ataxia de Membros',
    description: 'Teste coordenação (dedo-nariz, calcanhar-joelho)',
    options: [
      { score: 0, text: 'Ausente', description: 'Sem ataxia' },
      { score: 1, text: 'Presente em um membro', description: 'Ataxia presente em um membro' },
      { score: 2, text: 'Presente em dois membros', description: 'Ataxia presente em dois membros' }
    ]
  },
  {
    id: 'sensory',
    title: '8. Sensibilidade',
    description: 'Teste sensibilidade dolorosa',
    options: [
      { score: 0, text: 'Normal', description: 'Sensibilidade normal' },
      { score: 1, text: 'Perda leve a moderada', description: 'Perda leve a moderada da sensibilidade' },
      { score: 2, text: 'Perda severa', description: 'Perda severa ou total da sensibilidade' }
    ]
  },
  {
    id: 'language',
    title: '9. Linguagem',
    description: 'Teste compreensão e expressão verbal',
    options: [
      { score: 0, text: 'Normal', description: 'Sem afasia' },
      { score: 1, text: 'Afasia leve a moderada', description: 'Afasia leve a moderada' },
      { score: 2, text: 'Afasia severa', description: 'Afasia severa' },
      { score: 3, text: 'Mudo/compreensão global', description: 'Mudo, afasia global, sem compreensão' }
    ]
  },
  {
    id: 'dysarthria',
    title: '10. Disartria',
    description: 'Teste articulação da fala',
    options: [
      { score: 0, text: 'Normal', description: 'Articulação normal' },
      { score: 1, text: 'Leve a moderada', description: 'Disartria leve a moderada' },
      { score: 2, text: 'Severa', description: 'Disartria severa (ininteligível ou mudo)' }
    ]
  },
  {
    id: 'extinction',
    title: '11. Extinção e Desatenção',
    description: 'Teste atenção bilateral simultânea',
    options: [
      { score: 0, text: 'Normal', description: 'Sem anormalidade' },
      { score: 1, text: 'Desatenção visual/tátil', description: 'Desatenção visual, tátil, auditiva ou pessoal' },
      { score: 2, text: 'Hemi-desatenção severa', description: 'Hemi-desatenção severa ou extinção' }
    ]
  }
];

export default function NIHSSScreen() {
  const [scores, setScores] = useState<NIHSSScores>({});

  const handleScoreSelect = (itemId: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [itemId]: score
    }));
  };

  const resetAssessment = () => {
    setScores({});
  };

  const getTotalScore = (): number => {
    return Object.values(scores).reduce((total, score) => total + (score || 0), 0);
  };

  const getResult = (): NIHSSResult => {
    const totalScore = getTotalScore();
    
    if (totalScore === 0) {
      return {
        totalScore,
        severity: 'Sem AVC',
        severityColor: '#4CAF50',
        interpretation: 'Pontuação normal. Sem evidência de déficit neurológico por AVC.',
        recommendations: [
          'Considerar outras causas para os sintomas',
          'Monitoramento clínico de rotina',
          'Investigação adicional se sintomas persistirem'
        ],
        prognosis: 'Excelente - sem déficit neurológico'
      };
    } else if (totalScore <= 4) {
      return {
        totalScore,
        severity: 'AVC Leve',
        severityColor: '#8BC34A',
        interpretation: 'AVC leve com déficits neurológicos mínimos.',
        recommendations: [
          'Considerar trombolítico se dentro da janela terapêutica',
          'Antiagregação plaquetária',
          'Investigação etiológica completa',
          'Reabilitação precoce',
          'Prevenção secundária'
        ],
        prognosis: 'Bom - recuperação funcional esperada'
      };
    } else if (totalScore <= 15) {
      return {
        totalScore,
        severity: 'AVC Moderado',
        severityColor: '#FF9800',
        interpretation: 'AVC moderado com déficits neurológicos significativos.',
        recommendations: [
          'Trombolítico indicado se elegível',
          'Considerar trombectomia mecânica se AVC de grandes vasos',
          'Monitorização neurológica rigorosa',
          'Reabilitação multidisciplinar',
          'Prevenção de complicações'
        ],
        prognosis: 'Moderado - recuperação parcial esperada'
      };
    } else if (totalScore <= 20) {
      return {
        totalScore,
        severity: 'AVC Moderado a Severo',
        severityColor: '#FF5722',
        interpretation: 'AVC moderado a severo com déficits neurológicos importantes.',
        recommendations: [
          'Trombolítico se elegível (avaliar risco-benefício)',
          'Trombectomia mecânica prioritária se AVC de grandes vasos',
          'UTI neurológica ou stroke unit',
          'Monitorização intensiva',
          'Cuidados de suporte intensivos'
        ],
        prognosis: 'Reservado - recuperação limitada'
      };
    } else {
      return {
        totalScore,
        severity: 'AVC Severo',
        severityColor: '#D32F2F',
        interpretation: 'AVC severo com déficits neurológicos extensos.',
        recommendations: [
          'Avaliar elegibilidade para trombectomia mecânica urgente',
          'UTI neurológica obrigatória',
          'Cuidados intensivos neurológicos',
          'Discussão sobre cuidados paliativos se apropriado',
          'Suporte familiar e decisões de fim de vida'
        ],
        prognosis: 'Grave - alta morbimortalidade'
      };
    }
  };

  const totalScore = getTotalScore();
  const result = getResult();
  const completedItems = Object.keys(scores).length;

  return (
    <View style={styles.container}>
      <ScreenHeader title="NIHSS - Escala de AVC do NIH" type="calculator" />
      
      {/* Fixed Score Display */}
      <View style={styles.scoreHeader}>
        <View style={[styles.scoreCard, { borderColor: result.severityColor }]}>
          <View style={[styles.scoreCardHeader, { backgroundColor: result.severityColor }]}>
            <Brain size={24} color="white" />
            <Text style={styles.scoreNumber}>NIHSS: {totalScore}</Text>
          </View>
          <View style={styles.scoreCardContent}>
            <Text style={[styles.severityText, { color: result.severityColor }]}>
              {result.severity}
            </Text>
            <Text style={styles.progressText}>
              {completedItems}/{nihssItems.length} itens avaliados
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Brain size={20} color={theme.colors.calculator} /> Sobre o NIHSS
            </Text>
            <Text style={styles.infoText}>
              A Escala de AVC do NIH (NIHSS) é uma ferramenta padronizada para avaliar a gravidade do déficit neurológico em pacientes com AVC agudo. 
              Selecione as opções correspondentes ao estado do paciente para cada item abaixo.
            </Text>
          </View>

          {/* All Assessment Items */}
          <View style={styles.assessmentContainer}>
            {nihssItems.map((item, index) => (
              <View key={item.id} style={styles.assessmentCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemNumber}>
                    {index + 1}/{nihssItems.length}
                  </Text>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {scores[item.id] !== undefined && (
                    <View style={styles.itemScore}>
                      <Text style={styles.itemScoreText}>{scores[item.id]} pts</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.itemDescription}>
                  {item.description}
                </Text>

                <View style={styles.optionsContainer}>
                  {item.options.map((option) => (
                    <TouchableOpacity
                      key={option.score}
                      style={[
                        styles.optionCard,
                        scores[item.id] === option.score && styles.optionCardSelected
                      ]}
                      onPress={() => handleScoreSelect(item.id, option.score)}
                    >
                      <View style={styles.optionHeader}>
                        <View style={[
                          styles.scoreCircle,
                          scores[item.id] === option.score && styles.scoreCircleSelected
                        ]}>
                          <Text style={[
                            styles.scoreText,
                            scores[item.id] === option.score && styles.scoreTextSelected
                          ]}>
                            {option.score}
                          </Text>
                        </View>
                        <Text style={[
                          styles.optionText,
                          scores[item.id] === option.score && styles.optionTextSelected
                        ]}>
                          {option.text}
                        </Text>
                        {scores[item.id] === option.score && (
                          <CheckCircle size={20} color={theme.colors.calculator} />
                        )}
                      </View>
                      {option.description && (
                        <Text style={styles.optionDescription}>
                          {option.description}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Results Section */}
          {totalScore > 0 && (
            <View style={styles.resultContainer}>
              <View style={[styles.resultCard, { borderColor: result.severityColor }]}>
                <View style={[styles.resultHeader, { backgroundColor: result.severityColor }]}>
                  <Brain size={32} color="white" />
                  <Text style={styles.resultScore}>Resultado Final</Text>
                </View>
                <View style={styles.resultContent}>
                  <Text style={styles.interpretationText}>
                    {result.interpretation}
                  </Text>
                </View>
              </View>

              <View style={styles.recommendationsCard}>
                <Text style={styles.recommendationsTitle}>
                  <Info size={20} color={theme.colors.calculator} /> Recomendações Terapêuticas
                </Text>
                {result.recommendations.map((recommendation, index) => (
                  <Text key={index} style={styles.recommendationText}>
                    • {recommendation}
                  </Text>
                ))}
              </View>

              <View style={styles.prognosisCard}>
                <Text style={styles.prognosisTitle}>
                  <AlertTriangle size={20} color="#FF9800" /> Prognóstico
                </Text>
                <Text style={styles.prognosisText}>{result.prognosis}</Text>
              </View>

              <View style={styles.clinicalNotesCard}>
                <Text style={styles.clinicalNotesTitle}>
                  <AlertTriangle size={20} color="#FF5722" /> Considerações Clínicas
                </Text>
                <Text style={styles.clinicalNotesText}>
                  • O NIHSS deve ser aplicado por profissionais treinados{'\n'}
                  • Reavaliação seriada é fundamental para monitorar evolução{'\n'}
                  • Pontuações podem variar com sedação ou alterações metabólicas{'\n'}
                  • Sempre correlacionar com quadro clínico e neuroimagem{'\n'}
                  • Janela terapêutica para trombolítico: até 4,5h do início dos sintomas{'\n'}
                  • Trombectomia mecânica: até 24h em casos selecionados
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetAssessment}
          >
            <RotateCcw size={20} color="white" />
            <Text style={styles.resetButtonText}>Reiniciar Avaliação</Text>
          </TouchableOpacity>
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
  scoreHeader: {
    backgroundColor: 'white',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
  },
  scoreCardHeader: {
    padding: theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  scoreNumber: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  scoreCardContent: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  severityText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    marginBottom: theme.spacing.xs,
  },
  progressText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
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
  assessmentContainer: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  assessmentCard: {
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
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  itemNumber: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.calculator,
    marginRight: theme.spacing.sm,
    backgroundColor: '#F0F4FF',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  itemTitle: {
    flex: 1,
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  itemScore: {
    backgroundColor: theme.colors.calculator,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  itemScoreText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  itemDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  optionsContainer: {
    gap: theme.spacing.sm,
  },
  optionCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionCardSelected: {
    backgroundColor: '#F0F4FF',
    borderColor: theme.colors.calculator,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  scoreCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCircleSelected: {
    backgroundColor: theme.colors.calculator,
    borderColor: theme.colors.calculator,
  },
  scoreText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  scoreTextSelected: {
    color: 'white',
  },
  optionText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  optionTextSelected: {
    color: theme.colors.calculator,
  },
  optionDescription: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginLeft: 40,
    lineHeight: 16,
  },
  resultContainer: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
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
  resultScore: {
    fontSize: theme.fontSize.lg,
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
  prognosisCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  prognosisTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF9800',
    marginBottom: theme.spacing.md,
  },
  prognosisText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    lineHeight: 20,
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