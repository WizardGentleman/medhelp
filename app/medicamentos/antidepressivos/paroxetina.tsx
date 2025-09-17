import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';

export default function ParoxetinaScreen() {
  const [expanded, setExpanded] = useState([false, false, false]);

  const toggle = (idx: number) => {
    setExpanded(prev => prev.map((v, i) => i === idx ? !v : v));
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Paroxetina" />
      <ScrollView style={styles.content}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.sectionCard, styles.cardDoses]}
          onPress={() => toggle(0)}
        >
          <Text style={[styles.sectionTitle, styles.titleDoses]}>DOSES:</Text>
          {expanded[0] && (
            <>
              <Text style={styles.paragraph}>🟢 DOSE INICIAL = 10 mg pela manhã da formulação de liberação imediata (IR). Se ocorrer sedação diurna, a dose pode ser administrada à noite.</Text>
              <Text style={styles.paragraph}>✅ DOSE PADRÃO = 20 a 40 mg uma vez ao dia</Text>
              <Text style={styles.paragraph}>🔼 Pode ser aumentada de 10 mg por dia a cada 1 a 4 semanas</Text>
              <Text style={styles.paragraph}>🚫 Máximo 50 mg por dia.</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.sectionCard, styles.cardInfo]}
          onPress={() => toggle(1)}
        >
          <Text style={[styles.sectionTitle, styles.titleInfo]}>AJUSTES E OBSERVAÇÕES:</Text>
          {expanded[1] && (
            <>
              <Text style={styles.paragraphInfo}>Titulação mais frequente (por exemplo, a cada 3 a 6 dias) pode ser apropriada em casos urgentes com monitoramento rigoroso, como pacientes internados.</Text>
              <Text style={styles.paragraphInfo}>A paroxetina também está disponível como formulação de liberação prolongada (ER). As doses recomendadas diferem. Consulte a monografia do medicamento para obter mais detalhes.</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.sectionCard, styles.cardRisks]}
          onPress={() => toggle(2)}
        >
          <Text style={[styles.sectionTitle, styles.titleRisks]}>EFEITOS ADVERSOS E RISCOS:</Text>
          {expanded[2] && (
            <>
              <Text style={styles.paragraphRisks}>⚠ Tem maior probabilidade de resultar em ganho de peso e disfunção sexual do que outros ISRSs.</Text>
              <Text style={styles.paragraphRisks}>⚠ Os sintomas de descontinuação são comuns se as doses forem esquecidas.</Text>
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
  },
  cardDoses: {
    backgroundColor: '#E8F5E9',
  },
  titleDoses: {
    color: '#388E3C',
  },
  cardInfo: {
    backgroundColor: '#FFF3E0',
  },
  titleInfo: {
    color: '#F57C00',
  },
  cardRisks: {
    backgroundColor: '#FFEBEE',
  },
  titleRisks: {
    color: '#D32F2F',
  },
  paragraph: {
    fontSize: 16,
    color: '#388E3C',
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  paragraphInfo: {
    fontSize: 16,
    color: '#F57C00',
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  paragraphRisks: {
    fontSize: 16,
    color: '#D32F2F',
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
});
