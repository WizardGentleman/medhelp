import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Brain, AlertTriangle } from 'lucide-react-native';

export default function CriseConvulsivaScreen() {
  const protocols = [
    {
      title: 'Convulsão',
      icon: <Brain size={32} color={theme.colors.emergency} />,
      route: '/emergencia/crise-convulsiva/convulsao'
    },
    {
      title: 'Estado de mal epiléptico convulsivo',
      icon: <AlertTriangle size={32} color={theme.colors.emergency} />,
      route: '/emergencia/crise-convulsiva/estado-mal-epileptico'
    }
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Crise Convulsiva" type="emergency" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Selecione o protocolo desejado:
          </Text>
          
          <View style={styles.grid}>
            {protocols.map((item, index) => (
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
