import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';

export default function DuloxetinaScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Duloxetina" />
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.medicineClass}>IRSN - Inibidor da Recaptação de Serotonina e Noradrenalina</Text>
          <Text style={styles.description}>Útil em depressão, dor crônica e neuropática.</Text>
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
    backgroundColor: '#FFF3E0',
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
    color: '#FF9800',
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: 16,
    color: '#F57C00',
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
