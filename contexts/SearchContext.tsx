import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchItem {
  id: string;
  title: string;
  type: 'emergency' | 'calculator' | 'score' | 'converter';
  route: string;
}

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: SearchItem[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const searchItems: SearchItem[] = [
  // Protocolos de Emergência
  { id: 'rcp', title: 'RCP', type: 'emergency', route: '/emergencia/rcp' },
  { id: 'iot', title: 'IOT', type: 'emergency', route: '/emergencia/iot' },
  { id: 'drogas-vasoativas', title: 'Drogas Vasoativas', type: 'emergency', route: '/emergencia/drogas-vasoativas' },
  { id: 'dhel', title: 'Distúrbios Hidroeletrolíticos', type: 'emergency', route: '/emergencia/dhel' },
  { id: 'cardioversao', title: 'Cardioversão', type: 'emergency', route: '/emergencia/cardioversion' },
  { id: 'taquiarritmias', title: 'Taquiarritmias', type: 'emergency', route: '/emergencia/taquiarritmias' },
  
  // Protocolos Clínicos
  { id: 'medicamentos-enterais', title: 'Medicamentos Enterais', type: 'emergency', route: '/protocolo-clinico/medicamentos-enterais' },
  { id: 'fibrilacao-atrial', title: 'Fibrilação Atrial', type: 'emergency', route: '/protocolo-clinico/fibrilacaoatrial' },
  { id: 'controle-glicemico', title: 'Controle Glicêmico', type: 'emergency', route: '/protocolo-clinico/controle-glicemico' },
  
  // Calculadoras
  { id: 'taxa-filtracao-renal', title: 'Taxa de Filtração Renal', type: 'calculator', route: '/calculadoras/taxa-filtracao-renal' },
  { id: 'ajuste-dose-antibiotico', title: 'Ajuste de Dose de Antibiótico', type: 'calculator', route: '/calculadoras/ajuste-dose-antibiotico' },
  { id: 'nihss', title: 'NIHSS', type: 'calculator', route: '/calculadoras/nihss' },
  { id: 'kdigo-aki', title: 'Injúria Renal Aguda (KDIGO)', type: 'calculator', route: '/calculadoras/kdigo-aki' },
  { id: 'gasometria-arterial', title: 'Gasometria Arterial', type: 'calculator', route: '/calculadoras/gasometria-arterial' },
  { id: 'cirrose-hepatica', title: 'Cirrose Hepática', type: 'calculator', route: '/calculadoras/cirrose-hepatica' },
  { id: 'taxa-infusao', title: 'Taxa de Infusão', type: 'calculator', route: '/calculadoras/taxa-infusao' },
  { id: 'tep', title: 'TEP - Tromboembolismo Pulmonar', type: 'calculator', route: '/calculadoras/tep' },
  { id: 'hipoglicemia', title: 'Correção de Hipoglicemia', type: 'calculator', route: '/calculadoras/hipoglicemia' },
  
  // Escores
  { id: 'escores-paliativos', title: 'Escores Paliativos', type: 'score', route: '/escores/paliativos' },
  { id: 'pps', title: 'Palliative Performance Scale - PPS', type: 'score', route: '/escores/paliativos/pps' },
     { id: 'cha2ds2-vasc', title: 'CHA2DS2-VASc', type: 'score', route: '/escores/cha2ds2-vasc' },
     { id: 'padua-risk', title: 'Pádua - Risco de TEV', type: 'score', route: '/escores/padua-risk' },
  { id: 'fast', title: 'FAST - Functional Assessment Staging', type: 'score', route: '/escores/paliativos/fast' },
  { id: 'rankin', title: 'Escala de Rankin', type: 'score', route: '/escores/paliativos/rankin' },
  { id: 'paliar-score', title: 'PALIAR Score', type: 'score', route: '/escores/paliativos/paliar-score' },
  { id: 'ppi', title: 'PPI - Palliative Prognostic Index', type: 'score', route: '/escores/paliativos/ppi' },
  
  // Conversores
  { id: 'corticoides', title: 'Conversor de Corticoides', type: 'converter', route: '/conversores/corticoides' },
  { id: 'opioides', title: 'Conversor de Opióides', type: 'converter', route: '/conversores/opioides' },
  { id: 'concentracoes', title: 'Conversor de Concentrações', type: 'converter', route: '/conversores/concentracoes' },
  
  // Medicamentos
  { id: 'anti-emeticos', title: 'Anti-eméticos', type: 'emergency', route: '/medicamentos/anti-emeticos' }
];

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = searchTerm
    ? searchItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, searchResults }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}