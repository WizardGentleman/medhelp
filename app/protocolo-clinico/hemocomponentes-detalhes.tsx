import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Droplets } from 'lucide-react-native';

export default function HemocomponentesDetalhesScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Hemocomponentes" type="clinical" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Card de Introdução */}
          <View style={styles.introCard}>
            <View style={styles.introHeader}>
              <Droplets size={24} color="#FF8F00" />
              <Text style={styles.introTitle}>Hemocomponentes</Text>
            </View>
            <Text style={styles.introText}>
              Protocolo para orientação sobre o uso adequado de hemocomponentes em ambiente hospitalar.
            </Text>
          </View>

          {/* Tipos de Hemocomponentes */}
          <Text style={styles.hemocomponentesText}>
            <Text style={styles.procedureTitle}>📋 TIPOS DE HEMOCOMPONENTES:</Text>{"\n\n"}
            
            <Text style={styles.procedureTitle}>🔴 CONCENTRADO DE HEMÁCIAS (CH):</Text>{"\n"}
            • Incremento de hemoglobina em uma bolsa: 1 a 1,5 d/dL{"\n"}
            • Incremento de hematócrito em uma bolsa: 3%{"\n"}
            • Volume: 220-280 mL{"\n"}
            • Hematócrito: 55-75%{"\n"}
            • Armazenamento: 35 a 42 dias{"\n"}
            • O tempo de transfusão das hemácias deve ser entre 1 e 4 horas (se for pausado, deve ser retomado se for possível terminar em até 4 horas){"\n"}
            • Apenas o soro fisiológico pode ser administrado no mesmo acesso venoso periférico junto à transfusão. Esta restrição não é necessária para cateteres centrais.{"\n\n"}
            
            <Text style={styles.procedureTitle}>🟡 CONCENTRADO DE PLAQUETAS (CP):</Text>{"\n"}
            • Indicação: Prevenção/tratamento de sangramentos{"\n"}
            • Armazenamento: 20-24°C por até 5 dias (maior risco de contaminação bacteriana){"\n"}
            • Velocidade: Mínimo 30 minutos (não exceder 20-30 mL/kg/hora){"\n"}
            • Avaliação resposta terapêutica: 1 hora após a transfusão (em pacientes ambulatoriais pode ser avaliado após 10 minutos pós término da transfusão){"\n"}
            • 1 unidade de CP contém aproximadamente 5,5 x 10¹¹ plaquetas em 50‑60mL de plasma{"\n"}
            • A dose padrão de concentrado de plaquetas para um adulto é aproximadamente 3,0 x 10¹¹ plaquetas. Em geral, essa dose aumenta a contagem de plaquetas em aproximadamente 30.000 a 60.000/mm³ em um adulto de 70 kg.{"\n\n"}
            
            <Text style={styles.boldText}>Pool Plaquetas (Plaqueta randômica):</Text>{"\n"}
            União de 4 a 5 unidades de CP{"\n"}
            • 1 pool de plaquetas para cada 10kg{"\n\n"}
            
            <Text style={styles.boldText}>CP por aférese Plaquetas:</Text>{"\n"}
            União de 6 a 8 unidades de CP{"\n"}
            • 1 Unidade contém pelo menos 3,0 x 10¹¹ plaquetas{"\n"}
            • Dose: 1 unidade acima de 55kg e meia a 1 unidade entre 15 a 55 kg{"\n"}
            • Volume médio 200 a 300 ml{"\n"}
            • Já é leucorreduzido (não é necessário filtração){"\n\n"}
            
            <Text style={styles.procedureTitle}>🟦 PLASMA FRESCO CONGELADO (PFC):</Text>{"\n"}
            • Definição: Fração acelular do sangue obtida por centrifugação do sangue total ou por aférese.{"\n"}
            • Volume aproximado: acima de 180 mL.{"\n"}
            • Dose: 10 a 20 ml de PFC por kilo de peso{"\n"}
            • Conteúdo mínimo: ≥ 70 UI de Fator VIII/100 mL e níveis adequados dos demais fatores lábeis.{"\n"}
            • Congelamento: Até 8h após coleta, a -25°C (mínimo -18°C).{"\n"}
            • Validade:{"\n"}
            - -18°C a -25°C: 12 meses{"\n"}
            - {'<'} -25°C: 24 meses{"\n"}
            • Variedades:{"\n\n"}
            
            <Text style={styles.boldText}>PIC (Plasma Isento de Crioprecipitado):</Text> 150-200 mL; depletado de FVIII, fibrinogênio e multímeros do FvW, mas contém metaloproteinase. Mesma validade do PFC.{"\n\n"}
            
            <Text style={styles.boldText}>PFC24 (Plasma Fresco Congelado de 24h):</Text> obtido entre 8-24h pós-coleta; volume 200-250 mL; pequena redução de FV e FVIII, sem impacto clínico - mesmas indicações do PFC.{"\n\n"}
            
            <Text style={styles.procedureTitle}>⚪ CRIOPRECIPITADO:</Text>{"\n"}
            • Definição: Fração concentrada de proteínas plasmáticas insolúveis a 1-6°C, obtida do PFC após descongelamento e remoção do plasma sobrenadante.{"\n"}
            • Volume: 10-15 mL por bolsa.{"\n"}
            • Dose: 1 unidade para cada 10 kg de peso{"\n"}
            • Composição (por unidade):{"\n"}
            - Fibrinogênio: 150-250 mg (mín. 150 mg){"\n"}
            - Fator VIII: 80-150 U (mín. 80 U){"\n"}
            - Fator von Willebrand (vWF): 100-150 U (40-70% da unidade inicial){"\n"}
            - Fator XIII: 50-75 U (20-30% da unidade inicial){"\n"}
            - Fibronectina{"\n\n"}
            
            • Indicações principais:{"\n"}
            - Deficiência ou consumo de fibrinogênio{"\n"}
            - Deficiência de Fator XIII{"\n"}
            - Doença de von Willebrand (quando concentrados específicos não disponíveis){"\n"}
            - Hemofilias (apenas em situações excepcionais, sem acesso a concentrados específicos){"\n"}
            • Armazenamento: Recongelado em até 1h após preparo; -18°C ou inferior, por até 12 meses.{"\n"}
            • Pool: Soma dos fatores proporcional ao número de bolsas utilizadas.
          </Text>

          {/* Subseção: Procedimentos Especiais */}
          <View style={[styles.sectionHeader, {backgroundColor: '#7C3AED', marginTop: 16}]}>
            <Text style={[styles.sectionTitle, {color: '#FFFFFF'}]}>PROCEDIMENTOS ESPECIAIS EM HEMOCOMPONENTES CELULARES</Text>
          </View>
          
          <Text style={styles.hemocomponentesText}>
            {/* Faixa FILTRADO */}
            <View style={{
              backgroundColor: '#3B82F6',
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
              marginVertical: theme.spacing.xl,
              borderRadius: theme.borderRadius.md,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: theme.fontSize.sm,
                fontFamily: 'Roboto-Bold',
                textAlign: 'center'
              }}>🔍 FILTRADO</Text>
            </View>{"\n\n"}
            
            Remoção de leucócitos para diminuir sensibilização HLA.{"\n\n"}
            
            <Text style={styles.boldText}>1. Redução de complicações transfusionais</Text>{"\n\n"}
            <Text style={styles.boldText}>Histórico de Reações Febris Não Hemolíticas (RFNH):</Text> Indicado em pacientes com ≥ 2 episódios prévios.{"\n\n"}
            
            <Text style={styles.boldText}>Pacientes politransfundidos / demanda crônica de transfusão</Text> (Exemplos: Doença falciforme, talassemias, anemias hemolíticas hereditárias).{"\n\n"}
            
            Candidatos a transplante de medula óssea.{"\n\n"}
            
            Portadores de doenças plaquetárias com necessidade transfusional frequente.{"\n\n"}
            
            Síndromes de imunodeficiências congênitas.{"\n\n"}
            
            Pacientes imunossuprimidos em geral (ex.: pós-quimioterapia).{"\n\n"}
            
            <Text style={styles.boldText}>2. Contexto onco-hematológico</Text>{"\n\n"}
            Anemia aplástica.{"\n\n"}
            
            Leucemia mieloide aguda.{"\n\n"}
            
            Doenças onco-hematológicas graves (mesmo antes da definição diagnóstica).{"\n\n"}
            
            <Text style={styles.boldText}>3. Prevenção da transmissão de CMV</Text>{"\n"}
            Indicado quando não há hemocomponentes CMV-negativos disponíveis, para uso em pacientes de alto risco:{"\n\n"}
            
            Pacientes HIV positivos com sorologia negativa para CMV.{"\n\n"}
            
            Candidatos a transplante de órgãos sólidos e medula óssea quando doador e receptor são CMV negativos.{"\n\n"}
            
            Transfusão intrauterina.{"\n\n"}
            
            Gestantes soronegativas (ou status sorológico desconhecido).{"\n\n"}
            
            Recém-nascidos prematuros e/ou de baixo peso ({'<'} 1200g) de mães CMV negativas ou com sorologia desconhecida.{"\n\n"}
            
            <Text style={{fontStyle: 'italic', fontSize: theme.fontSize.sm, fontFamily: 'Roboto-Regular', color: theme.colors.text}}>OBS: Plasma fresco congelado (PFC) e crioprecipitado já são leucodepletados de rotina → não há necessidade de filtração adicional.</Text>{"\n\n"}
            
            {/* Divisão entre FILTRADO e IRRADIADO */}
            <View style={{
              backgroundColor: '#7C3AED',
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
              marginVertical: theme.spacing.xl,
              borderRadius: theme.borderRadius.md,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: theme.fontSize.sm,
                fontFamily: 'Roboto-Bold',
                textAlign: 'center'
              }}>☢️ IRRADIADO</Text>
            </View>{"\n\n"}
            
            Reduz a proliferação de linfócito T{"\n"}
            • <Text style={styles.boldText}>Previne reação do enxerto versus hospedeiro</Text>{"\n\n"}
            
            <Text style={styles.boldText}>🎯 Indicações Principais</Text>{"\n\n"}
            
            <Text style={styles.boldText}>1. Situações especiais em neonatologia</Text>{"\n\n"}
            Transfusão intrauterina.{"\n\n"}
            
            Exsanguíneo-transfusão após transfusão intrauterina prévia.{"\n\n"}
            
            Recém-nascidos prematuros {'<'}28 semanas e/ou peso {'<'}1200 g.{"\n\n"}
            
            <Text style={styles.boldText}>2. Imunodeficiências e imunossupresão</Text>{"\n\n"}
            Síndromes de imunodeficiência congênita grave.{"\n\n"}
            
            <Text style={styles.boldText}>Pacientes onco-hematológicos:</Text>{"\n\n"}
            
            Linfomas.{"\n\n"}
            
            Leucemia mieloide aguda.{"\n\n"}
            
            Anemia aplástica em quimioterapia ou imunossupresão (ou até 6 meses após término).{"\n\n"}
            
            Uso de análogos de purina (fludarabina, cladribina, deoxicoformicina){"\n\n"}
            
            Receptor de transplante de órgãos sólidos em uso de imunossupressores.{"\n\n"}
            
            <Text style={styles.boldText}>3. Transplantes de células hematopoiéticas</Text>{"\n\n"}
            <Text style={styles.boldText}>Transplante autólogo de medula óssea:</Text>{"\n\n"}
            Durante o preparo e até a recuperação da função medular.{"\n\n"}
            
            Transplante alogênico de medula óssea (programado ou previsto).{"\n\n"}
            
            Transplante de células progenitoras hematopoiéticas (CPH) de cordão umbilical ou placenta.{"\n\n"}
            
            <Text style={styles.boldText}>4. Relação do doador com o receptor</Text>{"\n\n"}
            Qualquer grau de parentesco entre doador e receptor → <Text style={styles.boldText}>obrigatória irradiação</Text> (mesmo parentes de 1º grau){"\n\n"}
            
            Receptor de concentrado de plaquetas HLA compatíveis (altamente imunossupressor).{"\n\n"}
            
            <Text style={styles.boldText}>⚠️ Observações Importantes</Text>{"\n\n"}
            As bolsas de plaquetas por aférese são naturalmente irradiadas.{"\n\n"}
            
            Irradiação não elimina o risco de outras complicações transfusionais (CMV, reação febril não hemolítica, TACO, TRALI).{"\n\n"}
            
            PFC e crioprecipitado não necessitam irradiação, pois não contêm linfócitos viáveis.{"\n\n"}
            
            {/* Divisão entre IRRADIADO e LAVADO */}
            <View style={{
              backgroundColor: '#06B6D4',
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
              marginVertical: theme.spacing.xl,
              borderRadius: theme.borderRadius.md,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: theme.fontSize.sm,
                fontFamily: 'Roboto-Bold',
                textAlign: 'center'
              }}>🧼 LAVADO</Text>
            </View>{"\n\n"}
            
            Retira proteínas imunugênicas e conservantes para evitar reações alérgicas graves, especialmente em deficiência de IgA; <Text style={styles.boldText}>só indicado em casos extremos</Text> por aumentar risco infeccioso (contaminação bacteriana).{"\n"}
            • <Text style={styles.boldText}>Indicado para quem já apresentou anafilaxia</Text> após uma transfusão{"\n"}
            • <Text style={styles.boldText}>Paciente com deficiência IgA</Text>{"\n\n"}
            
            {/* Divisão entre LAVADO e FENOTIPADO */}
            <View style={{
              backgroundColor: '#10B981',
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
              marginVertical: theme.spacing.xl,
              borderRadius: theme.borderRadius.md,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: theme.fontSize.sm,
                fontFamily: 'Roboto-Bold',
                textAlign: 'center'
              }}>🧬 FENOTIPADO</Text>
            </View>{"\n\n"}
            
            Identificação de antígenos eritrocitários (ABO, RH) menos comuns (como Kell e Duffy), <Text style={styles.boldText}>reduzindo alossensibilização</Text>. Relevante para <Text style={styles.boldText}>politransfundidos</Text> (exemplo: anemia falciforme).
          </Text>

          {/* Subseção: Indicações Clínicas */}
          <View style={[styles.sectionHeader, {backgroundColor: '#FF8F00', marginTop: 16}]}>
            <Text style={[styles.sectionTitle, {color: '#FFFFFF'}]}>INDICAÇÕES CLÍNICAS</Text>
          </View>
          
          <View style={[styles.indicationBox, {backgroundColor: '#FFF5F5', borderLeftColor: '#DC2626'}]}>
            <Text style={styles.boldText}>CONCENTRADO DE HEMÁCIAS</Text>
            <Text style={styles.hemocomponentesText}>
              • Hb {'<'}7 g/dL indica transfusão.{"\n\n"}
              • Hb entre 7-10 g/dL: decisão depende do quadro clínico (ex: grandes variações de hemoglobina em período curto), comorbidades (idosos, nefropatas ou cardiopatas), e sinais clínicos de urgência (ex: dor precordial, dispneia em repouso, taquicardia refratária ao volume e/ou hipotensão postural) (recomendação B){"\n\n"}
              • Hb {'>'}10 g/dL: não transfundir.{"\n\n"}
              
              <Text style={styles.boldText}>⚠️ Hemorragia aguda:</Text>{"\n\n"}
              Indicar CH quando perda {'>'} 25–30% da volemia total ou diante de sinais clínicos de choque/hipoperfusão (FC {'>'} 100–120 bpm, hipotensão, oligúria, taquipneia, enchimento capilar {'>'} 2s, alteração do nível de consciência).{"\n\n"}
              Hematócrito não é bom parâmetro (cai só após 1–2h do início do sangramento).{"\n\n"}
              
              <Text style={styles.boldText}>DICAS:</Text>{"\n\n"}
              • Em pacientes cardiopatas/hipervolêmicos, realizar transfusão lenta e avaliar furosemida pós transfusional{"\n\n"}
              • Anemia falciforme, transfundir se paciente sintomático. Avaliar 24 a 48 pós transfusão com marcadores de hemólise{"\n\n"}
              • Anemia hemolítica autoimune, transfundir se paciente sintomático ou sinais de insuficiência cardíaca de alto débito. Idealmente transfundir 100 ml lentamente e restante fracionado.{"\n\n"}
              
              <Text style={styles.boldText}>❌ Não indicar CH para:</Text>{"\n\n"}
              • Promover sensação de bem-estar.{"\n"}
              • Acelerar cicatrização.{"\n"}
              • Uso profilático.{"\n"}
              • Expansão volêmica se transporte de O₂ estiver adequado.{"\n\n"}
              
              <Text style={styles.boldText}>♻️ Reavaliação</Text>{"\n\n"}
              • Nova dosagem de Hb ou Ht de 1 a 2 horas após a transfusão.{"\n"}
              • Em pacientes ambulatoriais, a avaliação laboratorial pode ser feita 30min após o término da transfusão.
            </Text>
          </View>

          <View style={[styles.indicationBox, {backgroundColor: '#FFFBEB', borderLeftColor: '#F59E0B'}]}>
            <Text style={styles.boldText}>CONCENTRADO DE PLAQUETAS</Text>
            <Text style={styles.hemocomponentesText}>
              <Text style={styles.boldText}>🩸 Trombocitopenia e sangramentos ativo:</Text>{"\n"}
              • Plaquetas com contagem {'<'} 50.000/μL{"\n"}
              • Hemorragia no sistema nervoso central quando plaquetas {'<'} 100.000/μL{"\n\n"}
              
              <Text style={styles.boldText}>🔧 Profilaxia pré-procedimentos:</Text>{"\n"}
              • Intervenções neurocirúrgicas/oftalmológicas: limiar {'<'} 100.000/μL{"\n"}
              • Cirurgias de grande porte: limiar {'<'} 50.000/μL{"\n"}
              • Lavado broncoalveolar por broncoscopia: {'<'} 20.000-30.000/μL{"\n"}
              • Endoscopias terapêuticas: {'<'} 50.000/μL | Endoscopias diagnósticas de baixo risco: {'<'} 20.000/μL{"\n"}
              • Punção do líquor: {'<'} 10.000-20.000/μL (doenças onco-hematológicas) | {'<'} 40.000-50.000/μL (outras condições){"\n\n"}
              
              <Text style={styles.boldText}>🛡️ Profilaxia primária de sangramentos:</Text>{"\n"}
              • Pacientes estáveis sem febre: {'<'} 10.000/μL{"\n"}
              • Na presença de febre/infecção ativa: {'<'} 20.000/μL{"\n\n"}
              
              <Text style={styles.boldText}>❌ CONTRA INDICAÇÃO</Text>{"\n\n"}
              Na Púrpura Trombocitopênica Trombótica (PTT), na Síndrome Hemolítica-Urêmica e na Trombocitopenia Induzida por Heparina (TIH), a transfusão de concentrado de plaquetas (CP) só deve ser realizada em casos de sangramento grave e com risco de vida. O mesmo princípio se aplica às trombocitopenias de origem imune, caracterizadas pela presença de anticorpos antiplaquetários, como na Púrpura Trombocitopênica Imune (PTI), ou em plaquetopenias associadas a infecções, como dengue, riquetsiose e leptospirose.
            </Text>
          </View>

          <View style={[styles.indicationBox, {backgroundColor: '#F0F9FF', borderLeftColor: '#0EA5E9'}]}>
            <Text style={styles.boldText}>PLASMA FRESCO CONGELADO (PFC)</Text>
            <Text style={styles.hemocomponentesText}>
              Deficiência de múltiplos fatores da coagulação com risco de sangramento{"\n\n"}
              
              <Text style={styles.boldText}>🔹 Hepatopatia:</Text>{"\n\n"}
              Fatores reduzidos: I, II, VII, IX, X.{"\n"}
              Relação direta com dano hepático (↑ TP).{"\n"}
              Distúrbio complexo: inclui também plaquetas, fibrinólise e disfibrinogenemia.{"\n"}
              Uso não recomendado apenas por TP alongado sem sangramento.{"\n"}
              Hepatopatas raramente sangram sem fator desencadeante (cirurgia, biópsia, varizes).{"\n"}
              PFC pode ser usado se sangramento ativo, com resposta imprevisível.{"\n"}
              Complexo Protrombínico (CCP) corrige mais rápido, mas risco de trombose → pouco usado nesses pacientes.{"\n\n"}
              
              <Text style={styles.boldText}>Coagulação Intravascular Disseminada (CID)</Text>{"\n\n"}
              Todos os fatores da coagulação ↓ (especialmente Fibrinogênio, FVIII, FXIII).{"\n"}
              Quadro clínico vai de micro-hemorragia grave a apenas alterações laboratoriais.{"\n"}
              Conduta: tratar a causa base + reposição com PFC + plaquetas + crioprecipitado, se HÁ sangramento.{"\n"}
              ❌ Se sem sangramento, não usar PFC.{"\n\n"}
              
              <Text style={styles.boldText}>Sangramento severo ou reversão urgente de anticoagulação por Warfarina (antivitamina K)</Text>{"\n\n"}
              Evidenciado por ↑ TP/INR.{"\n"}
              PFC: 15–20 mL/kg (≈ eleva fatores em 20–30%).{"\n"}
              Associar com Vitamina K (VO ou EV) obrigatoriamente.{"\n"}
              Preferir CCP (Concentrado Protrombínico) quando disponível, mais eficaz e seguro para evitar infecção.{"\n\n"}
              
              <Text style={styles.boldText}>Transfusão maciça associada a coagulopatia</Text>{"\n\n"}
              Coagulopatia do trauma = perda de sangue + acidose + hipotermia + consumo + fibrinólise + diluição.{"\n"}
              Diluição crítica: após {'>'} 1,2 volemia para fatores e {'>'} 2 volemias para plaquetas.{"\n"}
              Não usar empiricamente fórmulas fixas de reposição → substituição automática não previne distúrbios.{"\n"}
              Monitorar com TP, TTPa, tromboelastografia (TEG) ou tromboelastometria (ROTEM).{"\n"}
              Sempre corrigir fatores associados: plaquetas, fibrinogênio, hipotermia, acidose.{"\n\n"}
              
              <Text style={styles.boldText}>Deficiência isolada de fator da coagulação sem concentrado disponível</Text>{"\n\n"}
              Clássicos: Fator V e Fator XI (hemofilia C).{"\n"}
              FXI → no Brasil, PFC é a opção, especialmente em sangramentos ou antes de procedimentos.{"\n"}
              Obs.: FXI concentrado existe fora do país, mas risco de trombose limita uso.{"\n\n"}
              
              <Text style={styles.boldText}>Púrpura Trombocitopênica Trombótica (PTT)</Text>{"\n\n"}
              Uso como líquido repositor em plasmaferese terapêutica.{"\n"}
              Fonte de ADAMTS13, enzima que degrada multímeros de von Willebrand.{"\n"}
              Reduziu mortalidade de ~90% para {'<'}30%.{"\n\n"}
              
              <Text style={styles.boldText}>⚠️ Doses</Text>{"\n"}
              10–20 mL/kg (≈ 200–250 mL por bolsa).{"\n"}
              Expectativa: ↑ 20–30% dos fatores.{"\n"}
              Infusão guiada por quadro clínico e exames (TP, TTPa, ROTEM/TEG).{"\n\n"}
              
              <Text style={styles.boldText}>💡 Dicas Práticas</Text>{"\n"}
              🔸 Hepatopatas: não usar profilaticamente antes de procedimento só por TP ↑.{"\n"}
              🔸 CID: só com sangramento ativo.{"\n"}
              🔸 Transfusão maciça: integral → tratar também ácido-base, temperatura e plaquetas.{"\n"}
              🔸 Warfarina: sempre associar Vitamina K.{"\n"}
              🔸 Quando disponível: CCP é melhor que PFC para reversão de anticoagulação oral.{"\n\n"}
              
              <Text style={styles.boldText}>❌ Uso Inadequado / Contraindicações</Text>{"\n"}
              Não utilizar PFC, PFC24 ou PIC:{"\n"}
              Como expansor volêmico em hipovolemia (mesmo com hipoalbuminemia).{"\n"}
              Em sangramento sem coagulopatia.{"\n"}
              Para corrigir exames laboratoriais anormais sem sangramento.{"\n"}
              Em perda proteica (ex.: síndrome nefrótica) ou imunodeficiências.{"\n"}
              Profilaxia de procedimentos invasivos sem sangramento (ex.: biópsia hepática).{"\n"}
              Justificativas sem evidência (ex.: "acelerar cicatrização", "recompor sangue total").{"\n\n"}
              
              <Text style={styles.boldText}>🚨 Riscos e Complicações</Text>{"\n"}
              Transmissão viral (embora reduzida em centros modernos).{"\n"}
              TRALI (lesão pulmonar aguda associada à transfusão).{"\n"}
              Reações alérgicas e anafilaxia.{"\n"}
              Hemólise por anticorpos no plasma.{"\n"}
              TACO (sobrecarga circulatória pela transfusão).
            </Text>
          </View>

          <View style={[styles.indicationBox, {backgroundColor: '#F8F4FF', borderLeftColor: '#8B5CF6'}]}>
            <Text style={styles.boldText}>CRIOPRECIPITADO</Text>
            <Text style={styles.hemocomponentesText}>
              <Text style={styles.boldText}>Deficiência de Fibrinogênio</Text>{"\n\n"}
              Hipofibrinogenemia congênita ou adquirida ({'<'}100 mg/dL).{"\n\n"}
              Causas adquiridas:{"\n"}
              Coagulação Intravascular Disseminada (CID).{"\n"}
              Transfusão maciça.{"\n"}
              Uso de trombolíticos.{"\n\n"}
              Apenas ~50% do fibrinogênio transfundido é recuperado no plasma, mas ainda é a principal fonte em emergências quando não houver concentrado de fibrinogênio industrial disponível.{"\n\n"}
              
              <Text style={styles.boldText}>Disfibrinogenemia</Text>{"\n\n"}
              Alteração qualitativa do fibrinogênio (hereditária ou adquirida).{"\n"}
              Indicado em quadros hemorrágicos.{"\n\n"}
              
              <Text style={styles.boldText}>Deficiência de Fator XIII</Text>{"\n\n"}
              Reposição em sangramentos relacionados a deficiência congênita ou adquirida, quando não disponível concentrado específico de FXIII.{"\n\n"}
              
              <Text style={styles.boldText}>Distúrbios hemorrágicos em urêmicos</Text>{"\n\n"}
              Pode ser usado para reduzir o tempo de sangramento (TS) em pacientes com uremia submetidos a procedimentos ou com sangramento ativo.{"\n\n"}
              No entanto, esta indicação tem sido substituída por outras terapias mais eficazes: eritropoetina, desmopressina (DDAVP), estrógenos conjugados.{"\n\n"}
              
              <Text style={styles.boldText}>Uso em Doença de von Willebrand (vWF)</Text>{"\n\n"}
              Indicado apenas se:{"\n"}
              ✅ paciente não responde ou não pode usar DDAVP, e{"\n"}
              ✅ não houver concentrados específicos de vWF ou de Fator VIII ricos em multímeros de vWF disponíveis.{"\n\n"}
              
              <Text style={styles.boldText}>Uso tópico (cola de fibrina)</Text>{"\n\n"}
              Antigamente utilizava-se CRIO com cálcio + trombina bovina.{"\n"}
              Atualmente substituído por preparações comerciais seguras, com inativação viral e uso de trombina humana.{"\n"}
              Motivo: trombina bovina associada a complicações (anticorpos contra Fator V, sangramentos, falha no monitoramento de anticoagulação).{"\n\n"}
              
              <Text style={styles.boldText}>❌ Contraindicações / Uso não indicado</Text>{"\n"}
              Hemofilia A: deve-se usar Fator VIII recombinante ou derivados industrializados pós-inativação viral (mais eficazes e seguros).{"\n\n"}
              Doença de von Willebrand: exceto nas situações limitadas já descritas (paciente refratário a DDAVP + ausência de concentrados específicos).{"\n\n"}
              Deficiências de outros fatores de coagulação que não sejam:{"\n"}
              Fibrinogênio (I){"\n"}
              Fator XIII{"\n"}
              (eventualmente vWF, nas condições específicas citadas).{"\n\n"}
              Expansão volêmica, reposição inespecífica ou uso profilático sem coagulopatia comprovada.{"\n\n"}
              ❌ Substituído sempre que houver disponível: concentrado purificado de fibrinogênio, Fator XIII ou vWF/FVIII.{"\n\n"}
              
              <Text style={styles.boldText}>⚠️ Observações Importantes</Text>{"\n"}
              Cada bolsa contém em média ~200 mg de fibrinogênio.{"\n"}
              Apenas metade da dose infundida (≈ 50%) atinge efetivamente a circulação.{"\n"}
              A resposta clínica deve ser acompanhada por exames laboratoriais (nível plasmático de fibrinogênio, FXIII, tempo de sangramento, conforme a indicação).
            </Text>
          </View>

          {/* Card de Aviso/Disclaimer */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerText}>
              ⚠️ Esta ferramenta oferece orientações baseadas em diretrizes gerais de hemoterapia. 
              Sempre consulte as diretrizes institucionais e avalie individualmente cada caso.
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
    backgroundColor: '#FFF8E1',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#FF8F00',
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  introTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#FF8F00',
    marginLeft: theme.spacing.sm,
  },
  introText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  hemocomponentesText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
    backgroundColor: '#F0F9FF',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#0EA5E9',
  },
  // Texto em negrito
  boldText: {
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  // Títulos dos procedimentos especiais
  procedureTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  // Caixa de indicação
  indicationBox: {
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
});
