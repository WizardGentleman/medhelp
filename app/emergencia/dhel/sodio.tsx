import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';

interface FormData {
  currentSodium: string;
  targetSodium: string;
  weight: string;
  age: '' | 'under65' | 'over65';
  gender: '' | 'male' | 'female';
  solution: string;
}

interface FormErrors {
  currentSodium?: string;
  targetSodium?: string;
  weight?: string;
  age?: string;
  gender?: string;
  solution?: string;
}

interface CalculationResult {
  solution: string;
  volume: number;
  rate: number;
  waterDeficit?: number;
  preparation?: string;
}

export default function SodioScreen() {
  const [formData, setFormData] = useState<FormData>({
    currentSodium: '',
    targetSodium: '',
    weight: '',
    age: '',
    gender: '',
    solution: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<CalculationResult | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const currentNa = parseFloat(formData.currentSodium);
    if (!formData.currentSodium) {
      newErrors.currentSodium = 'Sódio atual é obrigatório';
      isValid = false;
    } else if (isNaN(currentNa) || currentNa < 100 || currentNa > 180) {
      newErrors.currentSodium = 'Sódio deve estar entre 100 e 180 mEq/L';
      isValid = false;
    }

    const targetNa = parseFloat(formData.targetSodium);
    if (!formData.targetSodium) {
      newErrors.targetSodium = 'Sódio alvo é obrigatório';
      isValid = false;
    } else if (isNaN(targetNa) || targetNa < 100 || targetNa > 180) {
      newErrors.targetSodium = 'Sódio alvo deve estar entre 100 e 180 mEq/L';
      isValid = false;
    }

    const weight = parseFloat(formData.weight);
    if (!formData.weight) {
      newErrors.weight = 'Peso é obrigatório';
      isValid = false;
    } else if (isNaN(weight) || weight < 30 || weight > 200) {
      newErrors.weight = 'Peso deve estar entre 30 e 200 kg';
      isValid = false;
    }

    if (!formData.age) {
      newErrors.age = 'Faixa etária é obrigatória';
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = 'Sexo é obrigatório';
      isValid = false;
    }

    if (!formData.solution) {
      newErrors.solution = 'Selecione uma solução';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateHypernatremiaCorrection = (currentNa: number, targetNa: number, weight: number): CalculationResult => {
    let waterFactor = formData.gender === 'male' ? 0.6 : 0.5;
    if (formData.age === 'over65') {
      waterFactor = 0.45;
    }
    
    const tbw = weight * waterFactor;
    const waterDeficit = tbw * ((currentNa / targetNa) - 1);
    const volume = Math.round(waterDeficit * 1000);
    
    const fluidNa = formData.solution === 'sg5' ? 0 : 77;
    const deltaNa = (fluidNa - currentNa) / (tbw + 1);
    const litrosNecessarios = Math.abs((currentNa - targetNa) / deltaNa);
    const rate = Math.round((litrosNecessarios * 1000) / 24);
    
    return {
      solution: formData.solution === 'sg5' ? 'Soro Glicosado 5%' : 'Soro Fisiológico 0,45%',
      volume: Math.round(rate * 24),
      rate,
      waterDeficit
    };
  };

  const calculateHyponatremiaCorrection = (currentNa: number, targetNa: number, weight: number): CalculationResult => {
    let waterFactor = formData.gender === 'male' ? 0.6 : 0.5;
    if (formData.age === 'over65') {
      waterFactor = 0.45;
    }
    
    const tbw = weight * waterFactor;
    
    // Calculate sodium concentration and volume based on solution type
    let solutionNa: number;
    let preparation: string | undefined;
    
    if (formData.solution === 'sf09') {
      solutionNa = 154; // SF 0.9% sodium concentration
    } else {
      // SF 3% preparation
      const naclVolume = 55;
      const sfVolume = 445;
      const naclConcentration = 3400;
      const sfConcentration = 154;
      
      const totalNa = (naclVolume * naclConcentration/1000) + (sfVolume * sfConcentration/1000);
      solutionNa = totalNa / 0.5; // 513 mEq/L
      preparation = `Preparo: NaCl 20% ${naclVolume}ml + SF 0,9% ${sfVolume}ml`;
    }
    
    // Calculate using Adrogue-Madias formula
    const deltaNa = (solutionNa - currentNa) / (tbw + 1);
    const desiredIncrease = targetNa - currentNa;
    const volumeNeeded = (desiredIncrease * (tbw + 1)) / (solutionNa - currentNa);
    const rate = Math.round((volumeNeeded * 1000) / 24);
    
    return {
      solution: formData.solution === 'sf09' ? 'Soro Fisiológico 0,9%' : 'Salina Hipertônica 3%',
      volume: Math.round(rate * 24),
      rate,
      preparation
    };
  };

  const calculateCorrection = () => {
    if (!validateForm()) return;

    const currentNa = parseFloat(formData.currentSodium);
    const targetNa = parseFloat(formData.targetSodium);
    const weight = parseFloat(formData.weight);
    const isHypernatremia = currentNa > 145;

    let result: CalculationResult;

    if (isHypernatremia) {
      result = calculateHypernatremiaCorrection(currentNa, targetNa, weight);
    } else {
      result = calculateHyponatremiaCorrection(currentNa, targetNa, weight);
    }

    setResult(result);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Correção de Sódio" type="emergency" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Sódio Atual (mEq/L)</Text>
            <TextInput
              style={[styles.input, errors.currentSodium && styles.inputError]}
              keyboardType="decimal-pad"
              value={formData.currentSodium}
              onChangeText={(value) => setFormData({ ...formData, currentSodium: value })}
              placeholder="Entre 100 e 180"
            />
            {errors.currentSodium && <Text style={styles.errorText}>{errors.currentSodium}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Sódio Alvo em 24h (mEq/L)</Text>
            <TextInput
              style={[styles.input, errors.targetSodium && styles.inputError]}
              keyboardType="decimal-pad"
              value={formData.targetSodium}
              onChangeText={(value) => setFormData({ ...formData, targetSodium: value })}
              placeholder="Máximo 8 mEq/L de diferença"
            />
            {errors.targetSodium && <Text style={styles.errorText}>{errors.targetSodium}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Peso (kg)</Text>
            <TextInput
              style={[styles.input, errors.weight && styles.inputError]}
              keyboardType="decimal-pad"
              value={formData.weight}
              onChangeText={(value) => setFormData({ ...formData, weight: value })}
              placeholder="Entre 30 e 200"
            />
            {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Faixa Etária</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  formData.age === 'under65' && styles.radioButtonSelected
                ]}
                onPress={() => setFormData({ ...formData, age: 'under65' })}
              >
                <Text style={[
                  styles.radioText,
                  formData.age === 'under65' && styles.radioTextSelected
                ]}>Menor que 65 anos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  formData.age === 'over65' && styles.radioButtonSelected
                ]}
                onPress={() => setFormData({ ...formData, age: 'over65' })}
              >
                <Text style={[
                  styles.radioText,
                  formData.age === 'over65' && styles.radioTextSelected
                ]}>65 anos ou mais</Text>
              </TouchableOpacity>
            </View>
            {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Sexo</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  formData.gender === 'male' && styles.radioButtonSelected
                ]}
                onPress={() => setFormData({ ...formData, gender: 'male' })}
              >
                <Text style={[
                  styles.radioText,
                  formData.gender === 'male' && styles.radioTextSelected
                ]}>Masculino</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  formData.gender === 'female' && styles.radioButtonSelected
                ]}
                onPress={() => setFormData({ ...formData, gender: 'female' })}
              >
                <Text style={[
                  styles.radioText,
                  formData.gender === 'female' && styles.radioTextSelected
                ]}>Feminino</Text>
              </TouchableOpacity>
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </View>

          <View style={styles.solutionContainer}>
            <Text style={styles.label}>Solução para Correção</Text>
            <View style={styles.radioGroup}>
              {parseFloat(formData.currentSodium) > 145 ? (
                <>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.solution === 'sg5' && styles.radioButtonSelected
                    ]}
                    onPress={() => setFormData({ ...formData, solution: 'sg5' })}
                  >
                    <Text style={[
                      styles.radioText,
                      formData.solution === 'sg5' && styles.radioTextSelected
                    ]}>Soro Glicosado 5%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.solution === 'sf045' && styles.radioButtonSelected
                    ]}
                    onPress={() => setFormData({ ...formData, solution: 'sf045' })}
                  >
                    <Text style={[
                      styles.radioText,
                      formData.solution === 'sf045' && styles.radioTextSelected
                    ]}>Soro Fisiológico 0,45%</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.solution === 'sf09' && styles.radioButtonSelected
                    ]}
                    onPress={() => setFormData({ ...formData, solution: 'sf09' })}
                  >
                    <Text style={[
                      styles.radioText,
                      formData.solution === 'sf09' && styles.radioTextSelected
                    ]}>Soro Fisiológico 0,9%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.solution === 'ssh3' && styles.radioButtonSelected
                    ]}
                    onPress={() => setFormData({ ...formData, solution: 'ssh3' })}
                  >
                    <Text style={[
                      styles.radioText,
                      formData.solution === 'ssh3' && styles.radioTextSelected
                    ]}>Salina Hipertônica 3%</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            {errors.solution && <Text style={styles.errorText}>{errors.solution}</Text>}
          </View>

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={calculateCorrection}
          >
            <Text style={styles.calculateButtonText}>Calcular Correção</Text>
          </TouchableOpacity>

          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Prescrição</Text>
              <Text style={styles.resultText}>
                {result.solution} ({result.volume}ml em 24h)
                {result.preparation && (
                  <>
                    {'\n'}{result.preparation}
                  </>
                )}
                {result.waterDeficit ? (
                  <>
                    {'\n'}Déficit de água livre: {result.waterDeficit.toFixed(1)}L
                  </>
                ) : null}
                {'\n'}Velocidade de infusão: {result.rate}ml/h
              </Text>
            </View>
          )}
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
  formGroup: {
    marginBottom: theme.spacing.lg,
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
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  radioButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    minWidth: 150,
  },
  radioButtonSelected: {
    backgroundColor: theme.colors.emergency,
    borderColor: theme.colors.emergency,
  },
  radioText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    textAlign: 'center',
  },
  radioTextSelected: {
    color: 'white',
  },
  solutionContainer: {
    marginBottom: theme.spacing.lg,
  },
  calculateButton: {
    backgroundColor: theme.colors.emergency,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.emergency,
  },
  resultTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
    marginBottom: theme.spacing.md,
  },
  resultText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    lineHeight: 24,
  }
});