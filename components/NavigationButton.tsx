import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { theme } from '@/styles/theme';

interface NavigationButtonProps {
  icon: ReactNode;
  title: string;
  route: string;
  type?: 'emergency' | 'calculator' | 'score' | 'converter' | 'clinical' | 'medication';
  style?: ViewStyle;
  textColor?: string;
}

export function NavigationButton({ 
  icon, 
  title, 
  route, 
  type = 'emergency',
  style,
  textColor
}: NavigationButtonProps) {
  const handlePress = () => {
    router.push(route);
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'emergency':
        return styles.emergencyButton;
      case 'calculator':
        return styles.calculatorButton;
      case 'score':
        return styles.scoreButton;
      case 'converter':
        return styles.converterButton;
      case 'clinical':
        return styles.clinicalButton;
      case 'medication':
        return styles.medicationButton;
      default:
        return styles.emergencyButton;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'emergency':
        return styles.emergencyText;
      case 'calculator':
        return styles.calculatorText;
      case 'score':
        return styles.scoreText;
      case 'converter':
        return styles.converterText;
      case 'clinical':
        return styles.clinicalText;
      case 'medication':
        return styles.medicationText;
      default:
        return styles.emergencyText;
    }
  };

  const buttonStyle = [
    styles.container, 
    getButtonStyle(),
    style
  ];
  
  const textStyle = [
    styles.title,
    getTextStyle(),
    textColor ? { color: textColor } : null
  ];

  return (
    <TouchableOpacity 
      style={buttonStyle}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    marginVertical: theme.spacing.xs,
    marginHorizontal: 0,
    width: '48%',
    alignSelf: 'auto',
    maxWidth: undefined,
  },
  emergencyButton: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: theme.colors.emergency,
  },
  clinicalButton: {
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#FFB74D',
  },
  calculatorButton: {
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  scoreButton: {
    backgroundColor: '#F0FFF4',
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  converterButton: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#9333EA',
  },
  medicationButton: {
    backgroundColor: '#FFF9C4',
    borderWidth: 2,
    borderColor: '#FFD600',
  },
  title: {
    marginTop: theme.spacing.md,
    fontFamily: 'Roboto-Medium',
    fontSize: theme.fontSize.md,
    textAlign: 'center',
  },
  emergencyText: {
    color: theme.colors.emergency,
  },
  clinicalText: {
    color: '#FF8F00',
  },
  calculatorText: {
    color: theme.colors.calculator,
  },
  scoreText: {
    color: theme.colors.success,
  },
  converterText: {
    color: '#6B21A8', // Roxo escuro para melhor contraste
  },
  medicationText: {
    color: '#FFA000',
  },
});