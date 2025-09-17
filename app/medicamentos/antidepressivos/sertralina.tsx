import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';

export default function SertralinaScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Sertralina" />
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.medicineClass}>ISRS - Inibidor Seletivo da Recaptação de Serotonina</Text>
          <Text style={styles.description}>ISRS bem tolerado, indicado para depressão, ansiedade e transtorno do pânico.</Text>
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
    backgroundColor: '#E8F5E9',
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
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: 16,
    color: '#388E3C',
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
