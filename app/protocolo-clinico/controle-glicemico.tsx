import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';

export default function ControleGlicemicoScreen() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const router = useRouter();

  const toggleCard = (cardIndex: number) => {
    setExpandedCard(expandedCard === cardIndex ? null : cardIndex);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Controle glicêmico" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Card 1: Monitorização */}
          <View style={styles.evaluationCard}>
            <TouchableOpacity onPress={() => toggleCard(1)}>
              <Text style={styles.evaluationTitle}>📊 MONITORIZAÇÃO DA GLICEMIA EM AMBIENTE HOSPITALAR</Text>
            </TouchableOpacity>
            {expandedCard === 1 && (
              <Text style={styles.evaluationText}>
                <Text style={styles.boldText}>🔍 PROTOCOLO DE MONITORIZAÇÃO:</Text>{"\n\n"}
                
                <Text style={styles.flowchartBox}>📋 História de diabetes mellitus?</Text>{"\n\n"}
                
                <Text style={styles.boldText}>✅ SE SIM (Paciente com história de diabetes):</Text>{"\n"}
                • Solicitar HbA1c{"\n"}
                • Monitorar glicemia capilar antes do café da manhã, almoço, jantar e ao deitar (se dieta oral){"\n"}
                  OU{"\n"}
                • A cada 6 horas, se em jejum ou outras dietas{"\n\n"}
                
                <Text style={styles.boldText}>❌ SE NÃO (Paciente sem história de diabetes):</Text>{"\n"}
                Verificar: <Text style={styles.flowchartBox}>🩸 Glicemia capilar > 180 mg/dL?</Text>{"\n\n"}
                
                <Text style={styles.boldText}>• Se glicemia > 180 mg/dL:</Text>{"\n"}
                  → Seguir monitorização como paciente diabético{"\n\n"}
                
                <Text style={styles.boldText}>• Se glicemia ≤ 180 mg/dL, avaliar:</Text>{"\n\n"}
                  
                  <Text style={styles.flowchartBox}>💊 Glicocorticoide?</Text>{"\n"}
                  <Text style={styles.boldText}>SE SIM:</Text>{"\n"}
                  → Glicemia capilar antes do café da manhã e antes do jantar (final da tarde){"\n\n"}
                  
                  <Text style={styles.flowchartBox}>🍽️ Dieta enteral ou parenteral?</Text>{"\n"}
                  <Text style={styles.boldText}>SE SIM:</Text>{"\n"}
                  → Glicemia capilar a cada 4-6 horas{"\n\n"}
                  
                  <Text style={styles.boldText}>SE NÃO (não usa glicocorticoide nem dieta enteral/parenteral):</Text>{"\n"}
                  → Sem necessidade de seguimento glicêmico adicional
              </Text>
            )}
          </View>

          {/* Card 2: Escolha do Tratamento */}
          <View style={styles.targetsCard}>
            <TouchableOpacity onPress={() => toggleCard(2)}>
              <Text style={styles.targetsTitle}>🎯 ESCOLHA DO TRATAMENTO DE HIPERGLICEMIA HOSPITALAR</Text>
            </TouchableOpacity>
            {expandedCard === 2 && (
              <View>
                {/* Níveis de Hiperglicemia */}
                <Text style={styles.boldText}>📊 NÍVEIS DE HIPERGLICEMIA:</Text>
                
                <View style={[styles.levelBox, {backgroundColor: '#FFF3CD', borderColor: '#F59E0B'}]}>
                  <Text style={styles.boldText}>HIPERGLICEMIA NÍVEL 1 LEVE</Text>
                  <Text style={styles.targetsText}>• &gt; 180 a &lt; 200 mg/dL E</Text>
                  <Text style={styles.targetsText}>• Sem uso de insulina ou uso domiciliar</Text>
                  <Text style={styles.targetsText}>• &lt; 0,4 UI/Kg/dia.</Text>
                </View>
                
                <View style={[styles.levelBox, {backgroundColor: '#FFE4E1', borderColor: '#EA580C'}]}>
                  <Text style={styles.boldText}>HIPERGLICEMIA NÍVEL 1 MODERADA</Text>
                  <Text style={styles.targetsText}>• &gt; 200 a &lt; 250 mg/dL E/OU</Text>
                  <Text style={styles.targetsText}>• Dose domiciliar 0,4 a 0,6 UI/Kg/dia</Text>
                  <Text style={styles.targetsText}>  de insulina.</Text>
                </View>
                
                <View style={[styles.levelBox, {backgroundColor: '#FFE4E1', borderColor: '#DC2626'}]}>
                  <Text style={styles.boldText}>HIPERGLICEMIA NÍVEL 2</Text>
                  <Text style={styles.targetsText}>• &gt; 250 mg/dL E/OU</Text>
                  <Text style={styles.targetsText}>• Dose domiciliar &gt; 0,6 UI/Kg/dia de</Text>
                  <Text style={styles.targetsText}>  insulina, DM1, LADA,</Text>
                  <Text style={styles.targetsText}>  pancreatectomia.</Text>
                </View>
                
                <View style={[styles.levelBox, {backgroundColor: '#FFF7ED', borderColor: '#16A34A'}]}>
                  <Text style={styles.boldText}>Uso de glicocorticoide</Text>
                  <Text style={styles.targetsText}>• Com aumento isolado da glicemia no</Text>
                  <Text style={styles.targetsText}>  período vespertino</Text>
                </View>
                
                {/* Tratamentos por Nível */}
                <Text style={[styles.boldText, {marginTop: 16}]}>💊 TRATAMENTO CONFORME NÍVEL:</Text>
                
                {/* Nível 1 Leve */}
                <Text style={[styles.boldText, {marginTop: 12}]}>▶️ HIPERGLICEMIA NÍVEL 1 LEVE:</Text>
                <Text style={styles.targetsText}>• Inibidor de DPP4</Text>
                <Text style={styles.targetsText}>+/-</Text>
                <Text style={styles.targetsText}>• Insulina basal 0,1 a 0,15 UI/Kg</Text>
                
                {/* Nível 1 Moderada */}
                <Text style={[styles.boldText, {marginTop: 12}]}>▶️ HIPERGLICEMIA NÍVEL 1 MODERADA:</Text>
                <Text style={styles.targetsText}>• Insulina basal 0,15 a 0,3 UI/Kg +</Text>
                <Text style={styles.targetsText}>+</Text>
                <Text style={styles.targetsText}>• Inibidor de DPP4 (opcional)</Text>
                <Text style={styles.targetsText}>OU</Text>
                <Text style={styles.targetsText}>• Manter/reduzir dose de insulina</Text>
                <Text style={styles.targetsText}>  domiciliar em 20% (se bem</Text>
                <Text style={styles.targetsText}>  controlado)</Text>
                
                {/* Nível 2 */}
                <Text style={[styles.boldText, {marginTop: 12}]}>▶️ HIPERGLICEMIA NÍVEL 2:</Text>
                <Text style={styles.targetsText}>• Basal-bolus 0,3 a 0,6 UI/Kg (50%</Text>
                <Text style={styles.targetsText}>  basal - 50% bolus)</Text>
                <Text style={styles.targetsText}>OU</Text>
                <Text style={styles.targetsText}>• Manter/reduzir dose de insulina</Text>
                <Text style={styles.targetsText}>  domiciliar em 20% (se bem</Text>
                <Text style={styles.targetsText}>  controlado)</Text>
                
                {/* Uso de Glicocorticoide */}
                <Text style={[styles.boldText, {marginTop: 12}]}>▶️ USO DE GLICOCORTICOIDE:</Text>
                <Text style={styles.targetsText}>• Insulina NPH 0,1 a 0,4 UI/Kg pela</Text>
                <Text style={styles.targetsText}>  manhã isolada ou associada aos</Text>
                <Text style={styles.targetsText}>  esquemas ao lado</Text>
                
                {/* Titular Doses */}
                <View style={[styles.treatmentBadge, {backgroundColor: '#DBEAFE', borderLeftColor: '#2563EB', marginTop: 16}]}>
                  <Text style={styles.boldText}>TITULAR DOSES</Text>
                  <Text style={styles.targetsText}>0,05 - 0,1 UI/Kg/dia</Text>
                  <Text style={styles.targetsText}>ou</Text>
                  <Text style={styles.targetsText}>Mudar para Basal-Bolus</Text>
                </View>
                
                {/* Insulinas */}
                <Text style={[styles.boldText, {marginTop: 16}]}>💉 TIPOS DE INSULINA:</Text>
                
                <View style={[styles.insulinBox, {backgroundColor: '#FFF0F5'}]}>
                  <Text style={styles.boldText}>INSULINA BASAL</Text>
                  <Text style={styles.targetsText}>• NPH (2 a 3 vezes ao dia)</Text>
                  <Text style={styles.targetsText}>• Glargina U100, Glargina U300 ou Degludeca</Text>
                  <Text style={styles.targetsText}>  (1x/dia)</Text>
                </View>
                
                <View style={[styles.insulinBox, {backgroundColor: '#F0F9FF'}]}>
                  <Text style={styles.boldText}>INSULINA BOLUS</Text>
                  <Text style={styles.targetsText}>Aspart, Fast Aspart, Lispro, Glulisina, Regular</Text>
                  <Text style={styles.targetsText}>• Em dieta oral: 3 vezes ao dia</Text>
                  <Text style={styles.targetsText}>• Dietas enteral/parenteral, infusão contínua</Text>
                  <Text style={styles.targetsText}>  ou intermitente: 6/6 h ou a cada infusão</Text>
                </View>
              </View>
            )}
          </View>

          {/* Card 3: Dose de Correção */}
          <View style={styles.insulinCard}>
            <TouchableOpacity onPress={() => toggleCard(3)}>
            <Text style={styles.insulinTitle}>📐 DOSE DE CORREÇÃO DE GLICEMIA DE ACORDO COM A SENSIBILIDADE À INSULINA</Text>
            </TouchableOpacity>
            {expandedCard === 3 && (
              <View>
                <View style={[styles.sectionHeader, {backgroundColor: '#FF6B35'}]}>
                  <Text style={[styles.sectionTitle, {color: '#FFFFFF'}]}>Dose de correção de glicemia</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.tableContainer}>
                    <View style={[styles.tableRow, {backgroundColor: '#FFE4E1'}]}>
                      <Text style={styles.tableCellTitle}>Glicemia capilar</Text>
                      <Text style={styles.tableCellTitle}>Paciente sensível¹</Text>
                      <Text style={styles.tableCellTitle}>Paciente usual²</Text>
                      <Text style={styles.tableCellTitle}>Paciente resistente³</Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>181-230 mg/dL</Text>
                      <Text style={styles.tableCell}>Aumentar 1 UI</Text>
                      <Text style={styles.tableCell}>Aumentar 2 UI</Text>
                      <Text style={styles.tableCell}>Aumentar 4 UI</Text>
                    </View>
                    <View style={[styles.tableRow, {backgroundColor: '#FFF7ED'}]}>
                      <Text style={styles.tableCell}>231-280 mg/dL</Text>
                      <Text style={styles.tableCell}>Aumentar 2 UI</Text>
                      <Text style={styles.tableCell}>Aumentar 3 UI</Text>
                      <Text style={styles.tableCell}>Aumentar 6 UI</Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>281-330 mg/dL</Text>
                      <Text style={styles.tableCell}>Aumentar 3 UI</Text>
                      <Text style={styles.tableCell}>Aumentar 4 UI</Text>
                      <Text style={styles.tableCell}>Aumentar 8 UI</Text>
                    </View>
                    <View style={[styles.tableRow, {backgroundColor: '#FFF7ED'}]}>
                      <Text style={styles.tableCell}>331-390 mg/dL</Text>
                      <Text style={styles.tableCell}>Aumentar 4 UI</Text>
                      <Text style={styles.tableCell}>Aumentar 5 UI</Text>
                      <Text style={styles.tableCell}>Aumentar 10 UI</Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>&gt;390 mg/dL</Text>
                      <Text style={styles.tableCell}>Aumentar 6 UI</Text>
                      <Text style={styles.tableCell}>Aumentar 8 UI</Text>
                      <Text style={styles.tableCell}>Aumentar 12 UI</Text>
                    </View>
                  </View>
                </ScrollView>
                
                {/* Indicador de scroll */}
                <View style={styles.scrollIndicator}>
                  <Text style={styles.scrollIndicatorText}>↔ Deslize para ver mais</Text>
                </View>
                
                {/* Legendas da tabela */}
                <View style={styles.tableFootnote}>
                  <Text style={styles.footnoteTitle}>Legenda:</Text>
                  <Text style={styles.footnoteText}>
                    <Text style={styles.boldText}>¹ Paciente sensível:</Text> Idosos, índice de massa corporal (IMC) {"<"} 19 kg/m², frágeis e/ou com insuficiência renal, hepática ou cardíaca.
                  </Text>
                  <Text style={styles.footnoteText}>
                    <Text style={styles.boldText}>² Paciente usual:</Text> IMC de 19 a 33 kg/m², sem sinais de resistência insulínica ou uso de glicocorticoide.
                  </Text>
                  <Text style={styles.footnoteText}>
                    <Text style={styles.boldText}>³ Paciente resistente:</Text> Pacientes com IMC acima de 33 kg/m², com sinais de resistência insulínica, em uso de glicocorticoide ou glicemias persistentemente aumentadas.
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Card 4: Cálculo Basal-Bolus */}
          <View style={styles.hypoglycemiaCard}>
            <TouchableOpacity onPress={() => toggleCard(4)}>
              <Text style={styles.hypoglycemiaTitle}>💉 CÁLCULO DA DOSE DE INSULINA EM ESQUEMA BASAL-BOLUS</Text>
            </TouchableOpacity>
            {expandedCard === 4 && (
              <View>
                {/* Insulina basal */}
                <View style={[styles.sectionHeader, {backgroundColor: '#FF6B35'}]}>
                  <Text style={[styles.sectionTitle, {color: '#FFFFFF'}]}>Insulina basal</Text>
                </View>
                
                <Text style={styles.hypoglycemiaText}>
                  • Estabelecer a Dose Total Diária (DTD) de insulina (0,2-0,6 UI/kg.dia){"\n"}
                  • Dose basal = 50% da DTD ou 0,1-0,3 UI/kg.dia
                </Text>
                
                <View style={[styles.subsectionHeader, {backgroundColor: '#FFB399'}]}>
                  <Text style={styles.subsectionTitle}>Tipos de insulinas de ação basal</Text>
                </View>
                
                <Text style={[styles.boldText, {marginTop: 8}]}>NPH</Text>
                <Text style={styles.hypoglycemiaText}>
                  • 2 a 3 doses por dia{"\n"}
                  • Em DM1, LADA ou pancreatectomizados, dar preferência para 3 vezes ao dia
                </Text>
                
                <Text style={[styles.boldText, {marginTop: 8}]}>Glargina U100</Text>
                <Text style={styles.hypoglycemiaText}>• 1 ou 2 doses por dia</Text>
                
                <Text style={[styles.boldText, {marginTop: 8}]}>Degludeca e Glargina U300</Text>
                <Text style={styles.hypoglycemiaText}>
                  • 1 dose ao dia{"\n"}
                  • Podem ser utilizadas, com atenção para a meia-vida mais longa e demora de três a{"\n"}
                  quatro dias para alcançar o estado de equilíbrio, o que pode dificultar o manejo em{"\n"}
                  internações ou acompanhamentos por períodos curtos, que são a maioria dos{"\n"}
                  casos.
                </Text>
                
                {/* Insulina em bolus */}
                <View style={[styles.sectionHeader, {backgroundColor: '#FF6B35', marginTop: 16}]}>
                  <Text style={[styles.sectionTitle, {color: '#FFFFFF'}]}>Insulina em bolus</Text>
                </View>
                
                <Text style={styles.hypoglycemiaText}>
                  • Se em dieta oral ou enteral intermitente: Reduzir em 50% a DTD:{"\n"}
                    1/3 da dose do bolus por refeição (50% da DTD/3) (antes do café, almoço e jantar){"\n"}
                  • Se em dieta enteral/parenteral contínua: 1/4 da dose bolus a cada 6 horas{"\n"}
                  • Se em jejum: não usar.
                </Text>
                
                <View style={[styles.subsectionHeader, {backgroundColor: '#FFB399'}]}>
                  <Text style={styles.subsectionTitle}>Tipos de insulinas para bolus</Text>
                </View>
                
                <Text style={[styles.boldText, {marginTop: 8}]}>Análogos de ação rápida</Text>
                <Text style={styles.hypoglycemiaText}>
                  • Lispro, Glulisina, Aspart, Fast-Aspart{"\n"}
                  • Devem ser aplicadas até 15 minutos antes da refeição
                </Text>
                
                <Text style={[styles.boldText, {marginTop: 8}]}>Insulinas humanas de ação rápida</Text>
                <Text style={styles.hypoglycemiaText}>
                  • Regular{"\n"}
                  • Devem ser aplicadas 30 minutos antes da refeição
                </Text>
              </View>
            )}
          </View>

          {/* Card 5: Protocolo Hipoglicemia */}
          <View style={styles.complicationsCard}>
            <TouchableOpacity onPress={() => toggleCard(5)}>
              <Text style={styles.complicationsTitle}>⚠️ PROTOCOLO HIPOGLICEMIA</Text>
            </TouchableOpacity>
            {expandedCard === 5 && (
              <View>
                {/* Definição e Causas */}
                <View style={[styles.sectionHeader, {backgroundColor: '#FFC107'}]}>
                  <Text style={[styles.sectionTitle, {color: '#000'}]}>HIPOGLICEMIA</Text>
                </View>
                
                <View style={[styles.treatmentBadge, {backgroundColor: '#FFF3CD', borderLeftColor: '#FFC107', marginBottom: 12}]}>
                  <Text style={styles.boldText}>Valor de glicemia {"<"} 70 mg/dL</Text>
                </View>
                
                <Text style={[styles.boldText, {marginBottom: 8}]}>Fatores precipitantes:</Text>
                <Text style={styles.complicationsText}>
                  • Desequilíbrio entre dose de insulina e a ingestão alimentar{"\n"}
                  • Atividade física (pode ocorrer durante, logo após ou até 12 horas depois){"\n"}
                  • Fator precipitante{"\n\n"}
                </Text>
                
                <Text style={[styles.boldText, {marginBottom: 8}]}>Causas por dose excessiva de insulina:</Text>
                <Text style={styles.complicationsText}>
                  • Omissão ou diminuição da ingestão alimentar{"\n"}
                  • Atividade física extra-habitual{"\n"}
                  • Ingestão de álcool (supressão da gliconeogênese, aumento da sensibilidade insulínica){"\n"}
                  • Doença renal (diminuição da absorção intestinal de nutrientes){"\n"}
                  • Hipocortisolismo (diminuição da glicogenólise){"\n"}
                  • Insuficiência renal crônica (diminuição da excreção de insulina){"\n\n"}
                </Text>
                
                {/* Sintomas */}
                <View style={[styles.sectionHeader, {backgroundColor: '#FF6B35', marginTop: 16}]}>
                  <Text style={[styles.sectionTitle, {color: '#FFFFFF'}]}>SINTOMAS DA HIPOGLICEMIA</Text>
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.tableContainer}>
                    <View style={[styles.tableRow, {backgroundColor: '#FF6B35'}]}>
                      <Text style={[styles.tableCellTitle, {color: '#FFF', minWidth: 180}]}>SINTOMAS AUTONÔMICOS</Text>
                      <Text style={[styles.tableCellTitle, {color: '#FFF', minWidth: 180}]}>SINTOMAS NEUROGLICOPÊNICOS</Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Tremores</Text>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Dificuldade de concentração</Text>
                    </View>
                    <View style={[styles.tableRow, {backgroundColor: '#FFF7ED'}]}>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Taquicardia, palpitação</Text>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Visão borrada ou dupla</Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Sudorese fria</Text>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Confusão Mental</Text>
                    </View>
                    <View style={[styles.tableRow, {backgroundColor: '#FFF7ED'}]}>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Palidez</Text>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Perda de consciência ou convulsão</Text>
                    </View>
                  </View>
                </ScrollView>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: 8}}>
                  <View style={styles.tableContainer}>
                    <View style={[styles.tableRow, {backgroundColor: '#FF6B35'}]}>
                      <Text style={[styles.tableCellTitle, {color: '#FFF', minWidth: 180}]}>SINTOMAS COMPORTAMENTAIS</Text>
                      <Text style={[styles.tableCellTitle, {color: '#FFF', minWidth: 180}]}>OUTROS SINTOMAS</Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Irritabilidade</Text>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Fome</Text>
                    </View>
                    <View style={[styles.tableRow, {backgroundColor: '#FFF7ED'}]}>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Pesadelo</Text>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Cefaleia</Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Choro inconsolável</Text>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Náusea</Text>
                    </View>
                    <View style={[styles.tableRow, {backgroundColor: '#FFF7ED'}]}>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Comportamento inadequado</Text>
                      <Text style={[styles.tableCell, {minWidth: 180}]}>Cansaço</Text>
                    </View>
                  </View>
                </ScrollView>
                
                {/* Indicador de scroll */}
                <View style={styles.scrollIndicator}>
                  <Text style={styles.scrollIndicatorText}>↔ Deslize para ver mais</Text>
                </View>
                
                {/* Classificação por Níveis */}
                <Text style={[styles.boldText, {marginTop: 16, marginBottom: 8}]}>📊 NÍVEIS DE HIPOGLICEMIA:</Text>
                
                <View style={styles.levelBox}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.boldText}>Alerta de hipoglicemia (nível 1)</Text>
                    <Text style={styles.boldText}>≤ 70 mg/dL</Text>
                  </View>
                  <Text style={styles.complicationsText}>Glicemia baixa o suficiente para ser tratada com ingestão de carboidratos e ajustes na terapia</Text>
                </View>
                
                <View style={[styles.levelBox, {backgroundColor: '#FFF3CD', borderColor: '#F59E0B'}]}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.boldText}>Hipoglicemia significativa (nível 2)</Text>
                    <Text style={styles.boldText}>{"<"} 54 mg/dL</Text>
                  </View>
                  <Text style={styles.complicationsText}>Glicemia suficientemente baixa e indicativa de hipoglicemia clinicamente importante</Text>
                </View>
                
                <View style={[styles.levelBox, {backgroundColor: '#FFE4E1', borderColor: '#DC2626'}]}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.boldText}>Hipoglicemia grave (nível 3)</Text>
                    <Text style={styles.boldText}>Sem valor glicêmico definido</Text>
                  </View>
                  <Text style={styles.complicationsText}>Hipoglicemia associada a déficit cognitivo requerendo ajuda de outras pessoas para o tratamento</Text>
                </View>
                
                {/* Tratamento */}
                <View style={[styles.sectionHeader, {backgroundColor: '#16A34A', marginTop: 16}]}>
                  <Text style={[styles.sectionTitle, {color: '#FFFFFF'}]}>TRATAMENTO HIPOGLICEMIA</Text>
                </View>
                
                {/* Paciente consciente */}
                <View style={[styles.treatmentBadge, {backgroundColor: '#D4EDDA', borderLeftColor: '#16A34A', marginBottom: 12}]}>
                  <Text style={styles.boldText}>Paciente consciente e capaz de ingestão oral</Text>
                </View>
                
                <Text style={styles.complicationsText}>
                  Ingerir 15 g de carboidratos simples e rapidamente absorvíveis{"\n"}
                  (p. ex., 1 colher de sopa de açúcar de mesa, 3 balas de mel, 1 copo de suco ou refrigerante comum){"\n\n"}
                  
                  💊 Essa quantidade é capaz de elevar a glicemia entre 45-65 mg/dL{"\n\n"}
                  
                  ⏱️ Após esse procedimento, aguardar <Text style={styles.boldText}>15 minutos</Text> e repetir a dosagem da glicemia capilar.{"\n\n"}
                  
                  ✅ Se o paciente ainda estiver hipoglicêmico, repetir o tratamento até que a glicemia capilar volte ao normal.{"\n\n"}
                  
                  🏥 Em <Text style={styles.boldText}>pacientes hospitalizados</Text>, pode-se prescrever:{"\n"}
                  <Text style={styles.boldText}>30 mL de SG 50%</Text>, VO, que equivale a 15 g de glicose{"\n\n"}
                  
                  Em lactentes, oferecer 7,5 g de carboidrato{"\n"}
                  ❗ Não oferecer mel a crianças {"<"} 1 ano de idade, pelo risco de desenvolvimento de botulismo pela imaturidade em eliminar o Clostridium botulinum
                </Text>
                
                {/* Paciente inconsciente */}
                <View style={[styles.treatmentBadge, {backgroundColor: '#F8D7DA', borderLeftColor: '#DC2626', marginTop: 12, marginBottom: 12}]}>
                  <Text style={styles.boldText}>Paciente inconsciente e incapaz de ingestão oral</Text>
                </View>
                
                <Text style={[styles.boldText, {marginBottom: 8}]}>🚫 No domicílio</Text>
                <Text style={styles.complicationsText}>
                  Se o paciente estiver convulsionando, orientar aos pais/responsáveis para deitar-lo de lado, limpar e proteger a via aérea, proteger de traumas e solicitar assistência médica{"\n\n"}
                  
                  O uso de açúcar em pó (esfregado na bochecha) pode ser feito se não houver glucagon, ou na impossibilidade de reposição venosa de glicose.{"\n\n"}
                  
                  Usar uma pequena quantidade, com cuidado, para evitar aspiração.{"\n\n"}
                  
                  Em hipótese alguma oferecer líquidos adocicados por via oral{"\n\n"}
                </Text>
                
                <Text style={styles.complicationsText}>
                  ✅ Administrar glucagon, IM ou SC: <Text style={styles.boldText}>0,5 mg ({"<"} 12 anos) e 1 mg ({">"} 12 anos)</Text>{"\n\n"}
                </Text>
                
                <Text style={[styles.boldText, {marginBottom: 8}]}>🏥 No hospital</Text>
                <Text style={styles.complicationsText}>
                  Administrar glicose, EV, na dose de <Text style={styles.boldText}>0,2-0,5 g/kg/dose</Text>.{"\n\n"}
                  
                  Por exemplo: SG 10% (2-5 mL/kg), SG 25% (1-2 mL/kg).{"\n\n"}
                  
                  ⚠️ Não usar SG 50%, pelo risco de flebite{"\n\n"}
                  
                  Se a hipoglicemia persistir, manter solução glicosada, EV, 2-5 mg/kg/minuto{"\n\n"}
                </Text>
                
                <View style={[styles.treatmentBadge, {backgroundColor: '#E7F3FF', borderLeftColor: '#2563EB'}]}>
                  <Text style={styles.complicationsText}>
                    SG 10% → contém <Text style={styles.boldText}>10 g de glicose por 100 mL</Text>, ou seja, <Text style={styles.boldText}>0,1 g/mL</Text>{"\n\n"}
                    SG 25% → contém <Text style={styles.boldText}>25 g de glicose por 100 mL</Text>, ou seja, <Text style={styles.boldText}>0,25 g/mL</Text>
                  </Text>
                </View>
                
                {/* Link para Calculadora */}
                <View style={[styles.calculatorLinkCard, {marginTop: 16}]}>
                  <Text style={styles.calculatorLinkTitle}>🧮 CALCULADORAS DE CORREÇÃO</Text>
                  <Text style={styles.calculatorLinkText}>
                    Para calcular a dose de glicose e preparar soluções glicosadas, acesse:
                  </Text>
                  <TouchableOpacity
                    style={styles.calculatorButton}
                    onPress={() => router.push('/calculadoras/hipoglicemia')}
                  >
                    <Text style={styles.calculatorButtonText}>Acessar Calculadora de Hipoglicemia</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  // Card de avaliação (azul)
  evaluationCard: {
    backgroundColor: '#EFF6FF',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  evaluationTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#2563EB',
    marginBottom: theme.spacing.sm,
  },
  evaluationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de metas (verde)
  targetsCard: {
    backgroundColor: '#F0FDF4',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#16A34A',
  },
  targetsTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#16A34A',
    marginBottom: theme.spacing.sm,
  },
  targetsText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de insulina (laranja)
  insulinCard: {
    backgroundColor: '#FFF7ED',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#EA580C',
  },
  insulinTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#EA580C',
    marginBottom: theme.spacing.sm,
  },
  insulinText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de hipoglicemia (roxo)
  hypoglycemiaCard: {
    backgroundColor: '#FAF5FF',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#9333EA',
  },
  hypoglycemiaTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#9333EA',
    marginBottom: theme.spacing.sm,
  },
  hypoglycemiaText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de complicações (vermelho)
  complicationsCard: {
    backgroundColor: '#FFF5F5',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  complicationsTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#DC2626',
    marginBottom: theme.spacing.sm,
  },
  complicationsText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Texto em negrito
  boldText: {
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  // Badge de tratamento
  treatmentBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#16A34A',
    marginVertical: theme.spacing.xs,
  },
  // Texto de emergência
  emergencyText: {
    fontFamily: 'Roboto-Bold',
    color: '#DC2626',
    fontSize: theme.fontSize.sm,
  },
  // Caixa de fluxograma
  flowchartBox: {
    fontFamily: 'Roboto-Bold',
    color: '#2563EB',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F59E0B',
    textAlign: 'center',
  },
  // Caixa de nível
  levelBox: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    marginVertical: theme.spacing.xs,
  },
  // Caixa de insulina
  insulinBox: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: theme.spacing.xs,
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
  },
// Cabeçalho de subseção
  subsectionHeader: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginVertical: theme.spacing.xs,
  },
  subsectionTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
  },
  // Tabela correção
  tableContainer: {
    minWidth: 320,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableCell: {
    flex: 1,
    minWidth: 65,
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: theme.fontSize.xs,
    color: theme.colors.text,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  tableCellTitle: {
    flex: 1,
    minWidth: 65,
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: theme.fontSize.xs,
    color: '#EA580C',
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  // Footnote styles
  tableFootnote: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: '#FFF5E5',
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#FDB462',
  },
  footnoteTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  footnoteText: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
    marginBottom: theme.spacing.xs,
  },
  // Scroll indicator
  scrollIndicator: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    marginTop: -theme.spacing.xs,
  },
  scrollIndicatorText: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 20,
  },
  // Calculator Link Card
  calculatorLinkCard: {
    backgroundColor: '#E0E7FF',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  calculatorLinkTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#6366F1',
    marginBottom: theme.spacing.sm,
  },
  calculatorLinkText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  calculatorButton: {
    backgroundColor: '#6366F1',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  calculatorButtonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
  // Removed unused styles:
  // calculatorContainer, input, inputLabel, resultContainer, resultBox, resultText,
  // buttonGroup, optionButton, optionButtonActive, optionButtonText, optionButtonTextActive,
  // mixtureBox, mixtureRow, mixtureItem, mixtureLabel, mixtureValue, mixturePlus, infoBox, infoText
});
