import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { Search, Pill, FileText } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { ScreenHeader } from '@/components/ScreenHeader';

// Base de dados de infecções pesquisáveis
const infectionsDatabase = [
  { id: 'pneumonia_comunitaria', name: 'Pneumonia Adquirida na Comunidade', keywords: ['pneumonia', 'comunitaria', 'pac', 'respiratorio', 'internacao', 'enfermaria', 'hospitalar'] },
  { id: 'pneumonia_aspirativa', name: 'Pneumonia Aspirativa', keywords: ['pneumonia', 'aspirativa', 'aspiracao', 'anaerobios', 'respiratorio'] },
  { id: 'exacerbacao_dpoc', name: 'Exacerbação de DPOC', keywords: ['dpoc', 'exacerbacao', 'doenca', 'pulmonar', 'obstrutiva', 'cronica', 'broncodilatador', 'corticoide', 'vni'] },
  { id: 'cistite', name: 'Cistite', keywords: ['cistite', 'infeccao', 'urinaria', 'itu', 'urina', 'baixa'] },
  { id: 'infeccao_urinaria', name: 'Infecção Urinária', keywords: ['infeccao', 'urinaria', 'itu', 'urina'] },
  { id: 'celulite', name: 'Celulite', keywords: ['celulite', 'pele', 'partes', 'moles', 'subcutaneo'] },
  { id: 'pneumonia_hospitalar', name: 'Pneumonia Hospitalar', keywords: ['pneumonia', 'hospitalar', 'nosocomial'] },
  { id: 'pielonefrite', name: 'Pielonefrite', keywords: ['pielonefrite', 'rim', 'renal', 'urinaria', 'alta'] },
  { id: 'prostatite_bacteriana_aguda', name: 'Prostatite Bacteriana Aguda', keywords: ['prostatite', 'prostata', 'bacteriana', 'aguda', 'urinaria'] },
  { id: 'abscesso', name: 'Abscesso', keywords: ['abscesso', 'pus', 'colecao'] },
  { id: 'diverticulite', name: 'Diverticulite', keywords: ['diverticulite', 'diverticulo', 'abdominal'] },
  { id: 'colecistite', name: 'Colecistite', keywords: ['colecistite', 'vesicula', 'biliar'] },
  { id: 'apendicite', name: 'Apendicite', keywords: ['apendicite', 'apendice', 'abdominal'] },
];

// Dados das antibioticoterapias para referência (será expandido posteriormente)
const treatmentDatabase = {
  // Exemplos iniciais - serão expandidos conforme suas necessidades
  pneumonia_comunitaria: {
    drug: 'Tratamento da Pneumonia Adquirida na Comunidade',
    dose: 'Tratamento Ambulatorial e Hospitalar',
    color: '#2196F3',
    indication: 'Tratamento baseado em diretrizes para pneumonia adquirida na comunidade em diferentes cenários clínicos.',
    ambulatorial: {
      titulo: '🏠 Tratamento Ambulatorial',
      descricao: 'Protocolo para pacientes que podem ser tratados em casa, dividido por presença de comorbidades.',
      pacientesSemComorbidades: {
        titulo: 'Pacientes SEM Comorbidades',
        descricao: 'Para indivíduos previamente hígidos e sem fatores de risco, o tratamento visa cobrir os patógenos mais comuns, como o Streptococcus pneumoniae.',
        primeiraLinha: {
          titulo: 'Primeira Linha (Beta-lactâmicos)',
          medicamentos: [
            {
              nome: 'Amoxicilina',
              dose: '1g, via oral, a cada 8 horas',
              observacao: 'Esta é frequentemente a opção preferencial.'
            },
            {
              nome: 'Amoxicilina-Clavulanato',
              dose: '875/125 mg, via oral, a cada 12 horas',
              observacao: 'Alternativa ao Amoxicilina quando necessário maior espectro.'
            }
          ]
        },
        alternativas: {
          titulo: 'Alternativas Terapêuticas',
          medicamentos: [
            {
              nome: 'Doxiciclina',
              dose: '100 mg, via oral, a cada 12 horas',
              observacao: 'É uma excelente opção, especialmente em casos de alergia a penicilinas.'
            },
            {
              nome: 'Macrolídeos (Azitromicina, Claritromicina)',
              dose: 'Azitromicina 500mg/dia ou Claritromicina 500mg 12/12h',
              observacao: 'Embora listados em alguns protocolos, seu uso como monoterapia no Brasil é desaconselhado devido às altas taxas de resistência do pneumococo.'
            },
            {
              nome: 'Fluoroquinolonas Respiratórias (Levofloxacino, Moxifloxacino)',
              dose: 'Levofloxacino 750mg/dia ou Moxifloxacino 400mg/dia',
              observacao: 'Devem ser reservadas como opção de exceção, para casos onde outras terapias são contraindicadas. O uso rotineiro deve ser evitado para prevenir o aumento da resistência e devido a potenciais efeitos colaterais.'
            }
          ]
        },
        duracao: 'O ciclo de tratamento dura, em média, de 5 a 7 dias. A Azitromicina, quando utilizada, pode ter um curso de 3 a 5 dias.'
      },
      pacientesComComorbidades: {
        titulo: 'Pacientes COM Comorbidades ou Fatores de Risco*',
        descricao: 'Para pacientes com doenças crônicas ou uso recente de antibióticos, o esquema terapêutico precisa ter um espectro de ação mais amplo para cobrir tanto bactérias típicas quanto atípicas.',
        definicaoComorbidades: '*Definição de Comorbidades e Fatores de Risco: Incluem doenças crônicas cardíacas, pulmonares (DPOC), renais ou hepáticas, diabetes mellitus, alcoolismo, asplenia (ausência de baço), neoplasias ou uso de antibióticos nos últimos 3 meses.',
        opcaoPreferencial: {
          titulo: 'Opção Preferencial (Terapia Dupla: Beta-lactâmico + Macrolídeo)',
          descricao: 'A associação de dois antibióticos é a estratégia de primeira linha.',
          combinacoes: [
            {
              nome: 'Amoxicilina-Clavulanato + Azitromicina',
              dose: 'Amoxicilina-Clavulanato (875/125 mg 12/12h) + Azitromicina (500 mg 1x/dia por 3 dias ou 500 mg no 1º dia e 250 mg do 2º ao 5º dia)'
            },
            {
              nome: 'Amoxicilina-Clavulanato + Claritromicina',
              dose: 'Amoxicilina-Clavulanato (875/125 mg 12/12h) + Claritromicina (500 mg 12/12h)'
            },
            {
              nome: 'Cefuroxima + Azitromicina OU Claritromicina',
              dose: 'Como alternativa ao Amoxicilina-Clavulanato, a Cefuroxima (500 mg 12/12h) pode ser utilizada em combinação com Azitromicina ou Claritromicina.'
            }
          ]
        },
        alternativa: {
          titulo: 'Alternativa (Monoterapia com Fluoroquinolona Respiratória)',
          descricao: 'Indicada quando a terapia dupla não é viável ou em casos de alergia.',
          medicamentos: [
            {
              nome: 'Levofloxacino',
              dose: '750 mg, via oral, uma vez ao dia'
            },
            {
              nome: 'Moxifloxacino',
              dose: '400 mg, via oral, uma vez ao dia'
            }
          ]
        },
        duracao: 'O tempo mínimo de tratamento recomendado é de 5 dias, devendo ser mantido até que o paciente apresente melhora dos parâmetros infecciosos e estabilidade clínica.'
      }
    },
    internacao: {
      titulo: '🏥 Tratamento Hospitalar - Internação em Enfermaria',
      descricao: 'Protocolo para pacientes com pneumonia comunitária que necessitam de internação hospitalar em enfermaria.',
      opcaoPreferencial: {
        titulo: 'Opção Preferencial (Terapia Dupla: Beta-lactâmico + Macrolídeo)',
        descricao: 'Esta é a combinação de primeira linha na maioria dos cenários hospitalares.',
        betaLactamicoPrincipal: {
          titulo: 'Beta-lactâmico Principal',
          medicamento: {
            nome: 'Ceftriaxona',
            dose: '1g IV de 12 em 12 horas OU 2g IV, uma vez ao dia'
          }
        },
        alternativasBetaLactamico: {
          titulo: 'Alternativas à Ceftriaxona (outros Beta-lactâmicos) + Macrolídeo',
          medicamentos: [
            {
              nome: 'Ampicilina + Sulbactam + Macrolídeo',
              dose: '💉 BETA-LACTÂMICO:\n1,5 a 3g EV, a cada 6 horas\n\n🔗 ASSOCIAR MACROLÍDEO (Escolha uma opção):\n• Azitromicina 500mg EV/VO 1x/dia por 3-5 dias\n\nOU\n\n• Claritromicina 500mg EV/VO 12/12h'
            },
            {
              nome: 'Amoxicilina + Clavulanato (EV ou VO) + Macrolídeo',
              dose: '💉 BETA-LACTÂMICO:\n500mg/125mg a cada 8 horas ou 875mg/125mg a cada 12 horas\n\n🔗 ASSOCIAR MACROLÍDEO (Escolha uma opção):\n• Azitromicina 500mg EV/VO 1x/dia por 3-5 dias\n\nOU\n\n• Claritromicina 500mg EV/VO 12/12h'
            },
            {
              nome: 'Cefuroxima (EV) + Macrolídeo',
              dose: '💉 BETA-LACTÂMICO:\n500mg a cada 12 horas\n\n🔗 ASSOCIAR MACROLÍDEO (Escolha uma opção):\n• Azitromicina 500mg EV/VO 1x/dia por 3-5 dias\n\nOU\n\n• Claritromicina 500mg EV/VO 12/12h'
            }
          ]
        },
        macrolideos: {
          titulo: '🔗 Associado a Macrolídeo (Escolha uma opção)',
          medicamentos: [
            {
              nome: 'Azitromicina',
              dose: '500mg EV ou VO, uma vez ao dia, por 3 a 5 dias'
            },
            {
              nome: 'Claritromicina',
              dose: '500mg EV ou VO, a cada 12 horas'
            }
          ]
        }
      },
      alternativaMonoterapia: {
        titulo: 'Alternativa (Monoterapia com Fluoroquinolona Respiratória)',
        descricao: 'Indicada principalmente em casos de alergia grave a beta-lactâmicos.',
        medicamentos: [
          {
            nome: 'Levofloxacino',
            dose: '750mg EV/VO, uma vez ao dia OU 500mg EV, uma vez ao dia'
          },
          {
            nome: 'Moxifloxacino',
            dose: '400mg EV/VO, uma vez ao dia'
          }
        ],
        atencao: 'A monoterapia com fluoroquinolona não é recomendada para pacientes internados em UTI.'
        },
        duracao: {
          padrao: 'O tempo de tratamento padrão para pacientes internados é de 7 dias.',
          curto: 'Um ciclo mais curto, com um mínimo de 5 dias, pode ser suficiente, desde que o paciente esteja afebril por 48-72 horas e apresente melhora significativa dos parâmetros clínicos e infecciosos.'
        },
        situacoesEspeciais: {
          titulo: 'Situações Especiais - P. aeruginosa e MRSA',
          descricao: 'Cobertura empírica específica para pacientes com fatores de risco para patógenos resistentes.',
          pseudomonas: {
            titulo: '1. Cobertura para Pseudomonas aeruginosa',
            descricao: 'A cobertura antipseudomonas é indicada para pacientes com fatores de risco específicos.',
            quando: {
              titulo: 'Quando Considerar a Cobertura?',
              descricao: 'A cobertura deve ser fortemente considerada se o paciente apresentar um ou mais dos seguintes fatores:',
              fatores: [
                {
                  categoria: 'Histórico Microbiológico',
                  item: 'Infecção ou colonização pulmonar prévia por P. aeruginosa'
                },
                {
                  categoria: 'Doenças Pulmonares Estruturais',
                  item: 'Presença de bronquiectasia, fibrose cística ou doença pulmonar obstrutiva crônica (DPOC) grave (com VEF₁ < 30%)'
                },
                {
                  categoria: 'Fatores Clínicos e de Exposição',
                  item: 'Traqueostomia, hospitalização prévia nos últimos 90 dias, uso de antibioticoterapia endovenosa nos últimos 90 dias, uso frequente de glicocorticoides, estado de imunossupressão'
                },
                {
                  categoria: 'Achados Laboratoriais',
                  item: 'Visualização de bacilos gram-negativos na coloração de Gram do escarro'
                }
              ]
            },
            como: {
              titulo: 'Como Realizar a Cobertura (Opções Terapêuticas)?',
              descricao: 'Os seguintes antibióticos intravenosos oferecem excelente cobertura antipseudomonas:',
              medicamentos: [
                {
                  nome: 'Piperacilina-tazobactam',
                  dose: '4,5 g a cada 6 horas'
                },
                {
                  nome: 'Cefepime',
                  dose: '2 g a cada 8 horas'
                },
                {
                  nome: 'Meropenem',
                  dose: '1 g a cada 8 horas'
                },
                {
                  nome: 'Imipenem',
                  dose: '500 mg a cada 6 horas'
                },
                {
                  nome: 'Levofloxacino',
                  dose: '750 mg uma vez ao dia'
                }
              ]
            }
          },
          mrsa: {
            titulo: '2. Cobertura para Staphylococcus aureus Resistente à Meticilina (MRSA)',
            descricao: 'A cobertura empírica para MRSA é reservada para pacientes com fatores de risco específicos ou quadros clínicos sugestivos.',
            quando: {
              titulo: 'Quando Considerar a Cobertura?',
              descricao: 'A terapia anti-MRSA deve ser iniciada nos seguintes cenários:',
              fatores: [
                {
                  categoria: 'Achados Microbiológicos',
                  item: 'Colonização prévia conhecida por MRSA ou visualização de cocos gram-positivos no exame de Gram do escarro'
                },
                {
                  categoria: 'Fatores de Risco para Colonização',
                  item: 'Doença renal crônica em estágio terminal (em diálise), uso de drogas injetáveis, contato físico próximo em esportes ou vida em ambientes de aglomeração (ex: população carcerária)'
                },
                {
                  categoria: 'Exposição Recente a Antibióticos',
                  item: 'Terapia antimicrobiana nos últimos três meses, especialmente com o uso de fluoroquinolonas'
                },
                {
                  categoria: 'Apresentação Clínica Grave',
                  item: 'Quadros de pneumonia necrosante, formação de cavidades pulmonares ou presença de empiema'
                }
              ]
            },
            como: {
              titulo: 'Como Realizar a Cobertura (Opções Terapêuticas)?',
              descricao: 'As duas principais opções intravenosas são:',
              medicamentos: [
                {
                  nome: 'Vancomicina',
                  dose: 'Iniciar com uma dose de ataque de 20 a 35 mg/kg, seguida por uma dose de manutenção de 15 a 20 mg/kg a cada 8 ou 12 horas',
                  observacao: 'É fundamental monitorar os níveis séricos do medicamento (vancomicinemia) para garantir eficácia e segurança'
                },
                {
                  nome: 'Linezolida',
                  dose: '600 mg a cada 12 horas'
                }
              ]
            }
          }
        }
      },
      situacoesEspecificas: {
      titulo: 'Situações Específicas',
      casos: [
        {
          situacao: 'Alergia à Penicilina',
          tratamento: 'As opções incluem Doxiciclina ou uma Fluoroquinolona respiratória (Levofloxacino/Moxifloxacino).'
        },
        {
          situacao: 'Gestantes',
          tratamento: 'Preferir Penicilinas, Cefalosporinas e alguns Macrolídeos (Azitromicina - Categoria B). Evitar Doxiciclina (Categoria X) e Claritromicina (Categoria D).'
        },
        {
          situacao: 'Lactantes',
          tratamento: 'Penicilinas, Cefalosporinas e Macrolídeos são geralmente preferíveis. Levofloxacino e Doxiciclina devem ser usados com critério.'
        }
      ]
    }
  },
  cistite: {
    drug: 'Tratamento da Cistite',
    dose: 'Opções de Primeira e Segunda Linha',
    color: '#FF9800',
    indication: 'Tratamento baseado em diretrizes para cistite não complicada.',
    primeiraLinha: [
      {
        nome: 'Sulfametoxazol-Trimetoprima',
        dose: '800/160mg a cada 12 horas por 7 dias',
        observacao: 'Escolha tradicional e eficaz em muitas localidades'
      },
      {
        nome: 'Fosfomicina',
        dose: '3g (1 sachê) em dose única',
        observacao: 'Administrar à noite com bexiga vazia. Pode não estar disponível no SUS'
      },
      {
        nome: 'Nitrofurantoína', 
        dose: '100mg a cada 6 horas por 5 dias',
        observacao: 'Evitar após 37ª semana de gestação. Baixa adesão pela frequência'
      }
    ],
    segundaLinha: [
      {
        nome: 'Amoxicilina-Clavulanato',
        dose: '500/125mg a cada 8h ou 875/125mg a cada 12h por 7 dias'
      },
      {
        nome: 'Cefuroxima',
        dose: '250mg a cada 12 horas por 7 dias'
      },
      {
        nome: 'Norfloxacino',
        dose: '400mg a cada 12 horas por 7 dias'
      },
      {
        nome: 'Ácido Nalidíxico',
        dose: '500mg a cada 6 horas por 7 dias'
      }
    ],
    sintomatico: {
      nome: 'Fenazopiridina',
      dose: '200mg, 3x ao dia por máximo 48 horas',
      observacao: 'Para alívio de dor e ardência. Não trata a infecção'
    },
    duracao: {
      mulheres: 'Mulheres não gestantes podem ser avaliadas para tratamento por 3 dias',
      gestantes: 'Gestantes necessitam de urocultura e urina 1 de controle 2-4 semanas após o término do tratamento'
    }
  },
  pielonefrite: {
    drug: 'Tratamento da Pielonefrite',
    dose: 'Terapia Intravenosa e Oral',
    color: '#E91E63',
    indication: 'Tratamento baseado em diretrizes para pielonefrite - ITU alta.',
    abordagem: 'Devido à seriedade da infecção, o tratamento é frequentemente iniciado em ambiente hospitalar com antibióticos intravenosos. Esta estratégia garante a rápida obtenção de níveis terapêuticos do medicamento. A transição para a terapia oral (descalonamento) deve ser considerada após a melhora clínica do paciente e guiado por urocultura.',
    intravenoso: [
      {
        categoria: 'Primeira Escolha',
        medicamentos: [
          {
            nome: 'Ceftriaxona',
            dose: '1g a cada 12 horas por 7 a 10 dias',
            observacao: 'Escolha primária comum. Eficaz em monoterapia. Pode ser usado em hospital dia'
          },
          {
            nome: 'Ciprofloxacino',
            dose: '400mg a cada 12 horas',
            observacao: 'Alta resistência bacteriana. Idealmente usado guiado por urocultura'
          }
        ]
      },
      {
        categoria: 'Aminoglicosídeos (Caso de suspeita de resistência ou guiado por urocultura)',
        medicamentos: [
          {
            nome: 'Gentamicina',
            dose: '5 a 7,5 mg/kg uma vez ao dia por 7 a 10 dias',
            observacao: 'Excelente opção, especialmente em caso de suspeita de resistência'
          },
          {
            nome: 'Amicacina',
            dose: '15 a 20 mg/kg uma vez ao dia por 7 a 10 dias',
            observacao: 'Excelente opção, especialmente em caso de suspeita de resistência'
          }
        ]
      },
      {
        categoria: 'Amplo Espectro (Para casos graves, escalonamento terapêutico ou suspeita de multirresistência)',
        medicamentos: [
          {
            nome: 'Piperacilina-Tazobactam',
            dose: '4,5g a cada 6 horas por 10 a 14 dias',
            observacao: 'Reservado para uso intra-hospitalar'
          },
          {
            nome: 'Ertapenem',
            dose: '1g a cada 24 horas por 7 a 10 dias',
            observacao: 'Carbapenêmico para resistência complexa, idealmente guiado por cultura'
          },
          {
            nome: 'Meropenem',
            dose: '1g a cada 8 horas por 7 a 10 dias',
            observacao: 'Carbapenêmico para resistência complexa, idealmente guiado por cultura'
          }
        ]
      }
    ],
    oral: [
      {
        nome: 'Ciprofloxacino',
        dose: '500mg a cada 12 horas por 7 dias',
        observacao: 'Para casos leves ou em melhora clínica importante, idealmente guiado por urocultura'
      },
      {
        nome: 'Levofloxacino',
        dose: '750mg uma vez ao dia por 5 dias',
        observacao: 'Para casos leves ou em melhora clínica importante, idealmente guiado por urocultura'
      },
      {
        nome: 'Sulfametoxazol-Trimetoprima',
        dose: '800/160mg a cada 12 horas por 10 a 14 dias',
        observacao: 'Para casos leves ou em melhora clínica importante, idealmente guiado por urocultura'
      },
      {
        nome: 'Amoxicilina-Clavulanato',
        dose: '875/125mg a cada 12 horas por 10 a 14 dias',
        observacao: 'Para casos leves ou em melhora clínica importante, idealmente guiado por urocultura'
      }
    ],
    duracao: {
      padrao: 'Tratamento geralmente dura de 7 a 10 dias para a maioria dos antibióticos',
      levofloxacino: 'Levofloxacino: curso mais curto de 5 dias demonstrou eficácia',
      complicada: 'Casos graves ou complicados podem exigir tratamento de até 14 dias'
    },
    examesImagem: {
      titulo: 'Sugestão de quando solicitar exame de imagem',
      indicacoes: [
        'Sem melhora clínica em 48 a 72 horas',
        'Sepse',
        'Recorrência',
        'História prévia ou suspeita de cálculo',
        'pH urinário > 7,0',
        'Queda da taxa de filtração glomerular para < 40 ml/min',
        'Dúvida diagnóstica'
      ]
    }
  },
  prostatite_bacteriana_aguda: {
    drug: 'Tratamento da Prostatite Bacteriana Aguda',
    dose: 'Terapia Prolongada - 2 a 6 semanas',
    color: '#0891B2',
    indication: 'A característica fundamental do tratamento da prostatite aguda é a sua longa duração, devido à dificuldade de penetração dos antibióticos no tecido prostático. O tempo médio de tratamento é de 4 semanas, podendo variar de 2 a 6 semanas dependendo da evolução clínica e do antimicrobiano escolhido.',
    prostatiteNaoComplicada: {
      titulo: 'Prostatite Aguda Não Complicada',
      primeiraEscolha: {
        titulo: 'Tratamento Recomendado',
        descricao: 'As fluoroquinolonas são a primeira escolha devido à sua excelente penetração na próstata.',
        medicamentos: [
          {
            nome: 'Ciprofloxacino',
            dose: '500mg a cada 12 horas, por 2 a 6 semanas'
          },
          {
            nome: 'Levofloxacino',
            dose: '500 a 750mg a cada 24 horas, por 2 a 6 semanas'
          },
          {
            nome: 'Ofloxacino',
            dose: '200mg a cada 12 horas, com duração média de 4 semanas'
          }
        ]
      },
      alternativo: {
        titulo: 'Tratamento Alternativo',
        medicamentos: [
          {
            nome: 'Sulfametoxazol-Trimetoprima',
            dose: '800/160mg a cada 12 horas. A duração do tratamento é de aproximadamente 4 semanas'
          },
          {
            nome: 'Ceftriaxona',
            dose: 'Pode ser usada como terapia inicial na dose de 1g (IV ou IM) a cada 12 horas, seguida pela antibioticoterapia oral'
          }
        ]
      }
    },
    prostatiteComplicada: {
      titulo: 'Prostatite Aguda Complicada',
      descricao: 'Para pacientes com quadro clínico mais grave, febre alta, ou incapacidade de tolerar medicação oral, o tratamento intravenoso inicial é mandatório.',
      monoterapia: {
        titulo: 'Tratamento Recomendado (Monoterapia)',
        medicamentos: [
          {
            nome: 'Ciprofloxacino',
            dose: '400mg a cada 12 horas, com duração total do tratamento (IV + oral) de 2 a 6 semanas'
          },
          {
            nome: 'Levofloxacino',
            dose: '500 a 750mg a cada 24 horas, com duração total do tratamento (IV + oral) de 2 a 6 semanas'
          },
          {
            nome: 'Ofloxacino',
            dose: '200mg a cada 12 horas, com duração média de 4 semanas'
          }
        ]
      },
      combinado: {
        titulo: 'Tratamento Alternativo ou Combinado',
        descricao: 'Em casos de maior gravidade ou suspeita de resistência bacteriana, a terapia combinada é uma estratégia valiosa.',
        medicamentos: [
          {
            nome: 'Ceftriaxona + Gentamicina',
            dose: 'Ceftriaxona (1g IV 12/12h) associada a Gentamicina na dose de 5 a 7,5 mg/kg a cada 24 horas, principalmente no início do tratamento. Após a melhora do paciente, o tratamento é completado por via oral (ex: Ciprofloxacino 500mg 12/12h) para atingir a duração total recomendada'
          },
          {
            nome: 'Piperacilina-Tazobactam',
            dose: 'Opção para casos graves ou com suspeita de resistência, na dose de 3,375g a cada 8 horas. Seu uso deve ser guiado por urocultura e restrito ao ambiente hospitalar'
          }
        ]
      }
    },
    avisoImportante: {
      titulo: 'Aviso Importante sobre as Fluoroquinolonas',
      texto: 'É essencial estar ciente do risco de ruptura de tendão ou tendinopatia associado ao uso de Ciprofloxacino e Levofloxacino. Os pacientes devem ser orientados a relatar qualquer dor ou inflamação nos tendões durante o tratamento.'
    }
  },
  pneumonia_aspirativa: {
    drug: 'Tratamento da Pneumonia Aspirativa',
    dose: 'Terapia com ou sem Cobertura Anaeróbia',
    color: '#FF5722',
    indication: 'Tratamento baseado em diretrizes para pneumonia aspirativa, considerando fatores de risco para anaeróbios.',
    controversia: {
      titulo: '🔬 Quando Cobrir Anaeróbios? (Controvérsia e Fatores de Risco)',
      descricao: 'A necessidade de cobrir anaeróbios na pneumonia aspirativa é um tema de debate entre as sociedades médicas.',
      diretrizes: [
        'A diretriz da Sociedade Europeia (ERS 2023) tende a não recomendar a cobertura anaeróbia de rotina, independentemente dos fatores de risco.',
        'Contudo, as diretrizes da Sociedade Americana (IDSA 2019) e da Sociedade Brasileira de Pneumologia (SBPT 2018) recomendam a cobertura para anaeróbios na presença dos seguintes fatores de risco:'
      ],
      fatoresRisco: [
        'Empiema (pus na cavidade pleural)',
        'Abscesso pulmonar',
        'Pneumonia necrosante',
        'Aspiração de conteúdo gástrico',
        'Doença periodontal (má higiene dentária) documentada',
        'Secreção pútrica (com odor fétido)'
      ]
    },
    semCoberturaAnaerobia: {
      titulo: '💊 Tratamento SEM Cobertura Anaeróbia',
      descricao: 'Para pacientes sem os fatores de risco listados acima.',
      medicamentos: [
        {
          nome: 'Levofloxacino',
          dose: '750 mg, 1x/dia (EV ou VO)'
        },
        {
          nome: 'Ceftriaxona',
          dose: '1 a 2 g, 1x/dia ou dividido em 2 doses (EV ou IM)'
        }
      ]
    },
    comCoberturaAnaerobia: {
      titulo: '🦠 Tratamento COM Cobertura Anaeróbia',
      descricao: 'Para pacientes com fatores de risco presentes.',
      monoterapia: {
        titulo: 'Monoterapia (drogas com cobertura inerente)',
        medicamentos: [
          {
            nome: 'Ampicilina + Sulbactam',
            dose: '1,5 a 3 g, EV, a cada 6 horas'
          },
          {
            nome: 'Amoxicilina + Clavulanato',
            dose: '875/125 mg, VO, a cada 12 horas (ou 500/125 mg a cada 8h)'
          },
          {
            nome: 'Moxifloxacino',
            dose: '400 mg, 1x/dia (EV ou VO)'
          }
        ]
      },
      terapiaCombinada: {
        titulo: 'Terapia Combinada (adicionar cobertura)',
        descricao: '',
        medicamentos: [
          {
            nome: 'Ceftriaxona + Clindamicina',
            dose: 'Ceftriaxona (1-2 g/dia) + Clindamicina (300 mg, EV ou VO, a cada 8 horas)'
          },
          {
            nome: 'Ceftriaxona + Metronidazol',
            dose: 'Ceftriaxona (1-2 g/dia) + Metronidazol (500 mg, EV ou VO, a cada 8 horas)'
          }
        ]
      }
    },
    duracao: {
      titulo: '⏱️ Duração do Tratamento',
      descricao: 'O tempo de tratamento recomendado é de, no mínimo, 5 dias, mas deve ser sempre guiado pela melhora dos parâmetros infecciosos e pela estabilidade clínica do paciente.'
    },
    situacoesEspecificas: {
      titulo: '⚕️ Situações Específicas',
      casos: [
        {
          situacao: 'Alergia à Penicilina',
          tratamento: 'A escolha é o Levofloxacino.\n\nSe houver necessidade de cobertura anaeróbia, pode-se optar pelo Moxifloxacino (que já possui cobertura) ou associar o Levofloxacino à Clindamicina ou ao Metronidazol.'
        },
        {
          situacao: 'Gestantes',
          tratamento: 'Opções: Amoxicilina + Clavulanato, Ampicilina + Sulbactam, Ceftriaxona e Clindamicina (todos Categoria B).\n\nEvitar: Metronidazol (Categoria X no 1º trimestre) e Levofloxacino (Categoria C).'
        },
        {
          situacao: 'Lactantes',
          tratamento: 'Opções: Amoxicilina + Clavulanato, Ampicilina + Sulbactam, Ceftriaxona, Metronidazol e Clindamicina.\n\nO uso de Levofloxacino deve ser feito de forma criteriosa.'
        }
      ]
    }
  },
  pneumonia_hospitalar: {
    drug: 'Tratamento da Pneumonia Hospitalar (PAH/PAVM)',
    dose: 'Antibioticoterapia Empírica Baseada em Fatores de Risco',
    color: '#D32F2F',
    indication: 'Tratamento para pneumonia adquirida no hospital (PAH), pneumonia associada à ventilação mecânica (PAVM) e traqueobronquite associada à ventilação mecânica (TAVM).',
    conceitosFundamentais: {
      titulo: '📚 Conceitos Fundamentais e Diagnóstico',
      descricao: 'Definições clínicas essenciais para orientar o diagnóstico e tratamento.',
      conceitos: [
        {
          nome: 'Pneumonia Adquirida no Hospital (PAH)',
          definicao: 'Refere-se a um quadro infeccioso pulmonar que se manifesta após 48 horas do início da internação. O diagnóstico é sugerido pela combinação de um novo infiltrado radiológico com pelo menos dois dos seguintes achados: febre, expectoração purulenta, leucocitose ou queda na saturação de oxigênio.'
        },
        {
          nome: 'Pneumonia Associada à Ventilação Mecânica (PAVM)',
          definicao: 'É a pneumonia que se desenvolve após 48 horas da intubação orotraqueal. Os critérios diagnósticos são os mesmos da PAH. Em ambos os casos, a coleta de culturas (hemocultura e secreção traqueal) é recomendada.'
        },
        {
          nome: 'Traqueobronquite Associada à Ventilação Mecânica (TAVM)',
          definicao: 'Condição que surge após 48 horas de intubação, caracterizada por sinais de infecção respiratória (febre, secreção purulenta, piora de parâmetros ventilatórios) sem a presença de um novo infiltrado pulmonar na radiografia.'
        }
      ]
    },
    agentesEtiologicos: {
      titulo: '🦠 Agentes Etiológicos e Fatores de Risco para Multirresistência (MDR)',
      descricao: 'A etiologia da PAH/PAVM é tipicamente polimicrobiana, envolvendo patógenos do ambiente hospitalar cuja prevalência varia conforme a flora local.',
      agentesComuns: [
        'Pseudomonas aeruginosa',
        'Acinetobacter spp.',
        'Staphylococcus aureus (incluindo MRSA)',
        'Klebsiella pneumoniae',
        'E. coli',
        'Enterobacter spp.'
      ],
      fatoresRiscoMDR: {
        titulo: 'Fatores de Risco para Germes Multirresistentes (MDR)',
        descricao: 'A suspeita deve ser alta em pacientes com os seguintes fatores de risco:',
        fatores: [
          'Uso prévio de antibióticos intravenosos nos últimos 90 dias',
          'Choque séptico no contexto da pneumonia',
          'Síndrome do Desconforto Respiratório Agudo (SDRA) associada',
          'Período de hospitalização de 5 dias ou mais antes do início da pneumonia',
          'Terapia de substituição renal (hemodiálise) precedente'
        ]
      }
    },
    guiaTerapeutico: {
      titulo: '💊 Guia Terapêutico',
      principioFundamental: {
        titulo: 'Princípio Fundamental',
        descricao: 'O tratamento deve ser, sempre que possível, guiado pelos resultados de culturas e pelo perfil de sensibilidade da flora microbiana local. A discussão com a Comissão de Controle de Infecção Hospitalar (CCIH) da instituição é crucial para a escolha do esquema empírico mais adequado.'
      },
      tratamentoEmpiricoSemMDR: {
        titulo: '🏥 Tratamento Empírico Inicial (Sem Fatores de Risco para MDR)',
        descricao: 'Para pacientes sem os fatores de risco citados, um esquema empírico inicial pode incluir uma das seguintes opções em monoterapia:',
        medicamentos: [
          {
            nome: 'Piperacilina-Tazobactam',
            dose: '4,5g IV a cada 6 horas'
          },
          {
            nome: 'Cefepime',
            dose: '2g IV a cada 8 horas'
          },
          {
            nome: 'Levofloxacino',
            dose: '750mg IV uma vez ao dia'
          }
        ]
      },
      tratamentoComMDR: {
        titulo: '🚨 Abordagem para Pacientes com Fatores de Risco para MDR',
        descricao: 'Nestes casos, recomenda-se uma terapia combinada para garantir uma ampla cobertura. O esquema geralmente envolve a associação de diferentes classes de antibióticos:',
        passo1: {
          titulo: 'PASSO 1: Escolher UMA base com ação antipseudomonas',
          medicamentos: [
            {
              nome: 'Piperacilina-Tazobactam',
              dose: '4,5g IV a cada 6 horas'
            },
            {
              nome: 'Cefepime',
              dose: '2g IV a cada 8 horas'
            },
            {
              nome: 'Ceftazidime',
              dose: '2g IV a cada 8 horas'
            },
            {
              nome: 'Imipenem',
              dose: '500mg IV a cada 6 horas'
            },
            {
              nome: 'Meropenem',
              dose: '1g IV a cada 8 horas'
            },
            {
              nome: 'Aztreonam',
              dose: '2g IV a cada 8 horas'
            }
          ]
        },
        passo2: {
          titulo: 'PASSO 2: ASSOCIAR com UM segundo agente contra Gram-negativos',
          medicamentos: [
            {
              nome: 'Amicacina',
              dose: '15 a 20 mg/kg IV uma vez ao dia'
            },
            {
              nome: 'Gentamicina ou Tobramicina',
              dose: '5 a 7 mg/kg IV uma vez ao dia'
            },
            {
              nome: 'Levofloxacino',
              dose: '750mg IV uma vez ao dia',
              observacao: 'Considerar especialmente se houver alta probabilidade de Legionella'
            }
          ]
        },
        passo3: {
          titulo: 'PASSO 3: E ASSOCIAR cobertura para MRSA, se houver suspeita',
          medicamentos: [
            {
              nome: 'Linezolida',
              dose: '600mg IV a cada 12 horas'
            },
            {
              nome: 'Vancomicina',
              dose: 'Dose de ataque de 20 a 35 mg/kg, seguida de 15 a 20 mg/kg a cada 8 a 12 horas',
              observacao: 'Requer monitoramento dos níveis séricos'
            }
          ]
        }
      }
    },
    manejoTAVM: {
      titulo: '🫁 Manejo da Traqueobronquite Associada à Ventilação Mecânica (TAVM)',
      descricao: 'O tratamento da TAVM é controverso, pois não há consenso na literatura. A decisão de tratar deve ser individualizada.',
      criterios: 'A presença de alta carga bacteriana em culturas traqueais, associada a sinais sistêmicos de infecção, indica maior risco de progressão para PAVM.',
      recomendacao: 'Nesses cenários, a antibioticoterapia (guiada pela flora local) deve ser considerada para reduzir esse risco.'
    }
  },
  exacerbacao_dpoc: {
    drug: 'Tratamento da Exacerbação de DPOC',
    dose: 'Abordagem Multidisciplinar e Escalonada',
    color: '#607D8B',
    indication: 'Tratamento baseado em diretrizes para exacerbação da doença pulmonar obstrutiva crônica (DPOC).',
    definicao: {
      titulo: '📋 Definição e Diagnóstico',
      conceito: 'A exacerbação da DPOC é definida como uma piora aguda da dispneia, tosse e/ou produção de escarro, que pode ser acompanhada por taquipneia e taquicardia.',
      diagnosticoDiferencial: {
        titulo: 'Diagnósticos Diferenciais a Considerar',
        descricao: 'É crucial descartar outras condições:',
        condicoes: [
          'Pneumonia (caracterizada por nova opacidade/infiltrado no raio-x)',
          'Insuficiência Cardíaca',
          'Embolia Pulmonar (TEP)'
        ]
      },
      examesIniciais: {
        titulo: 'Exames Iniciais',
        exames: [
          {
            nome: 'Radiografia de Tórax',
            indicacao: 'Deve ser realizada sempre para excluir pneumonia e outras causas'
          },
          {
            nome: 'Gasometria Arterial',
            indicacao: 'Indicada se houver dessaturação (SatO₂ < 88%), suspeita de hipercapnia ou necessidade de ventilação não invasiva (VNI) ou intubação'
          }
        ]
      }
    },
    criteriosInternacao: {
      titulo: '🏥 Indicações para Internação Hospitalar',
      descricao: 'A decisão de hospitalizar o paciente deve ser baseada nos seguintes critérios:',
      criterios: [
        'Frequência respiratória (FR) > 30 irpm',
        'Uso de musculatura acessória',
        'PCO₂ > 60 mmHg',
        'Sintomas intensos mesmo em repouso',
        'Falha na terapia inicial',
        'Sinais clínicos como edema e cianose não explicados pela DPOC',
        'Comorbidades graves',
        'Vulnerabilidade social'
      ]
    },
    pilaresTratamento: {
      titulo: '💊 Pilares do Tratamento da Exacerbação',
      descricao: 'O tratamento deve seguir uma abordagem escalonada e sistemática:',
      passo1: {
        titulo: 'Passo 1: Broncodilatadores de Curta Ação (SABA e SAMA)',
        descricao: 'A base do tratamento é a otimização da broncodilatação.',
        inaladores: {
          titulo: 'Inaladores (Spray)',
          medicamentos: [
            {
              nome: 'Salbutamol (SABA)',
              dose: '2 a 4 jatos a cada 4-6 horas'
            },
            {
              nome: 'Fenoterol (SABA)',
              dose: '2 a 4 jatos a cada 4-6 horas'
            }
          ]
        },
        nebulizacao: {
          titulo: 'Nebulização',
          medicamentos: [
            {
              nome: 'Leve',
              dose: '10 gotas a cada 6/8 horas'
            },
            {
              nome: 'Moderado a Grave',
              dose: 'Iniciar com 20 gotas a cada 20 minutos na primeira hora, depois ajustar'
            }
          ]
        },
        associacao: {
          titulo: 'Associação (SABA + SAMA)',
          descricao: 'Pode-se associar Ipatrópio (SAMA), 2 jatos a cada 4-6 horas. Em casos graves, 4 a 8 jatos a cada 20 minutos na primeira hora.'
        }
      },
      passo2: {
        titulo: 'Passo 2: Manutenção dos Medicamentos de Longa Duração',
        descricao: 'Se o paciente já utiliza broncodilatadores de longa ação (LAMA, LABA), a terapia deve ser mantida.'
      },
      passo3: {
        titulo: 'Passo 3: Corticosteroides Sistêmicos',
        medicamento: {
          nome: 'Prednisona',
          dose: '40 mg, via oral, por 5 dias'
        }
      },
      passo4: {
        titulo: 'Passo 4: Antibioticoterapia (Quando Indicado)',
        descricao: 'A introdução de antibióticos é indicada na presença de purulência do escarro associada a pelo menos mais um dos seguintes critérios: piora da dispneia ou aumento do volume do escarro. A escolha depende do ambiente de tratamento e dos fatores de risco.'
      }
    },
    antibioticoterapia: {
      titulo: '💉 Antibioticoterapia',
      ambulatorial: {
        titulo: 'Tratamento AMBULATORIAL',
        semRisco: {
          titulo: 'Sem Risco de Desfecho Negativo',
          medicamentos: [
            {
              nome: 'Azitromicina',
              dose: '500 mg/dia por 3 a 5 dias'
            },
            {
              nome: 'Claritromicina',
              dose: '500 mg 12/12h por 3 a 5 dias'
            },
            {
              nome: 'Cefuroxima',
              dose: '500 mg 12/12h por 3 a 7 dias'
            }
          ]
        },
        comRisco: {
          titulo: 'Com Risco de Desfecho Negativo*',
          medicamentos: [
            {
              nome: 'Amoxicilina + Clavulanato',
              dose: '875/125mg 12/12h por 7 dias'
            }
          ]
        },
        riscoPseudomonas: {
          titulo: 'Com Risco de Pseudomonas**',
          medicamentos: [
            {
              nome: 'Levofloxacino',
              dose: '750 mg/dia por 5 a 7 dias'
            }
          ]
        }
      },
      hospitalar: {
        titulo: 'Tratamento HOSPITALAR (Internado)',
        esquemaPadrao: {
          titulo: 'Esquema Padrão',
          medicamentos: [
            {
              nome: 'Ceftriaxona',
              dose: '1g a 2g 12/12h por 5 a 7 dias'
            },
            {
              nome: 'Levofloxacino',
              dose: '750 mg/dia por 5 a 7 dias'
            }
          ]
        },
        riscoPseudomonas: {
          titulo: 'Com Fator de Risco para Pseudomonas** (Sempre coletar cultura de escarro)',
          empiricoInicial: {
            titulo: 'EMPÍRICO INICIAL',
            medicamentos: [
              {
                nome: 'Piperacilina+Tazobactam',
                dose: '4,5g 6/6h'
              },
              {
                nome: 'Cefepime',
                dose: '2g 8/8h'
              }
            ]
          },
          escalonamento: {
            titulo: 'SE NECESSIDADE DE ESCALONAMENTO',
            medicamentos: [
              {
                nome: 'Meropenem',
                dose: '1g 8/8h'
              },
              {
                nome: 'Imipenem',
                dose: '1g 8/8h'
              }
            ]
          }
        }
      },
      fatoresRisco: {
        desfechoNegativo: {
          titulo: '*Risco de desfecho negativo',
          fatores: [
            'Comorbidades graves (ICC, coronariopatia)',
            'VEF₁<50%',
            'uso de O₂ domiciliar',
            'histórico de exacerbações/internações prévias'
          ]
        },
        pseudomonas: {
          titulo: '**Risco de Pseudomonas',
          fatores: [
            'Colonização prévia',
            'VEF₁<30%',
            'bronquiectasias',
            'uso de antibiótico de amplo espectro ou corticoide sistêmico nos últimos 3 meses'
          ]
        }
      }
    },
    suporteAvancado: {
      titulo: '🫁 Suporte Avançado',
      vni: {
        titulo: 'Ventilação Não Invasiva (VNI)',
        descricao: 'É uma ferramenta valiosa e deve ser tentada antes da intubação em muitos casos (exceto pacientes muito graves).',
        indicacoes: {
          titulo: 'Indicações (ao menos um dos seguintes)',
          criterios: [
            'Acidose respiratória: PaCO₂ ≥ 45 mmHg com pH arterial ≤ 7,35',
            'Dispneia grave com fadiga muscular: Uso de musculatura acessória, movimento paradoxal do abdome',
            'Hipoxemia persistente apesar da oxigenoterapia'
          ]
        },
        configuracao: {
          modo: 'Modo Preferencial: BIPAP',
          saturacao: 'Alvo de Saturação: 88-92%'
        }
      },
      uti: {
        titulo: 'Indicação para Transferência à UTI',
        criterios: [
          'Deterioração clínica',
          'pO₂ < 40 mmHg',
          'pH menor que 7,25'
        ]
      }
    }
  },
  celulite: {
    drug: 'Cefalexina 500 mg',
    dose: 'Via Oral 6/6h por 7-10 dias',
    color: '#4CAF50',
    indication: 'Tratamento de primeira linha para celulite não complicada.',
    alternativa: 'Alternativa: Clindamicina 300mg 8/8h por 7-10 dias',
  }
};

// Questões do questionário interativo (estrutura inicial)
const questions = [
  {
    id: 1,
    question: "Qual o sítio de infecção?",
    options: [
      { id: 'respiratorio', text: 'SISTEMA RESPIRATÓRIO', next: 2 },
      { id: 'urinario', text: 'SISTEMA URINÁRIO', next: 3 },
      { id: 'pele_partes_moles', text: 'PELE E PARTES MOLES', next: 4 },
      { id: 'intra_abdominal', text: 'INFECÇÃO INTRA-ABDOMINAL', next: 5 }
    ]
  },
  {
    id: 2,
    question: "Qual o quadro respiratório?",
    options: [
      { id: 'pneumonia_comunitaria', text: 'Pneumonia Adquirida na Comunidade', treatments: ['pneumonia_comunitaria'] },
      { id: 'pneumonia_aspirativa', text: 'Pneumonia Aspirativa', treatments: ['pneumonia_aspirativa'] },
      { id: 'pneumonia_hospitalar', text: 'Pneumonia Hospitalar', treatments: ['pneumonia_hospitalar'] },
      { id: 'exacerbacao_dpoc', text: 'Exacerbação de DPOC', treatments: ['exacerbacao_dpoc'] }
    ]
  },
    {
      id: 3,
      question: "Qual o tipo de infecção urinária?",
      options: [
        { id: 'cistite', text: 'Cistite - ITU Baixa Não Complicada', treatments: ['cistite'] },
        { id: 'pielonefrite', text: 'Pielonefrite - ITU Alta', treatments: ['pielonefrite'] },
        { id: 'prostatite_bacteriana_aguda', text: 'Prostatite Bacteriana Aguda', treatments: ['prostatite_bacteriana_aguda'] }
      ]
    },
  {
    id: 4,
    question: "Qual o tipo de infecção de pele?",
    options: [
      { id: 'celulite_simples', text: 'Celulite Não Complicada', treatments: ['celulite'] },
      { id: 'abscesso', text: 'Abscesso', next: 'end' },
      { id: 'fasciite', text: 'Fasciite Necrotizante', next: 'end' }
    ]
  },
  {
    id: 5,
    question: "Qual o tipo de infecção intra-abdominal?",
    options: [
      { id: 'diverticulite', text: 'Diverticulite', next: 'end' },
      { id: 'colecistite', text: 'Colecistite', next: 'end' },
      { id: 'apendicite', text: 'Apendicite', next: 'end' }
    ]
  }
];

// Componente para seção de escores
const ScoreSection = () => {
  const [curbScore, setCurbScore] = useState(0);
  const [psiScore, setPsiScore] = useState(0);
  const [activeScore, setActiveScore] = useState('curb'); // 'curb' ou 'psi'
  const [showScores, setShowScores] = useState(false);

  // Estados para CURB-65
  const [confusao, setConfusao] = useState(false);
  const [ureia, setUreia] = useState(false);
  const [respiracao, setRespiracao] = useState(false);
  const [pressao, setPressao] = useState(false);
  const [idadeCurb, setIdadeCurb] = useState(false);

  // Estados para PSI PORT
  const [idadePsi, setIdadePsi] = useState(0);
  const [genero, setGenero] = useState('masculino');
  const [neoplasia, setNeoplasia] = useState(false);
  const [doencaHepatica, setDoencaHepatica] = useState(false);
  const [insuficienciaCardiaca, setInsuficienciaCardiaca] = useState(false);
  const [doencaCerebrovascular, setDoencaCerebrovascular] = useState(false);
  const [doencaRenal, setDoencaRenal] = useState(false);
  const [alteracaoMental, setAlteracaoMental] = useState(false);
  const [freqRespiratoria, setFreqRespiratoria] = useState(false);
  const [pressaoArterial, setPressaoArterial] = useState(false);
  const [temperatura, setTemperatura] = useState(false);
  const [freqCardiaca, setFreqCardiaca] = useState(false);
  const [phArterial, setPhArterial] = useState(false);
  const [bun, setBun] = useState(false);
  const [sodio, setSodio] = useState(false);
  const [glicose, setGlicose] = useState(false);
  const [hematocrito, setHematocrito] = useState(false);
  const [pao2, setPao2] = useState(false);
  const [derramepleural, setDerramepleural] = useState(false);

  // Calcular CURB-65
  const calculateCurbScore = () => {
    let score = 0;
    if (confusao) score += 1;
    if (ureia) score += 1;
    if (respiracao) score += 1;
    if (pressao) score += 1;
    if (idadeCurb) score += 1;
    setCurbScore(score);
    return score;
  };
  
  // Calcular PSI PORT
  const calculatePsiScore = () => {
    let score = 0;
    
    // 1. Idade
    if (genero === 'masculino') {
      score += Number(idadePsi);
    } else {
      score += Math.max(0, Number(idadePsi) - 10);
    }
    
    // 2. Condições comórbidas
    if (neoplasia) score += 30;
    if (doencaHepatica) score += 20;
    if (insuficienciaCardiaca) score += 10;
    if (doencaCerebrovascular) score += 10;
    if (doencaRenal) score += 10;
    
    // 3. Achados clínicos
    if (alteracaoMental) score += 20;
    if (freqRespiratoria) score += 20;
    if (pressaoArterial) score += 20;
    if (temperatura) score += 15;
    if (freqCardiaca) score += 10;
    
    // 4. Exames laboratoriais/radiológicos
    if (phArterial) score += 30;
    if (bun) score += 20;
    if (sodio) score += 20;
    if (glicose) score += 10;
    if (hematocrito) score += 10;
    if (pao2) score += 10;
    if (derramepleural) score += 10;
    
    setPsiScore(score);
    return score;
  };

  // Interpretação CURB-65
  const getCurbInterpretation = (score) => {
    if (score <= 1) return { text: '• 0 - 1 pontos: ambulatorial', color: '#4CAF50', bg: '#E8F5E8' };
    if (score === 2) return { text: '• 2 pontos: internação hospitalar em enfermaria', color: '#FF9800', bg: '#FFF3E0' };
    if (score >= 3) return { text: '• ≥ 3 pontos: internação hospitalar, considerar UTI', color: '#F44336', bg: '#FFEBEE' };
    return { text: '', color: '#000', bg: '#FFF' };
  };
  
  // Interpretação PSI PORT
  const getPsiInterpretation = (score) => {
    if (score < 51) return { text: 'Classe I - Risco Muito Baixo\nMortalidade: 0.1%\nRecomendação: Tratamento Ambulatorial', color: '#4CAF50', bg: '#E8F5E8' };
    if (score <= 70) return { text: 'Classe II - Risco Baixo\nMortalidade: 0.6%\nRecomendação: Tratamento Ambulatorial', color: '#4CAF50', bg: '#E8F5E8' };
    if (score <= 90) return { text: 'Classe III - Risco Moderado\nMortalidade: 2.8%\nRecomendação: Internação por 24-48h', color: '#FF9800', bg: '#FFF3E0' };
    if (score <= 130) return { text: 'Classe IV - Risco Alto\nMortalidade: 8.2%\nRecomendação: Internação hospitalar em enfermaria', color: '#F44336', bg: '#FFEBEE' };
    return { text: 'Classe V - Risco Muito Alto\nMortalidade: 29.2%\nRecomendação: Internação hospitalar em UTI', color: '#D32F2F', bg: '#FFCDD2' };
  };

  const toggleScoreVisibility = () => {
    setShowScores(!showScores);
  };

  React.useEffect(() => {
    calculateCurbScore();
  }, [confusao, ureia, respiracao, pressao, idadeCurb]);
  
  React.useEffect(() => {
    calculatePsiScore();
  }, [idadePsi, genero, neoplasia, doencaHepatica, insuficienciaCardiaca, doencaCerebrovascular, 
      doencaRenal, alteracaoMental, freqRespiratoria, pressaoArterial, temperatura, freqCardiaca, 
      phArterial, bun, sodio, glicose, hematocrito, pao2, derramepleural]);

  const curbInterpretation = getCurbInterpretation(curbScore);
  const psiInterpretation = getPsiInterpretation(psiScore);

  return (
    <View style={styles.scoreSection}>
      <TouchableOpacity 
        style={styles.scoreSectionHeader}
        onPress={toggleScoreVisibility}
      >
        <Text style={styles.scoreSectionTitle}>📊 Escores de Gravidade - Estratificação de Risco</Text>
        <Text style={[styles.collapseIcon, { color: '#0891B2' }]}>
          {showScores ? '▼' : '▶'}
        </Text>
      </TouchableOpacity>

      {showScores && (
        <View style={styles.scoreSectionContent}>
          <Text style={styles.scoreSectionDescription}>
            Use os escores abaixo para auxiliar na decisão sobre o local de tratamento (ambulatorial, internação ou UTI).
          </Text>

          {/* Seletor de Score */}
          <View style={styles.scoreSelector}>
            <TouchableOpacity 
              style={[styles.scoreSelectorButton, activeScore === 'curb' && styles.scoreSelectorButtonActive]}
              onPress={() => setActiveScore('curb')}
            >
              <Text style={[styles.scoreSelectorText, activeScore === 'curb' && styles.scoreSelectorTextActive]}>CURB-65</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.scoreSelectorButton, activeScore === 'psi' && styles.scoreSelectorButtonActive]}
              onPress={() => setActiveScore('psi')}
            >
              <Text style={[styles.scoreSelectorText, activeScore === 'psi' && styles.scoreSelectorTextActive]}>PSI PORT</Text>
            </TouchableOpacity>
          </View>

          {/* CURB-65 Score */}
          {activeScore === 'curb' && (
            <View style={styles.curbContainer}>
              <Text style={styles.scoreTitle}>CURB-65 - Estratificação de Gravidade em Adultos</Text>
              
              <View style={styles.scoreItem}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setConfusao(!confusao)}
                >
                  <View style={[styles.checkbox, confusao && styles.checkboxChecked]}>
                    {confusao && <Text style={styles.checkboxText}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>Confusão mental = 1 ponto</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.scoreItem}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setUreia(!ureia)}
                >
                  <View style={[styles.checkbox, ureia && styles.checkboxChecked]}>
                    {ureia && <Text style={styles.checkboxText}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>Ureia > 50 mg/dL = 1 ponto</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.scoreItem}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setRespiracao(!respiracao)}
                >
                  <View style={[styles.checkbox, respiracao && styles.checkboxChecked]}>
                    {respiracao && <Text style={styles.checkboxText}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>Respiração ≥ 30 irpm = 1 ponto</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.scoreItem}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setPressao(!pressao)}
                >
                  <View style={[styles.checkbox, pressao && styles.checkboxChecked]}>
                    {pressao && <Text style={styles.checkboxText}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>PAS ≤ 90 ou PAD ≤ 60 = 1 ponto</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.scoreItem}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setIdadeCurb(!idadeCurb)}
                >
                  <View style={[styles.checkbox, idadeCurb && styles.checkboxChecked]}>
                    {idadeCurb && <Text style={styles.checkboxText}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>≥ 65 anos de idade = 1 ponto</Text>
                </TouchableOpacity>
              </View>

              {/* Resultado CURB-65 */}
              <View style={[styles.scoreResult, { backgroundColor: curbInterpretation.bg }]}>
                <Text style={[styles.scoreResultTitle, { color: curbInterpretation.color }]}>Pontuação: {curbScore} pontos</Text>
                <Text style={[styles.scoreResultText, { color: curbInterpretation.color }]}>{curbInterpretation.text}</Text>
              </View>
            </View>
          )}

          {/* PSI PORT Score */}
          {activeScore === 'psi' && (
            <View style={styles.psiContainer}>
              <Text style={styles.scoreTitle}>PSI PORT - Pneumonia Severity Index</Text>
              
              {/* Seleção de Gênero */}
              <View style={styles.psiGenderSelector}>
                <Text style={styles.psiSectionTitle}>1. Gênero:</Text>
                <View style={styles.psiGenderButtons}>
                  <TouchableOpacity 
                    style={[styles.psiGenderButton, genero === 'masculino' && styles.psiGenderButtonActive]}
                    onPress={() => setGenero('masculino')}
                  >
                    <Text style={[styles.psiGenderButtonText, genero === 'masculino' && styles.psiGenderButtonTextActive]}>Masculino</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.psiGenderButton, genero === 'feminino' && styles.psiGenderButtonActive]}
                    onPress={() => setGenero('feminino')}
                  >
                    <Text style={[styles.psiGenderButtonText, genero === 'feminino' && styles.psiGenderButtonTextActive]}>Feminino</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Input de Idade */}
              <View style={styles.psiAgeInput}>
                <Text style={styles.psiSectionTitle}>2. Idade:</Text>
                <TextInput
                  style={styles.psiAgeTextInput}
                  keyboardType="numeric"
                  placeholder="Digite a idade"
                  value={idadePsi.toString()}
                  onChangeText={(text) => setIdadePsi(text === '' ? 0 : parseInt(text))}
                />
                <Text style={styles.psiAgePoints}>
                  {genero === 'masculino' 
                    ? `+${idadePsi} pontos` 
                    : `+${Math.max(0, idadePsi - 10)} pontos (Idade - 10)`}
                </Text>
              </View>
              
              {/* Comorbidades */}
              <View style={styles.psiSection}>
                <Text style={styles.psiSectionTitle}>3. Condições Comórbidas:</Text>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setNeoplasia(!neoplasia)}
                  >
                    <View style={[styles.checkbox, neoplasia && styles.checkboxChecked]}>
                      {neoplasia && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Neoplasia = +30 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setDoencaHepatica(!doencaHepatica)}
                  >
                    <View style={[styles.checkbox, doencaHepatica && styles.checkboxChecked]}>
                      {doencaHepatica && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Doença hepática = +20 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setInsuficienciaCardiaca(!insuficienciaCardiaca)}
                  >
                    <View style={[styles.checkbox, insuficienciaCardiaca && styles.checkboxChecked]}>
                      {insuficienciaCardiaca && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Insuficiência cardíaca = +10 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setDoencaCerebrovascular(!doencaCerebrovascular)}
                  >
                    <View style={[styles.checkbox, doencaCerebrovascular && styles.checkboxChecked]}>
                      {doencaCerebrovascular && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Doença cerebrovascular = +10 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setDoencaRenal(!doencaRenal)}
                  >
                    <View style={[styles.checkbox, doencaRenal && styles.checkboxChecked]}>
                      {doencaRenal && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Doença renal = +10 pontos</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Achados Clínicos */}
              <View style={styles.psiSection}>
                <Text style={styles.psiSectionTitle}>4. Achados Clínicos:</Text>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setAlteracaoMental(!alteracaoMental)}
                  >
                    <View style={[styles.checkbox, alteracaoMental && styles.checkboxChecked]}>
                      {alteracaoMental && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Alteração do estado mental = +20 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setFreqRespiratoria(!freqRespiratoria)}
                  >
                    <View style={[styles.checkbox, freqRespiratoria && styles.checkboxChecked]}>
                      {freqRespiratoria && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Frequência respiratória ≥ 30 irpm = +20 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setPressaoArterial(!pressaoArterial)}
                  >
                    <View style={[styles.checkbox, pressaoArterial && styles.checkboxChecked]}>
                      {pressaoArterial && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>PAS &lt; 90 mmHg = +20 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setTemperatura(!temperatura)}
                  >
                    <View style={[styles.checkbox, temperatura && styles.checkboxChecked]}>
                      {temperatura && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Temp &lt; 35°C ou ≥ 40°C = +15 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setFreqCardiaca(!freqCardiaca)}
                  >
                    <View style={[styles.checkbox, freqCardiaca && styles.checkboxChecked]}>
                      {freqCardiaca && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>FC ≥ 125 bpm = +10 pontos</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Exames laboratoriais/radiológicos */}
              <View style={styles.psiSection}>
                <Text style={styles.psiSectionTitle}>5. Exames Laboratoriais/Radiológicos:</Text>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setPhArterial(!phArterial)}
                  >
                    <View style={[styles.checkbox, phArterial && styles.checkboxChecked]}>
                      {phArterial && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>pH arterial &lt; 7,35 = +30 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setBun(!bun)}
                  >
                    <View style={[styles.checkbox, bun && styles.checkboxChecked]}>
                      {bun && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Ureia ≥ 30 mg/dL = +20 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setSodio(!sodio)}
                  >
                    <View style={[styles.checkbox, sodio && styles.checkboxChecked]}>
                      {sodio && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Na &lt; 130 mEq/L = +20 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setGlicose(!glicose)}
                  >
                    <View style={[styles.checkbox, glicose && styles.checkboxChecked]}>
                      {glicose && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Glicose ≥ 250 mg/dL = +10 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setHematocrito(!hematocrito)}
                  >
                    <View style={[styles.checkbox, hematocrito && styles.checkboxChecked]}>
                      {hematocrito && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Hematócrito &lt; 30% = +10 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setPao2(!pao2)}
                  >
                    <View style={[styles.checkbox, pao2 && styles.checkboxChecked]}>
                      {pao2 && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>PaO₂ &lt; 60 mmHg = +10 pontos</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scoreItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setDerramepleural(!derramepleural)}
                  >
                    <View style={[styles.checkbox, derramepleural && styles.checkboxChecked]}>
                      {derramepleural && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Derrame pleural = +10 pontos</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Resultado PSI */}
              <View style={[styles.scoreResult, { backgroundColor: psiInterpretation.bg, marginTop: theme.spacing.md }]}>
                <Text style={[styles.scoreResultTitle, { color: psiInterpretation.color }]}>Pontuação: {psiScore} pontos</Text>
                <Text style={[styles.scoreResultText, { color: psiInterpretation.color }]}>{psiInterpretation.text}</Text>
              </View>
              
              {/* Interpretação PSI */}
              <View style={styles.psiInterpretation}>
                <Text style={styles.psiInterpretationTitle}>Interpretação dos Grupos PSI:</Text>
                <View style={styles.psiGroup}>
                  <Text style={[styles.psiGroupTitle, { color: '#4CAF50' }]}>• Classe I (&lt; 51 pontos): Risco Muito Baixo, Mortalidade 0.1%</Text>
                </View>
                <View style={styles.psiGroup}>
                  <Text style={[styles.psiGroupTitle, { color: '#4CAF50' }]}>• Classe II (51-70 pontos): Risco Baixo, Mortalidade 0.6%</Text>
                </View>
                <View style={styles.psiGroup}>
                  <Text style={[styles.psiGroupTitle, { color: '#FF9800' }]}>• Classe III (71-90 pontos): Risco Moderado, Mortalidade 2.8%</Text>
                </View>
                <View style={styles.psiGroup}>
                  <Text style={[styles.psiGroupTitle, { color: '#F44336' }]}>• Classe IV (91-130 pontos): Risco Alto, Mortalidade 8.2%</Text>
                </View>
                <View style={styles.psiGroup}>
                  <Text style={[styles.psiGroupTitle, { color: '#D32F2F' }]}>• Classe V (> 130 pontos): Risco Muito Alto, Mortalidade 29.2%</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default function EscolhaSitioInfeccisoScreen() {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [answers, setAnswers] = useState({});
  const [recommendedTreatments, setRecommendedTreatments] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuestionario, setShowQuestionario] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Estados para controlar os collapses da pneumonia comunitária
  const [collapsedSections, setCollapsedSections] = useState({
    ambulatorial: true, // Por padrão fechado
    internacao: true, // Por padrão fechado
    semComorbidades: true,
    comComorbidades: true,
    situacoesEspecificas: true,
    pathogens: true, // Tópico colapsável: principais patógenos
  });

  // Filtrar sugestões baseado no termo de busca
  const filteredInfections = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return infectionsDatabase.filter(infection =>
      infection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      infection.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ).slice(0, 5); // Mostrar máximo 5 sugestões
  }, [searchQuery]);

  const getCurrentQuestion = () => {
    return questions.find(q => q.id === currentQuestionId);
  };

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [currentQuestionId]: option };
    setAnswers(newAnswers);

    // Se tem tratamentos definidos na opção
    if (option.treatments) {
      setRecommendedTreatments(option.treatments);
      setIsCompleted(true);
      return;
    }

    // Navegar para próxima pergunta
    if (option.next) {
      if (option.next === 'end') {
        setIsCompleted(true);
      } else {
        setCurrentQuestionId(option.next);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionId(1);
    setAnswers({});
    setRecommendedTreatments([]);
    setIsCompleted(false);
    setSearchQuery('');
    setShowQuestionario(true);
    setShowSuggestions(false);
  };

  const handleSearchInput = (text) => {
    setSearchQuery(text);
    setShowSuggestions(text.length >= 2);
  };

  const handleSelectInfection = (infection) => {
    setSearchQuery(infection.name);
    setShowSuggestions(false);
    
    // Buscar tratamento na base de dados
    if (treatmentDatabase[infection.id]) {
      setRecommendedTreatments([infection.id]);
      setIsCompleted(true);
      setShowQuestionario(false);
    } else {
      Alert.alert('Em breve', 'Tratamento para esta infecção será adicionado em breve. Use o questionário guiado.');
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      Alert.alert('Atenção', 'Digite o nome da infecção para pesquisar.');
      return;
    }
    
    // Buscar na base de dados de infecções
    const foundInfection = infectionsDatabase.find(infection =>
      infection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      infection.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    if (foundInfection && treatmentDatabase[foundInfection.id]) {
      setRecommendedTreatments([foundInfection.id]);
      setIsCompleted(true);
      setShowQuestionario(false);
      setShowSuggestions(false);
    } else {
      Alert.alert('Não encontrado', 'Infecção não encontrada na base de dados. Tente usar o questionário guiado.');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const toggleCollapsedSection = (sectionKey) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectInfection(item)}
    >
      <Pill size={16} color="#0891B2" />
      <Text style={styles.suggestionText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderTreatmentRecommendation = (treatmentKey) => {
    const treatment = treatmentDatabase[treatmentKey];
    
    if (!treatment) return null;

    const cardTitle = treatmentKey.charAt(0).toUpperCase() + treatmentKey.slice(1).replace(/_/g, ' ');

    // Renderização especial para cistite
    if (treatmentKey === 'cistite') {
      return (
        <View key={treatmentKey} style={styles.recommendationCard}>
          <View style={[styles.recommendationHeader, { backgroundColor: treatment.color }]}>
            <Pill size={20} color="#FFFFFF" style={{ marginRight: theme.spacing.sm }} />
            <Text style={styles.recommendationTitle}>Cistite - Tratamento Completo</Text>
          </View>
          <View style={styles.recommendationContent}>
            <Text style={styles.indicationText}>{treatment.indication}</Text>
            
            {/* Opções de Primeira Linha */}
            <View style={styles.primeiraLinhaContainer}>
              <Text style={styles.primeiraLinhaTitle}>💊 Opções de Primeira Linha</Text>
              <Text style={styles.primeiraLinhaSubtitle}>Tratamentos preferenciais baseados em diretrizes:</Text>
              
              {treatment.primeiraLinha.map((opcao, index) => (
                <View key={index} style={styles.medicamentoItem}>
                  <Text style={styles.medicamentoNome}>• {opcao.nome}</Text>
                  <Text style={styles.medicamentoDose}>{opcao.dose}</Text>
                  <Text style={styles.medicamentoObs}>{opcao.observacao}</Text>
                </View>
              ))}
            </View>

            {/* Opções de Segunda Linha */}
            <View style={styles.segundaLinhaContainer}>
              <Text style={styles.segundaLinhaTitle}>🔄 Opções de Segunda Linha e Alternativas</Text>
              <Text style={styles.segundaLinhaSubtitle}>Quando primeira linha não é viável:</Text>
              
              {treatment.segundaLinha.map((opcao, index) => (
                <View key={index} style={styles.medicamentoItem}>
                  <Text style={styles.medicamentoNome}>• {opcao.nome}</Text>
                  <Text style={styles.medicamentoDose}>{opcao.dose}</Text>
                </View>
              ))}
            </View>

            {/* Tratamento Sintomático */}
            <View style={styles.sintomaticoContainer}>
              <Text style={styles.sintomaticoTitle}>🩺 Tratamento Sintomático Adjuvante</Text>
              <View style={styles.medicamentoItem}>
                <Text style={styles.medicamentoNome}>• {treatment.sintomatico.nome}</Text>
                <Text style={styles.medicamentoDose}>{treatment.sintomatico.dose}</Text>
                <Text style={styles.medicamentoObs}>{treatment.sintomatico.observacao}</Text>
              </View>
            </View>

            {/* Duração do Tratamento */}
            <View style={styles.duracaoContainer}>
              <Text style={styles.duracaoTitle}>⏱️ Duração do Tratamento</Text>
              <Text style={styles.duracaoItem}>• {treatment.duracao.mulheres}</Text>
              <Text style={styles.duracaoItem}>• {treatment.duracao.gestantes}</Text>
            </View>
          </View>
        </View>
      );
    }

    // Renderização especial para pielonefrite
    if (treatmentKey === 'pielonefrite') {
      return (
        <View key={treatmentKey} style={styles.recommendationCard}>
          <View style={[styles.recommendationHeader, { backgroundColor: treatment.color }]}>
            <Pill size={20} color="#FFFFFF" style={{ marginRight: theme.spacing.sm }} />
            <Text style={styles.recommendationTitle}>Pielonefrite - ITU Alta</Text>
          </View>
          <View style={styles.recommendationContent}>
            <Text style={styles.indicationText}>{treatment.indication}</Text>
            
            {/* Abordagem Terapêutica */}
            <View style={styles.abordagemContainer}>
              <Text style={styles.abordagemTitle}>🏥 Abordagem Terapêutica Inicial</Text>
              <Text style={styles.abordagemText}>{treatment.abordagem}</Text>
            </View>

            {/* Tratamento Intravenoso */}
            <View style={styles.intravenosoContainer}>
              <Text style={styles.intravenosoTitle}>💉 Tratamento Intravenoso (Uso Hospitalar)</Text>
              
              {treatment.intravenoso.map((categoria, catIndex) => (
                <View key={catIndex} style={styles.categoriaContainer}>
                  <Text style={styles.categoriaTitle}>{categoria.categoria}</Text>
                  {categoria.medicamentos.map((med, medIndex) => (
                    <View key={medIndex} style={styles.medicamentoItem}>
                      <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                      <Text style={styles.medicamentoDose}>{med.dose}</Text>
                      <Text style={styles.medicamentoObs}>{med.observacao}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            {/* Tratamento Oral */}
            <View style={styles.oralContainer}>
              <Text style={styles.oralTitle}>💊 Tratamento Oral (Descalonamento ou Casos Leves)</Text>
              <Text style={styles.oralSubtitle}>Terapia oral indicada para continuação do tratamento IV ou casos selecionados. Escolha guiada por urocultura:</Text>
              
              {treatment.oral.map((opcao, index) => (
                <View key={index} style={styles.medicamentoItem}>
                  <Text style={styles.medicamentoNome}>• {opcao.nome}</Text>
                  <Text style={styles.medicamentoDose}>{opcao.dose}</Text>
                  <Text style={styles.medicamentoObs}>{opcao.observacao}</Text>
                </View>
              ))}
            </View>

            {/* Duração do Tratamento */}
            <View style={styles.duracaoContainer}>
              <Text style={styles.duracaoTitle}>⏱️ Duração do Tratamento</Text>
              <Text style={styles.duracaoItem}>• {treatment.duracao.padrao}</Text>
              <Text style={styles.duracaoItem}>• {treatment.duracao.levofloxacino}</Text>
              <Text style={styles.duracaoItem}>• {treatment.duracao.complicada}</Text>
            </View>

            {/* Exames de Imagem */}
            <View style={styles.examesImagemContainer}>
              <Text style={styles.examesImagemTitle}>🔬 {treatment.examesImagem.titulo}</Text>
              {treatment.examesImagem.indicacoes.map((indicacao, index) => (
                <Text key={index} style={styles.examesImagemItem}>• {indicacao}</Text>
              ))}
            </View>
          </View>
        </View>
      );
    }

    // Renderização especial para pneumonia comunitária com seções colapsáveis coloridas
    if (treatmentKey === 'pneumonia_comunitaria') {
      return (
        <View key={treatmentKey} style={styles.recommendationCard}>
          <View style={[styles.recommendationHeader, { backgroundColor: treatment.color }]}>
            <Pill size={20} color="#FFFFFF" style={{ marginRight: theme.spacing.sm }} />
            <Text style={styles.recommendationTitle}>Pneumonia Adquirida na Comunidade</Text>
          </View>
          <View style={styles.recommendationContent}>
            <Text style={styles.indicationText}>{treatment.indication}</Text>
            
            {/* Principais Patógenos - Tópico colapsável */}
            <View style={styles.pneumoniaCollapseSection}>
              <TouchableOpacity
                style={[styles.pneumoniaCollapseSectionHeader, { backgroundColor: '#E8F5E8' }]}
                onPress={() => toggleCollapsedSection('pathogens')}
              >
                <Text style={[styles.pneumoniaCollapseSectionTitle, { color: '#2E7D32' }]}>🦠 Principais Patógenos Causadores de Pneumonia no Adulto</Text>
                <Text style={[styles.pneumoniaCollapseIcon, { color: '#2E7D32' }]}>
                  {collapsedSections.pathogens ? '▶' : '▼'}
                </Text>
              </TouchableOpacity>

              {!collapsedSections.pathogens && (
                <View style={styles.pneumoniaCollapseSectionContent}>
                  <Text style={styles.pathogensSectionDescription}>
                    Conhecimento dos agentes etiológicos mais comuns para orientar a terapia empírica:
                  </Text>

                  <View style={styles.pathogensTable}>
                    <View style={styles.pathogensTableHeader}>
                      <Text style={styles.pathogensTableHeaderPathogen}>Patógeno</Text>
                      <Text style={styles.pathogensTableHeaderType}>Tipo</Text>
                    </View>

                    <View style={styles.pathogensTableRow}>
                      <Text style={styles.pathogensTableCellPathogen}>Streptococcus pneumoniae</Text>
                      <Text style={styles.pathogensTableCellType}>Cocos gram-positivos</Text>
                    </View>

                    <View style={styles.pathogensTableRow}>
                      <Text style={styles.pathogensTableCellPathogen}>Haemophilus influenzae</Text>
                      <Text style={styles.pathogensTableCellType}>Cocobacilo gram-negativo</Text>
                    </View>

                    <View style={styles.pathogensTableRow}>
                      <Text style={styles.pathogensTableCellPathogen}>Moraxella catarrhalis</Text>
                      <Text style={styles.pathogensTableCellType}>Cocos gram-negativo</Text>
                    </View>

                    <View style={styles.pathogensTableRow}>
                      <Text style={styles.pathogensTableCellPathogen}>Legionella spp</Text>
                      <Text style={styles.pathogensTableCellType}>Atípico</Text>
                    </View>

                    <View style={styles.pathogensTableRow}>
                      <Text style={styles.pathogensTableCellPathogen}>Mycoplasma pneumoniae</Text>
                      <Text style={styles.pathogensTableCellType}>Atípico</Text>
                    </View>

                    <View style={styles.pathogensTableRow}>
                      <Text style={styles.pathogensTableCellPathogen}>Chlamydia pneumoniae</Text>
                      <Text style={styles.pathogensTableCellType}>Atípico</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
            
            {/* Escores de Gravidade */}
            <ScoreSection />
            
            {/* Seção Ambulatorial */}
            <View style={styles.pneumoniaCollapseSection}>
              <TouchableOpacity 
                style={[styles.pneumoniaCollapseSectionHeader, { backgroundColor: '#E8F5E8' }]}
                onPress={() => toggleCollapsedSection('ambulatorial')}
              >
                <Text style={[styles.pneumoniaCollapseSectionTitle, { color: '#2E7D32' }]}>🏠 Pneumonia Adquirida na Comunidade - Tratamento Ambulatorial</Text>
                <Text style={[styles.pneumoniaCollapseIcon, { color: '#2E7D32' }]}>
                  {collapsedSections.ambulatorial ? '▶' : '▼'}
                </Text>
              </TouchableOpacity>
              
              {!collapsedSections.ambulatorial && (
                <View style={styles.pneumoniaCollapseSectionContent}>
                  <Text style={styles.pneumoniaCollapseSectionDescription}>{treatment.ambulatorial.descricao}</Text>
                  
                  {/* Pacientes SEM Comorbidades */}
                  <View style={styles.pneumoniaSemComorbiContainer}>
                    <Text style={styles.pneumoniaSemComorbiTitle}>🩺 {treatment.ambulatorial.pacientesSemComorbidades.titulo}</Text>
                    <Text style={styles.pneumoniaSemComorbiDesc}>{treatment.ambulatorial.pacientesSemComorbidades.descricao}</Text>
                    
                    {/* Primeira Linha */}
                    <View style={styles.pneumoniaPrimeiraLinhaContainer}>
                      <Text style={styles.pneumoniaPrimeiraLinhaTitle}>💊 {treatment.ambulatorial.pacientesSemComorbidades.primeiraLinha.titulo}</Text>
                      
                      {treatment.ambulatorial.pacientesSemComorbidades.primeiraLinha.medicamentos.map((med, index) => (
                        <View key={index} style={styles.medicamentoItem}>
                          <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                          <Text style={styles.medicamentoDose}>{med.dose}</Text>
                          <Text style={styles.medicamentoObs}>{med.observacao}</Text>
                        </View>
                      ))}
                    </View>
                    
                    {/* Alternativas */}
                    <View style={styles.pneumoniaAlternativasContainer}>
                      <Text style={styles.pneumoniaAlternativasTitle}>🔄 {treatment.ambulatorial.pacientesSemComorbidades.alternativas.titulo}</Text>
                      
                      {treatment.ambulatorial.pacientesSemComorbidades.alternativas.medicamentos.map((med, index) => (
                        <View key={index} style={styles.medicamentoItem}>
                          <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                          <Text style={styles.medicamentoDose}>{med.dose}</Text>
                          <Text style={styles.medicamentoObs}>{med.observacao}</Text>
                        </View>
                      ))}
                    </View>
                    
                    {/* Duração sem comorbidades */}
                    <View style={styles.pneumoniaDuracaoContainer}>
                      <Text style={styles.pneumoniaDuracaoTitle}>⏱️ Duração do Tratamento</Text>
                      <Text style={styles.pneumoniaDuracaoText}>{treatment.ambulatorial.pacientesSemComorbidades.duracao}</Text>
                    </View>
                  </View>
                  
                  {/* Pacientes COM Comorbidades */}
                  <View style={styles.pneumoniaComComorbiContainer}>
                    <Text style={styles.pneumoniaComComorbiTitle}>🏥 {treatment.ambulatorial.pacientesComComorbidades.titulo}</Text>
                    <Text style={styles.pneumoniaComComorbiDesc}>{treatment.ambulatorial.pacientesComComorbidades.descricao}</Text>
                    
                    {/* Definição de Comorbidades com destaque */}
                    <View style={styles.pneumoniaDefinicaoImportanteContainer}>
                      <Text style={styles.pneumoniaDefinicaoImportanteText}>{treatment.ambulatorial.pacientesComComorbidades.definicaoComorbidades}</Text>
                    </View>
                    
                    {/* Opção Preferencial - Terapia Dupla */}
                    <View style={styles.pneumoniaTerapiaDuplaContainer}>
                      <Text style={styles.pneumoniaTerapiaDuplaTitle}>💊💊 {treatment.ambulatorial.pacientesComComorbidades.opcaoPreferencial.titulo}</Text>
                      <Text style={styles.pneumoniaTerapiaDuplaDesc}>{treatment.ambulatorial.pacientesComComorbidades.opcaoPreferencial.descricao}</Text>
                      
                      {treatment.ambulatorial.pacientesComComorbidades.opcaoPreferencial.combinacoes.map((comb, index) => (
                        <View key={index} style={styles.medicamentoItem}>
                          <Text style={styles.medicamentoNome}>• {comb.nome}</Text>
                          <Text style={styles.medicamentoDose}>{comb.dose}</Text>
                        </View>
                      ))}
                    </View>
                    
                    {/* Alternativa - Monoterapia */}
                    <View style={styles.pneumoniaMonoterapiaContainer}>
                      <Text style={styles.pneumoniaMonoterapiaTitle}>🔄 {treatment.ambulatorial.pacientesComComorbidades.alternativa.titulo}</Text>
                      <Text style={styles.pneumoniaMonoterapiaDesc}>{treatment.ambulatorial.pacientesComComorbidades.alternativa.descricao}</Text>
                      
                      {treatment.ambulatorial.pacientesComComorbidades.alternativa.medicamentos.map((med, index) => (
                        <View key={index} style={styles.medicamentoItem}>
                          <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                          <Text style={styles.medicamentoDose}>{med.dose}</Text>
                        </View>
                      ))}
                    </View>
                    
                    {/* Duração com comorbidades */}
                    <View style={styles.pneumoniaDuracaoContainer}>
                      <Text style={styles.pneumoniaDuracaoTitle}>⏱️ Duração do Tratamento</Text>
                      <Text style={styles.pneumoniaDuracaoText}>{treatment.ambulatorial.pacientesComComorbidades.duracao}</Text>
                    </View>
                  </View>
                  
                  {/* Situações Específicas no Ambulatorial */}
                  <View style={styles.pneumoniaSituacoesContainer}>
                    <Text style={styles.pneumoniaSituacoesTitle}>⚕️ {treatment.situacoesEspecificas.titulo}</Text>
                    
                    {treatment.situacoesEspecificas.casos.map((caso, index) => (
                      <View key={index} style={styles.pneumoniaSituacaoItem}>
                        <Text style={styles.pneumoniaSituacaoNome}>• {caso.situacao}:</Text>
                        <Text style={styles.pneumoniaSituacaoTrat}>{caso.tratamento}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
            
            {/* Seção Internação */}
            <View style={styles.pneumoniaCollapseSection}>
              <TouchableOpacity 
                style={[styles.pneumoniaCollapseSectionHeader, { backgroundColor: '#FFEBEE' }]}
                onPress={() => toggleCollapsedSection('internacao')}
              >
                <Text style={[styles.pneumoniaCollapseSectionTitle, { color: '#C2185B' }]}>🏥 Pneumonia Adquirida na Comunidade - Tratamento em Internação</Text>
                <Text style={[styles.pneumoniaCollapseIcon, { color: '#C2185B' }]}>
                  {collapsedSections.internacao ? '▶' : '▼'}
                </Text>
              </TouchableOpacity>
              
              {!collapsedSections.internacao && (
                <View style={styles.pneumoniaCollapseSectionContent}>
                  <Text style={styles.pneumoniaCollapseSectionDescription}>{treatment.internacao.descricao}</Text>
                  
                  {/* Opção Preferencial - Card Destacado */}
                  <View style={styles.pneumoniaOpcaoPreferencialContainer}>
                    <Text style={styles.pneumoniaOpcaoPreferencialTitle}>💊💊 {treatment.internacao.opcaoPreferencial.titulo}</Text>
                    
                    <View style={styles.pneumoniaOpcaoPreferencialContent}>
                      <Text style={styles.pneumoniaTerapiaDuplaDesc}>{treatment.internacao.opcaoPreferencial.descricao}</Text>
                      
                      {/* Beta-lactâmico Principal */}
                      <View style={styles.pneumoniaPrimeiraLinhaContainer}>
                        <Text style={styles.pneumoniaPrimeiraLinhaTitle}>💉 {treatment.internacao.opcaoPreferencial.betaLactamicoPrincipal.titulo}</Text>
                        <View style={styles.medicamentoItem}>
                          <Text style={styles.medicamentoNome}>• {treatment.internacao.opcaoPreferencial.betaLactamicoPrincipal.medicamento.nome}</Text>
                          <Text style={styles.medicamentoDose}>{treatment.internacao.opcaoPreferencial.betaLactamicoPrincipal.medicamento.dose}</Text>
                        </View>
                      </View>
                      
                      {/* Macrolídeos */}
                      <View style={styles.pneumoniaAlternativasContainer}>
                        <Text style={styles.pneumoniaAlternativasTitle}>🔗 {treatment.internacao.opcaoPreferencial.macrolideos.titulo}</Text>
                        {treatment.internacao.opcaoPreferencial.macrolideos.medicamentos.map((med, index) => (
                          <View key={index} style={styles.medicamentoItem}>
                            <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                            <Text style={styles.medicamentoDose}>{med.dose}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                  
                  {/* Alternativas à Ceftriaxona - Card Destacado */}
                  <View style={styles.pneumoniaAlternativasCeftriaxonaContainer}>
                    <Text style={styles.pneumoniaAlternativasCeftriaxonaTitle}>🔄 {treatment.internacao.opcaoPreferencial.alternativasBetaLactamico.titulo}</Text>
                    
                    <View style={styles.pneumoniaAlternativasCeftriaxonaContent}>
                      {treatment.internacao.opcaoPreferencial.alternativasBetaLactamico.medicamentos.map((med, index) => (
                        <View key={index} style={styles.medicamentoItem}>
                          <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                          <Text style={styles.medicamentoDose}>{med.dose}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  {/* Alternativa Monoterapia - Card Destacado */}
                  <View style={styles.pneumoniaAlternativaMonoterapiaContainer}>
                    <Text style={styles.pneumoniaAlternativaMonoterapiaTitle}>🔄 {treatment.internacao.alternativaMonoterapia.titulo}</Text>
                    
                    <View style={styles.pneumoniaAlternativaMonoterapiaContent}>
                      <Text style={styles.pneumoniaMonoterapiaDesc}>{treatment.internacao.alternativaMonoterapia.descricao}</Text>
                      {treatment.internacao.alternativaMonoterapia.medicamentos.map((med, index) => (
                        <View key={index} style={styles.medicamentoItem}>
                          <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                          <Text style={styles.medicamentoDose}>{med.dose}</Text>
                        </View>
                      ))}
                      
                      <View style={styles.pneumoniaDefinicaoImportanteContainer}>
                        <Text style={styles.pneumoniaDefinicaoImportanteText}>⚠️ {treatment.internacao.alternativaMonoterapia.atencao}</Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Duração */}
                  <View style={styles.pneumoniaDuracaoContainer}>
                    <Text style={styles.pneumoniaDuracaoTitle}>⏱️ Duração do Tratamento</Text>
                    <Text style={styles.pneumoniaDuracaoText}>• {treatment.internacao.duracao.padrao}</Text>
                    <Text style={styles.pneumoniaDuracaoText}>• {treatment.internacao.duracao.curto}</Text>
                  </View>
                  
                  {/* Situações Específicas na Internação */}
                  <View style={styles.pneumoniaSituacoesContainer}>
                    <Text style={styles.pneumoniaSituacoesTitle}>⚕️ Situações Específicas</Text>
                    
                    <View style={styles.pneumoniaSituacaoItem}>
                      <Text style={styles.pneumoniaSituacaoNome}>• Alergia à Penicilina:</Text>
                      <Text style={styles.pneumoniaSituacaoTrat}>A principal alternativa é o uso de uma fluoroquinolona respiratória em monoterapia (Levofloxacino ou Moxifloxacino).</Text>
                    </View>
                    
                    <View style={styles.pneumoniaSituacaoItem}>
                      <Text style={styles.pneumoniaSituacaoNome}>• Gestantes:</Text>
                      <Text style={styles.pneumoniaSituacaoTrat}>A terapia de escolha deve priorizar medicamentos mais seguros, como Penicilinas e Cefalosporinas. A Azitromicina (Categoria B) é o macrolídeo de preferência. Deve-se evitar Doxiciclina, Levofloxacino e Claritromicina.</Text>
                    </View>
                    
                    <View style={styles.pneumoniaSituacaoItem}>
                      <Text style={styles.pneumoniaSituacaoNome}>• Lactantes:</Text>
                      <Text style={styles.pneumoniaSituacaoTrat}>Penicilinas, Cefalosporinas e Macrolídeos são geralmente considerados seguros. O uso de Levofloxacino e Doxiciclina deve ser feito de forma criteriosa e com avaliação de risco-benefício.</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
            
            {/* Seção Situações Especiais - P. aeruginosa e MRSA */}
            <View style={styles.pneumoniaCollapseSection}>
              <TouchableOpacity 
                style={[styles.pneumoniaCollapseSectionHeader, { backgroundColor: '#FFF8E1' }]}
                onPress={() => toggleCollapsedSection('situacoesEspeciais')}
              >
                <Text style={[styles.pneumoniaCollapseSectionTitle, { color: '#E65100' }]}>🚨 {treatment.internacao.situacoesEspeciais.titulo}</Text>
                <Text style={[styles.pneumoniaCollapseIcon, { color: '#E65100' }]}>
                  {collapsedSections.situacoesEspeciais ? '▶' : '▼'}
                </Text>
              </TouchableOpacity>
              
              {!collapsedSections.situacoesEspeciais && (
                <View style={styles.pneumoniaCollapseSectionContent}>
                  <Text style={styles.pneumoniaCollapseSectionDescription}>{treatment.internacao.situacoesEspeciais.descricao}</Text>
                  
                  {/* Cobertura para Pseudomonas aeruginosa */}
                  <View style={styles.pneumoniaSituacoesEspeciaisContainer}>
                    <Text style={styles.pneumoniaSituacoesEspeciaisTitle}>🦠 {treatment.internacao.situacoesEspeciais.pseudomonas.titulo}</Text>
                    <Text style={styles.pneumoniaSituacoesEspeciaisDescricao}>{treatment.internacao.situacoesEspeciais.pseudomonas.descricao}</Text>
                    
                    {/* Quando Considerar */}
                    <View style={styles.pneumoniaSituacoesEspeciaisQuandoContainer}>
                      <Text style={styles.pneumoniaSituacoesEspeciaisQuandoTitle}>{treatment.internacao.situacoesEspeciais.pseudomonas.quando.titulo}</Text>
                      <Text style={styles.pneumoniaSituacoesEspeciaisQuandoDescricao}>{treatment.internacao.situacoesEspeciais.pseudomonas.quando.descricao}</Text>
                      
                      {treatment.internacao.situacoesEspeciais.pseudomonas.quando.fatores.map((fator, index) => (
                        <View key={index} style={styles.pneumoniaSituacoesEspeciaisFatorItem}>
                          <Text style={styles.pneumoniaSituacoesEspeciaisFatorCategoria}>• {fator.categoria}:</Text>
                          <Text style={styles.pneumoniaSituacoesEspeciaisFatorDescricao}>{fator.item}</Text>
                        </View>
                      ))}
                    </View>
                    
                    {/* Como Realizar */}
                    <View style={styles.pneumoniaSituacoesEspeciaisComoContainer}>
                      <Text style={styles.pneumoniaSituacoesEspeciaisComoTitle}>{treatment.internacao.situacoesEspeciais.pseudomonas.como.titulo}</Text>
                      <Text style={styles.pneumoniaSituacoesEspeciaisComoDescricao}>{treatment.internacao.situacoesEspeciais.pseudomonas.como.descricao}</Text>
                      
                      {treatment.internacao.situacoesEspeciais.pseudomonas.como.medicamentos.map((med, index) => (
                        <View key={index} style={styles.medicamentoItem}>
                          <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                          <Text style={styles.medicamentoDose}>{med.dose}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  {/* Cobertura para MRSA */}
                  <View style={styles.pneumoniaSituacoesEspeciaisMRSAContainer}>
                    <Text style={styles.pneumoniaSituacoesEspeciaisMRSATitle}>🔴 {treatment.internacao.situacoesEspeciais.mrsa.titulo}</Text>
                    <Text style={styles.pneumoniaSituacoesEspeciaisMRSADescricao}>{treatment.internacao.situacoesEspeciais.mrsa.descricao}</Text>
                    
                    {/* Quando Considerar MRSA */}
                    <View style={styles.pneumoniaSituacoesEspeciaisMRSAQuandoContainer}>
                      <Text style={styles.pneumoniaSituacoesEspeciaisMRSAQuandoTitle}>{treatment.internacao.situacoesEspeciais.mrsa.quando.titulo}</Text>
                      <Text style={styles.pneumoniaSituacoesEspeciaisMRSAQuandoDescricao}>{treatment.internacao.situacoesEspeciais.mrsa.quando.descricao}</Text>
                      
                      {treatment.internacao.situacoesEspeciais.mrsa.quando.fatores.map((fator, index) => (
                        <View key={index} style={styles.pneumoniaSituacoesEspeciaisMRSAFatorItem}>
                          <Text style={styles.pneumoniaSituacoesEspeciaisMRSAFatorCategoria}>• {fator.categoria}:</Text>
                          <Text style={styles.pneumoniaSituacoesEspeciaisMRSAFatorDescricao}>{fator.item}</Text>
                        </View>
                      ))}
                    </View>
                    
                    {/* Como Realizar MRSA */}
                    <View style={styles.pneumoniaSituacoesEspeciaisMRSAComoContainer}>
                      <Text style={styles.pneumoniaSituacoesEspeciaisMRSAComoTitle}>{treatment.internacao.situacoesEspeciais.mrsa.como.titulo}</Text>
                      <Text style={styles.pneumoniaSituacoesEspeciaisMRSAComoDescricao}>{treatment.internacao.situacoesEspeciais.mrsa.como.descricao}</Text>
                      
                      {treatment.internacao.situacoesEspeciais.mrsa.como.medicamentos.map((med, index) => (
                        <View key={index} style={styles.medicamentoItem}>
                          <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                          <Text style={styles.medicamentoDose}>{med.dose}</Text>
                          {med.observacao && <Text style={styles.medicamentoObs}>{med.observacao}</Text>}
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
            
          </View>
        </View>
      );
    }
    
    // Renderização especial para prostatite bacteriana aguda
    if (treatmentKey === 'prostatite_bacteriana_aguda') {
      return (
        <View key={treatmentKey} style={styles.recommendationCard}>
          <View style={[styles.recommendationHeader, { backgroundColor: treatment.color }]}>
            <Pill size={20} color="#FFFFFF" style={{ marginRight: theme.spacing.sm }} />
            <Text style={styles.recommendationTitle}>Prostatite Bacteriana Aguda</Text>
          </View>
          <View style={styles.recommendationContent}>
            <Text style={styles.indicationText}>{treatment.indication}</Text>

            {/* Prostatite Não Complicada */}
            <View style={styles.prostatiteNaoComplicadaContainer}>
              <Text style={styles.prostatiteNaoComplicadaTitle}>🩺 {treatment.prostatiteNaoComplicada.titulo}</Text>
              
              {/* Primeira Escolha */}
              <View style={styles.prostatitePrimeiraEscolhaContainer}>
                <Text style={styles.prostatitePrimeiraEscolhaTitle}>💊 {treatment.prostatiteNaoComplicada.primeiraEscolha.titulo}</Text>
                <Text style={styles.prostatitePrimeiraEscolhaDesc}>{treatment.prostatiteNaoComplicada.primeiraEscolha.descricao}</Text>
                
                {treatment.prostatiteNaoComplicada.primeiraEscolha.medicamentos.map((med, index) => (
                  <View key={index} style={styles.medicamentoItem}>
                    <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                    <Text style={styles.medicamentoDose}>{med.dose}</Text>
                  </View>
                ))}
              </View>
              
              {/* Alternativo */}
              <View style={styles.prostatiteAlternativoContainer}>
                <Text style={styles.prostatiteAlternativoTitle}>🔄 {treatment.prostatiteNaoComplicada.alternativo.titulo}</Text>
                
                {treatment.prostatiteNaoComplicada.alternativo.medicamentos.map((med, index) => (
                  <View key={index} style={styles.medicamentoItem}>
                    <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                    <Text style={styles.medicamentoDose}>{med.dose}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Prostatite Complicada */}
            <View style={styles.prostatiteComplicadaContainer}>
              <Text style={styles.prostatiteComplicadaTitle}>🏥 {treatment.prostatiteComplicada.titulo}</Text>
              <Text style={styles.prostatiteComplicadaDesc}>{treatment.prostatiteComplicada.descricao}</Text>
              
              {/* Monoterapia */}
              <View style={styles.prostatiteMonoterapiaContainer}>
                <Text style={styles.prostatiteMonoterapiaTitle}>💉 {treatment.prostatiteComplicada.monoterapia.titulo}</Text>
                
                {treatment.prostatiteComplicada.monoterapia.medicamentos.map((med, index) => (
                  <View key={index} style={styles.medicamentoItem}>
                    <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                    <Text style={styles.medicamentoDose}>{med.dose}</Text>
                  </View>
                ))}
              </View>
              
              {/* Combinado */}
              <View style={styles.prostatiteCombinadoContainer}>
                <Text style={styles.prostatiteCombinadoTitle}>🔬 {treatment.prostatiteComplicada.combinado.titulo}</Text>
                <Text style={styles.prostatiteCombinadoDesc}>{treatment.prostatiteComplicada.combinado.descricao}</Text>
                
                {treatment.prostatiteComplicada.combinado.medicamentos.map((med, index) => (
                  <View key={index} style={styles.medicamentoItem}>
                    <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                    <Text style={styles.medicamentoDose}>{med.dose}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Aviso Importante */}
            <View style={styles.avisoImportanteContainer}>
              <Text style={styles.avisoImportanteTitle}>⚠️ {treatment.avisoImportante.titulo}</Text>
              <Text style={styles.avisoImportanteTexto}>{treatment.avisoImportante.texto}</Text>
            </View>
          </View>
        </View>
      );
    }

    // Renderização especial para pneumonia aspirativa
    if (treatmentKey === 'pneumonia_aspirativa') {
      return (
        <View key={treatmentKey} style={styles.recommendationCard}>
          <View style={[styles.recommendationHeader, { backgroundColor: treatment.color }]}>
            <Pill size={20} color="#FFFFFF" style={{ marginRight: theme.spacing.sm }} />
            <Text style={styles.recommendationTitle}>Pneumonia Aspirativa</Text>
          </View>
          <View style={styles.recommendationContent}>
            <Text style={styles.indicationText}>{treatment.indication}</Text>

            {/* Controvérsia */}
            <View style={styles.controversiaContainer}>
              <Text style={styles.controversiaTitle}>{treatment.controversia.titulo}</Text>
              <Text style={styles.controversiaDescricao}>{treatment.controversia.descricao}</Text>
              
              {treatment.controversia.diretrizes.map((diretriz, index) => (
                <Text key={index} style={styles.controversiaDiretriz}>• {diretriz}</Text>
              ))}
              
              <Text style={styles.controversiaFatoresTitle}>Fatores de Risco para Cobertura Anaeróbia:</Text>
              {treatment.controversia.fatoresRisco.map((fator, index) => (
                <Text key={index} style={styles.controversiaFator}>• {fator}</Text>
              ))}
            </View>

            {/* Tratamento SEM Cobertura Anaeróbia */}
            <View style={styles.semCoberturaContainer}>
              <Text style={styles.semCoberturaTitle}>{treatment.semCoberturaAnaerobia.titulo}</Text>
              <Text style={styles.semCoberturaDescricao}>{treatment.semCoberturaAnaerobia.descricao}</Text>
              
              {treatment.semCoberturaAnaerobia.medicamentos.map((med, index) => (
                <View key={index} style={styles.medicamentoItem}>
                  <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                  <Text style={styles.medicamentoDose}>{med.dose}</Text>
                </View>
              ))}
            </View>

            {/* Tratamento COM Cobertura Anaeróbia */}
            <View style={styles.comCoberturaContainer}>
              <Text style={styles.comCoberturaTitle}>{treatment.comCoberturaAnaerobia.titulo}</Text>
              <Text style={styles.comCoberturaDescricao}>{treatment.comCoberturaAnaerobia.descricao}</Text>
              
              {/* Monoterapia */}
              <View style={styles.monoterapiaAnaerobiaContainer}>
                <Text style={styles.monoterapiaAnaerobiaTitle}>{treatment.comCoberturaAnaerobia.monoterapia.titulo}</Text>
                
                {treatment.comCoberturaAnaerobia.monoterapia.medicamentos.map((med, index) => (
                  <View key={index} style={styles.medicamentoItem}>
                    <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                    <Text style={styles.medicamentoDose}>{med.dose}</Text>
                  </View>
                ))}
              </View>
              
              {/* Terapia Combinada */}
              <View style={styles.terapiaCombinadaContainer}>
                <Text style={styles.terapiaCombinadaTitle}>{treatment.comCoberturaAnaerobia.terapiaCombinada.titulo}</Text>
                <Text style={styles.terapiaCombinadaDescricao}>{treatment.comCoberturaAnaerobia.terapiaCombinada.descricao}</Text>
                
                {treatment.comCoberturaAnaerobia.terapiaCombinada.medicamentos.map((med, index) => (
                  <View key={index} style={styles.medicamentoItem}>
                    <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                    <Text style={styles.medicamentoDose}>{med.dose}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Duração do Tratamento */}
            <View style={styles.duracaoContainer}>
              <Text style={styles.duracaoTitle}>{treatment.duracao.titulo}</Text>
              <Text style={styles.duracaoDescricao}>{treatment.duracao.descricao}</Text>
            </View>

            {/* Situações Específicas */}
            <View style={styles.situacoesEspecificasContainer}>
              <Text style={styles.situacoesEspecificasTitle}>{treatment.situacoesEspecificas.titulo}</Text>
              
              {treatment.situacoesEspecificas.casos.map((caso, index) => (
                <View key={index} style={styles.situacaoEspecificaItem}>
                  <Text style={styles.situacaoEspecificaNome}>• {caso.situacao}:</Text>
                  <Text style={styles.situacaoEspecificaTratamento}>{caso.tratamento}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    }

    // Renderização especial para pneumonia hospitalar
    if (treatmentKey === 'pneumonia_hospitalar') {
      return (
        <View key={treatmentKey} style={styles.recommendationCard}>
          <View style={[styles.recommendationHeader, { backgroundColor: treatment.color }]}>
            <Pill size={20} color="#FFFFFF" style={{ marginRight: theme.spacing.sm }} />
            <Text style={styles.recommendationTitle}>Pneumonia Hospitalar (PAH/PAVM/TAVM)</Text>
          </View>
          <View style={styles.recommendationContent}>
            <Text style={styles.indicationText}>{treatment.indication}</Text>

            {/* Conceitos Fundamentais */}
            <View style={styles.conceitosContainer}>
              <Text style={styles.conceitosTitle}>{treatment.conceitosFundamentais.titulo}</Text>
              <Text style={styles.conceitosDescricao}>{treatment.conceitosFundamentais.descricao}</Text>
              
              {treatment.conceitosFundamentais.conceitos.map((conceito, index) => (
                <View key={index} style={styles.conceitoItem}>
                  <Text style={styles.conceitoNome}>• {conceito.nome}</Text>
                  <Text style={styles.conceitoDefinicao}>{conceito.definicao}</Text>
                </View>
              ))}
            </View>

            {/* Agentes Etiológicos */}
            <View style={styles.agentesContainer}>
              <Text style={styles.agentesTitle}>{treatment.agentesEtiologicos.titulo}</Text>
              <Text style={styles.agentesDescricao}>{treatment.agentesEtiologicos.descricao}</Text>
              
              <View style={styles.agentesComuns}>
                <Text style={styles.agentesSubtitle}>Agentes Mais Comuns:</Text>
                {treatment.agentesEtiologicos.agentesComuns.map((agente, index) => (
                  <Text key={index} style={styles.agenteItem}>• {agente}</Text>
                ))}
              </View>
              
              <View style={styles.fatoresRiscoContainer}>
                <Text style={styles.fatoresRiscoTitle}>{treatment.agentesEtiologicos.fatoresRiscoMDR.titulo}</Text>
                <Text style={styles.fatoresRiscoDescricao}>{treatment.agentesEtiologicos.fatoresRiscoMDR.descricao}</Text>
                {treatment.agentesEtiologicos.fatoresRiscoMDR.fatores.map((fator, index) => (
                  <Text key={index} style={styles.fatorRiscoItem}>• {fator}</Text>
                ))}
              </View>
            </View>

            {/* Guia Terapêutico */}
            <View style={styles.guiaTerapeuticoContainer}>
              <Text style={styles.guiaTerapeuticoTitle}>{treatment.guiaTerapeutico.titulo}</Text>
              
              {/* Princípio Fundamental */}
              <View style={styles.principioContainer}>
                <Text style={styles.principioTitle}>{treatment.guiaTerapeutico.principioFundamental.titulo}</Text>
                <Text style={styles.principioDescricao}>{treatment.guiaTerapeutico.principioFundamental.descricao}</Text>
              </View>
              
              {/* Tratamento Sem MDR */}
              <View style={styles.tratamentoSemMDRContainer}>
                <Text style={styles.tratamentoSemMDRTitle}>{treatment.guiaTerapeutico.tratamentoEmpiricoSemMDR.titulo}</Text>
                <Text style={styles.tratamentoSemMDRDescricao}>{treatment.guiaTerapeutico.tratamentoEmpiricoSemMDR.descricao}</Text>
                
                {treatment.guiaTerapeutico.tratamentoEmpiricoSemMDR.medicamentos.map((med, index) => (
                  <View key={index} style={styles.medicamentoItem}>
                    <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                    <Text style={styles.medicamentoDose}>{med.dose}</Text>
                  </View>
                ))}
              </View>
              
              {/* Tratamento Com MDR */}
              <View style={styles.tratamentoComMDRContainer}>
                <Text style={styles.tratamentoComMDRTitle}>{treatment.guiaTerapeutico.tratamentoComMDR.titulo}</Text>
                <Text style={styles.tratamentoComMDRDescricao}>{treatment.guiaTerapeutico.tratamentoComMDR.descricao}</Text>
                
                {/* Passo 1 */}
                <View style={styles.passoContainer}>
                  <Text style={styles.passoTitle}>{treatment.guiaTerapeutico.tratamentoComMDR.passo1.titulo}</Text>
                  {treatment.guiaTerapeutico.tratamentoComMDR.passo1.medicamentos.map((med, index) => (
                    <View key={index} style={styles.medicamentoItem}>
                      <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                      <Text style={styles.medicamentoDose}>{med.dose}</Text>
                    </View>
                  ))}
                </View>
                
                {/* Passo 2 */}
                <View style={styles.passoContainer}>
                  <Text style={styles.passoTitle}>{treatment.guiaTerapeutico.tratamentoComMDR.passo2.titulo}</Text>
                  {treatment.guiaTerapeutico.tratamentoComMDR.passo2.medicamentos.map((med, index) => (
                    <View key={index} style={styles.medicamentoItem}>
                      <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                      <Text style={styles.medicamentoDose}>{med.dose}</Text>
                      {med.observacao && <Text style={styles.medicamentoObs}>{med.observacao}</Text>}
                    </View>
                  ))}
                </View>
                
                {/* Passo 3 */}
                <View style={styles.passoContainer}>
                  <Text style={styles.passoTitle}>{treatment.guiaTerapeutico.tratamentoComMDR.passo3.titulo}</Text>
                  {treatment.guiaTerapeutico.tratamentoComMDR.passo3.medicamentos.map((med, index) => (
                    <View key={index} style={styles.medicamentoItem}>
                      <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                      <Text style={styles.medicamentoDose}>{med.dose}</Text>
                      {med.observacao && <Text style={styles.medicamentoObs}>{med.observacao}</Text>}
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Manejo TAVM */}
            <View style={styles.manejoTAVMContainer}>
              <Text style={styles.manejoTAVMTitle}>{treatment.manejoTAVM.titulo}</Text>
              <Text style={styles.manejoTAVMDescricao}>{treatment.manejoTAVM.descricao}</Text>
              <Text style={styles.manejoTAVMCriterios}>Critérios: {treatment.manejoTAVM.criterios}</Text>
              <Text style={styles.manejoTAVMRecomendacao}>Recomendação: {treatment.manejoTAVM.recomendacao}</Text>
            </View>
          </View>
        </View>
      );
    }

    // Renderização específica para exacerbação de DPOC
    if (treatmentKey === 'exacerbacao_dpoc') {
      return (
        <View key={treatmentKey} style={styles.recommendationCard}>
          <View style={[styles.recommendationHeader, { backgroundColor: treatment.color }]}>
            <Pill size={20} color="#FFFFFF" style={{ marginRight: theme.spacing.sm }} />
            <Text style={styles.recommendationTitle}>Exacerbação de DPOC</Text>
          </View>
          <View style={styles.recommendationContent}>
            <Text style={styles.indicationText}>{treatment.indication}</Text>

            {/* Definição e Diagnóstico */}
            <View style={styles.definicaoContainer}>
              <Text style={styles.definicaoTitle}>{treatment.definicao.titulo}</Text>
              <Text style={styles.definicaoConceito}>{treatment.definicao.conceito}</Text>
              
              {/* Diagnóstico Diferencial */}
              <View style={styles.diagnosticoDiferencialContainer}>
                <Text style={styles.diagnosticoDiferencialTitle}>{treatment.definicao.diagnosticoDiferencial.titulo}</Text>
                <Text style={styles.diagnosticoDiferencialDescricao}>{treatment.definicao.diagnosticoDiferencial.descricao}</Text>
                {treatment.definicao.diagnosticoDiferencial.condicoes.map((condicao, index) => (
                  <Text key={index} style={styles.diagnosticoDiferencialItem}>• {condicao}</Text>
                ))}
              </View>
              
              {/* Exames Iniciais */}
              <View style={styles.examesIniciaisContainer}>
                <Text style={styles.examesIniciaisTitle}>{treatment.definicao.examesIniciais.titulo}</Text>
                {treatment.definicao.examesIniciais.exames.map((exame, index) => (
                  <View key={index} style={styles.exameItem}>
                    <Text style={styles.exameNome}>• {exame.nome}</Text>
                    <Text style={styles.exameIndicacao}>{exame.indicacao}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Critérios de Internação */}
            <View style={styles.criteriosInternacaoContainer}>
              <Text style={styles.criteriosInternacaoTitle}>{treatment.criteriosInternacao.titulo}</Text>
              <Text style={styles.criteriosInternacaoDescricao}>{treatment.criteriosInternacao.descricao}</Text>
              {treatment.criteriosInternacao.criterios.map((criterio, index) => (
                <Text key={index} style={styles.criterioItem}>• {criterio}</Text>
              ))}
            </View>

            {/* Pilares do Tratamento */}
            <View style={styles.pilaresTratamentoContainer}>
              <Text style={styles.pilaresTratamentoTitle}>{treatment.pilaresTratamento.titulo}</Text>
              <Text style={styles.pilaresTratamentoDescricao}>{treatment.pilaresTratamento.descricao}</Text>
              
              {/* Passo 1 - Broncodilatadores */}
              <View style={styles.passoTratamentoContainer}>
                <Text style={styles.passoTratamentoTitle}>{treatment.pilaresTratamento.passo1.titulo}</Text>
                <Text style={styles.passoTratamentoDescricao}>{treatment.pilaresTratamento.passo1.descricao}</Text>
                
                {/* Inaladores */}
                <View style={styles.inaladoresContainer}>
                  <Text style={styles.inaladoresTitle}>{treatment.pilaresTratamento.passo1.inaladores.titulo}</Text>
                  {treatment.pilaresTratamento.passo1.inaladores.medicamentos.map((med, index) => (
                    <View key={index} style={styles.medicamentoItem}>
                      <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                      <Text style={styles.medicamentoDose}>{med.dose}</Text>
                    </View>
                  ))}
                </View>
                
                {/* Nebulização */}
                <View style={styles.nebulizacaoContainer}>
                  <Text style={styles.nebulizacaoTitle}>{treatment.pilaresTratamento.passo1.nebulizacao.titulo}</Text>
                  {treatment.pilaresTratamento.passo1.nebulizacao.medicamentos.map((med, index) => (
                    <View key={index} style={styles.medicamentoItem}>
                      <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                      <Text style={styles.medicamentoDose}>{med.dose}</Text>
                    </View>
                  ))}
                </View>
                
                {/* Associação */}
                <View style={styles.associacaoContainer}>
                  <Text style={styles.associacaoTitle}>{treatment.pilaresTratamento.passo1.associacao.titulo}</Text>
                  <Text style={styles.associacaoDescricao}>{treatment.pilaresTratamento.passo1.associacao.descricao}</Text>
                </View>
              </View>
              
              {/* Passo 2 - Manutenção */}
              <View style={styles.passoTratamentoContainer}>
                <Text style={styles.passoTratamentoTitle}>{treatment.pilaresTratamento.passo2.titulo}</Text>
                <Text style={styles.passoTratamentoDescricao}>{treatment.pilaresTratamento.passo2.descricao}</Text>
              </View>
              
              {/* Passo 3 - Corticosteroides */}
              <View style={styles.passoTratamentoContainer}>
                <Text style={styles.passoTratamentoTitle}>{treatment.pilaresTratamento.passo3.titulo}</Text>
                <View style={styles.medicamentoItem}>
                  <Text style={styles.medicamentoNome}>• {treatment.pilaresTratamento.passo3.medicamento.nome}</Text>
                  <Text style={styles.medicamentoDose}>{treatment.pilaresTratamento.passo3.medicamento.dose}</Text>
                </View>
              </View>
              
              {/* Passo 4 - Antibioticoterapia */}
              <View style={styles.passoTratamentoContainer}>
                <Text style={styles.passoTratamentoTitle}>{treatment.pilaresTratamento.passo4.titulo}</Text>
                <Text style={styles.passoTratamentoDescricao}>{treatment.pilaresTratamento.passo4.descricao}</Text>
              </View>
            </View>

            {/* Antibioticoterapia */}
            <View style={styles.antibioticoterapiaContainer}>
              <Text style={styles.antibioticoterapiaTitle}>{treatment.antibioticoterapia.titulo}</Text>
              
              {/* Tratamento Ambulatorial */}
              <View style={styles.ambulatorialContainer}>
                <Text style={styles.ambulatorialTitle}>{treatment.antibioticoterapia.ambulatorial.titulo}</Text>
                
                {/* Sem Risco */}
                <View style={styles.semRiscoContainer}>
                  <Text style={styles.semRiscoTitle}>{treatment.antibioticoterapia.ambulatorial.semRisco.titulo}</Text>
                  {treatment.antibioticoterapia.ambulatorial.semRisco.medicamentos.map((med, index) => (
                    <View key={index} style={styles.medicamentoItem}>
                      <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                      <Text style={styles.medicamentoDose}>{med.dose}</Text>
                    </View>
                  ))}
                </View>
                
                {/* Com Risco */}
                <View style={styles.comRiscoContainer}>
                  <Text style={styles.comRiscoTitle}>{treatment.antibioticoterapia.ambulatorial.comRisco.titulo}</Text>
                  {treatment.antibioticoterapia.ambulatorial.comRisco.medicamentos.map((med, index) => (
                    <View key={index} style={styles.medicamentoItem}>
                      <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                      <Text style={styles.medicamentoDose}>{med.dose}</Text>
                    </View>
                  ))}
                </View>
                
                {/* Risco Pseudomonas */}
                <View style={styles.riscoPseudomonasContainer}>
                  <Text style={styles.riscoPseudomonasTitle}>{treatment.antibioticoterapia.ambulatorial.riscoPseudomonas.titulo}</Text>
                  {treatment.antibioticoterapia.ambulatorial.riscoPseudomonas.medicamentos.map((med, index) => (
                    <View key={index} style={styles.medicamentoItem}>
                      <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                      <Text style={styles.medicamentoDose}>{med.dose}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              {/* Tratamento Hospitalar */}
              <View style={styles.hospitalarContainer}>
                <Text style={styles.hospitalarTitle}>{treatment.antibioticoterapia.hospitalar.titulo}</Text>
                
                {/* Esquema Padrão */}
                <View style={styles.esquemaPadraoContainer}>
                  <Text style={styles.esquemaPadraoTitle}>{treatment.antibioticoterapia.hospitalar.esquemaPadrao.titulo}</Text>
                  {treatment.antibioticoterapia.hospitalar.esquemaPadrao.medicamentos.map((med, index) => (
                    <View key={index} style={styles.medicamentoItem}>
                      <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                      <Text style={styles.medicamentoDose}>{med.dose}</Text>
                    </View>
                  ))}
                </View>
                
                {/* Risco Pseudomonas */}
                <View style={styles.riscoPseudomonasHospitalarContainer}>
                  <Text style={styles.riscoPseudomonasHospitalarTitle}>{treatment.antibioticoterapia.hospitalar.riscoPseudomonas.titulo}</Text>
                  
                  {/* Empírico Inicial */}
                  <View style={styles.empiricoInicialContainer}>
                    <Text style={styles.empiricoInicialTitle}>{treatment.antibioticoterapia.hospitalar.riscoPseudomonas.empiricoInicial.titulo}</Text>
                    {treatment.antibioticoterapia.hospitalar.riscoPseudomonas.empiricoInicial.medicamentos.map((med, index) => (
                      <View key={index} style={styles.medicamentoItem}>
                        <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                        <Text style={styles.medicamentoDose}>{med.dose}</Text>
                      </View>
                    ))}
                  </View>
                  
                  {/* Escalonamento */}
                  <View style={styles.escalonamentoContainer}>
                    <Text style={styles.escalonamentoTitle}>{treatment.antibioticoterapia.hospitalar.riscoPseudomonas.escalonamento.titulo}</Text>
                    {treatment.antibioticoterapia.hospitalar.riscoPseudomonas.escalonamento.medicamentos.map((med, index) => (
                      <View key={index} style={styles.medicamentoItem}>
                        <Text style={styles.medicamentoNome}>• {med.nome}</Text>
                        <Text style={styles.medicamentoDose}>{med.dose}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              
              {/* Fatores de Risco */}
              <View style={styles.fatoresRiscoDPOCContainer}>
                <Text style={styles.fatoresRiscoDPOCTitle}>Fatores de Risco</Text>
                
                {/* Desfecho Negativo */}
                <View style={styles.desfechoNegativoContainer}>
                  <Text style={styles.desfechoNegativoTitle}>{treatment.antibioticoterapia.fatoresRisco.desfechoNegativo.titulo}</Text>
                  {treatment.antibioticoterapia.fatoresRisco.desfechoNegativo.fatores.map((fator, index) => (
                    <Text key={index} style={styles.fatorRiscoItem}>• {fator}</Text>
                  ))}
                </View>
                
                {/* Pseudomonas */}
                <View style={styles.pseudomonasFatoresContainer}>
                  <Text style={styles.pseudomonasFatoresTitle}>{treatment.antibioticoterapia.fatoresRisco.pseudomonas.titulo}</Text>
                  {treatment.antibioticoterapia.fatoresRisco.pseudomonas.fatores.map((fator, index) => (
                    <Text key={index} style={styles.fatorRiscoItem}>• {fator}</Text>
                  ))}
                </View>
              </View>
            </View>

            {/* Suporte Avançado */}
            <View style={styles.suporteAvancadoContainer}>
              <Text style={styles.suporteAvancadoTitle}>{treatment.suporteAvancado.titulo}</Text>
              
              {/* VNI */}
              <View style={styles.vniContainer}>
                <Text style={styles.vniTitle}>{treatment.suporteAvancado.vni.titulo}</Text>
                <Text style={styles.vniDescricao}>{treatment.suporteAvancado.vni.descricao}</Text>
                
                {/* Indicações VNI */}
                <View style={styles.vniIndicacoesContainer}>
                  <Text style={styles.vniIndicacoesTitle}>{treatment.suporteAvancado.vni.indicacoes.titulo}</Text>
                  {treatment.suporteAvancado.vni.indicacoes.criterios.map((criterio, index) => (
                    <Text key={index} style={styles.criterioVNIItem}>• {criterio}</Text>
                  ))}
                </View>
                
                {/* Configuração VNI */}
                <View style={styles.vniConfiguracaoContainer}>
                  <Text style={styles.vniConfiguracaoModo}>{treatment.suporteAvancado.vni.configuracao.modo}</Text>
                  <Text style={styles.vniConfiguracaoSaturacao}>{treatment.suporteAvancado.vni.configuracao.saturacao}</Text>
                </View>
              </View>
              
              {/* UTI */}
              <View style={styles.utiContainer}>
                <Text style={styles.utiTitle}>{treatment.suporteAvancado.uti.titulo}</Text>
                {treatment.suporteAvancado.uti.criterios.map((criterio, index) => (
                  <Text key={index} style={styles.criterioUTIItem}>• {criterio}</Text>
                ))}
              </View>
            </View>
          </View>
        </View>
      );
    }

    // Renderização padrão para outros tratamentos
    return (
      <View key={treatmentKey} style={styles.recommendationCard}>
        <View style={[styles.recommendationHeader, { backgroundColor: treatment.color }]}>
          <Pill size={20} color="#FFFFFF" style={{ marginRight: theme.spacing.sm }} />
          <Text style={styles.recommendationTitle}>{cardTitle}</Text>
        </View>
        <View style={styles.recommendationContent}>
          <Text style={styles.drugText}>{treatment.drug}</Text>
          <Text style={styles.doseText}>{treatment.dose}</Text>
          
          <Text style={styles.indicationText}>{treatment.indication}</Text>
          
          {treatment.alternativa && (
            <View style={styles.alternativaContainer}>
              <Text style={styles.alternativaTitle}>💊 Alternativa:</Text>
              <Text style={styles.alternativaText}>{treatment.alternativa}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Escolha do ATB pelo Sítio Infeccioso" type="antibiotic" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Card de Introdução */}
        <View style={styles.infoCard}>
          <Pill size={24} color="#0891B2" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>🔍 Assistente de Antibioticoterapia</Text>
            <Text style={styles.infoText}>
              Escolha a antibioticoterapia adequada através de busca direta ou questionário guiado baseado em diretrizes clínicas.
            </Text>
          </View>
        </View>

        {/* Área de Pesquisa */}
        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}>🔍 Busca Rápida</Text>
          <Text style={styles.searchSubtitle}>Digite o nome da infecção para ir direto ao tratamento:</Text>
          
          <View style={styles.searchInputContainer}>
            <View style={styles.searchContainer}>
              <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Ex: pneumonia, infecção urinária, celulite..."
                value={searchQuery}
                onChangeText={handleSearchInput}
                onFocus={() => setShowSuggestions(searchQuery.length >= 2)}
                onSubmitEditing={handleSearch}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {showSuggestions && filteredInfections.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={filteredInfections}
                  renderItem={renderSuggestionItem}
                  keyExtractor={(item) => item.id}
                  style={styles.suggestionsList}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}
            
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Search size={20} color="#FFFFFF" />
              <Text style={styles.searchButtonText}>Pesquisar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divisor */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Questionário Guiado */}
        {showQuestionario && !isCompleted ? (
          <>
            <View style={styles.questionarioHeader}>
              <FileText size={24} color="#0891B2" />
              <Text style={styles.questionarioTitle}>Questionário Guiado</Text>
            </View>

            <View style={styles.questionCard}>
              <Text style={styles.questionNumber}>Pergunta {currentQuestionId}</Text>
              <Text style={styles.questionText}>{getCurrentQuestion()?.question}</Text>
            </View>

            <View style={styles.optionsContainer}>
              {getCurrentQuestion()?.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(option)}
                >
                  <Text style={styles.optionText}>{option.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : isCompleted ? (
          <>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>✅ Recomendação de Antibioticoterapia</Text>
              {recommendedTreatments.length > 0 ? (
                <Text style={styles.resultSubtitle}>
                  Baseado nas informações fornecidas, recomendamos:
                </Text>
              ) : (
                <Text style={styles.resultSubtitle}>
                  Nenhum tratamento específico encontrado. Consulte um especialista.
                </Text>
              )}
            </View>

            {recommendedTreatments.map((treatment) => 
              renderTreatmentRecommendation(treatment)
            )}

            <TouchableOpacity style={styles.resetButton} onPress={resetQuiz}>
              <Text style={styles.resetButtonText}>🔄 Nova Consulta</Text>
            </TouchableOpacity>

            <View style={styles.disclaimerCard}>
              <Text style={styles.disclaimerText}>
                ⚠️ Esta ferramenta oferece sugestões baseadas em diretrizes gerais. 
                Sempre consulte as diretrizes institucionais e avalie individualmente cada caso.
              </Text>
            </View>
          </>
        ) : null}
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
    padding: theme.spacing.lg,
  },
  infoCard: {
    backgroundColor: '#ECFEFF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: '#0891B2',
  },
  infoTextContainer: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  infoTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  searchCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3',
  },
  searchTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  searchSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  searchInputContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: theme.spacing.sm,
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
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
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
    backgroundColor: '#FFFFFF',
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
    marginTop: -theme.spacing.sm,
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
  searchButton: {
    backgroundColor: '#0891B2',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  searchButtonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.md,
  },
  questionarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  questionarioTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#0891B2',
    marginBottom: theme.spacing.xs,
  },
  questionText: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: theme.spacing.sm,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  resultTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.xs,
  },
  resultSubtitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    lineHeight: 20,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationHeader: {
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
  recommendationContent: {
    padding: theme.spacing.lg,
  },
  drugText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
  },
  doseText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  indicationText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  alternativaContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#F3E5F5',
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: '#0891B2',
  },
  alternativaTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#0891B2',
    marginBottom: theme.spacing.xs,
  },
  alternativaText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#6A1B9A',
    lineHeight: 18,
  },
  resetButton: {
    backgroundColor: '#0891B2',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  resetButtonText: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
  disclaimerCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: '#FF9800',
  },
  disclaimerText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#E65100',
    lineHeight: 18,
    textAlign: 'center',
  },
  
  // Estilos específicos para cistite
  primeiraLinhaContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  primeiraLinhaTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.xs,
  },
  primeiraLinhaSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    marginBottom: theme.spacing.md,
  },
  segundaLinhaContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  segundaLinhaTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#F57C00',
    marginBottom: theme.spacing.xs,
  },
  segundaLinhaSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    marginBottom: theme.spacing.md,
  },
  sintomaticoContainer: {
    backgroundColor: '#F3E5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#0891B2',
  },
  sintomaticoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#0891B2',
    marginBottom: theme.spacing.md,
  },
  duracaoContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  duracaoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.md,
  },
  duracaoItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  medicamentoItem: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  medicamentoNome: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  medicamentoDose: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#1976D2',
    marginBottom: theme.spacing.xs,
  },
  medicamentoObs: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  
  // Estilos específicos para pielonefrite
  abordagemContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  abordagemTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#C2185B',
    marginBottom: theme.spacing.xs,
  },
  abordagemText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  intravenosoContainer: {
    backgroundColor: '#FDE7F3',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#EC407A',
  },
  intravenosoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#AD1457',
    marginBottom: theme.spacing.md,
  },
  categoriaContainer: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: '#F8BBD9',
  },
  categoriaTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#880E4F',
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  oralContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  oralTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.xs,
  },
  oralSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    marginBottom: theme.spacing.md,
  },
  
  // Estilos específicos para exames de imagem na pielonefrite
  examesImagemContainer: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  examesImagemTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.md,
  },
  examesImagemItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  
  // Estilos específicos para prostatite bacteriana aguda
  prostatiteNaoComplicadaContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  prostatiteNaoComplicadaTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#7B1FA2',
    marginBottom: theme.spacing.md,
  },
  prostatitePrimeiraEscolhaContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  prostatitePrimeiraEscolhaTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.xs,
  },
  prostatitePrimeiraEscolhaDesc: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    marginBottom: theme.spacing.sm,
    fontStyle: 'italic',
  },
  prostatiteAlternativoContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  prostatiteAlternativoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#F57C00',
    marginBottom: theme.spacing.sm,
  },
  prostatiteComplicadaContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  prostatiteComplicadaTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#C2185B',
    marginBottom: theme.spacing.xs,
  },
  prostatiteComplicadaDesc: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  prostatiteMonoterapiaContainer: {
    backgroundColor: '#FDE7F3',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#EC407A',
  },
  prostatiteMonoterapiaTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#AD1457',
    marginBottom: theme.spacing.sm,
  },
  prostatiteCombinadoContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  prostatiteCombinadoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.xs,
  },
  prostatiteCombinadoDesc: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    marginBottom: theme.spacing.sm,
    fontStyle: 'italic',
  },
  avisoImportanteContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    borderWidth: 2,
    borderColor: '#FFB74D',
  },
  avisoImportanteTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#E65100',
    marginBottom: theme.spacing.sm,
  },
  avisoImportanteTexto: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#BF360C',
    lineHeight: 18,
    textAlign: 'justify',
  },
  
  // Estilos específicos para pneumonia comunitária
  pneumoniaSemComorbiContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  pneumoniaSemComorbiTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaSemComorbiDesc: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  pneumoniaPrimeiraLinhaContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  pneumoniaPrimeiraLinhaTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.sm,
  },
  pneumoniaAlternativasContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  pneumoniaAlternativasTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#F57C00',
    marginBottom: theme.spacing.sm,
  },
  pneumoniaDuracaoContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  pneumoniaDuracaoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaDuracaoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  pneumoniaComComorbiContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  pneumoniaComComorbiTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#C2185B',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaComComorbiDesc: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  pneumoniaTerapiaDuplaContainer: {
    backgroundColor: '#F3E5F5',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#9C27B0',
  },
  pneumoniaTerapiaDuplaTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#7B1FA2',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaTerapiaDuplaDesc: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    marginBottom: theme.spacing.sm,
    fontStyle: 'italic',
  },
  pneumoniaMonoterapiaContainer: {
    backgroundColor: '#FDF4E3',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#FB8C00',
  },
  pneumoniaMonoterapiaTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#E65100',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaMonoterapiaDesc: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    marginBottom: theme.spacing.sm,
    fontStyle: 'italic',
  },
  pneumoniaDefinicaoContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#757575',
  },
  pneumoniaDefinicaoText: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: '#616161',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  // Estilos para a definição de comorbidades com destaque
  pneumoniaDefinicaoImportanteContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: '#FFC107',
    shadowColor: '#FF6F00',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  pneumoniaDefinicaoImportanteText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#E65100',
    lineHeight: 20,
    textAlign: 'justify',
  },
  pneumoniaSituacoesContainer: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  pneumoniaSituacoesTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.md,
  },
  pneumoniaSituacaoItem: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  pneumoniaSituacaoNome: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1B5E20',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaSituacaoTrat: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },

  // Estilos para seções colapsáveis da pneumonia comunitária
  collapseSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  collapseSectionHeader: {
    backgroundColor: '#F8F9FA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  collapseSectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    flex: 1,
  },
  collapseIcon: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto-Bold',
  },
  collapseSectionContent: {
    padding: theme.spacing.md,
  },
  collapseSectionDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  collapseSubsectionHeader: {
    backgroundColor: '#F0F8FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  collapseSubsectionTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    flex: 1,
  },
  collapseSubIcon: {
    fontSize: theme.fontSize.sm,
    color: '#1976D2',
    fontFamily: 'Roboto-Bold',
  },
  collapseSubsectionContent: {
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  subDescription: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 16,
  },
  medicationCategory: {
    backgroundColor: '#F8F9FA',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#6C757D',
  },
  medicationCategoryTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#495057',
    marginBottom: theme.spacing.xs,
  },
  medicationCategoryDesc: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontStyle: 'italic',
  },
  medicationSubcategory: {
    backgroundColor: '#E9ECEF',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    borderLeftWidth: 2,
    borderLeftColor: '#ADB5BD',
  },
  medicationSubcategoryTitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#6C757D',
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  medicationItem: {
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  medicationName: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  medicationDose: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Medium',
    color: '#1976D2',
    marginBottom: theme.spacing.xs,
  },
  medicationObs: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.textSecondary,
    lineHeight: 14,
    fontStyle: 'italic',
  },
  importantNote: {
    backgroundColor: '#FFF8E1',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  importantNoteText: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#E65100',
    lineHeight: 16,
  },
  warningNote: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  warningNoteText: {
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
    color: '#E65100',
    lineHeight: 14,
  },
  durationCategory: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  durationTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.xs,
  },
  durationText: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 16,
    marginBottom: theme.spacing.xs,
  },
  specificSituationItem: {
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  specificSituationTitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  specificSituationText: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 16,
  },
  
  // Estilos para seção Situações Especiais - P. aeruginosa e MRSA
  pneumoniaSituacoesEspeciaisContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  pneumoniaSituacoesEspeciaisTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#E65100',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaSituacoesEspeciaisDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  pneumoniaSituacoesEspeciaisQuandoContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#FFA000',
  },
  pneumoniaSituacoesEspeciaisQuandoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#F57C00',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaSituacoesEspeciaisQuandoDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  pneumoniaSituacoesEspeciaisFatorItem: {
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  pneumoniaSituacoesEspeciaisFatorCategoria: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#E65100',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaSituacoesEspeciaisFatorDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
    paddingLeft: theme.spacing.sm,
  },
  pneumoniaSituacoesEspeciaisComoContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  pneumoniaSituacoesEspeciaisComoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#E65100',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaSituacoesEspeciaisComoDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  
  // Estilos para seção MRSA na situação especial
  pneumoniaSituacoesEspeciaisMRSAContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#EF9A9A',
  },
  pneumoniaSituacoesEspeciaisMRSATitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#D32F2F',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaSituacoesEspeciaisMRSADescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  pneumoniaSituacoesEspeciaisMRSAQuandoContainer: {
    backgroundColor: '#FFCDD2',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#C62828',
  },
  pneumoniaSituacoesEspeciaisMRSAQuandoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#B71C1C',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaSituacoesEspeciaisMRSAQuandoDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  pneumoniaSituacoesEspeciaisMRSAFatorItem: {
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#FFCDD2',
  },
  pneumoniaSituacoesEspeciaisMRSAFatorCategoria: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#B71C1C',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaSituacoesEspeciaisMRSAFatorDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
    paddingLeft: theme.spacing.sm,
  },
  pneumoniaSituacoesEspeciaisMRSAComoContainer: {
    backgroundColor: '#FFCDD2',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#D32F2F',
  },
  pneumoniaSituacoesEspeciaisMRSAComoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#B71C1C',
    marginBottom: theme.spacing.xs,
  },
  pneumoniaSituacoesEspeciaisMRSAComoDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },

  // Estilos específicos para seções colapsáveis coloridas da pneumonia
  pneumoniaCollapseSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pneumoniaCollapseSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pneumoniaCollapseSectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  pneumoniaCollapseIcon: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
  },
  pneumoniaCollapseSectionContent: {
    padding: theme.spacing.md,
  },
  pneumoniaCollapseSectionDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },

  // Estilos para o card destacado das alternativas à Ceftriaxona
  pneumoniaAlternativasCeftriaxonaContainer: {
    backgroundColor: '#F3E5F5', // Fundo roxo suave
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: '#AB47BC',
    shadowColor: '#7B1FA2',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  pneumoniaAlternativasCeftriaxonaTitle: {
    fontSize: theme.fontSize.lg, // Fonte maior
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF', // Texto branco
    backgroundColor: '#9C27B0', // Fundo roxo
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
    marginBottom: 0,
    textAlign: 'center',
  },
  pneumoniaAlternativasCeftriaxonaContent: {
    padding: theme.spacing.md,
  },

  // Estilos para o card destacado da Opção Preferencial
  pneumoniaOpcaoPreferencialContainer: {
    backgroundColor: '#E8F5E8', // Fundo verde suave
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: '#66BB6A',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  pneumoniaOpcaoPreferencialTitle: {
    fontSize: theme.fontSize.lg, // Fonte maior
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF', // Texto branco
    backgroundColor: '#4CAF50', // Fundo verde
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
    marginBottom: 0,
    textAlign: 'center',
  },
  pneumoniaOpcaoPreferencialContent: {
    padding: theme.spacing.md,
  },

  // Estilos para o card destacado da Alternativa Monoterapia
  pneumoniaAlternativaMonoterapiaContainer: {
    backgroundColor: '#FFF3E0', // Fundo laranja suave
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: '#FFB74D',
    shadowColor: '#FF9800',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  pneumoniaAlternativaMonoterapiaTitle: {
    fontSize: theme.fontSize.lg, // Fonte maior
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF', // Texto branco
    backgroundColor: '#FF9800', // Fundo laranja
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
    marginBottom: 0,
    textAlign: 'center',
  },
  pneumoniaAlternativaMonoterapiaContent: {
    padding: theme.spacing.md,
  },

  // Estilos para a seção de escores
  scoreSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: '#F3E8FF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  scoreSectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#7C3AED',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  scoreSectionContent: {
    padding: theme.spacing.md,
  },
  scoreSectionDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
    textAlign: 'center',
  },
  scoreSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  scoreSelectorButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  scoreSelectorButtonActive: {
    backgroundColor: '#7C3AED',
  },
  scoreSelectorText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#666',
  },
  scoreSelectorTextActive: {
    color: '#FFFFFF',
  },
  curbContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  scoreTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  scoreItem: {
    marginBottom: theme.spacing.sm,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#7C3AED',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: '#7C3AED',
  },
  checkboxText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
  },
  checkboxLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    flex: 1,
  },
  scoreResult: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
  },
  scoreResultTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  scoreResultText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    lineHeight: 20,
    textAlign: 'center',
  },
  psiContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  psiImageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  psiImageTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  psiTable: {
    marginBottom: theme.spacing.md,
  },
  psiTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.xs,
  },
  psiTableHeader: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.xs,
  },
  psiTableCell: {
    flex: 1,
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.xs,
  },
  psiInterpretation: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.md,
  },
  psiInterpretationTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  psiGroup: {
    marginBottom: theme.spacing.xs,
  },
  psiGroupTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    lineHeight: 20,
  },
  psiSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  psiSectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.md,
  },
  psiGenderSelector: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  psiGenderButtons: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
  },
  psiGenderButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  psiGenderButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  psiGenderButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#757575',
  },
  psiGenderButtonTextActive: {
    color: '#1976D2',
  },
  psiAgeInput: {
    marginTop: theme.spacing.md,
  },
  psiAgeTextInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.xs,
    color: theme.colors.text,
  },
  psiAgePoints: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#1976D2',
    marginTop: theme.spacing.xs,
  },
  
  // Estilos para a tabela de patógenos
  pathogensSection: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pathogensSectionTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  pathogensSectionDescription: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#1B5E20',
    marginBottom: theme.spacing.md,
    lineHeight: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  pathogensTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  pathogensTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  pathogensTableHeaderText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  pathogensTableHeaderPathogen: {
    flex: 1.6,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  pathogensTableHeaderType: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  pathogensTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E8',
  },
  pathogensTableCellPathogen: {
    flex: 1.6,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#2E7D32',
  },
  pathogensTableCellType: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    textAlign: 'left',
  },

  // Estilos específicos para pneumonia aspirativa
  controversiaContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    borderWidth: 2,
    borderColor: '#FFCC02',
  },
  controversiaTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#E65100',
    marginBottom: theme.spacing.sm,
  },
  controversiaDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  controversiaDiretriz: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#BF360C',
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  controversiaFatoresTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#E65100',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  controversiaFator: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#D84315',
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  
  // Tratamento sem cobertura anaeróbia
  semCoberturaContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  semCoberturaTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.xs,
  },
  semCoberturaDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  
  // Tratamento com cobertura anaeróbia
  comCoberturaContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  comCoberturaTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#C2185B',
    marginBottom: theme.spacing.xs,
  },
  comCoberturaDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  
  // Monoterapia anaeróbia
  monoterapiaAnaerobiaContainer: {
    backgroundColor: '#F3E5F5',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#9C27B0',
  },
  monoterapiaAnaerobiaTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#7B1FA2',
    marginBottom: theme.spacing.sm,
  },
  
  // Terapia combinada
  terapiaCombinadaContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  terapiaCombinadaTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.xs,
  },
  terapiaCombinadaDescricao: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: '#424242',
    marginBottom: theme.spacing.sm,
    fontStyle: 'italic',
  },
  
  // Duração específica para aspirativa
  duracaoDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  
  // Situações específicas para aspirativa
  situacoesEspecificasContainer: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  situacoesEspecificasTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.md,
  },
  situacaoEspecificaItem: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  situacaoEspecificaNome: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1B5E20',
    marginBottom: theme.spacing.xs,
  },
  situacaoEspecificaTratamento: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },

  // Estilos específicos para pneumonia hospitalar
  conceitosContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  conceitosTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.xs,
  },
  conceitosDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  conceitoItem: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },
  conceitoNome: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#0D47A1',
    marginBottom: theme.spacing.xs,
  },
  conceitoDefinicao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  
  // Agentes Etiológicos
  agentesContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  agentesTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#F57C00',
    marginBottom: theme.spacing.xs,
  },
  agentesDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  agentesComuns: {
    marginBottom: theme.spacing.md,
  },
  agentesSubtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#E65100',
    marginBottom: theme.spacing.sm,
  },
  agenteItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  fatoresRiscoContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
  },
  fatoresRiscoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#D32F2F',
    marginBottom: theme.spacing.xs,
  },
  fatoresRiscoDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  fatorRiscoItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#C62828',
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  
  // Guia Terapêutico
  guiaTerapeuticoContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  guiaTerapeuticoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.md,
  },
  principioContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#FFC107',
  },
  principioTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#F57C00',
    marginBottom: theme.spacing.xs,
  },
  principioDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  
  // Tratamento Sem MDR
  tratamentoSemMDRContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  tratamentoSemMDRTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.xs,
  },
  tratamentoSemMDRDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  
  // Tratamento Com MDR
  tratamentoComMDRContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#E91E63',
  },
  tratamentoComMDRTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#C2185B',
    marginBottom: theme.spacing.xs,
  },
  tratamentoComMDRDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  passoContainer: {
    backgroundColor: '#F3E5F5',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#9C27B0',
  },
  passoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#7B1FA2',
    marginBottom: theme.spacing.sm,
  },
  
  // Manejo TAVM
  manejoTAVMContainer: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#673AB7',
  },
  manejoTAVMTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#512DA8',
    marginBottom: theme.spacing.xs,
  },
  manejoTAVMDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  manejoTAVMCriterios: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#4527A0',
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  manejoTAVMRecomendacao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#4527A0',
    lineHeight: 18,
  },
  
  // Estilos específicos para exacerbação de DPOC
  definicaoContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  definicaoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.xs,
  },
  definicaoConceito: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  diagnosticoDiferencialContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  diagnosticoDiferencialTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#F57C00',
    marginBottom: theme.spacing.xs,
  },
  diagnosticoDiferencialDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  diagnosticoDiferencialItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#E65100',
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  examesIniciaisContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  examesIniciaisTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.sm,
  },
  exameItem: {
    marginBottom: theme.spacing.sm,
  },
  exameNome: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#0D47A1',
    marginBottom: theme.spacing.xs,
  },
  exameIndicacao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 18,
  },
  criteriosInternacaoContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  criteriosInternacaoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#C2185B',
    marginBottom: theme.spacing.xs,
  },
  criteriosInternacaoDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  criterioItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#AD1457',
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  pilaresTratamentoContainer: {
    backgroundColor: '#F3E5F5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  pilaresTratamentoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#7B1FA2',
    marginBottom: theme.spacing.xs,
  },
  pilaresTratamentoDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  passoTratamentoContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#6C757D',
  },
  passoTratamentoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#495057',
    marginBottom: theme.spacing.xs,
  },
  passoTratamentoDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  inaladoresContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#4CAF50',
  },
  inaladoresTitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.xs,
  },
  nebulizacaoContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#2196F3',
  },
  nebulizacaoTitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.xs,
  },
  associacaoContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#FF9800',
  },
  associacaoTitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#F57C00',
    marginBottom: theme.spacing.xs,
  },
  associacaoDescricao: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 16,
  },
  antibioticoterapiaContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  antibioticoterapiaTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: theme.spacing.md,
  },
  ambulatorialContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  ambulatorialTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.sm,
  },
  semRiscoContainer: {
    backgroundColor: '#F0FFF4',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#66BB6A',
  },
  semRiscoTitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#388E3C',
    marginBottom: theme.spacing.xs,
  },
  comRiscoContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#FFA000',
  },
  comRiscoTitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#F57C00',
    marginBottom: theme.spacing.xs,
  },
  riscoPseudomonasContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#F44336',
  },
  riscoPseudomonasTitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#D32F2F',
    marginBottom: theme.spacing.xs,
  },
  hospitalarContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#E91E63',
  },
  hospitalarTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#C2185B',
    marginBottom: theme.spacing.sm,
  },
  esquemaPadraoContainer: {
    backgroundColor: '#F3E5F5',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#9C27B0',
  },
  esquemaPadraoTitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#7B1FA2',
    marginBottom: theme.spacing.xs,
  },
  riscoPseudomonasHospitalarContainer: {
    backgroundColor: '#FDE7F3',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#EC407A',
  },
  riscoPseudomonasHospitalarTitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#AD1457',
    marginBottom: theme.spacing.xs,
  },
  empiricoInicialContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  empiricoInicialTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#2E7D32',
    marginBottom: theme.spacing.sm,
    textAlign: 'left',
  },
  escalonamentoContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#E91E63',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  escalonamentoTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#C2185B',
    marginBottom: theme.spacing.sm,
    textAlign: 'left',
  },
  fatoresRiscoDPOCContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#FFC107',
  },
  fatoresRiscoDPOCTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#F57C00',
    marginBottom: theme.spacing.md,
  },
  desfechoNegativoContainer: {
    backgroundColor: '#FFECB3',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#FFB300',
  },
  desfechoNegativoTitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#FF8F00',
    marginBottom: theme.spacing.xs,
  },
  pseudomonasFatoresContainer: {
    backgroundColor: '#FFCDD2',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#F44336',
  },
  pseudomonasFatoresTitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#D32F2F',
    marginBottom: theme.spacing.xs,
  },
  suporteAvancadoContainer: {
    backgroundColor: '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#673AB7',
  },
  suporteAvancadoTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: '#512DA8',
    marginBottom: theme.spacing.md,
  },
  vniContainer: {
    backgroundColor: '#E8EAF6',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#7986CB',
  },
  vniTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#3F51B5',
    marginBottom: theme.spacing.xs,
  },
  vniDescricao: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  vniIndicacoesContainer: {
    backgroundColor: '#C5CAE9',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#5C6BC0',
  },
  vniIndicacoesTitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#3949AB',
    marginBottom: theme.spacing.xs,
  },
  criterioVNIItem: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 16,
  },
  vniConfiguracaoContainer: {
    backgroundColor: '#C5CAE9',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#5C6BC0',
  },
  vniConfiguracaoModo: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#3949AB',
    marginBottom: theme.spacing.xs,
  },
  vniConfiguracaoSaturacao: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: '#3949AB',
  },
  utiContainer: {
    backgroundColor: '#FFCDD2',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
  },
  utiTitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Bold',
    color: '#D32F2F',
    marginBottom: theme.spacing.sm,
  },
  criterioUTIItem: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: '#C62828',
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
});
