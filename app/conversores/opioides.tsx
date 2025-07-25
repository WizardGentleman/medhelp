import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Pill, ArrowLeftRight, Info, TriangleAlert as AlertTriangle, RotateCcw, Activity } from 'lucide-react-native';

interface Opioid {
  id: string;
  name: string;
  routes: {
    oral?: {
      equivalentDose: number; // mg equivalent to 10mg oral morphine
      bioavailability: number;
      duration: string;
      onset: string;
    };
    iv?: {
      equivalentDose: number; // mg equivalent to 3mg IV morphine
      duration: string;
      onset: string;
    };
  };
  specialConsiderations?: string[];
  contraindications?: string[];
}

interface ConversionResult {
  fromOpioid: Opioid;
  toOpioid: Opioid;
  fromRoute: 'oral' | 'iv';
  toRoute: 'oral' | 'iv';
  fromDose: number;
  convertedDose: number;
  conversionFactor: number;
  clinicalNotes: string[];
  warnings: string[];
  dosageRecommendations: string[];
}

const opioids: Opioid[] = [
  {
    id: 'morfina',
    name: 'Morfina',
    routes: {
      oral: {
        equivalentDose: 10,
        bioavailability: 30,
        duration: '4-6h',
        onset: '30-60min'
      },
      iv: {
        equivalentDose: 3,
        duration: '3-4h',
        onset: '5-10min'
      }
    },
    specialConsiderations: [
      'Padrão-ouro para comparação de opióides',
      'Metabolismo hepático com metabólitos ativos',
      'Ajuste necessário em insuficiência renal'
    ]
  },
  {
    id: 'codeina',
    name: 'Codeína',
    routes: {
      oral: {
        equivalentDose: 60,
        bioavailability: 60,
        duration: '4-6h',
        onset: '30-60min'
      }
    },
    specialConsiderations: [
      'Pró-droga convertida em morfina pelo CYP2D6',
      'Eficácia variável devido ao polimorfismo genético',
      'Contraindicada em crianças < 12 anos para tosse/dor pós-operatória'
    ],
    contraindications: [
      'Crianças < 12 anos (tosse/dor pós-operatória)',
      'Amamentação',
      'Metabolizadores ultrarrápidos do CYP2D6'
    ]
  },
  {
    id: 'tramadol',
    name: 'Tramadol',
    routes: {
      oral: {
        equivalentDose: 50,
        bioavailability: 75,
        duration: '4-6h',
        onset: '30-60min'
      },
      iv: {
        equivalentDose: 30,
        duration: '4-6h',
        onset: '10-20min'
      }
    },
    specialConsiderations: [
      'Mecanismo duplo: opióide + inibição recaptação serotonina/noradrenalina',
      'Menor potencial de dependência',
      'Risco de síndrome serotoninérgica'
    ],
    contraindications: [
      'Uso concomitante com IMAOs',
      'História de convulsões',
      'Intoxicação aguda por álcool/hipnóticos'
    ]
  },
  {
    id: 'oxicodona',
    name: 'Oxicodona',
    routes: {
      oral: {
        equivalentDose: 6.7,
        bioavailability: 87,
        duration: '4-6h',
        onset: '30-60min'
      }
    },
    specialConsiderations: [
      'Alta biodisponibilidade oral',
      'Metabolismo principalmente hepático',
      'Formulações de liberação controlada disponíveis'
    ]
  },
  {
    id: 'fentanil',
    name: 'Fentanil',
    routes: {
      iv: {
        equivalentDose: 0.03,
        duration: '30-60min',
        onset: '1-3min'
      }
    },
    specialConsiderations: [
      'Altamente lipofílico - início rápido',
      'Duração curta por redistribuição',
      'Acúmulo em tecido adiposo com doses repetidas',
      'Disponível em adesivos transdérmicos'
    ],
    contraindications: [
      'Dor aguda (adesivos)',
      'Pacientes não tolerantes a opióides (adesivos)'
    ]
  },
  {
    id: 'metadona',
    name: 'Metadona',
    routes: {
      oral: {
        equivalentDose: 3,
        bioavailability: 85,
        duration: '8-12h',
        onset: '30-60min'
      },
      iv: {
        equivalentDose: 1.5,
        duration: '8-12h',
        onset: '10-20min'
      }
    },
    specialConsiderations: [
      'Meia-vida longa e variável (8-59h)',
      'Risco de acúmulo e overdose tardia',
      'Atividade antagonista NMDA',
      'Conversão complexa - consultar especialista'
    ],
    contraindications: [
      'QT prolongado',
      'Uso de medicações que prolongam QT'
    ]
  },
  {
    id: 'buprenorfina',
    name: 'Buprenorfina',
    routes: {
      iv: {
        equivalentDose: 0.1,
        duration: '6-8h',
        onset: '5-15min'
      }
    },
    specialConsiderations: [
      'Agonista parcial μ-opióide',
      'Efeito teto para depressão respiratória',
      'Difícil reversão com naloxona',
      'Sublingual disponível'
    ]
  },
  {
    id: 'hidrocodona',
    name: 'Hidrocodona',
    routes: {
      oral: {
        equivalentDose: 5,
        bioavailability: 85,
        duration: '4-6h',
        onset: '30-60min'
      }
    },
    specialConsiderations: [
      'Frequentemente combinada com paracetamol',
      'Metabolismo pelo CYP2D6',
      'Formulações de liberação controlada disponíveis'
    ]
  }
];

export default function OpioidesScreen() {
  const [fromOpioid, setFromOpioid] = useState<Opioid | null>(null);
  const [toOpioid, setToOpioid] = useState<Opioid | null>(null);
  const [fromRoute, setFromRoute] = useState<'oral' | 'iv' | null>(null);
  const [toRoute, setToRoute] = useState<'oral' | 'iv' | null>(null);
  const [dose, setDose] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState('');

  const validateInputs = (): boolean => {
    if (!fromOpioid) {
      setError('Selecione o opióide de origem');
      return false;
    }
    if (!toOpioid) {
      setError('Selecione o opióide de destino');
      return false;
    }
    if (fromOpioid.id === toOpioid.id && fromRoute === toRoute) {
      setError('Selecione opióides ou vias diferentes para conversão');
      return false;
    }
    if (!fromRoute) {
      setError('Selecione a via de administração de origem');
      return false;
    }
    if (!toRoute) {
      setError('Selecione a via de administração de destino');
      return false;
    }
    if (!fromOpioid.routes[fromRoute]) {
      setError(`${fromOpioid.name} não está disponível na via ${fromRoute === 'oral' ? 'oral' : 'intravenosa'}`);
      return false;
    }
    if (!toOpioid.routes[toRoute]) {
      setError(`${toOpioid.name} não está disponível na via ${toRoute === 'oral' ? 'oral' : 'intravenosa'}`);
      return false;
    }
    
    const doseValue = parseFloat(dose.replace(',', '.'));
    if (!dose) {
      setError('Digite a dose a ser convertida');
      return false;
    }
    if (isNaN(doseValue) || doseValue <= 0 || doseValue > 10000) {
      setError('Dose deve estar entre 0,1 e 10000 mg');
      return false;
    }

    setError('');
    return true;
  };

  const calculateConversion = (): ConversionResult => {
    const doseValue = parseFloat(dose.replace(',', '.'));
    
    // Get reference doses for conversion
    const fromRouteData = fromOpioid!.routes[fromRoute!]!;
    const toRouteData = toOpioid!.routes[toRoute!]!;
    
    // Convert to morphine equivalent first, then to target opioid
    let morphineEquivalent: number;
    
    if (fromRoute === 'oral') {
      // Convert from oral dose to oral morphine equivalent
      morphineEquivalent = (doseValue / fromRouteData.equivalentDose) * 10;
    } else {
      // Convert from IV dose to IV morphine equivalent
      morphineEquivalent = (doseValue / fromRouteData.equivalentDose) * 3;
      // If target is oral, convert IV morphine to oral morphine (1:3 ratio)
      if (toRoute === 'oral') {
        morphineEquivalent = morphineEquivalent * 3;
      }
    }
    
    // If converting from oral to IV, convert oral morphine to IV morphine
    if (fromRoute === 'oral' && toRoute === 'iv') {
      morphineEquivalent = morphineEquivalent / 3;
    }
    
    // Convert morphine equivalent to target opioid
    let convertedDose: number;
    if (toRoute === 'oral') {
      convertedDose = (morphineEquivalent / 10) * toRouteData.equivalentDose;
    } else {
      convertedDose = (morphineEquivalent / 3) * toRouteData.equivalentDose;
    }
    
    const conversionFactor = convertedDose / doseValue;

    // Generate clinical notes
    const clinicalNotes: string[] = [];
    const warnings: string[] = [];
    const dosageRecommendations: string[] = [];

    // Route-specific notes
    if (fromRoute !== toRoute) {
      if (fromRoute === 'oral' && toRoute === 'iv') {
        clinicalNotes.push('Conversão de via oral para intravenosa - início de ação mais rápido');
        warnings.push('⚠️ Via IV tem início mais rápido - monitorar depressão respiratória');
      } else {
        clinicalNotes.push('Conversão de via intravenosa para oral - início de ação mais lento');
        clinicalNotes.push('Considerar sobreposição temporária das vias durante transição');
      }
    }

    // Bioavailability considerations
    if (fromRoute === 'oral' && toRoute === 'oral') {
      const fromBio = fromRouteData.bioavailability;
      const toBio = toRouteData.bioavailability;
      if (Math.abs(fromBio - toBio) > 20) {
        clinicalNotes.push(
          `Diferença significativa na biodisponibilidade: ${fromOpioid!.name} (${fromBio}%) → ${toOpioid!.name} (${toBio}%)`
        );
      }
    }

    // Duration and onset differences
    clinicalNotes.push(
      `Duração: ${fromOpioid!.name} (${fromRouteData.duration}) → ${toOpioid!.name} (${toRouteData.duration})`
    );
    clinicalNotes.push(
      `Início de ação: ${fromOpioid!.name} (${fromRouteData.onset}) → ${toOpioid!.name} (${toRouteData.onset})`
    );

    // Special considerations for specific opioids
    if (toOpioid!.specialConsiderations) {
      clinicalNotes.push(...toOpioid!.specialConsiderations);
    }

    // Dosage recommendations
    if (convertedDose < 0.1) {
      warnings.push('⚠️ Dose convertida muito baixa - verificar cálculo e viabilidade clínica');
      dosageRecommendations.push('Considerar dose mínima efetiva do medicamento de destino');
    }

    if (convertedDose > 100) {
      warnings.push('⚠️ Dose convertida alta - considerar redução de 25-50% inicialmente');
      dosageRecommendations.push('Titulação gradual recomendada');
    }

    // Cross-tolerance considerations
    if (fromOpioid!.id !== 'morfina' && toOpioid!.id !== 'morfina') {
      warnings.push('⚠️ Tolerância cruzada incompleta entre opióides - reduzir dose inicial em 25-50%');
    }

    // Methadone special warnings
    if (toOpioid!.id === 'metadona') {
      warnings.push('🚨 METADONA: Conversão complexa - consultar especialista em dor/cuidados paliativos');
      warnings.push('🚨 Risco de acúmulo devido à meia-vida longa e variável');
      dosageRecommendations.push('Iniciar com dose baixa e titular lentamente');
      dosageRecommendations.push('Monitorar por 5-7 dias antes de ajustes');
    }

    if (fromOpioid!.id === 'metadona') {
      warnings.push('🚨 Conversão DE metadona é complexa - consultar especialista');
    }

    // Fentanyl warnings
    if (toOpioid!.id === 'fentanil') {
      warnings.push('⚠️ Fentanil: Potência alta - risco aumentado de overdose');
      dosageRecommendations.push('Monitorização contínua recomendada');
    }

    // General safety recommendations
    dosageRecommendations.push(
      'Iniciar com 75% da dose calculada em pacientes idosos',
      'Monitorar função respiratória e nível de consciência',
      'Ter naloxona disponível',
      'Reavaliar eficácia e efeitos adversos em 24-48h'
    );

    // Contraindications
    if (toOpioid!.contraindications && toOpioid!.contraindications.length > 0) {
      warnings.push('⚠️ Verificar contraindicações específicas do medicamento de destino');
    }

    return {
      fromOpioid: fromOpioid!,
      toOpioid: toOpioid!,
      fromRoute: fromRoute!,
      toRoute: toRoute!,
      fromDose: doseValue,
      convertedDose,
      conversionFactor,
      clinicalNotes,
      warnings,
      dosageRecommendations
    };
  };

  const handleConvert = () => {
    if (!validateInputs()) return;
    const conversionResult = calculateConversion();
    setResult(conversionResult);
  };

  const resetConverter = () => {
    setFromOpioid(null);
    setToOpioid(null);
    setFromRoute(null);
    setToRoute(null);
    setDose('');
    setResult(null);
    setError('');
  };

  const getAvailableRoutes = (opioid: Opioid | null) => {
    if (!opioid) return [];
    return Object.keys(opioid.routes) as ('oral' | 'iv')[];
  };

  const renderRouteButton = (
    route: 'oral' | 'iv',
    selectedRoute: 'oral' | 'iv' | null,
    onSelect: (route: 'oral' | 'iv') => void,
    available: boolean = true
  ) => (
    <TouchableOpacity
      style={[
        styles.routeButton,
        selectedRoute === route && styles.routeButtonSelected,
        !available && styles.routeButtonDisabled
      ]}
      onPress={() => available && onSelect(route)}
      disabled={!available}
    >
      <Text style={[
        styles.routeButtonText,
        selectedRoute === route && styles.routeButtonTextSelected,
        !available && styles.routeButtonTextDisabled
      ]}>
        {route === 'oral' ? 'Oral' : 'Intravenosa'}
      </Text>
    </TouchableOpacity>
  );

  const renderOpioidSelector = (
    title: string,
    selectedOpioid: Opioid | null,
    onSelect: (opioid: Opioid) => void
  ) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>{title}</Text>
      <View style={styles.opioidsGrid}>
        {opioids
          .map((opioid) => (
          <TouchableOpacity
            key={opioid.id}
            style={[
              styles.opioidCard,
              selectedOpioid?.id === opioid.id && styles.opioidCardSelected
            ]}
            onPress={() => onSelect(opioid)}
          >
            <Text style={[
              styles.opioidName,
              selectedOpioid?.id === opioid.id && styles.opioidNameSelected
            ]}>
              {opioid.name}
            </Text>
            <View style={styles.routesInfo}>
              {opioid.routes.oral && (
                <Text style={styles.routeInfo}>Oral: {opioid.routes.oral.equivalentDose}mg</Text>
              )}
              {opioid.routes.iv && (
                <Text style={styles.routeInfo}>IV: {opioid.routes.iv.equivalentDose}mg</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Conversor de Opióides" type="converter" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Pill size={20} color="#9333EA" /> Conversor de Doses de Opióides
            </Text>
            <Text style={styles.infoText}>
              Converta doses entre diferentes opióides e vias de administração. As conversões são baseadas em 
              equivalências analgésicas e devem ser ajustadas conforme tolerância individual e resposta clínica.
            </Text>
          </View>

          {!result ? (
            <>
              {/* From Opioid */}
              {renderOpioidSelector(
                'Opióide de Origem',
                fromOpioid,
                (opioid) => {
                  setFromOpioid(opioid);
                  setFromRoute(null);
                }
              )}

              {/* From Route */}
              {fromOpioid && (
                <View style={styles.routeContainer}>
                  <Text style={styles.routeLabel}>Via de Administração (Origem)</Text>
                  <View style={styles.routeButtons}>
                    {renderRouteButton(
                      'oral',
                      fromRoute,
                      setFromRoute,
                      getAvailableRoutes(fromOpioid).includes('oral')
                    )}
                    {renderRouteButton(
                      'iv',
                      fromRoute,
                      setFromRoute,
                      getAvailableRoutes(fromOpioid).includes('iv')
                    )}
                  </View>
                </View>
              )}

              {/* Dose Input */}
              <View style={styles.doseContainer}>
                <Text style={styles.doseLabel}>Dose Atual (mg)</Text>
                <TextInput
                  style={[styles.doseInput, error && styles.doseInputError]}
                  placeholder="Ex: 10"
                  keyboardType="decimal-pad"
                  value={dose}
                  onChangeText={setDose}
                />
              </View>

              {/* Swap Button */}
              {fromOpioid && toOpioid && (
                <View style={styles.swapContainer}>
                  <TouchableOpacity
                    style={styles.swapButton}
                    onPress={() => {
                      const tempOpioid = fromOpioid;
                      const tempRoute = fromRoute;
                      setFromOpioid(toOpioid);
                      setToOpioid(tempOpioid);
                      setFromRoute(toRoute);
                      setToRoute(tempRoute);
                      setResult(null);
                      setError('');
                    }}
                  >
                    <ArrowLeftRight size={24} color="#9333EA" />
                    <Text style={styles.swapButtonText}>Trocar</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* To Opioid */}
              {renderOpioidSelector(
                'Opióide de Destino',
                toOpioid,
                (opioid) => {
                  setToOpioid(opioid);
                  setToRoute(null);
                }
              )}

              {/* To Route */}
              {toOpioid && (
                <View style={styles.routeContainer}>
                  <Text style={styles.routeLabel}>Via de Administração (Destino)</Text>
                  <View style={styles.routeButtons}>
                    {renderRouteButton(
                      'oral',
                      toRoute,
                      setToRoute,
                      getAvailableRoutes(toOpioid).includes('oral')
                    )}
                    {renderRouteButton(
                      'iv',
                      toRoute,
                      setToRoute,
                      getAvailableRoutes(toOpioid).includes('iv')
                    )}
                  </View>
                </View>
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
                  (!fromOpioid || !toOpioid || !fromRoute || !toRoute || !dose) && styles.convertButtonDisabled
                ]}
                onPress={handleConvert}
                disabled={!fromOpioid || !toOpioid || !fromRoute || !toRoute || !dose}
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
                      {result.fromDose} mg de {result.fromOpioid.name} ({result.fromRoute === 'oral' ? 'oral' : 'IV'})
                    </Text>
                    <ArrowLeftRight size={20} color="#9333EA" />
                    <Text style={styles.toText}>
                      {result.convertedDose.toFixed(2)} mg de {result.toOpioid.name} ({result.toRoute === 'oral' ? 'oral' : 'IV'})
                    </Text>
                  </View>
                  <Text style={styles.conversionFactorText}>
                    Fator de conversão: {result.conversionFactor.toFixed(3)}
                  </Text>
                </View>
              </View>

              {/* Dosage Recommendations */}
              <View style={styles.dosageCard}>
                <Text style={styles.dosageTitle}>
                  <Activity size={20} color="#4CAF50" /> Recomendações de Dosagem
                </Text>
                {result.dosageRecommendations.map((recommendation, index) => (
                  <Text key={index} style={styles.dosageText}>
                    • {recommendation}
                  </Text>
                ))}
              </View>

              {/* Clinical Notes */}
              {result.clinicalNotes.length > 0 && (
                <View style={styles.clinicalNotesCard}>
                  <Text style={styles.clinicalNotesTitle}>
                    <Info size={20} color="#9333EA" /> Considerações Clínicas
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
                      {warning}
                    </Text>
                  ))}
                </View>
              )}

              {/* Contraindications */}
              {result.toOpioid.contraindications && result.toOpioid.contraindications.length > 0 && (
                <View style={styles.contraindicationsCard}>
                  <Text style={styles.contraindicationsTitle}>
                    <AlertTriangle size={20} color="#D32F2F" /> Contraindicações - {result.toOpioid.name}
                  </Text>
                  {result.toOpioid.contraindications.map((contraindication, index) => (
                    <Text key={index} style={styles.contraindicationText}>
                      • {contraindication}
                    </Text>
                  ))}
                </View>
              )}

              {/* General Safety Notes */}
              <View style={styles.safetyCard}>
                <Text style={styles.safetyTitle}>
                  <AlertTriangle size={20} color="#FF9800" /> Segurança Geral
                </Text>
                <Text style={styles.safetyText}>
                  • Conversões são aproximadas - ajustar conforme resposta individual{'\n'}
                  • Tolerância cruzada entre opióides é incompleta{'\n'}
                  • Monitorar sinais vitais, especialmente função respiratória{'\n'}
                  • Considerar fatores individuais: idade, função renal/hepática, comorbidades{'\n'}
                  • Documentar conversão e resposta clínica{'\n'}
                  • Ter naloxona disponível para reversão de overdose
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
  opioidsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  opioidCard: {
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
  opioidCardSelected: {
    borderColor: '#9333EA',
    backgroundColor: '#F3E8FF',
    borderWidth: 2,
  },
  opioidName: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  opioidNameSelected: {
    color: '#9333EA',
  },
  routesInfo: {
    alignItems: 'center',
  },
  routeInfo: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  routeContainer: {
    marginBottom: theme.spacing.lg,
  },
  routeLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  routeButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  routeButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  routeButtonSelected: {
    backgroundColor: '#9333EA',
    borderColor: '#9333EA',
  },
  routeButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  routeButtonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  routeButtonTextSelected: {
    color: 'white',
  },
  routeButtonTextDisabled: {
    color: '#BDBDBD',
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
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    textAlign: 'center',
  },
  toText: {
    fontSize: theme.fontSize.sm,
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
  dosageCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  dosageTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.md,
  },
  dosageText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
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
  contraindicationsCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
  contraindicationsTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#D32F2F',
    marginBottom: theme.spacing.md,
  },
  contraindicationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  safetyCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  safetyTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF9800',
    marginBottom: theme.spacing.md,
  },
  safetyText: {
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