import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { ArrowUpDown, Zap, Magnet, CircleDot } from 'lucide-react-native';

export default function DhelScreen() {
  const disturbances = [
    {
      title: 'Sódio',
      icon: <ArrowUpDown size={32} color={theme.colors.emergency} />,
      route: '/emergencia/dhel/sodio'
    },
    {
      title: 'Potássio',
      icon: <Zap size={32} color={theme.colors.emergency} />,
      route: '/emergencia/dhel/potassio'
    },
    {
      title: 'Magnésio',
      icon: <Magnet size={32} color={theme.colors.emergency} />,
      route: '/emergencia/dhel/magnesio'
    },
    {
      title: 'Cálcio',
      icon: <CircleDot size={32} color={theme.colors.emergency} />,
      route: '/emergencia/dhel/calcio'
    }
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Distúrbios Hidroeletrolíticos" type="emergency" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Selecione o eletrólito para ver o protocolo de manejo:
          </Text>
          
          <View style={styles.grid}>
            {disturbances.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => router.push(item.route)}
              >
                <View style={styles.iconContainer}>
                  {item.icon}
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.emergency,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
    textAlign: 'center',
  },
});