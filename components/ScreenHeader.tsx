import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { theme } from '@/styles/theme';

interface ScreenHeaderProps {
  title: string;
  type?: 'emergency' | 'calculator' | 'score' | 'converter' | 'clinical' | 'antibiotic';
}

export function ScreenHeader({ title, type = 'emergency' }: ScreenHeaderProps) {
  const handleBack = () => {
    router.back();
  };

  const getHeaderStyle = () => {
    switch (type) {
      case 'emergency':
        return styles.emergencyHeader;
      case 'calculator':
        return styles.calculatorHeader;
      case 'score':
        return styles.scoreHeader;
      case 'converter':
        return styles.converterHeader;
      case 'clinical':
        return styles.clinicalHeader;
      case 'antibiotic':
        return styles.antibioticHeader;
      default:
        return styles.emergencyHeader;
    }
  };

  const headerStyle = [
    styles.header,
    getHeaderStyle()
  ];

  return (
    <View style={headerStyle}>
      <TouchableOpacity 
        onPress={handleBack} 
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ArrowLeft color="white" size={24} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    width: '100%',
  },
  emergencyHeader: {
    backgroundColor: theme.colors.emergency,
  },
  calculatorHeader: {
    backgroundColor: theme.colors.calculator,
  },
  scoreHeader: {
    backgroundColor: theme.colors.success,
  },
  converterHeader: {
    backgroundColor: '#9333EA',
  },
  clinicalHeader: {
    backgroundColor: theme.colors.primary,
  },
  antibioticHeader: {
    backgroundColor: '#0891B2',
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  title: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  placeholder: {
    width: 24,
  },
});