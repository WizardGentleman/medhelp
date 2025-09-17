import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { theme } from '@/styles/theme';
import { ScreenHeader } from '@/components/ScreenHeader';

// Dados das profilaxias para referência
const treatmentDatabase = {
  antihepatite: {
    entecavir: {
      drug: 'Entecavir 0,5 mg',
      dose: 'Via Oral 24/24h',
      color: '#FF9800',
      indication: 'Utilizado durante tratamentos imunossupressores, especialmente com Rituximab.',
    },
    tenofovir: {
      drug: 'Tenofovir 300 mg', 
      dose: 'Via Oral 24/24h',
      color: '#FF9800',
      indication: 'Utilizado durante tratamentos imunossupressores, especialmente com Rituximab.',
    }
  },
  antiherpes: {
    drug: 'Aciclovir 400 mg',
    dose: 'Via Oral 12/12h',
    color: '#F44336',
    indication: 'Aplicável em leucemias em fase de quimioterapia de indução, transplantes de medula óssea e mielomas múltiplos em uso de inibidores de proteasoma (Bortezomibe, Carfilzomibe, Ixazomibe).',
  },
  antiestrongiloide: {
    drug: 'Ivermectina',
    dose: 'Via Oral Dose Única',
    doseDetail: '15-24 kg: ½ comp | 25-35 kg: 1 comp | 36-50 kg: 1½ comp | 51-65 kg: 2 comp | 66-79 kg: 2½ comp | ≥80 kg: 200 mcg/kg',
    color: '#9C27B0',
    indication: 'Deve ser administrado antes do início de qualquer tratamento imunossupressor.',
  },
  antifungica: {
    fluconazol: {
      drug: 'Fluconazol 400 mg',
      dose: 'Via Oral 24/24h',
      color: '#2196F3',
      indication: 'Indicado para Leucemia Linfocítica Crônica em uso de Fludarabina, neutrófilos abaixo de 500/mm³, alto risco de neutropenia febril.',
    },
    voriconazol: {
      drug: 'Voriconazol 200 mg',
      dose: 'Via Oral 12/12h', 
      color: '#2196F3',
      indication: 'Neutropenia profunda (<500 células/μL, especialmente <100 células/μL) ou prolongada (>7 dias).',
    }
  },
  antipneumocistose: {
    drug: 'SMX-TMP 800/160 mg',
    dose: 'Via Oral 3x/semana',
    color: '#4CAF50',
    indication: 'Para leucemia linfoblástica aguda, mieloma múltiplo, pós-transplante de medula óssea.',
  },
  // Tratamentos para HIV/AIDS
  pneumocystis_hiv: {
    drug: 'Sulfametoxazol-Trimetoprima 800/160 mg',
    dose: '1 comprimido, 3x por semana',
    alternativa: 'Alternativa: Dapsona 100mg/dia',
    color: '#4CAF50',
    indication: 'Profilaxia para Pneumocystis jirovecii em pacientes HIV+ com CD4+ < 200/mm³ ou presença de candidiase oral, doença definidora de AIDS ou febre de origem indeterminada ≥ 14 dias.',
    suspensao: 'CD4+ > 200/mm³ por pelo menos 3 meses'
  },
  histoplasma_hiv: {
    drug: 'Itraconazol 200 mg',
    dose: '1 comprimido ao dia',
    color: '#FF5722',
    indication: 'Profilaxia para Histoplasma capsulatum em pacientes HIV+ com CD4+ < 150/mm³.',
    suspensao: 'CD4+ > 150/mm³ com carga viral indetectável por no mínimo 6 meses'
  },
  toxoplasma_hiv: {
    drug: 'Sulfametoxazol-Trimetoprima 800/160 mg',
    dose: '1 comprimido ao dia (ou 3x por semana se sorologia IgG negativa)',
    alternativa: 'Alternativas: Dapsona 50mg/dia + pirimetamina 50mg/semana + ácido folínico 10mg 3x/semana OU clindamicina 600mg 8/8h + pirimetamina 25 a 50mg/dia + ácido folínico 10mg 3x/semana',
    color: '#9C27B0',
    indication: 'Profilaxia para Toxoplasma gondii em pacientes HIV+ com CD4+ < 100/mm³.',
    suspensao: 'CD4+ > 200/mm³ por pelo menos 3 meses'
  },
  mac_hiv: {
    drug: 'Azitromicina 1,2 a 1,5 g',
    dose: '1x por semana',
    alternativa: 'Alternativa: Claritromicina 300mg 12/12h',
    color: '#607D8B',
    indication: 'Profilaxia para Mycobacterium avium complex em pacientes HIV+ com CD4+ < 50/mm³.',
    suspensao: 'Não é necessária se o paciente iniciar terapia antirretroviral efetiva'
  },
  tuberculose_hiv: {
    drug: 'Isoniazida 5mg/kg/dia (dose máx. 300mg/dia)',
    dose: 'Associação com piridoxina 50mg/dia para reduzir o risco de neuropatia',
    alternativa: 'Alternativa: Rifampicina na dose de 10 mg/kg (dose máxima de 600 mg/dia)',
    color: '#795548',
    indication: 'Profilaxia para Mycobacterium tuberculosis (tuberculose latente) em pacientes HIV+ com PT >5mm ou história de contato com paciente bacilifero ou Rx de tórax com cicatriz de TB sem tratamento prévio.',
    suspensao: 'Duração de 6-9 meses para isoniazida (preferencialmente a utilização de 270 doses em 9-12 meses) ou 4 meses para rifampicina',
    observacao: 'Avaliar cuidadosamente para descartar tuberculose ativa antes do início da profilaxia. Monitorar função hepática durante o tratamento.'
  }
};

// Questões do questionário interativo
const questions = [
  {
    id: 1,
    question: "Selecione o tipo de paciente:",
    options: [
      { id: 'hiv_aids', text: 'PACIENTES - HIV/AIDS', next: 100 }, // Será implementado em breve
      { id: 'hematological', text: 'PACIENTES HEMATOLÓGICOS', next: 2 }
    ]
  },
  {
    id: 2,
    question: "O paciente iniciará tratamento imunossupressor?",
    options: [
      { id: 'yes', text: 'Sim', next: 3 },
      { id: 'no', text: 'Não', next: 3 }
    ]
  },
  {
    id: 3, 
    question: "Selecione o diagnóstico e/ou medicações:",
    multipleChoice: true,
    options: [
      { id: 'leukemia_induction', text: 'Leucemia em quimioterapia de indução', treatments: ['antiherpes'] },
      { id: 'leukemia_chronic', text: 'Leucemia Linfocítica Crônica', next: 4 },
      { id: 'lla_lma', text: 'Leucemia Linfoblástica Aguda/Leucemia Mieloide Aguda', treatments: ['antifungica'], specific: 'fluconazol' },
      { id: 'myeloma', text: 'Mieloma Múltiplo', next: 5 },
      { id: 'transplant', text: 'Transplante de Medula Óssea', next: 8 },
      { id: 'rituximab', text: 'Imunossupressão com Rituximab', next: 6 },
      { id: 'prednisona', text: 'Prednisona >20mg >4 semanas', treatments: ['antipneumocistose'] },
      { id: 'purine_analogs', text: 'Quimioterapia com análogos da Purina (fludarabina, cladribina, nelarabina e pentostatina)', treatments: ['antifungica', 'antipneumocistose'] },
      { id: 'intensive_chemo', text: 'Quimioterapia intensiva', treatments: ['antifungica'], specific: 'fluconazol' },
      { id: 'low_neutrophils', text: 'Neutrófilos < 500/mm³ ou alto risco para neutropenia febril', treatments: ['antifungica'], specific: 'fluconazol' },
      { id: 'profound_neutropenia', text: 'Neutropenia profunda ou prolongada', treatments: ['antifungica'], specific: 'voriconazol' }
    ]
  },
  {
    id: 4,
    question: "O paciente usará Fludarabina?",
    options: [
      { id: 'fludarabina_yes', text: 'Sim', treatments: ['antifungica'], specific: 'fluconazol' },
      { id: 'fludarabina_no', text: 'Não', treatments: [] }
    ]
  },
  {
    id: 5,
    question: "O paciente usará inibidores de proteasoma?",
    subtitle: "(Ex: Bortezomibe, Carfilzomibe, Ixazomibe)",
    options: [
      { id: 'protease_yes', text: 'Sim', treatments: ['antiherpes', 'antipneumocistose'] },
      { id: 'protease_no', text: 'Não', treatments: ['antipneumocistose'] }
    ]
  },
  {
    id: 6,
    question: "Qual o status sorológico da hepatite?",
    options: [
      { id: 'hbc_pos_hbs_pos', text: 'antiHBC + / HBsAg +', treatments: ['antihepatite'], specific: 'entecavir' },
      { id: 'hbc_pos_hbs_neg', text: 'antiHBC + / HBsAg -', treatments: ['antihepatite'], specific: 'tenofovir' }
    ]
  },
  {
    id: 7,
    question: "Qual a contagem de neutrófilos?",
    options: [
      { id: 'low_neutrophils', text: 'Neutrófilos < 500/mm³', treatments: ['antifungica'], specific: 'fluconazol' },
      { id: 'profound_neutropenia', text: 'Neutropenia profunda/prolongada', treatments: ['antifungica'], specific: 'voriconazol' },
      { id: 'normal', text: 'Contagem normal', next: 'end' }
    ]
  },
  {
    id: 8,
    question: "O paciente usará inibidores de proteasoma?",
    subtitle: "(Ex: Bortezomibe, Carfilzomibe, Ixazomibe)",
    options: [
      { id: 'transplant_protease_yes', text: 'Sim', treatments: ['antiherpes', 'antipneumocistose'] },
      { id: 'transplant_protease_no', text: 'Não', treatments: ['antipneumocistose'] }
    ]
  },
  // Perguntas HIV/AIDS
  {
    id: 100,
    question: "Selecione a situação clínica do paciente HIV+:",
    multipleChoice: true,
    options: [
      { id: 'candidiasis', text: 'Presença de candidíase oral', treatments: ['pneumocystis_hiv'] },
      { id: 'aids_defining', text: 'Doença definidora de AIDS', treatments: ['pneumocystis_hiv'] },
      { id: 'fever_14_days', text: 'Febre de origem indeterminada ≥ 14 dias', treatments: ['pneumocystis_hiv'] },
      { id: 'cd4_200', text: 'LT-CD4+ < 200/mm³', treatments: ['pneumocystis_hiv'] },
      { id: 'cd4_150', text: 'LT-CD4+ < 150/mm³', treatments: ['pneumocystis_hiv', 'histoplasma_hiv'] },
      { id: 'cd4_100', text: 'LT-CD4+ < 100/mm³', treatments: ['pneumocystis_hiv', 'histoplasma_hiv', 'toxoplasma_hiv'] },
      { id: 'cd4_50', text: 'LT-CD4+ < 50/mm³', treatments: ['pneumocystis_hiv', 'histoplasma_hiv', 'toxoplasma_hiv', 'mac_hiv'] },
      { id: 'tuberculose_latente', text: 'PT >5mm ou história de contato com paciente bacílifero ou Rx de tórax com cicatriz de TB sem tratamento prévio', treatments: ['tuberculose_hiv'] }
    ]
  }
];

export default function ProfilaxiaImunossuprimidoScreen() {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [answers, setAnswers] = useState({});
  const [recommendedTreatments, setRecommendedTreatments] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [patientWeight, setPatientWeight] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const getCurrentQuestion = () => {
    return questions.find(q => q.id === currentQuestionId);
  };

  const handleMultipleChoice = (option) => {
    const isSelected = selectedOptions.find(selected => selected.id === option.id);
    
    if (isSelected) {
      // Remove se já estava selecionado
      setSelectedOptions(selectedOptions.filter(selected => selected.id !== option.id));
    } else {
      // Adiciona se não estava selecionado
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleNext = () => {
    if (selectedOptions.length === 0) {
      Alert.alert('Atenção', 'Selecione ao menos uma opção para continuar.');
      return;
    }

    // Verificar se alguma opção tem pergunta secundária
    const optionWithNext = selectedOptions.find(option => option.next);
    
    if (optionWithNext) {
      // Se tem pergunta secundária, vai para ela
      setCurrentQuestionId(optionWithNext.next);
      setAnswers({ ...answers, [currentQuestionId]: selectedOptions });
      setSelectedOptions([]);
      return;
    }

    // Processar tratamentos das opções selecionadas
    let allTreatments = [];
    let specificTreatments = {};
    
    selectedOptions.forEach(option => {
      if (option.treatments) {
        allTreatments = [...allTreatments, ...option.treatments];
        
        // Armazenar specific se existir
        if (option.specific) {
          option.treatments.forEach(treatment => {
            specificTreatments[treatment] = option.specific;
          });
        }
      }
    });

    // Remover duplicatas
    allTreatments = [...new Set(allTreatments)];

    // Adiciona antiestrongiloide se iniciará tratamento
    if (answers[2] && answers[2].id === 'yes') {
      allTreatments.unshift('antiestrongiloide');
    }

    // Armazenar informações específicas para uso posterior
    setAnswers({ ...answers, specificTreatments });
    setRecommendedTreatments(allTreatments);
    setIsCompleted(true);
  };

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [currentQuestionId]: option };
    setAnswers(newAnswers);

    // Se tem tratamentos definidos na opção
    if (option.treatments) {
      let treatments = [...option.treatments];
      
      // Adiciona antiestrongiloide se iniciará tratamento
      if (answers[2] && answers[2].id === 'yes') {
        treatments.unshift('antiestrongiloide');
      }

      setRecommendedTreatments(treatments);
      setIsCompleted(true);
      return;
    }

    // Navegar para próxima pergunta
    if (option.next) {
      if (option.next === 'end') {
        setIsCompleted(true);
      } else {
        setCurrentQuestionId(option.next);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionId(1);
    setAnswers({});
    setRecommendedTreatments([]);
    setIsCompleted(false);
    setSelectedOptions([]);
  };

  const renderTreatmentRecommendation = (treatmentKey, specific = null) => {
    let treatment;
    let cardTitle = treatmentKey;
    
    if (treatmentKey === 'antihepatite' && specific) {
      treatment = treatmentDatabase[treatmentKey][specific];
    } else if (treatmentKey === 'antifungica' && specific) {
      treatment = treatmentDatabase[treatmentKey][specific];
    } else {
      treatment = treatmentDatabase[treatmentKey];
    }

    // Títulos personalizados para tratamentos HIV
    if (treatmentKey === 'pneumocystis_hiv') cardTitle = 'Profilaxia Pneumocystis';
    else if (treatmentKey === 'histoplasma_hiv') cardTitle = 'Profilaxia Histoplasma';
    else if (treatmentKey === 'toxoplasma_hiv') cardTitle = 'Profilaxia Toxoplasma';
    else if (treatmentKey === 'mac_hiv') cardTitle = 'Profilaxia MAC';
    else if (treatmentKey === 'tuberculose_hiv') cardTitle = 'Profilaxia Tuberculose';
    else cardTitle = treatmentKey.charAt(0).toUpperCase() + treatmentKey.slice(1).replace(/([A-Z])/g, ' $1');

    if (!treatment) return null;

    return (
      <View key={treatmentKey} style={styles.recommendationCard}>
        <View style={[styles.recommendationHeader, { backgroundColor: treatment.color }]}>
          <Text style={styles.recommendationTitle}>{cardTitle}</Text>
        </View>
        <View style={styles.recommendationContent}>
          {/* Indicação clínica destacada para tratamentos HIV */}
          {treatmentKey.includes('_hiv') && (
            <Text style={styles.clinicalIndicationText}>{treatment.indication}</Text>
          )}
          
          <Text style={styles.drugText}>{treatment.drug}</Text>
          <Text style={styles.doseText}>{treatment.dose}</Text>
          {treatment.doseDetail && (
            <Text style={styles.doseDetailText}>{treatment.doseDetail}</Text>
          )}
          {treatment.alternativa && (
            <View style={styles.alternativaContainer}>
              <Text style={styles.alternativaTitle}>💊 Alternativa:</Text>
              <Text style={styles.alternativaText}>{treatment.alternativa}</Text>
            </View>
          )}
          {/* Indicação clínica normal para outros tratamentos */}
          {!treatmentKey.includes('_hiv') && (
            <Text style={styles.indicationText}>{treatment.indication}</Text>
          )}
          
          {/* Critério de suspensão para tratamentos HIV */}
          {treatment.suspensao && (
            <View style={styles.suspensaoContainer}>
              <Text style={styles.suspensaoTitle}>Critério de Suspensão:</Text>
              <Text style={styles.suspensaoText}>{treatment.suspensao}</Text>
            </View>
          )}
          
          {/* Observação sobre criptococose para tratamentos HIV */}
          {treatment.observacao && (
            <View style={styles.observacaoContainer}>
              <Text style={styles.observacaoTitle}>⚠️ Observação Importante:</Text>
              <Text style={styles.observacaoText}>{treatment.observacao}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Assistente de Profilaxia" type="clinical" />
      <ScrollView contentContainerStyle={styles.content}>
        {!isCompleted ? (
          <>
            <View style={styles.questionCard}>
              <Text style={styles.questionNumber}>Pergunta {currentQuestionId}</Text>
              <Text style={styles.questionText}>{getCurrentQuestion()?.question}</Text>
              {getCurrentQuestion()?.subtitle && (
                <Text style={styles.questionSubtitle}>{getCurrentQuestion()?.subtitle}</Text>
              )}
            </View>

            <View style={styles.optionsContainer}>
              {getCurrentQuestion()?.options?.map((option, index) => {
                const isSelected = selectedOptions.find(selected => selected.id === option.id);
                const isMultipleChoice = getCurrentQuestion()?.multipleChoice;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      isSelected && styles.selectedOptionButton
                    ]}
                    onPress={() => isMultipleChoice ? handleMultipleChoice(option) : handleAnswer(option)}
                  >
                    <Text style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText
                    ]}>{option.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {getCurrentQuestion()?.multipleChoice && (
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>➤ Próximo</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>✅ Recomendações de Profilaxia</Text>
              {recommendedTreatments.length > 0 ? (
                <Text style={styles.resultSubtitle}>
                  Baseado nas informações fornecidas, recomendamos:
                </Text>
              ) : (
                <Text style={styles.resultSubtitle}>
                  Nenhuma profilaxia específica recomendada baseada nas informações fornecidas.
                </Text>
              )}
            </View>

            {recommendedTreatments.map((treatment) => {
              // Buscar o specific se existir na resposta ou nas specificTreatments
              const specificAnswer = Object.values(answers).find(a => a.specific);
              const specificFromMultiple = answers.specificTreatments && answers.specificTreatments[treatment];
              const specific = specificAnswer ? specificAnswer.specific : specificFromMultiple;
              return renderTreatmentRecommendation(treatment, specific);
            })}

            {/* Card informativo sobre CrAg-LFA para pacientes HIV */}
            {recommendedTreatments.some(treatment => treatment.includes('_hiv')) && (
              <View style={styles.cragInfoCard}>
                <Text style={styles.cragInfoTitle}>🔬 Avaliação para Criptococose</Text>
                <Text style={styles.cragInfoText}>
                  Pacientes assintomáticos com CD4 {'<'} 200/mm³ devem ser avaliados com CrAg-LFA (Cryptococcal Antigen Lateral Flow Assay) para criptococose. 
                  Se CrAg positivo, investigar com líquor e hemoculturas; se positivo, tratar como criptococose se negativo, considerar criptococose em estágio incipiente (inicial). 
                  Caso CrAg positivo mais líquor e hemocultura negativos, pode realizar fluconazol profilático por 10 semanas.
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.resetButton} onPress={resetQuiz}>
              <Text style={styles.resetButtonText}>🔄 Nova Consulta</Text>
            </TouchableOpacity>

            <View style={styles.disclaimerCard}>
              <Text style={styles.disclaimerText}>
                ⚠️ Esta ferramenta oferece sugestões baseadas em diretrizes gerais. 
                Sempre consulte as diretrizes institucionais e avalie individualmente cada caso.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderTopWidth: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
  cardContent: {
    padding: theme.spacing.lg,
  },
  prescriptionContainer: {
    marginBottom: theme.spacing.lg,
  },
  drugText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  doseText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  indicationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  infoCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: '#009688',
  },
  infoTextContainer: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  infoTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
  },
  legendContainer: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
  },
  legendTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    marginBottom: theme.spacing.sm,
  },
  legendText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
  },
  // Estilos para interface interativa
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#009688',
    marginBottom: theme.spacing.xs,
  },
  questionText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    lineHeight: 24,
  },
  questionSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  optionsContainer: {
    gap: theme.spacing.sm,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    textAlign: 'center',
  },
  selectedOptionButton: {
    borderColor: '#009688',
    backgroundColor: '#E0F2F1',
  },
  selectedOptionText: {
    color: '#009688',
    fontFamily: 'Roboto-Bold',
  },
  nextButton: {
    backgroundColor: '#009688',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
  resultCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  resultTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.xs,
  },
  resultSubtitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    lineHeight: 20,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationHeader: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  recommendationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  recommendationContent: {
    padding: theme.spacing.lg,
  },
  doseDetailText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    fontStyle: 'normal',
  },
  resetButton: {
    backgroundColor: '#009688',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  resetButtonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
  disclaimerCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: '#FF9800',
  },
  disclaimerText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#E65100',
    lineHeight: 18,
    textAlign: 'center',
  },
  // Estilos para tratamentos HIV
  suspensaoContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  suspensaoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#F57700',
    marginBottom: theme.spacing.xs,
  },
  suspensaoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#E65100',
    lineHeight: 18,
  },
  observacaoContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  observacaoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.xs,
  },
  observacaoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#1B5E20',
    lineHeight: 18,
  },
  // Estilos para alternativas de tratamento
  alternativaContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#F3E5F5',
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: '#9C27B0',
  },
  alternativaTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#7B1FA2',
    marginBottom: theme.spacing.xs,
  },
  alternativaText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#6A1B9A',
    lineHeight: 18,
  },
  // Estilos para card de informações CrAg-LFA
  cragInfoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cragInfoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.md,
  },
  cragInfoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#0D47A1',
    lineHeight: 20,
  },
  // Estilo para indicação clínica destacada nos tratamentos HIV
  clinicalIndicationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    backgroundColor: '#E8F5E8',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
});
