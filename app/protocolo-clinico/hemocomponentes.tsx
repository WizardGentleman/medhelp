import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { NavigationButton } from '@/components/NavigationButton';
import { theme } from '@/styles/theme';
import { Droplets, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react-native';

export default function HemocomponentesScreen() {
  const [isReferenceExpanded, setIsReferenceExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Hemocomponentes/Reações" type="clinical" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Card de Introdução */}
          <View style={styles.introCard}>
            <View style={styles.introHeader}>
              <Droplets size={24} color="#0EA5E9" />
              <Text style={styles.introTitle}>Hemocomponentes e Reações Transfusionais</Text>
            </View>
            <Text style={styles.introText}>
              Protocolo para orientação sobre o uso adequado de hemocomponentes e manejo de reações transfusionais em ambiente hospitalar. Selecione o tópico desejado:
            </Text>
          </View>

          {/* Botões de Navegação */}
          <View style={styles.buttonContainer}>
            <NavigationButton
              icon={<Droplets size={40} color="#0EA5E9" />}
              title="Hemocomponentes"
              route="/protocolo-clinico/hemocomponentes-detalhes"
              type="clinical"
              style={{ backgroundColor: '#F0F9FF', borderColor: '#0EA5E9', borderWidth: 2 }}
              textColor="#0EA5E9"
            />
            
            <NavigationButton
              icon={<AlertTriangle size={40} color="#DC2626" />}
              title="Reações Transfusionais"
              route="/protocolo-clinico/reacoes-transfusionais"
              type="clinical"
              style={{ backgroundColor: '#FFF5F5', borderColor: '#DC2626', borderWidth: 2 }}
              textColor="#DC2626"
            />
          </View>

          {/* Card de Aviso/Disclaimer */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerText}>
              ⚠️ Esta ferramenta oferece orientações baseadas em diretrizes gerais de hemoterapia. 
              Sempre consulte as diretrizes institucionais e avalie individualmente cada caso.
            </Text>
          </View>

          {/* Referência Bibliográfica */}
          <TouchableOpacity
            style={styles.referenceCard}
            onPress={() => setIsReferenceExpanded(!isReferenceExpanded)}
          >
            <View style={styles.referenceHeader}>
              <Text style={styles.referenceTitle}>
                <Info size={20} color={theme.colors.primary} /> Referências Bibliográficas
              </Text>
              {isReferenceExpanded ? (
                <ChevronUp size={20} color={theme.colors.primary} />
              ) : (
                <ChevronDown size={20} color={theme.colors.primary} />
              )}
            </View>
            {isReferenceExpanded && (
              <View>
                <Text style={styles.referenceText}>
                  Brasil. Ministério da Saúde. Secretaria de Atenção à Saúde. Departamento de Atenção Especializada e Temática. Guia para uso de hemocomponentes. 2. ed., 1. reimpr. Brasília: Ministério da Saúde, 2015. 136 p.
                </Text>
                <Text style={styles.referenceText}>
                  Garraud O, Hamzeh-Cognasse H, Chalayer E, et al. Platelet transfusion in adults: An update. Transfus Clin Biol. 2022. doi:10.1016/j.tracli.2022.08.147
                </Text>
                <Text style={styles.referenceText}>
                  Kumar A, Mhaskar R, Grossman BJ, et al. Platelet transfusion: a systematic review of the clinical evidence. Transfusion.
                </Text>
                <Text style={styles.referenceText}>
                  Panch SR, Montemayor-Garcia C, Klein HG. Hemolytic transfusion reactions. N Engl J Med. 2019;381(2):150-162. doi:10.1056/NEJMra1802338
                </Text>
                <Text style={styles.referenceText}>
                  Tadasa E, Adissu W, Bekele M, Arega G, Gedefaw L. Incidence of acute transfusion reactions and associated factors among adult blood-transfused patients at Jimma University Medical Center, Southwest Ethiopia: A cross-sectional study. Medicine. 2024;103(32):e39137. doi:10.1097/MD.0000000000039137
                </Text>
                <Text style={styles.referenceText}>
                  Yuan S, Otrock ZK. Platelet transfusion: An update on indications and guidelines. Clin Lab Med. 2021;41(4):621-634. doi:10.1016/j.cll.2021.07.005
                </Text>
              </View>
            )}
          </TouchableOpacity>

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
    backgroundColor: '#F0F9FF',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#0EA5E9',
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  introTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#0EA5E9',
    marginLeft: theme.spacing.sm,
  },
  introText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de hemocomponentes (azul)
  hemocomponentesCard: {
    backgroundColor: '#F0F9FF',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#0EA5E9',
  },
  hemocomponentesTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#0EA5E9',
    marginBottom: theme.spacing.sm,
  },
  hemocomponentesText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de reações (vermelho)
  reactionCard: {
    backgroundColor: '#FFF5F5',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  reactionTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#DC2626',
    marginBottom: theme.spacing.sm,
  },
  reactionText: {
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
  // Caixa de indicação
  indicationBox: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderLeftWidth: 4,
    marginVertical: theme.spacing.sm,
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
    marginBottom: theme.spacing.xl,
  },
  disclaimerText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#E65100',
    lineHeight: 18,
    textAlign: 'center',
  },
  // Container dos botões
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  // Estilos para referência bibliográfica
  referenceCard: {
    backgroundColor: '#F8F9FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  referenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referenceTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.primary,
  },
  referenceText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },
});
