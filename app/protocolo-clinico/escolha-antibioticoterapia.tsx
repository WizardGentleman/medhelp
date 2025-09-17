import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { Search, Pill, FileText } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { ScreenHeader } from '@/components/ScreenHeader';

// Base de dados de infecções pesquisáveis
const infectionsDatabase = [
  { id: 'pneumonia_comunitaria', name: 'Pneumonia Comunitária', keywords: ['pneumonia', 'comunitaria', 'pac', 'respiratorio'] },
  { id: 'infeccao_urinaria', name: 'Infecção Urinária', keywords: ['infeccao', 'urinaria', 'itu', 'cistite', 'urina'] },
  { id: 'celulite', name: 'Celulite', keywords: ['celulite', 'pele', 'partes', 'moles', 'subcutaneo'] },
  { id: 'pneumonia_hospitalar', name: 'Pneumonia Hospitalar', keywords: ['pneumonia', 'hospitalar', 'nosocomial'] },
  { id: 'pielonefrite', name: 'Pielonefrite', keywords: ['pielonefrite', 'rim', 'renal', 'urinaria', 'alta'] },
  { id: 'abscesso', name: 'Abscesso', keywords: ['abscesso', 'pus', 'colecao'] },
  { id: 'diverticulite', name: 'Diverticulite', keywords: ['diverticulite', 'diverticulo', 'abdominal'] },
  { id: 'colecistite', name: 'Colecistite', keywords: ['colecistite', 'vesicula', 'biliar'] },
  { id: 'apendicite', name: 'Apendicite', keywords: ['apendicite', 'apendice', 'abdominal'] },
];

// Dados das antibioticoterapias para referência (será expandido posteriormente)
const treatmentDatabase = {
  // Exemplos iniciais - serão expandidos conforme suas necessidades
  pneumonia_comunitaria: {
    drug: 'Amoxicilina/Clavulanato 875/125 mg',
    dose: 'Via Oral 12/12h por 7-10 dias',
    color: '#2196F3',
    indication: 'Tratamento de primeira linha para pneumonia adquirida na comunidade em pacientes ambulatoriais.',
    alternativa: 'Alternativa: Azitromicina 500mg/dia por 3 dias ou Claritromicina 500mg 12/12h por 7 dias',
  },
  infeccao_urinaria: {
    drug: 'Nitrofurantoína 100 mg',
    dose: 'Via Oral 6/6h por 7 dias',
    color: '#FF9800',
    indication: 'Tratamento de primeira linha para infecção urinária baixa não complicada.',
    alternativa: 'Alternativa: SMX-TMP 800/160mg 12/12h por 3 dias',
  },
  celulite: {
    drug: 'Cefalexina 500 mg',
    dose: 'Via Oral 6/6h por 7-10 dias',
    color: '#4CAF50',
    indication: 'Tratamento de primeira linha para celulite não complicada.',
    alternativa: 'Alternativa: Clindamicina 300mg 8/8h por 7-10 dias',
  }
};

// Questões do questionário interativo (estrutura inicial)
const questions = [
  {
    id: 1,
    question: "Qual o sítio de infecção?",
    options: [
      { id: 'respiratorio', text: 'SISTEMA RESPIRATÓRIO', next: 2 },
      { id: 'urinario', text: 'SISTEMA URINÁRIO', next: 3 },
      { id: 'pele_partes_moles', text: 'PELE E PARTES MOLES', next: 4 },
      { id: 'intra_abdominal', text: 'INFECÇÃO INTRA-ABDOMINAL', next: 5 }
    ]
  },
  {
    id: 2,
    question: "Qual o quadro respiratório?",
    options: [
      { id: 'pneumonia_comunitaria', text: 'Pneumonia Adquirida na Comunidade', treatments: ['pneumonia_comunitaria'] },
      { id: 'pneumonia_hospitalar', text: 'Pneumonia Hospitalar', next: 'end' },
      { id: 'exacerbacao_dpoc', text: 'Exacerbação de DPOC', next: 'end' }
    ]
  },
  {
    id: 3,
    question: "Qual o tipo de infecção urinária?",
    options: [
      { id: 'itu_baixa', text: 'ITU Baixa Não Complicada', treatments: ['infeccao_urinaria'] },
      { id: 'itu_complicada', text: 'ITU Complicada', next: 'end' },
      { id: 'pielonefrite', text: 'Pielonefrite', next: 'end' }
    ]
  },
  {
    id: 4,
    question: "Qual o tipo de infecção de pele?",
    options: [
      { id: 'celulite_simples', text: 'Celulite Não Complicada', treatments: ['celulite'] },
      { id: 'abscesso', text: 'Abscesso', next: 'end' },
      { id: 'fasciite', text: 'Fasciite Necrotizante', next: 'end' }
    ]
  },
  {
    id: 5,
    question: "Qual o tipo de infecção intra-abdominal?",
    options: [
      { id: 'diverticulite', text: 'Diverticulite', next: 'end' },
      { id: 'colecistite', text: 'Colecistite', next: 'end' },
      { id: 'apendicite', text: 'Apendicite', next: 'end' }
    ]
  }
];

export default function EscolhaAntibioticoterapiaScreen() {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [answers, setAnswers] = useState({});
  const [recommendedTreatments, setRecommendedTreatments] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuestionario, setShowQuestionario] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filtrar sugestões baseado no termo de busca
  const filteredInfections = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return infectionsDatabase.filter(infection =>
      infection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      infection.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ).slice(0, 5); // Mostrar máximo 5 sugestões
  }, [searchQuery]);

  const getCurrentQuestion = () => {
    return questions.find(q => q.id === currentQuestionId);
  };

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [currentQuestionId]: option };
    setAnswers(newAnswers);

    // Se tem tratamentos definidos na opção
    if (option.treatments) {
      setRecommendedTreatments(option.treatments);
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
    setSearchQuery('');
    setShowQuestionario(true);
    setShowSuggestions(false);
  };

  const handleSearchInput = (text) => {
    setSearchQuery(text);
    setShowSuggestions(text.length >= 2);
  };

  const handleSelectInfection = (infection) => {
    setSearchQuery(infection.name);
    setShowSuggestions(false);
    
    // Buscar tratamento na base de dados
    if (treatmentDatabase[infection.id]) {
      setRecommendedTreatments([infection.id]);
      setIsCompleted(true);
      setShowQuestionario(false);
    } else {
      Alert.alert('Em breve', 'Tratamento para esta infecção será adicionado em breve. Use o questionário guiado.');
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      Alert.alert('Atenção', 'Digite o nome da infecção para pesquisar.');
      return;
    }
    
    // Buscar na base de dados de infecções
    const foundInfection = infectionsDatabase.find(infection =>
      infection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      infection.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    if (foundInfection && treatmentDatabase[foundInfection.id]) {
      setRecommendedTreatments([foundInfection.id]);
      setIsCompleted(true);
      setShowQuestionario(false);
      setShowSuggestions(false);
    } else {
      Alert.alert('Não encontrado', 'Infecção não encontrada na base de dados. Tente usar o questionário guiado.');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectInfection(item)}
    >
      <Pill size={16} color="#FF8F00" />
      <Text style={styles.suggestionText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderTreatmentRecommendation = (treatmentKey) => {
    const treatment = treatmentDatabase[treatmentKey];
    
    if (!treatment) return null;

    const cardTitle = treatmentKey.charAt(0).toUpperCase() + treatmentKey.slice(1).replace(/_/g, ' ');

    return (
      <View key={treatmentKey} style={styles.recommendationCard}>
        <View style={[styles.recommendationHeader, { backgroundColor: treatment.color }]}>
          <Pill size={20} color="#FFFFFF" style={{ marginRight: theme.spacing.sm }} />
          <Text style={styles.recommendationTitle}>{cardTitle}</Text>
        </View>
        <View style={styles.recommendationContent}>
          <Text style={styles.drugText}>{treatment.drug}</Text>
          <Text style={styles.doseText}>{treatment.dose}</Text>
          
          <Text style={styles.indicationText}>{treatment.indication}</Text>
          
          {treatment.alternativa && (
            <View style={styles.alternativaContainer}>
              <Text style={styles.alternativaTitle}>💊 Alternativa:</Text>
              <Text style={styles.alternativaText}>{treatment.alternativa}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Escolha de Antibioticoterapia" type="clinical" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Card de Introdução */}
        <View style={styles.infoCard}>
          <Pill size={24} color="#FF8F00" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>🔍 Assistente de Antibioticoterapia</Text>
            <Text style={styles.infoText}>
              Escolha a antibioticoterapia adequada através de busca direta ou questionário guiado baseado em diretrizes clínicas.
            </Text>
          </View>
        </View>

        {/* Área de Pesquisa */}
        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}>🔍 Busca Rápida</Text>
          <Text style={styles.searchSubtitle}>Digite o nome da infecção para ir direto ao tratamento:</Text>
          
          <View style={styles.searchInputContainer}>
            <View style={styles.searchContainer}>
              <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Ex: pneumonia, infecção urinária, celulite..."
                value={searchQuery}
                onChangeText={handleSearchInput}
                onFocus={() => setShowSuggestions(searchQuery.length >= 2)}
                onSubmitEditing={handleSearch}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {showSuggestions && filteredInfections.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={filteredInfections}
                  renderItem={renderSuggestionItem}
                  keyExtractor={(item) => item.id}
                  style={styles.suggestionsList}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}
            
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Search size={20} color="#FFFFFF" />
              <Text style={styles.searchButtonText}>Pesquisar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divisor */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Questionário Guiado */}
        {showQuestionario && !isCompleted ? (
          <>
            <View style={styles.questionarioHeader}>
              <FileText size={24} color="#FF8F00" />
              <Text style={styles.questionarioTitle}>Questionário Guiado</Text>
            </View>

            <View style={styles.questionCard}>
              <Text style={styles.questionNumber}>Pergunta {currentQuestionId}</Text>
              <Text style={styles.questionText}>{getCurrentQuestion()?.question}</Text>
            </View>

            <View style={styles.optionsContainer}>
              {getCurrentQuestion()?.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(option)}
                >
                  <Text style={styles.optionText}>{option.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : isCompleted ? (
          <>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>✅ Recomendação de Antibioticoterapia</Text>
              {recommendedTreatments.length > 0 ? (
                <Text style={styles.resultSubtitle}>
                  Baseado nas informações fornecidas, recomendamos:
                </Text>
              ) : (
                <Text style={styles.resultSubtitle}>
                  Nenhum tratamento específico encontrado. Consulte um especialista.
                </Text>
              )}
            </View>

            {recommendedTreatments.map((treatment) => 
              renderTreatmentRecommendation(treatment)
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
        ) : null}
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
  infoCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: '#FF8F00',
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
    lineHeight: 18,
  },
  searchCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3',
  },
  searchTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  searchSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  searchInputContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: theme.spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
  },
  clearButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  clearButtonText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto-Bold',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    maxHeight: 200,
    zIndex: 1000,
    marginTop: -theme.spacing.sm,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  suggestionText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  searchButton: {
    backgroundColor: '#2196F3',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  searchButtonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.md,
  },
  questionarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  questionarioTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
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
    color: '#FF8F00',
    marginBottom: theme.spacing.xs,
  },
  questionText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    lineHeight: 24,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
  recommendationContent: {
    padding: theme.spacing.lg,
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
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
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
  resetButton: {
    backgroundColor: '#FF8F00',
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
});
