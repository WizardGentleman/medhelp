import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Pressable, useWindowDimensions } from 'react-native';
import Animated, { 
  withTiming, 
  useAnimatedStyle, 
  useSharedValue,
  interpolate
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';

interface MedicationDose {
  minDose: string;
  maxDose: string;
  minVolume: number;
  maxVolume: number;
  presentation: string[];
  unit?: string;
  concentrations?: Array<{
    value: number;
    label: string;
    presentations: string[];
    minDose?: number;
    maxDose?: number;
  }>;
}

interface MedicationCategory {
  name: string;
  medications: {
    name: string;
    concentration: string;
    doses: MedicationDose[];
  }[];
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SubMenu({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useSharedValue(0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    animation.value = withTiming(isOpen ? 0 : 1, { duration: 300 });
  };

  const containerStyle = useAnimatedStyle(() => ({
    height: isOpen ? 'auto' : 0,
    opacity: animation.value,
    overflow: 'hidden',
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(animation.value, [0, 1], [0, 180])}deg` }],
  }));

  return (
    <View style={styles.submenuContainer}>
      <TouchableOpacity 
        onPress={toggleMenu}
        style={styles.submenuHeader}
      >
        <Text style={styles.submenuTitle}>{title}</Text>
        <Animated.View style={iconStyle}>
          <ChevronDown size={24} color={theme.colors.text} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[containerStyle, styles.submenuContent]}>
        {children}
      </Animated.View>
    </View>
  );
}

export default function IOTScreen() {
  const { width } = useWindowDimensions();
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [selectedPropofolConcentration, setSelectedPropofolConcentration] = useState<number | null>(null);
  const [selectedMidazolamConcentration, setSelectedMidazolamConcentration] = useState<string | null>(null);
  const [selectedSuxamethoniumVial, setSelectedSuxamethoniumVial] = useState<string | null>(null);

  const getWeight = () => {
    const parsedWeight = parseFloat(weight);
    return isNaN(parsedWeight) ? 0 : parsedWeight;
  };

  const validateWeight = (value: string) => {
    const weightNum = parseFloat(value);
    if (!value) {
      setError('Peso é obrigatório');
      return false;
    }
    if (isNaN(weightNum) || weightNum < 1 || weightNum > 200) {
      setError('Peso deve estar entre 1 e 200 kg');
      return false;
    }
    setError('');
    return true;
  };

  const handleWeightChange = (value: string) => {
    setWeight(value.replace(',', '.'));
    if (value) validateWeight(value);
  };

  const formatVolume = (volume: number): string => {
    if (isNaN(volume)) return '-';
    return `${volume.toFixed(2)} ml`;
  };

  const getMidazolamConcentration = (label: string): number => {
    switch (label) {
      case '5mg/5ml': return 1;  // 1 mg/ml
      case '15mg/3ml': return 5; // 5 mg/ml
      case '25mg/5ml': return 5; // 5 mg/ml
      case '50mg/10ml': return 5; // 5 mg/ml
      default: return 0;
    }
  };

  const categories: MedicationCategory[] = [
    {
      name: 'ANALGESIA',
      medications: [
        {
          name: 'Fentanil',
          concentration: '50 mcg/ml',
          doses: [{
            minDose: '1',
            maxDose: '3',
            minVolume: getWeight() * 1 / 50,
            maxVolume: getWeight() * 3 / 50,
            presentation: ['2ml', '5ml', '10ml'],
            unit: 'mcg'
          }]
        },
        {
          name: 'Lidocaína 2%',
          concentration: '20 mg/ml',
          doses: [{
            minDose: '1,5',
            maxDose: '1,5',
            minVolume: getWeight() * 1.5 / 20,
            maxVolume: getWeight() * 1.5 / 20,
            presentation: ['5ml', '20ml'],
            unit: 'mg'
          }]
        }
      ]
    },
    {
      name: 'SEDAÇÃO',
      medications: [
        {
          name: 'Midazolam',
          concentration: '',
          doses: [{
            minDose: '0,1',
            maxDose: '0,3',
            minVolume: 0,
            maxVolume: 0,
            unit: 'mg',
            concentrations: [
              { value: 1, label: '5mg/5ml', presentations: ['5ml'] },
              { value: 5, label: '15mg/3ml', presentations: ['3ml'] },
              { value: 5, label: '25mg/5ml', presentations: ['5ml'] },
              { value: 5, label: '50mg/10ml', presentations: ['10ml'] }
            ],
            presentation: []
          }]
        },
        {
          name: 'Etomidato',
          concentration: '2 mg/ml',
          doses: [{
            minDose: '0,3',
            maxDose: '0,3',
            minVolume: getWeight() * 0.3 / 2,
            maxVolume: getWeight() * 0.3 / 2,
            presentation: ['10ml'],
            unit: 'mg'
          }]
        },
        {
          name: 'Quetamina',
          concentration: '50 mg/ml',
          doses: [{
            minDose: '1',
            maxDose: '2',
            minVolume: getWeight() * 1 / 50,
            maxVolume: getWeight() * 2 / 50,
            presentation: ['10ml'],
            unit: 'mg'
          }]
        },
        {
          name: 'Propofol',
          concentration: '',
          doses: [{
            minDose: '1,5',
            maxDose: '2',
            minVolume: 0,
            maxVolume: 0,
            unit: 'mg',
            concentrations: [
              { 
                value: 10, 
                label: '10mg/ml', 
                presentations: ['20ml', '50ml', '100ml'],
                minDose: 1.5,
                maxDose: 2
              },
              { 
                value: 20, 
                label: '20mg/ml', 
                presentations: ['50ml'],
                minDose: 1.5,
                maxDose: 2
              }
            ],
            presentation: []
          }]
        }
      ]
    },
    {
      name: 'BLOQUEADOR NEUROMUSCULAR',
      medications: [
        {
          name: 'Rocurônio',
          concentration: '10 mg/ml',
          doses: [{
            minDose: '1,2',
            maxDose: '1,5',
            minVolume: getWeight() * 1.2 / 10,
            maxVolume: getWeight() * 1.5 / 10,
            presentation: ['5ml'],
            unit: 'mg'
          }]
        },
        {
          name: 'Succinilcolina (Suxametônio)',
          concentration: '',
          doses: [{
            minDose: '1',
            maxDose: '1,5',
            minVolume: 0,
            maxVolume: 0,
            unit: 'mg',
            concentrations: [
              { 
                value: 10, 
                label: '100mg', 
                presentations: ['Pó para reconstituição']
              },
              { 
                value: 100, 
                label: '500mg', 
                presentations: ['Pó para reconstituição']
              }
            ],
            presentation: []
          }]
        }
      ]
    }
  ];

  const renderDoseText = (dose: MedicationDose, medication: { name: string }) => {
    if (medication.name === 'Propofol' && dose.concentrations) {
      const selectedConcentration = dose.concentrations.find(c => c.value === selectedPropofolConcentration);
      
      return (
        <>
          <View style={[styles.concentrationSelector, width < 768 && styles.concentrationSelectorMobile]}>
            {dose.concentrations.map((concentration) => (
              <TouchableOpacity
                key={concentration.label}
                style={[
                  styles.concentrationButton,
                  selectedPropofolConcentration === concentration.value && styles.concentrationButtonSelected
                ]}
                onPress={() => setSelectedPropofolConcentration(concentration.value)}
              >
                <Text style={[
                  styles.concentrationButtonText,
                  selectedPropofolConcentration === concentration.value && styles.concentrationButtonTextSelected
                ]}>
                  {concentration.label}
                  {'\n'}
                  ({concentration.presentations.join(', ')})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {!selectedPropofolConcentration ? (
            <Text style={styles.selectPrompt}>
              Escolha uma formulação para mostrar resultado
            </Text>
          ) : (
            <>
              <Text style={styles.doseText}>
                Faça{' '}
                <Text style={styles.doseHighlight}>
                  {formatVolume(getWeight() * selectedConcentration!.minDose! / selectedPropofolConcentration)}
                </Text>
                {' '}a{' '}
                <Text style={styles.doseHighlight}>
                  {formatVolume(getWeight() * selectedConcentration!.maxDose! / selectedPropofolConcentration)}
                </Text>
                {' '}EV em bolus
              </Text>
              <Text style={styles.doseRange}>
                (Dose habitual {selectedConcentration!.minDose} a {selectedConcentration!.maxDose} {dose.unit}/kg)
              </Text>
            </>
          )}
        </>
      );
    }

    if (medication.name === 'Midazolam' && dose.concentrations) {
      return (
        <>
          <View style={[styles.concentrationSelector, width < 768 && styles.concentrationSelectorMobile]}>
            {dose.concentrations.map((concentration) => (
              <TouchableOpacity
                key={concentration.label}
                style={[
                  styles.concentrationButton,
                  selectedMidazolamConcentration === concentration.label && styles.concentrationButtonSelected
                ]}
                onPress={() => setSelectedMidazolamConcentration(concentration.label)}
              >
                <Text style={[
                  styles.concentrationButtonText,
                  selectedMidazolamConcentration === concentration.label && styles.concentrationButtonTextSelected
                ]}>
                  {concentration.label}
                  {'\n'}
                  ({concentration.presentations.join(', ')})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {!selectedMidazolamConcentration ? (
            <Text style={styles.selectPrompt}>
              Escolha uma formulação para mostrar resultado
            </Text>
          ) : (
            <>
              <Text style={styles.doseText}>
                Faça{' '}
                <Text style={styles.doseHighlight}>
                  {formatVolume(getWeight() * 0.1 / getMidazolamConcentration(selectedMidazolamConcentration))}
                </Text>
                {' '}a{' '}
                <Text style={styles.doseHighlight}>
                  {formatVolume(getWeight() * 0.3 / getMidazolamConcentration(selectedMidazolamConcentration))}
                </Text>
                {' '}EV em bolus
              </Text>
              <Text style={styles.doseRange}>
                (Dose habitual 0,1 a 0,3 mg/kg)
              </Text>
            </>
          )}
        </>
      );
    }

    if (medication.name === 'Succinilcolina (Suxametônio)' && dose.concentrations) {
      return (
        <>
          <View style={[styles.concentrationSelector, width < 768 && styles.concentrationSelectorMobile]}>
            {dose.concentrations.map((concentration) => (
              <TouchableOpacity
                key={concentration.label}
                style={[
                  styles.concentrationButton,
                  selectedSuxamethoniumVial === concentration.label && styles.concentrationButtonSelected
                ]}
                onPress={() => setSelectedSuxamethoniumVial(concentration.label)}
              >
                <Text style={[
                  styles.concentrationButtonText,
                  selectedSuxamethoniumVial === concentration.label && styles.concentrationButtonTextSelected
                ]}>
                  {concentration.label}
                  {'\n'}
                  ({concentration.presentations.join(', ')})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {!selectedSuxamethoniumVial ? (
            <Text style={styles.selectPrompt}>
              Escolha uma formulação para mostrar resultado
            </Text>
          ) : (
            <>
              <Text style={styles.doseText}>
                {selectedSuxamethoniumVial === '100mg' ? (
                  <>
                    Dilua 100mg em 10ml AD ou SF 0.9% e administre{' '}
                    <Text style={styles.doseHighlight}>
                      {formatVolume(getWeight() * 1 / 10)}
                    </Text>
                    {' '}a{' '}
                    <Text style={styles.doseHighlight}>
                      {formatVolume(getWeight() * 1.5 / 10)}
                    </Text>
                    {' '}EV da solução
                  </>
                ) : (
                  <>
                    Dilua 500mg em 5ml AD ou SF 0.9%, aspire 1ml e dilua com 9ml AD ou SF 0.9%, então administre{' '}
                    <Text style={styles.doseHighlight}>
                      {formatVolume(getWeight() * 1 / 10)}
                    </Text>
                    {' '}a{' '}
                    <Text style={styles.doseHighlight}>
                      {formatVolume(getWeight() * 1.5 / 10)}
                    </Text>
                    {' '}EV da solução
                  </>
                )}
              </Text>
              <Text style={styles.doseRange}>
                (Dose habitual 1 a 1,5 mg/kg)
              </Text>
            </>
          )}
        </>
      );
    }

    if (dose.minDose === dose.maxDose) {
      return (
        <>
          <Text style={styles.doseText}>
            Faça{' '}
            <Text style={styles.doseHighlight}>
              {formatVolume(dose.minVolume)}
            </Text>
            {' '}EV em bolus
          </Text>
          <Text style={styles.doseRange}>
            (Dose habitual {dose.minDose} {dose.unit}/kg)
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.doseText}>
            Faça{' '}
            <Text style={styles.doseHighlight}>
              {formatVolume(dose.minVolume)}
            </Text>
            {' '}a{' '}
            <Text style={styles.doseHighlight}>
              {formatVolume(dose.maxVolume)}
            </Text>
            {' '}EV em bolus
          </Text>
          <Text style={styles.doseRange}>
            (Dose habitual {dose.minDose} a {dose.maxDose} {dose.unit}/kg)
          </Text>
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="IOT (Intubação Orotraqueal)" type="emergency" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[
          styles.content,
          width >= 768 && styles.contentTablet
        ]}>
          <View style={styles.weightContainer}>
            <Text style={styles.label}>Peso do Paciente (kg)</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Digite o peso"
              keyboardType="decimal-pad"
              value={weight}
              onChangeText={handleWeightChange}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <SubMenu title="SEQUÊNCIA RÁPIDA">
            {categories.map((category, index) => (
              <View key={index} style={styles.category}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                
                {category.medications.map((medication, medIndex) => (
                  <View key={medIndex} style={styles.medicationCard}>
                    <View style={styles.medicationHeader}>
                      <Text style={styles.medicationName}>{medication.name}</Text>
                      <Text style={styles.concentration}>{medication.concentration}</Text>
                    </View>

                    {medication.doses.map((dose, doseIndex) => (
                      <View key={doseIndex} style={styles.doseContainer}>
                        {renderDoseText(dose, medication)}
                      </View>
                    ))}

                    {medication.name !== 'Propofol' && medication.name !== 'Midazolam' && medication.name !== 'Succinilcolina (Suxametônio)' && (
                      <Text style={styles.presentationText}>
                        Apresentação: {medication.doses[0].presentation.join(', ')}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </SubMenu>

          <SubMenu title="MANUTENÇÃO">
            <View style={styles.maintenanceContainer}>
              <Text style={styles.placeholderText}>
                Esta seção será implementada posteriormente com informações sobre manutenção.
              </Text>
            </View>
          </SubMenu>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxl * 2,
  },
  content: {
    padding: theme.spacing.lg,
  },
  contentTablet: {
    maxWidth: 1024,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: '5%',
  },
  submenuContainer: {
    marginBottom: theme.spacing.lg,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  submenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: 'white',
  },
  submenuContent: {
    minHeight: 0,
    overflow: 'hidden',
  },
  submenuTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  category: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  categoryTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  medicationCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '100%',
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  medicationName: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
  },
  concentration: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.textSecondary,
  },
  doseContainer: {
    marginBottom: theme.spacing.md,
  },
  doseText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  doseHighlight: {
    color: theme.colors.emergency,
    fontFamily: 'Roboto-Bold',
  },
  doseRange: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  presentationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  maintenanceContainer: {
    padding: theme.spacing.lg,
  },
  placeholderText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  concentrationSelectorMobile: {
    flexDirection: 'column',
  },
  concentrationSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  concentrationButton: {
    flex: 1,
    minWidth: 150,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'white',
  },
  concentrationButtonSelected: {
    backgroundColor: theme.colors.emergency,
    borderColor: theme.colors.emergency,
  },
  concentrationButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    textAlign: 'center',
  },
  concentrationButtonTextSelected: {
    color: 'white',
  },
  doseCalculation: {
    marginBottom: theme.spacing.sm,
  },
  selectPrompt: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    fontStyle: 'italic',
  },
  weightContainer: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    marginTop: theme.spacing.xs,
  },
});