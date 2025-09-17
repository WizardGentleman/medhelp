import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { Stethoscope, Search, Filter, CheckCircle, Info, ChevronDown, ChevronUp, Shield } from 'lucide-react-native';

interface Medicamento {
  nome: string;
  categoria: string;
  mecanismo_de_acao: string;
  dose_habitual: string;
  dose_maxima: string;
  frequencia_de_administracao: string;
  precaucoes_e_efeitos_colaterais: string;
  observacoes?: string;
  disponivel_no_SUS: boolean;
}

const medicamentosData: Medicamento[] = [
  {
    nome: "Captopril",
    categoria: "Inibidor da enzima conversora de angiotensina (IECA)",
    mecanismo_de_acao: "Inibe a ECA, impedindo a formação de angiotensina II.",
    dose_habitual: "25 a 150 mg/dia",
    dose_maxima: "250 mg/dia",
    frequencia_de_administracao: "2 a 3 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com BRA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal; angioedema (mais comum em negros); tosse seca; tontura. Contraindicado na gravidez.",
    disponivel_no_SUS: true
  },
  {
    nome: "Maleato de enalapril",
    categoria: "Inibidor da enzima conversora de angiotensina (IECA)",
    mecanismo_de_acao: "Inibe a ECA, impedindo a formação de angiotensina II.",
    dose_habitual: "5 a 40 mg/dia",
    dose_maxima: "40 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com BRA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal; angioedema; tosse seca; tontura. Contraindicado na gravidez.",
    disponivel_no_SUS: true
  },
  {
    nome: "Benazepril",
    categoria: "Inibidor da enzima conversora de angiotensina (IECA)",
    mecanismo_de_acao: "Inibe a ECA, diminuindo a formação de angiotensina I e II.",
    dose_habitual: "5-80 mg/dia",
    dose_maxima: "80 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com BRA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal; angioedema; tosse. Contraindicado na gravidez.",
    disponivel_no_SUS: false
  },
  {
    nome: "Lisinopril",
    categoria: "Inibidor da enzima conversora de angiotensina (IECA)",
    mecanismo_de_acao: "Inibe a ECA, diminuindo a formação de angiotensina I e II.",
    dose_habitual: "5-40 mg/dia",
    dose_maxima: "40 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com BRA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal; angioedema; tosse. Contraindicado na gravidez.",
    disponivel_no_SUS: false
  },
  {
    nome: "Perindopril",
    categoria: "Inibidor da enzima conversora de angiotensina (IECA)",
    mecanismo_de_acao: "Inibe a ECA, diminuindo a formação de angiotensina I e II.",
    dose_habitual: "4-16 mg/dia",
    dose_maxima: "16 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com BRA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal; angioedema; tosse. Contraindicado na gravidez.",
    disponivel_no_SUS: false
  },
  {
    nome: "Quinapril",
    categoria: "Inibidor da enzima conversora de angiotensina (IECA)",
    mecanismo_de_acao: "Inibe a ECA, diminuindo a formação de angiotensina I e II.",
    dose_habitual: "10-80 mg/dia",
    dose_maxima: "80 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com BRA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal; angioedema; tosse. Contraindicado na gravidez.",
    disponivel_no_SUS: false
  },
  {
    nome: "Ramipril",
    categoria: "Inibidor da enzima conversora de angiotensina (IECA)",
    mecanismo_de_acao: "Inibe a ECA, diminuindo a formação de angiotensina I e II.",
    dose_habitual: "2.5-20 mg/dia",
    dose_maxima: "20 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com BRA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal; angioedema; tosse. Contraindicado na gravidez.",
    disponivel_no_SUS: false
  },
  {
    nome: "Trandolapril",
    categoria: "Inibidor da enzima conversora de angiotensina (IECA)",
    mecanismo_de_acao: "Inibe a ECA, diminuindo a formação de angiotensina I e II.",
    dose_habitual: "2-8 mg/dia",
    dose_maxima: "8 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com BRA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal; angioedema; tosse. Contraindicado na gravidez.",
    disponivel_no_SUS: false
  },
  {
    nome: "Losartana potássica",
    categoria: "Bloqueador do receptor de angiotensina (BRA)",
    mecanismo_de_acao: "Inibe a ligação da angiotensina II ao receptor de angiotensina tipo 1.",
    dose_habitual: "50 a 100 mg/dia",
    dose_maxima: "100 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com IECA ou inibidor direto da renina; hipercalemia (especialmente em DRC); pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal; hipotensão. Contraindicado na gravidez.",
    disponivel_no_SUS: true
  },
  {
    nome: "Azilsartana",
    categoria: "Bloqueador do receptor de angiotensina (BRA)",
    mecanismo_de_acao: "Inibe o receptor de angiotensina tipo 1.",
    dose_habitual: "40-80 mg/dia",
    dose_maxima: "80 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com IECA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal. Contraindicado na gravidez.",
    disponivel_no_SUS: false
  },
  {
    nome: "Candesartana",
    categoria: "Bloqueador do receptor de angiotensina (BRA)",
    mecanismo_de_acao: "Inibe o receptor de angiotensina tipo 1.",
    dose_habitual: "8-32 mg/dia",
    dose_maxima: "32 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com IECA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal. Contraindicado na gravidez.",
    disponivel_no_SUS: false
  },
  {
    nome: "Eprosartana",
    categoria: "Bloqueador do receptor de angiotensina (BRA)",
    mecanismo_de_acao: "Inibe o receptor de angiotensina tipo 1.",
    dose_habitual: "600 mg/dia",
    dose_maxima: "600 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com IECA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal. Contraindicado na gravidez.",
    disponivel_no_SUS: false
  },
  {
    nome: "Irbesartana",
    categoria: "Bloqueador do receptor de angiotensina (BRA)",
    mecanismo_de_acao: "Inibe o receptor de angiotensina tipo 1.",
    dose_habitual: "150-300 mg/dia",
    dose_maxima: "300 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com IECA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal. Contraindicado na gravidez.",
    disponivel_no_SUS: false
  },
  {
    nome: "Olmesartana",
    categoria: "Bloqueador do receptor de angiotensina (BRA)",
    mecanismo_de_acao: "Inibe o receptor de angiotensina tipo 1.",
    dose_habitual: "20-40 mg/dia",
    dose_maxima: "40 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com IECA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal. Contraindicado na gravidez.",
    disponivel_no_SUS: false
  },
  {
    nome: "Telmisartana",
    categoria: "Bloqueador do receptor de angiotensina (BRA)",
    mecanismo_de_acao: "Inibe o receptor de angiotensina tipo 1.",
    dose_habitual: "20-80 mg/dia",
    dose_maxima: "80 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com IECA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal. Contraindicado na gravidez.",
    disponivel_no_SUS: false
  },
  {
    nome: "Valsartana",
    categoria: "Bloqueador do receptor de angiotensina (BRA)",
    mecanismo_de_acao: "Inibe o receptor de angiotensina tipo 1.",
    dose_habitual: "80-320 mg/dia",
    dose_maxima: "320 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Não usar em combinação com IECA ou inibidor direto da renina; hipercalemia; pode causar elevação da creatinina sérica em pacientes com DRC ou estenose bilateral da artéria renal. Contraindicado na gravidez.",
    disponivel_no_SUS: false
  },
  {
    nome: "Besilato de anlodipino",
    categoria: "Bloqueador de Canal de Cálcio Diidropiridinas",
    mecanismo_de_acao: "Bloqueia os canais de cálcio do tipo L dependentes de voltagem, impedindo a entrada de cálcio nas células musculares lisas.",
    dose_habitual: "2,5 a 10 mg/dia",
    dose_maxima: "10 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Edema de membros inferiores; pode piorar a proteinúria; pode piorar a obstrução da via de saída do ventrículo esquerdo; rubor; cefaleia; hiperplasia gengival.",
    disponivel_no_SUS: true
  },
  {
    nome: "Nifedipino",
    categoria: "Bloqueador de Canal de Cálcio Diidropiridinas",
    mecanismo_de_acao: "Bloqueia os canais de cálcio do tipo L dependentes de voltagem, impedindo a entrada de cálcio nas células musculares lisas.",
    dose_habitual: "10 a 60 mg/dia",
    dose_maxima: "60 mg/dia",
    frequencia_de_administracao: "1 a 3 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Edema de membros inferiores; pode piorar a proteinúria; pode piorar a obstrução da via de saída do ventrículo esquerdo; rubor; cefaleia; hiperplasia gengival.",
    disponivel_no_SUS: true
  },
  {
    nome: "Isradipina",
    categoria: "Bloqueador de Canal de Cálcio Diidropiridinas",
    mecanismo_de_acao: "Bloqueia os canais de cálcio tipo L voltagem-dependentes, impedindo a entrada de cálcio nas células.",
    dose_habitual: "5-10 mg/dia",
    dose_maxima: "10 mg/dia",
    frequencia_de_administracao: "2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Edema de membros inferiores; pode piorar a proteinúria; pode piorar a obstrução da via de saída do ventrículo esquerdo.",
    disponivel_no_SUS: false
  },
  {
    nome: "Nisoldipina ER",
    categoria: "Bloqueador de Canal de Cálcio Diidropiridinas",
    mecanismo_de_acao: "Bloqueia os canais de cálcio tipo L voltagem-dependentes, impedindo a entrada de cálcio nas células.",
    dose_habitual: "17-34 mg/dia",
    dose_maxima: "34 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Edema de membros inferiores; pode piorar a proteinúria; pode piorar a obstrução da via de saída do ventrículo esquerdo.",
    disponivel_no_SUS: false
  },
  {
    nome: "Diltiazem ER",
    categoria: "Bloqueador de Canal de Cálcio Não-Diidropiridinas",
    mecanismo_de_acao: "Bloqueia os canais de cálcio tipo L voltagem-dependentes no músculo cardíaco, reduzindo a frequência cardíaca.",
    dose_habitual: "120-480 mg/dia",
    dose_maxima: "480 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Taquicardia, obstrução da via de saída do ventrículo esquerdo, função cardíaca hiperdinâmica, profilaxia da enxaqueca. Bloqueio cardíaco se usado em combinação com betabloqueador.",
    disponivel_no_SUS: false
  },
  {
    nome: "Cloridrato de verapamil",
    categoria: "Bloqueador de Canal de Cálcio Não-Diidropiridinas",
    mecanismo_de_acao: "Bloqueia os canais de cálcio do tipo L dependentes de voltagem, impedindo a entrada de cálcio nas células cardíacas e musculares lisas.",
    dose_habitual: "120 a 360 mg/dia",
    dose_maxima: "480 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Constipação; bradicardia; náusea; bloqueio atrioventricular (BAV), especialmente se usado em combinação com betabloqueador.",
    disponivel_no_SUS: true
  },
  {
    nome: "Verapamil SR",
    categoria: "Bloqueador de Canal de Cálcio Não-Diidropiridinas",
    mecanismo_de_acao: "Bloqueia os canais de cálcio tipo L voltagem-dependentes no músculo cardíaco, reduzindo a frequência cardíaca.",
    dose_habitual: "120-480 mg/dia",
    dose_maxima: "480 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Constipação; bloqueio cardíaco se usado em combinação com betabloqueador.",
    disponivel_no_SUS: true
  },
  {
    nome: "Cloridrato de propranolol",
    categoria: "Betabloqueador",
    mecanismo_de_acao: "Bloqueia os receptores beta-adrenérgicos.",
    dose_habitual: "80 a 320 mg/dia",
    dose_maxima: "640 mg/dia",
    frequencia_de_administracao: "2 a 3 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Asma, bradicardia, fadiga, intolerância ao exercício, dificuldade de concentração e memória, piora da depressão.",
    disponivel_no_SUS: true
  },
  {
    nome: "Atenolol",
    categoria: "Betabloqueador",
    mecanismo_de_acao: "Bloqueia os receptores beta-adrenérgicos.",
    dose_habitual: "50 a 100 mg/dia",
    dose_maxima: "100 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Asma, bradicardia, fadiga, intolerância ao exercício, dificuldade de concentração e memória, piora da depressão.",
    disponivel_no_SUS: true
  },
  {
    nome: "Carvedilol",
    categoria: "Betabloqueador",
    mecanismo_de_acao: "Bloqueia os receptores beta e alfa-1 adrenérgicos.",
    dose_habitual: "12,5 a 50 mg/dia",
    dose_maxima: "50 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Asma, bradicardia, fadiga, intolerância ao exercício, dificuldade de concentração e memória, piora da depressão.",
    observacoes: "É considerado anti-hipertensivo de primeira linha em casos de Insuficiência cardíaca de fração de ejeção reduzida e Doença cardíaca isquêmica. Contraindicações absolutas bradicardia grave, bloqueio atrioventricular de segundo ou terceiro grau, bloqueio sinoatrial, síndrome do nódulo sinusal (sem marcapasso), choque cardiogênico, insuficiência cardíaca descompensada, e hipersensibilidade ao fármaco.",
    disponivel_no_SUS: true
  },
  {
    nome: "Succinato de metoprolol",
    categoria: "Betabloqueador",
    mecanismo_de_acao: "Bloqueia os receptores beta-adrenérgicos.",
    dose_habitual: "50 a 200 mg/dia",
    dose_maxima: "200 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Asma, bradicardia, fadiga, intolerância ao exercício, dificuldade de concentração e memória, piora da depressão.",
    observacoes: "É considerado anti-hipertensivo de primeira linha em casos de Insuficiência cardíaca de fração de ejeção reduzida e Doença cardíaca isquêmica. Contraindicações absolutas bradicardia grave, bloqueio atrioventricular de segundo ou terceiro grau, bloqueio sinoatrial, síndrome do nódulo sinusal (sem marcapasso), choque cardiogênico, insuficiência cardíaca descompensada, e hipersensibilidade ao fármaco.",
    disponivel_no_SUS: true
  },
  {
    nome: "Hidroclorotiazida",
    categoria: "Diurético tiazídico",
    mecanismo_de_acao: "Bloqueia a reabsorção de Na/Cl no lado luminal do túbulo contorcido distal.",
    dose_habitual: "25 a 50 mg/dia",
    dose_maxima: "200 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Hiponatremia (mais provável em mulheres idosas); hipocalemia; hipotensão ortostática; hipovolemia; hiperuricemia; hiperglicemia; hipercalcemia; fotossensibilidade; erupção cutânea.",
    disponivel_no_SUS: true
  },
  {
    nome: "Clortalidona",
    categoria: "Diurético tiazídico",
    mecanismo_de_acao: "Bloqueia o canal de sódio-cloreto (NCC) no túbulo contorcido distal.",
    dose_habitual: "12.5-25 mg/dia",
    dose_maxima: "25 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Hiponatremia (principalmente em mulheres idosas), hipocalemia, hipotensão ortostática, hipovolemia, hiperuricemia, gota.",
    disponivel_no_SUS: false
  },
  {
    nome: "Indapamida",
    categoria: "Diurético tiazídico",
    mecanismo_de_acao: "Bloqueia o canal de sódio-cloreto (NCC) no túbulo contorcido distal.",
    dose_habitual: "1.25-2.5 mg/dia",
    dose_maxima: "2.5 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Hiponatremia (principalmente em mulheres idosas), hipocalemia, hipotensão ortostática, hipovolemia.",
    disponivel_no_SUS: false
  },
  {
    nome: "Furosemida",
    categoria: "Diurético de alça",
    mecanismo_de_acao: "Inibe a reabsorção de Na na alça ascendente espessa de Henle.",
    dose_habitual: "20 a 80 mg/dia",
    dose_maxima: "Depende da resposta do paciente",
    frequencia_de_administracao: "1 a 3 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Depleção de volume; hipocalemia; hipomagnesemia; ototoxicidade.",
    disponivel_no_SUS: true
  },
  {
    nome: "Espironolactona",
    categoria: "Diurético Antagonista do receptor mineralocorticoide (ARM)",
    mecanismo_de_acao: "Bloqueia a atividade do receptor de mineralocorticoide.",
    dose_habitual: "25 a 100 mg/dia",
    dose_maxima: "200 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Hipercalemia; ginecomastia; irregularidades menstruais.",
    disponivel_no_SUS: true
  },
  {
    nome: "Eplerenona",
    categoria: "Diurético Antagonista do receptor mineralocorticoide (ARM)",
    mecanismo_de_acao: "Bloqueia a atividade do receptor mineralocorticoide.",
    dose_habitual: "50-100 mg/dia",
    dose_maxima: "100 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Hipercalemia, ginecomastia.",
    disponivel_no_SUS: false
  },
  {
    nome: "Amilorida",
    categoria: "Diurético poupador de potássio",
    mecanismo_de_acao: "Bloqueia os canais de sódio epiteliais no túbulo distal e ducto coletor.",
    dose_habitual: "5-10 mg/dia",
    dose_maxima: "10 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Hipercalemia, especialmente em DRC.",
    disponivel_no_SUS: false
  },
  {
    nome: "Triantereno",
    categoria: "Diurético poupador de potássio",
    mecanismo_de_acao: "Bloqueia os canais de sódio epiteliais no túbulo distal e ducto coletor.",
    dose_habitual: "50-100 mg/dia",
    dose_maxima: "100 mg/dia",
    frequencia_de_administracao: "1 a 2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Hipercalemia, especialmente em DRC.",
    disponivel_no_SUS: false
  },
  {
    nome: "Metildopa",
    categoria: "Agonista alfa-2 central",
    mecanismo_de_acao: "Estimula os receptores alfa-adrenérgicos do SNC.",
    dose_habitual: "500 a 2000 mg/dia",
    dose_maxima: "3 g/dia",
    frequencia_de_administracao: "2 a 3 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Sedação; boca seca; hipotensão ortostática; retenção de líquidos.",
    disponivel_no_SUS: true
  },
  {
    nome: "Clonidina",
    categoria: "Agonista alfa-2 central",
    mecanismo_de_acao: "Estimula os receptores α2-adrenérgicos do SNC.",
    dose_habitual: "0.1-0.8 mg/dia",
    dose_maxima: "0.8 mg/dia",
    frequencia_de_administracao: "2 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Sedação, boca seca, hipotensão ortostática.",
    disponivel_no_SUS: false
  },
  {
    nome: "Guanfacina",
    categoria: "Agonista alfa-2 central",
    mecanismo_de_acao: "Estimula os receptores α2-adrenérgicos do SNC.",
    dose_habitual: "0.5-2 mg/dia",
    dose_maxima: "2 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Sedação, boca seca, hipotensão ortostática. Nota: Disponibilidade no SUS é muito limitada.",
    disponivel_no_SUS: false
  },
  {
    nome: "Mesilato de doxazosina",
    categoria: "Alfabloqueador",
    mecanismo_de_acao: "Bloqueia os receptores alfa-1 adrenérgicos.",
    dose_habitual: "1 a 16 mg/dia",
    dose_maxima: "16 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Hipotensão ortostática (especialmente na primeira dose); tontura; síncope.",
    disponivel_no_SUS: true
  },
  {
    nome: "Terazosina",
    categoria: "Alfabloqueador",
    mecanismo_de_acao: "Bloqueador seletivo do receptor α1-adrenérgico.",
    dose_habitual: "1-16 mg/dia",
    dose_maxima: "16 mg/dia",
    frequencia_de_administracao: "1 vez ao dia",
    precaucoes_e_efeitos_colaterais: "Hipotensão ortostática, tontura.",
    disponivel_no_SUS: false
  },
  {
    nome: "Cloridrato de hidralazina",
    categoria: "Vasodilatador direto",
    mecanismo_de_acao: "Dilata as artérias periféricas.",
    dose_habitual: "50 a 200 mg/dia",
    dose_maxima: "200 mg/dia",
    frequencia_de_administracao: "2 a 3 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Cefaleia; taquicardia; retenção de líquidos; síndrome de lúpus induzida por drogas.",
    disponivel_no_SUS: true
  },
  {
    nome: "Minoxidil",
    categoria: "Vasodilatador direto",
    mecanismo_de_acao: "Abre os canais de potássio sensíveis ao ATP.",
    dose_habitual: "5-100 mg/dia",
    dose_maxima: "100 mg/dia",
    frequencia_de_administracao: "1 a 3 vezes ao dia",
    precaucoes_e_efeitos_colaterais: "Cefaleia; taquicardia; retenção de líquidos; crescimento de pelos.",
    disponivel_no_SUS: false
  }
];

const categorias = [
  "Todas",
  "PRIMEIRA LINHA",
  "SEGUNDA LINHA",
  "Inibidor da enzima conversora de angiotensina (IECA)",
  "Bloqueador do receptor de angiotensina (BRA)",
  "Bloqueador de Canal de Cálcio Diidropiridinas",
  "Bloqueador de Canal de Cálcio Não-Diidropiridinas",
  "Betabloqueador",
  "Diurético tiazídico",
  "Diurético de alça",
  "Diurético poupador de potássio",
  "Diurético Antagonista do receptor mineralocorticoide",
  "Agonista alfa-2 central",
  "Alfabloqueador",
  "Vasodilatador direto"
];

const isPrimeiraLinha = (categoria: string): boolean => {
  return [
    "Inibidor da enzima conversora de angiotensina (IECA)",
    "Bloqueador do receptor de angiotensina (BRA)",
    "Bloqueador de Canal de Cálcio Diidropiridinas",
    "Bloqueador de Canal de Cálcio Não-Diidropiridinas",
    "Diurético tiazídico"
  ].includes(categoria);
};

const isSegundaLinha = (categoria: string): boolean => {
  return [
    "Betabloqueador",
    "Diurético de alça",
    "Diurético poupador de potássio",
    "Diurético Antagonista do receptor mineralocorticoide",
    "Agonista alfa-2 central",
    "Alfabloqueador",
    "Vasodilatador direto"
  ].includes(categoria);
};

export default function HipertensaoArterialScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const filteredMedicamentos = medicamentosData.filter(med => {
    const matchesSearch = med.nome.toLowerCase().includes(searchText.toLowerCase());
    let matchesCategory = false;
    
    if (selectedCategory === 'Todas') {
      matchesCategory = true;
    } else if (selectedCategory === 'PRIMEIRA LINHA') {
      matchesCategory = isPrimeiraLinha(med.categoria);
    } else if (selectedCategory === 'SEGUNDA LINHA') {
      matchesCategory = isSegundaLinha(med.categoria);
    } else {
      matchesCategory = med.categoria === selectedCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  const toggleCardExpansion = (nome: string) => {
    setExpandedCard(expandedCard === nome ? null : nome);
  };

  const getCategoryColor = (categoria: string): string => {
    switch (categoria) {
      case "Inibidor da enzima conversora de angiotensina (IECA)": return "#2563EB";
      case "Bloqueador do receptor de angiotensina (BRA)": return "#DC2626";
      case "Bloqueador de Canal de Cálcio Diidropiridinas": return "#059669";
      case "Bloqueador de Canal de Cálcio Não-Diidropiridinas": return "#16A34A";
      case "Betabloqueador": return "#7C3AED";
      case "Diurético tiazídico": return "#EA580C";
      case "Diurético de alça": return "#0891B2";
      case "Diurético poupador de potássio": return "#0369A1";
      case "Diurético Antagonista do receptor mineralocorticoide": return "#BE123C";
      case "Agonista alfa-2 central": return "#4338CA";
      case "Alfabloqueador": return "#9333EA";
      case "Vasodilatador direto": return "#0D9488";
      default: return "#6B7280";
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Hipertensão arterial" type="clinical" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Card de Introdução */}
          <View style={styles.introCard}>
            <View style={styles.introHeader}>
              <Stethoscope size={24} color="#FF8F00" />
              <Text style={styles.introTitle}>Medicamentos Anti-Hipertensivos</Text>
            </View>
            <Text style={styles.introText}>
              Protocolo com informações sobre os principais medicamentos utilizados no tratamento da hipertensão arterial, incluindo doses, mecanismos de ação e precauções.
            </Text>
          </View>

          {/* Barra de Pesquisa */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar medicamento..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} color="#FF8F00" />
            </TouchableOpacity>
          </View>

          {/* Filtros de Categoria */}
          {showFilters && (
            <View style={styles.filtersContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categorias.map((categoria) => (
                  <TouchableOpacity
                    key={categoria}
                    style={[
                      styles.filterChip,
                      selectedCategory === categoria && styles.filterChipSelected
                    ]}
                    onPress={() => setSelectedCategory(categoria)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedCategory === categoria && styles.filterChipTextSelected
                    ]}>
                    {categoria === "PRIMEIRA LINHA" ? "1ª LINHA" :
                     categoria === "SEGUNDA LINHA" ? "2ª LINHA" :
                     categoria === "Inibidor da enzima conversora de angiotensina (IECA)" ? "IECA" :
                     categoria === "Bloqueador do receptor de angiotensina (BRA)" ? "BRA" :
                     categoria === "Bloqueador de Canal de Cálcio Diidropiridinas" ? "Bloqueador de Canal de Cálcio Diidropiridinas" :
                     categoria === "Bloqueador de Canal de Cálcio Não-Diidropiridinas" ? "Bloqueador de Canal de Cálcio Não-Diidropiridinas" :
                     categoria === "Diurético poupador de potássio" ? "Diurético poupador de potássio" :
                     categoria === "Diurético Antagonista do receptor mineralocorticoide" ? "ARM" :
                     categoria}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Contador de Resultados */}
          <Text style={styles.resultsCounter}>
            {filteredMedicamentos.length} medicamento(s) encontrado(s)
          </Text>

          {/* Lista de Medicamentos */}
          {filteredMedicamentos.map((medicamento, index) => (
            <View key={index} style={styles.medicamentoCard}>
              {/* Header do Card */}
              <TouchableOpacity 
                style={[styles.cardHeader, { backgroundColor: getCategoryColor(medicamento.categoria) }]}
                onPress={() => toggleCardExpansion(medicamento.nome)}
              >
                <View style={styles.cardHeaderContent}>
                  <View style={styles.medicamentoInfo}>
                    <Text style={styles.medicamentoNome}>{medicamento.nome}</Text>
                    <Text style={styles.medicamentoCategoria}>
                      {medicamento.categoria === "Inibidor da enzima conversora de angiotensina (IECA)" ? "IECA" :
                       medicamento.categoria === "Bloqueador do receptor de angiotensina (BRA)" ? "BRA" :
                       medicamento.categoria === "Bloqueador de Canal de Cálcio Diidropiridinas" ? "Bloqueador de Canal de Cálcio Diidropiridinas" :
                       medicamento.categoria === "Bloqueador de Canal de Cálcio Não-Diidropiridinas" ? "Bloqueador de Canal de Cálcio Não-Diidropiridinas" :
                       medicamento.categoria === "Diurético poupador de potássio" ? "Diurético poupador de potássio" :
                       medicamento.categoria === "Diurético Antagonista do receptor mineralocorticoide" ? "ARM" :
                       medicamento.categoria}
                    </Text>
                  </View>
                  <View style={styles.cardHeaderIcons}>
                    {medicamento.disponivel_no_SUS && (
                      <View style={styles.susIndicator}>
                        <Shield size={16} color="white" />
                        <Text style={styles.susText}>SUS</Text>
                      </View>
                    )}
                    {expandedCard === medicamento.nome ? 
                      <ChevronUp size={24} color="white" /> : 
                      <ChevronDown size={24} color="white" />
                    }
                  </View>
                </View>
              </TouchableOpacity>

              {/* Conteúdo Expandido */}
              {expandedCard === medicamento.nome && (
                <View style={styles.cardContent}>
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Mecanismo de Ação:</Text>
                    <Text style={styles.infoText}>{medicamento.mecanismo_de_acao}</Text>
                  </View>

                  <View style={styles.dosageSection}>
                    <View style={styles.dosageRow}>
                      <View style={styles.dosageItem}>
                        <Text style={styles.infoLabel}>Dose Habitual:</Text>
                        <Text style={[styles.infoText, styles.dosageValue]}>{medicamento.dose_habitual}</Text>
                      </View>
                      <View style={styles.dosageItem}>
                        <Text style={styles.infoLabel}>Dose Máxima:</Text>
                        <Text style={[styles.infoText, styles.dosageValue]}>{medicamento.dose_maxima}</Text>
                      </View>
                    </View>
                    <View style={styles.frequencySection}>
                      <Text style={styles.infoLabel}>Frequência:</Text>
                      <Text style={[styles.infoText, styles.frequencyText]}>{medicamento.frequencia_de_administracao}</Text>
                    </View>
                  </View>

                  <View style={styles.precautionsSection}>
                    <Text style={styles.infoLabel}>Precauções e Efeitos Colaterais:</Text>
                    <View style={styles.precautionsBox}>
                      <Info size={16} color="#DC2626" />
                      <Text style={styles.precautionsText}>{medicamento.precaucoes_e_efeitos_colaterais}</Text>
                    </View>
                  </View>

                  {medicamento.observacoes && (
                    <View style={styles.observationsSection}>
                      <Text style={styles.infoLabel}>Observações:</Text>
                      <View style={styles.observationsBox}>
                        <CheckCircle size={16} color="#059669" />
                        <Text style={styles.observationsText}>{medicamento.observacoes}</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}

          {/* Card de Aviso/Disclaimer */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerText}>
              ⚠️ Esta ferramenta oferece orientações baseadas em diretrizes gerais de tratamento da hipertensão arterial. 
              Sempre consulte as diretrizes institucionais e avalie individualmente cada caso clínico.
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
  // Card de introdução
  introCard: {
    backgroundColor: '#FFF3E0',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#FF8F00',
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  introTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: '#FF8F00',
    marginLeft: theme.spacing.sm,
  },
  introText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Busca e filtros
  searchContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
  },
  filterButton: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#FF8F00',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    marginBottom: theme.spacing.lg,
  },
  filterChip: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipSelected: {
    backgroundColor: '#FF8F00',
    borderColor: '#FF8F00',
  },
  filterChipText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.text,
  },
  filterChipTextSelected: {
    color: 'white',
  },
  resultsCounter: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  // Cards de medicamentos
  medicamentoCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicamentoInfo: {
    flex: 1,
  },
  medicamentoNome: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    marginBottom: theme.spacing.xs,
  },
  medicamentoCategoria: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(255,255,255,0.9)',
  },
  cardHeaderIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  susIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
  },
  susText: {
    fontSize: theme.fontSize.xs,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  cardContent: {
    padding: theme.spacing.lg,
  },
  infoSection: {
    marginBottom: theme.spacing.lg,
  },
  infoLabel: {
    fontSize: theme.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: theme.colors.text,
    lineHeight: 20,
  },
  dosageSection: {
    marginBottom: theme.spacing.lg,
  },
  dosageRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  dosageItem: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8F00',
  },
  dosageValue: {
    fontFamily: 'Roboto-Bold',
    color: '#FF8F00',
  },
  frequencySection: {
    backgroundColor: '#F0F4FF',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  frequencyText: {
    fontFamily: 'Roboto-Bold',
    color: '#2563EB',
  },
  precautionsSection: {
    marginBottom: theme.spacing.md,
  },
  precautionsBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F5',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    gap: theme.spacing.sm,
  },
  precautionsText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#DC2626',
    lineHeight: 18,
  },
  observationsSection: {
    marginBottom: theme.spacing.md,
  },
  observationsBox: {
    flexDirection: 'row',
    backgroundColor: '#F0FFF4',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    gap: theme.spacing.sm,
  },
  observationsText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#059669',
    lineHeight: 18,
  },
  // Card de disclaimer
  disclaimerCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: '#FF9800',
    marginTop: theme.spacing.lg,
  },
  disclaimerText: {
    fontSize: theme.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: '#E65100',
    lineHeight: 18,
    textAlign: 'center',
  },
});
