import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { CheckCircle, Circle, ChevronDown, ChevronUp, Brain, Info } from 'lucide-react-native';

interface FASTStage {
  stage: string;
  characteristics: string;
  interpretation: string;
  color: string;
  bgColor: string;
}

const fastStages: FASTStage[] = [
  {
    stage: '1',
    characteristics: 'Sem dificuldades objetivas ou subjetivas.',
    interpretation: 'Adulto sem queixas cognitivas',
    color: '#16A34A',
    bgColor: '#F0FDF4'
  },
  {
    stage: '2',
    characteristics: 'Queixa subjetiva para onde se encontram objetos. Dificuldade subjetivas no trabalho.',
    interpretation: 'Envelhecimento sem suspeita de Doença de Alzheimer',
    color: '#22C55E',
    bgColor: '#F0FDF4'
  },
  {
    stage: '3',
    characteristics: 'Dificuldades no trabalho observadas por colegas. Dificuldades para ir a locais menos conhecidos. Diminuição na capacidade de organização.',
    interpretation: 'Compatível com Doença de Alzheimer incipiente',
    color: '#EAB308',
    bgColor: '#FEF3C7'
  },
  {
    stage: '4',
    characteristics: 'Dificuldades em tarefas complexas, como cuidar das finanças, planejar um jantar ou preparar uma refeição mais elaborada, fazer compras.',
    interpretation: 'Doença de Alzheimer leve',
    color: '#F59E0B',
    bgColor: '#FFF7ED'
  },
  {
    stage: '5',
    characteristics: 'Requer auxílio na escolha do traje adequado.',
    interpretation: 'Doença de Alzheimer moderada',
    color: '#EF4444',
    bgColor: '#FEF2F2'
  },
  {
    stage: '6a',
    characteristics: 'Requer auxílio para vestir-se.',
    interpretation: 'Doença de Alzheimer moderada a grave',
    color: '#DC2626',
    bgColor: '#FEE2E2'
  },
  {
    stage: '6b',
    characteristics: 'Requer auxílio para tomar banho adequadamente.',
    interpretation: 'Doença de Alzheimer moderada a grave',
    color: '#DC2626',
    bgColor: '#FEE2E2'
  },
  {
    stage: '6c',
    characteristics: 'Requer auxílio com as atividades mecânicas da toalete (e.g. puxar a descarga, enxugar-se).',
    interpretation: 'Doença de Alzheimer moderada a grave',
    color: '#DC2626',
    bgColor: '#FEE2E2'
  },
  {
    stage: '6d',
    characteristics: 'Incontinência urinária.',
    interpretation: 'Doença de Alzheimer moderada a grave',
    color: '#DC2626',
    bgColor: '#FEE2E2'
  },
  {
    stage: '6e',
    characteristics: 'Incontinência fecal.',
    interpretation: 'Doença de Alzheimer moderada a grave',
    color: '#DC2626',
    bgColor: '#FEE2E2'
  },
  {
    stage: '7a',
    characteristics: 'Fala restrita a cerca de meia dúzia de palavras inteligíveis ou menos por dia ou durante uma entrevista.',
    interpretation: 'Doença de Alzheimer grave',
    color: '#7C3AED',
    bgColor: '#F3E8FF'
  },
  {
    stage: '7b',
    characteristics: 'Habilidade de fala restrita a aproximadamente a uma única palavra inteligível num dia ou no curso de uma entrevista.',
    interpretation: 'Doença de Alzheimer grave',
    color: '#7C3AED',
    bgColor: '#F3E8FF'
  },
  {
    stage: '7c',
    characteristics: 'Perda da capacidade de andar sem assistência.',
    interpretation: 'Doença de Alzheimer grave',
    color: '#7C3AED',
    bgColor: '#F3E8FF'
  },
  {
    stage: '7d',
    characteristics: 'Perda da capacidade de sentar-se sem auxílio.',
    interpretation: 'Doença de Alzheimer grave',
    color: '#7C3AED',
    bgColor: '#F3E8FF'
  },
  {
    stage: '7e',
    characteristics: 'Perda da capacidade de sorrir.',
    interpretation: 'Doença de Alzheimer grave',
    color: '#7C3AED',
    bgColor: '#F3E8FF'
  },
  {
    stage: '7f',
    characteristics: 'Perda da capacidade de manter independentemente a cabeça ereta.',
    interpretation: 'Doença de Alzheimer grave',
    color: '#7C3AED',
    bgColor: '#F3E8FF'
  }
];

export default function FASTScreen() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [isIndicationExpanded, setIsIndicationExpanded] = useState(false);
  const [isReferenceExpanded, setIsReferenceExpanded] = useState(false);

  const handleStageSelection = (stage: string) => {
    setSelectedStage(stage);
  };

  const getSelectedStageData = () => {
    return fastStages.find(s => s.stage === selectedStage);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="FAST" type="score" />
      
      <ScrollView style={styles.content}>
        <View style={styles.headerCard}>
          <Brain size={40} color="white" />
          <Text style={styles.title}>Functional Assessment Staging - FAST</Text>
          <Text style={styles.subtitle}>Escala de Avaliação Funcional na Doença de Alzheimer</Text>
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
              A escala FAST (Functional Assessment Staging - Estágios de Avaliação Funcional) é um instrumento desenvolvido para avaliar o estado funcional e determinar a gravidade em pacientes com demência do tipo Alzheimer.
              {"\n\n"}
              A progressão da doença de Alzheimer geralmente segue uma sequência hierárquica através dos estágios, embora possa haver variações individuais. Alterações súbitas no quadro clínico podem indicar a necessidade de investigação de diagnósticos alternativos para síndromes demenciais.
              {"\n\n"}
              Trata-se de um instrumento de aplicação simples e rápida, que não sofre influência do nível educacional do paciente e demonstra boa correlação com o Mini-Exame do Estado Mental (MEEM). O FAST é particularmente útil para monitorar o declínio funcional ao longo da evolução da doença de Alzheimer, auxiliar na suspeita de diagnósticos diferenciais quando há desvios significativos na progressão esperada dos estágios, e orientar a implementação de cuidados paliativos.
            </Text>
          </View>
        )}

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCol1}>ESTÁGIO - FAST</Text>
          <Text style={styles.tableHeaderCol2}>CARACTERÍSTICAS</Text>
        </View>

        {/* FAST Stages */}
        {fastStages.map((stage) => (
          <TouchableOpacity
            key={stage.stage}
            style={[
              styles.stageItem,
              selectedStage === stage.stage && { backgroundColor: stage.bgColor }
            ]}
            onPress={() => handleStageSelection(stage.stage)}
          >
            <View style={styles.stageNumber}>
              <Text style={styles.stageNumberText}>{stage.stage}</Text>
            </View>
            
            <View style={styles.stageContent}>
              <View style={styles.stageHeader}>
                {selectedStage === stage.stage ? (
                  <CheckCircle size={20} color={stage.color} />
                ) : (
                  <Circle size={20} color="#ccc" />
                )}
                <Text style={[
                  styles.stageCharacteristics,
                  selectedStage === stage.stage && { color: stage.color, fontFamily: 'Roboto-Bold' }
                ]}>
                  {stage.characteristics}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Result Interpretation */}
        {selectedStage && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>Interpretação</Text>
            <View style={[
              styles.resultCard,
              { backgroundColor: getSelectedStageData()?.bgColor, borderColor: getSelectedStageData()?.color }
            ]}>
              <Info size={24} color={getSelectedStageData()?.color} />
              <View style={styles.resultContent}>
                <Text style={styles.resultLabel}>Estágio selecionado:</Text>
                <Text style={[styles.resultValue, { color: getSelectedStageData()?.color }]}>
                  FAST {selectedStage}
                </Text>
                <Text style={[styles.resultInterpretation, { color: getSelectedStageData()?.color }]}>
                  {getSelectedStageData()?.interpretation}
                </Text>
              </View>
            </View>
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
              Brucki SMD, Aprahamian I, Borelli WV, Silveira VC, Ferretti CEL, Smid J, et al. Manejo das demências em fase avançada: recomendações do Departamento Científico de Neurologia Cognitiva e do Envelhecimento da Academia Brasileira de Neurologia. Dement Neuropsychol 2022; 16 (3 suppl. 1):101-120.
              {"\n\n"}
              Reisberg B, Ferris SH, Anand R, de Leon MJ, Schneck M, Buttinger C, et al. Functional staging of dementia of the Alzheimer's type. Ann NY Acad of Sci 1984; 435: 481-483.
              {"\n\n"}
              Reisberg B, Ferris SH, Franssen E. An ordinal functional assessment tool for Alzheimer's-type dementia. Hosp Community Psychiatry 1985. 36(6): 593-595.
              {"\n\n"}
              Sclan SG, Reisberg B. Functional assessment staging (FAST) in Alzheimer's disease: reliability, validity, and ordinality. Int Psychogeriatr 1992; 4 Suppl 1: 55-69.
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
    lineHeight: 20,
  },
tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#6895EC',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  tableHeaderCol1: {
    width: 80,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  tableHeaderCol2: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    textAlign: 'center',
  },
stageItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    padding: theme.spacing.md,
    alignItems: 'flex-start',
  },
  stageNumber: {
    width: 80,
    backgroundColor: '#F9FAFB',
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  stageNumberText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  stageContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  stageCharacteristics: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
resultSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  resultTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  resultCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  resultContent: {
    flex: 1,
  },
  resultLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  resultValue: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    marginBottom: theme.spacing.xs,
  },
  resultInterpretation: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
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
    marginTop: theme.spacing.lg,
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
