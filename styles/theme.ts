export const theme = {
  colors: {
    primary: '#0077CC',
    secondary: '#E6F7FF',
    emergency: '#D32F2F',
    calculator: '#3949AB',
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#333333',
    textSecondary: '#757575',
    border: '#E0E0E0',
    success: '#2E7D32',
    warning: '#FF9800',
    error: '#C62828',
    // Topic-specific colors echoing FA page palette
    topic1: '#2563EB',  // Blue - classifications, procedures
    topic2: '#16A34A',  // Green - medications, treatments
    topic3: '#9333EA',  // Purple - strategy, anticoagulation
    topic4: '#EA580C',  // Orange - acute treatments, interventions
    topic5: '#B91C1C',  // Red - complications, emergencies
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 20,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  typography: {
    h1: {
      fontFamily: 'Roboto-Bold',
      fontSize: 32,
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontFamily: 'Roboto-Bold',
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: -0.25,
    },
    h3: {
      fontFamily: 'Roboto-Bold',
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 0,
    },
    body1: {
      fontFamily: 'Roboto-Regular',
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    body2: {
      fontFamily: 'Roboto-Regular',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    button: {
      fontFamily: 'Roboto-Medium',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.25,
      textTransform: 'uppercase',
    },
    caption: {
      fontFamily: 'Roboto-Regular',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
  },
};