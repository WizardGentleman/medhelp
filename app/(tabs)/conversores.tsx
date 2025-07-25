import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ArrowLeftRight, Pill, Calculator } from 'lucide-react-native';
import { NavigationButton } from '@/components/NavigationButton';
import { theme } from '@/styles/theme';

export default function ConversoresScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONVERSORES MÉDICOS</Text>
            <View style={styles.buttonContainer}>
              <NavigationButton
                icon={<ArrowLeftRight size={40} color={theme.colors.calculator} />}
                title="Corticoides"
                route="/conversores/corticoides"
                type="calculator"
              />

              <NavigationButton
                icon={<Pill size={40} color={theme.colors.calculator} />}
                title="Opióides"
                route="/conversores/opioides"
                type="calculator"
              />

              <NavigationButton
                icon={<Calculator size={40} color={theme.colors.calculator} />}
                title="Concentrações"
                route="/conversores/concentracoes"
                type="calculator"
              />
            </View>
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
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});