import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { CheckCircle, Circle, ChevronDown, ChevronUp, Brain, Activity, AlertCircle } from 'lucide-react-native';

interface RankinLevel {
  grade: number;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const rankinLevels: RankinLevel[] = [
  {
    grade: 0,
    title: 'Sem sintomas',
    description: '',
    color: '#16A34A',
    bgColor: '#F0FDF4'
  },
  {
    grade: 1,
    title: 'Nenhuma deficiência significativa, a despeito',
    description: 'Capaz de conduzir todos os deveres e atividades habituais.\n\nExemplo: sente leve fraqueza ou dormência, mas trabalha e cuida de si normalmente.',
    color: '#22C55E',
    bgColor: '#F0FDF4'
  },
  {
    grade: 2,
    title: 'Leve deficiência',
    description: 'Incapaz de conduzir todas as atividades de antes, mas é capaz de cuidar dos próprios interesses sem assistência.\n\nExemplo: não consegue correr ou praticar esportes como antes, porém se alimenta, se veste e caminha sem auxílio.',
    color: '#EAB308',
    bgColor: '#FEF3C7'
  },
  {
    grade: 3,
    title: 'Deficiência moderada',
    description: 'Requer alguma ajuda, mas é capaz de caminhar sem assistência (pode usar bengala ou andador).\n\nExemplo: precisa de auxílio para tarefas domésticas, mas deambula sozinho.',
    color: '#F59E0B',
    bgColor: '#FFF7ED'
  },
  {
    grade: 4,
    title: 'Deficiência moderadamente grave',
    description: 'Incapaz de caminhar sem assistência e incapaz de atender às próprias necessidades fisiológicas sem assistência.\n\nExemplo: precisa de auxílio para banhar-se, vestir-se ou mobilizar-se em casa. Apesar da dependência, não está totalmente restrito ao leito e pode, com assistência, mover-se.',
    color: '#EF4444',
    bgColor: '#FEF2F2'
  },
  {
    grade: 5,
    title: 'Deficiência grave',
    description: 'Confinado à cama, incontinente, requerendo cuidado e atenção constante de enfermagem.\n\nExemplo: precisa de outra pessoa para todas as atividades, incluindo alimentação, higiene e mobilização. Total limitação funcional.',
    color: '#DC2626',
    bgColor: '#FEE2E2'
  },
  {
    grade: 6,
    title: 'Óbito',
    description: '',
    color: '#6B7280',
    bgColor: '#F3F4F6'
  }
];

export default function RankinScreen() {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [isReferenceExpanded, setIsReferenceExpanded] = useState(false);
  const [isIndicationExpanded, setIsIndicationExpanded] = useState(false);

  const handleGradeSelection = (grade: number) => {
    setSelectedGrade(grade);
  };

  const getInterpretation = (grade: number): string => {
    if (grade <= 1) return 'Independência funcional completa';
    if (grade === 2) return 'Independência funcional com limitações';
    if (grade === 3) return 'Dependência parcial';
    if (grade >= 4) return 'Dependência significativa';
    return '';
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Escala de Rankin" type="score" />
      
      <ScrollView style={styles.content}>
        <View style={styles.headerCard}>
          <Brain size={40} color="white" />
          <Text style={styles.title}>Escala de Rankin modificada - AVE</Text>
          <Text style={styles.subtitle}>Escala de avaliação funcional pós-AVC</Text>
        </View>

        {/* Indication Card */}
        <TouchableOpacity 
          style={styles.indicationButton}
          onPress={() => setIsIndicationExpanded(!isIndicationExpanded)}
        >
          <Text style={styles.indicationButtonText}>Indicação</Text>
          {isIndicationExpanded ? (
            <ChevronUp size={20} color={theme.colors.primary} />
          ) : (
            <ChevronDown size={20} color={theme.colors.primary} />
          )}
        </TouchableOpacity>
        
        {isIndicationExpanded && (
          <View style={styles.indicationCard}>
            <Text style={styles.indicationText}>
              A escala de Rankin modificada é indicada para avaliar e quantificar o grau de incapacidade ou dependência em atividades da vida diária após eventos neurológicos agudos, especialmente acidente vascular cerebral (AVC), mas também em outras condições neurológicas como hemorragia subaracnoidea e após neurocirurgias. Seu principal uso é como desfecho global em estudos clínicos, para monitorar a recuperação funcional e para estratificação prognóstica em pacientes com sequelas neurológicas.
              {"\n\n"}
              Embora seja uma medida global, a mRS não detalha déficits específicos (como motores, cognitivos ou de linguagem), mas reflete o impacto funcional global desses déficits.
            </Text>
          </View>
        )}

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Escolha a melhor opção que define o paciente:</Text>
        </View>

        {/* Rankin Levels */}
        {rankinLevels.map((level) => (
          <TouchableOpacity
            key={level.grade}
            style={[
              styles.levelItem,
              selectedGrade === level.grade && { backgroundColor: level.bgColor }
            ]}
            onPress={() => handleGradeSelection(level.grade)}
          >
            <View style={[styles.gradeBox, { backgroundColor: level.color }]}>
              <Text style={styles.gradeText}>{level.grade}</Text>
            </View>
            
            <View style={styles.levelContent}>
              <View style={styles.levelHeader}>
                {selectedGrade === level.grade ? (
                  <CheckCircle size={20} color={level.color} />
                ) : (
                  <Circle size={20} color="#ccc" />
                )}
                <Text style={[styles.levelTitle, selectedGrade === level.grade && { color: level.color }]}>
                  {level.title}
                </Text>
              </View>
              {level.description !== '' && (
                <View>
                  <Text style={styles.levelDescription}>
                    {level.description.split('\n\n')[0]}
                  </Text>
                  {level.description.split('\n\n')[1] && (
                    <Text style={styles.levelExample}>
                      {level.description.split('\n\n')[1]}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Result Interpretation */}
        {selectedGrade !== null && (
          <View style={styles.resultSection}>
            <View style={styles.resultCard}>
              <Activity size={24} color={rankinLevels[selectedGrade].color} />
              <View style={styles.resultContent}>
                <Text style={styles.resultLabel}>Grau selecionado:</Text>
                <Text style={[styles.resultValue, { color: rankinLevels[selectedGrade].color }]}>
                  Rankin {selectedGrade}
                </Text>
                <Text style={styles.resultInterpretation}>
                  {getInterpretation(selectedGrade)}
                </Text>
              </View>
            </View>

            {selectedGrade >= 3 && (
              <View style={styles.alertCard}>
                <AlertCircle size={20} color="#F59E0B" />
                <Text style={styles.alertText}>
                  Paciente com dependência funcional. Considerar reabilitação intensiva e suporte multidisciplinar.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Reference */}
        <TouchableOpacity 
          style={styles.referenceButton}
          onPress={() => setIsReferenceExpanded(!isReferenceExpanded)}
        >
          <Text style={styles.referenceButtonText}>Referências</Text>
          {isReferenceExpanded ? (
            <ChevronUp size={20} color={theme.colors.primary} />
          ) : (
            <ChevronDown size={20} color={theme.colors.primary} />
          )}
        </TouchableOpacity>
        
        {isReferenceExpanded && (
          <View style={styles.referenceCard}>
            <Text style={styles.referenceText}>
              1 - Rankin J. "Cerebral vascular accidents in patients over the age of 60. II. Prognosis." Scottish Medical Journal. 1957;2:200-215.
              {"\n\n"}
              2 - Van Swieten JC, Koudstaal PJ, Visser MC, Schouten HJ, van Gijn J. "Interobserver agreement for the assessment of handicap in stroke patients." Stroke. 1988;19(5):604-607.
              {"\n\n"}
              3 - Wilson JT, Hareendran A, Grant M, et al. "Improving the assessment of outcomes in stroke: use of a structured interview to assign grades on the modified Rankin Scale." Stroke. 2002;33(9):2243-2246.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: '#3B82F6',
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: 'white',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#6895EC',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  tableHeaderText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  levelItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    padding: theme.spacing.md,
    alignItems: 'flex-start',
  },
  gradeBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  gradeText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  levelContent: {
    flex: 1,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  levelTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  levelDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginLeft: 28,
    lineHeight: 20,
  },
  levelExample: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    marginLeft: 28,
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
  resultSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  resultContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  resultLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
  },
  resultValue: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    marginVertical: theme.spacing.xs,
  },
  resultInterpretation: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#F59E0B',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  alertText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  indicationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: 'white',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  indicationButtonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.primary,
  },
  indicationCard: {
    backgroundColor: '#EFF6FF',
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  indicationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 22,
    textAlign: 'justify',
  },
  referenceButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: 'white',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  referenceButtonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.primary,
  },
  referenceCard: {
    backgroundColor: '#F0F4FF',
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  referenceText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
});
