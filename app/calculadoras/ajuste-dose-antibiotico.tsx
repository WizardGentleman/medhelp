import { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Search, Pill, Info, TriangleAlert as AlertTriangle, Clock, Droplets, Activity } from 'lucide-react-native';

interface RenalAdjustment {
  range: string;
  adjustment: string;
}

interface Antibiotic {
  id: string;
  name: string;
  normalDose: string;
  renalAdjustments: RenalAdjustment[];
  hepaticAdjustment: string;
  observations: string;
  preparation?: {
    reconstitution?: string;
    dilution?: string;
    maxConcentration?: string;
    administration?: string;
    specificCare?: string;
    monitoring?: string;
  };
}

const antibiotics: Antibiotic[] = [
  {
    id: 'aciclovir',
    name: 'Aciclovir',
    normalDose: '5-12,5 mg/kg, a cada 8 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: 'ClCr 25-50mL/min', adjustment: '5-10mg/kg ou 500mg/m², EV, 12/12h' },
      { range: 'ClCr 10-25mL/min', adjustment: 'Herpes simplex: 800mg, VO, 6/6h-8/8h, ou 5-10mg/kg ou 500mg/m², EV, 1 vez/ dia. Herpes zoster: 800mg, VO, 8/8h ou 6/6h' },
      { range: 'ClCr<10mL/min', adjustment: 'Herpes simplex: 200mg, VO, 12/12h, ou 2,5-5mg/kg ou 250mg/m², EV, 1 vez/dia. Herpes zoster: 800mg, VO, 12/12h. ou 2,5-5mg/kg ou 250mg/m², EV, 1 vez/dia' },
      { range: 'Hemodiálise', adjustment: '2,5-5mg/kg ou 250mg/m², EV, 1 vez/dia após a diálise' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Recomenda-se o uso de doses altas nas infecções graves.',
    preparation: {
      reconstitution: '10mL de AD ou SF cada frasco-ampola',
      dilution: '100mL SF ou SG cada frasco-ampola',
      maxConcentration: '5mg/mL',
      administration: 'VO - Pode ser administrado com ou sem alimento. EV - administrar em uma hora para evitar lesão renal'
    }
  },
  {
    id: 'amicacina',
    name: 'Amicacina',
    normalDose: 'Múltiplas doses: 7,5 mg/kg/dose, a cada 12 h OU 5 mg/kg/dose 8/8 horas. Dose única: 15 mg/kg, 1x/dia. Dose máxima 1,5g/ dia',
    renalAdjustments: [
      { range: 'Normal (>50 mL/min)', adjustment: 'Sem ajuste' },
      { range: 'ClCr 10-50 mL/min', adjustment: '7,5mg/kg a cada 24 horas' },
      { range: 'ClCr < 10 mL/min', adjustment: '7,5mg/kg a cada 48 horas' },
      { range: 'Hemodiálise', adjustment: 'suplementar 3,25 mg/kg pós-diálise. CAPD: são perdidos 15-20 mg/L/dia de volume dialisado' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Como todo aminoglicosídeo, tem potencial nefrotóxico e ototóxico. Se disponível, realizar a dosagem de amicacinemia, principalmente em pacientes com insuficiência renal.',
    preparation: {
      dilution: '100-200mL de SF, SG 5% e RL. Concentração máxima: 5mg/mL',
      administration: '30-60min',
      specificCare: 'Pacientes obesos devem ter o cálculo da dose baseado no peso ideal',
      monitoring: 'Recomenda-se o monitoramento do nível sérico para que o pico não ultrapasse 40mcg/mL e o vale seja ≥ 10mcg/mL'
    }
  },
  {
    id: 'amoxicilina-clavulanato',
    name: 'Amoxicilina-clavulanato',
    normalDose: '1 g, a cada 8 h',
    renalAdjustments: [
      { range: '>30-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-30 mL/min', adjustment: '500 mg, a cada 12 h (EV ou VO)' },
      { range: '<10 mL/min', adjustment: '500 mg, a cada 24 h (não recomendado VO)' },
      { range: 'Diálise', adjustment: '250-500 mg, a cada 24 h. Administrar a dose durante e após extra 500mg a diálise. Não use comprimidos de liberação prolongada' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: '-',
    preparation: {
      dilution: 'AD, SF, Ringer-Lactato 50 -100mL - pode ser EV direto após reconstituição',
      administration: 'Oral: Pode ser ingerido com ou sem alimentos, no início da refeição, pois minimiza o risco de intolerância gastrintestinal. EV: Direta de 3-4min e infusão lenta de 30-40min'
    }
  },
  {
    id: 'ampicilina',
    name: 'Ampicilina',
    normalDose: '50-200 mg/kg/dia, EV, divididos a cada 6 h (usualmente, 250-2.000 mg, a cada 4/4h a 6/6 h). Dose padrão 500mg por tomada. Dose Máxima Adulto Oral: 3,5 g; EV e IM: 12g/dia',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '30-50 mL/min', adjustment: '250-2.000 mg, a cada 8-12 h' },
      { range: '10-50 mL/min', adjustment: '250-2.000 mg, a cada 8-12 h' },
      { range: '<10 mL/min', adjustment: '250-1.000 mg, a cada 12 h' },
      { range: 'Diálise', adjustment: 'Hemodiálise: suplementar dose pós-diálise. CAPD: 250-500 mg, a cada 12 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Doses maiores são usadas em infecções graves (endocardite, meningite etc.).',
    preparation: {
      dilution: '50-100mL de SF, SG 5%, Ringer-Lactato',
      administration: 'Oral: Tomar com estomago vazio, cápsula/suspensão devem ser ingeridas de 30 minutos a 1 hora antes ou 2h após as refeições e/ou nutrição enteral. EV: Direta: 125 - 500mg de 3-5min e 1 - 2g de 10-15min'
    }
  },
  {
    id: 'ampicilina-sulbactam',
    name: 'Ampicilina + sulbactam',
    normalDose: '2 g, a cada 6 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: '2 g, a cada 8-12 h' },
      { range: '<10 mL/min', adjustment: '2 g, a cada 24 h' },
      { range: 'Diálise', adjustment: 'Hemodiálise: suplementar dose pós-diálise. CAPD: 2 g, a cada 24 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Doses maiores podem ser usadas em infecções graves.',
    preparation: {
      reconstitution: 'EV: 3mL de AD para 1,5g e 6mL de AD para 3g. O volume é expandido para 4 e 8mL após a reconstituição. IM: Pode ser utilizada lidocaína 2%',
      dilution: '20-50mL SF e SG 5%',
      administration: 'EV: Direta: 3 minutos; Infusão: 1,5g em 15 minutos e 3g em 30 minutos',
      specificCare: 'Ativo contra Acinectobacter spp. multi-resistente. Seu uso indiscriminado poderá levar à resistência a este antimicrobiano'
    }
  },
  {
    id: 'anfotericina-b-desoxicolato',
    name: 'Anfotericina B Desoxicolato',
    normalDose: '0,3-1,5 mg/kg/dia - Candidíase: 0,4-0,6 mg/kg/dia EV, por 4 semanas. Dependendo da gravidade da infecção, podem ser necessárias doses de até 1 mg/kg/dia EV. Caso seja preciso, podem ser usadas doses cumulativas totais de 2-4 g',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'Sem ajuste' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Monitorizar função renal e potássio. Risco de reação infusional.',
    preparation: {
      dilution: '10 ml (1 ampola) + 490 SG 5% (concentração de 0,1 mg/mL)',
      administration: 'Infusão EV lenta por 2 a 6 horas'
    }
  },
  {
    id: 'anfotericina-b-complexo-lipidico',
    name: 'Anfotericina B, complexo lipídico',
    normalDose: '3 - 5 mg/kg/dia',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'Sem ajuste' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Recomenda-se um período de 6h entre procedimentos de transfusão de leucócitos e a administração de Ambisome.',
    preparation: {
      dilution: 'ATENÇÃO! Retirar 20mL de SG da bolsa para lavar o acesso antes e após a infusão devido a incompatibilidade do lipossoma com SF. Usualmente: 250 mL de SG 5%',
      administration: 'Infundir em 2 horas; se bem tolerado, pode reduzir para 1 hora. Se dose maior que 5mg/kg/dia, manter infusão em 2 horas. ATENÇÃO! Lavar do acesso com Soro Glicosado 5% antes e após a infusão'
    }
  },
  {
    id: 'anfotericina-b-lipossomal',
    name: 'Anfotericina B, lipossomal',
    normalDose: '3-5 mg/kg/dia',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'Sem ajuste' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Monitorizar função renal e potássio. Risco de reação infusional.'
  },
  {
    id: 'anidulafungina',
    name: 'Anidulafungina',
    normalDose: 'Candidemia: 200 mg, EV, a cada 24 h, no 1º dia, seguidos de 100 mg, a cada 24 h. Candidíase esofágica: 100 mg, EV, a cada 24 h, no 1º dia, seguidos de 50 mg, a cada 24 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'Sem ajuste' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Efeitos adversos mais comuns: náusea, vômito e cefaleia. Não faz nível terapêutico em SNC e urina.'
  },
  {
    id: 'azitromicina',
    name: 'Azitromicina',
    normalDose: '500 mg, a cada 24 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'Sem ajuste' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: '-'
  },
  {
    id: 'aztreonam',
    name: 'Aztreonam',
    normalDose: '2 g, a cada 6-8 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: '100% da dose normal' },
      { range: '10-50 mL/min', adjustment: '50-75% da dose normal' },
      { range: '<10 mL/min', adjustment: '25% da dose normal' },
      { range: 'Diálise', adjustment: 'Suplementar 0,5 g, pós-hemodiálise. CAPD: 25% da dose normal' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: '-'
  },
  {
    id: 'caspofungina',
    name: 'Caspofungina',
    normalDose: '70 mg, EV, a cada 24 h, no 1º dia, seguidos de 50 mg, a cada 24 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'Sem ajuste' }
    ],
    hepaticAdjustment: 'Reduzir para 35 mg/dia se houver insuficiência hepática moderada',
    observations: 'Efeitos adversos mais comuns: prurido, cefaleia, vômito, diarreia e febre (relacionados à infusão). Não faz nível terapêutico em SNC e urina.'
  },
  {
    id: 'cefalotina',
    name: 'Cefalotina',
    normalDose: '1-2 g, a cada 4-6 h. Dose Máxima: 12g/dia',
    renalAdjustments: [
      { range: 'ClCr 50-80mL/minuto', adjustment: 'Administrar 2g cada 6 horas' },
      { range: 'ClCr = 25-50mL/minuto', adjustment: 'Administrar 1,5g cada 6 horas' },
      { range: 'ClCr = 10-25mL/minuto', adjustment: 'Administrar 1g cada 6 horas' },
      { range: 'ClCr = 2-10mL/minuto', adjustment: 'Administrar 0,5g cada 6 horas' },
      { range: 'ClCr = < 2mL/minuto', adjustment: 'Administrar 0,5g cada 8 horas' },
      { range: 'Diálise', adjustment: 'Suplementar 0,5-1 g, pós-hemodiálise' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Doses e intervalos mudam na profilaxia cirúrgica. Não ultrapassar 12 g/dia da medicação.',
    preparation: {
      reconstitution: 'IM: 5mL de AD. EV: 10mL de AD',
      dilution: 'EV: 50-100mL de SF, SG 5% ou RL. IM: 2,5mL de AD, SF ou Lidocaína 0,5%'
    }
  },
  {
    id: 'cefazolina',
    name: 'Cefazolina',
    normalDose: '1-2 g, a cada 8 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: '1-2 g, a cada 12 h' },
      { range: '<10 mL/min', adjustment: '1-2 g, a cada 24-48 h' },
      { range: 'Diálise', adjustment: 'Suplementar 1-2 g, pós-hemodiálise. CAPD: 500 mg, a cada 12 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Doses e intervalos mudam na profilaxia cirúrgica. Não ultrapassar 12 g/dia da medicação.'
  },
  {
    id: 'cefepima',
    name: 'Cefepima',
    normalDose: '1-2 g, a cada 8-12 h',
    renalAdjustments: [
      { range: 'ClCr > 60 mL/min', adjustment: 'sem ajuste' },
      { range: 'ClCr de 30-60 mL/min', adjustment: '2 g, a cada 12 h' },
      { range: 'ClCr de 11-29 mL/min', adjustment: '2 g, a cada 24 h' },
      { range: '<10 mL/min', adjustment: '1 g, a cada 24 h' },
      { range: 'Diálise', adjustment: 'Suplementar 1 g, pós-hemodiálise. CAPD: 1-2 g, a cada 48 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Doses altas de cefepima em pacientes com doença renal crônica podem causar status epilepticus não convulsivo. Ficar atento caso o paciente desenvolva confusão mental, desorientação, agitação, alucinação, mioclonias, comportamentos inadequados, mutismo ou coma - atentar para a correção da dose pelo ClCr.'
  },
  {
    id: 'cefotaxima',
    name: 'Cefotaxima',
    normalDose: '2 g, a cada 8 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: '2 g, a cada 8-12 h' },
      { range: '10-50 mL/min', adjustment: '2 g, a cada 12-24 h' },
      { range: '<10 mL/min', adjustment: '2 g, a cada 24 h' },
      { range: 'Diálise', adjustment: 'Suplementar 1 g pós-hemodiálise. CAPD: 0,5-1 g, a cada 24 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Doses maiores podem ser usadas em infecções graves e do SNC.'
  },
  {
    id: 'cefoxitina',
    name: 'Cefoxitina',
    normalDose: '2 g, a cada 6-8 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: '2 g, a cada 8-12 h' },
      { range: '<10 mL/min', adjustment: '2 g, a cada 24-48 h' },
      { range: 'Diálise', adjustment: 'Suplementar 1 g, pós-hemodiálise. CAPD: 1 g, a cada 24 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Doses e intervalos mudam na profilaxia cirúrgica.'
  },
  {
    id: 'ceftazidima',
    name: 'Ceftazidima',
    normalDose: '2 g, a cada 8 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: '2 g, a cada 8-12 h' },
      { range: '10-50 mL/min', adjustment: '2 g, a cada 12-24 h' },
      { range: '<10 mL/min', adjustment: '2 g, a cada 24-48 h' },
      { range: 'Diálise', adjustment: 'Suplementar 1 g, pós-hemodiálise. CAPD: 500 mg, a cada 24 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Cefalosporina de 3ª geração com ação anti-Pseudomonas.'
  },
  {
    id: 'ceftriaxona',
    name: 'Ceftriaxona',
    normalDose: '1-2 g, a cada 12-24 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'É discutível a suplementação de uma dose pós-hemodiálise' }
    ],
    hepaticAdjustment: 'Ajuste pode ser necessário caso o paciente apresente insuficiência hepática significativa + insuficiência renal - recomenda-se não ultrapassar 2 g/dia',
    observations: 'Doses mais altas são usadas em infecções do SNC (meningite bacteriana: 2 g, a cada 12 h).'
  },
  {
    id: 'cefuroxima',
    name: 'Cefuroxima',
    normalDose: '0,75-1,5 g, a cada 8 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: '0,75-1,5 g, a cada 8-12 h' },
      { range: '<10 mL/min', adjustment: '0,75-1,5 g, a cada 24 h' },
      { range: 'Diálise', adjustment: 'Suplementar uma dose pós-hemodiálise. CAPD: dose para ClCr < 10 mL/min' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: '-'
  },
  {
    id: 'ciprofloxacino',
    name: 'Ciprofloxacino',
    normalDose: '400 mg, a cada 12 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: '400 mg, a cada 24 h (ou 200 mg, a cada 12 h)' },
      { range: '<10 mL/min', adjustment: '400 mg, a cada 24 h (ou 200 mg, a cada 12 h)' },
      { range: 'Diálise', adjustment: 'Hemodiálise: 400 mg, a cada 24 h (ou 200 mg, a cada 12 h). Suplementar uma dose pós-diálise' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Doses mais altas (400 mg, a cada 8 h) podem ser usadas em infecções graves ou focos fechados.'
  },
  {
    id: 'claritromicina',
    name: 'Claritromicina',
    normalDose: '500 mg, a cada 12 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: '500 mg, a cada 12-24 h' },
      { range: '<10 mL/min', adjustment: '500 mg, a cada 24 h' },
      { range: 'Diálise', adjustment: 'Suplementar dose pós-diálise. CAPD: 500 mg, a cada 24 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Cuidado com flebite química quando realizada em veia periférica. Evitar associação com estatina.'
  },
  {
    id: 'clindamicina',
    name: 'Clindamicina',
    normalDose: '600 mg, a cada 6 h, ou 900 mg, a cada 8 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'Sem ajuste' }
    ],
    hepaticAdjustment: 'Ajustar dose em caso de insuficiência hepática grave',
    observations: 'Lembrar de usar na suspeita de síndrome do choque tóxico.'
  },
  {
    id: 'cloranfenicol',
    name: 'Cloranfenicol',
    normalDose: '50-100 mg/kg divididos a cada 6 h (máximo: 4 g/dia)',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'Sem ajuste' }
    ],
    hepaticAdjustment: 'Ajustar na insuficiência hepática e evitar o uso em insuficiência hepática grave',
    observations: 'Atentar-se à monitorização dos índices hematimétricos.'
  },
  {
    id: 'daptomicina',
    name: 'Daptomicina',
    normalDose: '4-6 mg/kg/dia',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: 'ClCr > 30 mL/min', adjustment: 'sem ajuste' },
      { range: 'ClCr < 30 mL/min', adjustment: '4-6 mg/kg, a cada 48 h' },
      { range: '<10 mL/min', adjustment: '4-6 mg/kg, a cada 48 h' },
      { range: 'Diálise', adjustment: 'Hemodiálise e CAPD: 4-6 mg/kg, a cada 48 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Monitorizar sintomas de miopatia e dosagem de CPK. Descontinuar a medicação caso haja aumento de CPK > 10x LSN, CPK > 1.000 ou sintomas de miopatia. Daptomicina não é eficaz para tratar infecções de sítio pulmonar.'
  },
  {
    id: 'eritromicina',
    name: 'Eritromicina',
    normalDose: '500 mg, a cada 6 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'Sem ajuste' }
    ],
    hepaticAdjustment: 'Sem ajuste (no entanto, usar com cautela em insuficiência hepática grave)',
    observations: 'Doses mais altas podem ser usadas em infecções graves.'
  },
  {
    id: 'ertapenem',
    name: 'Ertapeném',
    normalDose: '1 g, a cada 24 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: 'ClCr > 30 mL/min', adjustment: 'sem correção' },
      { range: 'ClCr < 30 mL/min', adjustment: '500 mg, a cada 24 h' },
      { range: '<10 mL/min', adjustment: '500 mg, a cada 24 h' },
      { range: 'Diálise', adjustment: 'ClCr < 10 mL/min: manter dose igual. Suplementar 150 mg se o ertapeném for administrado dentro de 6 h antes da hemodiálise' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Boa droga para poupar (quando possível) os outros cabapenêmicos e para realizar home care ou hospital-dia, desospitalizando precocemente o paciente (lembrar que não é recomendado para tratar Pseudomonas aeruginosa).'
  },
  {
    id: 'estreptomicina',
    name: 'Estreptomicina',
    normalDose: '15 mg/kg, a cada 24 h (evitar ultrapassar 1 g/dia)',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: '15 mg/kg, a cada 24-72 h' },
      { range: '<10 mL/min', adjustment: '15 mg/kg, a cada 72-96 h' },
      { range: 'Diálise', adjustment: 'Suplementar 50% pós-hemodiálise. CAPD: 20-40 mg/L/dia de dialisado perdido' }
    ],
    hepaticAdjustment: 'Sem efeito',
    observations: 'Doses mais altas (até 800 mg/dia) podem ser usadas em infecções graves. Monitorizar enzimas e função hepática.'
  },
  {
    id: 'fluconazol',
    name: 'Fluconazol',
    normalDose: '100-400 mg, a cada 24 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: '50% da dose' },
      { range: '<10 mL/min', adjustment: '50% da dose' },
      { range: 'Diálise', adjustment: 'Suplementar 100% pós-hemodiálise. CAPD: 50% da dose' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Doses mais altas (até 800 mg/dia) podem ser usadas em infecções graves. Monitorizar enzimas e função hepática.'
  },
  {
    id: 'foscarnet',
    name: 'Foscarnet (indução)',
    normalDose: 'Indução: 90 mg/kg, a cada 12 h ou 60 mg/kg, a cada 8 h',
    renalAdjustments: [
      { range: 'ClCr > 1,4 mL/min/kg', adjustment: '60 mg/kg, a cada 8 h' },
      { range: 'ClCr de 1-1,4 mL/min/kg', adjustment: '45 mg/kg, a cada 8 h' },
      { range: 'ClCr de 0,8-1 mL/min/kg', adjustment: '50 mg/kg, a cada 12 h' },
      { range: 'ClCr de 0,6-0,8 mL/min/kg', adjustment: '40 mg/kg, a cada 12 h' },
      { range: 'ClCr de 0,5-0,6 mL/min/kg', adjustment: '60 mg/kg, a cada 24 h' },
      { range: 'ClCr de 0,4-0,5 mL/min/kg', adjustment: '50 mg/kg, a cada 24 h' },
      { range: 'ClCr < 0,4 mL/min/kg', adjustment: 'não é recomendado o uso da medicação' },
      { range: 'Diálise', adjustment: 'Não especificado' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Habitualmente usado para o tratamento de citomegalovirose ou herpes-vírus com suspeita de resistência ou falha terapêutica com aciclovir ou ganciclovir. Monitorizar função renal, eletrólitos (potássio, cálcio, magnésio), enzimas hepáticas e hemograma. Pode causar neuropatia, febre, cefaleia, náusea e fadiga.'
  },
  {
    id: 'ganciclovir',
    name: 'Ganciclovir',
    normalDose: '5 mg/kg, a cada 12 h',
    renalAdjustments: [
      { range: 'ClCr de 70-90 mL/min', adjustment: '5 mg/kg, a cada 12 h' },
      { range: 'ClCr de 50-69 mL/min', adjustment: '2,5 mg/kg, a cada 12 h' },
      { range: 'ClCr de 25-49 mL/min', adjustment: '2,5 mg/kg, a cada 12 h' },
      { range: 'ClCr de 10-25 mL/min', adjustment: '1,25 mg/kg, a cada 24 h' },
      { range: '<10 mL/min', adjustment: '1,25 mg/kg, 3x/semana' },
      { range: 'Diálise', adjustment: 'Suplementar dose pós-diálise. CAPD: 1,25 mg/kg, 3x/semana' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Potencial mielotóxico e cardiotóxico.'
  },
  {
    id: 'gentamicina',
    name: 'Gentamicina',
    normalDose: 'Múltiplas doses: 2 mg/kg (ataque) e depois, 1,7 mg/kg, a cada 8 h. Dose única diária: 5,1 mg/kg, a cada 24 h (quadro muito grave: 7 mg/kg, a cada 24 h)',
    renalAdjustments: [
      { range: 'ClCr > 80 mL/min (dose única)', adjustment: '5,1 mg/kg, a cada 24 h' },
      { range: 'ClCr de 60-80 mL/min (dose única)', adjustment: '4 mg/kg, a cada 24 h' },
      { range: 'ClCr de 40-60 mL/min (dose única)', adjustment: '3,5 mg/kg, a cada 24 h' },
      { range: 'ClCr de 30-40 mL/min (dose única)', adjustment: '2,5 mg/kg, a cada 24 h' },
      { range: 'ClCr de 20-30 mL/min (dose única)', adjustment: '4 mg/kg, a cada 48 h' },
      { range: 'ClCr de 10-20 mL/min (dose única)', adjustment: '3 mg/kg, a cada 48 h' },
      { range: 'ClCr < 10 mL/min (dose única)', adjustment: '2 mg/kg, a cada 72 h depois da hemodiálise' },
      { range: 'Múltiplas doses (10-50 mL/min)', adjustment: '1,7 mg/kg, a cada 12-24 h' },
      { range: 'Múltiplas doses (<10 mL/min)', adjustment: '1,7 mg/kg, a cada 48 h' },
      { range: 'Hemodiálise', adjustment: '1,7 mg/kg, a cada 48 h e suplementar 0,85 mg/kg pós-diálise' },
      { range: 'CAPD Anúrico', adjustment: '0,6 mg/kg/dia' },
      { range: 'CAPD Não anúrico', adjustment: '0,75 mg/kg/dia' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Múltiplas doses: Esquema preferido para endocardites. Dose única: Esquema preferido por causar menos efeitos adversos.'
  },
  {
    id: 'imipenem-cilastatina',
    name: 'Imipeném + cilastatina',
    normalDose: '500 mg, a cada 6 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: '250-500 mg, a cada 6-8 h' },
      { range: '10-50 mL/min', adjustment: '250 mg, a cada 8-12 h' },
      { range: '<10 mL/min', adjustment: '125-250 mg, a cada 12 h' },
      { range: 'Diálise', adjustment: 'Suplementar dose pós-hemodiálise. CAPD: 125-250 mg, a cada 12 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Doses maiores (até 1 g, a cada 6-8 h) são recomendadas para tratar Pseudomonas aeruginosa.'
  },
  {
    id: 'levofloxacino',
    name: 'Levofloxacino',
    normalDose: '250-750 mg, a cada 24 h, mas prefere-se usar a dose de 750 mg',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: '750 mg, a cada 24 h' },
      { range: 'ClCr de 20-49 mL/min', adjustment: '750 mg, a cada 48 h' },
      { range: 'ClCr < 20 mL/min', adjustment: '750 mg (ataque) e, depois, 500 mg, a cada 48 h' },
      { range: 'Diálise', adjustment: 'Hemodiálise e CAPD: 750 mg (ataque) e, depois, 500 mg, a cada 48 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: '-'
  },
  {
    id: 'linezolida',
    name: 'Linezolida',
    normalDose: '600 mg, a cada 12 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Hemodiálise', adjustment: 'suplementar dose posteriormente' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Tem as vantagens de não ser ajustada para função renal e possuir forma oral com ótima biodisponibilidade. Observar plaquetopenia e, se possível, evitar o uso por > 28 dias pelo risco de neuropatia.'
  },
  {
    id: 'meropenem',
    name: 'Meropenem',
    normalDose: 'Habitual: 1 g, a cada 8 h. Meningite: 2 g, a cada 8 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: '1 g, a cada 8 h' },
      { range: '10-50 mL/min', adjustment: '1 g, a cada 12 h' },
      { range: '<10 mL/min', adjustment: '0,5 g, a cada 24 h' },
      { range: 'Diálise', adjustment: 'Hemodiálise: suplementar dose posteriormente. CAPD: 0,5 g, a cada 24 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'O uso de doses mais elevadas (2 g, a cada 8 h) tem sido cada vez mais discutido para o tratamento de bactérias multirresistentes.'
  },
  {
    id: 'metronidazol',
    name: 'Metronidazol',
    normalDose: '500 mg, a cada 8 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: '500 mg, a cada 8 h' },
      { range: '10-50 mL/min', adjustment: '500 mg, a cada 8 h' },
      { range: '<10 mL/min', adjustment: '250 mg, a cada 8 h' },
      { range: 'Diálise', adjustment: 'Hemodiálise: suplementar metade da dose posteriormente. CAPD: 250 mg, a cada 8-12 h' }
    ],
    hepaticAdjustment: 'Reduzir em 50% a dose na insuficiência hepática grave',
    observations: 'Doses maiores podem ser usadas em casos graves (até a cada 6 h). Gosto metálico na boca é um dos principais efeitos adversos. Não usar concomitantemente com o consumo de álcool.'
  },
  {
    id: 'micafungina',
    name: 'Micafungina',
    normalDose: 'Candidíase esofágica: 150 mg, a cada 24 h. Candidemia: 100 mg, a cada 24 h. Profilaxia em transplante de medula óssea: 50 mg, a cada 24 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'Sem ajuste' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: '-'
  },
  {
    id: 'moxifloxacino',
    name: 'Moxifloxacino',
    normalDose: '400 mg, a cada 24 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'Sem ajuste' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Tem as vantagens de não precisar ajustar para função renal e apresentar formulação VO com ótima biodisponibilidade.'
  },
  {
    id: 'oxacilina',
    name: 'Oxacilina',
    normalDose: '2 g, a cada 4 h (total: 12 g/dia)',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Discutível - alguns autores recomendam diminuir a dose para 0,5-1 g, a cada 4-6 h. Em infecções graves, recomenda-se manter doses altas. Na bula, não há indicação de ajuste de dose' },
      { range: 'Diálise', adjustment: 'Não dialisável' }
    ],
    hepaticAdjustment: 'Discutível - reduzir a dose nos casos de insuficiência hepática grave',
    observations: 'Cuidado com o risco de flebite quando usada em veia periférica. Utilizar altas doses nas infecções moderadas e graves.'
  },
  {
    id: 'piperacilina-tazobactam',
    name: 'Piperacilina + tazobactam',
    normalDose: '4,5 g, a cada 6 ou 8 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: 'ClCr de 20-50 mL/min', adjustment: '2,25 g, a cada 6 h' },
      { range: 'ClCr de 10-20 mL/min', adjustment: '2,25 g, a cada 8 h' },
      { range: '< 10 mL/min', adjustment: '2,25 g, a cada 8 h' },
      { range: 'Hemodiálise', adjustment: '2,25 g, a cada 8 h e suplementar 0,75 g, pós-hemodiálise' },
      { range: 'CAPD', adjustment: '4,5 g, a cada 12 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Tendência de usar doses máximas em obesos e infecções graves. Monitorizar eletrólitos e usar com cautela em pacientes com restrição significativa de sódio. Segundo a bula, cada FA contém 2,79 mEq (64 mg) de sódio por grama de piperacilina.'
  },
  {
    id: 'polimixina-b',
    name: 'Polimixina B',
    normalDose: '(10.000 UI = 1 mg) Dose de ataque: 2,5 mg/kg, em 2 h. Dose de manutenção: 1,5 mg/kg, a cada 12 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'Sem ajuste' }
    ],
    hepaticAdjustment: 'Sem informação',
    observations: 'A polimixina B tem baixa concentração urinária, o que representa um ponto negativo para o tratamento das ITU.'
  },
  {
    id: 'polimixina-e-colistina',
    name: 'Polimixina E (Colistina)',
    normalDose: 'Dose de ataque (mg) = concentração média em estado de equilíbrio de alvo da colistina (geralmente, 3,5, mas alguns autores consideram 2,5) x 2 x peso (considerar o menor entre o peso ideal e o real). Dose de manutenção (mg) = concentração média em estado de equilíbrio de alvo da colistina x (1,5 x ClCr + 30). Não ultrapassar 475 mg/dia de droga, de acordo com novos estudos (conforme a bula, até 300 mg/dia)',
    renalAdjustments: [
      { range: 'ClCr > 70 mL/min/1.73 m²', adjustment: 'administrar a cada 8 ou 12 h' },
      { range: 'ClCr de 10-70 mL/min/1.73 m²', adjustment: 'administrar a cada 8 ou 12 h' },
      { range: 'ClCr < 10 mL/min/1.73m²', adjustment: 'administrar a cada 12 h' },
      { range: 'Diálise', adjustment: 'Administrar dose do dia após término da sessão' }
    ],
    hepaticAdjustment: 'Sem informação',
    observations: 'A colistina tem alta excreção urinária, o que pode ser positivo no tratamento relacionado às ITU. Exemplo prático de cálculo de dose para paciente com 60 kg (peso real foi o menor entre peso ideal e real) e ClCr = 100 mL/min/1.73 m²: Ataque: 3,5 x 2 x peso = 420 mg de colistina. Manutenção (após 12 h da dose de ataque): 3,5 x (1,5 x 100 + 30) = 630 mg/dia - como a dose máxima de colistina é de 475 mg/dia, a dose final deve ser de 237,5 mg, a cada 12 h, ou 158 mg, a cada 8 h.'
  },
  {
    id: 'sulfametoxazol-trimetoprima',
    name: 'Sulfametoxazol + trimetoprima',
    normalDose: '(dose baseada na trimetoprima) 5-20 mg/kg/dia, divididos a cada 6-12 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: '5-20 mg/kg/dia, divididos a cada 6-12 h' },
      { range: 'ClCr de 30-50 mL/min', adjustment: '5-7,5 mg/kg, a cada 8 h' },
      { range: 'ClCr de 10-29 mL/min', adjustment: '5-10 mg/kg, a cada 12 h' },
      { range: '<10 mL/min', adjustment: 'Não se recomenda o uso. Se utilizado, 5-10 mg/kg, a cada 24 h' },
      { range: 'Diálise', adjustment: 'Hemodiálise e CAPD: não se recomenda o uso. Se utilizado, 5-10 mg/kg, a cada 24 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'As doses variam muito e são calculadas dependendo da doença em questão. Podem ocorrer vários efeitos adversos, mas os mais comuns são problemas renais e alergia.'
  },
  {
    id: 'teicoplanina',
    name: 'Teicoplanina',
    normalDose: 'Dose de ataque: 6 mg/kg, a cada 12 h, por 3 doses, e, depois, 6 mg/kg, a cada 24 h (o regime inicial é de 3 doses de 400 mg, a cada 12 h, seguidas de 1 dose de manutenção de 400 mg, 1x/dia)',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: '6 mg/kg, a cada 48 h' },
      { range: '<10 mL/min', adjustment: '6 mg/kg, a cada 72 h' },
      { range: 'Diálise', adjustment: 'Hemodiálise e CAPD: 6 mg/kg, a cada 72 h' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'A dose padrão de 400 mg corresponde a aproximadamente 6 mg/kg. Em pacientes ≥ 85 kg, deve-se utilizar a dose de 6 mg/kg. Podem ser necessárias doses maiores em algumas situações clínicas, p. ex., endocardite.'
  },
  {
    id: 'tigeciclina',
    name: 'Tigeciclina',
    normalDose: 'Dose de ataque: 100 mg e, depois, manter 50 mg, a cada 12 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Sem ajuste' },
      { range: '<10 mL/min', adjustment: 'Sem ajuste' },
      { range: 'Diálise', adjustment: 'Sem ajuste' }
    ],
    hepaticAdjustment: 'Hepatopatia grave (Child C): Iniciar com dose de ataque de 100 mg e, depois, 25 mg, a cada 12 h',
    observations: 'Alta incidência de náusea e vômitos, mas somente 1% dos pacientes necessitam descontinuar a terapêutica por esses motivos. Doses maiores são relatadas em estudos off-label. Segundo o FDA, sugere-se usar em casos nos quais não existam outras opções terapêuticas disponíveis, uma vez que foi notado aumento da mortalidade associado ao grupo de pacientes que usaram tigeciclina.'
  },
  {
    id: 'vancomicina',
    name: 'Vancomicina',
    normalDose: 'Dose de ataque para infecções graves: 25-30 mg/kg (máximo: 2 g/dose). Dose de manutenção: 15-20 mg/kg/dose a cada 12 h para pacientes com função renal normal',
    renalAdjustments: [
      { range: '>50-90 mL/min e <10 mL/min', adjustment: 'Doses de até 2 g/dia de medicação: Pacientes com creatinina normal podem ser monitorizados com 1 dosagem de creatinina e vancocinemia por semana. Pacientes com risco de nefrotoxicidade devem ser monitorizados com creatinina e vancocinemia, a cada 24 ou 48 h' },
      { range: 'Diálise', adjustment: 'ataque de 15-20 mg/kg. O ajuste da droga vai ser baseado no nível sérico de vancomicina' }
    ],
    hepaticAdjustment: 'Sem ajuste',
    observations: 'Doses > 1 g devem ser administradas em 2h. Doses > 4 g/dia devem ser fracionadas a cada 8 h. Deve ser realizada a dosagem do nível sérico da vancomicina (vancocinemia) imediatamente antes da administração da 5ª dose da medicação e o nível sérico no vale deve estar em 15-20 mg/L - caso esse valor não tenha sido atingido, aumentar a dose da medicação; por outro lado, se estiver maior, diminuir a dose da medicação. Não é mais recomendado dosar vancocinemia no pico.'
  },
  {
    id: 'voriconazol',
    name: 'Voriconazol',
    normalDose: 'Aspergilose invasiva e infecções graves: ataque de 6 mg/kg, a cada 12 h, por 24 h (2 doses) e, depois, 4 mg/kg, a cada 12 h',
    renalAdjustments: [
      { range: '>50-90 mL/min', adjustment: 'Sem ajuste' },
      { range: '10-50 mL/min', adjustment: 'Não recomendada administração EV por causa da ciclodextrina (veículo de diluição). Usar formulação VO (comp)' },
      { range: '<10 mL/min', adjustment: 'Não recomendada administração EV por causa da ciclodextrina (veículo de diluição). Usar formulação VO (comp)' },
      { range: 'Diálise', adjustment: 'Não recomendada administração EV por causa da ciclodextrina (veículo de diluição). Usar formulação VO (comp)' }
    ],
    hepaticAdjustment: 'Reduzir a dose de manutenção pela metade em insuficiência hepática leve a moderada. Uso não recomendado em insuficiência hepática grave',
    observations: 'Tem a vantagem de possuir formulação EV e VO, o que permite a troca da medicação para VO na programação de alta do paciente. O ideal é dosar o nível sérico da droga, mas poucos laboratórios dispõem desse exame.'
  }
];

export default function AjusteDoseAntibioticoScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<Antibiotic | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredAntibiotics = useMemo(() => {
    if (!searchTerm) return [];
    return antibiotics.filter(antibiotic =>
      antibiotic.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Show max 5 suggestions
  }, [searchTerm]);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    setShowSuggestions(text.length > 0);
    if (text.length === 0) {
      setSelectedAntibiotic(null);
    }
  };

  const handleSelectAntibiotic = (antibiotic: Antibiotic) => {
    setSelectedAntibiotic(antibiotic);
    setSearchTerm(antibiotic.name);
    setShowSuggestions(false);
  };

  const clearSelection = () => {
    setSelectedAntibiotic(null);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const renderSuggestionItem = ({ item }: { item: Antibiotic }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectAntibiotic(item)}
    >
      <Pill size={20} color={theme.colors.calculator} />
      <Text style={styles.suggestionText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Ajuste de Dose de Antibiótico" type="calculator" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              <Pill size={20} color={theme.colors.calculator} /> Calculadora de Ajuste de Dose
            </Text>
            <Text style={styles.infoText}>
              Pesquise o antibiótico desejado para obter informações sobre ajuste de dose conforme função renal e hepática.
            </Text>
          </View>

          <View style={styles.searchContainer}>
            <Text style={styles.label}>Pesquisar Antibiótico</Text>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Digite o nome do antibiótico (ex: Van...)"
                value={searchTerm}
                onChangeText={handleSearch}
                onFocus={() => setShowSuggestions(searchTerm.length > 0)}
              />
              {selectedAntibiotic && (
                <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {showSuggestions && filteredAntibiotics.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={filteredAntibiotics}
                  renderItem={renderSuggestionItem}
                  keyExtractor={(item) => item.id}
                  style={styles.suggestionsList}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}
          </View>

          {selectedAntibiotic && (
            <View style={styles.resultContainer}>
              <View style={[styles.medicationCard, { borderColor: theme.colors.calculator }]}>
                <View style={[styles.medicationHeader, { backgroundColor: theme.colors.calculator }]}>
                  <Pill size={24} color="white" />
                  <Text style={styles.medicationName}>{selectedAntibiotic.name}</Text>
                </View>

                <View style={styles.medicationContent}>
                  <View style={styles.doseSection}>
                    <Text style={styles.sectionTitle}>
                      <Activity size={18} color={theme.colors.calculator} /> Dose Habitual (Função Renal Normal)
                    </Text>
                    <Text style={styles.doseText}>{selectedAntibiotic.normalDose}</Text>
                  </View>

                  <View style={styles.adjustmentSection}>
                    <Text style={styles.sectionTitle}>
                      <Droplets size={18} color="#2196F3" /> Ajuste para Insuficiência Renal
                    </Text>
                    {selectedAntibiotic.renalAdjustments.map((adjustment, index) => (
                      <View key={index} style={styles.adjustmentItem}>
                        <Text style={styles.adjustmentLabel}>{adjustment.range}:</Text>
                        <Text style={styles.adjustmentValue}>{adjustment.adjustment}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.hepaticSection}>
                    <Text style={styles.sectionTitle}>
                      <Activity size={18} color="#FF9800" /> Ajuste para Insuficiência Hepática
                    </Text>
                    <Text style={styles.hepaticText}>{selectedAntibiotic.hepaticAdjustment}</Text>
                  </View>

                  {selectedAntibiotic.observations && (
                    <View style={styles.observationsSection}>
                      <Text style={styles.sectionTitle}>
                        <Info size={18} color="#4CAF50" /> Observações
                      </Text>
                      <Text style={styles.observationsText}>{selectedAntibiotic.observations}</Text>
                    </View>
                  )}

                  {selectedAntibiotic.preparation && (
                    <View style={styles.preparationSection}>
                      <Text style={styles.sectionTitle}>
                        <Clock size={18} color="#9C27B0" /> Preparo / Diluição / Administração
                      </Text>
                      
                      {selectedAntibiotic.preparation.reconstitution && (
                        <View style={styles.preparationItem}>
                          <Text style={styles.preparationLabel}>Reconstituição:</Text>
                          <Text style={styles.preparationValue}>{selectedAntibiotic.preparation.reconstitution}</Text>
                        </View>
                      )}
                      
                      {selectedAntibiotic.preparation.dilution && (
                        <View style={styles.preparationItem}>
                          <Text style={styles.preparationLabel}>Diluição:</Text>
                          <Text style={styles.preparationValue}>{selectedAntibiotic.preparation.dilution}</Text>
                        </View>
                      )}
                      
                      {selectedAntibiotic.preparation.maxConcentration && (
                        <View style={styles.preparationItem}>
                          <Text style={styles.preparationLabel}>Concentração máxima:</Text>
                          <Text style={styles.preparationValue}>{selectedAntibiotic.preparation.maxConcentration}</Text>
                        </View>
                      )}
                      
                      {selectedAntibiotic.preparation.administration && (
                        <View style={styles.preparationItem}>
                          <Text style={styles.preparationLabel}>Administração:</Text>
                          <Text style={styles.preparationValue}>{selectedAntibiotic.preparation.administration}</Text>
                        </View>
                      )}
                      
                      {selectedAntibiotic.preparation.specificCare && (
                        <View style={styles.preparationItem}>
                          <Text style={styles.preparationLabel}>Cuidados Específicos:</Text>
                          <Text style={styles.preparationValue}>{selectedAntibiotic.preparation.specificCare}</Text>
                        </View>
                      )}
                      
                      {selectedAntibiotic.preparation.monitoring && (
                        <View style={styles.preparationItem}>
                          <Text style={styles.preparationLabel}>Monitoramento:</Text>
                          <Text style={styles.preparationValue}>{selectedAntibiotic.preparation.monitoring}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>
                  <AlertTriangle size={20} color="#FF5722" /> Importante
                </Text>
                <Text style={styles.warningText}>
                  • Sempre considerar o quadro clínico do paciente{'\n'}
                  • Monitorar função renal e hepática durante o tratamento{'\n'}
                  • Ajustar doses conforme resposta clínica{'\n'}
                  • Considerar interações medicamentosas{'\n'}
                  • Em caso de dúvida, consultar infectologista ou farmacêutico clínico
                </Text>
              </View>
            </View>
          )}

          {!selectedAntibiotic && searchTerm.length === 0 && (
            <View style={styles.placeholderContainer}>
              <Pill size={48} color={theme.colors.textSecondary} />
              <Text style={styles.placeholderTitle}>Pesquise um Antibiótico</Text>
              <Text style={styles.placeholderText}>
                Digite o nome do antibiótico na barra de pesquisa acima para obter informações sobre ajuste de dose.
              </Text>
            </View>
          )}

          {!selectedAntibiotic && searchTerm.length > 0 && filteredAntibiotics.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Search size={48} color={theme.colors.textSecondary} />
              <Text style={styles.noResultsTitle}>Nenhum resultado encontrado</Text>
              <Text style={styles.noResultsText}>
                Não foi possível encontrar "{searchTerm}" na base de dados. Verifique a grafia ou tente outro termo.
              </Text>
            </View>
          )}
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
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.calculator,
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.calculator,
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  searchContainer: {
    marginBottom: theme.spacing.lg,
    position: 'relative',
    zIndex: 1000,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontFamily: 'Roboto-Regular',
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  clearButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  clearButtonText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto-Bold',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  suggestionText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  resultContainer: {
    gap: theme.spacing.lg,
  },
  medicationCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  medicationHeader: {
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  medicationName: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  medicationContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  doseSection: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  doseText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    lineHeight: 22,
  },
  adjustmentSection: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  adjustmentItem: {
    marginBottom: theme.spacing.sm,
  },
  adjustmentLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.xs,
  },
  adjustmentValue: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  hepaticSection: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  hepaticText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  observationsSection: {
    backgroundColor: '#F1F8E9',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  observationsText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  preparationSection: {
    backgroundColor: '#F3E5F5',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  preparationItem: {
    marginBottom: theme.spacing.sm,
  },
  preparationLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#7B1FA2',
    marginBottom: theme.spacing.xs,
  },
  preparationValue: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
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
    lineHeight: 20,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
  },
  placeholderTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  placeholderText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
  },
  noResultsTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  noResultsText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});