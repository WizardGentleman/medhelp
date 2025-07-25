import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';

export default function ConvulsaoScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Convulsão" type="emergency" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Definição</Text>
            <Text style={styles.text}>
              Crise epiléptica é uma ocorrência transitória de sinais e/ou sintomas devido à atividade neuronal anormal excessiva ou síncrona no cérebro.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avaliação Inicial</Text>
            <Text style={styles.text}>• Proteção de vias aéreas{'\n'}
              • Acesso venoso periférico{'\n'}
              • Monitorização (FC, PA, SpO2){'\n'}
              • Glicemia capilar{'\n'}
              • Lateralizar o paciente{'\n'}
              • Proteger contra traumas
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exames Complementares</Text>
            <Text style={styles.text}>
              • Glicemia{'\n'}
              • Eletrólitos (Na, K, Ca, Mg){'\n'}
              • Função renal{'\n'}
              • Gasometria arterial{'\n'}
              • Hemograma{'\n'}
              • TC de crânio (se primeira crise ou déficit focal){'\n'}
              • Considerar: toxicológico, níveis séricos de anticonvulsivantes
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tratamento Medicamentoso</Text>
            
            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>Primeira Linha (0-5 minutos)</Text>
              <Text style={styles.text}>
                • Diazepam 10mg IV (repetir após 5 min se necessário){'\n'}
                • OU Midazolam 10mg IM{'\n'}
                • OU Lorazepam 4mg IV (se disponível)
              </Text>
            </View>

            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>Se Crise Persiste</Text>
              <Text style={styles.text}>
                • Fenitoína 20mg/kg IV (máx 50mg/min){'\n'}
                • Monitorizar ECG durante infusão{'\n'}
                • Diluir em SF 0,9%
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Correção de Distúrbios</Text>
            <Text style={styles.text}>
              • Hipoglicemia: Glicose 50% 50ml IV{'\n'}
              • Hiponatremia: Correção conforme protocolo{'\n'}
              • Hipocalcemia: Gluconato de cálcio 10% 10ml IV{'\n'}
              • Hipomagnesemia: Sulfato de magnésio 2g IV{'\n'}
              • Alcoolismo/desnutrição: Tiamina 100mg IV
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Critérios de Internação</Text>
            <Text style={styles.text}>
              • Primeira crise{'\n'}
              • Crise prolongada (>5 minutos){'\n'}
              • Crises repetidas{'\n'}
              • Déficit neurológico focal{'\n'}
              • Alteração persistente do nível de consciência{'\n'}
              • Causa identificável que necessite tratamento
            </Text>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>ATENÇÃO!</Text>
            <Text style={styles.warningText}>
              • Não colocar objetos na boca do paciente{'\n'}
              • Não tentar conter movimentos{'\n'}
              • Atenção para broncoaspiração{'\n'}
              • Considerar status epiléptico se crise >5 minutos
            </Text>
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
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
    marginBottom: theme.spacing.sm,
  },
  subsection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    paddingLeft: theme.spacing.md,
  },
  subsectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  text: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 24,
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#FFC107',
    marginTop: theme.spacing.xl,
  },
  warningTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#856404',
    marginBottom: theme.spacing.xs,
  },
  warningText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#856404',
    lineHeight: 22,
  },
});
