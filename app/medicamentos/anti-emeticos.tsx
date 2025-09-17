import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { NavigationButton } from '@/components/NavigationButton';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';


export default function AntiEmeticosScreen() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/medicamentos/metoclopramida');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Anti-eméticos" />
      <View style={styles.content}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handlePress}
        >
          <LinearGradient
            colors={['#E8F5E9', '#F1F8E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardMetoclopramida}
          >
            <View style={styles.cardHeader}>
              <View style={styles.medicineIconContainer}>
                <Text style={styles.medicineIcon}>💊</Text>
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.medicineTitle}>Metoclopramida (Plasil)</Text>
                <Text style={styles.cardDescription}>Antiemético e procinético. Indicado para náuseas, vômitos e distúrbios de motilidade gastrointestinal.</Text>
              </View>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
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
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    width: '100%',
  },
  cardMetoclopramida: {
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    width: '100%',
    alignSelf: 'stretch',
    minWidth: 0,
    gap: theme.spacing.md,
  },
  cardContainer: {
    width: '100%',
    marginVertical: theme.spacing.sm,
  },
  cardMetoclopramida: {
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
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
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
    marginBottom: 2,
  },
  medicineSubtitle: {
    fontSize: 14,
    color: '#66BB6A',
    fontStyle: 'italic',
  },
  expandIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIcon: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
  },
  descriptionContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    marginBottom: 16,
    marginHorizontal: -24,
  },
  cardDescription: {
    fontSize: 15,
    color: '#388E3C',
    lineHeight: 22,
    marginBottom: 16,
  },
  detailsButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
});
