import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { NavigationButton } from '@/components/NavigationButton';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function AntidepressivosScreen() {
  const router = useRouter();

  const handlePress = (subcategory) => {
    router.push(`/medicamentos/antidepressivos/${subcategory.toLowerCase()}`);
  };

  const descriptions = {
    Citalopram: "ISRS, bem tolerado, com efeitos colaterais mínimos.",
    Escitalopram: "Similar ao citalopram, mas mais potente.",
    Fluoxetina: "ISRS conhecido, causa insônia em algumas pessoas.",
    Paroxetina: "ISRS com sedação e peso e efeitos anticolinérgicos.",
    Sertralina: "ISRS bem tolerado, indicado para depressão, ansiedade e transtorno do pânico.",
    Desvenlafaxina: "Metabólito ativo da venlafaxina, pode aumentar PA e FC.",
    Duloxetina: "Útil em depressão, dor crônica e neuropática.",
    Venlafaxina: "IRSN dose-dependente, pode causar elevação de PA e FC.",
    Bupropiona: "Inibe recaptação de dopamina e noradrenalina; risco de convulsão em altas doses.",
    Mirtazapina: "Antagonista alfa-2; sedativo e orexígeno, útil em insônia e inapetência.",
    Trazodona: "Antagonista 5-HT2 e sedativo; usado mais como hipnótico."
  };

  const categories = [
    {
      name: "ISRSs – Inibidores Seletivos da Recaptação de Serotonina",
      subcategories: [
        "Citalopram",
        "Escitalopram",
        "Fluoxetina",
        "Paroxetina",
        "Sertralina",
      ],
    },
    {
      name: "IRSNs – Inibidores da Recaptação de Serotonina e Noradrenalina",
      subcategories: [
        "Desvenlafaxina",
        "Duloxetina",
        "Venlafaxina",
      ],
    },
    {
      name: "Agentes Atípicos",
      subcategories: [
        "Bupropiona",
        "Mirtazapina",
      ],
    },
    {
      name: "Moduladores de Serotonina",
      subcategories: [
        "Trazodona",
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Antidepressivos" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryBlock}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            {category.subcategories.map((sub, idx) => (
              <TouchableOpacity key={idx} activeOpacity={0.9} onPress={() => handlePress(sub)}>
                <LinearGradient
                  colors={['#E8F5E9', '#F1F8E9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.subcategoryCard}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.medicineIconContainer}>
                      <Text style={styles.medicineIcon}>💊</Text>
                    </View>
                    <View style={styles.titleContainer}>
                      <Text style={styles.medicineTitle}>{sub}</Text>
                      <Text style={styles.cardDescription}>{descriptions[sub]}</Text>
                    </View>
                    <View style={styles.arrowContainer}>
                      <Text style={styles.arrowIcon}>→</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    width: '100%',
  },
  categoryBlock: {
    marginBottom: theme.spacing.lg,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.sm,
  },
  subcategoryCard: {
    borderRadius: 20,
    padding: 0,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  medicineIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  medicineIcon: {
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
  },
  medicineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#558B2F',
    lineHeight: 20,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  arrowIcon: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

