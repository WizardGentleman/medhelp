import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Activity, Heart, TriangleAlert as AlertTriangle, Info, CircleCheck as CheckCircle, Circle as XCircle, ChevronDown, ChevronUp } from 'lucide-react-native';

interface CapriniFactors {
  // 1 point
  age41to60: boolean;
  minorSurgery: boolean;
  obesity: boolean;
  inflammatoryBowelDisease: boolean;
  legEdema: boolean;
  varicoseVeins: boolean;
  hormoneTherapy: boolean;
  sepsis: boolean;
  seriousLungDisease: boolean;
  currentlyBedridden: boolean;
  copd: boolean;
  myocardialInfarction: boolean;
  unexplainedFetal: boolean;
  heartFailureDecompensation: boolean;
  limbImmobilization: boolean;
  pregnancyPostpartum: boolean;
  recentMajorSurgery: boolean;

  // 2 points
  age61to74: boolean;
  majorSurgery: boolean;
  cancer: boolean;
  bedRest72h: boolean;
  centralVenousAccess: boolean;

  // 3 points
  age75plus: boolean;
  personalVTEHistory: boolean;
  familyVTEHistory: boolean;
  factorVLeiden: boolean;
  prothrombin20210A: boolean;
  elevatedHomocysteine: boolean;
  lupusAnticoagulant: boolean;
  anticardiolipinAntibodies: boolean;
  heparinInducedThrombocytopenia: boolean;
  otherThrombophilia: boolean;

  // 5 points
  stroke: boolean;
  electiveMajorArthroplasty: boolean;
  hipPelvisLegFracture: boolean;
  multipleTrauma: boolean;
  acuteSpinalCordInjury: boolean;
}

interface RiskAssessment {
  score: number;
  riskLevel: 'very_low' | 'low' | 'moderate' | 'high';
  riskPercentage: string;
  recommendation: string;
  prophylaxisRecommended: boolean;
  considerations: string[];
}

const initialFactors: CapriniFactors = {
  age41to60: false,
  minorSurgery: false,
  obesity: false,
  inflammatoryBowelDisease: false,
  legEdema: false,
  varicoseVeins: false,
  hormoneTherapy: false,
  sepsis: false,
  seriousLungDisease: false,
  currentlyBedridden: false,
  copd: false,
  myocardialInfarction: false,
  unexplainedFetal: false,
  heartFailureDecompensation: false,
  limbImmobilization: false,
  pregnancyPostpartum: false,
  recentMajorSurgery: false,
  age61to74: false,
  majorSurgery: false,
  cancer: false,
  bedRest72h: false,
  centralVenousAccess: false,
  age75plus: false,
  personalVTEHistory: false,
  familyVTEHistory: false,
  factorVLeiden: false,
  prothrombin20210A: false,
  elevatedHomocysteine: false,
  lupusAnticoagulant: false,
  anticardiolipinAntibodies: false,
  heparinInducedThrombocytopenia: false,
  otherThrombophilia: false,
  stroke: false,
  electiveMajorArthroplasty: false,
  hipPelvisLegFracture: false,
  multipleTrauma: false,
  acuteSpinalCordInjury: false,
};

export default function CapriniRiskScreen() {
  const [factors, setFactors] = useState<CapriniFactors>(initialFactors);
  const [isReferenceExpanded, setIsReferenceExpanded] = useState(false);

  const calculateScore = (): number => {
    let score = 0;
    
    if (factors.age41to60) score += 1;
    if (factors.minorSurgery) score += 1;
    if (factors.obesity) score += 1;
    if (factors.inflammatoryBowelDisease) score += 1;
    if (factors.legEdema) score += 1;
    if (factors.varicoseVeins) score += 1;
    if (factors.hormoneTherapy) score += 1;
    if (factors.sepsis) score += 1;
    if (factors.seriousLungDisease) score += 1;
    if (factors.currentlyBedridden) score += 1;
    if (factors.copd) score += 1;
    if (factors.myocardialInfarction) score += 1;
    if (factors.unexplainedFetal) score += 1;
    if (factors.heartFailureDecompensation) score += 1;
    if (factors.pregnancyPostpartum) score += 1;
    if (factors.recentMajorSurgery) score += 1;

    if (factors.age61to74) score += 2;
    if (factors.majorSurgery) score += 2;
    if (factors.cancer) score += 2;
    if (factors.bedRest72h) score += 2;
    if (factors.centralVenousAccess) score += 2;
    if (factors.limbImmobilization) score += 2;

    if (factors.age75plus) score += 3;
    if (factors.personalVTEHistory) score += 3;
    if (factors.familyVTEHistory) score += 3;
    if (factors.factorVLeiden) score += 3;
    if (factors.prothrombin20210A) score += 3;
    if (factors.elevatedHomocysteine) score += 3;
    if (factors.lupusAnticoagulant) score += 3;
    if (factors.anticardiolipinAntibodies) score += 3;
    if (factors.heparinInducedThrombocytopenia) score += 3;
    if (factors.otherThrombophilia) score += 3;
    
    if (factors.stroke) score += 5;
    if (factors.electiveMajorArthroplasty) score += 5;
    if (factors.hipPelvisLegFracture) score += 5;
    if (factors.multipleTrauma) score += 5;
    if (factors.acuteSpinalCordInjury) score += 5;
    
    return score;
  };

  const getRiskAssessment = (score: number): RiskAssessment => {
    if (score <= 1) {
      return {
        score,
        riskLevel: 'very_low',
        riskPercentage: '~0.5%',
        recommendation: 'Profilaxia farmacológica NÃO recomendada',
        prophylaxisRecommended: false,
        considerations: ['Risco muito baixo de TEV', 'Considerar deambulação precoce.'],
      };
    } else if (score === 2) {
      return {
        score,
        riskLevel: 'low',
        riskPercentage: '1.5-2.0%',
        recommendation: 'Profilaxia mecânica RECOMENDADA',
        prophylaxisRecommended: true,
        considerations: ['Baixo risco de TEV', 'Recomendado uso de compressão pneumática intermitente (CPI) ou meias de compressão graduada (MCG).'],
      };
    } else if (score >= 3 && score <= 4) {
      return {
        score,
        riskLevel: 'moderate',
        riskPercentage: '3.0-4.0%',
        recommendation: 'Profilaxia farmacológica RECOMENDADA',
        prophylaxisRecommended: true,
        considerations: ['Risco moderado de TEV', 'Iniciar HBPM ou HNF em doses profiláticas.', 'Considerar CPI ou MCG se houver contraindicação à farmacológica.'],
      };
    } else { // score >= 5
      return {
        score,
        riskLevel: 'high',
        riskPercentage: '≥5.0%',
        recommendation: 'Profilaxia farmacológica e/ou mecânica RECOMENDADA',
        prophylaxisRecommended: true,
        considerations: ['Alto risco de TEV', 'Recomenda-se HBPM ou HNF.', 'Associar profilaxia mecânica (CPI ou MCG).', 'Avaliar contraindicações para anticoagulação e risco de sangramento.'],
      };
    }
  };

  const toggleFactor = (factor: keyof CapriniFactors) => {
    setFactors(prev => ({
      ...prev,
      [factor]: !prev[factor]
    }));
  };

  const resetCalculator = () => {
    setFactors(initialFactors);
  };

  const score = calculateScore();
  const riskAssessment = getRiskAssessment(score);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very_low':
        return '#4CAF50'; // Verde
      case 'low':
        return '#FFC107'; // Ambar
      case 'moderate':
        return '#FF9800'; // Laranja
      case 'high':
        return '#F44336'; // Vermelho
      default:
        return '#4CAF50';
    }
  };
  
  const getRiskLevelText = (riskLevel: string) => {
    const levels = {
        very_low: 'Muito Baixo',
        low: 'Baixo',
        moderate: 'Moderado',
        high: 'Alto'
    };
    return levels[riskLevel] || 'N/A';
  }

  const factorCategories = [
    {
      title: 'IDADE',
      items: [
        { key: 'age41to60' as keyof CapriniFactors, title: 'Idade 41-60 anos', points: 1 },
        { key: 'age61to74' as keyof CapriniFactors, title: 'Idade 61-74 anos', points: 2 },
        { key: 'age75plus' as keyof CapriniFactors, title: 'Idade ≥75 anos', points: 3 },
      ]
    },
    {
      title: 'CIRURGIA',
      items: [
        { key: 'minorSurgery' as keyof CapriniFactors, title: 'Cirurgia de pequeno porte', description: 'Duração da anestesia 3 a 45 minutos', points: 1 },
        { key: 'majorSurgery' as keyof CapriniFactors, title: 'Cirurgia de grande porte (>45 min)', description: 'Se tempo sob anestesia (geral ou regional) for maior que 45 minutos\nOBS: Se paciente reoperar durante a mesma internação hospitalar, e que ultrapasse 45 minutos de anestesia, essa cirurgia também adicionará 2 pontos ao escore', points: 2 },
        { key: 'electiveMajorArthroplasty' as keyof CapriniFactors, title: 'Artroplastia eletiva de quadril ou joelho', description: 'Inserção de prótese de quadril ou de joelho', points: 5 },
      ]
    },
    {
      title: 'HISTÓRICO DE TEV',
      items: [
        { key: 'personalVTEHistory' as keyof CapriniFactors, title: 'História pessoal de TEV', description: 'História atual ou prévia de TVP ou TEP', points: 3 },
        { key: 'familyVTEHistory' as keyof CapriniFactors, title: 'História familiar de TEV', description: 'Histórico de TVP ou TEP', points: 3 },
      ]
    },
    {
      title: 'CONDIÇÕES CLÍNICAS',
      items: [
        { key: 'cancer' as keyof CapriniFactors, title: 'Câncer (ativo ou prévio)', description: 'Exceto carcinoma basocelular', points: 2 },
        { key: 'stroke' as keyof CapriniFactors, title: 'AVC (< 1 mês)', points: 5 },
        { key: 'sepsis' as keyof CapriniFactors, title: 'Sepse (< 1 mês)', points: 1 },
        { key: 'seriousLungDisease' as keyof CapriniFactors, title: 'Doença pulmonar grave, incl. pneumonia (< 1 mês)', points: 1 },
        { key: 'inflammatoryBowelDisease' as keyof CapriniFactors, title: 'História de doença inflamatória intestinal', description: 'Ex: Doença de Crohn ou Colite Ulcerativa', points: 1 },
        { key: 'copd' as keyof CapriniFactors, title: 'Doença pulmonar obstrutiva', description: 'DPOC / Enfisema pulmonar', points: 1 },
        { key: 'myocardialInfarction' as keyof CapriniFactors, title: 'IAM (< 1 mês)', points: 1 },
        { key: 'heartFailureDecompensation' as keyof CapriniFactors, title: 'Descompensação de insuficiência cardíaca (<1 mês)', points: 1 },
      ]
    },
    {
      title: 'MOBILIDADE E INTERNAÇÃO',
      items: [
        { key: 'currentlyBedridden' as keyof CapriniFactors, title: 'Mobilidade reduzida (não deambula fora do quarto)', description: 'Idas ao banheiro ou pequenas caminhadas dentro do quarto não contam como deambulação para este critério. È necessário andar 10 metros de forma contínua', points: 1 },
        { key: 'bedRest72h' as keyof CapriniFactors, title: 'Restrição no leito por mais de 3 dias', points: 2 },
        { key: 'centralVenousAccess' as keyof CapriniFactors, title: 'Acesso venoso central (< 1 mês)', points: 2 },
      ]
    },
    {
      title: 'TRAUMA E FRATURAS',
      items: [
        { key: 'hipPelvisLegFracture' as keyof CapriniFactors, title: 'Fratura de quadril, pelve ou perna (< 1 mês)', points: 5 },
        { key: 'multipleTrauma' as keyof CapriniFactors, title: 'Politraumatismo (< 1 mês)', points: 5 },
        { key: 'acuteSpinalCordInjury' as keyof CapriniFactors, title: 'Lesão medular aguda com paralisia (< 1 mês)', points: 5 },
      ]
    },
    {
      title: 'TROMBOFILIAS',
      items: [
        { key: 'factorVLeiden' as keyof CapriniFactors, title: 'Fator V de Leiden positivo', points: 3 },
        { key: 'prothrombin20210A' as keyof CapriniFactors, title: 'Protrombina 2021OA positiva', points: 3 },
        { key: 'elevatedHomocysteine' as keyof CapriniFactors, title: 'Homocisteína sérica elevada', points: 3 },
        { key: 'lupusAnticoagulant' as keyof CapriniFactors, title: 'Anticoagulante lúpico positivo', points: 3 },
        { key: 'anticardiolipinAntibodies' as keyof CapriniFactors, title: 'Anticorpos anticardiolipina elevados', points: 3 },
        { key: 'heparinInducedThrombocytopenia' as keyof CapriniFactors, title: 'Trombocitopenia Induzida por Heparina (TIH)', points: 3 },
        { key: 'otherThrombophilia' as keyof CapriniFactors, title: 'Outra trombofilia congênita ou adquirida', points: 3 },
        { key: 'unexplainedFetal' as keyof CapriniFactors, title: 'História inexplicada de natimorto, abortos de repetição (>3), prematuridade com toxemia ou desenvolvimento restrito?', points: 1 },
      ]
    },
    {
      title: 'OUTROS FATORES',
      items: [
        { key: 'obesity' as keyof CapriniFactors, title: 'Sobrepeso / Obesidade (IMC > 25 kg/m²)', points: 1 },
        { key: 'legEdema' as keyof CapriniFactors, title: 'Edema de membros inferiores atual', points: 1 },
        { key: 'varicoseVeins' as keyof CapriniFactors, title: 'Varizes visíveis em membros inferiores', points: 1 },
        { key: 'hormoneTherapy' as keyof CapriniFactors, title: 'Uso de contraceptivos hormonais ou TRH', points: 1 },
        { key: 'pregnancyPostpartum' as keyof CapriniFactors, title: 'Gravidez ou pós-parto (<1 mês)', points: 1 },
        { key: 'recentMajorSurgery' as keyof CapriniFactors, title: 'Cirurgia de grande porte (> 45 minutos) (< 1 mês)', points: 1 },
        { key: 'limbImmobilization' as keyof CapriniFactors, title: 'Imobilização do membro (<1 mês)', description: 'Com Gesso ou tala', points: 2 },
      ]
    },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Caprini - Risco de TEV" type="score" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Activity size={20} color={theme.colors.success} /> Sobre o Escore de Caprini
            </Text>
            <Text style={styles.infoText}>
              O Escore de Caprini é uma ferramenta de avaliação de risco para tromboembolismo venoso (TEV) em pacientes <Text style={{fontWeight: 'bold'}}>cirúrgicos</Text>. Ele soma pontos com base em fatores de risco individuais.
              O escore final estratifica os pacientes em categorias de risco, orientando a necessidade e o tipo de profilaxia.
              Esta ferramenta deve ser usada como um guia, e não substitui o julgamento clínico.
            </Text>
          </View>

          <Text style={styles.instructionText}>
            Selecione os fatores de risco presentes no paciente:
          </Text>

              <View style={styles.factorsContainer}>
                {factorCategories.map((category, categoryIndex) => (
                  <View key={categoryIndex}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    {category.items.map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.factorCard,
                          factors[item.key] && styles.factorCardSelected
                        ]}
                        onPress={() => toggleFactor(item.key)}
                      >
                        <View style={styles.factorHeader}>
                          <View style={[
                            styles.factorLabel,
                            factors[item.key] && styles.factorLabelSelected
                          ]}>
                            <Text style={[
                              styles.factorLabelText,
                              factors[item.key] && styles.factorLabelTextSelected
                            ]}>
                              {item.points} pt{item.points > 1 ? 's' : ''}
                            </Text>
                          </View>
                          <View style={styles.factorCheckbox}>
                            {factors[item.key] ? (
                              <CheckCircle size={24} color={theme.colors.success} />
                            ) : (
                              <XCircle size={24} color={theme.colors.border} />
                            )}
                          </View>
                        </View>
                        <Text style={styles.factorTitle}>{item.title}</Text>
                        {item.description ? <Text style={styles.factorDescription}>{item.description}</Text> : null}
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>

            <View style={styles.resultContainer}>
              <View style={[
                styles.scoreResultCard,
                { borderColor: getRiskColor(riskAssessment.riskLevel) }
              ]}>
                <View style={[
                  styles.scoreResultHeader,
                  { backgroundColor: getRiskColor(riskAssessment.riskLevel) }
                ]}>
                  <Text style={styles.scoreResultNumber}>
                    Escore de Caprini: {riskAssessment.score}
                  </Text>
                </View>
                <View style={styles.scoreResultContent}>
                  <Text style={styles.riskLevelText}>
                    Risco: <Text style={[
                      styles.riskLevelValue,
                      { color: getRiskColor(riskAssessment.riskLevel) }
                    ]}>
                      {getRiskLevelText(riskAssessment.riskLevel)}
                    </Text>
                  </Text>
                  <Text style={styles.riskPercentageText}>
                    Incidência de TEV sem profilaxia: <Text style={styles.riskPercentageValue}>
                      {riskAssessment.riskPercentage}
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={[
                styles.recommendationCard,
                { borderColor: riskAssessment.prophylaxisRecommended ? theme.colors.emergency : theme.colors.success }
              ]}>
                <Text style={styles.recommendationTitle}>
                  <Heart size={20} color={riskAssessment.prophylaxisRecommended ? theme.colors.emergency : theme.colors.success} />
                  {' '}Recomendação de Profilaxia
                </Text>
                <Text style={styles.recommendationText}>
                  {riskAssessment.recommendation}
                </Text>
                {riskAssessment.prophylaxisRecommended && (
                  <View>
                    <View style={styles.prophylaxisInfo}>
                      <Text style={styles.prophylaxisTitle}>Opções de Profilaxia Farmacológica:</Text>
                      <Text style={styles.prophylaxisOption}>• Enoxaparina 40mg SC 1x/dia (preferencial)</Text>
                      <Text style={styles.prophylaxisOption}>• Heparina não fracionada 5000 UI SC 8/8h ou 12/12h</Text>
                      <Text style={styles.prophylaxisOption}>• Fondaparinux 2,5mg SC 1x/dia (se HIT prévia)</Text>
                      <Text style={[styles.prophylaxisOption, {marginTop: theme.spacing.sm, fontWeight: 'bold'}]}>Suspender 12 horas antes do procedimento cirúrgico proposto</Text>
                    </View>

                    <View style={styles.renalAdjustmentCard}>
                      <Text style={styles.renalAdjustmentTitle}>Correção de dose na insuficiência renal (TFG &lt; 30 mL/min.):</Text>
                      <Text style={styles.renalAdjustmentOption}>• Enoxaparina 20 mg SC 1x/dia</Text>
                      <Text style={styles.renalAdjustmentOption}>• HNF 5.000 UI SC 8/8h ou 12/12h (ajustar dose de acordo com TTPA)</Text>
                    </View>

                    <View style={styles.specialSituationsCard}>
                      <Text style={[styles.specialSituationsTitle, {fontSize: theme.fontSize.md}]}>Situações especiais:</Text>
                      
                      <Text style={[styles.specialSituationsSubtitle, {fontSize: theme.fontSize.md}]}>1) Ajuste individual:</Text>
                      <Text style={styles.specialSituationsOption}>• Idade &gt; 80 anos</Text>
                      <Text style={styles.specialSituationsOption}>• Sarcopenia</Text>
                      <Text style={styles.specialSituationsOption}>• Peso &lt; 50 kg</Text>
                      <Text style={[styles.specialSituationsOption, {fontWeight: 'bold'}]}>→ Enoxaparina 20 mg SC 1x/dia</Text>
                      
                      <Text style={[styles.specialSituationsOption, {marginTop: theme.spacing.md}]}>• IMC &gt; 40 kg/m²</Text>
                      <Text style={[styles.specialSituationsOption, {fontWeight: 'bold'}]}>→ Enoxaparina 60 mg SC 1x/dia ou 40mg SC 12/12h</Text>

                      <Text style={[styles.specialSituationsSubtitle, {marginTop: theme.spacing.xl, fontSize: theme.fontSize.md}]}>2) Associação farmacológica + mecânica:</Text>
                      <Text style={styles.specialSituationsOption}>• Considerar em pacientes de risco particularmente alto.</Text>
                      <Text style={styles.specialSituationsOption}>• Exemplos: Artroplastias, fratura de quadril, politraumatismo, neurocirurgia, cirurgia oncológica, Escore de Caprini ≥ 8.</Text>

                      <Text style={[styles.specialSituationsSubtitle, {marginTop: theme.spacing.xl, fontSize: theme.fontSize.md}]}>3) Profilaxia Estendida (Pós-alta)</Text>
                      <Text style={[styles.specialSituationsSubtitle, {fontSize: theme.fontSize.md}]}>a.1) Cirurgia Oncológica Abdominal/Pélvica de Grande Porte</Text>
                      <Text style={styles.specialSituationsOption}>• Indicação: Considerar em casos de risco muito alto.</Text>
                      <Text style={styles.specialSituationsOption}>• Duração: 10 a 30 dias.</Text>
                      <Text style={styles.specialSituationsOption}>• Opções:</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>- Enoxaparina 40 mg SC 1x/dia</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>- Rivaroxabana 10 mg VO 1x/dia</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>- Dabigatrana 220 mg VO 1x/dia</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>- Apixabana 2,5 mg VO 12/12h</Text>

                      <Text style={[styles.specialSituationsSubtitle, {fontSize: theme.fontSize.md, marginTop: theme.spacing.md}]}>a.2) Grandes Cirurgias Ortopédicas de Membros Inferiores (artroplastias, fraturas)</Text>
                      <Text style={styles.specialSituationsOption}>• Com deambulação retomada: Profilaxia por no mínimo 10 a 14 dias.</Text>
                      <Text style={styles.specialSituationsOption}>• Sem deambulação retomada (ex: fratura/artroplastia de quadril): Estender profilaxia para 35 dias.</Text>
                      <Text style={styles.specialSituationsOption}>• Opções de anticoagulação:</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>- Enoxaparina 40 mg SC 1x/dia</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>- Rivaroxabana 10 mg VO 1x/dia</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>- Dabigatrana 220 mg VO 1x/dia</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>- Apixabana 2,5 mg VO 12/12h</Text>
                      <Text style={[styles.specialSituationsOption, {marginTop: theme.spacing.md, fontWeight: 'bold'}]}>• Alternativa com AAS:</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>- AAS 81 a 100 mg/dia pode ser considerado após uso de anticoagulante por 5-10 dias, apenas se paciente não tiver outros fatores de risco para TEV (além do próprio fator de risco da cirurgia que realizou).</Text>

                      <Text style={[styles.specialSituationsSubtitle, {marginTop: theme.spacing.xl, fontSize: theme.fontSize.md}]}>4) Manejo Perioperatório e Risco de Sangramento</Text>
                      <Text style={[styles.specialSituationsOption, {fontWeight: 'bold'}]}>• Alto risco de sangramento ou hemorragia catastrófica:</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>→ Administrar anticoagulante somente após o procedimento.</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>→ Iniciar Enoxaparina 40 mg entre 12-24h após a cirurgia, desde que tenha hemostasia garantida.</Text>
                      <Text style={[styles.specialSituationsOption, {fontWeight: 'bold'}]}>• Profilaxia postergada (&gt; 24h pós-cirurgia):</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>→ Ex: Neurocirurgia, sangramento ortopédico excessivo.</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>→ Uso de compressão pneumática intermitente (CPI) é fundamental e deve ser iniciado precocemente.</Text>
                      <Text style={[styles.specialSituationsOption, {fontWeight: 'bold'}]}>• Timing da Heparina Não Fracionada (HNF):</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>→ Pode ser administrada 2 a 4 horas antes da cirurgia/bloqueio espinhal.</Text>
                      <Text style={[styles.specialSituationsOption, {marginLeft: theme.spacing.md}]}>→ Pode ser (re)iniciada 2 a 4 horas após a cirurgia/bloqueio espinhal.</Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.considerationsCard}>
                <Text style={styles.considerationsTitle}>
                  <Info size={20} color={theme.colors.calculator} /> Contraindicações para Profilaxia Medicamentosa
                </Text>
                
                <Text style={[styles.considerationText, {fontWeight: 'bold', marginTop: theme.spacing.md, marginBottom: theme.spacing.sm}]}>Absolutas:</Text>
                <Text style={styles.considerationText}>• Sangramento ativo</Text>
                <Text style={styles.considerationText}>• Úlcera péptica ativa</Text>
                <Text style={styles.considerationText}>• Uso de anticoagulação plena</Text>
                <Text style={styles.considerationText}>• Trombocitopenia induzida por heparina há menos de 100 dias</Text>
                <Text style={styles.considerationText}>• Hipersensibilidade ao anticoagulante</Text>
                <Text style={styles.considerationText}>• Anestesia espinhal ou peridural nas últimas 2 horas</Text>
                
                <Text style={[styles.considerationText, {fontWeight: 'bold', marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm}]}>Relativas:</Text>
                <Text style={styles.considerationText}>• Hipertensão arterial não controlada (PA &gt; 180x110 mmHg)</Text>
                <Text style={styles.considerationText}>• Coagulopatias (plaquetopenia ou INR &gt; 1,5; TTPA &gt; 60s)</Text>
                <Text style={styles.considerationText}>• Contagem plaquetária &lt; 50.000/mm³</Text>
                <Text style={styles.considerationText}>• Insuficiência renal grave (Clearance de creatinina &lt; 30 ml/min)</Text>
                <Text style={styles.considerationText}>• Cirurgia neurológica ou oftalmológica recente (&lt; 2 semanas)</Text>
                <Text style={styles.considerationText}>• Coleta de líquor nas últimas 24 horas</Text>
                <Text style={styles.considerationText}>• Anestesia espinhal ou peridural nas últimas 12-24 horas</Text>
              </View>

              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>
                  <AlertTriangle size={20} color="#FF5722" /> Importante
                </Text>
                <Text style={styles.warningText}>
                  • Avaliar contraindicações para anticoagulação.
                </Text>
                <Text style={styles.warningText}>
                  • Considerar risco de sangramento de cada paciente.
                </Text>
                <Text style={styles.warningText}>
                  • Ajustar dose em insuficiência renal.
                </Text>
                <Text style={styles.warningText}>
                  • Reavaliar o risco de TEV periodicamente.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetCalculator}
              >
                <Text style={styles.resetButtonText}>Limpar Seleção</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.referenceCard}
                onPress={() => setIsReferenceExpanded(!isReferenceExpanded)}
              >
                <View style={styles.referenceHeader}>
                  <Text style={styles.referenceTitle}>
                    <Info size={20} color={theme.colors.primary} /> Referência Bibliográfica
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
                      Caprini JA, Arcelus JI, Hasty JH, et al. Clinical assessment of venous thromboembolic risk in surgical patients. Semin Thromb Hemost. 1991;17(Suppl 3):304-312.
                    </Text>
                    <Text style={styles.referenceText}>
                      Bahl V, Hu HM, Henke PK, Wakefield TW, Campbell DA Jr, Caprini JA. A validation study of a retrospective venous thromboembolism risk scoring method. Ann Surg. 2010 Feb;251(2):344-50.
                    </Text>
                     <Text style={styles.referenceText}>
                      Gould MK, Garcia DA, Wren SM, et al. Prevention of VTE in nonorthopedic surgical patients: Antithrombotic Therapy and Prevention of Thrombosis, 9th ed: American College of Chest Physicians Evidence-Based Clinical Practice Guidelines. Chest. 2012;141(2_suppl):e227S-e277S.
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
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
  infoCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.success,
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  instructionText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  factorsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  factorCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  factorCardSelected: {
    borderColor: theme.colors.success,
    backgroundColor: '#F0FFF4',
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  factorLabel: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: 'auto',
    minWidth: 45,
    alignItems: 'center',
  },
  factorLabelSelected: {
    backgroundColor: theme.colors.success,
  },
  factorLabelText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  factorLabelTextSelected: {
    color: 'white',
  },
  factorCheckbox: {
    marginLeft: theme.spacing.sm,
  },
  factorTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  factorDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  categoryTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  resultContainer: {
    gap: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  scoreResultCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
  },
  scoreResultHeader: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  scoreResultNumber: {
    fontSize: theme.fontSize.xl,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  scoreResultContent: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  riskLevelText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  riskLevelValue: {
    fontFamily: 'Roboto-Bold',
  },
  riskPercentageText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
  },
  riskPercentageValue: {
    fontFamily: 'Roboto-Bold',
    color: theme.colors.emergency,
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
  },
  recommendationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  recommendationText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  prophylaxisInfo: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  prophylaxisTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  prophylaxisOption: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  considerationsCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  considerationsTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  considerationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  warningCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  warningTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FF5722',
    marginBottom: theme.spacing.md,
  },
  warningText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  resetButton: {
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  renalAdjustmentCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  renalAdjustmentTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.sm,
  },
  renalAdjustmentOption: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  specialSituationsCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  specialSituationsTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.sm,
  },
  specialSituationsSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  specialSituationsOption: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
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
    fontStyle: 'italic',
  },
});

