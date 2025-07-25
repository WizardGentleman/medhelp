import { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Modal, Animated } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Clock, Play, Pause, RotateCcw, Heart, Activity, Syringe, CircleAlert as AlertCircle, TriangleAlert as AlertTriangle, ArrowLeft } from 'lucide-react-native';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (Platform.OS === 'web') {
      audioRef.current = new Audio('/alert.mp3');
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
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
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

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
    pulseAnim.setValue(1);
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

  const handleRhythmSelection = (rhythm: RhythmType) => {
    setRhythmCheckCountdown(120);
    const nextCheck = new Date();
    nextCheck.setMinutes(nextCheck.getMinutes() + 2);
    setNextRhythmCheck(nextCheck);

    if (rhythm !== rhythmType) {
      setRhythmType(rhythm);
      setCurrentStep('intervention');
      addIntervention('rhythm-check', `Ritmo identificado: ${rhythm === 'vf-vt' ? 'FV/TV' : 'Assistolia/AESP'}`);
    }
    
    setShowRhythmModal(false);
  };

  const getNextMedicationInfo = () => {
    if (rhythmType === 'vf-vt') {
      if (!lastMedicationType || lastMedicationType === 'amiodarone' || lastMedicationType === 'lidocaine') {
        return {
          type: 'epinephrine',
          name: 'Epinefrina 1mg',
          color: theme.colors.emergency
        };
      } else {
        return {
          type: 'antiarrhythmic',
          name: 'Amiodarona 300mg',
          color: theme.colors.warning
        };
      }
    }
    return {
      type: 'epinephrine',
      name: 'Epinefrina 1mg',
      color: theme.colors.emergency
    };
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
      <Text style={styles.sectionTitle}>Avaliação Inicial</Text>
      <View style={styles.checkList}>
        <Text style={styles.checkItem}>✓ Verificar responsividade</Text>
        <Text style={styles.checkItem}>✓ Verificar pulso central (&lt;10s)</Text>
        <Text style={styles.checkItem}>✓ Verificar respiração</Text>
      </View>
      <Text style={styles.instruction}>
        Selecione o tipo de ritmo identificado:
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

  const renderReversibleCausesModal = () => (
    <Modal
      visible={showReversibleCauses}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <ScrollView style={styles.reversibleCausesScroll}>
          <View style={[styles.modalContent, styles.reversibleCausesModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Causas Reversíveis</Text>
              <TouchableOpacity 
                onPress={() => setShowReversibleCauses(false)}
                style={styles.closeButton}
              >
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.causesSection}>
              <Text style={styles.causesSectionTitle}>5H's</Text>
              <View style={styles.causesList}>
                <Text style={styles.causeItem}>• Hipovolemia</Text>
                <Text style={styles.causeItem}>• Hipóxia</Text>
                <Text style={styles.causeItem}>• Hidrogênio (acidemia)</Text>
                <Text style={styles.causeItem}>• Hipo/hipercalemia</Text>
                <Text style={styles.causeItem}>• Hipotermia</Text>
              </View>
            </View>

            <View style={styles.causesSection}>
              <Text style={styles.causesSectionTitle}>5T's</Text>
              <View style={styles.causesList}>
                <Text style={styles.causeItem}>• Pneumo'T'órax Hipertensivo</Text>
                <Text style={styles.causeItem}>• Tamponamento cardíaco</Text>
                <Text style={styles.causeItem}>• Toxinas</Text>
                <Text style={styles.causeItem}>• Trombose pulmonar</Text>
                <Text style={styles.causeItem}>• Trombose coronária</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderIntervention = () => {
    const nextMedication = getNextMedicationInfo();

    return (
      <View style={styles.interventionContainer}>
        <View style={styles.actionButtons}>
          {rhythmType === 'vf-vt' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.shockButton]}
              onPress={handleShock}
            >
              <Activity size={24} color="white" />
              <Text style={styles.actionButtonText}>Choque</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: nextMedication.color }]}
            onPress={() => addIntervention(nextMedication.type === 'antiarrhythmic' ? 'amiodarone' : 'epinephrine')}
          >
            <Syringe size={24} color="white" />
            <Text style={styles.actionButtonText}>{nextMedication.name}</Text>
          </TouchableOpacity>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                isRhythmCheckDue && styles.actionButtonPulsing,
                { backgroundColor: isRhythmCheckDue ? '#FF4B4B' : theme.colors.emergency }
              ]}
              onPress={handleRhythmCheck}
            >
              <AlertCircle size={24} color="white" />
              <Text style={styles.actionButtonText}>
                {isRhythmCheckDue ? 'VERIFICAR RITMO' : 'Verificar Ritmo'}
              </Text>
              {!isRhythmCheckDue && (
                <Text style={styles.actionButtonTimer}>{formatTime(rhythmCheckCountdown)}</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {rhythmType === 'asystole-pea' && (
          <View style={styles.nonShockableInfo}>
            <Text style={styles.nonShockableText}>
              Administre epinefrina imediatamente e repita a cada 3-5 minutos
            </Text>
            <TouchableOpacity
              style={styles.reversibleCausesButton}
              onPress={() => setShowReversibleCauses(true)}
            >
              <AlertTriangle size={20} color={theme.colors.emergency} />
              <Text style={styles.reversibleCausesText}>
                Causas Reversíveis (5H e 5T)
              </Text>
            </TouchableOpacity>
          </View>
        )}

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

        <View style={styles.timeline}>
          <Text style={styles.timelineTitle}>Registro de Intervenções:</Text>
          {interventions.map((intervention, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineTime}>
                  {intervention.timestamp.toLocaleTimeString()}
                </Text>
                <Text style={styles.timelineElapsed}>
                  T+{intervention.elapsedTime}
                </Text>
              </View>
              <Text style={styles.timelineText}>
                {intervention.details || intervention.type}
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
      {renderReversibleCausesModal()}
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
  actionButton: {
    backgroundColor: theme.colors.emergency,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110,
    flex: 1,
    maxWidth: 150,
    height: 48,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  shockButton: {
    backgroundColor: theme.colors.emergency,
    flex: 1.5,
    maxWidth: 170,
    height: 48,
  },
  actionButtonText: {
    ...theme.typography.button,
    color: 'white',
    textAlign: 'center',
    fontSize: 11,
  },
  actionButtonTimer: {
    ...theme.typography.caption,
    color: 'white',
    textAlign: 'center',
    fontSize: 9,
    marginTop: 2,
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
});