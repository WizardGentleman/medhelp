import { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Modal, Animated, Dimensions } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Clock, Play, Pause, RotateCcw, Heart, Activity, Syringe, CircleAlert as AlertCircle, TriangleAlert as AlertTriangle, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react-native';

type ResuscitationStep = 'initial' | 'assessment' | 'rhythm' | 'intervention';
type RhythmType = 'vf-vt' | 'asystole-pea' | null;
type MedicationType = 'epinephrine' | 'amiodarone' | 'lidocaine';

interface Intervention {
  timestamp: Date;
  elapsedTime: string;
  type: 'compression' | 'shock' | 'epinephrine' | 'amiodarone' | 'lidocaine' | 'rhythm-check';
  details?: string;
}

export default function RCPScreen() {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [currentStep, setCurrentStep] = useState<ResuscitationStep>('initial');
  const [rhythmType, setRhythmType] = useState<RhythmType>(null);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [nextEpinephrine, setNextEpinephrine] = useState<Date | null>(null);
  const [nextAntiarrhythmic, setNextAntiarrhythmic] = useState<Date | null>(null);
  const [nextRhythmCheck, setNextRhythmCheck] = useState<Date | null>(null);
  const [rhythmCheckCountdown, setRhythmCheckCountdown] = useState(120);
  const [lastMedicationType, setLastMedicationType] = useState<MedicationType | null>(null);
  const [showRhythmModal, setShowRhythmModal] = useState(false);
  const [isRhythmCheckDue, setIsRhythmCheckDue] = useState(false);
  const [showReversibleCauses, setShowReversibleCauses] = useState(false);
  const [showRCPQualityModal, setShowRCPQualityModal] = useState(false);
  const [showPharmacologyModal, setShowPharmacologyModal] = useState(false);
  const [epinephrineCountdownMin, setEpinephrineCountdownMin] = useState(0); // 3 minutos - tempo mínimo
  const [epinephrineCountdownMax, setEpinephrineCountdownMax] = useState(0); // 5 minutos - tempo máximo
  const [isEpinephrineDue, setIsEpinephrineDue] = useState(false);
  const [isShockUrgent, setIsShockUrgent] = useState(false);
  const [previousRhythmType, setPreviousRhythmType] = useState<RhythmType>(null);
  const [showPostPCRModal, setShowPostPCRModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedCauses, setExpandedCauses] = useState<{[key: string]: boolean}>({});
  const [isFirstAsystoleSelection, setIsFirstAsystoleSelection] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const epinephrineAnim = useRef(new Animated.Value(1)).current;
  const shockAnim = useRef(new Animated.Value(1)).current;

  // Obter dimensões da tela para responsividade
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 400;
  const isMediumScreen = screenWidth >= 400 && screenWidth < 600;
  const isLargeScreen = screenWidth >= 600;

  useEffect(() => {
    if (Platform.OS === 'web') {
      audioRef.current = new Audio('/alert.mp3');
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        setRhythmCheckCountdown((prev) => {
          if (prev <= 1) {
            setIsRhythmCheckDue(true);
            if (Platform.OS === 'web' && audioRef.current) {
              audioRef.current.play().catch(() => {});
            }
            startPulseAnimation();
            return 0;
          }
          return prev - 1;
        });
        
        // Epinephrine countdown for both rhythm types
        if (rhythmType === 'asystole-pea' || rhythmType === 'vf-vt') {
          // Countdown mínimo (3 minutos)
          setEpinephrineCountdownMin((prev) => {
            if (prev <= 1 && prev > 0) {
              setIsEpinephrineDue(true);
              if (Platform.OS === 'web' && audioRef.current) {
                audioRef.current.play().catch(() => {});
              }
              startEpinephrineAnimation();
              return 0;
            }
            return prev > 0 ? prev - 1 : prev;
          });
          
          // Countdown máximo (5 minutos)
          setEpinephrineCountdownMax((prev) => {
            return prev > 0 ? prev - 1 : prev;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, rhythmType]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startEpinephrineAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(epinephrineAnim, {
          toValue: 1.1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(epinephrineAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startShockAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shockAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(shockAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startResuscitation = () => {
    setIsActive(true);
    setCurrentStep('assessment');
    addIntervention('compression', 'Início das compressões');
    setNextRhythmCheck(new Date(Date.now() + 120000));
  };

  const resetResuscitation = () => {
    setIsActive(false);
    setTime(0);
    setCurrentStep('initial');
    setRhythmType(null);
    setInterventions([]);
    setNextEpinephrine(null);
    setNextAntiarrhythmic(null);
    setNextRhythmCheck(null);
    setRhythmCheckCountdown(120);
    setLastMedicationType(null);
    setIsRhythmCheckDue(false);
    setEpinephrineCountdownMin(0);
    setEpinephrineCountdownMax(0);
    setIsEpinephrineDue(false);
    setIsShockUrgent(false);
    setPreviousRhythmType(null);
    setIsFirstAsystoleSelection(false);
    pulseAnim.setValue(1);
    epinephrineAnim.setValue(1);
    shockAnim.setValue(1);
  };

  const addIntervention = (type: Intervention['type'], details?: string) => {
    const newIntervention = {
      timestamp: new Date(),
      elapsedTime: formatTime(time),
      type,
      details,
    };
    setInterventions((prev) => [...prev, newIntervention]);

    if (type === 'epinephrine') {
      const nextDose = new Date();
      nextDose.setMinutes(nextDose.getMinutes() + 3);
      setNextEpinephrine(nextDose);
      setLastMedicationType('epinephrine');
      
      // For both rhythm types, start both countdown timers
      if (rhythmType === 'asystole-pea' || rhythmType === 'vf-vt') {
        setEpinephrineCountdownMin(180); // 3 minutes = 180 seconds
        setEpinephrineCountdownMax(300); // 5 minutes = 300 seconds
        setIsEpinephrineDue(false);
        setIsFirstAsystoleSelection(false); // Reset first selection flag after epinephrine is given
        epinephrineAnim.setValue(1);
      }
    } else if (type === 'amiodarone' || type === 'lidocaine') {
      const nextDose = new Date();
      nextDose.setMinutes(nextDose.getMinutes() + 5);
      setNextAntiarrhythmic(nextDose);
      setLastMedicationType(type);
    }
  };

  const handleShock = () => {
    addIntervention('shock');
    setRhythmCheckCountdown(120);
    const nextCheck = new Date();
    nextCheck.setMinutes(nextCheck.getMinutes() + 2);
    setNextRhythmCheck(nextCheck);
    
    // Reset urgent shock state after shock is applied
    setIsShockUrgent(false);
    shockAnim.setValue(1);
  };

  const handleRhythmCheck = () => {
    setShowRhythmModal(true);
    setIsRhythmCheckDue(false);
    pulseAnim.setValue(1);
    setRhythmCheckCountdown(120);
    const nextCheck = new Date();
    nextCheck.setMinutes(nextCheck.getMinutes() + 2);
    setNextRhythmCheck(nextCheck);
  };

  const handleROSC = () => {
    // Register ROSC intervention in the timeline
    addIntervention('rhythm-check', 'RETORNO DA CIRCULAÇÃO ESPONTÂNEA detectado');
    
    // Pause timer and show modal
    setIsPaused(true);
    setShowPostPCRModal(true);
  };

  const handleRhythmSelection = (rhythm: RhythmType) => {
    setRhythmCheckCountdown(120);
    const nextCheck = new Date();
    nextCheck.setMinutes(nextCheck.getMinutes() + 2);
    setNextRhythmCheck(nextCheck);

    if (rhythm !== rhythmType) {
      // Store previous rhythm before updating
      setPreviousRhythmType(rhythmType);
      
      // Check if this is the FIRST time selecting Assistolia/AESP from initial assessment
      if (rhythmType === null && rhythm === 'asystole-pea' && currentStep === 'assessment') {
        setIsFirstAsystoleSelection(true);
        setIsEpinephrineDue(true);
        if (Platform.OS === 'web' && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
        startEpinephrineAnimation();
      }
      
      // Check if changing from asystole/PEA to VF/VT OR selecting VF/VT for first time - trigger urgent shock
      if ((rhythmType === 'asystole-pea' && rhythm === 'vf-vt') || 
          (rhythmType === null && rhythm === 'vf-vt')) {
        setIsShockUrgent(true);
        if (Platform.OS === 'web' && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
        startShockAnimation();
      } else {
        setIsShockUrgent(false);
        shockAnim.setValue(1);
      }
      
      setRhythmType(rhythm);
      setCurrentStep('intervention');
      addIntervention('rhythm-check', `Ritmo identificado: ${rhythm === 'vf-vt' ? 'FV/TV' : 'Assistolia/AESP'}`);
    } else if (rhythm === 'vf-vt' && rhythmType === 'vf-vt') {
      // If already in VF/VT and selecting VF/VT again during rhythm check - trigger urgent shock
      setIsShockUrgent(true);
      if (Platform.OS === 'web' && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      startShockAnimation();
      addIntervention('rhythm-check', 'Ritmo identificado: FV/TV (continua chocável)');
    }
    
    setShowRhythmModal(false);
  };

  const getInterventionDisplayName = (type: Intervention['type']): string => {
    const translations = {
      'shock': 'Choque',
      'epinephrine': 'Epinefrina',
      'amiodarone': 'Amiodarona',
      'lidocaine': 'Lidocaína',
      'compression': 'Compressões torácicas',
      'rhythm-check': 'Verificação do ritmo'
    };
    return translations[type] || type;
  };

  const getNextMedicationInfo = () => {
    if (rhythmType === 'vf-vt') {
      const epinephrineCount = interventions.filter(i => i.type === 'epinephrine').length;
      const amiodaroneCount = interventions.filter(i => i.type === 'amiodarone').length;
      
      // Sequence: Epinefrina > Amiodarona 300mg > Epinefrina > Amiodarona 150mg > Epinefrina > Epinefrina (always repeating)
      if (epinephrineCount === 0) {
        // First medication is always epinephrine
        return {
          type: 'epinephrine',
          name: 'Epinefrina 1mg',
          color: theme.colors.emergency
        };
      } else if (epinephrineCount === 1 && amiodaroneCount === 0) {
        // After first epinephrine, give amiodarone 300mg
        return {
          type: 'antiarrhythmic',
          name: 'Amiodarona 300mg',
          color: theme.colors.warning
        };
      } else if (epinephrineCount === 1 && amiodaroneCount === 1) {
        // After first amiodarone, give second epinephrine
        return {
          type: 'epinephrine',
          name: 'Epinefrina 1mg',
          color: theme.colors.emergency
        };
      } else if (epinephrineCount === 2 && amiodaroneCount === 1) {
        // After second epinephrine, give amiodarone 150mg
        return {
          type: 'antiarrhythmic',
          name: 'Amiodarona 150mg',
          color: theme.colors.warning
        };
      } else {
        // After second amiodarone, always epinephrine
        return {
          type: 'epinephrine',
          name: 'Epinefrina 1mg',
          color: theme.colors.emergency
        };
      }
    }
    return {
      type: 'epinephrine',
      name: 'Epinefrina 1mg',
      color: theme.colors.emergency
    };
  };

  const toggleCauseExpansion = (causeId: string) => {
    setExpandedCauses(prev => ({
      ...prev,
      [causeId]: !prev[causeId]
    }));
  };

  const renderInitialScreen = () => (
    <View style={styles.centeredContainer}>
      <TouchableOpacity
        style={styles.startButton}
        onPress={startResuscitation}
      >
        <Play color="white" size={32} />
        <Text style={styles.startButtonText}>INICIAR RCP</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAssessment = () => (
    <View style={styles.assessmentContainer}>
      <Text style={styles.sectionTitle}>Avaliação e Preparo Inicial</Text>
      
      {/* Primeira prioridade: Avaliação básica */}
      <View style={styles.checkList}>
        <Text style={styles.sectionSubtitle}>1. Avaliação (imediata):</Text>
        <Text style={styles.checkItem}>✓ Verificar responsividade</Text>
        <Text style={styles.checkItem}>✓ Verificar pulso central (&lt;10s)</Text>
        <Text style={styles.checkItem}>✓ Verificar respiração</Text>
      </View>
      
      {/* Segunda prioridade: Equipamentos essenciais */}
      <View style={styles.checkList}>
        <Text style={styles.sectionSubtitle}>2. Equipamentos (imediato):</Text>
        <Text style={styles.checkItem}>• Forneça oxigênio</Text>
        <Text style={styles.checkItem}>• Coloque o monitor/desfibrilador</Text>
      </View>
      
      <Text style={styles.instruction}>
        Após completar a avaliação e preparo, selecione o tipo de ritmo identificado:
      </Text>
      
      <View style={styles.rhythmButtons}>
        <TouchableOpacity
          style={styles.rhythmButton}
          onPress={() => handleRhythmSelection('vf-vt')}
        >
          <Activity size={24} color={theme.colors.emergency} />
          <Text style={styles.rhythmButtonText}>FV/TV</Text>
          <Text style={styles.rhythmDescription}>Ritmo Chocável</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rhythmButton}
          onPress={() => handleRhythmSelection('asystole-pea')}
        >
          <Heart size={24} color={theme.colors.emergency} />
          <Text style={styles.rhythmButtonText}>Assistolia/AESP</Text>
          <Text style={styles.rhythmDescription}>Ritmo Não-Chocável</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRhythmModal = () => (
    <Modal
      visible={showRhythmModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecione o Ritmo</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => handleRhythmSelection('vf-vt')}
          >
            <Activity size={24} color={theme.colors.emergency} />
            <Text style={styles.modalButtonText}>FV/TV (Ritmo Chocável)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => handleRhythmSelection('asystole-pea')}
          >
            <Heart size={24} color={theme.colors.emergency} />
            <Text style={styles.modalButtonText}>Assistolia/AESP (Não-Chocável)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderPostPCRModal = () => (
    <Modal
      visible={showPostPCRModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.postPCRModalContainer}>
          <ScrollView style={styles.reversibleCausesScroll}>
            <View style={[styles.modalContent, styles.reversibleCausesModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cuidados Pós-PCR</Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowPostPCRModal(false);
                  setIsPaused(false);
                }}
                style={styles.closeButton}
              >
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.postPCRSection}>
              <Text style={styles.postPCRSectionTitle}>🎯 Objetivos Imediatos</Text>
              <View style={styles.postPCRCard}>
                <Text style={styles.postPCRItem}>• Otimizar ventilação e oxigenação</Text>
                <Text style={styles.postPCRItem}>• Tratar hipotensão (PAS &lt;90 mmHg, PAM &lt;65 mmHg)</Text>
                <Text style={styles.postPCRItem}>• Realizar ECG de 12 derivações</Text>
                <Text style={styles.postPCRItem}>• Considerar causa precipitante</Text>
              </View>
            </View>

            <View style={styles.postPCRSection}>
              <Text style={styles.postPCRSectionTitle}>💨 Ventilação</Text>
              <View style={styles.postPCRCard}>
                <Text style={styles.postPCRItem}>• Iniciar com FiO₂ 100%</Text>
                <Text style={styles.postPCRItem}>• Titular para SpO₂ 94-98%</Text>
                <Text style={styles.postPCRItem}>• Manter PaCO₂ 35-45 mmHg</Text>
                <Text style={styles.postPCRItem}>• Evitar hiperventilação</Text>
              </View>
            </View>

            <View style={styles.postPCRSection}>
              <Text style={styles.postPCRSectionTitle}>❤️ Hemodinâmica</Text>
              <View style={styles.postPCRCard}>
                <Text style={styles.postPCRSubtitle}>Fluidos:</Text>
                <Text style={styles.postPCRItem}>• Cristaloides 1-2L se hipovolemia</Text>
                <Text style={styles.postPCRItem}>• Considerar ecocardiograma precoce</Text>
                
                <Text style={styles.postPCRSubtitle}>Vasopressores/Inotrópicos:</Text>
                <Text style={styles.postPCRItem}>• Noradrenalina: 0,05-0,5 mcg/kg/min</Text>
                <Text style={styles.postPCRItem}>• Dopamina: 5-10 mcg/kg/min</Text>
                <Text style={styles.postPCRItem}>• Dobutamina: 5-20 mcg/kg/min se disfunção VE</Text>
              </View>
            </View>

            <View style={styles.postPCRSection}>
              <Text style={styles.postPCRSectionTitle}>🧠 Neuroproteção</Text>
              <View style={styles.postPCRCard}>
                <Text style={styles.postPCRSubtitle}>Controle Térmico Direcionado:</Text>
                <Text style={styles.postPCRItem}>• Temperatura alvo: 32-36°C</Text>
                <Text style={styles.postPCRItem}>• Manter por 24 horas</Text>
                <Text style={styles.postPCRItem}>• Reaquecimento gradual (0,25°C/h)</Text>
                
                <Text style={styles.postPCRSubtitle}>Sedação:</Text>
                <Text style={styles.postPCRItem}>• Propofol ou midazolam</Text>
                <Text style={styles.postPCRItem}>• Fentanil para analgesia</Text>
                
                <Text style={styles.postPCRSubtitle}>Outros:</Text>
                <Text style={styles.postPCRItem}>• Evitar hiperglicemia (&gt;180 mg/dL)</Text>
                <Text style={styles.postPCRItem}>• Evitar hipoglicemia (&lt;80 mg/dL)</Text>
                <Text style={styles.postPCRItem}>• Profilaxia convulsões se indicado</Text>
              </View>
            </View>

            <View style={styles.postPCRSection}>
              <Text style={styles.postPCRSectionTitle}>🔍 Investigação Etiológica</Text>
              <View style={styles.postPCRCard}>
                <Text style={styles.postPCRItem}>• ECG: avaliar IAMCST</Text>
                <Text style={styles.postPCRItem}>• Laboratório: gasometria, eletrólitos, troponina</Text>
                <Text style={styles.postPCRItem}>• Imagem: RX tórax, TC crânio se indicado</Text>
                <Text style={styles.postPCRItem}>• Considerar cateterismo se SCA</Text>
              </View>
            </View>

            <View style={styles.postPCRSection}>
              <Text style={styles.postPCRSectionTitle}>⚡ Se IAMCST ou alta suspeita de SCA</Text>
              <View style={[styles.postPCRCard, styles.postPCRUrgent]}>
                <Text style={styles.postPCRItem}>• Cateterismo URGENTE</Text>
                <Text style={styles.postPCRItem}>• Ativar protocolo de hemodinâmica</Text>
                <Text style={styles.postPCRItem}>• Tempo porta-balão &lt;90 min</Text>
              </View>
            </View>

            <View style={styles.noteSection}>
              <Text style={styles.noteText}>
                ⚠️ Monitorização contínua: ECG, PA invasiva, SpO₂, capnografia, temperatura, débito urinário
              </Text>
            </View>
            </View>
          </ScrollView>
          
          {/* Fixed bottom button */}
          <View style={styles.fixedBottomContainer}>
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => {
                setShowPostPCRModal(false);
                // Timer permanece pausado para visualização do histórico
              }}
            >
              <Text style={styles.historyButtonText}>VER HISTÓRICO DA PCR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.returnToPCRButton}
              onPress={() => {
                setShowPostPCRModal(false);
                setIsPaused(false);
              }}
            >
              <Text style={styles.returnToPCRButtonText}>RETORNO DA PCR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderPharmacologyModal = () => (
    <Modal
      visible={showPharmacologyModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <ScrollView style={styles.reversibleCausesScroll}>
          <View style={[styles.modalContent, styles.reversibleCausesModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Doses Farmacológicas</Text>
              <TouchableOpacity 
                onPress={() => setShowPharmacologyModal(false)}
                style={styles.closeButton}
              >
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Epinefrina */}
            <View style={styles.causesSection}>
              <Text style={styles.causesSectionTitle}>💉 Epinefrina</Text>
              
              <View style={styles.causeCard}>
                <Text style={styles.causeTitle}>Administração</Text>
                <Text style={styles.causeTreatment}>
                  <Text style={styles.conductLabel}>Dose:</Text>
                  {"\n"}• Administrar 1 mg em bolus EV a cada 3–5 minutos
                  {"\n"}• Seguido de flush com 20 mL de SF 0,9%
                  
                  {"\n"}{"\n"}<Text style={styles.conductLabel}>Acesso periférico:</Text>
                  {"\n"}• Se utilizada via acesso periférico, elevar o membro após a infusão
                </Text>
              </View>
            </View>

            {/* Amiodarona - apenas para FV/TV */}
            {rhythmType === 'vf-vt' && (
              <View style={styles.causesSection}>
                <Text style={styles.causesSectionTitle}>⚡ Amiodarona</Text>
                
                <View style={styles.causeCard}>
                  <Text style={styles.causeTitle}>Protocolo de Doses</Text>
                  <Text style={styles.causeTreatment}>
                    <Text style={styles.conductLabel}>1ª dose:</Text>
                    {"\n"}• 300 mg em bolus EV, seguida de flush
                    
                    {"\n"}{"\n"}<Text style={styles.conductLabel}>2ª dose:</Text>
                    {"\n"}• 150 mg em bolus EV, também seguida de flush
                    
                    {"\n"}{"\n"}<Text style={styles.conductLabel}>Importante:</Text>
                    {"\n"}• Deve ser aplicada de forma intercalada com a 1ª e a 3ª dose de epinefrina
                    {"\n"}• <Text style={styles.causeLabel}>Exclusivamente nos casos de PCR em ritmo chocável</Text>
                  </Text>
                </View>
              </View>
            )}

            {/* Lidocaína - apenas para FV/TV */}
            {rhythmType === 'vf-vt' && (
              <View style={styles.causesSection}>
                <Text style={styles.causesSectionTitle}>⚡ Lidocaína</Text>
                
                <View style={styles.causeCard}>
                  <Text style={styles.causeTitle}>Alternativa à Amiodarona</Text>
                  <Text style={styles.causeTreatment}>
                    <Text style={styles.conductLabel}>1ª dose:</Text>
                    {"\n"}• 1 a 1,5 mg/kg em bolus EV
                    
                    {"\n"}{"\n"}<Text style={styles.conductLabel}>2ª dose:</Text>
                    {"\n"}• 0,5 a 0,75 mg/kg em bolus EV
                    
                    {"\n"}{"\n"}<Text style={styles.conductLabel}>Indicação:</Text>
                    {"\n"}• Geralmente reservada para situações em que a amiodarona esteja contraindicada ou indisponível
                  </Text>
                </View>
              </View>
            )}

            {/* Magnésio - apenas para FV/TV */}
            {rhythmType === 'vf-vt' && (
              <View style={styles.causesSection}>
                <Text style={styles.causesSectionTitle}>🔬 Magnésio</Text>
                
                <View style={styles.causeCard}>
                  <Text style={styles.causeTitle}>Indicação Específica</Text>
                  <Text style={styles.causeTreatment}>
                    <Text style={styles.conductLabel}>Indicação:</Text>
                    {"\n"}• Os profissionais deverão considerar sulfato de magnésio para torsades de pointes associadas a um intervalo QT prolongado
                    
                    {"\n"}{"\n"}<Text style={styles.conductLabel}>Doses:</Text>
                    {"\n"}• <Text style={styles.dosageHighlight}>MgSO4 10% 10 a 20 ml + SG 5% ou SF0,9% 10ml - correr 20 min</Text>
                    {"\n"}• <Text style={styles.dosageHighlight}>MgSO4 50% 2 a 4 ml + SG 5% ou SF0,9% 10ml - correr 20 min</Text>
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.noteSection}>
              <Text style={styles.noteText}>
                {rhythmType === 'asystole-pea' ? 
                  '💡 Assistolia/AESP: Apenas Epinefrina é utilizada. Sempre realizar flush com SF 0,9%' :
                  '💡 Sempre realizar flush com SF 0,9% após cada dose de medicação EV'
                }
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderRCPQualityModal = () => (
    <Modal
      visible={showRCPQualityModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <ScrollView style={styles.reversibleCausesScroll}>
          <View style={[styles.modalContent, styles.reversibleCausesModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Qualidade da RCP / Via Aérea</Text>
              <TouchableOpacity 
                onPress={() => setShowRCPQualityModal(false)}
                style={styles.closeButton}
              >
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Desfibrilação - apenas para FV/TV */}
            {rhythmType === 'vf-vt' && (
              <View style={styles.causesSection}>
                <Text style={styles.causesSectionTitle}>⚡ Desfibrilação</Text>
                
                <View style={styles.causeCard}>
                  <Text style={styles.causeTitle}>Energia Recomendada</Text>
                  <Text style={styles.causeContext}>
                    <Text style={styles.causeLabel}>Monofásico: </Text>
                    360J sem sincronização. Na dúvida, sempre coloque no máximo.
                  </Text>
                  <Text style={styles.causeContext}>
                    <Text style={styles.causeLabel}>Bifásico: </Text>
                    200J sem sincronização. Na dúvida, sempre coloque no máximo.
                  </Text>
                  <Text style={styles.causeTreatment}>
                    <Text style={styles.conductLabel}>Importante:</Text>
                    {"\n"}• Aplicar APENAS em ritmos FV/TV (chocáveis)
                    {"\n"}• Garantir segurança da equipe antes do disparo
                    {"\n"}• Minimizar interrupções das compressões
                    {"\n"}• Retomar compressões imediatamente após o choque
                  </Text>
                </View>
              </View>
            )}

            {/* Qualidade da Massagem Cardíaca */}
            <View style={styles.causesSection}>
              <Text style={styles.causesSectionTitle}>💓 Qualidade da Massagem Cardíaca</Text>
              
              <View style={styles.causeCard}>
                <Text style={styles.causeTitle}>Técnica Adequada</Text>
                <Text style={styles.causeTreatment}>
                  <Text style={styles.conductLabel}>Profundidade:</Text>
                  {"\n"}• Mínimo de 5 cm (adultos)
                  {"\n"}• Permitir retorno completo do tórax
                  
                  {"\n"}{"\n"}<Text style={styles.conductLabel}>Frequência:</Text>
                  {"\n"}• 100 a 120 compressões por minuto
                  {"\n"}• Manter ritmo constante
                  
                  {"\n"}{"\n"}<Text style={styles.conductLabel}>Interrupções:</Text>
                  {"\n"}• Reduzir ao máximo as interrupções
                  {"\n"}• Trocar reanimador a cada 2 minutos
                  {"\n"}• Trocar antes se houver fadiga
                  {rhythmType === 'asystole-pea' ? 
                    "\n\n• CRÍTICO: Manter compressões contínuas" : 
                    "\n\n• Parar apenas para desfibrilação"
                  }
                </Text>
              </View>
            </View>

            {/* Via Aérea */}
            <View style={styles.causesSection}>
              <Text style={styles.causesSectionTitle}>🫁 Via Aérea e Ventilação</Text>
              
              <View style={styles.causeCard}>
                <Text style={styles.causeTitle}>Manejo da Via Aérea</Text>
                <Text style={styles.causeTreatment}>
                  <Text style={styles.conductLabel}>Antes da via aérea avançada:</Text>
                  {"\n"}• Ventilação com bolsa-válvula-máscara
                  {"\n"}• Proporção 30:2 (compressões:ventilações)
                  {rhythmType === 'vf-vt' ? 
                    "\n• Pausar compressões brevemente para ventilação" : 
                    "\n• Foco nas compressões contínuas"
                  }
                  
                  {"\n"}{"\n"}<Text style={styles.conductLabel}>Via aérea avançada:</Text>
                  {"\n"}• Intubação orotraqueal (preferencial)
                  {"\n"}• Dispositivo supraglótico se IOT difícil
                  {"\n"}• Capnografia em onda para confirmação
                  {rhythmType === 'asystole-pea' ? 
                    "\n• PRIORIDADE: Acesso vascular e medicações" : 
                    "\n• Balancear com tempo para desfibrilação"
                  }
                  
                  {"\n"}{"\n"}<Text style={styles.conductLabel}>Após via aérea avançada:</Text>
                  {"\n"}• 1 ventilação a cada 6 segundos
                  {"\n"}• Frequência de 10 ventilações/minuto
                  {"\n"}• NÃO interromper compressões para ventilar
                </Text>
              </View>
            </View>

            {/* Medicações - conteúdo específico por ritmo */}
            <View style={styles.causesSection}>
              <Text style={styles.causesSectionTitle}>💉 Medicações</Text>
              
              <View style={styles.causeCard}>
                <Text style={styles.causeTitle}>
                  {rhythmType === 'vf-vt' ? 'Protocolo FV/TV' : 'Protocolo Assistolia/AESP'}
                </Text>
                <Text style={styles.causeTreatment}>
                  <Text style={styles.conductLabel}>Epinefrina:</Text>
                  {"\n"}• 1mg EV/IO a cada 3-5 minutos
                  {rhythmType === 'vf-vt' ? 
                    "\n• Administrar APÓS 2º choque sem sucesso" : 
                    "\n• Administrar IMEDIATAMENTE ao confirmar ritmo"
                  }
                  
                  {rhythmType === 'vf-vt' && (
                    "\n\n" + 
                    "<Text style={styles.conductLabel}>Antiarrítmicos:</Text>" +
                    "\n• Amiodarona 300mg EV (1ª dose)" +
                    "\n• Amiodarona 150mg EV (2ª dose)" +
                    "\n• Lidocaína 1-1.5mg/kg se amiodarona indisponível" +
                    "\n• Administrar APÓS 3º choque sem sucesso"
                  )}
                  
                  {rhythmType === 'asystole-pea' && (
                    "\n\n" + 
                    "<Text style={styles.conductLabel}>Foco Principal:</Text>" +
                    "\n• Epinefrina é a medicação mais importante" +
                    "\n• NÃO usar antiarrítmicos" +
                    "\n• Investigar e tratar causas reversíveis"
                  )}
                </Text>
              </View>
            </View>

            {/* Qualidade da RCP */}
            <View style={styles.causesSection}>
              <Text style={styles.causesSectionTitle}>📊 Monitorização da Qualidade</Text>
              
              <View style={styles.causeCard}>
                <Text style={styles.causeTitle}>Marcadores de Qualidade</Text>
                <Text style={styles.causeTreatment}>
                  <Text style={styles.conductLabel}>Capnografia:</Text>
                  {"\n"}• Principal marcador de qualidade
                  {"\n"}• Manter ETCO₂ acima de 10-20 mmHg
                  {"\n"}• Elevação súbita >35 mmHg = possível ROSC
                  {rhythmType === 'asystole-pea' ? 
                    "\n• Valores baixos podem indicar má qualidade" : 
                    "\n• Pode diminuir após choques - é normal"
                  }
                  
                  {"\n"}{"\n"}<Text style={styles.conductLabel}>Pressão Arterial:</Text>
                  {"\n"}• PA diastólica >20 mmHg (invasiva)
                  {"\n"}• Indica compressões eficazes
                  
                  {"\n"}{"\n"}<Text style={styles.conductLabel}>Dispositivos de Feedback:</Text>
                  {"\n"}• Auxiliam na manutenção da técnica
                  {"\n"}• Fornecem dados em tempo real
                  {"\n"}• Especialmente úteis em RCP prolongada
                  
                  {"\n"}{"\n"}<Text style={styles.conductLabel}>Sinais de ROSC:</Text>
                  {"\n"}• ETCO₂ súbito >35 mmHg
                  {"\n"}• Presença de pulso palpável
                  {"\n"}• Pressão arterial detectável
                  {rhythmType === 'vf-vt' ? 
                    "\n• Ritmo organizado no monitor" : 
                    "\n• Mudança para ritmo organizado"
                  }
                </Text>
              </View>
            </View>

            <View style={styles.noteSection}>
              <Text style={styles.noteText}>
                {rhythmType === 'vf-vt' ? 
                  '💡 FV/TV: Foque na desfibrilação precoce e qualidade das compressões' : 
                  '💡 Assistolia/AESP: Foque na qualidade das compressões e causas reversíveis'
                }
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderReversibleCausesModal = () => (
    <Modal
      visible={showReversibleCauses}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.reversibleCausesModalContainer}>
          {/* Scrollable Content */}
          <ScrollView style={styles.reversibleCausesScroll}>
            <View style={[styles.modalContent, styles.reversibleCausesModal]}>

            {/* 5H's */}
            <View style={styles.causesSection}>
              <Text style={styles.causesSectionTitle}>5H's</Text>
              
              {/* Hipovolemia */}
              <View style={styles.causeCard}>
                <TouchableOpacity 
                  style={styles.collapsibleHeader}
                  onPress={() => toggleCauseExpansion('hipovolemia')}
                >
                  <Text style={styles.causeTitle}>1. Hipovolemia</Text>
                  <View style={styles.expandButton}>
                    {expandedCauses['hipovolemia'] ? 
                      <ChevronDown size={20} color={theme.colors.emergency} /> : 
                      <ChevronRight size={20} color={theme.colors.emergency} />
                    }
                  </View>
                </TouchableOpacity>
                
                {expandedCauses['hipovolemia'] && (
                  <View style={styles.collapsibleContent}>
                    {/* Subcategoria: Anemia */}
                    <Text style={styles.causeContext}>
                      <Text style={styles.causeLabel}>Anemia: </Text>
                      Hemorragia, trauma, período pós-operatório, deficiências nutricionais, distúrbios hematológicos
                    </Text>
                    <Text style={styles.causeTreatment}>
                      <Text style={styles.conductLabel}>Conduta:</Text>
                      {"\n"}• Transfusão sanguínea maciça imediata
                      {"\n"}• Realizar medidas de resgate para contenção de sangramentos
                    </Text>
                    
                    {/* Separador visual */}
                    <View style={styles.causeSeparator} />
                    
                    {/* Subcategoria: Hipovolemia geral */}
                    <Text style={styles.causeContext}>
                      <Text style={styles.causeLabel}>Hipovolemia: </Text>
                      Grande queimado, desidratação severa, diabetes mellitus, perda gastrointestinal, sepse, trauma, hemorragia, malignidade
                    </Text>
                    <Text style={styles.causeTreatment}>
                      <Text style={styles.conductLabel}>Conduta:</Text>
                      {"\n"}• Expansão volêmica agressiva com cristalóides
                      {"\n"}• Considerar hemoderivados se anemia grave associada
                      {"\n"}• Considere a infusão de volume para a AESP associada à taquicardia de complexo estreito
                    </Text>
                  </View>
                )}
              </View>

              {/* Hipóxia */}
              <View style={styles.causeCard}>
                <TouchableOpacity 
                  style={styles.collapsibleHeader}
                  onPress={() => toggleCauseExpansion('hipoxia')}
                >
                  <Text style={styles.causeTitle}>2. Hipóxia</Text>
                  <View style={styles.expandButton}>
                    {expandedCauses['hipoxia'] ? 
                      <ChevronDown size={20} color={theme.colors.emergency} /> : 
                      <ChevronRight size={20} color={theme.colors.emergency} />
                    }
                  </View>
                </TouchableOpacity>
                
                {expandedCauses['hipoxia'] && (
                  <View style={styles.collapsibleContent}>
                    <Text style={styles.causeContext}>
                      <Text style={styles.causeLabel}>Contextos: </Text>
                      Obstrução de vias aéreas, hipoventilação, pneumopatias, pneumotórax, crise asmática grave, asfixia, intoxicação por monóxido de carbono/cianeto, bradicardia
                    </Text>
                    <Text style={styles.causeTreatment}>
                      <Text style={styles.conductLabel}>Conduta:</Text>
                      {"\n"}• Via aérea definitiva imediata:
                      {"\n"}  - Intubação orotraqueal (padrão-ouro)
                      {"\n"}  - Cricotireoidostomia (se intubação impossível/urgência extrema)
                      {"\n"}• Ajustar parâmetros do ventilador mecânico adequadamente
                      {"\n"}• Garantir oxigenação adequada
                    </Text>
                  </View>
                )}
              </View>

              {/* Hidrogênio (Acidose) */}
              <View style={styles.causeCard}>
                <TouchableOpacity 
                  style={styles.collapsibleHeader}
                  onPress={() => toggleCauseExpansion('hidrogenio')}
                >
                  <Text style={styles.causeTitle}>3. Hidrogênio (Acidose)</Text>
                  <View style={styles.expandButton}>
                    {expandedCauses['hidrogenio'] ? 
                      <ChevronDown size={20} color={theme.colors.emergency} /> : 
                      <ChevronRight size={20} color={theme.colors.emergency} />
                    }
                  </View>
                </TouchableOpacity>
                
                {expandedCauses['hidrogenio'] && (
                  <View style={styles.collapsibleContent}>
                    <Text style={styles.causeContext}>
                      <Text style={styles.causeLabel}>Contextos: </Text>
                      Diabetes mellitus descompensado (cetoacidose), diarreia grave, intoxicação (metanol, etilenoglicol, salicilato), insuficiência renal, acidose lática (sepse, choque), rabdomiólise grave
                    </Text>
                    <Text style={styles.causeTreatment}>
                      <Text style={styles.conductLabel}>Conduta:</Text>
                      {"\n"}• Bicarbonato de sódio IV {"\n"}  💠 <Text style={styles.dosageHighlight}>1 ml/kg, se 8.4%, em bolus puro, metade da dose pode ser repetida após 10-15 minutos, dependendo do pH; as subsequentes devem ser guiadas pela gasometria</Text>
                      {"\n"}• Considerar gluconato de cálcio se hipercalemia associada
                      {"\n"}  💠 <Text style={styles.dosageHighlight}>20-30 mL solução 10% puro EV em dois minutos. A dose pode ser repetida a cada 2-5 minutos.</Text>
                    </Text>
                  </View>
                )}
              </View>

              {/* Hipocalemia e Hipercalemia */}
              <View style={styles.causeCard}>
                <TouchableOpacity 
                  style={styles.collapsibleHeader}
                  onPress={() => toggleCauseExpansion('eletroliticos')}
                >
                  <Text style={styles.causeTitle}>4. Hipocalemia e Hipercalemia</Text>
                  <View style={styles.expandButton}>
                    {expandedCauses['eletroliticos'] ? 
                      <ChevronDown size={20} color={theme.colors.emergency} /> : 
                      <ChevronRight size={20} color={theme.colors.emergency} />
                    }
                  </View>
                </TouchableOpacity>
                
                {expandedCauses['eletroliticos'] && (
                  <View style={styles.collapsibleContent}>
                    <Text style={styles.causeContext}>
                      <Text style={styles.causeLabel}>Hipocalemia: </Text>
                      Uso de álcool, diabetes mellitus, diuréticos, intoxicações, perdas gastrointestinais, má nutrição
                    </Text>
                    <Text style={styles.causeTreatment}>
                      <Text style={styles.conductLabel}>Conduta:</Text>
                      {"\n"}• Reposição de potássio e magnésio
                      {"\n"}  💠 <Text style={styles.dosageHighlight}>MgSO4 10% 10 a 20 ml + SG 5% EV aberto</Text>
                      {"\n"}  💠 <Text style={styles.dosageHighlight}>MgSO4 50% 2 a 4 ml + SG 5% EV aberto</Text>
                    </Text>
                    
                    {/* Separador visual */}
                    <View style={styles.causeSeparator} />
                    
                    <Text style={styles.causeContext}>
                      <Text style={styles.causeLabel}>Hipercalemia: </Text>
                      Insuficiência renal, hemólise, rabdomiólise, lise tumoral, medicações, lesão tecidual extensa
                    </Text>
                    <Text style={styles.causeTreatment}>
                      <Text style={styles.conductLabel}>Conduta:</Text>
                      {"\n"}• Bicarbonato de sódio, gluconato de cálcio
                      {"\n"}  - Bicabornato: 💠 <Text style={styles.dosageHighlight}>1 ml/kg, se 8.4%, em bolus puro, metade da dose pode ser repetida após 10-15 minutos, dependendo do pH; as subsequentes devem ser guiadas pela gasometria</Text>
                      {"\n"}  - Gluconato: 💠 <Text style={styles.dosageHighlight}>20-30 mL solução 10% puro EV em dois minutos. A dose pode ser repetida a cada 2-5 minutos.</Text>
                      {"\n"}• Considerar terapias insulina + glicose, beta-agonista
                      {"\n"}• Lembrar: adrenalina atua também neste aspecto
                    </Text>
                  </View>
                )}
              </View>

              {/* Hipotermia */}
              <View style={styles.causeCard}>
                <TouchableOpacity 
                  style={styles.collapsibleHeader}
                  onPress={() => toggleCauseExpansion('hipotermia')}
                >
                  <Text style={styles.causeTitle}>5. Hipotermia</Text>
                  <View style={styles.expandButton}>
                    {expandedCauses['hipotermia'] ? 
                      <ChevronDown size={20} color={theme.colors.emergency} /> : 
                      <ChevronRight size={20} color={theme.colors.emergency} />
                    }
                  </View>
                </TouchableOpacity>
                
                {expandedCauses['hipotermia'] && (
                  <View style={styles.collapsibleContent}>
                    <Text style={styles.causeContext}>
                      <Text style={styles.causeLabel}>Temperatura: </Text>
                      &lt;35°C com risco aumentado &lt;30°C ou &lt;32°C (idosos)
                    </Text>
                    <Text style={styles.causeContext}>
                      <Text style={styles.causeLabel}>Contextos: </Text>
                      Álcool, grande queimado, afogamento, intoxicação medicamentosa, idoso, morador de rua, endocrinopatias, trauma
                    </Text>
                    <Text style={styles.causeTreatment}>
                      <Text style={styles.conductLabel}>Conduta:</Text>
                      {"\n"}• Mantas térmicas e aquecimento ativo
                      {"\n"}• Infusão de soro aquecido
                      {"\n"}• Irrigação gástrica e vesical com soro morno
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* 5T's */}
            <View style={styles.causesSection}>
              <Text style={styles.causesSectionTitle}>5T's</Text>
              
              {/* Tensão - Pneumotórax */}
              <View style={styles.causeCard}>
                <TouchableOpacity 
                  style={styles.collapsibleHeader}
                  onPress={() => toggleCauseExpansion('tensao')}
                >
                  <Text style={styles.causeTitle}>1. Tensão (Pneumotórax Hipertensivo)</Text>
                  <View style={styles.expandButton}>
                    {expandedCauses['tensao'] ? 
                      <ChevronDown size={20} color={theme.colors.emergency} /> : 
                      <ChevronRight size={20} color={theme.colors.emergency} />
                    }
                  </View>
                </TouchableOpacity>
                
                {expandedCauses['tensao'] && (
                  <View style={styles.collapsibleContent}>
                    <Text style={styles.causeContext}>
                      <Text style={styles.causeLabel}>Contextos: </Text>
                      Após acesso venoso central, ventilação mecânica, pneumopatia prévia, trauma torácico
                    </Text>
                    <Text style={styles.causeTreatment}>
                      <Text style={styles.conductLabel}>Conduta:</Text>
                      {"\n"}• Punção de alívio imediata com posterior drenagem torácica
                      {"\n"}• 2º espaço intercostal, linha hemiclavicular
                    </Text>
                  </View>
                )}
              </View>

              {/* Tamponamento Cardíaco */}
              <View style={styles.causeCard}>
                <TouchableOpacity 
                  style={styles.collapsibleHeader}
                  onPress={() => toggleCauseExpansion('tamponamento')}
                >
                  <Text style={styles.causeTitle}>2. Tamponamento Cardíaco</Text>
                  <View style={styles.expandButton}>
                    {expandedCauses['tamponamento'] ? 
                      <ChevronDown size={20} color={theme.colors.emergency} /> : 
                      <ChevronRight size={20} color={theme.colors.emergency} />
                    }
                  </View>
                </TouchableOpacity>
                
                {expandedCauses['tamponamento'] && (
                  <View style={styles.collapsibleContent}>
                    <Text style={styles.causeContext}>
                      <Text style={styles.causeLabel}>Contextos: </Text>
                      Pós-operatório de cirurgia cardíaca,pós-infarto, pericardite, trauma torácico, malignidades
                    </Text>
                    <Text style={styles.causeTreatment}>
                      <Text style={styles.conductLabel}>Conduta:</Text>
                      {"\n"}• Pericardiocentese imediata:
                      {"\n"}Agulha calibre 18, abaixo ou ao lado do processo xifoide, direcionado ao ombro. Inicialmente 45°, ajustar 15 a 30°C após ultrapassar a cartilagem xifoide, mantendo aspiração contínua até que líquido seja aspirado  
                      {"\n"}• Em caso de sangramento ativo, drenar em pequenas alíquotas de 50 ml
                    </Text>
                  </View>
                )}
              </View>

              {/* Toxinas */}
              <View style={styles.causeCard}>
                <TouchableOpacity 
                  style={styles.collapsibleHeader}
                  onPress={() => toggleCauseExpansion('toxinas')}
                >
                  <Text style={styles.causeTitle}>3. Toxinas</Text>
                  <View style={styles.expandButton}>
                    {expandedCauses['toxinas'] ? 
                      <ChevronDown size={20} color={theme.colors.emergency} /> : 
                      <ChevronRight size={20} color={theme.colors.emergency} />
                    }
                  </View>
                </TouchableOpacity>
                
                {expandedCauses['toxinas'] && (
                  <View style={styles.collapsibleContent}>
                    <Text style={styles.causeContext}>
                      <Text style={styles.causeLabel}>Contextos: </Text>
                      Uso de álcool, drogadição, alterações mentais, distúrbios psiquiátricos, síndromes tóxicas
                    </Text>
                    <Text style={styles.causeTreatment}>
                      <Text style={styles.conductLabel}>Conduta:</Text>
                      {"\n"}• Antídotos específicos quando disponíveis
                      {"\n"}• Bicarbonato de sódio em intoxicações por tricíclicos, naloxona em opioides
                    </Text>
                  </View>
                )}
              </View>

              {/* Trombose Coronariana */}
              <View style={styles.causeCard}>
                <TouchableOpacity 
                  style={styles.collapsibleHeader}
                  onPress={() => toggleCauseExpansion('trombose_coronariana')}
                >
                  <Text style={styles.causeTitle}>4. Trombose Coronariana (SCA)</Text>
                  <View style={styles.expandButton}>
                    {expandedCauses['trombose_coronariana'] ? 
                      <ChevronDown size={20} color={theme.colors.emergency} /> : 
                      <ChevronRight size={20} color={theme.colors.emergency} />
                    }
                  </View>
                </TouchableOpacity>
                
                {expandedCauses['trombose_coronariana'] && (
                  <View style={styles.collapsibleContent}>
                    <Text style={styles.causeContext}>
                      <Text style={styles.causeLabel}>Contextos: </Text>
                      Dor torácica prévia, PCR súbita, síndrome coronariana aguda
                    </Text>
                    <Text style={styles.causeTreatment}>
                      <Text style={styles.conductLabel}>Conduta:</Text>
                      {"\n"}• Desfibrilação imediata e antiarrítmicos
                      {"\n"}• Considerar angioplastia de emergência
                      {"\n"}• Terapia trombolítica se indicada
                    </Text>
                  </View>
                )}
              </View>

              {/* Trombose Pulmonar */}
              <View style={styles.causeCard}>
                <TouchableOpacity 
                  style={styles.collapsibleHeader}
                  onPress={() => toggleCauseExpansion('trombose_pulmonar')}
                >
                  <Text style={styles.causeTitle}>5. Trombose Pulmonar (TEP)</Text>
                  <View style={styles.expandButton}>
                    {expandedCauses['trombose_pulmonar'] ? 
                      <ChevronDown size={20} color={theme.colors.emergency} /> : 
                      <ChevronRight size={20} color={theme.colors.emergency} />
                    }
                  </View>
                </TouchableOpacity>
                
                {expandedCauses['trombose_pulmonar'] && (
                  <View style={styles.collapsibleContent}>
                    <Text style={styles.causeContext}>
                      <Text style={styles.causeLabel}>Contextos: </Text>
                      Imobilização recente ou prolongada, pós-operatório recente, periparto
                    </Text>
                    <Text style={styles.causeTreatment}>
                      <Text style={styles.conductLabel}>Conduta:</Text>
                      {"\n"}• Considerar fibronolítico e RCP prolongada (Apesar de evidência limitada, avaliar caso a caso)
                      {"\n"}  - 💊 <Text style={styles.dosageHighlight}>Alterpase (rtPA) 50 a 100 mg EV em bolus</Text>
                      {"\n"}• Considerar trombectomia percutânea ou cirúrgica
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.noteSection}>
              <Text style={styles.noteText}>
                ⚠️ Importante: Sempre considerar estas causas durante a RCP e tratar agressivamente quando identificadas
              </Text>
            </View>
            </View>
          </ScrollView>
          
          {/* Fixed bottom button */}
          <View style={styles.fixedBottomContainer}>
            <TouchableOpacity
              style={styles.returnToPCRButton}
              onPress={() => setShowReversibleCauses(false)}
            >
              <Text style={styles.returnToPCRButtonText}>VOLTAR PARA PCR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderIntervention = () => {
    const nextMedication = getNextMedicationInfo();

    // Estilos responsivos dos botões baseados no tamanho da tela
    const getResponsiveButtonStyle = (isSpecial = false) => {
      const baseStyle = {
        backgroundColor: theme.colors.emergency,
        borderRadius: theme.borderRadius.sm,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexDirection: 'row' as const,
        gap: theme.spacing.xs,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        marginBottom: theme.spacing.xs,
      };

      if (isSmallScreen) {
        return {
          ...baseStyle,
          width: '100%',
          minHeight: 50,
          padding: theme.spacing.sm,
          marginHorizontal: 0,
        };
      } else if (isMediumScreen) {
        return {
          ...baseStyle,
          width: isSpecial ? '100%' : '48%',
          minHeight: 52,
          padding: theme.spacing.sm,
        };
      } else {
        return {
          ...baseStyle,
          flex: isSpecial ? 1 : 0.48,
          minWidth: 140,
          maxWidth: isSpecial ? 300 : 180,
          minHeight: 54,
          padding: theme.spacing.md,
        };
      }
    };

    const getTextStyle = () => {
      if (isSmallScreen) {
        return {
          ...theme.typography.button,
          color: 'white',
          textAlign: 'center' as const,
          fontSize: 12,
          flexShrink: 1,
        };
      } else if (isMediumScreen) {
        return {
          ...theme.typography.button,
          color: 'white',
          textAlign: 'center' as const,
          fontSize: 13,
        };
      } else {
        return {
          ...theme.typography.button,
          color: 'white',
          textAlign: 'center' as const,
          fontSize: 14,
        };
      }
    };

    const getIconSize = () => {
      if (isSmallScreen) return 20;
      if (isMediumScreen) return 22;
      return 24;
    };

    const getButtonContainerStyle = () => {
      if (isSmallScreen) {
        return {
          flexDirection: 'column' as const,
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.xl * 2,
          paddingHorizontal: theme.spacing.md,
        };
      } else if (isMediumScreen) {
        return {
          flexDirection: 'row' as const,
          flexWrap: 'wrap' as const,
          justifyContent: 'space-between' as const,
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.xl * 2,
          paddingHorizontal: theme.spacing.sm,
        };
      } else {
        return {
          flexDirection: 'row' as const,
          flexWrap: 'wrap' as const,
          justifyContent: 'center' as const,
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.xl * 2,
          paddingHorizontal: theme.spacing.xs,
        };
      }
    };

    // Estilos responsivos dos botões de apoio
    const getSupportButtonsContainerStyle = () => {
      if (isSmallScreen) {
        return {
          flexDirection: 'column' as const,
          gap: theme.spacing.sm,
          marginTop: theme.spacing.md,
        };
      } else if (isMediumScreen) {
        return {
          flexDirection: 'column' as const, // Sempre coluna para acomodar 3 botões
          gap: theme.spacing.sm,
          marginTop: theme.spacing.md,
        };
      } else {
        return {
          flexDirection: rhythmType === 'asystole-pea' ? 'column' as const : 'row' as const,
          gap: theme.spacing.md,
          marginTop: theme.spacing.md,
        };
      }
    };

    const getSupportButtonStyle = (isFullWidth = false, isReversibleCauses = false) => {
      const baseStyle = {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: 'white',
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: isReversibleCauses ? theme.colors.emergency : theme.colors.primary,
      };

      if (isSmallScreen) {
        return {
          ...baseStyle,
          padding: theme.spacing.sm,
          width: '100%',
          minHeight: 44,
        };
      } else if (isMediumScreen) {
        if (isFullWidth) {
          return {
            ...baseStyle,
            padding: theme.spacing.md,
            width: '100%',
            minHeight: 46,
          };
        } else {
          return {
            ...baseStyle,
            padding: theme.spacing.md,
            flex: 1,
            minHeight: 46,
          };
        }
      } else {
        return {
          ...baseStyle,
          padding: theme.spacing.md,
          flex: isFullWidth ? 1 : 1,
          minHeight: 48,
        };
      }
    };

    const getSupportButtonTextStyle = (isReversibleCauses = false) => {
      const baseStyle = {
        ...theme.typography.button,
        marginLeft: theme.spacing.sm,
        color: isReversibleCauses ? theme.colors.emergency : theme.colors.primary,
      };

      if (isSmallScreen) {
        return {
          ...baseStyle,
          fontSize: 11,
          flexShrink: 1,
        };
      } else if (isMediumScreen) {
        return {
          ...baseStyle,
          fontSize: 12,
        };
      } else {
        return {
          ...baseStyle,
          fontSize: 12,
        };
      }
    };

    const getSupportIconSize = () => {
      if (isSmallScreen) return 18;
      if (isMediumScreen) return 19;
      return 20;
    };

    return (
      <View style={styles.interventionContainer}>
        <View style={getButtonContainerStyle()}>
          {rhythmType === 'vf-vt' && (
            <Animated.View style={{ transform: [{ scale: isShockUrgent ? shockAnim : 1 }] }}>
              <TouchableOpacity
                style={[
                  getResponsiveButtonStyle(),
                  {
                    backgroundColor: isShockUrgent ? '#FF4B4B' : theme.colors.emergency
                  },
                  isShockUrgent && styles.actionButtonPulsing
                ]}
                onPress={handleShock}
              >
                <Activity size={getIconSize()} color="white" />
                <Text style={getTextStyle()}>
                  {isShockUrgent ? 'CHOQUE AGORA!' : 'Choque'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          
          {rhythmType === 'asystole-pea' ? (
            <Animated.View style={{ transform: [{ scale: epinephrineAnim }] }}>
              <TouchableOpacity
                style={[
                  getResponsiveButtonStyle(),
                  { backgroundColor: (isEpinephrineDue || isFirstAsystoleSelection) ? '#FF4B4B' : nextMedication.color },
                  (isEpinephrineDue || isFirstAsystoleSelection) && styles.actionButtonPulsing
                ]}
                onPress={() => addIntervention(nextMedication.type === 'antiarrhythmic' ? 'amiodarone' : 'epinephrine')}
              >
                <Syringe size={getIconSize()} color="white" />
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={getTextStyle()}>
                    {(isEpinephrineDue || isFirstAsystoleSelection) ? 'EPINEFRINA AGORA!' : nextMedication.name}
                  </Text>
                  {(epinephrineCountdownMin > 0 || epinephrineCountdownMax > 0) && !isEpinephrineDue && !isFirstAsystoleSelection && (
                    <View style={{ alignItems: 'center', marginTop: 2 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ alignItems: 'center' }}>
                          <Text style={[getTextStyle(), { 
                            fontSize: isSmallScreen ? 11 : isMediumScreen ? 12 : 13,
                            opacity: 0.8
                          }]}>
                            MIN
                          </Text>
                          <Text style={[getTextStyle(), { 
                            fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : 16,
                            fontWeight: 'bold' as const,
                            color: epinephrineCountdownMin <= 0 ? '#4CAF50' : 'white'
                          }]}>
                            {formatTime(epinephrineCountdownMin)}
                          </Text>
                        </View>
                        <Text style={[getTextStyle(), { 
                          fontSize: isSmallScreen ? 12 : isMediumScreen ? 13 : 14,
                          opacity: 0.6
                        }]}>
                          |
                        </Text>
                        <View style={{ alignItems: 'center' }}>
                          <Text style={[getTextStyle(), { 
                            fontSize: isSmallScreen ? 11 : isMediumScreen ? 12 : 13,
                            opacity: 0.8
                          }]}>
                            MAX
                          </Text>
                          <Text style={[getTextStyle(), { 
                            fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : 16,
                            fontWeight: 'bold' as const,
                            color: epinephrineCountdownMax <= 0 ? '#FF6B6B' : 'white'
                          }]}>
                            {formatTime(epinephrineCountdownMax)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <TouchableOpacity
              style={[getResponsiveButtonStyle(), { backgroundColor: nextMedication.color }]}
              onPress={() => addIntervention(nextMedication.type === 'antiarrhythmic' ? 'amiodarone' : 'epinephrine')}
            >
              <Syringe size={getIconSize()} color="white" />
              <Text style={getTextStyle()}>{nextMedication.name}</Text>
            </TouchableOpacity>
          )}
          
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[
                getResponsiveButtonStyle(),
                isRhythmCheckDue && styles.actionButtonPulsing,
                { backgroundColor: isRhythmCheckDue ? '#FF4B4B' : theme.colors.emergency }
              ]}
              onPress={handleRhythmCheck}
            >
              <AlertCircle size={getIconSize()} color="white" />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={getTextStyle()}>
                  {isRhythmCheckDue ? 'VERIFICAR RITMO' : 'Verificar Ritmo'}
                </Text>
                {!isRhythmCheckDue && (
                  <Text style={[getTextStyle(), { 
                    fontSize: isSmallScreen ? 16 : isMediumScreen ? 17 : 18, 
                    marginTop: 2,
                    fontWeight: 'bold' as const
                  }]}>
                    {formatTime(rhythmCheckCountdown)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
          
          <TouchableOpacity
            style={[getResponsiveButtonStyle(true), { backgroundColor: '#4CAF50' }]}
            onPress={handleROSC}
          >
            <Heart size={getIconSize()} color="white" />
            <Text style={[getTextStyle(), { flexShrink: 1 }]}>
              {isSmallScreen ? 'RETORNO PULSO ESPONTÂNEO' : 'RETORNO DA CIRCULAÇÃO ESPONTÂNEA'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Seção de informações e botões auxiliares */}
        <View style={styles.infoSection}>
          {rhythmType === 'asystole-pea' && (
            <Text style={styles.nonShockableText}>
              🩸 Obter acesso intravenoso ou intraósseo{"\n"}
              💉 Administre epinefrina a cada 3 a 5 minutos enquanto estiver neste ritmo{"\n"}
              🫁 Considere obter via aérea avançada, capnografia{"\n"}
              ⏱️ Não faça pausas de mais de 10 segundos nas compressões torácicas para verificar o ritmo
            </Text>
          )}
          
          {rhythmType === 'vf-vt' && (
            <Text style={styles.nonShockableText}>
              💓 RCP por 2 minutos e verifique se ritmo é chocável{"\n"}
              💉 Epinefrina: 1mg após 2º choque, depois a cada 3-5 min{"\n"}
              ⚡ Amiodarona: 300mg após 3º choque (intercalada c/ epinefrina), 150mg após 5º choque{"\n"}
              🫁 Considere via aérea avançada, capnografia
            </Text>
          )}
          
          {/* Botões de apoio */}
          <View style={getSupportButtonsContainerStyle()}>
            {/* Botão Qualidade da RCP - sempre visível para ambos os ritmos */}
            <TouchableOpacity
              style={getSupportButtonStyle(rhythmType === 'vf-vt' && rhythmType !== 'asystole-pea')}
              onPress={() => setShowRCPQualityModal(true)}
            >
              <Activity size={getSupportIconSize()} color={theme.colors.primary} />
              <Text style={getSupportButtonTextStyle()}>
                Qualidade da RCP / Via Aérea
              </Text>
            </TouchableOpacity>
            
            {/* Botão Doses Farmacológicas - sempre visível para ambos os ritmos */}
            <TouchableOpacity
              style={getSupportButtonStyle(rhythmType === 'vf-vt' && rhythmType !== 'asystole-pea')}
              onPress={() => setShowPharmacologyModal(true)}
            >
              <Syringe size={getSupportIconSize()} color={theme.colors.primary} />
              <Text style={getSupportButtonTextStyle()}>
                {rhythmType === 'asystole-pea' ? 'Dose da Epinefrina' : 'Doses Farmacológicas'}
              </Text>
            </TouchableOpacity>
            
            {/* Botão Causas Reversíveis - visível para ambos os ritmos */}
            <TouchableOpacity
              style={getSupportButtonStyle(rhythmType === 'vf-vt' && rhythmType !== 'asystole-pea', true)}
              onPress={() => setShowReversibleCauses(true)}
            >
              <AlertTriangle size={getSupportIconSize()} color={theme.colors.emergency} />
              <Text style={getSupportButtonTextStyle(true)}>
                {isSmallScreen ? 'Causas 5H/5T' : 'Causas Reversíveis (5H e 5T)'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {(nextEpinephrine || nextAntiarrhythmic || nextRhythmCheck) && (
          <View style={styles.alertsContainer}>
            {nextEpinephrine && (
              <View style={styles.medicationAlert}>
                <Clock size={20} color={theme.colors.warning} />
                <Text style={styles.medicationAlertText}>
                  Próxima Epinefrina: {nextEpinephrine.toLocaleTimeString()}
                </Text>
              </View>
            )}
            {nextAntiarrhythmic && (
              <View style={styles.medicationAlert}>
                <Clock size={20} color={theme.colors.warning} />
                <Text style={styles.medicationAlertText}>
                  Próxima Amiodarona/Lidocaína: {nextAntiarrhythmic.toLocaleTimeString()}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Histórico de Ações Realizadas */}
        <View style={styles.actionsHistoryContainer}>
          <Text style={styles.actionsHistoryTitle}>Resumo de Ações Realizadas:</Text>
          <View style={styles.actionsHistoryGrid}>
            {rhythmType === 'vf-vt' && (
              <View style={styles.actionCounter}>
                <Activity size={16} color={theme.colors.emergency} />
                <Text style={styles.actionCounterText}>
                  Choques: {interventions.filter(i => i.type === 'shock').length}
                </Text>
              </View>
            )}
            <View style={styles.actionCounter}>
              <Syringe size={16} color={theme.colors.emergency} />
              <Text style={styles.actionCounterText}>
                Epinefrina: {interventions.filter(i => i.type === 'epinephrine').length}
              </Text>
            </View>
            {rhythmType === 'vf-vt' && (
              <View style={styles.actionCounter}>
                <Syringe size={16} color={theme.colors.warning} />
                <Text style={styles.actionCounterText}>
                  Antiarrítmicos: {interventions.filter(i => i.type === 'amiodarone' || i.type === 'lidocaine').length}
                </Text>
              </View>
            )}
            <View style={styles.actionCounter}>
              <AlertCircle size={16} color={theme.colors.primary} />
              <Text style={styles.actionCounterText}>
                Nº do Ciclo: {Math.ceil(interventions.filter(i => i.type === 'rhythm-check').length / 1)}
              </Text>
            </View>
          </View>
          
          {/* Indicadores de Protocolo */}
          {rhythmType === 'vf-vt' && (
            <View style={styles.protocolIndicators}>
              <Text style={styles.protocolTitle}>Status do Protocolo FV/TV:</Text>
              <View style={styles.protocolStatus}>
                <Text style={[
                  styles.protocolText,
                  { color: interventions.filter(i => i.type === 'epinephrine').length > 0 ? theme.colors.success : theme.colors.textSecondary }
                ]}>
                  • Epinefrina {interventions.filter(i => i.type === 'epinephrine').length > 0 ? '✓' : '(após 2º choque)'}
                </Text>
                <Text style={[
                  styles.protocolText,
                  { color: interventions.filter(i => i.type === 'amiodarone').length > 0 ? theme.colors.success : theme.colors.textSecondary }
                ]}>
                  • Amiodarona {interventions.filter(i => i.type === 'amiodarone').length > 0 ? '✓' : '(após 3º choque)'}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.timeline}>
          <Text style={styles.timelineTitle}>Registro de Intervenções:</Text>
          {interventions.map((intervention, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineTime}>
                  {intervention.timestamp.toLocaleTimeString()}
                </Text>
                <Text style={styles.timelineElapsed}>
                  {intervention.elapsedTime} de RCP
                </Text>
              </View>
              <Text style={styles.timelineText}>
                {intervention.details || getInterventionDisplayName(intervention.type)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="RCP (Ressuscitação Cardiopulmonar)" type="emergency" />
      
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(time)}</Text>
        {isActive && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetResuscitation}
          >
            <RotateCcw size={24} color={theme.colors.emergency} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        {currentStep === 'initial' && renderInitialScreen()}
        {currentStep === 'assessment' && renderAssessment()}
        {currentStep === 'intervention' && renderIntervention()}
      </ScrollView>

      {renderRhythmModal()}
      {renderRCPQualityModal()}
      {renderPharmacologyModal()}
      {renderReversibleCausesModal()}
      {renderPostPCRModal()}
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
  timerContainer: {
    backgroundColor: 'white',
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  timer: {
    ...theme.typography.h2,
    color: theme.colors.emergency,
  },
  resetButton: {
    marginLeft: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  startButton: {
    backgroundColor: theme.colors.emergency,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
  },
  startButtonText: {
    ...theme.typography.button,
    color: 'white',
    marginTop: theme.spacing.md,
  },
  assessmentContainer: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
    marginBottom: theme.spacing.sm,
    lineHeight: 24,
  },
  checkList: {
    backgroundColor: 'white',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  checkItem: {
    ...theme.typography.body1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  instruction: {
    ...theme.typography.body1,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  rhythmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  rhythmButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.emergency,
  },
  rhythmButtonText: {
    ...theme.typography.button,
    color: theme.colors.emergency,
    marginTop: theme.spacing.sm,
  },
  rhythmDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  interventionContainer: {
    padding: theme.spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.xs,
  },
  alertsContainer: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  medicationAlert: {
    backgroundColor: '#FFF3E0',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationAlertText: {
    ...theme.typography.body2,
    color: theme.colors.warning,
    marginLeft: theme.spacing.sm,
  },
  timeline: {
    backgroundColor: 'white',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  timelineTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  timelineItem: {
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  timelineTime: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  timelineElapsed: {
    ...theme.typography.caption,
    color: theme.colors.emergency,
  },
  timelineText: {
    ...theme.typography.body2,
    color: theme.colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.emergency,
  },
  modalButtonText: {
    ...theme.typography.button,
    color: theme.colors.emergency,
    marginLeft: theme.spacing.md,
  },
  actionButtonPulsing: {
    borderWidth: 2,
    borderColor: '#FF8F8F',
  },
  nonShockableInfo: {
    backgroundColor: '#FFF5F5',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  nonShockableText: {
    fontSize: 14,
    color: '#666',
    marginTop: theme.spacing.sm,
    fontFamily: 'Roboto-Medium',
  },
  reversibleCausesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.emergency,
  },
  reversibleCausesText: {
    ...theme.typography.button,
    color: theme.colors.emergency,
    marginLeft: theme.spacing.sm,
  },
  reversibleCausesModal: {
    minHeight: 'auto',
    marginVertical: theme.spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  causesSection: {
    marginBottom: theme.spacing.lg,
  },
  causesSectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.emergency,
    marginBottom: theme.spacing.md,
  },
  causesList: {
    backgroundColor: '#FFF5F5',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  causeItem: {
    ...theme.typography.body1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  reversibleCausesScroll: {
    maxHeight: '80%',
    width: '100%',
  },
  causeCard: {
    backgroundColor: 'white',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  causeContext: {
    ...theme.typography.body2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  causeTreatment: {
    ...theme.typography.body2,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
  causeLabel: {
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
  },
  conductLabel: {
    fontFamily: 'Roboto-Bold',
    color: theme.colors.primary,
  },
  noteSection: {
    backgroundColor: '#FFF3E0',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  noteText: {
    ...theme.typography.body2,
    color: theme.colors.warning,
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
  },
  causeSeparator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.sm,
  },
  dosageHighlight: {
    fontFamily: 'Roboto-Bold',
    color: '#2E8B57', // Sea green color for better visibility
    backgroundColor: '#F0FFF0', // Honeydew background for subtle highlight
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roscButton: {
    backgroundColor: '#4CAF50',
    flex: 1.2,
    maxWidth: 200,
    minWidth: 180,
    marginTop: theme.spacing.md,
  },
  postPCRSection: {
    marginBottom: theme.spacing.lg,
  },
  postPCRSectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  postPCRCard: {
    backgroundColor: '#F8F9FA',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  postPCRItem: {
    ...theme.typography.body2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 22,
  },
  postPCRSubtitle: {
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  postPCRUrgent: {
    backgroundColor: '#FFE4E4',
    borderColor: theme.colors.emergency,
  },
  postPCRModalContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
  },
  fixedBottomContainer: {
    backgroundColor: 'white',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    width: '100%',
  },
  returnToPCRButton: {
    backgroundColor: theme.colors.emergency,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  returnToPCRButtonText: {
    ...theme.typography.button,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  historyButtonText: {
    ...theme.typography.button,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos para seção de informações e botões de apoio
  infoSection: {
    backgroundColor: '#FFF5F5',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  supportButtonsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  rcpQualityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    flex: 1,
  },
  rcpQualityText: {
    ...theme.typography.button,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    fontSize: 12,
  },
  rcpQualityButtonFullWidth: {
    flex: 1,
    // Remove a limitação de flexbox quando for o único botão
  },
  // Estilos para o header fixo do modal das causas reversíveis
  reversibleCausesModalContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
  },
  fixedModalHeader: {
    backgroundColor: 'white',
    padding: theme.spacing.xl,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Estilos para elementos colapsáveis
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    cursor: 'pointer',
  },
  expandButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  causeTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
    marginBottom: theme.spacing.sm,
    flex: 1,
    flexShrink: 1,
  },
  collapsibleContent: {
    marginTop: theme.spacing.sm,
  },
  // Estilos para histórico de ações realizadas
  actionsHistoryContainer: {
    backgroundColor: 'white',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionsHistoryTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  actionsHistoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  actionCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    minWidth: 80,
    flex: 1,
  },
  actionCounterText: {
    ...theme.typography.body2,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  protocolIndicators: {
    backgroundColor: '#F0F8FF',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#E6F3FF',
  },
  protocolTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  protocolStatus: {
    gap: theme.spacing.xs,
  },
  protocolText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    lineHeight: 18,
  },
});
