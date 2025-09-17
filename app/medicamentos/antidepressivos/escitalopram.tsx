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

export default function EscitalopramScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Escitalopram" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <CollapsibleCard title="APRESENTAÇÃO" color="#4CAF50">
          <View>
            <Text style={[styles.contentText, { marginBottom: 10 }]}>
              <Text style={{ fontWeight: 'bold' }}>Comprimido Revestido:</Text>{"\n"}
              • 10 mg{"\n"}
              • 15 mg{"\n"}
              • 20 mg
            </Text>
            <Text style={styles.contentText}>
              <Text style={{ fontWeight: 'bold' }}>Solução oral:</Text> 20mg/mL
            </Text>
          </View>
        </CollapsibleCard>

        <CollapsibleCard title="POSOLOGIA" color="#FF9800">
          <View>
            <Text style={[styles.contentText, { fontWeight: 'bold', marginBottom: 10 }]}>
              Instruções Gerais de Administração:
            </Text>
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Via de administração:</Text> Oral{"\n"}
              • <Text style={{ fontWeight: 'bold' }}>Frequência:</Text> Uma única vez ao dia{"\n"}
              • <Text style={{ fontWeight: 'bold' }}>Horário:</Text> Pode ser tomado a qualquer momento do dia, preferencialmente sempre no mesmo horário{"\n"}
              • <Text style={{ fontWeight: 'bold' }}>Alimentação:</Text> Com ou sem alimentos{"\n"}
              • <Text style={{ fontWeight: 'bold' }}>Modo de tomar:</Text> Engolir os comprimidos inteiros com água, sem mastigá-los{"\n\n"}
            </Text>
          </View>
          <SubCollapsible title="TRANSTORNO DE ANSIEDADE GENERALIZADA (TAG)">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Dose inicial:</Text> 5 a 10 mg uma vez ao dia{"\n"}
              {"    "}◦ Dose usual: 10 mg/dia{"\n"}
              {"    "}◦ Pacientes sensíveis à ansiedade: 5 mg/dia{"\n"}
              {"    "}◦ Idosos (≥65 anos): 5 mg/dia{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Titulação:</Text>{"\n"}
              {"    "}◦ Aumentar gradualmente em incrementos de 5-10 mg{"\n"}
              {"    "}◦ Intervalo mínimo entre ajustes: 1 semana{"\n"}
              {"    "}◦ Em ambiente hospitalar: ajustes a cada 3-4 dias se justificado{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Dose habitual:</Text> 10 mg/dia{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Dose máxima:</Text> 20 mg/dia{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Observações importantes:</Text>{"\n"}
              {"    "}◦ Manter dose inicial por 4-6 semanas antes de aumentar{"\n"}
              {"    "}◦ Tratamento mínimo de 3 meses para consolidação{"\n"}
              {"    "}◦ Considerar 6 meses para prevenção de recaídas{"\n"}
              {"    "}◦ Reavaliar benefícios periodicamente
            </Text>
          </SubCollapsible>
          <SubCollapsible title="TRANSTORNO DEPRESSIVO MAIOR (UNIPOLAR)">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Dose inicial:</Text>{"\n"}
              {"    "}◦ Adultos: 10 mg/dia{"\n"}
              {"    "}◦ Idosos: 5-10 mg/dia{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Titulação:</Text>{"\n"}
              {"    "}◦ Aumentar em incrementos de 10 mg{"\n"}
              {"    "}◦ Intervalo mínimo: 1 semana{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Dose habitual:</Text> 10 mg/dia{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Dose máxima:</Text>{"\n"}
              {"    "}◦ Conforme bula: 20 mg/dia{"\n"}
              {"    "}◦ Off-label: até 30 mg/dia (usar com cautela){"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Observações importantes:</Text>{"\n"}
              {"    "}◦ Resposta antidepressiva: 2-4 semanas{"\n"}
              {"    "}◦ Após remissão: mínimo 6 meses de tratamento{"\n"}
              {"    "}◦ Depressão recorrente: considerar tratamento contínuo por anos
            </Text>
          </SubCollapsible>
          <SubCollapsible title="TRANSTORNO DO PÂNICO, COM OU SEM AGORAFOBIA">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Dose inicial:</Text> 5 mg/dia na primeira semana{"\n"}
              {"    "}<Text style={{ fontStyle: 'italic' }}>(dose reduzida para evitar ansiedade paradoxal)</Text>{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Titulação:</Text>{"\n"}
              {"    "}◦ Após 1 semana: aumentar para 10 mg/dia{"\n"}
              {"    "}◦ Ajustar conforme resposta individual{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Dose habitual:</Text> 10 mg/dia (após primeira semana){"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Dose máxima:</Text> 20 mg/dia{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Observações importantes:</Text>{"\n"}
              {"    "}◦ Dose inicial reduzida previne ansiedade paradoxal{"\n"}
              {"    "}◦ Eficácia máxima: aproximadamente 3 meses{"\n"}
              {"    "}◦ Tratamento de longa duração
            </Text>
          </SubCollapsible>
          <SubCollapsible title="TRANSTORNO DE ANSIEDADE SOCIAL (FOBIA SOCIAL)">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Dose inicial:</Text> 10 mg/dia{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Titulação:</Text>{"\n"}
              {"    "}◦ Pode ser reduzida para 5 mg/dia (melhor tolerabilidade){"\n"}
              {"    "}◦ Pode ser aumentada até 20 mg/dia{"\n"}
              {"    "}◦ Ajustes após ≥4 semanas{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Dose habitual:</Text> 10 mg/dia{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Dose máxima:</Text> 20 mg/dia{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Observações importantes:</Text>{"\n"}
              {"    "}◦ Alívio dos sintomas: 2-4 semanas{"\n"}
              {"    "}◦ Consolidação: tratamento por 3 meses{"\n"}
              {"    "}◦ Prevenção de recaídas: até 6 meses{"\n"}
              {"    "}◦ <Text style={{ fontWeight: 'bold' }}>Indicado apenas se houver interferência significativa nas atividades sociais e profissionais</Text>
            </Text>
          </SubCollapsible>
          <SubCollapsible title="TRANSTORNO OBSESSIVO-COMPULSIVO (TOC)">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Dose inicial:</Text> 10 mg/dia{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Titulação:</Text>{"\n"}
              {"    "}◦ Aumentar em incrementos de 10 mg{"\n"}
              {"    "}◦ Intervalo mínimo: 1 semana{"\n"}
              {"    "}◦ Pode ser reduzida para 5 mg/dia conforme resposta{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Dose habitual:</Text> 10 mg/dia{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Dose máxima:</Text> 20 mg/dia{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Observações importantes:</Text>{"\n"}
              {"    "}◦ <Text style={{ fontWeight: 'bold' }}>TOC é uma doença crônica</Text>{"\n"}
              {"    "}◦ Tratamento individualizado por meses ou mais{"\n"}
              {"    "}◦ Ensaio terapêutico adequado: ≥6 semanas na dose máxima tolerada{"\n"}
              {"    "}◦ Reavaliar benefícios e dose regularmente
            </Text>
          </SubCollapsible>
        </CollapsibleCard>

        <CollapsibleCard title="DURAÇÃO DO TRATAMENTO" color="#2196F3">
          <View>
            <Text style={styles.contentText}>
              ◦ <Text style={{ fontWeight: 'bold' }}>Depressão:</Text> Efeitos iniciais em 1 a 2 semanas, com melhorias contínuas por 4 a 6 semanas. Após remissão dos sintomas requer tratamento por pelo menos 6 meses para consolidação da resposta.
            </Text>
            <Text style={[styles.contentText, { marginTop: 10 }]}>
              ◦ <Text style={{ fontWeight: 'bold' }}>Transtorno de Pânico:</Text> Eficácia máxima após aproximadamente 3 meses. O tratamento é de longa duração.
            </Text>
            <Text style={[styles.contentText, { marginTop: 10 }]}>
              ◦ <Text style={{ fontWeight: 'bold' }}>TAG:</Text> Melhora significativa observada desde a 1ª semana. Tratamento de respondedores por 6 meses pode prevenir recaídas.
            </Text>
            <Text style={[styles.contentText, { marginTop: 10 }]}>
              ◦ <Text style={{ fontWeight: 'bold' }}>Fobia Social:</Text> Alívio dos sintomas em 2 a 4 semanas. Recomenda-se tratamento por 3 meses para consolidação da resposta, podendo se estender por 6 meses para prevenção de recaídas.
            </Text>
            <Text style={[styles.contentText, { marginTop: 10 }]}>
              ◦ <Text style={{ fontWeight: 'bold' }}>TOC:</Text> A manutenção da resposta a longo prazo foi demonstrada em estudos de 24 semanas. É uma doença crônica e o tratamento deve ser por um período mínimo que assegure a ausência de sintomas.
            </Text>
          </View>
        </CollapsibleCard>

        <CollapsibleCard title="DOSE EM CASOS DE COMPROMETIMENTO RENAL (ADULTOS)" color="#9C27B0">
          <Text style={styles.contentText}>
            • Função renal alterada:{"\n"}
            {"    "}◦ CrCl ≥20 mL/minuto: Não é necessário ajuste de dose.{"\n"}
            {"    "}◦ CrCl {'<'}20 mL/minuto:{"\n"}
            {"        "}▪ Dose inicial: 5 mg uma vez ao dia.{"\n"}
            {"        "}▪ Titulação: Titular gradualmente com base na tolerabilidade e resposta com monitoramento rigoroso para efeitos adversos (ex: prolongamento do QT).{"\n"}
            {"    "}◦ Hemodiálise{"\n"}
            {"        "}▪ Dose inicial: 5 mg uma vez ao dia.{"\n"}
            {"        "}▪ Titulação: Titular gradualmente com base na tolerabilidade e resposta com monitoramento rigoroso para efeitos adversos (ex: prolongamento do QT).{"\n"}
            {"        "}▪ Nota: Escitalopram e seu metabólito ativo não são significativamente dialisados. Pelo prolongamento do intervalo QT foi observado um maior potencial de morte cardíaca súbita; desta forma é preferível substituir o uso por ISRS com menor potencial de prolongamento do QT.
          </Text>
        </CollapsibleCard>

        <CollapsibleCard title="DOSE EM CASOS DE COMPROMETIMENTO HEPÁTICO (ADULTOS)" color="#F44336">
          <Text style={styles.contentText}>
            • Comprometimento hepático antes do início do tratamento:{"\n"}
            {"    "}◦ Child-Turcotte-Pugh classe A a C:{"\n"}
            {"        "}▪ Dose inicial: 5 mg uma vez ao dia.{"\n"}
            {"        "}▪ Titulação: Pode aumentar a dose gradualmente com base na resposta e tolerabilidade em incrementos de 5 a 10 mg em intervalos de ≥2 semanas.{"\n"}
            {"        "}▪ Dose máxima: Ideal manter 10 mg/dia, de acordo com fabricante.{"\n\n"}
            {"    "}◦ Progressão de doença crônica (ex: paciente ambulatorial) OU Piora aguda da função hepática (ex: exigindo hospitalização):{"\n"}
            {"        "}▪ Não é necessário ajuste de dose (ex: manter a dose atual) se tolerado; se houver suspeita de intolerância, reduzir a dose.
          </Text>
        </CollapsibleCard>

        <CollapsibleCard title="PACIENTES IDOSOS" color="#FF5722">
          <Text style={styles.contentText}>
            <Text style={{ fontWeight: 'bold' }}>Transtorno de Ansiedade Generalizada; Transtorno Depressivo Maior (Unipolar)</Text>{"\n\n"}
            • <Text style={{ fontWeight: 'bold' }}>Dose inicial:</Text> Doses iniciais mais baixas de 5 mg uma vez ao dia foram sugeridas para início{"\n"}
            • <Text style={{ fontWeight: 'bold' }}>Dose usual:</Text> 10 mg uma vez ao dia.{"\n\n"}
            
            • <Text style={{ fontWeight: 'bold' }}>Precauções específicas para Idosos</Text>{"\n\n"}
            
            {"    "}◦ <Text style={{ fontWeight: 'bold' }}>Hiponatremia</Text> (pode estar relacionado a secreção inapropriada de hormônio antidiurético){"\n"}
            {"        "}▪ O risco aumenta em pacientes com idade avançada, sexo feminino, uso concomitante de diuréticos, baixo peso corporal, baixo nível de sódio sérico basal e depleção de volume.{"\n\n"}
            
            {"    "}◦ <Text style={{ fontWeight: 'bold' }}>Prolongamento do Intervalo QT e Arritmias Cardíacas</Text>{"\n"}
            {"        "}▪ O risco aumenta em pacientes com mais de 65 anos, sexo feminino e aqueles com doença cardíaca estrutural, histórico de infarto, insuficiência cardíaca com fração de ejeção reduzida, bradicardia ou distúrbios eletrolíticos (hipocalemia, hipocalcemia, hipomagnesemia).{"\n"}
            {"        "}▪ Deve ser realizado um <Text style={{ fontWeight: 'bold' }}>ECG</Text> antes do início do tratamento em pacientes com doença cardíaca estável. Se ocorrerem sinais de arritmia cardíaca, o tratamento deve ser descontinuado e um ECG realizado.{"\n\n"}
            
            {"    "}◦ <Text style={{ fontWeight: 'bold' }}>Risco de fraturas ósseas</Text>{"\n"}
            {"        "}▪ Risco parece aumentado no uso prolongado{"\n"}
            {"        "}▪ Mecanismo exato não é claro. Podendo ser efeito direto na remodelação óssea e/ou aumento de tendência a queda{"\n"}
            {"        "}▪ O escitalopram é identificado nos <Text style={{ fontWeight: 'bold' }}>critérios STOPP</Text> (Screening Tool of Older Person's Prescriptions) como um medicamento potencialmente inapropriado em idosos (≥65 anos) com histórico de quedas recorrentes devido ao aumento do risco de queda.
          </Text>
        </CollapsibleCard>

        <CollapsibleCard title="REAÇÕES ADVERSAS" color="#795548">
          <SubCollapsible title="Reações Adversas Muito Comuns">
            <Text style={styles.contentText}>
              <Text style={{ fontWeight: 'bold' }}>Estas são as reações observadas em uma porção significativa dos pacientes adultos, ocorrendo em mais de um em cada dez indivíduos que utilizam o medicamento</Text>{"\n\n"}
              
              ◦ <Text style={{ fontWeight: 'bold' }}>Náusea:</Text> Um dos efeitos mais frequentemente relatados.{"\n"}
              ◦ <Text style={{ fontWeight: 'bold' }}>Cefaleia:</Text> Também é uma ocorrência muito comum
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Reações Adversas Comuns">
            <Text style={styles.contentText}>
              <Text style={{ fontWeight: 'bold' }}>Estas reações são observadas em uma frequência relevante, ocorrendo em um a cada cem a um a cada dez pacientes adultos.</Text>{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Distúrbios Gastrointestinais:</Text>{"\n"}
              {"    "}◦ Diarreia{"\n"}
              {"    "}◦ Constipação (prisão de ventre){"\n"}
              {"    "}◦ Boca seca (Xerostomia){"\n"}
              {"    "}◦ Vômitos{"\n"}
              {"    "}◦ Dispepsia (indigestão){"\n"}
              {"    "}◦ Dor abdominal{"\n"}
              {"    "}◦ Flatulência{"\n"}
              {"    "}◦ Aumento ou diminuição do apetite.{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Distúrbios do Sistema Nervoso:</Text>{"\n"}
              {"    "}◦ Insônia (dificuldade para dormir){"\n"}
              {"    "}◦ Sonolência diurna{"\n"}
              {"    "}◦ Tontura{"\n"}
              {"    "}◦ Bocejos{"\n"}
              {"    "}◦ Tremores{"\n"}
              {"    "}◦ Parestesia (sensação de agulhadas na pele){"\n"}
              {"    "}◦ Ansiedade{"\n"}
              {"    "}◦ Inquietude{"\n"}
              {"    "}◦ Sonhos anormais{"\n"}
              {"    "}◦ Irritabilidade{"\n"}
              {"    "}◦ Letargia{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Distúrbios Sexuais:</Text>{"\n"}
              {"    "}◦ Dificuldade de ejaculação (ejaculação retardada){"\n"}
              {"    "}◦ Diminuição da libido (desejo sexual){"\n"}
              {"    "}◦ Disfunção erétil (em homens){"\n"}
              {"    "}◦ Anorgasmia (dificuldade para atingir o orgasmo em mulheres){"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Distúrbios Endócrinos e Metabólicos:</Text>{"\n"}
              {"    "}◦ Aumento do peso{"\n"}
              {"    "}◦ Doença menstrual{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Distúrbios Musculoesqueléticos:</Text>{"\n"}
              {"    "}◦ Dores musculares (Mialgias){"\n"}
              {"    "}◦ Dores nas articulações (Artralgias){"\n"}
              {"    "}◦ Dor no pescoço{"\n"}
              {"    "}◦ Dor no ombro{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Distúrbios Gerais e do Local de Administração:</Text>{"\n"}
              {"    "}◦ Fadiga (Cansaço){"\n"}
              {"    "}◦ Febre{"\n"}
              {"    "}◦ Aumento da sudorese{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Distúrbios Respiratórios:</Text>{"\n"}
              {"    "}◦ Nariz entupido ou com coriza (Sinusite){"\n"}
              {"    "}◦ Sintomas semelhantes à gripe{"\n"}
              {"    "}◦ Rinite
            </Text>
          </SubCollapsible>
        </CollapsibleCard>

        <CollapsibleCard title="FATORES DE RISCO E PRECAUÇÕES" color="#607D8B">
          <SubCollapsible title="Prolongamento do Intervalo QT ou Síndrome Congênita do QT Longo">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Importante:</Text> O oxalato de escitalopram é contraindicado em pacientes com diagnóstico prévio de prolongamento do intervalo QT ou síndrome congênita do QT longo.{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Risco:</Text> O medicamento pode causar um aumento dose-dependente do intervalo QT. Casos de prolongamento do intervalo QT e arritmia ventricular, incluindo Torsades de Pointes, foram relatados pós-comercialização, especialmente em mulheres, pacientes com hipocalemia ou outras doenças cardíacas preexistentes.{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Mecanismo:</Text> Acredita-se que o escitalopram cause o prolongamento do QTc via bloqueio direto da corrente de potássio.{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Monitoramento:</Text> Se ocorrerem sinais de arritmia cardíaca durante o tratamento, o escitalato de escitalopram deve ser descontinuado e um ECG realizado. Um ECG deve ser considerado antes do início do tratamento em pacientes com doença cardíaca estável.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Bradicardia Significativa, Infarto Agudo do Miocárdio Recente ou Insuficiência Cardíaca Descompensada">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Cautela:</Text> Recomenda-se cautela nesses pacientes devido à limitada experiência clínica e ao risco de arritmias.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Desequilíbrios Eletrolíticos (Hipocalemia, Hipomagnesemia)">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Gestão:</Text> Distúrbios eletrolíticos como hipocalemia (níveis baixos de potássio) e hipomagnesemia (níveis baixos de magnésio) aumentam o risco de arritmias malignas e devem ser tratados antes do início do escitalopram.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Transtorno Bipolar/Histórico de Mania/Hipomania">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Cautela:</Text> Usar ISRSs com orientação médica em pacientes com histórico de mania/hipomania.{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Risco:</Text> Antidepressivos podem precipitar um episódio misto ou maníaco em pacientes com transtorno bipolar. A mania se manifesta por mudanças rápidas de ideias, euforia inadequada e hiperatividade física.{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Gestão:</Text> Descontinuar o escitalopram se o paciente entrar em fase maníaca.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Transtorno de Pânico">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Ansiedade Paradoxal:</Text> Alguns pacientes podem experimentar intensificação dos sintomas de ansiedade no início do tratamento. Essa reação geralmente desaparece em duas semanas com o tratamento contínuo.{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Dose Inicial:</Text> Recomenda-se uma dose inicial baixa (5 mg na primeira semana) para reduzir a probabilidade de um efeito ansiogênico paradoxal.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Depressão e Transtornos de Ansiedade com Risco de Suicídio">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Atenção:</Text> A depressão e outros transtornos psiquiátricos para os quais o escitalopram é indicado estão associados a um aumento de pensamentos suicidas e atos de automutilação. Esse risco persiste até a remissão da doença.{"\n\n"}

              • <Text style={{ fontWeight: 'bold' }}>Monitoramento:</Text> Pacientes com histórico de tentativas ou ideação suicida e jovens adultos (abaixo de 25 anos) têm maior risco e devem ser cuidadosamente monitorados, especialmente no início do tratamento e após ajustes de dose.{"\n\n"}

              • <Text style={{ fontWeight: 'bold' }}>Orientação:</Text> Pacientes e familiares devem ser alertados para monitorar qualquer piora clínica, comportamento ou pensamentos suicidas e buscar ajuda médica imediatamente.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Epilepsia/Convulsões">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Risco:</Text> ISRSs podem diminuir o limiar convulsivo.{"\n\n"}

              • <Text style={{ fontWeight: 'bold' }}>Gestão:</Text> Aconselha-se precaução quando administrado com outros medicamentos que diminuem o limiar convulsivo. O escitalopram deve ser descontinuado se o paciente apresentar convulsões pela primeira vez ou se houver aumento na frequência das crises em pacientes com epilepsia prévia. Evitar o uso em pacientes com epilepsia instável.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Acatisia/Agitação Psicomotora">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Ocorrência:</Text> Associada ao uso de ISRS, caracterizada por inquietação e necessidade de se movimentar. Mais comum nas primeiras semanas.{"\n\n"}

              • <Text style={{ fontWeight: 'bold' }}>Gestão:</Text> Aumento da dose pode piorar os sintomas.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Diabetes Mellitus">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Atenção:</Text> O tratamento com ISRSs pode alterar o controle glicêmico (hipoglicemia ou hiperglicemia), possivelmente devido à melhora dos sintomas depressivos.{"\n\n"}

              • <Text style={{ fontWeight: 'bold' }}>Gestão:</Text> Pode ser necessário ajuste na dose de insulina e/ou hipoglicemiantes orais.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Hiponatremia (Baixo Nível de Sódio no Sangue)">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Risco:</Text> Relatada como efeito adverso raro com ISRSs, provavelmente relacionada à secreção inadequada de hormônio antidiurético (SIADH).{"\n\n"}

              • <Text style={{ fontWeight: 'bold' }}>Populações de Risco:</Text> Idosos, pacientes cirróticos, ou em uso concomitante de medicamentos que causam hiponatremia.{"\n\n"}

              • <Text style={{ fontWeight: 'bold' }}>Resolução:</Text> Geralmente se resolve com a descontinuação do tratamento.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Tendência a Sangramentos/Uso de Anticoagulantes/Anti-inflamatórios">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Risco:</Text> Há relatos de sangramentos anormais (equimoses, púrpura, hemorragia gastrointestinal) com o uso de ISRSs.{"\n\n"}          

              • <Text style={{ fontWeight: 'bold' }}>Cautela:</Text> Recomenda-se cautela em pacientes em tratamento com medicamentos que afetam a função plaquetária (ex: AINEs, aspirina, ticlopidina, dipiridamol) ou anticoagulantes orais (varfarina).{"\n\n"}          

              • <Text style={{ fontWeight: 'bold' }}>Monitoramento:</Text> A coagulação deve ser monitorada cuidadosamente ao iniciar ou interromper o escitalopram em pacientes sob anticoagulação oral.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Fertilidade">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Qualidade do Esperma:</Text> Estudos em animais com citalopram (similar ao escitalopram) mostraram redução nos índices de fertilidade e qualidade do esperma. Efeitos na qualidade do esperma em humanos com alguns ISRSs são reversíveis. Até o momento não foi observado impacto na fertilidade humana.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Glaucoma de Ângulo Fechado">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Risco:</Text> ISRSs podem afetar o tamanho da pupila (midríase), o que pode reduzir o ângulo ocular, aumentando a pressão intraocular e o risco de glaucoma de ângulo fechado, especialmente em pacientes pré-dispostos.{"\n\n"}          

              • <Text style={{ fontWeight: 'bold' }}>Cautela:</Text> Usar com precaução em pacientes com glaucoma de ângulo fechado ou histórico.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Polimorfismo CYP2C19">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Impacto:</Text> Pacientes com problemas na metabolização pela isoenzima CYP2C19 podem apresentar concentração plasmática de escitalopram duas vezes maior.{"\n\n"}          

              • <Text style={{ fontWeight: 'bold' }}>Ajuste de Dose:</Text> Para esses pacientes, recomenda-se uma dose inicial de 5 mg/dia nas primeiras duas semanas, podendo ser aumentada para 10 mg/dia.
            </Text>
          </SubCollapsible>
        </CollapsibleCard>

        <CollapsibleCard title="CONTRAINDICAÇÕES" color="#3F51B5">
          <View>
            <Text style={[styles.contentText, { fontWeight: 'bold', fontSize: 16, marginBottom: 10 }]}>
              1. Hipersensibilidade aos Componentes
            </Text>
            <Text style={[styles.contentText, { marginBottom: 20 }]}>
              O oxalato de escitalopram é contraindicado em pacientes que apresentem hipersensibilidade (alergia) ao escitalopram ou a qualquer um dos excipientes presentes na formulação do medicamento.
            </Text>

            <Text style={[styles.contentText, { fontWeight: 'bold', fontSize: 16, marginBottom: 10 }]}>
              2. Interações Medicamentosas de Risco Grave
            </Text>
            <Text style={[styles.contentText, { marginBottom: 15 }]}>
              A coadministração de escitalopram com certos medicamentos pode desencadear reações adversas severas, tornando a combinação contraindicada.
            </Text>

            <Text style={[styles.contentText, { fontWeight: 'bold', fontSize: 15, marginBottom: 10 }]}>
              2.1. Inibidores da Monoaminoxidase (IMAOs)
            </Text>
            
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>IMAOs Não-Seletivos Irreversíveis:</Text> O uso concomitante é contraindicado devido ao risco de Síndrome Serotoninérgica, uma condição grave caracterizada por agitação, tremor e hipertermia.{"\n"}
              {"    "}◦ <Text style={{ fontWeight: 'bold' }}>É necessário um intervalo de segurança:</Text> Iniciar o escitalopram apenas 14 dias após a suspensão de um IMAO irreversível. Da mesma forma, deve-se aguardar no mínimo 7 dias após a suspensão do escitalopram para iniciar um IMAO irreversível não-seletivo.{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>IMAO-A Reversíveis (ex.: moclobemida):</Text> A combinação com escitalopram é contraindicada devido ao risco de Síndrome Serotoninérgica.{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>IMAO Não-Seletivo Reversível (ex.: linezolida):</Text> O antibiótico linezolida, sendo um IMAO não-seletivo reversível, não deve ser administrado em pacientes em tratamento com escitalopram, devido ao risco de Síndrome Serotoninérgica. Embora algumas fontes sugiram que o risco de síndrome serotoninérgica seja baixo com esta combinação e possa ser administrada quando estritamente necessário, a bula do produto a lista como contraindicação.{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>IMAO-B Irreversível (selegilina):</Text> A cautela é requerida, e a bula indica que a combinação é contraindicada devido ao risco de síndrome serotoninérgica. Doses de selegilina até 10 mg diárias foram coadministradas com segurança associadas ao escitalopram.
            </Text>

            <Text style={[styles.contentText, { fontWeight: 'bold', fontSize: 15, marginTop: 20, marginBottom: 10 }]}>
              2.2. Pimozida
            </Text>
            <Text style={[styles.contentText, { marginBottom: 15 }]}>
              A coadministração de escitalopram com pimozida é contraindicada. A interação resulta em um aumento significativo do intervalo QTc, representando um risco cardíaco muito grave.
            </Text>

            <Text style={[styles.contentText, { fontWeight: 'bold', fontSize: 15, marginBottom: 10 }]}>
              2.3. Medicamentos que Prolongam o Intervalo QT
            </Text>
            <Text style={styles.contentText}>
              O escitalopram é contraindicado em uso concomitante com medicamentos que comprovadamente causam prolongamento do intervalo QT. Isso inclui, mas não se limita a:{"\n\n"}
              
              • <Text style={{ fontWeight: 'bold' }}>Antiarrítmicos Classes IA e III.</Text>{"\n"}
              • <Text style={{ fontWeight: 'bold' }}>Antipsicóticos</Text> (ex.: derivados da fenotiazina, pimozida, haloperidol, tioridazina).{"\n"}
              • <Text style={{ fontWeight: 'bold' }}>Antidepressivos tricíclicos.</Text>{"\n"}
              • <Text style={{ fontWeight: 'bold' }}>Certos agentes antimicrobianos</Text> (ex.: esparfloxacino, moxifloxacino, eritromicina injetável, pentamidina, halofantrina).{"\n"}
              • <Text style={{ fontWeight: 'bold' }}>Alguns anti-histamínicos</Text> (astemizol, mizolastina).{"\n"}
              • <Text style={{ fontWeight: 'bold' }}>Outros medicamentos</Text> que podem prolongar o QTc, como fluconazol, domperidona, sertindol, piperaquina, levocetoconazol, entre outros.
            </Text>

            <Text style={[styles.contentText, { fontWeight: 'bold', fontSize: 16, marginTop: 20, marginBottom: 10 }]}>
              3. Condições Cardíacas Preexistentes com Risco de Arritmias
            </Text>
            <Text style={styles.contentText}>
              O escitalopram é contraindicado em pacientes com:{"\n\n"}
              • <Text style={{ fontWeight: 'bold' }}>Diagnóstico prévio de prolongamento do intervalo QT.</Text>{"\n"}
              • <Text style={{ fontWeight: 'bold' }}>Síndrome Congênita do QT Longo.</Text>
            </Text>
          </View>
        </CollapsibleCard>

        <CollapsibleCard title="GRAVIDEZ E AMAMENTAÇÃO" color="#E91E63">
          <SubCollapsible title="Gravidez">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Risco Categoria B:</Text> Dados clínicos limitados. Estudos em animais mostraram toxicidade reprodutiva. Não usar durante a gravidez a menos que a necessidade seja clara e o risco-benefício cuidadosamente avaliado.{"\n\n"}
              
              {"    "}◦ <Text style={{ fontWeight: 'bold' }}>Recém-nascidos:</Text> Observar recém-nascidos se o uso continuou até estágios avançados da gravidez (terceiro trimestre), devido a possíveis efeitos de descontinuação (dificuldade respiratória, convulsões, instabilidade térmica, etc.) ou síndrome serotoninérgica.{"\n\n"}
              
              {"    "}◦ <Text style={{ fontWeight: 'bold' }}>Hipertensão Pulmonar Persistente do Recém-Nascido (HPPN):</Text> O uso de ISRS no final da gravidez pode aumentar o risco de HPPN.{"\n\n"}
              
              {"    "}◦ <Text style={{ fontWeight: 'bold' }}>Descontinuação:</Text> Não interromper abruptamente. A descontinuação deve ser gradual.{"\n\n"}
              
              {"    "}◦ <Text style={{ fontWeight: 'bold' }}>Hemorragia Pós-parto:</Text> Dados observacionais indicam um risco aumentado (menos de 2 vezes) de hemorragia pós-parto após exposição a ISRS no mês anterior ao nascimento.
            </Text>
          </SubCollapsible>
          <SubCollapsible title="Amamentação">
            <Text style={styles.contentText}>
              • <Text style={{ fontWeight: 'bold' }}>Excreção no Leite Materno:</Text> O escitalopram é excretado no leite materno.{"\n\n"}
              
              {"    "}◦ <Text style={{ fontWeight: 'bold' }}>Recomendação:</Text> Mulheres em fase de amamentação não devem ser tratadas com escitalopram. Em situações de gravidade clínica materna que impossibilitem a interrupção, considerar substituição do aleitamento por leites industrializados.{"\n\n"}
              
              {"    "}◦ <Text style={{ fontWeight: 'bold' }}>Eventos Adversos no Bebê:</Text> Agitação, sedação excessiva, inquietação, alimentação inadequada e baixo ganho de peso foram relatados. Bebês expostos devem ser monitorados quanto a irritabilidade, alterações no sono, alimentação, comportamento, crescimento e desenvolvimento.
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
