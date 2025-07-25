import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';

export default function FibrilacaoAtrialScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Fibrilação Atrial" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Avaliação Inicial de Emergência */}
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>🚨 AVALIAÇÃO INICIAL DE EMERGÊNCIA</Text>
            <Text style={styles.emergencyText}>
              • Verificar estabilidade hemodinâmica
              • Avaliar sinais vitais (PA, FC, FR, SpO2)
              • Identificar sinais de choque ou insuficiência cardíaca
              • Realizar ECG de 12 derivações imediatamente
              • Investigar causas precipitantes
            </Text>
          </View>

          {/* Classificação Clínica */}
          <View style={styles.classificationCard}>
            <Text style={styles.classificationTitle}>📊 CLASSIFICAÇÃO TEMPORAL</Text>
            <Text style={styles.classificationText}>
              <Text style={styles.boldText}>Estágio 1 - Em risco de FA:</Text> Pacientes com fatores de risco (idade, sexo masculino, predisposição genética, obesidade, sedentarismo, hipertensão, apneia do sono, diabetes, álcool), sem diagnóstico de FA.
              {"\n"}
              <Text style={styles.treatmentBadge}>💊 Tratamento: abordar fatores de risco modificáveis.</Text>
              {"\n\n"}
              <Text style={styles.boldText}>Estágio 2 - Pré FA:</Text> Evidência estrutural ou elétrica predisponente (aumento atrial, ectopias, flutter, taquicardia atrial curta); monitoramento próximo recomendado.
              {"\n"}
              <Text style={styles.treatmentBadge}>🩺 Tratamento: Manter acompanhamento cardiológico próximo, sem tratamento específico.</Text>
              {"\n\n"}
              <Text style={styles.boldText}>Estágio 3 - FA:</Text>
              {"\n"}              <Text style={styles.boldText}>3a:</Text> FA paroxística - episódios {'<'} 7 dias, intermitentes.
              {"\n"}              <Text style={styles.boldText}>3b:</Text> FA persistente - episódios {'>'} 7 dias, necessita intervenção.
              {"\n"}              <Text style={styles.boldText}>3c:</Text> FA persistente de longa data - {'>'} 1 ano.
              {"\n"}              <Text style={styles.boldText}>3d:</Text> FA após ablação bem-sucedida.
              {"\n"}
              A partir do estágio 3, diagnóstico é confirmado; foco em 3 pilares: controle sintomas, fatores de risco e prevenção tromboembolismo.
              {"\n"}
              <Text style={styles.treatmentBadge}>⚡ Tratamento: Realizar manejo sintomático {'>'} Controle de ritmo OU controle de frequência</Text>
              {"\n\n"}
              <Text style={styles.boldText}>Estágio 4 - FA Permanente:</Text> Sem tentativas de controle de ritmo.
            </Text>
          </View>

          {/* Estratégia de Controle */}
          <View style={styles.strategyCard}>
            <Text style={styles.strategyTitle}>🎯 CONTROLAR FREQUÊNCIA OU RITMO?</Text>
            <Text style={styles.strategyText}>
              <Text style={styles.boldText}>Desfechos similares:</Text> Para a maioria dos pacientes, ambas estratégias têm resultados comparáveis (estudos AFFIRM e HOT CAFE).
              {"\n\n"}
              <Text style={styles.boldText}>FLUXOGRAMA DE DECISÃO TERAPÊUTICA:</Text>
              {"\n\n"}
              <Text style={styles.treatmentBadge}>🟠 CONTROLE DE FREQUÊNCIA - Preferir quando:</Text>
              {"\n"}• Paciente prefere controle de frequência
              {"\n"}• Idade mais velha
              {"\n"}• História mais longa de FA
              {"\n"}• Poucos sintomas
              {"\n"}• FC de fácil controle
              {"\n"}• Átrio esquerdo maior
              {"\n"}• Sem ou pouca disfunção ventricular esquerda
              {"\n"}• Sem ou pouca regurgitação atrioventricular
              {"\n\n"}
              <Text style={styles.treatmentBadge}>🔵 CONTROLE DE RITMO - Preferir quando:</Text>
              {"\n"}• Paciente prefere controle de ritmo
              {"\n"}• Idade mais jovem
              {"\n"}• História recente de FA
              {"\n"}• Muitos sintomas
              {"\n"}• FC de difícil controle
              {"\n"}• Átrio esquerdo menor
              {"\n"}• Maior disfunção ventricular esquerda
              {"\n"}• Maior regurgitação atrioventricular
              {"\n\n"}
              <Text style={styles.boldText}>INDICAÇÕES ESPECÍFICAS PARA CONTROLE DE RITMO:</Text>
              {"\n"}
              <Text style={styles.treatmentBadge}>🆕 FA recente: Pacientes com diagnóstico há {'<'} 1 ano</Text>
              {"\n"}• Redução de 25% em mortalidade, AVC e hospitalizações (estudo EAST-AFNET 4)
              {"\n"}• Maior chance de manutenção do ritmo sinusal a longo prazo
              {"\n\n"}
              <Text style={styles.treatmentBadge}>❤️ ICFEr: Insuficiência cardíaca com fração de ejeção reduzida</Text>
              {"\n"}• Melhora mortalidade e reduz hospitalizações (estudos CABANA e CASTLE-AF)
              {"\n"}• Recomendado mesmo com FC controlada para avaliar contribuição da FA
              {"\n\n"}
              <Text style={styles.boldText}>INDICAÇÕES PARA ABLAÇÃO SE CONTROLE DE RITMO:</Text>
              {"\n\n"}
              <Text style={styles.treatmentBadge}>✅ ABLAÇÃO RECOMENDADA:</Text>
              {"\n"}• <Text style={styles.boldText}>Taquicardiomiopatia</Text>
              {"\n"}• <Text style={styles.boldText}>IC em estágios iniciais</Text>
              {"\n"}• <Text style={styles.boldText}>Sem cicatrizes ventriculares na ressonância magnética cardíaca</Text>
              {"\n"}• <Text style={styles.boldText}>Sem ou pouca fibrose atrial</Text>
              {"\n"}• <Text style={styles.boldText}>FA paroxística ou persistente com até 1 ano de duração</Text>
              {"\n"}• <Text style={styles.boldText}>Pacientes jovens sem comorbidades significativas</Text>
              {"\n\n"}
              <Text style={styles.treatmentBadge}>🟡 CONSIDERAR ABLAÇÃO:</Text>
              {"\n"}• <Text style={styles.boldText}>FA paroxística ou persistente com até 1 ano de duração</Text>
              {"\n"}• <Text style={styles.boldText}>Idade {'<'} 70 anos</Text>
              {"\n"}• <Text style={styles.boldText}>FA sintomática ou candidato a ablação para controle de sintomas</Text>
              {"\n"}• <Text style={styles.boldText}>Poucas comorbidades</Text>
              {"\n"}• <Text style={styles.boldText}>IC avançada</Text>
              {"\n"}• <Text style={styles.boldText}>Cicatrizes ventriculares significativas na ressonância magnética cardíaca</Text>
              {"\n"}• <Text style={styles.boldText}>Miopatia atrial grave (dilatação e/ou fibrose)</Text>
              {"\n"}• <Text style={styles.boldText}>FA persistente de longa data</Text>
              {"\n"}• <Text style={styles.boldText}>Falha após ablações prévias</Text>
              {"\n"}• <Text style={styles.boldText}>Idade avançada ou muitas comorbidades</Text>
              {"\n\n"}
              <Text style={styles.treatmentBadge}>❌ POUCO PROVÁVEL BENEFÍCIO COM ABLAÇÃO:</Text>
              {"\n"}• <Text style={styles.boldText}>Doença valvar</Text>
              {"\n"}• <Text style={styles.boldText}>Doenças estruturais cardíacas ou doença congênita cardíaca</Text>
              {"\n"}• <Text style={styles.boldText}>Causas reversíveis como hipertireoidismo e cirurgia cardíaca recente</Text>
              {"\n"}• <Text style={styles.boldText}>Comorbidades como doença renal crônica</Text>
              {"\n"}• <Text style={styles.boldText}>Expectativa de vida menor do que 1 ano</Text>
              {"\n"}• <Text style={styles.boldText}>Fibrose atrial extensa</Text>
              {"\n"}• <Text style={styles.boldText}>FA de longa duração com múltiplas falhas terapêuticas</Text>
            </Text>
          </View>

          {/* Tratamento Agudo */}
          <View style={styles.treatmentCard}>
            <Text style={styles.treatmentTitle}>⚡ TRATAMENTO AGUDO</Text>
            <Text style={styles.treatmentSubtitle}>Instabilidade Hemodinâmica:</Text>
            <Text style={styles.treatmentText}>
              • Cardioversão elétrica IMEDIATA
              • Energia: 120-200J (bifásico) ou 200J (monofásico)
              • Sedação se consciente
              • Anticoagulação após estabilização
            </Text>
            <Text style={styles.treatmentSubtitle}>Estabilidade Hemodinâmica:</Text>
            <Text style={styles.treatmentText}>
              • Controle de frequência OU ritmo
              • Avaliação de risco tromboembólico
              • Considerar cardioversão farmacológica
            </Text>
          </View>

          {/* Controle de Frequência */}
          <View style={styles.medicationCard}>
            <Text style={styles.medicationTitle}>💊 CONTROLE DE FREQUÊNCIA</Text>
            <Text style={styles.medicationText}>
              <Text style={styles.boldText}>Metoprolol:</Text> 25-50mg VO 12/12h ou 2,5-5mg IV lento
              {"\n"}<Text style={styles.boldText}>Diltiazem:</Text> 120-360mg/dia VO ou 0,25mg/kg IV
              {"\n"}<Text style={styles.boldText}>Digoxina:</Text> 8-12mcg/kg IV (dose de ataque)
              {"\n"}<Text style={styles.boldText}>Amiodarona:</Text> 5mg/kg IV em 10min (se IC)
              {"\n"}<Text style={styles.boldText}>Meta:</Text> FC {'<'} 110 bpm em repouso
            </Text>
          </View>

          {/* Anticoagulação */}
          <View style={styles.anticoagulationCard}>
            <Text style={styles.anticoagulationTitle}>🩸 ANTICOAGULAÇÃO</Text>
            <Text style={styles.anticoagulationSubtitle}>Escore CHA₂DS₂-VASc:</Text>
            <Text style={styles.anticoagulationText}>
              • IC/disfunção VE (1pt) • HAS (1pt) • Idade ≥75 (2pts)
              • DM (1pt) • AVC/AIT prévio (2pts) • Doença vascular (1pt)
              • Idade 65-74 (1pt) • Sexo feminino (1pt)
              {"\n"}<Text style={styles.boldText}>≥2 pontos (homem) ou ≥3 pontos (mulher):</Text> Anticoagulação
              {"\n"}<Text style={styles.boldText}>DOACs preferidos:</Text> Apixaban, Rivaroxaban, Dabigatrana
            </Text>
          </View>

          {/* Cardioversão */}
          <View style={styles.cardioversionCard}>
            <Text style={styles.cardioversionTitle}>⚡ CARDIOVERSÃO</Text>
            <Text style={styles.cardioversionText}>
              A cardioversão pode ser elétrica ou medicamentosa e objetiva a reversão do ritmo de FA em sinusal.
            </Text>
            
            <Text style={styles.cardioversionSubtitle}>Cardioversão Elétrica:</Text>
            <Text style={styles.cardioversionText}>
              <Text style={styles.treatmentBadge}>⚡ Opção inicial recomendada para controle de ritmo</Text>
              {"\n"}• Planejada em pacientes estáveis ou na urgência se instabilidade
              {"\n"}• <Text style={styles.emergencyText}>Instabilidade clínica: fazer IMEDIATAMENTE, independente do risco de embolização</Text>
              {"\n"}• Pré-tratamento com antiarrítmicos pode ajudar na manutenção do ritmo sinusal
            </Text>
            
            <Text style={styles.cardioversionSubtitle}>Cardioversão Farmacológica:</Text>
            <Text style={styles.cardioversionText}>
              <Text style={styles.treatmentBadge}>💊 Alternativa para pacientes hemodinamicamente estáveis</Text>
              {"\n"}• <Text style={styles.boldText}>Amiodarona IV:</Text> Principal opção no Brasil (mais lenta para reversão)
              {"\n"}      • <Text style={styles.boldText}>Dose:</Text> <Text style={styles.doseText}>Ataque: 300mg</Text>
              {"\n"}              <Text style={styles.doseText}>Manutenção: 1200 a 3000mg/dia em BIC</Text>
              {"\n"}              <Text style={styles.doseText}>Tempo para reversão entre 8 a 12h</Text>
              {"\n"}• <Text style={styles.boldText}>Propafenona VO (pill in the pocket):</Text> Sem doença cardíaca estrutural
              {"\n"}      • <Text style={styles.boldText}>Dose:</Text> <Text style={styles.doseText}>450 mg se menos 70 kg / 600 mg se mais de 70 kg</Text>
              {"\n"}              <Text style={styles.doseText}>Tempo para reversão entre 3 a 8 h</Text>
              {"\n"}      • Efeitos propafenona: Hipotensão transitória (25%), flutter, bradicardia, tonturas
              {"\n"}      • Precaução: Primeira cardioversão com propafenona em ambiente monitorizado
              {"\n"}      • Betabloqueante: 30min antes da propafenona para evitar complicações
            </Text>
            
            <Text style={styles.cardioversionSubtitle}>Anticoagulação:</Text>
            <Text style={styles.cardioversionText}>
              <Text style={styles.treatmentBadge}>⚠️ Risco de embolização em FA {'>'} 48h</Text>
              {"\n"}<Text style={styles.boldText}>Estratégia 1:</Text> Anticoagular 3 semanas antes do procedimento
              {"\n"}<Text style={styles.boldText}>Estratégia 2:</Text> ETE pré-cardioversão para verificar trombo
              {"\n"}• Sem trombo: pode cardioverter
              {"\n"}• Com trombo: anticoagular 3-6 semanas e repetir ETE
              {"\n"}<Text style={styles.boldText}>Pós-cardioversão:</Text> Anticoagular 4 semanas (independente do CHA₂DS₂-VASc)
            </Text>
          </View>
          
          {/* Manutenção do Ritmo */}
          <View style={styles.maintenanceCard}>
            <Text style={styles.maintenanceTitle}>🔄 MANUTENÇÃO DO RITMO SINUSAL</Text>
            <Text style={styles.maintenanceText}>
              Após cardioversão: manutenção por ablação ou medicamentos antiarrítmicos.
              {"\n\n"}
              <Text style={styles.boldText}>Amiodarona:</Text>
              {"\n"}• Amplamente disponível, pode usar com doença cardíaca estrutural
              {"\n"}<Text style={styles.treatmentBadge}>❤️ Primeira opção para IC</Text>
              {"\n"}• <Text style={styles.boldText}>Dose:</Text> <Text style={styles.doseText}>Após receber entre 6 a 10g (400 a 800mg/dia em 2 a 4 vezes ao dia, durante 1 a 4 semanas), prosseguir com dose de manutenção de 200mg/dia</Text>
              {"\n"}• <Text style={styles.boldText}>Efeitos colaterais:</Text> Fibrose pulmonar, tireoidopatias (hipo ou hipertireoidismo), hepatotoxicidade, neuropatia periférica, bradicardia sinusal, alterações de pele, torsades de pointes e prolongamento do intervalo QT
              {"\n\n"}
              <Text style={styles.boldText}>Sotalol:</Text>
              {"\n"}• Opção para doença cardíaca estrutural, porém menos eficaz que amiodarona
              {"\n"}• <Text style={styles.boldText}>Dose:</Text> <Text style={styles.doseText}>40 a 80 mg 12/12h por 3 dias. Após 80 a 160mg 12/12h</Text>
              {"\n"}• <Text style={styles.boldText}>Contraindicado:</Text> TFG {'<'}40 mL/min, QT prolongado, hipocalemia, hipomagnesemia, bradicardia
              {"\n\n"}
              <Text style={styles.boldText}>Propafenona:</Text>
              {"\n"}• Sem infarto prévio ou sem doença estrutural cardíaca
              {"\n"}• <Text style={styles.boldText}>Dose:</Text> <Text style={styles.doseText}>150-300mg a cada 8h</Text>
              {"\n"}• <Text style={styles.boldText}>Contraindicado:</Text> Infarto prévio ou doença estrutural cardíaca ou fibrose ventricular
            </Text>
          </View>


          {/* Complicações */}
          <View style={styles.complicationCard}>
            <Text style={styles.complicationTitle}>⚠️ COMPLICAÇÕES</Text>
            <Text style={styles.complicationText}>
              • Tromboembolismo (AVC, embolia pulmonar)
              • Insuficiência cardíaca aguda
              • Síndrome coronariana aguda
              • Taquicardiomiopatia
              • Hipotensão por perda do kick atrial
            </Text>
          </View>

          {/* Critérios de Internação */}
          <View style={styles.admissionCard}>
            <Text style={styles.admissionTitle}>🏥 CRITÉRIOS DE INTERNAÇÃO</Text>
            <Text style={styles.admissionText}>
              • Instabilidade hemodinâmica
              • Insuficiência cardíaca descompensada
              • Resposta ventricular rápida não controlada
              • Complicações tromboembólicas
              • Necessidade de cardioversão
              • Investigação de causa secundária
            </Text>
          </View>

          {/* Seguimento */}
          <View style={styles.followupCard}>
            <Text style={styles.followupTitle}>📋 ALTA E SEGUIMENTO</Text>
            <Text style={styles.followupText}>
              • Controle ambulatorial em 1-2 semanas
              • Cardiologia em 1 mês
              • Ajuste de medicações conforme resposta
              • Monitorização de INR se warfarina
              • Investigação de fatores desencadeantes
              • Orientações sobre estilo de vida
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
  // Card de emergência (vermelho)
  emergencyCard: {
    backgroundColor: '#FFF5F5',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  emergencyTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#DC2626',
    marginBottom: theme.spacing.sm,
  },
  emergencyText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#DC2626',
    lineHeight: 20,
  },
  // Card de classificação (azul)
  classificationCard: {
    backgroundColor: '#EFF6FF',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  classificationTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#2563EB',
    marginBottom: theme.spacing.sm,
  },
  classificationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de estratégia (roxo)
  strategyCard: {
    backgroundColor: '#FAF5FF',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#9333EA',
  },
  strategyTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#9333EA',
    marginBottom: theme.spacing.sm,
  },
  strategyText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de tratamento (laranja)
  treatmentCard: {
    backgroundColor: '#FFF7ED',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#EA580C',
  },
  treatmentTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#EA580C',
    marginBottom: theme.spacing.sm,
  },
  treatmentSubtitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#EA580C',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  treatmentText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de medicamentos (verde)
  medicationCard: {
    backgroundColor: '#F0FDF4',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#16A34A',
  },
  medicationTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#16A34A',
    marginBottom: theme.spacing.sm,
  },
  medicationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de anticoagulação (roxo)
  anticoagulationCard: {
    backgroundColor: '#FAF5FF',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#9333EA',
  },
  anticoagulationTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#9333EA',
    marginBottom: theme.spacing.sm,
  },
  anticoagulationSubtitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#9333EA',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  anticoagulationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de cardioversão (amarelo)
  cardioversionCard: {
    backgroundColor: '#FEFCE8',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#CA8A04',
  },
  cardioversionTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#CA8A04',
    marginBottom: theme.spacing.sm,
  },
  cardioversionSubtitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#CA8A04',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  cardioversionText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de manutenção (azul claro)
  maintenanceCard: {
    backgroundColor: '#F0F9FF',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#0EA5E9',
  },
  maintenanceTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#0EA5E9',
    marginBottom: theme.spacing.sm,
  },
  maintenanceText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de complicações (vermelho escuro)
  complicationCard: {
    backgroundColor: '#FEF2F2',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#B91C1C',
  },
  complicationTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#B91C1C',
    marginBottom: theme.spacing.sm,
  },
  complicationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de internação (cinza)
  admissionCard: {
    backgroundColor: '#F9FAFB',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#6B7280',
  },
  admissionTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#6B7280',
    marginBottom: theme.spacing.sm,
  },
  admissionText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Card de seguimento (verde escuro)
  followupCard: {
    backgroundColor: '#ECFDF5',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#059669',
  },
  followupTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#059669',
    marginBottom: theme.spacing.sm,
  },
  followupText: {
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
    fontFamily: 'Roboto-Medium',
    color: '#16A34A',
    fontSize: theme.fontSize.sm,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#16A34A',
  },
  // Texto de dose (azul)
  doseText: {
    fontFamily: 'Roboto-Medium',
    color: '#2563EB',
    fontSize: theme.fontSize.sm,
  },
});

