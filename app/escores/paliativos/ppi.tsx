import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { CheckCircle, Circle, ChevronDown, ChevronUp, Activity, AlertTriangle } from 'lucide-react-native';

interface PPIOption {
  id: string;
  label: string;
  value: number;
}

interface PPICategory {
  id: string;
  title: string;
  options: PPIOption[];
}

const ppiCategories: PPICategory[] = [
  {
    id: 'pps',
    title: 'Escala de Performance Paliativa',
    options: [
      { id: 'pps_10_20', label: '10-20', value: 4 },
      { id: 'pps_30_50', label: '30-50', value: 2.5 },
      { id: 'pps_60_plus', label: '≥60', value: 0 },
    ]
  },
  {
    id: 'oral_intake',
    title: 'Ingesta Oral',
    options: [
      { id: 'mouthfuls', label: 'Colheradas ou menos', value: 2.5 },
      { id: 'reduced', label: 'Reduzida, porém mais que colheradas', value: 1 },
      { id: 'normal', label: 'Normal', value: 0 },
    ]
  },
  {
    id: 'edema',
    title: 'Edema',
    options: [
      { id: 'present', label: 'Presente', value: 1 },
      { id: 'absent', label: 'Ausente', value: 0 },
    ]
  },
  {
    id: 'dyspnea',
    title: 'Dispneia em repouso',
    options: [
      { id: 'present', label: 'Presente', value: 3.5 },
      { id: 'absent', label: 'Ausente', value: 0 },
    ]
  },
  {
    id: 'delirium',
    title: 'Delirium',
    options: [
      { id: 'present', label: 'Presente', value: 4 },
      { id: 'absent', label: 'Ausente', value: 0 },
    ]
  },
];

interface SurvivalEstimate {
  scoreRange: string;
  survival: string;
  color: string;
  bgColor: string;
}

const survivalEstimates: SurvivalEstimate[] = [
  { 
    scoreRange: 'PPI score ≤4', 
    survival: 'Sobrevida estimada maior que 6 semanas',
    color: '#16A34A',
    bgColor: '#F0FDF4'
  },
  { 
    scoreRange: 'PPI score >4', 
    survival: 'Sobrevida estimada menor que 6 semanas',
    color: '#F59E0B',
    bgColor: '#FFF3CD'
  },
  { 
    scoreRange: 'PPI score >6', 
    survival: 'Sobrevida estimada menor que 3 semanas',
    color: '#DC2626',
    bgColor: '#FEE2E2'
  },
];

export default function PPIScreen() {
  const [selections, setSelections] = useState<{ [key: string]: string }>({});
  const [isReferenceExpanded, setIsReferenceExpanded] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSelection = (categoryId: string, optionId: string) => {
    setSelections(prev => ({
      ...prev,
      [categoryId]: optionId
    }));
    setShowResult(true);
  };

  const calculateScore = (): number => {
    let totalScore = 0;
    
    Object.entries(selections).forEach(([categoryId, optionId]) => {
      const category = ppiCategories.find(cat => cat.id === categoryId);
      if (category) {
        const option = category.options.find(opt => opt.id === optionId);
        if (option) {
          totalScore += option.value;
        }
      }
    });
    
    return totalScore;
  };

  const getSurvivalEstimate = (score: number): SurvivalEstimate[] => {
    const estimates: SurvivalEstimate[] = [];
    
    if (score > 6) {
      estimates.push(survivalEstimates[2]);
    }
    if (score > 4) {
      estimates.push(survivalEstimates[1]);
    }
    if (score <= 4) {
      estimates.push(survivalEstimates[0]);
    }
    
    return estimates;
  };

  const totalScore = calculateScore();
  const currentEstimates = getSurvivalEstimate(totalScore);

  return (
    <View style={styles.container}>
      <ScreenHeader title="PPI" type="score" />
      
      <ScrollView style={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>Palliative Prognostic Index - PPI</Text>
          <Text style={styles.subtitle}>Doença Oncológica</Text>
        </View>

        {/* Status Performance/Sintomas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Status Performance/Sintomas</Text>
          <Text style={styles.scorePartialHeader}>Score parcial</Text>
        </View>

        {/* Categories */}
        {ppiCategories.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionItem}
                onPress={() => handleSelection(category.id, option.id)}
              >
                <View style={styles.optionLeft}>
                  {selections[category.id] === option.id ? (
                    <CheckCircle size={20} color={theme.colors.primary} />
                  ) : (
                    <Circle size={20} color="#ccc" />
                  )}
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </View>
                <Text style={styles.optionValue}>{option.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Total Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Score Total PPI</Text>
          <Text style={styles.scoreValue}>{totalScore}</Text>
        </View>

        {/* Survival Estimates */}
        {showResult && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>Estimativa de Sobrevida</Text>
            {currentEstimates.map((estimate, index) => (
              <View 
                key={index}
                style={[styles.survivalCard, { backgroundColor: estimate.bgColor, borderColor: estimate.color }]}
              >
                <Activity size={24} color={estimate.color} />
                <View style={styles.survivalContent}>
                  <Text style={[styles.survivalScore, { color: estimate.color }]}>
                    {estimate.scoreRange}
                  </Text>
                  <Text style={[styles.survivalText, { color: estimate.color }]}>
                    {estimate.survival}
                  </Text>
                </View>
              </View>
            ))}

            {/* Alert for high scores */}
            {totalScore > 4 && (
              <View style={styles.alertCard}>
                <AlertTriangle size={20} color="#F59E0B" />
                <Text style={styles.alertText}>
                  Paciente com prognóstico reservado. Considerar cuidados paliativos exclusivos.
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
          <Text style={styles.referenceButtonText}>Referência</Text>
          {isReferenceExpanded ? (
            <ChevronUp size={20} color={theme.colors.primary} />
          ) : (
            <ChevronDown size={20} color={theme.colors.primary} />
          )}
        </TouchableOpacity>
        
        {isReferenceExpanded && (
          <View style={styles.referenceCard}>
            <Text style={styles.referenceText}>
              Journal of Pain and Symptom Management, Vol. 35, No. 6, Stone, C., Tiernan, E., & Dooley, B. Prospective Validation of the Palliative Prognostic Index in Patients with Cancer. J Palliat Med. 2008.
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
    backgroundColor: '#2563EB',
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: 'white',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#DBEAFE',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#1E40AF',
  },
  scorePartialHeader: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#1E40AF',
  },
  categorySection: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    backgroundColor: '#EFF6FF',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  optionValue: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#2563EB',
    minWidth: 40,
    textAlign: 'right',
  },
  scoreCard: {
    backgroundColor: '#2563EB',
    padding: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  scoreValue: {
    fontSize: 48,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  resultSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  resultTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  survivalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
  },
  survivalContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  survivalScore: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    marginBottom: theme.spacing.xs,
  },
  survivalText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#F59E0B',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  alertText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
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
