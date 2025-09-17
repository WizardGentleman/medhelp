import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';

export default function TrazodonaScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Trazodona" />
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.medicineClass}>Modulador de Serotonina</Text>
          <Text style={styles.description}>Antagonista 5-HT2 e sedativo; usado mais como hipnótico.</Text>
          <View style={styles.constructionBox}>
            <Text style={styles.constructionIcon}>🚧</Text>
            <Text style={styles.constructionText}>Em Construção</Text>
            <Text style={styles.constructionSubtext}>Esta página está sendo desenvolvida</Text>
          </View>
        </View>
      </View>
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
    padding: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: '#E0F2F1',
    borderRadius: 15,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicineClass: {
    fontSize: 14,
    color: '#00897B',
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: 16,
    color: '#00695C',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  constructionBox: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  constructionIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  constructionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: theme.spacing.sm,
  },
  constructionSubtext: {
    fontSize: 16,
    color: '#757575',
  },
});
