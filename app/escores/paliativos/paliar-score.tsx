import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react-native';

interface CriteriaItem {
  id: string;
  label: string;
  points: number;
}

interface MortalityData {
  scoreRange: string;
  score: number;
  mortality: string;
}

const criteria: CriteriaItem[] = [
  { id: 'age', label: '≥85 anos', points: 3 },
  { id: 'icc', label: 'ICC Classe IV ou mMRC 4 *', points: 3.5 },
  { id: 'anorexia', label: 'Anorexia', points: 3.5 },
  { id: 'ulcer', label: 'Úlcera de pressão', points: 3 },
  { id: 'ecog', label: 'ECOG ≥ 3', points: 4 },
  { id: 'albumin', label: 'Albumina ≤ 2,5', points: 4 },
];

const mortalityData: MortalityData[] = [
  { scoreRange: '0 a 2,9', score: 1, mortality: '20 a 21.5%' },
  { scoreRange: '3 a 3,5', score: 2, mortality: '33%' },
  { scoreRange: '4 a 7,4', score: 3, mortality: '43%' },
  { scoreRange: '≥ 7,5', score: 4, mortality: '67%' },
];

export default function PaliarScoreScreen() {
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [isReferenceExpanded, setIsReferenceExpanded] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const toggleCriteria = (id: string) => {
    if (selectedCriteria.includes(id)) {
      setSelectedCriteria(selectedCriteria.filter(item => item !== id));
    } else {
      setSelectedCriteria([...selectedCriteria, id]);
    }
    setShowResult(true);
  };

  const calculateScore = () => {
    return criteria
      .filter(item => selectedCriteria.includes(item.id))
      .reduce((sum, item) => sum + item.points, 0);
  };

  const getScoreCategory = (score: number) => {
    if (score < 3) return 1;
    if (score <= 3.5) return 2;
    if (score < 7.5) return 3;
    return 4;
  };

  const totalScore = calculateScore();
  const scoreCategory = getScoreCategory(totalScore);
  const currentMortality = mortalityData.find(item => item.score === scoreCategory);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Paliar Score" type="score" />

      <ScrollView style={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>PALIAR SCORE - Falências Orgânicas</Text>
        </View>

        {/* Criteria Selection */}
        <View style={styles.criteriaSection}>
          <Text style={styles.sectionTitle}>Critério</Text>
          {criteria.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.criteriaItem}
              onPress={() => toggleCriteria(item.id)}
            >
              <View style={styles.criteriaLeft}>
                {selectedCriteria.includes(item.id) ? (
                  <CheckCircle size={24} color={theme.colors.primary} />
                ) : (
                  <Circle size={24} color="#ccc" />
                )}
                <Text style={styles.criteriaLabel}>{item.label}</Text>
              </View>
              <Text style={styles.criteriaPoints}>{item.points}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Total Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Total</Text>
          <Text style={styles.scoreValue}>{totalScore}</Text>
        </View>

        {/* Mortality Results */}
        {showResult && currentMortality && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Mortalidade em 6 meses</Text>
            <View style={styles.mortalityCard}>
              <View style={styles.mortalityRow}>
                <Text style={styles.mortalityLabel}>Pontuação:</Text>
                <Text style={styles.mortalityValue}>{currentMortality.scoreRange}</Text>
              </View>
              <View style={styles.mortalityRow}>
                <Text style={styles.mortalityLabel}>Score:</Text>
                <Text style={styles.mortalityValue}>{currentMortality.score}</Text>
              </View>
              <View style={styles.mortalityRow}>
                <Text style={styles.mortalityLabel}>Mortalidade:</Text>
                <Text style={[styles.mortalityValue, styles.mortalityPercentage]}>
                  {currentMortality.mortality}
                </Text>
              </View>
            </View>

            {/* All Mortality Levels */}
            <View style={styles.allMortalitySection}>
              <Text style={styles.subsectionTitle}>Tabela de Referência</Text>
              {mortalityData.map((item, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.mortalityItem,
                    item.score === scoreCategory && styles.mortalityItemActive
                  ]}
                >
                  <Text style={styles.mortalityItemText}>
                    Score {item.score}: {item.scoreRange} → {item.mortality}
                  </Text>
                </View>
              ))}
            </View>
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
              Wittel et al. Development of a six-month prognostic index in patients with advanced chronic medical conditions: The PALIAR score. Journal of Pain and Symptom Management, 2014.
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
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  criteriaSection: {
    backgroundColor: 'white',
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  criteriaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  criteriaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  criteriaLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  criteriaPoints: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.primary,
    marginLeft: theme.spacing.md,
  },
  scoreCard: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
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
  mortalityCard: {
    backgroundColor: '#FFF3CD',
    borderWidth: 2,
    borderColor: '#F59E0B',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  mortalityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  mortalityLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
  },
  mortalityValue: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  mortalityPercentage: {
    color: '#F59E0B',
    fontSize: theme.fontSize.lg,
  },
  allMortalitySection: {
    marginTop: theme.spacing.md,
  },
  subsectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  mortalityItem: {
    backgroundColor: '#f5f5f5',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  mortalityItemActive: {
    backgroundColor: '#FFF3CD',
    borderLeftColor: '#F59E0B',
  },
  mortalityItemText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
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
