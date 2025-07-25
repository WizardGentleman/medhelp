import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Heart, Zap, Pill, AlertTriangle } from 'lucide-react-native';

export default function CardioversionScreen() {
  const [peso, setPeso] = useState(0);
  
  const calculateFentanilDose = () => {
    if (!peso) return '-';
    const min = (peso * 0.02).toFixed(1);
    const max = (peso * 0.04).toFixed(1);
    return `${min} a ${max} ml`;
  };

  const calculateEtomidateDose = () => {
    if (!peso) return '-';
    const min = (peso * 0.1).toFixed(1);
    const max = (peso * 0.15).toFixed(1);
    return `${min} a ${max} ml`;
  };

  const calculateMidazolamDose = () => {
    if (!peso) return '-';
    const min = (peso * 0.01).toFixed(1);
    const max = (peso * 0.02).toFixed(1);
    return `${min} a ${max} ml`;
  };

  const calculatePropofol10Dose = () => {
    if (!peso) return '-';
    const min = (peso * 0.05).toFixed(1);
    const max = (peso * 0.1).toFixed(1);
    return `${min} a ${max} ml`;
  };

  const calculatePropofol20Dose = () => {
    if (!peso) return '-';
    const min = (peso * 0.025).toFixed(1);
    const max = (peso * 0.05).toFixed(1);
    return `${min} a ${max} ml`;
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Cardioversão" type="emergency" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Card de Introdução */}
          <View style={styles.introCard}>
            <View style={styles.introHeader}>
              <Heart size={24} color={theme.colors.emergency} />
              <Text style={styles.introTitle}>Protocolo de Cardioversão</Text>
            </View>
            <Text style={styles.introText}>
              Procedimento para restaurar o ritmo cardíaco normal em pacientes com arritmias
              instáveis ou mal toleradas hemodinamicamente.
            </Text>
          </View>

          {/* Indicações */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Indicações para Cardioversão</Text>
            <View style={styles.indicationsList}>
              <Text style={styles.indicationItem}>• Fibrilação Atrial com instabilidade hemodinâmica</Text>
              <Text style={styles.indicationItem}>• Flutter Atrial sintomático</Text>
              <Text style={styles.indicationItem}>• Taquicardia Supraventricular refratária</Text>
              <Text style={styles.indicationItem}>• Taquicardia Ventricular com pulso</Text>
              <Text style={styles.indicationItem}>• Torsades de Pointes recorrente</Text>
            </View>
          </View>

          {/* Cardioversão Química */}
          <View style={styles.protocolCard}>
            <View style={styles.protocolHeader}>
              <Pill size={20} color='white' />
              <Text style={styles.protocolHeaderText}>CARDIOVERSÃO QUÍMICA</Text>
            </View>
            <View style={styles.protocolContent}>
              <Text style={styles.subsectionTitle}>Indicações Específicas:</Text>
              <Text style={styles.protocolText}>
                • TSV paroxística estável
                {'\n'}• FA/Flutter menor que 48h em paciente estável
                {'\n'}• Primeira linha para ritmos supraventriculares
              </Text>

              <Text style={styles.subsectionTitle}>Medicações:</Text>
              <View style={styles.medicationCard}>
                <Text style={styles.medicationName}>ADENOSINA</Text>
                <Text style={styles.medicationDose}>• 1ª dose: 6 mg IV rápido</Text>
                <Text style={styles.medicationDose}>• 2ª dose: 12 mg IV (se necessário)</Text>
                <Text style={styles.medicationDose}>• 3ª dose: 18 mg IV (se necessário)</Text>
                <Text style={styles.medicationNote}>Via central: reduzir dose pela metade</Text>
              </View>

              <View style={styles.medicationCard}>
                <Text style={styles.medicationName}>VERAPAMIL</Text>
                <Text style={styles.medicationDose}>• 5-10 mg IV lento (2-3 min)</Text>
                <Text style={styles.medicationDose}>• Repetir após 15-30 min se necessário</Text>
                <Text style={styles.medicationNote}>Contraindicado: IC, BAV, hipotensão</Text>
              </View>

              <View style={styles.medicationCard}>
                <Text style={styles.medicationName}>AMIODARONA</Text>
                <Text style={styles.medicationNote}>Para FA/Flutter ou TV estável</Text>
                
                <Text style={styles.subsectionTitle}>ESQUEMA CLÁSSICO:</Text>
                <Text style={styles.medicationDoseSpaced}>• Ataque: 150-300 mg em SG5% 100ml em 15 minutos</Text>
                <Text style={styles.medicationDoseSpaced}>• Pode repetir a cada 15 minutos</Text>
                <Text style={styles.medicationDoseSpaced}>• Manutenção: 6 ampolas (18ml) + 462ml SG5%</Text>
                <Text style={styles.medicationDoseSpaced}>  - BIC 32ml/h por 6h, depois 16ml/h por 18h</Text>
                <Text style={styles.medicationDoseSpaced}>• Manutenção concentrada: 6 ampolas (18ml) + 232ml SG5%</Text>
                <Text style={styles.medicationDoseSpaced}>  - BIC 16,6ml/h por 6h, depois 8,3ml/h por 18h</Text>
                <Text style={styles.medicationDoseSpaced}>• Após 24h: Amiodarona VO 400-1200 mg/dia (2-3x)</Text>
                <Text style={styles.medicationDoseSpaced}>• Até dose cumulativa de 6-10g, depois 200-400 mg/dia</Text>
                <Text style={styles.medicationNote}>Dose máxima diária: 2,2g</Text>
                
                <Text style={styles.subsectionTitle}>ESQUEMA NÃO CLÁSSICO (+ eficaz - pois não sobrecarrega a enfermagem):</Text>
                <Text style={styles.medicationDoseSpaced}>• ATAQUE: 2 amp (150mg/3ml) + SG5% 250ml</Text>
                <Text style={styles.medicationDoseSpaced}>  - Correr a 256ml/h (conc = 1,2 mg/ml)</Text>
                <Text style={styles.medicationDoseSpaced}>  - Permite CVP (periférico)</Text>
                <Text style={styles.medicationDoseSpaced}>• MANUTENÇÃO: 6 amp (150mg/3ml) + SG5% 500ml</Text>
                <Text style={styles.medicationDoseSpaced}>  - Correr a 21,5ml/h por 24h (conc = 0,6 mg/ml)</Text>
                <Text style={styles.medicationDoseSpaced}>  - Permite CVP (periférico)</Text>
              </View>

            </View>
          </View>

          {/* Cardioversão Elétrica */}
          <View style={styles.protocolCard}>
            <View style={styles.protocolHeader}>
              <Zap size={20} color='white' />
              <Text style={styles.protocolHeaderText}>CARDIOVERSÃO ELÉTRICA</Text>
            </View>
            <View style={styles.protocolContent}>
              <Text style={styles.subsectionTitle}>Indicações Específicas:</Text>
              <Text style={styles.protocolText}>
                • Taquiarritmia (>150 bpm) com instabilidade hemodinâmica e presença de pulso central
                {'\n'}• Exemplos: Fluter/ Fa atrial, taquicardia supraventricular paroxísitca, taquicardia ventricular
                {'\n'}• Instabilidade hemôdinamica: Dor torácica, Dispneia, Diminuição do nível de consciência, Desmaio (ou pré-síncope) e Diminuição da pressão arterial.
                {'\n'}• Eletiva: Falha da cardioversão química
              </Text>

              <Text style={styles.subsectionTitle}>Preparação:</Text>
              <View style={styles.preparationCard}>
                <Text style={styles.preparationItem}>✓ Jejum mínimo 4-6 horas (eletiva)</Text>
                <Text style={styles.preparationItem}>✓ Consentimento informado</Text>
                <Text style={styles.preparationItem}>✓ ECG de 12 derivações</Text>
                <Text style={styles.preparationItem}>✓ Acesso venoso calibroso</Text>
                <Text style={styles.preparationItem}>✓ Monitorização completa</Text>
                <Text style={styles.preparationItem}>✓ Material de ressuscitação</Text>
              </View>

              <Text style={styles.subsectionTitle}>Peso do Paciente (kg):</Text>
              <View style={styles.medicationCard}>
                <TextInput
                  style={styles.inputWeight}
                  placeholder="Digite o peso do paciente"
                  keyboardType="numeric"
                  onChangeText={text => setPeso(parseFloat(text) || 0)}
                />
              </View>

              <Text style={styles.subsectionTitle}>Analgesia:</Text>
              <View style={styles.medicationCard}>
                <Text style={styles.medicationName}>Fentanil (50 mcg/ml)</Text>
                <Text style={styles.medicationDose}>• Dosagem: {calculateFentanilDose()}</Text>
              </View>

              <Text style={styles.subsectionTitle}>Sedação:</Text>
              <View style={styles.medicationCard}>
                <Text style={styles.medicationName}>Etomidato (2mg/ml)</Text>
                <Text style={styles.medicationDose}>• Dosagem: {calculateEtomidateDose()}</Text>
                <Text style={styles.medicationNote}>Indicado: Hipotensos / instabilidade hemodinâmica / PA limítrofe</Text>
                <Text style={styles.medicationNote}>Realizar após 2 minutos do fentanil</Text>
                <Text style={styles.medicationNote}>Etomidato é o hipnótico mais cardioestável</Text>
              </View>

              <View style={styles.medicationCard}>
                <Text style={styles.medicationName}>Midazolam (5mg/ml)</Text>
                <Text style={styles.medicationDose}>• Dosagem: {calculateMidazolamDose()}</Text>
              </View>

              <View style={styles.medicationCard}>
                <Text style={styles.medicationName}>Propofol (10mg/ml ou 20 mg/ml)</Text>
                <Text style={styles.medicationDose}>• Dosagem (10mg/ml): {calculatePropofol10Dose()}</Text>
                <Text style={styles.medicationDose}>• Dosagem (20mg/ml): {calculatePropofol20Dose()}</Text>
                <Text style={styles.medicationNote}>Indicado para normotenso ou hipertenso</Text>
                <Text style={styles.medicationNote}>Evitar em pacientes hipotensos ou com cardiopatia estrutural / Não deve ser utilizado em pacientes com fração de ejeção do ventrículo esquerdo reduzida.</Text>
              </View>

              <Text style={styles.subsectionTitle}>DURANTE A DESFIBRILAÇÃO:</Text>
              <View style={styles.preparationCard}>
                <Text style={styles.preparationItem}>Minimize o risco de incêndio, retirando máscara ou cânula nasal de oxigênio da face do paciente, colocando-as a pelo menos 1 metro de distância do tórax</Text>
                <Text style={styles.preparationItem}>Preparo adequado dos eletrodos, com total adesão deles à parede torácica (pás ou eletrodos auto-adesivos).</Text>
                <Text style={styles.preparationItem}>Os pelos do peito devem ser aparados e a utilização de produtos a base de álcool deve ser evitada durante o preparo da pele</Text>
              </View>

              <Text style={styles.subsectionTitle}>Energia:</Text>
              <View style={styles.energyCard}>
                <Text style={styles.energyTitle}>Fibrilação Atrial:</Text>
                <Text style={styles.energyValue}>• Inicial: 120-200 J (bifásico)</Text>
                <Text style={styles.energyValue}>• Progressão: 200-300-360 J</Text>
                <Text style={styles.energyValue}>• Inicial: 100 - 360 J (monofásico)</Text>
              </View>

              <View style={styles.energyCard}>
                <Text style={styles.energyTitle}>Flutter Atrial:</Text>
                <Text style={styles.energyValue}>• Inicial: 50-100 J (bifásico)</Text>
                <Text style={styles.energyValue}>• Progressão: 150-200 J</Text>
                <Text style={styles.energyValue}>• Inicial: 100 - 360 J (monofásico)</Text>
              </View>

              <View style={styles.energyCard}>
                <Text style={styles.energyTitle}>Taquicardia Supraventricular (TSV)/Taquicardia Ventricular:</Text>
                <Text style={styles.energyValue}>• Inicial: 100-200 J (bifásico)</Text>
                <Text style={styles.energyValue}>• Progressão: 150-200 J</Text>
                <Text style={styles.energyValue}>• Inicial: 100 J (monofásico)</Text>
              </View>

              <View style={styles.maxDoseCard}>
                <Text style={styles.maxDoseTitle}>Dose máxima de carga:</Text>
                <Text style={styles.maxDoseValue}>• Bifásico: 200 J</Text>
                <Text style={styles.maxDoseValue}>• Monofásico: 360 J</Text>
              </View>

              <Text style={styles.subsectionTitle}>Posicionamento das Pás:</Text>
              <Text style={styles.protocolText}>
                • Anterolateral (preferida): Ápex + subclavicular direita
                {'\n'}• Anteroposterior: Precórdio + infraescapular esquerda
                {'\n'}• Gel condutor abundante
              </Text>
            </View>
          </View>

          {/* Contraindicações */}
          <View style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <AlertTriangle size={20} color='white' />
              <Text style={styles.warningHeaderText}>CONTRAINDICAÇÕES</Text>
            </View>
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Contraindicações Absolutas:</Text>
              <Text style={styles.warningText}>
                • Intoxicação digitálica
                {'\n'}• Hipocalemia grave não corrigida
                {'\n'}• FA crônica bem tolerada
              </Text>

              <Text style={styles.warningTitle}>Contraindicações Relativas:</Text>
              <Text style={styles.warningText}>
                • FA maior que 48h sem anticoagulação
                {'\n'}• Marca-passo próximo às pás
                {'\n'}• Gravidez (relativa)
              </Text>
            </View>
          </View>

          {/* Cuidados Pós-Procedimento */}
          <View style={styles.postCareCard}>
            <Text style={styles.sectionTitle}>Cuidados Pós-Cardioversão</Text>
            <View style={styles.postCareList}>
              <Text style={styles.postCareItem}>• Monitorização contínua por 4-6 horas</Text>
              <Text style={styles.postCareItem}>• ECG seriados</Text>
              <Text style={styles.postCareItem}>• Verificar sinais vitais frequentemente</Text>
              <Text style={styles.postCareItem}>• Observar sinais de tromboembolismo</Text>
              <Text style={styles.postCareItem}>• Manter anticoagulação conforme indicação</Text>
              <Text style={styles.postCareItem}>• Investigar causas reversíveis</Text>
            </View>
          </View>

          {/* Complicações */}
          <View style={styles.complicationsCard}>
            <Text style={styles.sectionTitle}>Possíveis Complicações</Text>
            <View style={styles.complicationsList}>
              <Text style={styles.complicationItem}>• Tromboembolismo (1-2%)</Text>
              <Text style={styles.complicationItem}>• Arritmias pós-cardioversão</Text>
              <Text style={styles.complicationItem}>• Edema pulmonar</Text>
              <Text style={styles.complicationItem}>• Queimaduras cutâneas</Text>
              <Text style={styles.complicationItem}>• Depressão respiratória (sedação)</Text>
              <Text style={styles.complicationItem}>• Aspiração</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  inputWeight: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  medicationDoseSpaced: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  maxDoseCard: {
    backgroundColor: '#E8F5E8',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  maxDoseTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    marginBottom: theme.spacing.xs,
  },
  maxDoseValue: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
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
  introCard: {
    backgroundColor: '#FFF5F5',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.emergency,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  introTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
    marginLeft: theme.spacing.sm,
  },
  introText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: '#FFF5F5',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.emergency,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
    marginBottom: theme.spacing.md,
  },
  indicationsList: {
    gap: theme.spacing.xs,
  },
  indicationItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  protocolCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.emergency,
    overflow: 'hidden',
  },
  protocolHeader: {
    backgroundColor: theme.colors.emergency,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  protocolHeaderText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  protocolContent: {
    padding: theme.spacing.lg,
  },
  subsectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  protocolText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  medicationCard: {
    backgroundColor: '#F0F4FF',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  medicationName: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.xs,
  },
  medicationDose: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  medicationNote: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  preparationCard: {
    backgroundColor: '#F0FFF4',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  preparationItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  energyCard: {
    backgroundColor: '#FFF3E0',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  energyTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF9800',
    marginBottom: theme.spacing.xs,
  },
  energyValue: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  warningCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#FF9800',
    overflow: 'hidden',
  },
  warningHeader: {
    backgroundColor: '#FF9800',
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  warningHeaderText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  warningContent: {
    padding: theme.spacing.lg,
  },
  warningTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  warningText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  postCareCard: {
    backgroundColor: '#F0FFF4',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  postCareList: {
    gap: theme.spacing.xs,
  },
  postCareItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  complicationsCard: {
    backgroundColor: '#FFEBEE',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  complicationsList: {
    gap: theme.spacing.xs,
  },
  complicationItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
});
