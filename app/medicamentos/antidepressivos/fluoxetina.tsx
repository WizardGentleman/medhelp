import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  color: string;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ title, children, color }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.card, { backgroundColor: color + '20' }]}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <Text style={[styles.cardTitle, { color }]}>{title}</Text>
        {isExpanded ? (
          <ChevronUp size={24} color={color} />
        ) : (
          <ChevronDown size={24} color={color} />
        )}
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.cardContent}>
          {children}
        </View>
      )}
    </View>
  );
};

interface SubCollapsibleProps {
  title: string;
  children: React.ReactNode;
}

const SubCollapsible: React.FC<SubCollapsibleProps> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.subCard}>
      <TouchableOpacity
        style={styles.subCardHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.subCardTitle}>{title}</Text>
        {isExpanded ? (
          <ChevronUp size={20} color="#666" />
        ) : (
          <ChevronDown size={20} color="#666" />
        )}
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.subCardContent}>
          {children}
        </View>
      )}
    </View>
  );
};

export default function FluoxetinaScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Fluoxetina" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <CollapsibleCard title="INDICAÇÕES E DOSES (USO APROVADO)" color="#4CAF50">
          <SubCollapsible title="Transtorno Depressivo Maior (TDM)">
            <Text style={styles.contentText}>
              • Formulação de liberação imediata (cápsulas/comprimidos):{"\n\n"}
              {"    "}◦ Dose inicial: Recomenda-se iniciar com 20 mg uma vez ao dia.{"\n\n"}
              {"    "}◦ Titulação: A dose pode ser aumentada gradualmente em incrementos de 10 mg ou 20 mg em intervalos de pelo menos 1 semana, dependendo da resposta e tolerabilidade do paciente.{"\n\n"}
              {"    "}◦ Dose usual eficaz: Varia de 20 mg a 40 mg uma vez ao dia.{"\n"}
              {"                          "}Alguns pacientes podem necessitar de até 60 mg/dia para obter resposta.{"\n\n"}
              {"    "}◦ Dose máxima: A dose máxima diária para TDM é de 80 mg/dia.{"\n\n"}
              {"    "}◦ Avaliação da eficácia: A resposta inicial deve ser avaliada após 4 a 8 semanas. Alguns especialistas sugerem aguardar 6 a 8 semanas com uma dose de 20 mg/dia antes de considerar aumentos adicionais.{"\n\n"}
              {"    "}◦ Nota: Para depressão resistente ao tratamento, a combinação com olanzapina ou outro antipsicótico de segunda geração pode ser utilizada.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Transtorno Obsessivo-Compulsivo (TOC)">
            <Text style={styles.contentText}>
              • Dose inicial: Geralmente, inicia-se com 20 mg uma vez ao dia. Alguns sugerem iniciar com 10 mg/dia, aumentando após alguns dias ou semanas.{"\n\n"}
              • Titulação: As doses podem ser aumentadas em incrementos de 20 mg em intervalos de pelo menos 1 semana, com base na resposta e tolerabilidade.{"\n\n"}
              • Dose usual eficaz: Varia de 40 mg a 80 mg uma vez ao dia.{"\n\n"}
              • Dose máxima: Até 120 mg/dia pode ser necessário para uma resposta ótima em alguns pacientes. No entendo, efeitos adversos podem aumentar{"\n\n"}
              • Avaliação da eficácia: A eficácia no TOC é avaliada a partir de 6 semanas com dose máxima tolerada.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Bulimia Nervosa">
            <Text style={styles.contentText}>
              • Dose inicial: Inicia com 20 mg, uma vez ao dia{"\n\n"}
              • Titulação: Aumento gradual de 20 mg em intervalo de ≥1 semana de acordo com tolerabilidade e resposta individual do paciente{"\n\n"}
              • Dose usual: A dose alvo é de 60 mg uma vez ao dia
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Transtorno do Pânico">
            <Text style={styles.contentText}>
              • Dose inicial: Inicia-se com 5 a 10 mg uma vez ao dia por 3 a 7 dias.{"\n\n"}
              • Titulação: Pode ser aumentada de 5 a 10 mg em intervalo após 7 dias. Aumentos adicionais podem ser feitos em incrementos de 10 mg ou 20 mg em intervalos de pelo menos 1 semana, com base na resposta e tolerabilidade.{"\n\n"}
              • Dose usual: Varia de 20 mg a 40 mg uma vez ao dia.{"\n\n"}
              • Dose máxima: 60 mg/dia.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Transtorno Disfórico Pré-Menstrual (TDPM)">
            <Text style={styles.contentText}>
              • A fluoxetina é aprovada para TDPM usando dosagem diária contínua ou na fase lútea.{"\n\n"}
              • Dosagem diária contínua:{"\n"}
              {"    "}◦ Dose inicial: 10 mg uma vez ao dia.{"\n"}
              {"    "}◦ Titulação: Pode aumentar para uma dose usual eficaz de 20 mg uma vez ao dia após o primeiro mês. Um aumento adicional para 40 mg/dia pode ser benéfico em algumas pacientes para uma resposta ótima.{"\n"}
              {"    "}◦ Dose máxima: 40 mg/dia.{"\n\n"}
              • Dosagem na fase lútea:{"\n"}
              {"    "}◦ Dose inicial: 10 mg uma vez ao dia, começando 14 dias antes do início previsto da menstruação e continuando até o início da menstruação.{"\n"}
              {"    "}◦ Titulação: Pode aumentar para uma dose usual eficaz de 20 mg uma vez ao dia durante a fase lútea em um ciclo subsequente. Um aumento adicional para 40 mg/dia durante a fase lútea pode ser benéfico em algumas pacientes para uma resposta ótima.{"\n"}
              {"    "}◦ Dose máxima: 40 mg/dia.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Transtorno Bipolar (Episódio Depressivo)">
            <Text style={styles.contentText}>
              {"    "}◦ Indicação: A fluoxetina, em combinação com a olanzapina, é aprovada para o tratamento de episódios depressivos associados ao Transtorno Bipolar. É importante notar que a fluoxetina não deve ser utilizada como monoterapia para a depressão bipolar, devendo ser associado com antipsicótico de segunda geração (preferencialmente Olanzapina) ou agente antimaníaco.{"\n\n"}
              {"    "}◦ Dose Inicial: 20 mg, uma vez ao dia{"\n\n"}
              {"    "}◦ Titulação: Aumento de 10 a 20 mg a cada 1 a 7 dias conforme a resposta do paciente e a tolerabilidade.{"\n\n"}
              {"    "}◦ Dose usual: 20 a 50 mg/dia
            </Text>
          </SubCollapsible>
        </CollapsibleCard>

        <CollapsibleCard title="USOS OFF-LABEL (NÃO APROVADOS EM BULA)" color="#FF9800">
          <SubCollapsible title="Transtorno de Ansiedade Generalizada (TAG)">
            <Text style={styles.contentText}>
              {"    "}◦ Dose Inicial: Recomenda-se iniciar com 10 a 20 mg uma vez ao dia.{"\n\n"}
              {"    "}◦ Titulação: A dose pode ser aumentada gradualmente em incrementos de 10 mg ou 20 mg em intervalos de pelo menos 1 semana, dependendo da resposta e tolerabilidade do paciente. Em ambiente hospitalar pode ser aumentado a cada 3 a 4 dias.{"\n"}
              Alguns especialistas sugerem manter a dose terapêutica inicial durante 4 a 6 semanas para avaliar a eficácia antes de voltar a aumentar{"\n\n"}
              {"    "}◦ Dose Usual Eficaz: Geralmente varia de 20 mg a 40 mg uma vez ao dia.{"\n\n"}
              {"    "}◦ Dose Máxima: Pode-se chegar a 60 mg/dia.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Transtorno de Ansiedade Social (TAS) / Fobia Social">
            <Text style={styles.contentText}>
              {"    "}◦ Dose Inicial: Pode-se iniciar com 10 a 20 mg uma vez ao dia.{"\n\n"}
              {"    "}◦ Titulação: Ideal aguardar 4 a 6 semanas, e se necessário, aumentos de 10 mg em intervalos de ≥1 semana com base na resposta e tolerabilidade.{"\n\n"}
              {"    "}◦ Dose Máxima: A dose máxima recomendada é de 60 mg/dia.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Transtorno de Estresse Pós-Traumático (TEPT)">
            <Text style={styles.contentText}>
              {"    "}◦ Dose Inicial: Recomenda-se 10 mg a 20mg uma vez ao dia.{"\n\n"}
              {"    "}◦ Titulação: A dose pode ser aumentada de 10 mg a 20 mg/dia em intervalos de 1 semana.{"\n\n"}
              {"    "}◦ Dose Usual: 20 a 60 mg/dia{"\n\n"}
              {"    "}◦ Dose Máxima: A dose máxima é de 80 mg/dia.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Transtorno Dismórfico Corporal (TDC)">
            <Text style={styles.contentText}>
              {"    "}◦ Dose Inicial: Sugere-se iniciar com 20 mg uma vez ao dia.{"\n\n"}
              {"    "}◦ Titulação: A dose pode ser aumentada gradualmente em incrementos de 20 mg em intervalos de 2 a 3 semanas, conforme a resposta e tolerabilidade.{"\n\n"}
              {"    "}◦ Dose Usual Eficaz: A dose usual eficaz é de 70 a 80 mg/dia (na 6° a 10° semana).{"\n\n"}
              {"    "}◦ Dose Máxima: Alguns pacientes podem necessitar de até 120 mg/dia.{"\n\n"}
              {"    "}◦ Avaliação da Eficácia: A resposta pode ser avaliada após 12 a 16 semanas de tratamento com a dose máxima tolerada (idealmente utilizando 80 mg por pelo menos 4 dessas semanas, se tolerado).
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Ejaculação Precoce (EP)">
            <Text style={styles.contentText}>
              {"    "}◦ Dose Inicial: A dose inicial recomendada é de 20 mg uma vez ao dia.{"\n\n"}
              {"    "}◦ Titulação: A dose pode ser aumentada gradualmente até 40 mg/dia, após 1 semana de uso. Alguns especialistas recomendam aumento após 3 a 4 semanas de uso inicial.{"\n\n"}
              {"    "}◦ Dose Usual: A dose pode ser aumentada para até 40 mg/dia.
            </Text>
          </SubCollapsible>
        </CollapsibleCard>

        <CollapsibleCard title="AJUSTES DE DOSE E POPULAÇÕES ESPECIAIS" color="#2196F3">
          <SubCollapsible title="Pacientes Geriátricos (Idosos)">
            <Text style={styles.contentText}>
              {"    "}◦ Podem necessitar de doses mais baixas e titulação mais lenta devido ao aumento da sensibilidade aos efeitos colaterais.{"\n"}
              {"    "}◦ Dose inicial: 10 mg uma vez ao dia.{"\n"}
              {"    "}◦ Titulação: Aumento gradual em incrementos de 10 mg a 20mg a cada várias semanas, com base na resposta e tolerabilidade.{"\n"}
              {"    "}◦ Evitar utilizar a noite, exceto caso apresente efeito de sedação.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Ajuste Hepáticos">
            <Text style={styles.contentText}>
              {"    "}◦ Doses mais baixas ou menos frequentes podem ser necessárias devido à meia-vida prolongada da fluoxetina e da norfluoxetina em Child-Pugh A e B (Não existe estudos suficiente para classe C).{"\n"}
              {"    "}◦ Início: Não é preciso ajustar a dose inicialmente; a titulação pode ser feita gradualmente, conforme a resposta clínica e a tolerância do paciente, com aumentos de até 10 a 20 mg a cada 2 semanas ou mais. A dose não deve ultrapassar 50% da recomendada para a indicação específica ou o limite máximo de 40 mg/dia, prevalecendo o menor valor. Usar com cautela.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Ajuste Renais">
            <Text style={styles.contentText}>
              {"    "}◦ Não é necessário ajuste posológico para qualquer grau de disfunção renal
            </Text>
          </SubCollapsible>
        </CollapsibleCard>

        <CollapsibleCard title="DESCONTINUAÇÃO E TROCA DO MEDICAMENTO" color="#9C27B0">
          <Text style={styles.contentText}>
            • A descontinuação gradual é geralmente recomendada para minimizar os sintomas de abstinência, muitas vezes se já utilizou por ≥4 semanas. Reduzir a dose ao longo de 1 a 2 semanas. Se doses altas ou história prévia de sintomas de abstinência de antidepressivos, faça redução mais lenta ao longo de 4 semanas.{"\n"}
            • Devido à longa meia-vida da fluoxetina, alguns pacientes podem tolerar a descontinuação abrupta.{"\n"}
            • Ao trocar de antidepressivo, pode-se usar a titulação cruzada (redução gradual de um enquanto aumenta o outro) ou a troca direta (descontinuação abrupta do primeiro e início do novo). A escolha depende de fatores como o risco de sintomas de descontinuação, interações medicamentosas e propriedades farmacocinéticas dos medicamentos.{"\n"}
            • Se ocorrerem sintomas de abstinência intoleráveis, deve-se restabelecer a dose previamente prescrita ou diminuir a dose de forma mais gradual.
          </Text>
        </CollapsibleCard>

        <CollapsibleCard title="REAÇÕES ADVERSAS SIGNIFICATIVAS" color="#F44336">
          <SubCollapsible title="Ativação de Mania ou Hipomania">
            <Text style={styles.contentText}>
              • Mecanismo: Não relacionado à dose; idiossincrático. Não está claro se representa a descoberta de um transtorno bipolar não reconhecido ou um efeito farmacológico direto independente do diagnóstico.{"\n\n"}
              • Início: Variado. O risco de mudança aumentou significativamente nos primeiros 2 anos de tratamento antidepressivo em pacientes com TDM unipolar. Em pacientes com TOC, episódios maníacos/hipomaníacos foram mais comuns nas primeiras 12 semanas, mas ocorreram até 9 meses.{"\n\n"}
              • Fatores de Risco: Histórico familiar de transtorno bipolar, episódio depressivo com sintomas psicóticos, idade mais jovem no início da depressão, resistência a antidepressivos, e ser do sexo feminino.
            </Text>
          </SubCollapsible>
          
          <SubCollapsible title="Risco de Sangramento">
            <Text style={styles.contentText}>
              • Mecanismo: Possivelmente devido à diminuição das concentrações de serotonina nas plaquetas e inibição da ativação plaquetária mediada pela serotonina, levando à disfunção plaquetária. A fluoxetina possui alta afinidade pelo receptor de serotonina. ISRS também podem aumentar a acidez gástrica, elevando o risco de sangramento gastrointestinal.{"\n\n"}
              • Início: Variado. O risco de sangramento provavelmente é atrasado por várias semanas até que a depleção de serotonina plaquetária induzida por ISRS se torne clinicamente significativa. O início pode ser mais imprevisível com o uso concomitante de antiplaquetários, anticoagulantes ou AINEs.{"\n\n"}
              • Fatores de Risco: Uso concomitante de anticoagulantes e/ou antiplaquetários, disfunção plaquetária preexistente ou distúrbios de coagulação, e uso concomitante de AINEs (aumenta o risco de sangramento GI superior). Pacientes expostas a ISRS no final da gravidez têm um risco ligeiramente aumentado de hemorragia pós-parto.
            </Text>
          </SubCollapsible>
          
          <SubCollapsible title="Fraturas por Fragilidade">
            <Text style={styles.contentText}>
              • Mecanismo: Relacionado ao tempo. Postula-se um efeito direto dos ISRS no metabolismo ósseo via interação com 5-HT e atividade de osteoblastos, osteócitos e/ou osteoclastos. ISRS também podem contribuir para o risco de quedas.{"\n\n"}
              • Início: Atrasado. O risco parece aumentar após o início e pode continuar a aumentar com o uso a longo prazo.{"\n\n"}
              • Fatores de Risco: Uso a longo prazo.
            </Text>
          </SubCollapsible>
          
          <SubCollapsible title="Reações de Hipersensibilidade">
            <Text style={styles.contentText}>
              • Mecanismo: Não relacionado à dose; imunológico. Reações cutâneas adversas graves são reações de hipersensibilidade tipo IV tardia, envolvendo uma resposta imune específica ao medicamento mediada por células T.{"\n\n"}
              • Início: Intermediário. Na maioria dos casos, o início dos sintomas ocorreu de 1 a 4 semanas após o início da terapia.{"\n\n"}
              • Fatores de Risco: Ser do sexo feminino.
            </Text>
          </SubCollapsible>
          
          <SubCollapsible title="Hiponatremia (Sódio Baixo)">
            <Text style={styles.contentText}>
              • Mecanismo: Pode causar SIADH (síndrome de secreção inapropriada de hormônio antidiurético) via liberação de ADH ou pode causar SIADH nefrogênico aumentando a sensibilidade do rim ao ADH.{"\n\n"}
              • Início: Intermediário. Geralmente se desenvolve nas primeiras semanas de tratamento com um ISRS.{"\n\n"}
              • Fatores de Risco: Idade avançada, sexo feminino, uso concomitante de diuréticos, baixo peso corporal, baixa concentração sérica de sódio basal, depleção de volume, histórico de hiponatremia e sintomas de psicose. ISRS são identificados nos Critérios de Beers como medicamentos potencialmente inadequados para uso em pacientes ≥65 anos devido ao potencial de causar ou exacerbar SIADH ou hiponatremia; monitorar a concentração de sódio de perto.
            </Text>
          </SubCollapsible>
          
          <SubCollapsible title="Efeitos Oculares (Glaucoma)">
            <Text style={styles.contentText}>
              • Mecanismo: Glaucoma de ângulo fechado agudo (GACF): Mecanismo incerto; hipotetiza-se que os ISRS podem aumentar a pressão intraocular via efeitos serotoninérgicos na ativação do músculo ciliar e dilatação da pupila.{"\n\n"}
              • Fatores de Risco para GACF: Ser do sexo feminino, ≥50 anos de idade, hiperopia, histórico pessoal ou familiar de GACF, e ascendência inuíte ou asiática.
            </Text>
          </SubCollapsible>
          
          <SubCollapsible title="Síndrome Serotoninérgica">
            <Text style={styles.contentText}>
              • Mecanismo: Relacionado à dose; superestimulação dos receptores de serotonina por agentes serotoninérgicos.{"\n\n"}
              • Início: Rápido. Na maioria dos casos (74%), o início ocorreu em 24 horas após o início do tratamento, overdose ou mudança na dose.{"\n\n"}
              • Fatores de Risco: Uso concomitante de medicamentos que aumentam a síntese de serotonina, bloqueiam a recaptação de serotonina e/ou prejudicam o metabolismo da serotonina (ex: inibidores da monoamino oxidase [IMAOs]). O uso concomitante de IMAOs é contraindicado.
            </Text>
          </SubCollapsible>
          
          <SubCollapsible title="Disfunção Sexual">
            <Text style={styles.contentText}>
              • Mecanismo: Relacionado à dose; o aumento da serotonina pode afetar outros hormônios e neurotransmissores envolvidos na função sexual, como a testosterona (excitação sexual) e a dopamina (orgasmo).{"\n\n"}
              • Início: Variado. Um estudo longitudinal observou o início da disfunção sexual nas primeiras 6 semanas de tratamento com fluoxetina.{"\n\n"}
              • Fatores de Risco: A própria depressão (a disfunção sexual é comumente associada à depressão, o que pode dificultar a diferenciação).{"\n\n"}
              • A disfunção sexual pode persistir após a descontinuação da fluoxetina. A fluoxetina pode atrasar a ejaculação e é usada off-label para o tratamento da ejaculação precoce.
            </Text>
          </SubCollapsible>
          
          <SubCollapsible title="Síndrome de Abstinência (Descontinuação)">
            <Text style={styles.contentText}>
              • Mecanismo: Devido à redução da disponibilidade de serotonina no SNC com a diminuição dos níveis do ISRS. Outros sistemas de neurotransmissão (glutamina, dopamina) e o eixo hipotálamo-hipófise-adrenal também podem ser afetados.{"\n\n"}
              • Início: Intermediário. Início esperado é de 1 a 10 dias (após descontinuação abrupta ou gradual).{"\n\n"}
              • Fatores de Risco: Descontinuação abrupta ou redução muito rápida da dose, medicamentos com meia-vida \u003c24 horas (ex: paroxetina, venlafaxina), doses mais altas, maior duração do tratamento (≥4 semanas), e histórico prévio de sintomas de abstinência de antidepressivos
            </Text>
          </SubCollapsible>
        </CollapsibleCard>

        <View style={{ height: 50 }} />
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
    flex: 1,
    padding: theme.spacing.md,
  },
  card: {
    borderRadius: 15,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  cardContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  listItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  contentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  subCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: theme.spacing.sm,
  },
  subCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  subCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  subCardContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
});
