import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

export default function EstadoMalEpilepticoScreen() {
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  const toggleCard = (cardIndex: number) => {
    setExpandedCards(prev => 
      prev.includes(cardIndex) 
        ? prev.filter(i => i !== cardIndex)
        : [...prev, cardIndex]
    );
  };

  const cards = [
    { 
      title: 'Primeiro passo - Estabilização',
      content: (
        <View>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>⚡ AÇÕES IMEDIATAS</Text>
            <Text style={styles.alertText}>Tempo é crítico! Iniciar simultaneamente:</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Monitorização e Suporte</Text>
            <Text style={styles.bulletPoint}>• Sinais vitais contínuos</Text>
            <Text style={styles.bulletPoint}>• Oximetria de pulso</Text>
            <Text style={styles.bulletPoint}>• O₂ suplementar durante a crise</Text>
            <Text style={styles.bulletPoint}>• Decúbito lateral (se possível)</Text>
            <Text style={styles.bulletPoint}>• Aspiração de vias aéreas (se necessário)</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💉 Acesso e Exames</Text>
            <Text style={styles.bulletPoint}>• Acesso venoso periférico calibroso</Text>
            <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Glicemia capilar IMEDIATA</Text></Text>
            <Text style={styles.bulletPoint}>• Coletar sangue para laboratório:</Text>
            <Text style={styles.subBullet}>  - Eletrólitos, função renal</Text>
            <Text style={styles.subBullet}>  - Gasometria arterial</Text>
            <Text style={styles.subBullet}>  - Hemograma, enzimas</Text>
          </View>

          <View style={styles.warningSection}>
            <Text style={styles.warningTitle}>⚠️ Considerar Tiamina</Text>
            <Text style={styles.warningDose}>100mg IV antes da glicose se:</Text>
            <Text style={styles.warningText}>• Etilismo conhecido/suspeito</Text>
            <Text style={styles.warningText}>• Sinais de desnutrição</Text>
            <Text style={styles.warningText}>• Abstinência alcoólica</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 Avaliação Rápida</Text>
            <Text style={styles.bulletPoint}>• História com acompanhantes:</Text>
            <Text style={styles.subBullet}>  - Tempo de início da crise</Text>
            <Text style={styles.subBullet}>  - Uso de anticonvulsivantes</Text>
            <Text style={styles.subBullet}>  - Eventos precipitantes</Text>
            <Text style={styles.bulletPoint}>• Exame neurológico direcionado:</Text>
            <Text style={styles.subBullet}>  - Pupilas e reflexos</Text>
            <Text style={styles.subBullet}>  - Fundoscopia (se possível)</Text>
            <Text style={styles.subBullet}>  - Déficits focais</Text>
            <Text style={styles.subBullet}>  - Rigidez de nuca</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>💡 Sinais de Crise Sutil</Text>
            <Text style={styles.infoText}>
              • Movimentos rítmicos sutis nas extremidades
              • Desvio persistente do olhar
              • Alterações pupilares rítmicas (hippus)
              • Automatismos faciais
            </Text>
          </View>
        </View>
      )
    },
    { 
      title: 'Primeira linha farmacológica',
      content: (
        <View>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>⏰ INICIAR SE CRISE > 5 MINUTOS</Text>
            <Text style={styles.alertText}>Administrar anticonvulsivante imediatamente</Text>
          </View>

          <View style={styles.medicationCard}>
            <View style={styles.medicationHeader}>
              <Text style={styles.medicationName}>DIAZEPAM</Text>
              <Text style={styles.medicationDose}>10 mg EV</Text>
            </View>
            <View style={styles.medicationDetails}>
              <Text style={styles.detailTitle}>Diluição:</Text>
              <Text style={styles.detailText}>Não diluído ou em NaCl 0,9%</Text>
              <Text style={styles.detailText}>1 amp 10 mg/mL em 9 mL de SF</Text>
              
              <Text style={styles.detailTitle}>Administração:</Text>
              <Text style={styles.detailText}>EV 5 mg/min (adulto)</Text>
              <Text style={styles.detailText}>2 mg/min em crianças</Text>
              <Text style={styles.detailText}>Recomendado repetir, se necessário</Text>
              <Text style={styles.detailText}>(total duas doses)</Text>
              
              <Text style={styles.detailTitle}>Efeitos colaterais:</Text>
              <Text style={styles.detailText}>• Hipotensão/depressão respiratória</Text>
              <Text style={styles.detailText}>• Altamente recomendado uso de fenitoína após diazepam devido à alta taxa de recorrência</Text>
            </View>
          </View>

          <View style={styles.medicationCard}>
            <View style={styles.medicationHeader}>
              <Text style={styles.medicationName}>MIDAZOLAM</Text>
              <Text style={styles.medicationDose}>10 mg IM</Text>
            </View>
            <View style={styles.medicationDetails}>
              <Text style={styles.detailTitle}>Diluição:</Text>
              <Text style={styles.detailText}>Sem diluição</Text>
              
              <Text style={styles.detailTitle}>Administração:</Text>
              <Text style={styles.detailText}>Intramuscular</Text>
              <Text style={styles.detailText}>Reduzir dose para 5 mg IM se peso de 13-40 kg</Text>
              <Text style={styles.detailText}>Não recomendado repetir</Text>
              
              <Text style={styles.detailTitle}>Efeitos colaterais:</Text>
              <Text style={styles.detailText}>• Hipotensão/depressão respiratória</Text>
              <Text style={styles.detailText}>• Primeira opção se paciente não estiver com acesso venoso</Text>
            </View>
          </View>

          <View style={styles.warningSection}>
            <Text style={styles.warningTitle}>⚠️ Alternativa</Text>
            <Text style={styles.warningText}>Se nenhum dos medicamentos acima estiver disponível:</Text>
            <Text style={styles.warningDose}>FENOBARBITAL 15 mg/kg/dose</Text>
            <Text style={styles.warningText}>Via intravenosa, dose única</Text>
          </View>
        </View>
      )
    },
    { 
      title: 'Segunda linha farmacológica',
      content: 'Em construção...' 
    },
    { 
      title: 'Terceira linha farmacológica',
      content: 'Em construção...' 
    },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Estado de Mal Epiléptico" type="emergency" />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {cards.map((card, index) => (
            <View key={index} style={styles.card}>
              <TouchableOpacity 
                style={styles.cardHeader}
                onPress={() => toggleCard(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.cardTitle}>{card.title}</Text>
                {expandedCards.includes(index) ? (
                  <ChevronUp size={24} color="white" />
                ) : (
                  <ChevronDown size={24} color="white" />
                )}
              </TouchableOpacity>
              
              {expandedCards.includes(index) && (
                <View style={styles.cardContent}>
                  <Text style={styles.contentText}>{card.content}</Text>
                </View>
              )}
            </View>
          ))}
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
  card: {
    marginBottom: theme.spacing.lg,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.emergency,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    flex: 1,
  },
  cardContent: {
    padding: theme.spacing.lg,
  },
  contentText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 24,
    marginTop: theme.spacing.sm,
  },
  // Estilos específicos para o conteúdo dos cards
  alertBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#F44336',
    marginBottom: theme.spacing.lg,
  },
  alertTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#F44336',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  alertText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#F44336',
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  bulletPoint: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 24,
  },
  subBullet: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    lineHeight: 22,
  },
  highlight: {
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
  },
  warningSection: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#FF9800',
    marginBottom: theme.spacing.lg,
  },
  warningTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF9800',
    marginBottom: theme.spacing.xs,
  },
  warningDose: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
    marginBottom: theme.spacing.xs,
  },
  warningText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#F57C00',
    lineHeight: 22,
  },
  infoSection: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#1976D2',
    lineHeight: 22,
  },
  // Estilos para cards de medicação
  medicationCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  medicationHeader: {
    backgroundColor: '#F5F5F5',
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  medicationName: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
  },
  medicationDose: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  medicationDetails: {
    padding: theme.spacing.md,
  },
  detailTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
});
