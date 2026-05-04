export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
  setorId?: string; // ID do setor ao qual o usuário pertence (apenas para users)
}

// Indicadores Coletivos (Transversais - todos os setores)
export interface IndicadoresColetivos {
  preenchimentoProntuario: number; // %
  satisfacaoUsuarios: number; // %
  densidadeQuedas: number; // por 1000 pacientes-dia
  densidadeLesaoPressao: number; // por 1000 pacientes-dia
  naoConformidadeMedicamentos: number; // número
  acoesSegurancaPaciente: number; // número
  educacaoPermanente: number; // horas ou número de treinamentos
}

// Internação (Pediatria, Clínica Ortopédica, Clínica de Internação)
export interface IndicadoresInternacao extends IndicadoresColetivos {
  saidas: number;
  mediaPermanencia: number; // dias
  taxaOcupacao: number; // %
  taxaReadmissao29dias: number; // %
  taxaRetornoNaoProgramado15dias: number; // %
  losComExames: number; // dias
  losSemExames: number; // dias
  intervaloSubstituicao: number; // dias (giro de leito)
  utilizacaoProtocolos: number; // %
}

// Pronto Atendimento
export interface IndicadoresProntoAtendimento extends IndicadoresColetivos {
  tempoEsperaVermelho: number; // minutos
  tempoEsperaAmarelo: number; // minutos
  tempoEsperaVerde: number; // minutos
  tempoEsperaAzul: number; // minutos
  tempoPortaMedico: number; // minutos (Door-to-Doctor)
  tempoDecisaoMedica: number; // minutos
  tempoBoarding: number; // minutos (aguardando leito)
  atendimentosClassificacao: number;
  taxaEvasao: number; // %
  observacaoAte24h: number; // número de casos
}

// UTI (UTI I, UTI II, UCINCO)
export interface IndicadoresUTI extends IndicadoresColetivos {
  saidasAdulto?: number;
  saidasNeonatal?: number;
  taxaReadmissao48h: number; // %
  taxaMortalidade24h: number; // %
  densidadeITU: number; // por 1000 sonda-dia
  densidadePneumonia: number; // por 1000 VM-dia
  tempoPortaECG: number; // minutos (Protocolo Dor Torácica)
}

// Maternidade
export interface IndicadoresMaternidade extends IndicadoresColetivos {
  saidasMaternidade: number;
  atendimentosUrgenciaObstetrico: number;
  taxaPartosNormal: number; // %
  taxaPartosCesarea: number; // %
}

// Centro Cirúrgico
export interface IndicadoresCentroCirurgico extends IndicadoresColetivos {
  cirurgiasEletivas: number;
  cirurgiasUrgenciaEmergencia: number;
  taxaSuspensaoOperacional: number; // %
}

// Ambulatório
export interface IndicadoresAmbulatorio extends IndicadoresColetivos {
  razaoConsultasOfertadas: number; // %
  absenteismo: number; // %
}

// Setores de Apoio
export interface IndicadoresApoio {
  // NIR
  indiceSustentabilidadeFinanceira?: number;
  custoVsOrcamento?: number; // %
  // Farmácia/Almoxarifado
  indiceAcuraciaEstoque?: number; // %
  investigacaoReacoesAdversas?: number;
  // CCIH/Epidemiologia
  taxaGlosasSIH?: number; // %
  atualizacaoCNES?: string; // data
  monitoramentoDensidades?: number;
}

export interface Setor {
  id: string;
  nome: string;
  tipo: 'internacao' | 'pronto-atendimento' | 'uti' | 'maternidade' | 'centro-cirurgico' | 'ambulatorio' | 'apoio';
  indicadores: IndicadoresInternacao | IndicadoresProntoAtendimento | IndicadoresUTI | IndicadoresMaternidade | IndicadoresCentroCirurgico | IndicadoresAmbulatorio | IndicadoresApoio;
  mesReferencia: string;
}

export interface Incidente {
  id: string;
  setorId: string;
  data: string;
  tipo: string;
  descricao: string;
  quantidade: number;
  atendimentos: number;
  gravidade: 'near-miss' | 'leve' | 'moderado' | 'grave';
  status: 'aberto' | 'em-analise' | 'resolvido';
}

export interface AnaliseIshikawa {
  id: string;
  incidenteId: string;
  setorId: string;
  data: string;
  fatores: {
    paciente: string[];
    tarefa: string[];
    individuo: string[];
    equipe: string[];
    ambiente: string[];
    organizacao: string[];
  };
}

export interface PlanoAcao {
  id: string;
  setorId: string;
  incidenteId?: string;
  data: string;
  problema: string;
  analiseCritica: string;
  acaoImediata: string;
  acaoSistemica: string;
  responsavel: string;
  prazo: string;
  status: 'pendente' | 'em-andamento' | 'concluido';
  verificacaoEficacia?: string;
  dataVerificacao?: string;
}

export interface AppData {
  users: User[];
  setores: Setor[];
  incidentes: Incidente[];
  analises: AnaliseIshikawa[];
  planosAcao: PlanoAcao[];
  historicoMensal: {
    mes: string;
    incidentes: number;
    taxa: number;
  }[];
  dataLiberada: boolean;
  // Centro Cirúrgico
  patients: Patient[];
  surgeries: Surgery[];
  operatingRooms: OperatingRoom[];
  medicalStaff: MedicalStaff[];
  equipment: Equipment[];
  shiftSchedule: ShiftSchedule[];
  lgpdConsents: LGPDConsent[];
}

// ============== ENTIDADES DO CENTRO CIRÚRGICO ==============

export interface Patient {
  id: string;
  record_number: string; // Prontuário (identificador público)
  full_name: string; // sensível
  cpf: string; // sensível
  date_of_birth: string;
  gender: 'masculino' | 'feminino' | 'outro';
  phone: string; // sensível
  blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string;
  medical_history: string;
  health_insurance: string;
  emergency_contact: string; // sensível
  status: 'ativo' | 'internado' | 'alta' | 'inativo';
}

export interface Surgery {
  id: string;
  ordem: number;
  data: string;
  sala_operatoria: string;
  especialidade: string;
  prontuario: string;
  iniciais_paciente: string;
  data_nascimento: string;
  procedimento: string;
  tipo_cirurgia: 'eletiva' | 'urgencia' | 'emergencia';
  nivel_contaminacao: 'limpa' | 'potencialmente_contaminada' | 'contaminada' | 'infectada';
  cirurgiao: string;
  auxiliar: string;
  anestesista: string;
  tipo_anestesia: 'geral' | 'local' | 'raquidiana' | 'peridural' | 'sedacao';
  enfermeira: string;
  instrumentadora: string;
  circulante: string;
  status: 'agendada' | 'em_preparacao' | 'em_andamento' | 'concluida' | 'cancelada';
  hora_inicio: string;
  hora_fim: string;
  duracao_estimada_min: number;
  observacoes: string;
}

export interface OperatingRoom {
  id: string;
  name: string;
  tipo: 'pre_operatorio' | 'transoperatorio' | 'rpa' | 'pos_operatorio';
  status: 'disponivel' | 'em_uso' | 'limpeza' | 'manutencao' | 'reservada';
  capacity: number;
  equipment_list: string[];
  current_surgery_id?: string;
  notes: string;
}

export interface MedicalStaff {
  id: string;
  full_name: string;
  role: 'cirurgiao' | 'anestesista' | 'enfermeiro' | 'tecnico_enfermagem' | 'instrumentador' | 'bucomaxilo' | 'ortopedista' | 'obstetra' | 'pediatra' | 'maqueiro' | 'academico';
  crm_coren: string;
  specialty: string;
  phone: string;
  email: string;
  availability_status: 'disponivel' | 'em_cirurgia' | 'indisponivel' | 'ferias' | 'plantao';
  shift: 'SD' | 'SN' | '12h' | '24h' | 'MT' | 'integral';
}

export interface Equipment {
  id: string;
  name: string;
  category: 'equipamento_fixo' | 'equipamento_movel' | 'material_descartavel' | 'instrumental' | 'medicamento' | 'implante';
  code: string;
  location: string;
  status: 'disponivel' | 'em_uso' | 'manutencao' | 'esterilizacao' | 'baixa';
  quantity: number;
  min_quantity: number;
  expiration_date: string;
  last_maintenance: string;
  notes: string;
}

export interface ShiftSchedule {
  id: string;
  staff_name: string;
  staff_id: string;
  role: 'cirurgiao' | 'anestesista' | 'enfermeiro' | 'instrumentador' | 'auxiliar';
  date: string;
  shift: 'manha' | 'tarde' | 'noite';
  status: 'escalado' | 'confirmado' | 'ausente' | 'substituido';
  notes: string;
}

export interface LGPDConsent {
  id: string;
  record_number: string;
  patient_id: string;
  consent_date: string;
  consent_type: 'tratamento_dados' | 'compartilhamento' | 'pesquisa' | 'marketing';
  accepted: boolean;
  collected_by: string;
  notes: string;
}