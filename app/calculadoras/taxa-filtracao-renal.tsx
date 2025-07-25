import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';

interface FormData {
  age: string;
  gender: 'female' | 'male';
  creatinine: string;
}

interface FormErrors {
  age?: string;
  gender?: string;
  creatinine?: string;
}

export default function TaxaFiltracaoRenalScreen() {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    gender: 'female',
    creatinine: '',
  });
  const [result, setResult] = useState<number | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate age
    const age = parseInt(formData.age);
    if (!formData.age) {
      newErrors.age = 'Idade é obrigatória';
    } else if (isNaN(age) || age < 1 || age > 200) {
      newErrors.age = 'Idade deve estar entre 1 e 200 anos';
    }

    // Validate gender
    if (!formData.gender) {
      newErrors.gender = 'Sexo é obrigatório';
    }

    // Validate creatinine
    const creatinine = parseFloat(formData.creatinine.replace(',', '.'));
    if (!formData.creatinine) {
      newErrors.creatinine = 'Creatinina é obrigatória';
    } else if (isNaN(creatinine) || creatinine < 0 || creatinine > 100) {
      newErrors.creatinine = 'Creatinina deve estar entre 0 e 100 mg/dL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateGFR = () => {
    if (!validateForm()) return;

    const age = parseInt(formData.age);
    const creatinine = parseFloat(formData.creatinine.replace(',', '.'));
    const K = formData.gender === 'female' ? 0.7 : 0.9;
    const alpha = formData.gender === 'female' ? -0.241 : -0.302;
    
    const minTerm = Math.min(creatinine / K, 1);
    const maxTerm = Math.max(creatinine / K, 1);
    
    let gfr = 142 * 
              Math.pow(minTerm, alpha) * 
              Math.pow(maxTerm, -1.200) * 
              Math.pow(0.9938, age);

    if (formData.gender === 'female') {
      gfr *= 1.012;
    }

    setResult(Math.round(gfr * 100) / 100);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Taxa de Filtração Glomerular" type="calculator" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Calculadora da Taxa de Filtração Glomerular usando CKD-EPI 2021
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Idade (anos)</Text>
            <TextInput
              style={[styles.input, errors.age && styles.inputError]}
              placeholder="Digite a idade"
              keyboardType="numeric"
              value={formData.age}
              onChangeText={(value) => setFormData({ ...formData, age: value })}
            />
            {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Sexo</Text>
            <View style={styles.radioGroup}>
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
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Creatinina Sérica (mg/dL)</Text>
            <TextInput
              style={[styles.input, errors.creatinine && styles.inputError]}
              placeholder="Digite o valor da creatinina"
              keyboardType="decimal-pad"
              value={formData.creatinine}
              onChangeText={(value) => setFormData({ ...formData, creatinine: value })}
            />
            {errors.creatinine && <Text style={styles.errorText}>{errors.creatinine}</Text>}
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={calculateGFR}>
            <Text style={styles.calculateButtonText}>Calcular</Text>
          </TouchableOpacity>

          {result !== null && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Taxa de Filtração Glomerular:</Text>
              <Text style={styles.resultValue}>
                {result.toFixed(2)} mL/min/1.73m²
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
  description: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
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
  },
  radioButtonSelected: {
    backgroundColor: theme.colors.calculator,
    borderColor: theme.colors.calculator,
  },
  radioText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  radioTextSelected: {
    color: 'white',
  },
  calculateButton: {
    backgroundColor: theme.colors.calculator,
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
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  resultLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  resultValue: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
  },
});