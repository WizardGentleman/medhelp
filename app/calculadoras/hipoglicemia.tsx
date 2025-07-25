import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Beaker, Calculator, Info, AlertTriangle, Activity } from 'lucide-react-native';

interface FormData {
  patientWeight: string;
  selectedSolution: '10' | '25';
  selectedVolume: '100' | '250' | '500';
}

export default function HipoglicemiaScreen() {
  const [patientWeight, setPatientWeight] = useState('');
  const [selectedSolution, setSelectedSolution] = useState<'10' | '25'>('10');
  const [selectedVolume, setSelectedVolume] = useState<'100' | '250' | '500'>('100');

  // Calculate glucose doses based on patient weight
  const calculateGlucoseDoses = () => {
    const weight = parseFloat(patientWeight);
    if (!weight || weight <= 0) return null;
    
    const minDose = weight * 0.2; // 0.2 g/kg
    const maxDose = weight * 0.5; // 0.5 g/kg
    
    // SG 10% = 0.1 g/mL
    const sg10MinVolume = minDose / 0.1;
    const sg10MaxVolume = maxDose / 0.1;
    
    // SG 25% = 0.25 g/mL
    const sg25MinVolume = minDose / 0.25;
    const sg25MaxVolume = maxDose / 0.25;
    
    return {
      minDose: minDose.toFixed(1),
      maxDose: maxDose.toFixed(1),
      sg10Min: sg10MinVolume.toFixed(0),
      sg10Max: sg10MaxVolume.toFixed(0),
      sg25Min: sg25MinVolume.toFixed(0),
      sg25Max: sg25MaxVolume.toFixed(0)
    };
  };

  // Calculate mixture for glucose solution preparation
  const calculateMixture = () => {
    const volume = parseInt(selectedVolume);
    const concentration = selectedSolution === '10' ? 10 : 25;
    
    // Table data based on the image
    const mixtureData = {
      '10': {
        '100': { sg50: 11, sg5: 89 },
        '250': { sg50: 28, sg5: 222 },
        '500': { sg50: 56, sg5: 444 }
      },
      '25': {
        '100': { sg50: 44, sg5: 56 },
        '250': { sg50: 111, sg5: 139 },
        '500': { sg50: 222, sg5: 278 }
      }
    };
    
    return mixtureData[selectedSolution][selectedVolume];
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Correção de Hipoglicemia" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Info size={24} color={theme.colors.primary} />
              <Text style={styles.infoTitle}>Tratamento da Hipoglicemia</Text>
            </View>
            <Text style={styles.infoText}>
              • Hipoglicemia: glicemia {'<'} 70 mg/dL{'\n'}
              • Paciente inconsciente: 0,2-0,5 g/kg/dose EV{'\n'}
              • SG 10% (2-5 mL/kg) ou SG 25% (1-2 mL/kg){'\n'}
              • Não usar SG 50% pelo risco de flebite
            </Text>
          </View>

          {/* Calculadora de Dose de Glicose */}
          <View style={styles.calculatorCard}>
            <View style={[styles.sectionHeader, {backgroundColor: '#6366F1'}]}>
              <Calculator size={20} color="#FFFFFF" />
              <Text style={[styles.sectionTitle, {color: '#FFFFFF'}]}>CALCULADORA DE DOSE DE GLICOSE</Text>
            </View>
            
            <View style={[styles.badge, {backgroundColor: '#E0E7FF', borderLeftColor: '#6366F1'}]}>
              <Text style={styles.boldText}>Cálculo baseado em 0,2-0,5 g/kg/dose</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Peso do paciente (kg):</Text>
              <TextInput
                style={styles.input}
                value={patientWeight}
                onChangeText={setPatientWeight}
                keyboardType="decimal-pad"
                placeholder="Ex: 70"
                placeholderTextColor="#9CA3AF"
              />
              
              {patientWeight && calculateGlucoseDoses() && (
                <View style={styles.resultContainer}>
                  <Text style={[styles.boldText, {marginBottom: 8}]}>📊 Resultados:</Text>
                  
                  <View style={[styles.resultBox, {backgroundColor: '#FFF3CD', borderColor: '#FFC107'}]}>
                    <Text style={styles.boldText}>Dose de glicose:</Text>
                    <Text style={styles.resultText}>
                      {calculateGlucoseDoses()?.minDose} - {calculateGlucoseDoses()?.maxDose} g
                    </Text>
                  </View>
                  
                  <View style={[styles.resultBox, {backgroundColor: '#D1FAE5', borderColor: '#10B981'}]}>
                    <Text style={styles.boldText}>SG 10% (0,1 g/mL):</Text>
                    <Text style={styles.resultText}>
                      {calculateGlucoseDoses()?.sg10Min} - {calculateGlucoseDoses()?.sg10Max} mL
                    </Text>
                  </View>
                  
                  <View style={[styles.resultBox, {backgroundColor: '#DBEAFE', borderColor: '#3B82F6'}]}>
                    <Text style={styles.boldText}>SG 25% (0,25 g/mL):</Text>
                    <Text style={styles.resultText}>
                      {calculateGlucoseDoses()?.sg25Min} - {calculateGlucoseDoses()?.sg25Max} mL
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Calculadora de Preparo de Solução */}
          <View style={styles.mixtureCard}>
            <View style={[styles.sectionHeader, {backgroundColor: '#EC4899'}]}>
              <Beaker size={20} color="#FFFFFF" />
              <Text style={[styles.sectionTitle, {color: '#FFFFFF'}]}>PREPARO DE SOLUÇÃO GLICOSADA</Text>
            </View>
            
            <View style={[styles.badge, {backgroundColor: '#FCE7F3', borderLeftColor: '#EC4899'}]}>
              <Text style={styles.boldText}>Mistura de SG 50% + SG 5%</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Solução desejada:</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.optionButton, selectedSolution === '10' && styles.optionButtonActive]}
                  onPress={() => setSelectedSolution('10')}
                >
                  <Text style={[styles.optionButtonText, selectedSolution === '10' && styles.optionButtonTextActive]}>
                    SG 10%
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionButton, selectedSolution === '25' && styles.optionButtonActive]}
                  onPress={() => setSelectedSolution('25')}
                >
                  <Text style={[styles.optionButtonText, selectedSolution === '25' && styles.optionButtonTextActive]}>
                    SG 25%
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.inputLabel, {marginTop: 12}]}>Volume final:</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.optionButton, selectedVolume === '100' && styles.optionButtonActive]}
                  onPress={() => setSelectedVolume('100')}
                >
                  <Text style={[styles.optionButtonText, selectedVolume === '100' && styles.optionButtonTextActive]}>
                    100 mL
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionButton, selectedVolume === '250' && styles.optionButtonActive]}
                  onPress={() => setSelectedVolume('250')}
                >
                  <Text style={[styles.optionButtonText, selectedVolume === '250' && styles.optionButtonTextActive]}>
                    250 mL
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionButton, selectedVolume === '500' && styles.optionButtonActive]}
                  onPress={() => setSelectedVolume('500')}
                >
                  <Text style={[styles.optionButtonText, selectedVolume === '500' && styles.optionButtonTextActive]}>
                    500 mL
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={[styles.resultContainer, {marginTop: 16}]}>
                <Text style={[styles.boldText, {marginBottom: 8}]}>🧪 Preparo:</Text>
                
                <View style={[styles.mixtureBox, {backgroundColor: '#FEF3C7', borderColor: '#F59E0B'}]}>
                  <Text style={styles.boldText}>Para preparar {selectedVolume} mL de SG {selectedSolution}%:</Text>
                  <View style={styles.mixtureRow}>
                    <View style={styles.mixtureItem}>
                      <Text style={styles.mixtureLabel}>SG 50%:</Text>
                      <Text style={styles.mixtureValue}>{calculateMixture().sg50} mL</Text>
                    </View>
                    <Text style={styles.mixturePlus}>+</Text>
                    <View style={styles.mixtureItem}>
                      <Text style={styles.mixtureLabel}>SG 5%:</Text>
                      <Text style={styles.mixtureValue}>{calculateMixture().sg5} mL</Text>
                    </View>
                  </View>
                </View>
                
                <View style={[styles.tipBox, {marginTop: 8}]}>
                  <Text style={styles.tipText}>💡 Dica: Sempre verifique os cálculos e prepare a solução com técnica asséptica</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Warning Card */}
          <View style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <AlertTriangle size={24} color="#DC2626" />
              <Text style={styles.warningTitle}>Observações Importantes</Text>
            </View>
            <Text style={styles.warningText}>
              • Monitorar glicemia capilar após 15 minutos{'\n'}
              • Repetir tratamento se necessário{'\n'}
              • Atenção aos sinais de flebite com SG concentrado{'\n'}
              • Em lactentes, oferecer 7,5 g de carboidrato{'\n'}
              • Não oferecer mel a crianças {'<'} 1 ano
            </Text>
          </View>

          {/* Infusão Contínua Card */}
          <View style={styles.infusionCard}>
            <View style={[styles.sectionHeader, {backgroundColor: '#10B981'}]}>
              <Activity size={20} color="#FFFFFF" />
              <Text style={[styles.sectionTitle, {color: '#FFFFFF'}]}>INFUSÃO CONTÍNUA PARA HIPOGLICEMIA PERSISTENTE</Text>
            </View>
            
            <View style={[styles.badge, {backgroundColor: '#D1FAE5', borderLeftColor: '#10B981'}]}>
              <Text style={styles.boldText}>Manutenção: 2-5 mg/kg/minuto</Text>
            </View>
            
            <View style={styles.infusionContent}>
              <Text style={styles.infusionText}>
                Se a hipoglicemia persistir após várias correções, iniciar infusão contínua de solução glicosada:
              </Text>
              
              {patientWeight && parseFloat(patientWeight) > 0 && (
                <View style={styles.infusionResults}>
                  <Text style={[styles.boldText, {marginBottom: 12, fontSize: theme.fontSize.md}]}>💊 Taxa de Infusão (mL/h):</Text>
                  
                  <View style={[styles.infusionResultBox, {backgroundColor: '#F0FDF4'}]}>
                    <View style={styles.infusionResultHeader}>
                      <Text style={styles.infusionResultTitle}>SG 10%</Text>
                      <Text style={styles.infusionResultSubtitle}>(0,1 g/mL)</Text>
                    </View>
                    <View style={styles.infusionResultValues}>
                      <View style={styles.infusionResultItem}>
                        <Text style={styles.infusionResultLabel}>Mínimo (2 mg/kg/min):</Text>
                        <Text style={styles.infusionResultValue}>
                          {((parseFloat(patientWeight) * 2 * 60) / 100).toFixed(1)} mL/h
                        </Text>
                      </View>
                      <View style={styles.infusionResultItem}>
                        <Text style={styles.infusionResultLabel}>Máximo (5 mg/kg/min):</Text>
                        <Text style={styles.infusionResultValue}>
                          {((parseFloat(patientWeight) * 5 * 60) / 100).toFixed(1)} mL/h
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={[styles.infusionResultBox, {backgroundColor: '#E0F2FE'}]}>
                    <View style={styles.infusionResultHeader}>
                      <Text style={styles.infusionResultTitle}>SG 25%</Text>
                      <Text style={styles.infusionResultSubtitle}>(0,25 g/mL)</Text>
                    </View>
                    <View style={styles.infusionResultValues}>
                      <View style={styles.infusionResultItem}>
                        <Text style={styles.infusionResultLabel}>Mínimo (2 mg/kg/min):</Text>
                        <Text style={styles.infusionResultValue}>
                          {((parseFloat(patientWeight) * 2 * 60) / 250).toFixed(1)} mL/h
                        </Text>
                      </View>
                      <View style={styles.infusionResultItem}>
                        <Text style={styles.infusionResultLabel}>Máximo (5 mg/kg/min):</Text>
                        <Text style={styles.infusionResultValue}>
                          {((parseFloat(patientWeight) * 5 * 60) / 250).toFixed(1)} mL/h
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={[styles.infusionNote, {marginTop: 12}]}>
                    <Text style={styles.infusionNoteText}>
                      ⚠️ Usar bomba de infusão para maior precisão{"\n"}
                      📊 Monitorar glicemia a cada 30-60 minutos{"\n"}
                      ✅ Ajustar taxa conforme resposta do paciente
                    </Text>
                  </View>
                </View>
              )}
              
              {!patientWeight && (
                <View style={styles.infusionPrompt}>
                  <Text style={styles.infusionPromptText}>
                    👆 Insira o peso do paciente acima para calcular as taxas de infusão
                  </Text>
                </View>
              )}
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
  // Info Card
  infoCard: {
    backgroundColor: '#E7F3FF',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Calculator Card
  calculatorCard: {
    backgroundColor: '#F5F5FF',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  // Mixture Card
  mixtureCard: {
    backgroundColor: '#FFF0F7',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EC4899',
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    marginLeft: theme.spacing.sm,
  },
  // Badge
  badge: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderLeftWidth: 3,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  // Input Container
  inputContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
  },
  // Button Group
  buttonGroup: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  optionButtonTextActive: {
    color: '#FFFFFF',
  },
  // Results
  resultContainer: {
    marginTop: theme.spacing.lg,
  },
  resultBox: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
  },
  resultText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    marginTop: theme.spacing.xs,
  },
  // Mixture
  mixtureBox: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
  },
  mixtureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  mixtureItem: {
    alignItems: 'center',
  },
  mixtureLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
  },
  mixtureValue: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  mixturePlus: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  // Tip Box
  tipBox: {
    backgroundColor: '#FFF7ED',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  tipText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
  },
  // Warning Card
  warningCard: {
    backgroundColor: '#FFF5F5',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  warningTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#DC2626',
    marginLeft: theme.spacing.sm,
  },
  warningText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Common styles
  boldText: {
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  // Infusion Card
  infusionCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  infusionContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  infusionText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  infusionResults: {
    marginTop: theme.spacing.sm,
  },
  infusionResultBox: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: theme.spacing.md,
  },
  infusionResultHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
  },
  infusionResultTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  infusionResultSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#6B7280',
    marginLeft: theme.spacing.sm,
  },
  infusionResultValues: {
    gap: theme.spacing.sm,
  },
  infusionResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  infusionResultLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
  },
  infusionResultValue: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#059669',
  },
  infusionNote: {
    backgroundColor: '#FEF3C7',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  infusionNoteText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  infusionPrompt: {
    backgroundColor: '#F3F4F6',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  infusionPromptText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
});
