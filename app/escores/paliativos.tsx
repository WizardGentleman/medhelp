import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Heart, Brain, Users, Activity, Target } from 'lucide-react-native';

export default function EscoresPaliativosScreen() {
  const escores = [
    {
      title: 'Palliative Performance Scale - PPS',
      icon: <Users size={32} color={theme.colors.success} />,
      route: '/escores/paliativos/pps',
      description: 'Avaliação funcional em cuidados paliativos'
    },
    {
      title: 'Paliar Score - Falências orgânicas',
      icon: <Heart size={32} color={theme.colors.success} />,
      route: '/escores/paliativos/paliar-score',
      description: 'Avaliação de falências orgânicas'
    },
    {
      title: 'Palliative Prognostic Index - PPI',
      icon: <Target size={32} color={theme.colors.success} />,
      route: '/escores/paliativos/ppi',
      description: 'Prognóstico em doença oncológica'
    },
    {
      title: 'FAST - Functional Assessment Staging',
      icon: <Brain size={32} color={theme.colors.success} />,
      route: '/escores/paliativos/fast',
      description: 'Estadiamento da doença de Alzheimer'
    },
    {
      title: 'Escala de Rankin Modificada',
      icon: <Activity size={32} color={theme.colors.success} />,
      route: '/escores/paliativos/rankin',
      description: 'Avaliação funcional pós-AVC'
    }
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Escores Paliativos" type="score" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Selecione o escore para avaliação paliativa:
          </Text>
          
          <View style={styles.list}>
            {escores.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => router.push(item.route)}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    {item.icon}
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  description: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  list: {
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.success,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: theme.spacing.lg,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
  },
});
