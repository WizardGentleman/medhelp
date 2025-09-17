import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { AlertTriangle, GitBranch, BookOpen, Construction } from 'lucide-react-native';

export default function ReacoesTransfusionaisScreen() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('initial');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [diagnosis, setDiagnosis] = useState<string[]>([]);
  const [flowchartStarted, setFlowchartStarted] = useState(false);

  const toggleCard = (cardIndex: number) => {
    setExpandedCard(expandedCard === cardIndex ? null : cardIndex);
    if (cardIndex === 1) {
      resetFlowchart();
    }
  };

  const resetFlowchart = () => {
    setCurrentQuestionId('initial');
    setAnswers({});
    setDiagnosis([]);
    setFlowchartStarted(false);
  };

  const startFlowchart = () => {
    setFlowchartStarted(true);
    setCurrentQuestionId('q1');
  };

  const handleFlowchartAnswer = (answer: string, nextQuestion?: string) => {
    const newAnswers = { ...answers, [currentQuestionId]: answer };
    setAnswers(newAnswers);

    // Lógica do fluxograma baseada na imagem
    if (currentQuestionId === 'q1') {
      // Pergunta sobre Dispneia
      if (answer === 'sim') {
        setCurrentQuestionId('q2_dispneia');
      } else {
        setCurrentQuestionId('q2_febre');
      }
    } else if (currentQuestionId === 'q2_dispneia') {
      // Após dispneia, perguntar sobre febre
      setCurrentQuestionId('q3_dispneia_febre');
    } else if (currentQuestionId === 'q3_dispneia_febre') {
      // Após dispneia e febre, verificar se já pode diagnosticar TRALI
      const temFebre = answer === 'sim';
      
      if (temFebre) {
        // Dispneia + Febre = TRALI (diagnóstico direto, independente da hipotensão)
        setDiagnosis(['TRALI']);
      } else {
        // Continuar perguntando sobre reação cutânea
        setCurrentQuestionId('q4_dispneia_reacao_cutanea');
      }
    } else if (currentQuestionId === 'q4_dispneia_reacao_cutanea') {
      // Lógica final para diagnóstico com dispneia
      const temHipotensao = newAnswers['q2_dispneia'] === 'sim';
      const temFebre = newAnswers['q3_dispneia_febre'] === 'sim';
      const temReacaoCutanea = answer === 'sim';
      
      if (temReacaoCutanea && !temFebre) {
        // Dispneia + Reação cutânea SEM febre = ANAFILAXIA
        setDiagnosis(['ANAFILAXIA']);
      } else if (temFebre || temHipotensao) {
        // Dispneia + (Febre OU Hipotensão) sem reação cutânea = TRALI
        setDiagnosis(['TRALI']);
      } else {
        // Dispneia isolada (sem hipotensão, sem febre, sem reação cutânea) = TACO
        setDiagnosis(['TACO']);
      }
    } else if (currentQuestionId === 'q2_febre') {
      // Pergunta sobre febre (sem dispneia)
      if (answer === 'sim') {
        setCurrentQuestionId('q3_febre_hipotensao');
      } else {
        setCurrentQuestionId('q3_hipotensao');
      }
    } else if (currentQuestionId === 'q3_febre_hipotensao') {
      // Com febre: SIM para hipotensão
      if (answer === 'sim') {
        setCurrentQuestionId('q4_febre_hipotensao_ambos');
      } else {
        // Com febre: NÃO para hipotensão - pode ser RFNH ou CONTAMINAÇÃO BACTERIANA
        setCurrentQuestionId('q4_febre_sem_hipotensao');
      }
    } else if (currentQuestionId === 'q4_febre_hipotensao_ambos') {
      // Febre + Hipotensão - diferenciar RFHA, RFNH/SEPSE ou CONTAMINAÇÃO
      if (answer === 'rfha') {
        setDiagnosis(['RFHA']);
      } else {
        setDiagnosis(['RFNH_SEPSE', 'CONTAMINACAO_BACTERIANA']);
      }
    } else if (currentQuestionId === 'q4_febre_sem_hipotensao') {
      // Febre + Sem hipotensão - diferenciar RFNH ou CONTAMINAÇÃO  
      if (answer === 'rfha') {
        setDiagnosis(['RFHA']);
      } else {
        setDiagnosis(['RFNH', 'CONTAMINACAO_BACTERIANA']);
      }
    } else if (currentQuestionId === 'q3_hipotensao') {
      // Só hipotensão (sem febre)
      if (answer === 'sim') {
        setCurrentQuestionId('q4_reacao_hipotensiva');
      } else {
        setCurrentQuestionId('q4_reacao_cutanea');
      }
    } else if (currentQuestionId === 'q4_reacao_hipotensiva') {
      // Tipo de reação com hipotensão
      if (answer === 'bacteriana') {
        setDiagnosis(['CONTAMINACAO_BACTERIANA']);
      } else {
        setDiagnosis(['REACAO_HIPOTENSIVA']);
      }
    } else if (currentQuestionId === 'q4_reacao_cutanea') {
      // Reação cutânea isolada
      setDiagnosis(['REACAO_ALERGICA']);
    }
  };

  // Funções auxiliares para o fluxograma
  const getQuestionText = (questionId: string): string => {
    const questions: Record<string, string> = {
      'q1': 'O paciente apresenta DISPNEIA?',
      'q2_dispneia': 'Apresenta também HIPOTENSÃO?',
      'q3_dispneia_febre': 'Apresenta também FEBRE?',
      'q4_dispneia_reacao_cutanea': 'Há presença de REAÇÃO CUTÂNEA (urticária, angioedema)?',
      'q2_febre': 'O paciente apresenta FEBRE?',
      'q3_febre_hipotensao': 'Apresenta também HIPOTENSÃO?',
      'q4_rfha_rfnh': 'Há sinais de HEMÓLISE (dor dorso/lombar ou abdome ou sítio da infusão, hematúria, sangramento ao redor de óstios de acesso venoso ou icterícia)?',
      'q4_febre_hipotensao_ambos': 'Há sinais de HEMÓLISE (dor dorso/lombar ou abdome ou sítio da infusão, hematúria, sangramento ao redor de óstios de acesso venoso ou icterícia)?',
      'q4_febre_sem_hipotensao': 'Há sinais de HEMÓLISE (dor dorso/lombar ou abdome ou sítio da infusão, hematúria, sangramento ao redor de óstios de acesso venoso ou icterícia)?',
      'q3_hipotensao': 'O paciente apresenta HIPOTENSÃO?',
      'q4_reacao_hipotensiva': 'Há suspeita de CONTAMINAÇÃO BACTERIANA (sepse)?',
      'q4_reacao_cutanea': 'Há presença de REAÇÃO CUTÂNEA?',
    };
    return questions[questionId] || 'Pergunta não encontrada';
  };

  const getAnswerOptions = (questionId: string): Array<{label: string, value: string}> => {
    if (questionId === 'q4_rfha_rfnh' || questionId === 'q4_febre_hipotensao_ambos' || questionId === 'q4_febre_sem_hipotensao') {
      return [
        { label: 'Sim (Sinais de hemólise)', value: 'rfha' },
        { label: 'Não (Sem hemólise)', value: 'rfnh' }
      ];
    } else if (questionId === 'q4_reacao_hipotensiva') {
      return [
        { label: 'Sim (Suspeita de contaminação)', value: 'bacteriana' },
        { label: 'Não (Hipotensão isolada)', value: 'hipotensiva' }
      ];
    } else {
      return [
        { label: 'Sim', value: 'sim' },
        { label: 'Não', value: 'nao' }
      ];
    }
  };

  const getDiagnosisName = (diagnosis: string): string => {
    const names: Record<string, string> = {
      'TRALI': '🧊 TRALI (Lesão Pulmonar Aguda)',
      'ANAFILAXIA': '🆘 ANAFILAXIA',
      'TACO': '💧 TACO (Sobrecarga Circulatória)',
      'RFNH': '🔥 RFNH (Reação Febril Não Hemolítica)',
      'RFHA': '🆘 RFHA (Reação Hemolítica Aguda)',
      'RFNH_SEPSE': '🔥 RFNH (Reação Febril Não Hemolítica)',
      'CONTAMINACAO_BACTERIANA': '🦠 CONTAMINAÇÃO BACTERIANA',
      'REACAO_HIPOTENSIVA': '🩸 REAÇÃO HIPOTENSIVA',
      'REACAO_ALERGICA': '🤧 REAÇÃO ALÉRGICA',
    };
    return names[diagnosis] || diagnosis;
  };

  const getDiagnosisDescription = (diagnosis: string): React.ReactNode => {
    if (diagnosis === 'TRALI') {
      return (
        <>
          Lesão pulmonar aguda relacionada à transfusão.
          {"\n\n"}
          <Text style={styles.boldText}>Agudo, geralmente {'<'}6 horas após início da transfusão.</Text> Padrão semelhante a Síndrome da angústia respiratória do adulto (SARA).
          {"\n\n"}
          <Text style={styles.boldText}>Critérios Diagnósticos:</Text>
          {"\n"}• Início lesão pulmonar em até sete dias
          {"\n"}• Presença de infiltrado pulmonar bilateral não cardiogênico ou por hipervolemia
          {"\n"}• Hipoxemia: saturação {'<'} 90% em ar ambiente ou PaO₂/FiO₂ ≤ 300
          {"\n\n"}
          Podendo apresentar febre com ou sem calafrios e a pressão arterial podendo estar inalterada ou com tendência a hipotensão.
          {"\n\n"}
          <Text style={styles.boldText}>Observação:</Text> Se houver outra justificativa para SARA, o diagnóstico de TRALI pode ser colocado em questão, principalmente se o paciente já havia sintomas respiratórios antes da transfusão.
          {"\n\n"}
          <Text style={styles.boldText}>Conduta:</Text>
          {"\n"}<Text style={styles.boldText}>• Iniciar suporte ventilatório e hemodinâmico imediatamente.</Text>
        </>
      );
    }
    
    if (diagnosis === 'TACO') {
      return (
        <>
          Sobrecarga circulatória associada à transfusão.
          {"\n\n"}
          <Text style={styles.boldText}>Fatores de risco:</Text> idade elevada, insuficiência cardíaca, grandes volumes de transfusões, balanço hídrico positivo prévio e insuficiência renal.
          {"\n\n"}
          <Text style={styles.boldText}>Quadro Clínico:</Text> Surgimento ou piora de edema pulmonar cardiogênico, geralmente após 6 a 12h da transfusão levando a insuficiência respiratória aguda.
          {"\n\n"}
          Achados esperados são balanço hídrico positivo, sinais de hipervolemia (edema periférico, turgência jugular, crepitações, hepatomegalia e hipertensão), elevação de BNP, aumento da área cardíaca.
          {"\n\n"}
          <Text style={styles.boldText}>Conduta:</Text>
          {"\n"}• Suspensão da transfusão
          {"\n"}• Administrar diuréticos (preferência furosemida), suporte ventilatório e considerar ultrafiltração em casos graves.
          {"\n\n"}
          <Text style={styles.boldText}>Prevenção:</Text>
          {"\n"}• Se paciente hipervolêmico, uma forma de prevenir é prescrever diureticoterapia antes da hemotransfusão ou fracionar em bolsas menores
          {"\n"}• Se paciente em hemodiálise, transfundir antes ou durante a sessão de hemodiálise
        </>
      );
    }
    
    if (diagnosis === 'RFNH') {
      return (
        <>
          <Text style={styles.boldText}>Reação febril mais comum.</Text>
          {"\n\n"}
          <Text style={styles.boldText}>Tempo de Ocorrência:</Text> Ocorre após 1 a 6 horas do início da infusão ou em até 4 horas do término da bolsa.
          {"\n\n"}
          <Text style={styles.boldText}>Quadro Clínico:</Text> Principal sintoma é a febre podendo ser associada ou não a calafrios, náuseas, vômitos e cefaléia.
          {"\n\n"}
          <Text style={styles.boldText}>Diagnóstico:</Text> É de exclusão, uma vez que outras reações transfusionais, no início, podem também se manifestar apenas com febre. Por isso, descarte diagnósticos diferenciais mais graves primeiro.
          {"\n\n"}
          <Text style={styles.boldText}>Solicite</Text> Hemograma completo, contagem de plaquetas, reticulócitos, bilirrubina total e frações, desidrogenase lática, haptoglobina, tempo de tromboplastina parcial ativada, tempo de protrombina, fibrinogênio, D-dímero, proteína C reativa, lactato, creatinina e ureia
          {"\n"}
          <Text style={styles.boldText}>Culturas:</Text> hemocultura, equipo de infusão e bolsa de hemocomponente
          {"\n\n"}
          <Text style={styles.boldText}>Conduta:</Text>
          {"\n"}• <Text style={styles.boldText}>Suspender a hemotransfusão</Text> e descartar o restante da bolsa (a menos que se consiga ter diagnóstico de certeza de <Text style={styles.boldText}>RFNH</Text> em até quatro horas)
          {"\n"}• Administrar antitérmicos
          {"\n"}• Coletar hemoculturas
          {"\n"}• Descartar reação febril hemolítica aguda (hemoglobina, reticulócitos, lactato desidrogenase, bilirrubina indireta, haptoglobina, contagem de plaquetas, tempo de protrombina, tempo de tromboplastina parcial ativada, fibrinogênio, D-dímero, Coombs direto e indireto) e sepse (hemograma completo, plaquetas, proteína C reativa, lactato, bilirrubinas, creatinina e ureia)
          {"\n"}• Em pacientes com dois ou mais episódios de <Text style={styles.boldText}>RFNH</Text>, possui recomendação da prescrição de hemocomponentes filtrados (desleucocitados)
        </>
      );
    }
    
    if (diagnosis === 'RFHA') {
      return (
        <>
          Reação hemolítica aguda com surgimento até 24 horas após a transfusão.
          {"\n\n"}
          Decorre da transfusão de hemácias incompatíveis, geralmente por erro de tipagem ABO, mas também por anticorpos contra outros antígenos eritrocitários.
          {"\n\n"}
          <Text style={styles.boldText}>Diagnóstico clínico e laboratorial:</Text>
          {"\n\n"}
          <Text style={styles.boldText}>Clínico:</Text>
          {"\n"}• Febre com ou sem calafrio
          {"\n"}• Dor lombar/dorso ou em abdome ou no sítio da infusão
          {"\n"}• Hemoglobinúria
          {"\n"}• Insuficiência renal
          {"\n"}• Coagulação intravascular disseminada
          {"\n"}• Pode ocorrer sangramentos ao redor de óstios de acesso venosos ou piorar sangramentos prévios
          {"\n\n"}
          <Text style={styles.boldText}>Laboratorial:</Text>
          {"\n"}• Hemoglobina, reticulócitos, lactato desidrogenase, bilirrubina indireta, haptoglobina, contagem de plaquetas, tempo de protrombina, tempo de tromboplastina parcial ativada, fibrinogênio, D-dímero, Coombs direto e indireto
          {"\n"}• Exame de urina com dipstick positiva para sangue e negativa para hematúria na análise do sedimento à microscopia ou análise automatizada
          {"\n\n"}
          <Text style={styles.boldText}>Conduta:</Text>
          {"\n"}• Cessar transfusão
          {"\n"}• Iniciar expansão volêmica agressiva com cristaloides (entre 200 a 300 ml/h com objetivo de diurese cerca de 1ml/kg/h ou 100ml/h). Objetivo é evitar nefrotoxicidade por pigmentos
          {"\n"}• Se houver coagulação intravascular, deve ser analisada transfusão de plaquetas, plasma fresco congelado ou crioprecipitado
          {"\n\n"}
          <Text style={styles.boldText}>Prevenção:</Text>
          {"\n"}Previne-se com dupla checagem de identificação antes da transfusão.
        </>
      );
    }
    
    if (diagnosis === 'CONTAMINACAO_BACTERIANA') {
      return (
        <>
          <Text style={styles.boldText}>Definição:</Text>
          {"\n"}Ocorre quando há contaminação da bolsa do hemocomponente por bactérias antes da transfusão.
          {"\n\n"}
          <Text style={styles.boldText}>Hemocomponente Mais Envolvido:</Text>
          {"\n"}Mais comum em concentrados de plaquetas, devido à estocagem em temperaturas mais elevadas.
          {"\n\n"}
          <Text style={styles.boldText}>Agentes Etiológicos:</Text>
          {"\n"}Predominantemente bactérias Gram-positivas, mas também podem ocorrer infecções por Gram-negativas.
          {"\n\n"}
          <Text style={styles.boldText}>Quadro Clínico:</Text>
          {"\n"}Manifesta-se como síndrome inflamatória semelhante à infecção de corrente sanguínea.
          {"\n\n"}
          Principal sinal: febre com ou sem calafrios.
          {"\n\n"}
          Casos mais graves: possibilidade de evolução para sepse.
          {"\n\n"}
          Podem ser observadas alterações visíveis no aspecto do hemocomponente.
          {"\n\n"}
          <Text style={styles.boldText}>Diagnóstico:</Text>
          {"\n"}Investigar disfunções orgânicas (creatinina, bilirrubina, gasometria, plaquetas), dosar lactato
          {"\n\n"}
          Realizar culturas:
          {"\n\n"}
          • Sangue do paciente
          {"\n"}
          • Equipo de infusão
          {"\n"}
          • Bolsa do hemocomponente (estas últimas geralmente solicitadas pelo banco de sangue)
          {"\n\n"}
          <Text style={styles.boldText}>⚠️ Importante:</Text> não descartar a bolsa nem o equipo até orientação do banco de sangue.
          {"\n\n"}
          Sempre avaliar a possibilidade de outro foco infeccioso.
          {"\n\n"}
          <Text style={styles.boldText}>Conduta:</Text>
          {"\n"}
          • Pausar imediatamente a transfusão
          {"\n"}
          • Iniciar antibioticoterapia empírica
        </>
      );
    }
    
    if (diagnosis === 'RFNH_SEPSE') {
      return (
        <>
          <Text style={styles.boldText}>Reação febril mais comum.</Text>
          {"\n\n"}
          <Text style={styles.boldText}>Tempo de Ocorrência:</Text> Ocorre após 1 a 6 horas do início da infusão ou em até 4 horas do término da bolsa.
          {"\n\n"}
          <Text style={styles.boldText}>Quadro Clínico:</Text> Principal sintoma é a febre podendo ser associada ou não a calafrios, náuseas, vômitos e cefaléia.
          {"\n\n"}
          <Text style={styles.boldText}>Diagnóstico:</Text> É de exclusão, uma vez que outras reações transfusionais, no início, podem também se manifestar apenas com febre. Por isso, descarte diagnósticos diferenciais mais graves primeiro.
          {"\n\n"}
          <Text style={styles.boldText}>Solicite</Text> Hemograma completo, contagem de plaquetas, reticulócitos, bilirrubina total e frações, desidrogenase lática, haptoglobina, tempo de tromboplastina parcial ativada, tempo de protrombina, fibrinogênio, D-dímero, proteína C reativa, lactato, creatinina e ureia
          {"\n"}
          <Text style={styles.boldText}>Culturas:</Text> hemocultura, equipo de infusão e bolsa de hemocomponente
          {"\n\n"}
          <Text style={styles.boldText}>Conduta:</Text>
          {"\n"}• <Text style={styles.boldText}>Suspender a hemotransfusão</Text> e descartar o restante da bolsa (a menos que se consiga ter diagnóstico de certeza de <Text style={styles.boldText}>RFNH</Text> em até quatro horas)
          {"\n"}• Administrar antitérmicos
          {"\n"}• Coletar hemoculturas
          {"\n"}• Descartar reação febril hemolítica aguda (hemoglobina, reticulócitos, lactato desidrogenase, bilirrubina indireta, haptoglobina, contagem de plaquetas, tempo de protrombina, tempo de tromboplastina parcial ativada, fibrinogênio, D-dímero, Coombs direto e indireto) e sepse (hemograma completo, plaquetas, proteína C reativa, lactato, bilirrubinas, creatinina e ureia)
          {"\n"}• Em pacientes com dois ou mais episódios de <Text style={styles.boldText}>RFNH</Text>, possui recomendação da prescrição de hemocomponentes filtrados (desleucocitados)
        </>
      );
    }
    
    if (diagnosis === 'REACAO_HIPOTENSIVA') {
      return (
        <>
          Hipotensão isolada.
          {"\n\n"}
          <Text style={styles.boldText}>Mecanismo:</Text>
          {"\n\n"}
          Ainda não totalmente esclarecido.
          {"\n\n"}
          Observada com maior frequência em pacientes que fazem uso de inibidores da enzima conversora de angiotensina (iECA).
          {"\n\n"}
          Supõe-se que durante o armazenamento do hemocomponente ocorra formação de bradicinina; quando administrada, essa substância pode desencadear a reação.
          {"\n\n"}
          O uso de iECA reduz a degradação da bradicinina, favorecendo o surgimento do evento.
          {"\n\n"}
          <Text style={styles.boldText}>Quadro Clínico:</Text>
          {"\n\n"}
          Caracteriza-se por hipotensão isolada associada à transfusão.
          {"\n\n"}
          <Text style={styles.boldText}>Diagnóstico:</Text>
          {"\n\n"}
          Deve ser considerado somente após descartar outras reações transfusionais que também cursam com hipotensão.
          {"\n\n"}
          <Text style={styles.boldText}>Conduta:</Text>
          {"\n\n"}
          Pode incluir a suspensão do iECA ou sua substituição por outra classe medicamentosa.
        </>
      );
    }
    
    const descriptions: Record<string, string> = {
      'ANAFILAXIA': 'Reação alérgica grave. Geralmente acontece no inicio da transfusão, comum em pacientes com deficiência de IgA.\n\nSuspender infusão, administrar adrenalina IM de 0,3 a 0,5 mg a cada 5 minutos até estabilização do quadro. Pode ser associado em conjunto, broncodilatadores, anti-histamínicos e corticoides.\n\nSempre que ocorrer anafilaxia, é necessário ser pesquisado deficiência de IgA - presença de anticorpos anti-IgA. Caso exista, está recomendado transfusão de hemocomponentes lavados.\n\nDiagnóstico de Anafilaxia:\nO acometimento de dois ou mais desses sistemas após a exposição a um gatilho confirma o diagnóstico:\n• Cutâneas: rash, urticária, prurido e angioedema.\n• Respiratórias: dispneia, broncoespasmo e broncorreia.\n• Cardiovasculares: hipotensão arterial, síncope e pré-síncope.\n• Gastrointestinais: náuseas, dor abdominal, vômitos e diarreia.',
      'TACO': 'Sobrecarga circulatória associada à transfusão.\n\n**Fatores de risco:** idade elevada, insuficiência cardíaca, grandes volumes de transfusões, balanço hídrico positivo prévio e insuficiência renal.\n\n**Quadro Clínico:** Surgimento ou piora de edema pulmonar cardiogênico, geralmente após 6 a 12h da transfusão levando a insuficiência respiratória aguda.\n\nAchados esperados são balanço hídrico positivo, sinais de hipervolemia (edema periférico, turgência jugular, crepitações, hepatomegalia e hipertensão), elevação de BNP, aumento da área cardíaca.\n\n**Conduta:**\n• Suspensão da transfusão\n• Administrar diuréticos (preferência furosemida), suporte ventilatório e considerar ultrafiltração em casos graves.\n\n**Prevenção:**\n• Se paciente hipervolêmico, uma forma de prevenir é prescrever diureticoterapia antes da hemotransfusão ou fracionar em bolsas menores\n• Se paciente em hemodiálise, transfundir antes ou durante a sessão de hemodiálise',
      'RFNH': 'Reação febril mais comum.\n\nTempo de Ocorrência: Ocorre após 1 a 6 horas do início da infusão ou em até 4 horas do término da bolsa.\n\nQuadro Clínico: Principal sintoma é a febre podendo ser associada ou não a calafrios, náuseas, vômitos e cefaléia.\n\nDiagnóstico: É de exclusão, uma vez que outras reações transfusionais, no início, podem também se manifestar apenas com febre. Por isso, descarte diagnósticos diferenciais mais graves primeiro.\n\nSolicite Hemograma completo, contagem de plaquetas, reticulócitos, bilirrubina total e frações, desidrogenase lática, haptoglobina, tempo de tromboplastina parcial ativada, tempo de protrombina, fibrinogênio, D-dímero, proteína C reativa, lactato, creatinina e ureia\nCulturas: hemocultura, equipo de infusão e bolsa de hemocomponente\n\nConduta:\n• Suspender a hemotransfusão e descartar o restante da bolsa (a menos que se consiga ter diagnóstico de certeza de reação febril não hemolítica em até quatro horas)\n• Administrar antitérmicos\n• Coletar hemoculturas\n• Descartar reação febril hemolítica aguda (hemoglobina, reticulócitos, lactato desidrogenase, bilirrubina indireta, haptoglobina, contagem de plaquetas, tempo de protrombina, tempo de tromboplastina parcial ativada, fibrinogênio, D-dímero, Coombs direto e indireto) e sepse (hemograma completo, plaquetas, proteína C reativa, lactato, bilirrubinas, creatinina e ureia)\n• Em pacientes com dois ou mais episódios de reação febril não hemolítica, possui recomendação da prescrição de hemocomponentes filtrados (desleucocitados)',
      'RFHA': 'Reação hemolítica aguda com surgimento até 24 horas após a transfusão.\n\nDecorre da transfusão de hemácias incompatíveis, geralmente por erro de tipagem ABO, mas também por anticorpos contra outros antígenos eritrocitários.\n\n**Diagnóstico clínico e laboratorial:**\n\n**Clínico:**\n• Febre com ou sem calafrio\n• Dor lombar/dorso ou em abdome ou no sítio da infusão\n• Hemoglobinúria\n• Insuficiência renal\n• Coagulação intravascular disseminada\n• Pode ocorrer sangramentos ao redor de óstios de acesso venosos ou piorar sangramentos prévios\n\n**Laboratorial:**\n• Hemoglobina, reticulócitos, lactato desidrogenase, bilirrubina indireta, haptoglobina, contagem de plaquetas, tempo de protrombina, tempo de tromboplastina parcial ativada, fibrinogênio, D-dímero, Coombs direto e indireto\n• Exame de urina com dipstick positiva para sangue e negativa para hematúria na análise do sedimento à microscopia ou análise automatizada\n\n**Conduta:**\n• Cessar transfusão\n• Iniciar expansão volêmica agressiva com cristaloides (entre 200 a 300 ml/h com objetivo de diurese cerca de 1ml/kg/h ou 100ml/h). Objetivo é evitar nefrotoxicidade por pigmentos\n• Se houver coagulação intravascular, deve ser analisada transfusão de plaquetas, plasma fresco congelado ou crioprecipitado\n\n**Prevenção:**\nPrevine-se com dupla checagem de identificação antes da transfusão.',
      'RFNH_SEPSE': 'Reação febril mais comum.\n\nTempo de Ocorrência: Ocorre após 1 a 6 horas do início da infusão ou em até 4 horas do término da bolsa.\n\nQuadro Clínico: Principal sintoma é a febre podendo ser associada ou não a calafrios, náuseas, vômitos e cefaléia.\n\nDiagnóstico: É de exclusão, uma vez que outras reações transfusionais, no início, podem também se manifestar apenas com febre. Por isso, descarte diagnósticos diferenciais mais graves primeiro.\n\nSolicite Hemograma completo, contagem de plaquetas, reticulócitos, bilirrubina total e frações, desidrogenase lática, haptoglobina, tempo de tromboplastina parcial ativada, tempo de protrombina, fibrinogênio, D-dímero, proteína C reativa, lactato, creatinina e ureia\nCulturas: hemocultura, equipo de infusão e bolsa de hemocomponente\n\nConduta:\n• Suspender a hemotransfusão e descartar o restante da bolsa (a menos que se consiga ter diagnóstico de certeza de reação febril não hemolítica em até quatro horas)\n• Administrar antitérmicos\n• Coletar hemoculturas\n• Descartar reação febril hemolítica aguda (hemoglobina, reticulócitos, lactato desidrogenase, bilirrubina indireta, haptoglobina, contagem de plaquetas, tempo de protrombina, tempo de tromboplastina parcial ativada, fibrinogênio, D-dímero, Coombs direto e indireto) e sepse (hemograma completo, plaquetas, proteína C reativa, lactato, bilirrubinas, creatinina e ureia)\n• Em pacientes com dois ou mais episódios de reação febril não hemolítica, possui recomendação da prescrição de hemocomponentes filtrados (desleucocitados)',
      'CONTAMINACAO_BACTERIANA': '**Definição:**\nOcorre quando há contaminação da bolsa do hemocomponente por bactérias antes da transfusão.\n\n**Hemocomponente Mais Envolvido:**\nMais comum em concentrados de plaquetas, devido à estocagem em temperaturas mais elevadas.\n\n**Agentes Etiológicos:**\nPredominantemente bactérias Gram-positivas, mas também podem ocorrer infecções por Gram-negativas.\n\n**Quadro Clínico:**\nManifesta-se como síndrome inflamatória semelhante à infecção de corrente sanguínea.\n\nPrincipal sinal: febre com ou sem calafrios.\n\nCasos mais graves: possibilidade de evolução para sepse.\n\nPodem ser observadas alterações visíveis no aspecto do hemocomponente.\n\n**Diagnóstico:**\nInvestigar disfunções orgânicas (creatinina, bilirrubina, gasometria, plaquetas), dosar lactato\n\nRealizar culturas:\n\n• Sangue do paciente\n• Equipo de infusão\n• Bolsa do hemocomponente (estas últimas geralmente solicitadas pelo banco de sangue)\n\n**⚠️ Importante:** não descartar a bolsa nem o equipo até orientação do banco de sangue.\n\nSempre avaliar a possibilidade de outro foco infeccioso.\n\n**Conduta:**\n• Pausar imediatamente a transfusão\n• Iniciar antibioticoterapia empírica',
      'REACAO_HIPOTENSIVA': 'Hipotensão isolada.\n\n**Mecanismo:**\n\nAinda não totalmente esclarecido.\n\nObservada com maior frequência em pacientes que fazem uso de inibidores da enzima conversora de angiotensina (iECA).\n\nSupõe-se que durante o armazenamento do hemocomponente ocorra formação de bradicinina; quando administrada, essa substância pode desencadear a reação.\n\nO uso de iECA reduz a degradação da bradicinina, favorecendo o surgimento do evento.\n\n**Quadro Clínico:**\n\nCaracteriza-se por hipotensão isolada associada à transfusão.\n\n**Diagnóstico:**\n\nDeve ser considerado somente após descartar outras reações transfusionais que também cursam com hipotensão.\n\n**Conduta:**\n\nPode incluir a suspensão do iECA ou sua substituição por outra classe medicamentosa.',
      'REACAO_ALERGICA': 'Reação alérgica leve a moderada. Mais comum em transfusões de plaquetas ou plasma fresco congelado. Sintomas mais comuns são urticária e prurido. Sempre avaliar se há sinais de anafilaxia. Cessa infusão, administrar anti-histamínicos (Ex: difenidramina IV 25 a 50mg) e monitorar progressão. Se sintomas bem controlados após 30m a 1h, reavaliar retorno da infusão.\n\nOBS: Anafilaxia - sintomas:\n• Cutâneas: rash, urticária (placas vermelhas), prurido e angioedema (inchaço súbito de lábios/língua/garganta).\n• Respiratórias: dispneia, broncoespasmo e broncorreia.\n• Cardiovasculares: hipotensão arterial, síncope e pré-síncope.\n• Gastrointestinais: náuseas, dor abdominal, vômitos e diarreia.\n\nO acometimento de dois ou mais desses sistemas após a exposição a um gatilho confirma o diagnóstico.',
    };
    return descriptions[diagnosis] || 'Consulte o protocolo hospitalar para manejo específico.';
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Reações Transfusionais" type="clinical" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Card de Introdução */}
          <View style={styles.introCard}>
            <View style={styles.introHeader}>
              <AlertTriangle size={24} color="#DC2626" />
              <Text style={styles.introTitle}>Reações Transfusionais</Text>
            </View>
            <Text style={styles.introText}>
              Protocolo para manejo de reações transfusionais em ambiente hospitalar. Selecione o tópico desejado:
            </Text>
          </View>

          {/* Subtopic 1: Fluxograma */}
          <View style={styles.topicCard}>
            <TouchableOpacity onPress={() => toggleCard(1)}>
              <View style={styles.topicHeader}>
                <GitBranch size={24} color="#7C3AED" />
                <Text style={styles.topicTitle}>FLUXOGRAMA DE REAÇÕES TRANSFUSIONAIS</Text>
              </View>
            </TouchableOpacity>
            {expandedCard === 1 && (
              <View style={styles.topicContent}>
                {!flowchartStarted ? (
                  <View style={styles.flowchartIntro}>
                    <Text style={styles.flowchartDescription}>
                      Este fluxograma interativo ajudará a identificar rapidamente o tipo de reação transfusional baseado nos sintomas apresentados.
                    </Text>
                    <TouchableOpacity style={styles.startButton} onPress={startFlowchart}>
                      <Text style={styles.startButtonText}>INICIAR AVALIAÇÃO</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    {/* Mostrar diagnóstico se houver */}
                    {diagnosis.length > 0 ? (
                      <View style={styles.diagnosisCard}>
                        <Text style={styles.diagnosisTitle}>
                          {diagnosis.length > 1 ? 'Diagnósticos Possíveis:' : 'Diagnóstico Provável:'}
                        </Text>
                        {diagnosis.map((singleDiagnosis, index) => (
                          <View key={index} style={{marginBottom: theme.spacing.md}}>
                            <Text style={styles.diagnosisResult}>{getDiagnosisName(singleDiagnosis)}</Text>
                            {(singleDiagnosis === 'TRALI' || singleDiagnosis === 'TACO' || singleDiagnosis === 'RFNH' || singleDiagnosis === 'RFNH_SEPSE' || singleDiagnosis === 'RFHA' || singleDiagnosis === 'CONTAMINACAO_BACTERIANA' || singleDiagnosis === 'REACAO_HIPOTENSIVA') ? (
                              <Text style={styles.diagnosisDescription}>
                                {getDiagnosisDescription(singleDiagnosis)}
                              </Text>
                            ) : (
                              <Text style={styles.diagnosisDescription}>
                                {getDiagnosisDescription(singleDiagnosis)}
                              </Text>
                            )}
                          </View>
                        ))}
                        <TouchableOpacity style={styles.restartButton} onPress={resetFlowchart}>
                          <Text style={styles.restartButtonText}>REINICIAR AVALIAÇÃO</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      /* Mostrar pergunta atual */
                      <View style={styles.questionCard}>
                        <Text style={styles.questionText}>{getQuestionText(currentQuestionId)}</Text>
                        <View style={styles.answersContainer}>
                          {getAnswerOptions(currentQuestionId).map((option) => (
                            <TouchableOpacity
                              key={option.value}
                              style={styles.answerButton}
                              onPress={() => handleFlowchartAnswer(option.value)}
                            >
                              <Text style={styles.answerButtonText}>{option.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <TouchableOpacity style={styles.cancelButton} onPress={resetFlowchart}>
                          <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Subtopic 2: Definições e Condutas */}
          <View style={styles.topicCard}>
            <TouchableOpacity onPress={() => toggleCard(2)}>
              <View style={styles.topicHeader}>
                <BookOpen size={24} color="#DC2626" />
                <Text style={styles.topicTitle}>DEFINIÇÕES E CONDUTAS</Text>
              </View>
            </TouchableOpacity>
            {expandedCard === 2 && (
              <View style={styles.topicContent}>
                <Text style={styles.reactionText}>
                  As reações transfusionais são eventos adversos que podem ocorrer durante ou após a administração de hemocomponentes. Elas são classificadas com base no tempo de surgimento:{"\n\n"}
                  <Text style={styles.boldText}>• Reações Imediatas (ou Agudas):</Text> Ocorrem em até 24 horas após o início da transfusão.{"\n"}
                  <Text style={styles.boldText}>• Reações Tardias:</Text> Manifestam-se após 24 horas da transfusão.
                </Text>

          {/* Abordagem Inicial Imediata */}
          <View style={[styles.sectionHeader, {backgroundColor: '#DC2626', marginTop: 16}]}>
            <Text style={[styles.sectionTitle, {color: '#FFFFFF'}]}>ABORDAGEM INICIAL IMEDIATA</Text>
          </View>

          <Text style={styles.reactionText}>
            Ao suspeitar de uma reação transfusional, a agilidade é fundamental. Siga estes seis passos essenciais:
          </Text>

          <View style={[styles.protocolBox, {backgroundColor: '#F0FDF4', borderLeftColor: '#16A34A', marginVertical: 8}]}>
            <Text style={styles.boldText}>1. Interrompa a Transfusão:</Text>
            <Text style={styles.reactionText}>
              A primeira e mais crucial medida é parar a infusão do hemocomponente. Isso limita a exposição do paciente e permite tempo para avaliação. Não descarte a bolsa ou o equipo, pois eles são essenciais para a investigação diagnóstica.
            </Text>
          </View>

          <View style={[styles.protocolBox, {backgroundColor: '#F0FDF4', borderLeftColor: '#16A34A', marginVertical: 8}]}>
            <Text style={styles.boldText}>2. Avalie o Paciente:</Text>
            <Text style={styles.reactionText}>
              Realize uma avaliação clínica completa, verificando todos os sinais vitais.
            </Text>
          </View>

          <View style={[styles.protocolBox, {backgroundColor: '#F0FDF4', borderLeftColor: '#16A34A', marginVertical: 8}]}>
            <Text style={styles.boldText}>3. Confirme a Identificação:</Text>
            <Text style={styles.reactionText}>
              Faça uma checagem dupla da identificação do paciente e da bolsa de sangue, utilizando pelo menos dois identificadores (ex: nome completo, data de nascimento).
            </Text>
          </View>

          <View style={[styles.protocolBox, {backgroundColor: '#F0FDF4', borderLeftColor: '#16A34A', marginVertical: 8}]}>
            <Text style={styles.boldText}>4. Comunique o Banco de Sangue:</Text>
            <Text style={styles.reactionText}>
              Entre em contato imediatamente com a equipe de hemoterapia. Eles são especialistas que auxiliarão na investigação e no manejo.
            </Text>
          </View>

          <View style={[styles.protocolBox, {backgroundColor: '#F0FDF4', borderLeftColor: '#16A34A', marginVertical: 8}]}>
            <Text style={styles.boldText}>5. Inicie o Manejo Específico:</Text>
            <Text style={styles.reactionText}>
              Trate os sintomas do paciente conforme o quadro clínico apresentado (detalhado abaixo).
            </Text>
          </View>

          <View style={[styles.protocolBox, {backgroundColor: '#F0FDF4', borderLeftColor: '#16A34A', marginVertical: 8}]}>
            <Text style={styles.boldText}>6. Notifique o Evento:</Text>
            <Text style={styles.reactionText}>
              Realize a notificação oficial da reação transfusional conforme os protocolos da sua instituição.
            </Text>
          </View>

          {/* Principais Reações Transfusionais Agudas */}
          <View style={[styles.sectionHeader, {backgroundColor: '#7C3AED', marginTop: 16}]}>
            <Text style={[styles.sectionTitle, {color: '#FFFFFF'}]}>PRINCIPAIS REAÇÕES TRANSFUSIONAIS AGUDAS</Text>
          </View>

          <Text style={styles.reactionText}>
            Aqui detalhamos as reações transfusionais agudas identificadas no fluxograma de diagnóstico.
          </Text>

          {/* 1. TRALI (Lesão Pulmonar Aguda) */}
          <View style={[styles.reactionBox, {backgroundColor: '#F0F9FF', borderLeftColor: '#0EA5E9', marginTop: 12}]}>
            <Text style={styles.boldText}>1. 🧊 TRALI (Lesão Pulmonar Aguda)</Text>
            <Text style={styles.reactionText}>
              Lesão pulmonar aguda relacionada à transfusão.
              {"\n\n"}
              <Text style={styles.boldText}>Quadro Clínico:</Text>{"\n"}
              <Text style={styles.boldText}>• Agudo, geralmente {'<'} 6 horas após início da transfusão.</Text> Padrão semelhante a Síndrome da angústia respiratória do adulto (SARA).
              {"\n\n"}
              <Text style={styles.boldText}>Critérios Diagnósticos:</Text>{"\n"}
              • Início lesão pulmonar em até sete dias{"\n"}
              • Presença de infiltrado pulmonar bilateral não cardiogênico ou por hipervolemia{"\n"}
              • Hipoxemia: saturação {'<'} 90% em ar ambiente ou PaO₂/FiO₂ ≤ 300
              {"\n\n"}
              Podendo apresentar febre com ou sem calafrios e a pressão arterial podendo estar inalterada ou com tendência a hipotensão.
              {"\n\n"}
              <Text style={styles.boldText}>Observação:</Text> Se houver outra justificativa para SARA, o diagnóstico de TRALI pode ser colocado em questão, principalmente se o paciente já havia sintomas respiratórios antes da transfusão.
              {"\n\n"}
              <Text style={styles.boldText}>Conduta:</Text>{"\n"}
              <Text style={styles.boldText}>• Iniciar suporte ventilatório e hemodinâmico imediatamente.</Text>
            </Text>
          </View>

          {/* 2. ANAFILAXIA */}
          <View style={[styles.reactionBox, {backgroundColor: '#FFF1F2', borderLeftColor: '#E11D48', marginTop: 12}]}>
            <Text style={styles.boldText}>2. 🆘 ANAFILAXIA</Text>
            <Text style={styles.reactionText}>
              Reação alérgica grave. Geralmente acontece no inicio da transfusão, comum em pacientes com deficiência de IgA.
              {"\n\n"}
              <Text style={styles.boldText}>Quadro Clínico:</Text>{"\n"}
              O acometimento de dois ou mais desses sistemas após a exposição a um gatilho confirma o diagnóstico:{"\n"}
              • Cutâneas: rash, urticária, prurido e angioedema.{"\n"}
              • Respiratórias: dispneia, broncoespasmo e broncorreia.{"\n"}
              • Cardiovasculares: hipotensão arterial, síncope e pré-síncope.{"\n"}
              • Gastrointestinais: náuseas, dor abdominal, vômitos e diarreia.
              {"\n\n"}
              <Text style={styles.boldText}>Conduta:</Text>{"\n"}
              • Suspender infusão{"\n"}
              • Administrar adrenalina IM de 0,3 a 0,5 mg a cada 5 minutos até estabilização do quadro{"\n"}
              • Pode ser associado em conjunto: broncodilatadores, anti-histamínicos e corticoides
              {"\n\n"}
              <Text style={styles.boldText}>Prevenção:</Text>{"\n"}
              Sempre que ocorrer anafilaxia, é necessário ser pesquisado deficiência de IgA - presença de anticorpos anti-IgA. Caso exista, está recomendado transfusão de hemocomponentes lavados.
            </Text>
          </View>

          {/* 3. TACO (Sobrecarga Circulatória) */}
          <View style={[styles.reactionBox, {backgroundColor: '#F0F9FF', borderLeftColor: '#0EA5E9'}]}>
            <Text style={styles.boldText}>3. 💧 TACO (Sobrecarga Circulatória)</Text>
            <Text style={styles.reactionText}>
              Sobrecarga circulatória associada à transfusão.
              {"\n\n"}
              <Text style={styles.boldText}>Fatores de risco:</Text> idade elevada, insuficiência cardíaca, grandes volumes de transfusões, balanço hídrico positivo prévio e insuficiência renal.
              {"\n\n"}
              <Text style={styles.boldText}>Quadro Clínico:</Text> Surgimento ou piora de edema pulmonar cardiogênico, geralmente após 6 a 12h da transfusão levando a insuficiência respiratória aguda.
              {"\n\n"}
              Achados esperados são balanço hídrico positivo, sinais de hipervolemia (edema periférico, turgência jugular, crepitações, hepatomegalia e hipertensão), elevação de BNP, aumento da área cardíaca.
              {"\n\n"}
              <Text style={styles.boldText}>Conduta:</Text>{"\n"}
              • Suspensão da transfusão{"\n"}
              • Administrar diuréticos (preferência furosemida){"\n"}
              • Suporte ventilatório{"\n"}
              • Considerar ultrafiltração em casos graves
              {"\n\n"}
              <Text style={styles.boldText}>Prevenção:</Text>{"\n"}
              • Se paciente hipervolêmico, prescrever diureticoterapia antes da hemotransfusão ou fracionar em bolsas menores{"\n"}
              • Se paciente em hemodiálise, transfundir antes ou durante a sessão de hemodiálise
            </Text>
          </View>

          {/* 4. RFNH (Reação Febril Não Hemolítica) */}
          <View style={[styles.reactionBox, {backgroundColor: '#FEF2F2', borderLeftColor: '#DC2626'}]}>
            <Text style={styles.boldText}>4. 🔥 RFNH (Reação Febril Não Hemolítica)</Text>
            <Text style={styles.reactionText}>
              <Text style={styles.boldText}>Reação febril mais comum.</Text>
              {"\n\n"}
              <Text style={styles.boldText}>Tempo de Ocorrência:</Text> Ocorre após 1 a 6 horas do início da infusão ou em até 4 horas do término da bolsa.
              {"\n\n"}
              <Text style={styles.boldText}>Quadro Clínico:</Text> Principal sintoma é a febre podendo ser associada ou não a calafrios, náuseas, vômitos e cefaléia.
              {"\n\n"}
              <Text style={styles.boldText}>Diagnóstico:</Text> É de exclusão, uma vez que outras reações transfusionais, no início, podem também se manifestar apenas com febre. Por isso, descarte diagnósticos diferenciais mais graves primeiro.
              {"\n\n"}
              <Text style={styles.boldText}>Exames a solicitar:</Text>{"\n"}
              • Hemograma completo, contagem de plaquetas{"\n"}
              • Reticulócitos, bilirrubina total e frações, desidrogenase lática, haptoglobina{"\n"}
              • Coagulograma (TP, TTPa, fibrinogênio, D-dímero){"\n"}
              • Proteína C reativa, lactato, creatinina e ureia{"\n"}
              • Culturas: hemocultura, equipo de infusão e bolsa de hemocomponente
              {"\n\n"}
              <Text style={styles.boldText}>Conduta:</Text>{"\n"}
              • <Text style={styles.boldText}>Suspender a hemotransfusão</Text> e descartar o restante da bolsa{"\n"}
              • Administrar antitérmicos{"\n"}
              • Em pacientes com dois ou mais episódios de <Text style={styles.boldText}>RFNH</Text>, recomenda-se hemocomponentes filtrados (desleucocitados)
            </Text>
          </View>

          {/* 5. RFHA (Reação Hemolítica Aguda) */}
          <View style={[styles.reactionBox, {backgroundColor: '#FEF2F2', borderLeftColor: '#B91C1C'}]}>
            <Text style={styles.boldText}>5. 🆘 RFHA (Reação Hemolítica Aguda)</Text>
            <Text style={styles.reactionText}>
              Reação hemolítica aguda com surgimento até 24 horas após a transfusão.
              {"\n\n"}
              Decorre da transfusão de hemácias incompatíveis, geralmente por erro de tipagem ABO, mas também por anticorpos contra outros antígenos eritrocitários.
              {"\n\n"}
              <Text style={styles.boldText}>Diagnóstico clínico e laboratorial:</Text>
              {"\n\n"}
              <Text style={styles.boldText}>Clínico:</Text>{"\n"}
              • Febre com ou sem calafrio{"\n"}
              • Dor lombar/dorso ou em abdome ou no sítio da infusão{"\n"}
              • Hemoglobinúria{"\n"}
              • Insuficiência renal{"\n"}
              • Coagulação intravascular disseminada{"\n"}
              • Pode ocorrer sangramentos ao redor de óstios de acesso venosos ou piorar sangramentos prévios
              {"\n\n"}
              <Text style={styles.boldText}>Laboratorial:</Text>{"\n"}
              • Hemoglobina, reticulócitos, lactato desidrogenase, bilirrubina indireta, haptoglobina, Coombs direto e indireto{"\n"}
              • Contagem de plaquetas, tempo de protrombina, TTPa, fibrinogênio, D-dímero{"\n"}
              • Exame de urina: dipstick positiva para sangue e negativa para hematúria na análise microscópica
              {"\n\n"}
              <Text style={styles.boldText}>Conduta:</Text>{"\n"}
              • Cessar transfusão{"\n"}
              • Iniciar expansão volêmica agressiva com cristaloides (200-300 ml/h, objetivo de diurese ~1ml/kg/h){"\n"}
              • Se houver CIVD, considerar transfusão de plaquetas, plasma fresco congelado ou crioprecipitado
              {"\n\n"}
              <Text style={styles.boldText}>Prevenção:</Text>{"\n"}
              Dupla checagem de identificação antes da transfusão.
            </Text>
          </View>

          {/* 6. CONTAMINAÇÃO BACTERIANA */}
          <View style={[styles.reactionBox, {backgroundColor: '#FFF5F5', borderLeftColor: '#EF4444'}]}>
            <Text style={styles.boldText}>6. 🦠 CONTAMINAÇÃO BACTERIANA</Text>
            <Text style={styles.reactionText}>
              <Text style={styles.boldText}>Definição:</Text>{"\n"}
              Ocorre quando há contaminação da bolsa do hemocomponente por bactérias antes da transfusão.
              {"\n\n"}
              <Text style={styles.boldText}>Hemocomponente Mais Envolvido:</Text>{"\n"}
              Mais comum em concentrados de plaquetas, devido à estocagem em temperaturas mais elevadas.
              {"\n\n"}
              <Text style={styles.boldText}>Quadro Clínico:</Text>{"\n"}
              Manifesta-se como síndrome inflamatória semelhante à infecção de corrente sanguínea.{"\n"}
              Principal sinal: febre com ou sem calafrios.{"\n"}
              Casos mais graves: possibilidade de evolução para sepse.{"\n"}
              Podem ser observadas alterações visíveis no aspecto do hemocomponente.
              {"\n\n"}
              <Text style={styles.boldText}>Diagnóstico:</Text>{"\n"}
              • Investigar disfunções orgânicas (creatinina, bilirrubina, gasometria, plaquetas){"\n"}
              • Dosar lactato{"\n"}
              • Realizar culturas: sangue do paciente, equipo de infusão e bolsa do hemocomponente
              {"\n\n"}
              <Text style={styles.boldText}>⚠️ Importante:</Text> não descartar a bolsa nem o equipo até orientação do banco de sangue.{"\n"}
              Sempre avaliar a possibilidade de outro foco infeccioso.
              {"\n\n"}
              <Text style={styles.boldText}>Conduta:</Text>{"\n"}
              • Pausar imediatamente a transfusão{"\n"}
              • Iniciar antibioticoterapia empírica
            </Text>
          </View>

          {/* 7. REAÇÃO HIPOTENSIVA */}
          <View style={[styles.reactionBox, {backgroundColor: '#FEE2E2', borderLeftColor: '#991B1B'}]}>
            <Text style={styles.boldText}>7. 🩸 REAÇÃO HIPOTENSIVA</Text>
            <Text style={styles.reactionText}>
              Hipotensão isolada associada à transfusão.
              {"\n\n"}
              <Text style={styles.boldText}>Mecanismo:</Text>{"\n"}
              Ainda não totalmente esclarecido.{"\n"}
              Observada com maior frequência em pacientes que fazem uso de inibidores da enzima conversora de angiotensina (iECA).{"\n"}
              Supõe-se que durante o armazenamento do hemocomponente ocorra formação de bradicinina; quando administrada, essa substância pode desencadear a reação.{"\n"}
              O uso de iECA reduz a degradação da bradicinina, favorecendo o surgimento do evento.
              {"\n\n"}
              <Text style={styles.boldText}>Diagnóstico:</Text>{"\n"}
              Deve ser considerado somente após descartar outras reações transfusionais que também cursam com hipotensão.
              {"\n\n"}
              <Text style={styles.boldText}>Conduta:</Text>{"\n"}
              • Pausar transfusão{"\n"}
              • Avaliar suspensão do iECA ou sua substituição por outra classe medicamentosa
            </Text>
          </View>
          
          {/* 8. REAÇÃO ALÉRGICA */}
          <View style={[styles.reactionBox, {backgroundColor: '#FFF7ED', borderLeftColor: '#EA580C'}]}>
            <Text style={styles.boldText}>8. 🤧 REAÇÃO ALÉRGICA</Text>
            <Text style={styles.reactionText}>
              Reação alérgica leve a moderada. Mais comum em transfusões de plaquetas ou plasma fresco congelado. 
              {"\n\n"}
              <Text style={styles.boldText}>Quadro Clínico:</Text>{"\n"}
              Sintomas mais comuns são urticária (placas vermelhas) e prurido (coceira).{"\n"}
              Sempre avaliar se há sinais de anafilaxia (ver tópico Anafilaxia).
              {"\n\n"}
              <Text style={styles.boldText}>Conduta:</Text>{"\n"}
              • Cessar infusão{"\n"}
              • Administrar anti-histamínicos (Ex: difenidramina IV 25 a 50mg){"\n"}
              • Monitorar evolução{"\n"}
              • Se sintomas bem controlados após 30 min a 1h, reavaliar retorno da infusão
            </Text>
          </View>

          {/* Risco de Infecções */}
          <View style={[styles.sectionHeader, {backgroundColor: '#16A34A', marginTop: 16}]}>
            <Text style={[styles.sectionTitle, {color: '#FFFFFF'}]}>RISCO DE INFECÇÕES TRANSMISSÍVEIS</Text>
          </View>

          <View style={[styles.protocolBox, {backgroundColor: '#E8F5E8', borderLeftColor: '#4CAF50'}]}>
            <Text style={styles.reactionText}>
              Embora extremamente raro atualmente, o risco de contaminação por vírus como HBV, HCV e HIV ainda existe, com incidências de, respectivamente, 1:1.000.000, 1:1.200.000 e 1:6.000.000.
            </Text>
          </View>

              </View>
            )}
          </View>

          {/* Card de Aviso/Disclaimer */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerText}>
              ⚠️ Esta ferramenta oferece orientações baseadas em diretrizes gerais de hemoterapia. 
              Sempre consulte as diretrizes institucionais e avalie individualmente cada caso. 
              Em caso de reação transfusional, siga sempre os protocolos de hemovigilância da instituição.
            </Text>
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
  // Card de introdução
  introCard: {
    backgroundColor: '#FFF5F5',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  introTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#DC2626',
    marginLeft: theme.spacing.sm,
  },
  introText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  reactionText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
    backgroundColor: '#FFF5F5',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  // Texto em negrito
  boldText: {
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  // Caixa de reação
  reactionBox: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderLeftWidth: 4,
    marginVertical: theme.spacing.sm,
  },
  // Caixa de protocolo
  protocolBox: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderLeftWidth: 4,
    marginVertical: theme.spacing.sm,
  },
  // Cabeçalho de seção
  sectionHeader: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginVertical: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  // Card de disclaimer
  disclaimerCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: '#FF9800',
    marginTop: theme.spacing.lg,
  },
  disclaimerText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#E65100',
    lineHeight: 18,
    textAlign: 'center',
  },
  // Cards de tópicos
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  topicTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  topicContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  // Card de construção
  constructionCard: {
    backgroundColor: '#FFFBEB',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
  },
  constructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  constructionTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#F59E0B',
    marginLeft: theme.spacing.md,
  },
  constructionText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Estilos do Fluxograma
  flowchartIntro: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  flowchartDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  // Card de pergunta
  questionCard: {
    backgroundColor: '#F3F4F6',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  questionText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  answersContainer: {
    marginBottom: theme.spacing.md,
  },
  answerButton: {
    backgroundColor: '#FFFFFF',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginBottom: theme.spacing.sm,
  },
  answerButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    textAlign: 'center',
  },
  cancelButton: {
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  cancelButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  // Card de diagnóstico
  diagnosisCard: {
    backgroundColor: '#F0FDF4',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: '#16A34A',
  },
  diagnosisTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  diagnosisResult: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#16A34A',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  diagnosisDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  restartButton: {
    backgroundColor: '#16A34A',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'center',
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
  },
});
