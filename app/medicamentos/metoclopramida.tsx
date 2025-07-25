import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

export default function MetoclopramidaScreen() {
  const [expanded, setExpanded] = useState([
    false, false, false, false, false, false, false
  ]);
  const toggle = (idx: number) => {
    setExpanded(prev => prev.map((v, i) => i === idx ? !v : v));
  };
  return (
    <View style={styles.container}>
      <ScreenHeader title="Metoclopramida (Plasil)" />
      <ScrollView style={styles.content}>
        {/* 1. INDICAÇÕES PRINCIPAIS */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.sectionCard, styles.cardIndicacoes]}
          onPress={() => toggle(0)}
        >
          <Text style={[styles.sectionTitle, styles.titleIndicacoes]}>1. INDICAÇÕES PRINCIPAIS:</Text>
          {expanded[0] && (
            <>
              <Text style={styles.paragraph}>
                • Antiemético: Náuseas e vômitos de diversas origens (pós-cirúrgicos, metabólicos, infecciosos, quimioterapia). Atua na área postrema, uma região do tronco encefálico desprovida de barreira hematoencefálica íntegra.
              </Text>
              <Text style={styles.paragraph}>
                • Procinético: Distúrbios de motilidade gastrointestinal, incluindo:
              </Text>
              <Text style={styles.subParagraph}>
                ◦ Doença do Refluxo Gastroesofágico (aumenta tônus do esfíncter esofagiano inferior).
              </Text>
              <Text style={styles.subParagraph}>
                ◦ Gastroparesia (diabética e não diabética).
              </Text>
              <Text style={styles.subParagraph}>
                ◦ Auxílio em procedimentos radiológicos do TGI.
              </Text>
              <Text style={styles.subParagraph}>
                ◦ Prevenção de aspiração em anestesias gerais (uso off-label).
              </Text>
              <Text style={styles.subParagraph}>
                ◦ Crise de soluço (quando relacionada a plenitude gástrica).
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* 2. MECANISMO DE AÇÃO */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.sectionCard, styles.cardMecanismo]}
          onPress={() => toggle(1)}
        >
          <Text style={[styles.sectionTitle, styles.titleMecanismo]}>2. MECANISMO DE AÇÃO:</Text>
          {expanded[1] && (
            <>
              <Text style={styles.paragraph}>
                • Bloqueio de Receptores D2 de Dopamina: Principal ação central (antiemética na área postrema) e periférica (procinética no TGI).
              </Text>
              <Text style={styles.subParagraph}>
                ◦ No TGI: Bloqueia D2 periféricos, aumentando a liberação de acetilcolina (ACh), que se liga a receptores muscarínicos para promover contração muscular lisa e peristaltismo.
              </Text>
              <Text style={styles.paragraph}>
                • Estímulo de Receptores 5HT4: Contribui para o aumento do peristaltismo.
              </Text>
              <Text style={styles.paragraph}>
                • Em altas doses, pode ter leve ação em receptores 5HT3.
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* 3. DOSES E DURAÇÃO DE TRATAMENTO */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.sectionCard, styles.cardDoses]}
          onPress={() => toggle(2)}
        >
          <Text style={[styles.sectionTitle, styles.titleDoses]}>3. DOSES E DURAÇÃO DE TRATAMENTO:</Text>
          {expanded[2] && (
            <>
              <Text style={[styles.paragraph, { color: '#388E3C', fontWeight: 'bold' }]}> 
                • NÃO É RECOMENDADO O USO POR MAIS DE 12 SEMANAS.
              </Text>
              <Text style={styles.subParagraph}>
                ◦ RISCO DE EFEITOS ADVERSOS IRREVERSÍVEIS (DISCINESIA TARDIA).
              </Text>
              <Text style={styles.paragraph}>
                • NÃO ULTRAPASSAR 40 MG/DIA.
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* 4. EFEITOS ADVERSOS */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.sectionCard, styles.cardEfeitos]}
          onPress={() => toggle(3)}
        >
          <Text style={[styles.sectionTitle, styles.titleEfeitos]}>4. EFEITOS ADVERSOS:</Text>
          {expanded[3] && (
            <>
              <Text style={styles.paragraph}>
                • Sintomas Extrapiramidais (EPS): Ocorre devido ao bloqueio de receptores D2 na via nigroestriatal.
              </Text>
              <Text style={styles.subParagraph}>
                ◦ Distonia aguda: Movimentos involuntários como torcicolo, desvio dos olhos (crise oculógira).
              </Text>
              <Text style={styles.subParagraph}>
                ◦ Acatisia: Inquietação, necessidade incontrolável de mover-se.
              </Text>
              <Text style={styles.subParagraph}>
                ◦ DISCINESIA TARDIA: Tiques faciais, movimentos de língua, movimentos estereotipados. PODE PERMANECER NO PACIENTE COMO UMA "CICATRIZ DE USO" E SER IRREVERSÍVEL MESMO APÓS A RETIRADA da medicação (devido a up-regulation dos receptores D2). NÃO É ALERGIA, É EFEITO DO MECANISMO DE AÇÃO.
              </Text>
              <Text style={styles.subParagraph}>
                ◦ Tratamento de EPS: Anticolinérgicos centrais como biperideno (Akineton®) para reequilibrar dopamina/acetilcolina.
              </Text>
              <Text style={styles.paragraph}>
                • Hiperprolactinemia: Bloqueio de D2 na via túbero-infundibular, aumentando os níveis de prolactina no sangue.
              </Text>
              <Text style={styles.subParagraph}>
                ◦ Pode causar: aumento das mamas, galactorreia (produção de leite), ginecomastia em homens.
              </Text>
              <Text style={styles.subParagraph}>
                ◦ Eficácia como galactagogo NÃO É CONVINCENTE em estudos.
              </Text>
              <Text style={styles.paragraph}>
                • Outros: Sonolência, diarreia, depressão, astenia, hipotensão (inicialmente pode causar hipertensão).
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* 5. INTERAÇÕES MEDICAMENTOSAS */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.sectionCard, styles.cardInteracoes]}
          onPress={() => toggle(4)}
        >
          <Text style={[styles.sectionTitle, styles.titleInteracoes]}>5. INTERAÇÕES MEDICAMENTOSAS:</Text>
          {expanded[4] && (
            <>
              <Text style={styles.paragraph}>
                • Anticolinérgicos (ex: Escopolamina/Buscopan®, ciclobenzaprina, amitriptilina): ABOLEM O EFEITO PROCINÉTICO da metoclopramida ao bloquear receptores muscarínicos. Evitar uso concomitante.
              </Text>
              <Text style={styles.paragraph}>
                • Inibidores da CYP2D6 (ex: Fluoxetina, Paroxetina, Bupropiona): Aumentam as concentrações plasmáticas de metoclopramida, elevando o risco de efeitos adversos.
              </Text>
              <Text style={styles.paragraph}>
                • Outros Antagonistas Dopaminérgicos (Bromoprida, Antipsicóticos típicos como Haloperidol): Aumentam o risco de EPS.
              </Text>
              <Text style={styles.paragraph}>
                • Análogos de GLP1 (Ozempic®, Monjaro®): Metoclopramida pode diminuir a eficácia desses fármacos ao acelerar o esvaziamento gástrico.
              </Text>
              <Text style={styles.paragraph}>
                • Levodopa: A metoclopramida atrapalha sua ação em pacientes com Parkinson.
              </Text>
              <Text style={styles.paragraph}>
                • Opioides (Codeína): Podem potencializar a emese.
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* 6. CONTRAINDICAÇÕES (ABSOLUTAS/RELATIVAS) */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.sectionCard, styles.cardContra]}
          onPress={() => toggle(5)}
        >
          <Text style={[styles.sectionTitle, styles.titleContra]}>6. CONTRAINDICAÇÕES (ABSOLUTAS/RELATIVAS):</Text>
          {expanded[5] && (
            <>
              <Text style={styles.paragraph}>
                • Hipersensibilidade à metoclopramida ou ao metabissulfito de sódio (conservante presente em formas líquidas/injetáveis, pode ser a causa de "alergia a camarão").
              </Text>
              <Text style={styles.paragraph}>
                • Obstrução mecânica, perfuração ou hemorragia gastrointestinal.
              </Text>
              <Text style={styles.paragraph}>
                • Histórico de discinesia tardia.
              </Text>
              <Text style={styles.paragraph}>
                • Doença de Parkinson.
              </Text>
              <Text style={styles.paragraph}>
                • Feocromocitoma (risco de crises hipertensivas).
              </Text>
              <Text style={styles.paragraph}>
                • Epilépticos: Pode aumentar a chance de crises convulsivas (contraindicação relativa se bem controlada).
              </Text>
              <Text style={styles.paragraph}>
                • Nefropatas: Maior risco de efeitos adversos devido à eliminação diminuída.
              </Text>
              <Text style={styles.paragraph}>
                • Distúrbios eletrolíticos (hipocalemia, hipomagnesemia): Podem favorecer arritmias.
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* 7. POPULAÇÕES ESPECÍFICAS */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.sectionCard, styles.cardPopulacoes]}
          onPress={() => toggle(6)}
        >
          <Text style={[styles.sectionTitle, styles.titlePopulacoes]}>7. POPULAÇÕES ESPECÍFICAS:</Text>
          {expanded[6] && (
            <>
              <Text style={styles.paragraph}>
                • Crianças (especialmente neonatos): EVITAR AO MÁXIMO devido à maior permeabilidade da barreira hematoencefálica e função renal imatura, o que aumenta o risco de EPS.
              </Text>
              <Text style={styles.paragraph}>
                • Gestantes: EVITAR devido ao risco de EPS para a mãe e o feto, e hiperprolactinemia/mastodinia na mãe. Alternativas: dimenidrinato, meclizina, ciclizina. Ondansetrona deve ser evitada no primeiro trimestre por possível relação com má formação palatina.
              </Text>
              <Text style={styles.paragraph}>
                • Diabéticos: Acelera o esvaziamento gástrico, podendo exigir AJUSTE na dose e tempo de administração da insulina para evitar hiperglicemia pós-prandial.
              </Text>
              <Text style={styles.paragraph}>
                • Lactação: Embora aumente a prolactina, a evidência como galactagogo não é convincente em estudos.
              </Text>
            </>
          )}
        </TouchableOpacity>
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
  heading: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  paragraph: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    marginBottom: theme.spacing.sm,
    lineHeight: theme.fontSize.md * 1.5,
  },
  subParagraph: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.md,
    lineHeight: theme.fontSize.md * 1.5,
  },
  sectionCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Roboto-Bold',
  },
  // Card colors and title colors for each section
  cardIndicacoes: {
    backgroundColor: '#E3F2FD',
  },
  titleIndicacoes: {
    color: '#1976D2',
  },
  cardMecanismo: {
    backgroundColor: '#FFF3E0',
  },
  titleMecanismo: {
    color: '#F57C00',
  },
  cardDoses: {
    backgroundColor: '#E8F5E9',
  },
  titleDoses: {
    color: '#388E3C',
  },
  cardEfeitos: {
    backgroundColor: '#FCE4EC',
  },
  titleEfeitos: {
    color: '#C2185B',
  },
  cardInteracoes: {
    backgroundColor: '#FFFDE7',
  },
  titleInteracoes: {
    color: '#FBC02D',
  },
  cardContra: {
    backgroundColor: '#F3E5F5',
  },
  titleContra: {
    color: '#7B1FA2',
  },
  cardPopulacoes: {
    backgroundColor: '#E0F2F1',
  },
  titlePopulacoes: {
    color: '#00897B',
  },
});