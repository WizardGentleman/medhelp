import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Heart, Wind, Pill, Calculator, FlaskRound as Flask, Droplets, ClipboardList, Activity, Brain, Beaker, ArrowLeftRight, HeartPulse, AlertTriangle } from 'lucide-react-native';
import { NavigationButton } from '@/components/NavigationButton';
import { theme } from '@/styles/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROTOCOLOS DE EMERGÊNCIA</Text>
          <View style={styles.buttonContainer}>
            <NavigationButton
              icon={<Heart size={40} color={theme.colors.emergency} />}
              title="RCP"
              route="/emergencia/rcp"
              type="emergency"
            />
            
            <NavigationButton
              icon={<Wind size={40} color={theme.colors.emergency} />}
              title="IOT"
              route="/emergencia/iot"
              type="emergency"
            />
            
            <NavigationButton
              icon={<Pill size={40} color={theme.colors.emergency} />}
              title="Drogas Vasoativas"
              route="/emergencia/drogas-vasoativas"
              type="emergency"
            />

            <NavigationButton
              icon={<Droplets size={40} color={theme.colors.emergency} />}
              title="Distúrbios Hidroeletrolíticos"
              route="/emergencia/dhel"
              type="emergency"
            />
            
            <NavigationButton
              icon={<Heart size={40} color={theme.colors.emergency} />}
              title="Cardioversão"
              route="/emergencia/cardioversion"
              type="emergency"
            />

            <NavigationButton
              icon={<HeartPulse size={40} color={theme.colors.emergency} />}
              title="Taquiarritmias"
              route="/emergencia/taquiarritmias"
              type="emergency"
            />

            <NavigationButton
              icon={<AlertTriangle size={40} color={theme.colors.emergency} />}
              title="Sepse"
              route="/emergencia/sepse"
              type="emergency"
            />

            <NavigationButton
              icon={<Brain size={40} color={theme.colors.emergency} />}
              title="Crise Convulsiva"
              route="/emergencia/crise-convulsiva"
              type="emergency"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROTOCOLOS CLÍNICOS</Text>
          <View style={styles.buttonContainer}>
            <NavigationButton
              icon={<Pill size={40} color="#FF8F00" />}
              title="Medicamentos Enterais"
              route="/protocolo-clinico/medicamentos-enterais"
              type="clinical"
            />
            
            <NavigationButton
              icon={<Heart size={40} color="#FF8F00" />}
              title="Fibrilação Atrial"
              route="/protocolo-clinico/fibrilacaoatrial"
              type="clinical"
            />
            
            <NavigationButton
              icon={<Beaker size={40} color="#FF8F00" />}
              title="Controle Glicêmico"
              route="/protocolo-clinico/controle-glicemico"
              type="clinical"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CALCULADORAS</Text>
          <View style={styles.buttonContainer}>
            <NavigationButton
              icon={<Calculator size={40} color={theme.colors.calculator} />}
              title="Taxa de Filtração Renal"
              route="/calculadoras/taxa-filtracao-renal"
              type="calculator"
            />
            
            <NavigationButton
              icon={<Flask size={40} color={theme.colors.calculator} />}
              title="Ajuste de Dose de Antibiótico"
              route="/calculadoras/ajuste-dose-antibiotico"
              type="calculator"
            />

            <NavigationButton
              icon={<Brain size={40} color={theme.colors.calculator} />}
              title="NIHSS"
              route="/calculadoras/nihss"
              type="calculator"
            />

            <NavigationButton
              icon={<Beaker size={40} color={theme.colors.calculator} />}
              title="Injúria Renal Aguda (KDIGO)"
              route="/calculadoras/kdigo-aki"
              type="calculator"
            />

            <NavigationButton
              icon={<Wind size={40} color={theme.colors.calculator} />}
              title="Gasometria Arterial"
              route="/calculadoras/gasometria-arterial"
              type="calculator"
            />

            <NavigationButton
              icon={<Activity size={40} color={theme.colors.calculator} />}
              title="Cirrose Hepática"
              route="/calculadoras/cirrose-hepatica"
              type="calculator"
            />

            <NavigationButton
              icon={<Droplets size={40} color={theme.colors.calculator} />}
              title="Taxa de Infusão"
              route="/calculadoras/taxa-infusao"
              type="calculator"
            />

            <NavigationButton
              icon={<Wind size={40} color={theme.colors.calculator} />}
              title="TEP - Tromboembolismo Pulmonar"
              route="/calculadoras/tep"
              type="calculator"
            />

            <NavigationButton
              icon={<Beaker size={40} color={theme.colors.calculator} />}
              title="Correção de Hipoglicemia"
              route="/calculadoras/hipoglicemia"
              type="calculator"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ESCORES</Text>
          <View style={styles.buttonContainer}>
            <NavigationButton
              icon={<Heart size={40} color={theme.colors.success} />}
              title="Escores Paliativos"
              route="/escores/paliativos"
              type="score"
            />
            
            <NavigationButton
              icon={<Activity size={40} color={theme.colors.success} />}
              title="CHA2DS2-VASc"
              route="/escores/cha2ds2-vasc"
              type="score"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONVERSORES</Text>
          <View style={styles.buttonContainer}>
            <NavigationButton
              icon={<ArrowLeftRight size={40} color="#9333EA" />}
              title="Corticoides"
              route="/conversores/corticoides"
              type="converter"
              style={{ backgroundColor: '#F3E8FF', borderColor: '#9333EA', borderWidth: 2 }}
            />

            <NavigationButton
              icon={<Pill size={40} color="#9333EA" />}
              title="Opióides"
              route="/conversores/opioides"
              type="converter"
              style={{ backgroundColor: '#F3E8FF', borderColor: '#9333EA', borderWidth: 2 }}
            />

            <NavigationButton
              icon={<Calculator size={40} color="#9333EA" />}
              title="Concentrações"
              route="/conversores/concentracoes"
              type="converter"
              style={{ backgroundColor: '#F3E8FF', borderColor: '#9333EA', borderWidth: 2 }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MEDICAMENTOS</Text>
          <View style={styles.buttonContainer}>
            <NavigationButton
              icon={<Pill size={40} color="#FFD600" />}
              title="Anti-eméticos"
              route="/medicamentos/anti-emeticos"
              type="medication"
            />
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
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  // Adiciona estilo para destacar o título do card se necessário
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});