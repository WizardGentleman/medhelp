import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Pill, ArrowLeftRight, Info, TriangleAlert as AlertTriangle, RotateCcw } from 'lucide-react-native';

interface Corticosteroid {
  id: string;
  name: string;
  equivalentDose: number; // mg equivalent to 5mg prednisolona
  halfLife: string;
  mineralocorticoidActivity: string;
  antiInflammatoryPotency: number;
}

interface ConversionResult {
  fromCorticosteroid: Corticosteroid;
  toCorticosteroid: Corticosteroid;
  fromDose: number;
  convertedDose: number;
  conversionFactor: number;
  clinicalNotes: string[];
  warnings: string[];
}

const corticosteroids: Corticosteroid[] = [
  {
    id: 'betametasona',
    name: 'Betametasona',
    equivalentDose: 0.75,
    halfLife: '36-54h',
    mineralocorticoidActivity: 'Mínima',
    antiInflammatoryPotency: 25
  },
  {
    id: 'prednisona',
    name: 'Prednisona',
    equivalentDose: 5,
    halfLife: '12-36h',
    mineralocorticoidActivity: 'Moderada',
    antiInflammatoryPotency: 4
  },
  {
    id: 'prednisolona',
    name: 'Prednisolona',
    equivalentDose: 5,
    halfLife: '12-36h',
    mineralocorticoidActivity: 'Moderada',
    antiInflammatoryPotency: 4
  },
  {
    id: 'metilprednisolona',
    name: 'Metilprednisolona',
    equivalentDose: 4,
    halfLife: '12-36h',
    mineralocorticoidActivity: 'Mínima',
    antiInflammatoryPotency: 5
  },
  {
    id: 'dexametasona',
    name: 'Dexametasona',
    equivalentDose: 0.75,
    halfLife: '36-54h',
    mineralocorticoidActivity: 'Mínima',
    antiInflammatoryPotency: 25
  },
  {
    id: 'hidrocortisona',
    name: 'Hidrocortisona',
    equivalentDose: 20,
    halfLife: '8-12h',
    mineralocorticoidActivity: 'Alta',
    antiInflammatoryPotency: 1
  },
  {
    id: 'triancinolona',
    name: 'Triancinolona',
    equivalentDose: 4,
    halfLife: '12-36h',
    mineralocorticoidActivity: 'Nenhuma',
    antiInflammatoryPotency: 5
  }
];

export default function CorticoidesScreen() {
  const [fromCorticosteroid, setFromCorticosteroid] = useState<Corticosteroid | null>(null);
  const [toCorticosteroid, setToCorticosteroid] = useState<Corticosteroid | null>(null);
  const [dose, setDose] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState('');

  const validateInputs = (): boolean => {
    if (!fromCorticosteroid) {
      setError('Selecione o corticoide de origem');
      return false;
    }
    if (!toCorticosteroid) {
      setError('Selecione o corticoide de destino');
      return false;
    }
    if (fromCorticosteroid.id === toCorticosteroid.id) {
      setError('Selecione corticoides diferentes para conversão');
      return false;
    }
    
    const doseValue = parseFloat(dose.replace(',', '.'));
    if (!dose) {
      setError('Digite a dose a ser convertida');
      return false;
    }
    if (isNaN(doseValue) || doseValue <= 0 || doseValue > 1000) {
      setError('Dose deve estar entre 0,1 e 1000 mg');
      return false;
    }

    setError('');
    return true;
  };

  const calculateConversion = (): ConversionResult => {
    const doseValue = parseFloat(dose.replace(',', '.'));
    
    // Convert to prednisolona equivalent first, then to target corticosteroid
    const prednisolonaEquivalent = (doseValue / fromCorticosteroid!.equivalentDose) * 5;
    const convertedDose = (prednisolonaEquivalent / 5) * toCorticosteroid!.equivalentDose;
    const conversionFactor = toCorticosteroid!.equivalentDose / fromCorticosteroid!.equivalentDose;

    // Generate clinical notes
    const clinicalNotes: string[] = [];
    const warnings: string[] = [];

    // Potency comparison
    if (toCorticosteroid!.antiInflammatoryPotency > fromCorticosteroid!.antiInflammatoryPotency) {
      clinicalNotes.push(
        `${toCorticosteroid!.name} tem maior potência anti-inflamatória (${toCorticosteroid!.antiInflammatoryPotency}x vs ${fromCorticosteroid!.antiInflammatoryPotency}x)`
      );
    } else if (toCorticosteroid!.antiInflammatoryPotency < fromCorticosteroid!.antiInflammatoryPotency) {
      clinicalNotes.push(
        `${toCorticosteroid!.name} tem menor potência anti-inflamatória (${toCorticosteroid!.antiInflammatoryPotency}x vs ${fromCorticosteroid!.antiInflammatoryPotency}x)`
      );
    }

    // Half-life comparison
    clinicalNotes.push(
      `Meia-vida: ${fromCorticosteroid!.name} (${fromCorticosteroid!.halfLife}) → ${toCorticosteroid!.name} (${toCorticosteroid!.halfLife})`
    );

    // Mineralocorticoid activity
    if (fromCorticosteroid!.mineralocorticoidActivity !== toCorticosteroid!.mineralocorticoidActivity) {
      clinicalNotes.push(
        `Atividade mineralocorticoide: ${fromCorticosteroid!.mineralocorticoidActivity} → ${toCorticosteroid!.mineralocorticoidActivity}`
      );
    }

    // Specific warnings
    if (toCorticosteroid!.id === 'hidrocortisona' && fromCorticosteroid!.mineralocorticoidActivity === 'Mínima') {
      warnings.push('Hidrocortisona tem alta atividade mineralocorticoide - monitorar retenção hídrica e eletrólitos');
    }

    if (fromCorticosteroid!.id === 'hidrocortisona' && toCorticosteroid!.mineralocorticoidActivity === 'Mínima') {
      warnings.push('Transição de hidrocortisona pode causar insuficiência mineralocorticoide - considerar fludrocortisona');
    }

    if ((toCorticosteroid!.id === 'dexametasona' || toCorticosteroid!.id === 'betametasona') && 
        (fromCorticosteroid!.id === 'prednisona' || fromCorticosteroid!.id === 'prednisolona')) {
      warnings.push('Transição para corticoide de longa ação - ajustar frequência de administração');
    }

    if (convertedDose > 80) {
      warnings.push('Dose alta - considerar redução gradual e monitoramento de efeitos adversos');
    }

    if (convertedDose < 1) {
      warnings.push('Dose muito baixa - verificar se é clinicamente efetiva');
    }

    return {
      fromCorticosteroid: fromCorticosteroid!,
      toCorticosteroid: toCorticosteroid!,
      fromDose: doseValue,
      convertedDose,
      conversionFactor,
      clinicalNotes,
      warnings
    };
  };

  const handleConvert = () => {
    if (!validateInputs()) return;
    const conversionResult = calculateConversion();
    setResult(conversionResult);
  };

  const resetConverter = () => {
    setFromCorticosteroid(null);
    setToCorticosteroid(null);
    setDose('');
    setResult(null);
    setError('');
  };

  const swapCorticosteroids = () => {
    const temp = fromCorticosteroid;
    setFromCorticosteroid(toCorticosteroid);
    setToCorticosteroid(temp);
    setResult(null);
    setError('');
  };

  const renderCorticosteroidSelector = (
    title: string,
    selectedCorticosteroid: Corticosteroid | null,
    onSelect: (corticosteroid: Corticosteroid) => void,
    excludeId?: string
  ) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>{title}</Text>
      <View style={styles.corticosteroidGrid}>
        {corticosteroids
          .filter(c => c.id !== excludeId)
          .map((corticosteroid) => (
          <TouchableOpacity
            key={corticosteroid.id}
            style={[
              styles.corticosteroidCard,
              selectedCorticosteroid?.id === corticosteroid.id && styles.corticosteroidCardSelected
            ]}
            onPress={() => onSelect(corticosteroid)}
          >
            <Text style={[
              styles.corticosteroidName,
              selectedCorticosteroid?.id === corticosteroid.id && styles.corticosteroidNameSelected
            ]}>
              {corticosteroid.name}
            </Text>
            <Text style={styles.corticosteroidDose}>
              {corticosteroid.equivalentDose} mg
            </Text>
            <Text style={styles.corticosteroidPotency}>
              Potência: {corticosteroid.antiInflammatoryPotency}x
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Conversor de Corticoides" type="converter" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Pill size={20} color="#9333EA" /> Conversor de Doses de Corticoides
            </Text>
            <Text style={styles.infoText}>
              Converta doses entre diferentes corticosteroides com base na equivalência anti-inflamatória. 
              As conversões são aproximadas e devem ser ajustadas conforme resposta clínica individual.
            </Text>
          </View>

          {!result ? (
            <>
              {/* From Corticosteroid */}
              {renderCorticosteroidSelector(
                'Corticoide de Origem',
                fromCorticosteroid,
                setFromCorticosteroid,
                toCorticosteroid?.id
              )}

              {/* Dose Input */}
              <View style={styles.doseContainer}>
                <Text style={styles.doseLabel}>Dose Atual (mg)</Text>
                <TextInput
                  style={[styles.doseInput, error && styles.doseInputError]}
                  placeholder="Ex: 20"
                  keyboardType="decimal-pad"
                  value={dose}
                  onChangeText={setDose}
                />
              </View>

              {/* Swap Button */}
              {fromCorticosteroid && toCorticosteroid && (
                <View style={styles.swapContainer}>
                  <TouchableOpacity
                    style={styles.swapButton}
                    onPress={swapCorticosteroids}
                  >
                    <ArrowLeftRight size={24} color={theme.colors.calculator} />
                    <Text style={styles.swapButtonText}>Trocar</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* To Corticosteroid */}
              {renderCorticosteroidSelector(
                'Corticoide de Destino',
                toCorticosteroid,
                setToCorticosteroid,
                fromCorticosteroid?.id
              )}

              {/* Error Message */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Convert Button */}
              <TouchableOpacity
                style={[
                  styles.convertButton,
                  (!fromCorticosteroid || !toCorticosteroid || !dose) && styles.convertButtonDisabled
                ]}
                onPress={handleConvert}
                disabled={!fromCorticosteroid || !toCorticosteroid || !dose}
              >
                <ArrowLeftRight size={20} color="white" />
                <Text style={styles.convertButtonText}>Converter Dose</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.resultContainer}>
              {/* Conversion Result */}
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                      <Pill size={32} color="#9333EA" />
                  <Text style={styles.resultTitle}>Resultado da Conversão</Text>
                </View>
                <View style={styles.resultContent}>
                  <View style={styles.conversionRow}>
                    <Text style={styles.fromText}>
                      {result.fromDose} mg de {result.fromCorticosteroid.name}
                    </Text>
                      <ArrowLeftRight size={20} color="#9333EA" />
                    <Text style={styles.toText}>
                      {result.convertedDose.toFixed(1)} mg de {result.toCorticosteroid.name}
                    </Text>
                  </View>
                  <Text style={styles.conversionFactorText}>
                    Fator de conversão: {result.conversionFactor.toFixed(3)}
                  </Text>
                </View>
              </View>

              {/* Clinical Notes */}
              {result.clinicalNotes.length > 0 && (
                <View style={styles.clinicalNotesCard}>
                  <Text style={styles.clinicalNotesTitle}>
                      <Info size={20} color="#9333EA" /> Observações Clínicas
                  </Text>
                  {result.clinicalNotes.map((note, index) => (
                    <Text key={index} style={styles.clinicalNoteText}>
                      • {note}
                    </Text>
                  ))}
                </View>
              )}

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <View style={styles.warningsCard}>
                  <Text style={styles.warningsTitle}>
                    <AlertTriangle size={20} color="#FF5722" /> Avisos Importantes
                  </Text>
                  {result.warnings.map((warning, index) => (
                    <Text key={index} style={styles.warningText}>
                      ⚠️ {warning}
                    </Text>
                  ))}
                </View>
              )}

              {/* Comparison Table */}
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonTitle}>
                  <Pill size={20} color="#4CAF50" /> Comparação Detalhada
                </Text>
                <View style={styles.comparisonTable}>
                  <View style={styles.comparisonHeader}>
                    <Text style={styles.comparisonHeaderText}>Propriedade</Text>
                    <Text style={styles.comparisonHeaderText}>{result.fromCorticosteroid.name}</Text>
                    <Text style={styles.comparisonHeaderText}>{result.toCorticosteroid.name}</Text>
                  </View>
                  <View style={styles.comparisonRow}>
                    <Text style={styles.comparisonLabel}>Dose equivalente</Text>
                    <Text style={styles.comparisonValue}>{result.fromCorticosteroid.equivalentDose} mg</Text>
                    <Text style={styles.comparisonValue}>{result.toCorticosteroid.equivalentDose} mg</Text>
                  </View>
                  <View style={styles.comparisonRow}>
                    <Text style={styles.comparisonLabel}>Meia-vida</Text>
                    <Text style={styles.comparisonValue}>{result.fromCorticosteroid.halfLife}</Text>
                    <Text style={styles.comparisonValue}>{result.toCorticosteroid.halfLife}</Text>
                  </View>
                  <View style={styles.comparisonRow}>
                    <Text style={styles.comparisonLabel}>Potência anti-inflamatória</Text>
                    <Text style={styles.comparisonValue}>{result.fromCorticosteroid.antiInflammatoryPotency}x</Text>
                    <Text style={styles.comparisonValue}>{result.toCorticosteroid.antiInflammatoryPotency}x</Text>
                  </View>
                  <View style={styles.comparisonRow}>
                    <Text style={styles.comparisonLabel}>Atividade mineralocorticoide</Text>
                    <Text style={styles.comparisonValue}>{result.fromCorticosteroid.mineralocorticoidActivity}</Text>
                    <Text style={styles.comparisonValue}>{result.toCorticosteroid.mineralocorticoidActivity}</Text>
                  </View>
                </View>
              </View>

              {/* General Notes */}
              <View style={styles.generalNotesCard}>
                <Text style={styles.generalNotesTitle}>
                  <Info size={20} color="#4CAF50" /> Notas Gerais
                </Text>
                <Text style={styles.generalNotesText}>
                  • As equivalências são aproximadas e baseadas na potência anti-inflamatória{'\n'}
                  • Ajustes individuais podem ser necessários conforme resposta clínica{'\n'}
                  • Considerar diferenças na meia-vida para ajustar frequência de administração{'\n'}
                  • Monitorar efeitos adversos durante a transição entre corticoides{'\n'}
                  • Em casos de insuficiência adrenal, considerar suplementação mineralocorticoide
                </Text>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetConverter}
              >
                <RotateCcw size={20} color="white" />
                <Text style={styles.resetButtonText}>Nova Conversão</Text>
              </TouchableOpacity>
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
  infoCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#9333EA',
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#9333EA',
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  selectorContainer: {
    marginBottom: theme.spacing.xl,
  },
  selectorTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  corticosteroidGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  corticosteroidCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '48%',
    marginBottom: theme.spacing.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  corticosteroidCardSelected: {
    borderColor: '#9333EA',
    backgroundColor: '#F3E8FF',
    borderWidth: 2,
  },
  corticosteroidName: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  corticosteroidNameSelected: {
    color: '#9333EA',
  },
  corticosteroidDose: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  corticosteroidPotency: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  doseContainer: {
    marginBottom: theme.spacing.lg,
  },
  doseLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  doseInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
  },
  doseInputError: {
    borderColor: theme.colors.error,
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#9333EA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  swapButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#9333EA',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    textAlign: 'center',
  },
  convertButton: {
    backgroundColor: '#9333EA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  convertButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
  },
  convertButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  resultContainer: {
    gap: theme.spacing.lg,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: '#9333EA',
    overflow: 'hidden',
  },
  resultHeader: {
    backgroundColor: '#9333EA',
    padding: theme.spacing.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  resultTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  resultContent: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fromText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    textAlign: 'center',
  },
  toText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#9333EA',
    textAlign: 'center',
  },
  conversionFactorText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  clinicalNotesCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#9333EA',
  },
  clinicalNotesTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#9333EA',
    marginBottom: theme.spacing.md,
  },
  clinicalNoteText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  warningsCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  warningsTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF5722',
    marginBottom: theme.spacing.md,
  },
  warningText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  comparisonCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  comparisonTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.md,
  },
  comparisonTable: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  comparisonHeader: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E8',
    padding: theme.spacing.sm,
  },
  comparisonHeaderText: {
    flex: 1,
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  comparisonLabel: {
    flex: 1,
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    textAlign: 'center',
  },
  comparisonValue: {
    flex: 1,
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    textAlign: 'center',
  },
  generalNotesCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  generalNotesTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.md,
  },
  generalNotesText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: '#9333EA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  resetButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
});