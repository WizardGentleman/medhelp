import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';

export default function TaquiarritmiasScreen() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (cardIndex: number) => {
    setExpandedCard(expandedCard === cardIndex ? null : cardIndex);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Taquiarritmias" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Card 1: Taquiarritmia Regular QRS Estreito */}
          <View style={styles.regularQRSEstreitoCard}>
            <TouchableOpacity onPress={() => toggleCard(1)}>
              <Text style={styles.regularQRSEstreitoTitle}>⚡ TAQUIARRITMIA REGULAR QRS ESTREITO</Text>
            </TouchableOpacity>
            {expandedCard === 1 && (
              <View>
                <Text style={styles.questionText}>Estável hemodinamicamente?</Text>
                
                <View style={[styles.optionBox, {backgroundColor: '#DBEAFE', borderColor: '#3B82F6'}]}>
                  <Text style={styles.boldText}>✅ SE SIM (Estável):</Text>
                  <Text style={styles.cardText}>• Manobra vagal</Text>
                  <Text style={styles.cardText}>• SE INEFICAZ → Adenosina IV</Text>
                  <Text style={styles.cardText}>• SE INEFICAZ → Betabloqueador IV</Text>
                </View>
                
                <View style={[styles.optionBox, {backgroundColor: '#FEE2E2', borderColor: '#DC2626'}]}>
                  <Text style={styles.boldText}>❌ SE NÃO (Instável):</Text>
                  <Text style={styles.cardText}>• Cardioversão elétrica 50-100J</Text>
                </View>
                
                <Text style={styles.noteText}>💡 Nota: 50 a 100 J Bifásico</Text>
              </View>
            )}
          </View>

          {/* Card 2: Taquiarritmia Regular QRS Largo */}
          <View style={styles.regularQRSLargoCard}>
            <TouchableOpacity onPress={() => toggleCard(2)}>
              <Text style={styles.regularQRSLargoTitle}>⚡ TAQUIARRITMIA REGULAR QRS LARGO</Text>
            </TouchableOpacity>
            {expandedCard === 2 && (
              <View>
                <Text style={styles.questionText}>Estável hemodinamicamente?</Text>
                
                <View style={[styles.optionBox, {backgroundColor: '#FFF7ED', borderColor: '#F97316'}]}>
                  <Text style={styles.boldText}>✅ SE SIM (Estável):</Text>
                  <Text style={styles.cardText}>• Manobra vagal</Text>
                  <Text style={styles.cardText}>• SE INEFICAZ → Adenosina IV</Text>
                  <Text style={styles.cardText}>• SE INEFICAZ → Amiodarona IV</Text>
                </View>
                
                <View style={[styles.optionBox, {backgroundColor: '#FEE2E2', borderColor: '#DC2626'}]}>
                  <Text style={styles.boldText}>❌ SE NÃO (Instável):</Text>
                  <Text style={styles.cardText}>• Cardioversão elétrica 100J</Text>
                </View>
                
                <Text style={styles.noteText}>💡 Nota: Cardioversão 100 J Bifásico</Text>
              </View>
            )}
          </View>

          {/* Card 3: Taquiarritmia Irregular QRS Estreito */}
          <View style={styles.irregularQRSEstreitoCard}>
            <TouchableOpacity onPress={() => toggleCard(3)}>
              <Text style={styles.irregularQRSEstreitoTitle}>⚡ TAQUIARRITMIA IRREGULAR QRS ESTREITO</Text>
            </TouchableOpacity>
            {expandedCard === 3 && (
              <View>
                <Text style={[styles.boldText, {marginBottom: 8}]}>FA ou Flutter</Text>
                
                <View style={[styles.infoBox, {backgroundColor: '#FEF3C7', borderColor: '#F59E0B'}]}>
                  <Text style={styles.infoText}>⚠️ FA causado por libação alcoólica, geralmente SÓ com controle da FC já reverte a FA</Text>
                </View>
                
                <Text style={[styles.boldText, {marginTop: 12}]}>Se paciente com FC > 100 bpm, controle de FC:</Text>
                
                <View style={[styles.doseBox, {backgroundColor: '#E0E7FF'}]}>
                  <Text style={styles.boldText}>💊 METOPROLOL</Text>
                  <Text style={styles.cardText}>• 5mg em 1-2 minutos</Text>
                  <Text style={styles.cardText}>• Repetir até 3x</Text>
                </View>
                
                <View style={[styles.doseBox, {backgroundColor: '#F0E7FF'}]}>
                  <Text style={styles.boldText}>💊 ESMOLOL</Text>
                  <Text style={styles.cardText}>• Bolus: 500mcg/kg em 1 minuto</Text>
                  <Text style={styles.cardText}>• Manutenção: 50mcg/kg/min</Text>
                  <Text style={styles.cardText}>• Aumentar a cada 10 minutos</Text>
                  <Text style={styles.cardText}>• Dose máxima: 300mcg/kg/min</Text>
                </View>
                
                <View style={[styles.warningBox, {marginTop: 12}]}>
                  <Text style={styles.warningText}>⚡ CARDIOVERSÃO ELÉTRICA 100J realizar apenas quando FC > 150 a 160</Text>
                  <Text style={styles.noteText}>Geralmente abaixo disso o aumento da FC é secundário a outra condição</Text>
                </View>
                
                <View style={[styles.sectionBox, {marginTop: 16}]}>
                  <Text style={[styles.boldText, {color: '#7C3AED'}]}>🔄 FA COM INDICAÇÃO DE CARDIOVERSÃO</Text>
                  
                  <View style={[styles.alertBox, {marginTop: 12}]}>
                    <Text style={styles.alertText}>⚠️ NÃO ESQUEÇA: Anticoagulação para TODOS por pelo menos 30 dias, após isso CHA2DS2-VASc</Text>
                  </View>
                  
                  <Text style={[styles.boldText, {marginTop: 12}]}>Instável?</Text>
                  <Text style={styles.cardText}>• SIM → HNF ou HBPM</Text>
                  <Text style={styles.cardText}>• NÃO → HNF ou HBPM com ou sem ECOTE</Text>
                  
                  <Text style={[styles.boldText, {marginTop: 12}]}>FA {'<'} 48h?</Text>
                  <Text style={styles.cardText}>• SIM → Estratégia sem ECOTE</Text>
                  <Text style={styles.cardText}>• NÃO → Estratégia com ECOTE</Text>
                  
                  <Text style={[styles.boldText, {marginTop: 12}]}>Qual paciente cardioverter:</Text>
                  <View style={styles.listBox}>
                    <Text style={styles.cardText}>• Primeiro episódio</Text>
                    <Text style={styles.cardText}>• Sintomáticos</Text>
                    <Text style={styles.cardText}>• Jovens</Text>
                    <Text style={styles.cardText}>• Átrio normal ou pouco aumentado</Text>
                    <Text style={styles.cardText}>• FA com causa reversível</Text>
                    <Text style={styles.cardText}>• FA de curta duração</Text>
                    <Text style={styles.cardText}>• Sem cardiopatia estrutural</Text>
                    <Text style={styles.cardText}>• Insuficiência cardíaca</Text>
                  </View>
                  
                  <Text style={[styles.boldText, {marginTop: 12}]}>CARDIOVERSÃO QUÍMICA</Text>
                  <Text style={styles.cardText}>• Função ventricular conhecida - função sistólica preservada → Propafenona</Text>
                  <Text style={styles.cardText}>• Função ventricular conhecida - disfunção sistólica → Amiodarona</Text>
                  <Text style={styles.cardText}>• Função ventricular desconhecida → Amiodarona</Text>
                  
                  <View style={[styles.infoBox, {marginTop: 12, backgroundColor: '#E0F2FE'}]}>
                    <Text style={styles.infoText}>ECO sem trombos: CVE. Anticoagulação por 4 semanas. Após, conforme risco</Text>
                    <Text style={styles.infoText}>ECO com trombos: Anticoagulação por 3 semanas. Repetir ECOTE</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Card 4: Taquiarritmia Irregular QRS Largo */}
          <View style={styles.irregularQRSLargoCard}>
            <TouchableOpacity onPress={() => toggleCard(4)}>
              <Text style={styles.irregularQRSLargoTitle}>⚡ TAQUIARRITMIA IRREGULAR QRS LARGO</Text>
            </TouchableOpacity>
            {expandedCard === 4 && (
              <View>
                <Text style={styles.questionText}>Estável hemodinamicamente?</Text>
                
                <View style={[styles.optionBox, {backgroundColor: '#D1FAE5', borderColor: '#10B981'}]}>
                  <Text style={styles.boldText}>✅ SE SIM (Estável):</Text>
                  <Text style={styles.cardText}>• TORSADES → Sulfato de Magnésio</Text>
                  <Text style={styles.cardText}>• FA + WPW → Procainamida ou Ibutilida ou Amiodarona*</Text>
                </View>
                
                <View style={[styles.optionBox, {backgroundColor: '#FEE2E2', borderColor: '#DC2626'}]}>
                  <Text style={styles.boldText}>❌ SE NÃO (Instável):</Text>
                  <Text style={styles.cardText}>• Desfibrilação ou Cardioversão Elétrica 200J</Text>
                </View>
                
                <View style={[styles.alertBox, {marginTop: 12}]}>
                  <Text style={styles.alertText}>⚡ Se for Torsades precisa ser DESFIBRILAÇÃO</Text>
                </View>
                
                <View style={[styles.infoBox, {backgroundColor: '#FFF7ED', borderColor: '#F59E0B', marginTop: 12}]}>
                  <Text style={styles.cardText}>Torsades geralmente é por prolongamento do intervalo QT</Text>
                  <Text style={styles.cardText}>→ Checar medicações e eletrólitos do paciente</Text>
                </View>
                
                <View style={[styles.doseBox, {backgroundColor: '#E7F3FF', marginTop: 16}]}>
                  <Text style={styles.boldText}>💉 SULFATO DE MAGNÉSIO</Text>
                  <Text style={styles.cardText}>• Dose recomendada: 1-2 g de MgSO4 50% em 5-20 minutos</Text>
                  <Text style={styles.cardText}>• 1 g equivale a 2 ml e 2 g equivale a 4 ml</Text>
                  <Text style={styles.cardText}>• Se necessário pode-se realizar novamente 2 g após 15 minutos</Text>
                  <Text style={styles.noteText}>📝 OBS: 10% é igual a 100 mg/ml e 50% é 500 mg/ml</Text>
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
  // Card principal - QRS Estreito Regular
  regularQRSEstreitoCard: {
    backgroundColor: '#EFF6FF',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  regularQRSEstreitoTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#2563EB',
    marginBottom: theme.spacing.sm,
  },
  // Card principal - QRS Largo Regular
  regularQRSLargoCard: {
    backgroundColor: '#FFF7ED',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#EA580C',
  },
  regularQRSLargoTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#EA580C',
    marginBottom: theme.spacing.sm,
  },
  // Card principal - QRS Estreito Irregular
  irregularQRSEstreitoCard: {
    backgroundColor: '#FFF5F5',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  irregularQRSEstreitoTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#DC2626',
    marginBottom: theme.spacing.sm,
  },
  // Card principal - QRS Largo Irregular
  irregularQRSLargoCard: {
    backgroundColor: '#F0FDF4',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#16A34A',
  },
  irregularQRSLargoTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#16A34A',
    marginBottom: theme.spacing.sm,
  },
  // Estilos comuns
  questionText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  cardText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  boldText: {
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  noteText: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Italic',
    color: '#6B7280',
    marginTop: theme.spacing.xs,
  },
  // Caixas de opção
  optionBox: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    marginVertical: theme.spacing.xs,
  },
  // Caixas de informação
  infoBox: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Caixas de dose
  doseBox: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  // Caixa de aviso
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  warningText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#92400E',
  },
  // Caixa de alerta
  alertBox: {
    backgroundColor: '#FEE2E2',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  alertText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#DC2626',
  },
  // Seção interna
  sectionBox: {
    backgroundColor: '#F9FAFB',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  // Lista
  listBox: {
    paddingLeft: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
});

