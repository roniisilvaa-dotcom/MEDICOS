import { AppData } from '../types';

const STORAGE_KEY = 'isac_hospital_data';

const initialData: AppData = {
  users: [
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Administrador'
    },
    {
      id: '2',
      username: 'ucinco',
      password: 'ucinco123',
      role: 'user',
      name: 'Usuário UCINCO',
      setorId: 'ucinco'
    },
    {
      id: '3',
      username: 'pa',
      password: 'pa123',
      role: 'user',
      name: 'Usuário Pronto Atendimento',
      setorId: 'pronto-socorro'
    },
    {
      id: '4',
      username: 'uti1',
      password: 'uti123',
      role: 'user',
      name: 'Usuário UTI I',
      setorId: 'uti-i'
    },
    {
      id: '5',
      username: 'pediatria',
      password: 'ped123',
      role: 'user',
      name: 'Usuário Pediatria',
      setorId: 'pediatria'
    }
  ],
  incidentes: [
    {
      id: '1',
      setorId: 'ucinco',
      data: '2026-03-15',
      tipo: 'Queda de Paciente',
      descricao: 'Paciente idoso sofreu queda ao tentar se levantar sozinho durante o período noturno. Sem fraturas identificadas.',
      quantidade: 1,
      atendimentos: 850,
      gravidade: 'moderado',
      status: 'em-analise'
    },
    {
      id: '2',
      setorId: 'pronto-socorro',
      data: '2026-03-18',
      tipo: 'Atraso no Atendimento',
      descricao: 'Paciente classificado como amarelo aguardou 120 minutos para atendimento devido sobrecarga da equipe.',
      quantidade: 1,
      atendimentos: 2450,
      gravidade: 'leve',
      status: 'resolvido'
    },
    {
      id: '3',
      setorId: 'centro-cirurgico',
      data: '2026-03-10',
      tipo: 'Identificação Incorreta',
      descricao: 'Near miss - identificação de paciente quase trocada antes de procedimento. Interceptado pela equipe de enfermagem.',
      quantidade: 1,
      atendimentos: 156,
      gravidade: 'near-miss',
      status: 'em-analise'
    },
    {
      id: '4',
      setorId: 'pediatria',
      data: '2026-03-22',
      tipo: 'Erro de Medicação',
      descricao: 'Dosagem incorreta de antibiótico administrada. Corrigida imediatamente sem danos ao paciente.',
      quantidade: 1,
      atendimentos: 145,
      gravidade: 'leve',
      status: 'resolvido'
    }
  ],
  analises: [
    {
      id: '1',
      incidenteId: '1',
      setorId: 'ucinco',
      data: '2026-03-16',
      fatores: {
        paciente: ['Paciente idoso com mobilidade reduzida', 'Histórico de desorientação noturna'],
        tarefa: ['Tentativa de ir ao banheiro sem auxílio'],
        individuo: ['Equipe noturna com déficit de profissionais'],
        equipe: ['Falta de comunicação sobre risco de queda'],
        ambiente: ['Iluminação insuficiente no quarto', 'Campainha fora do alcance'],
        organizacao: ['Protocolo de risco de queda não revisado há 2 anos']
      }
    },
    {
      id: '2',
      incidenteId: '3',
      setorId: 'centro-cirurgico',
      data: '2026-03-11',
      fatores: {
        paciente: ['Dois pacientes com nomes semelhantes no mesmo dia'],
        tarefa: ['Checagem de identificação não seguiu protocolo completo'],
        individuo: ['Profissional em primeiro dia após férias'],
        equipe: ['Passagem de plantão incompleta'],
        ambiente: ['Ruído excessivo no ambiente'],
        organizacao: ['Sistema de identificação por pulseira sem código de barras']
      }
    }
  ],
  planosAcao: [
    {
      id: '1',
      setorId: 'ucinco',
      incidenteId: '1',
      data: '2026-03-17',
      problema: 'Taxa de quedas na UCINCO subiu 15% em relação ao mês anterior, com 3 quedas registradas',
      analiseCritica: 'Reunião com equipe identificou déficit de profissionais no turno noturno e falta de treinamento sobre protocolo de prevenção de quedas para novos funcionários',
      acaoImediata: 'Treinamento de beira de leito para toda equipe noturna sobre protocolo de prevenção de quedas e uso de campainha',
      acaoSistemica: 'Revisão completa do protocolo de classificação de risco de queda na admissão e implementação de rounds noturnos a cada 2 horas',
      responsavel: 'Dra. Maria Silva - Coordenadora UCINCO',
      prazo: '2026-04-15',
      status: 'em-andamento'
    },
    {
      id: '2',
      setorId: 'pronto-socorro',
      incidenteId: '2',
      data: '2026-03-19',
      problema: 'Tempo de espera para classificação amarela ultrapassou meta de 60 minutos em 40% dos casos',
      analiseCritica: 'Análise mostrou sobrecarga da equipe médica nas sextas-feiras à noite e sistema de triagem com gargalo no registro',
      acaoImediata: 'Reforço de 2 médicos nas sextas-feiras das 18h às 23h',
      acaoSistemica: 'Implementação de sistema digital de triagem e aumento permanente do quadro de enfermeiros classificadores',
      responsavel: 'Dr. João Santos - Coordenador PS',
      prazo: '2026-04-30',
      status: 'concluido',
      verificacaoEficacia: 'Gráfico de Evolução Mensal mostra redução de 35% no tempo médio de espera. Meta de 60min atingida em 92% dos casos.',
      dataVerificacao: '2026-03-28'
    },
    {
      id: '3',
      setorId: 'centro-cirurgico',
      incidenteId: '3',
      data: '2026-03-12',
      problema: 'Near miss de identificação incorreta de paciente antes de procedimento cirúrgico',
      analiseCritica: 'Checklist de segurança não foi completamente seguido. Sistema de identificação atual permite erros humanos.',
      acaoImediata: 'Reforço imediato do protocolo de dupla checagem de identificação com toda equipe cirúrgica',
      acaoSistemica: 'Implementação de sistema de código de barras em pulseiras de identificação e integração com prontuário eletrônico',
      responsavel: 'Dr. Carlos Mendes - Diretor Técnico CC',
      prazo: '2026-05-30',
      status: 'pendente'
    }
  ],
  setores: [
    // INTERNAÇÕES
    {
      id: 'pediatria',
      nome: 'Pediatria',
      tipo: 'internacao',
      mesReferencia: 'Março/2026',
      indicadores: {
        // Coletivos
        preenchimentoProntuario: 92,
        satisfacaoUsuarios: 88,
        densidadeQuedas: 1.2,
        densidadeLesaoPressao: 0.8,
        naoConformidadeMedicamentos: 3,
        acoesSegurancaPaciente: 12,
        educacaoPermanente: 24,
        // Individuais
        saidas: 145,
        mediaPermanencia: 4.2,
        taxaOcupacao: 78,
        taxaReadmissao29dias: 5.8,
        taxaRetornoNaoProgramado15dias: 3.2,
        losComExames: 5.1,
        losSemExames: 3.8,
        intervaloSubstituicao: 0.8,
        utilizacaoProtocolos: 94
      }
    },
    {
      id: 'clinica-ortopedica',
      nome: 'Clínica Ortopédica',
      tipo: 'internacao',
      mesReferencia: 'Março/2026',
      indicadores: {
        preenchimentoProntuario: 95,
        satisfacaoUsuarios: 91,
        densidadeQuedas: 2.1,
        densidadeLesaoPressao: 1.5,
        naoConformidadeMedicamentos: 2,
        acoesSegurancaPaciente: 15,
        educacaoPermanente: 18,
        saidas: 198,
        mediaPermanencia: 6.8,
        taxaOcupacao: 85,
        taxaReadmissao29dias: 4.2,
        taxaRetornoNaoProgramado15dias: 2.8,
        losComExames: 7.5,
        losSemExames: 5.9,
        intervaloSubstituicao: 1.2,
        utilizacaoProtocolos: 96
      }
    },
    {
      id: 'clinica-internacao',
      nome: 'Clínica de Internação',
      tipo: 'internacao',
      mesReferencia: 'Março/2026',
      indicadores: {
        preenchimentoProntuario: 89,
        satisfacaoUsuarios: 85,
        densidadeQuedas: 1.8,
        densidadeLesaoPressao: 1.2,
        naoConformidadeMedicamentos: 4,
        acoesSegurancaPaciente: 10,
        educacaoPermanente: 20,
        saidas: 312,
        mediaPermanencia: 5.5,
        taxaOcupacao: 82,
        taxaReadmissao29dias: 6.5,
        taxaRetornoNaoProgramado15dias: 4.1,
        losComExames: 6.2,
        losSemExames: 4.8,
        intervaloSubstituicao: 1.0,
        utilizacaoProtocolos: 91
      }
    },
    // PRONTO ATENDIMENTO
    {
      id: 'pronto-socorro',
      nome: 'Pronto Socorro',
      tipo: 'pronto-atendimento',
      mesReferencia: 'Março/2026',
      indicadores: {
        preenchimentoProntuario: 87,
        satisfacaoUsuarios: 79,
        densidadeQuedas: 0.5,
        densidadeLesaoPressao: 0.3,
        naoConformidadeMedicamentos: 8,
        acoesSegurancaPaciente: 18,
        educacaoPermanente: 28,
        tempoEsperaVermelho: 8,
        tempoEsperaAmarelo: 35,
        tempoEsperaVerde: 78,
        tempoEsperaAzul: 120,
        tempoPortaMedico: 22,
        tempoDecisaoMedica: 45,
        tempoBoarding: 180,
        atendimentosClassificacao: 4250,
        taxaEvasao: 6.8,
        observacaoAte24h: 285
      }
    },
    // UTIs
    {
      id: 'uti-i',
      nome: 'UTI I Adulto',
      tipo: 'uti',
      mesReferencia: 'Março/2026',
      indicadores: {
        preenchimentoProntuario: 96,
        satisfacaoUsuarios: 90,
        densidadeQuedas: 0.4,
        densidadeLesaoPressao: 3.2,
        naoConformidadeMedicamentos: 2,
        acoesSegurancaPaciente: 22,
        educacaoPermanente: 32,
        saidasAdulto: 68,
        taxaReadmissao48h: 8.2,
        taxaMortalidade24h: 12.5,
        densidadeITU: 4.8,
        densidadePneumonia: 6.2,
        tempoPortaECG: 6
      }
    },
    {
      id: 'uti-ii',
      nome: 'UTI II Adulto',
      tipo: 'uti',
      mesReferencia: 'Março/2026',
      indicadores: {
        preenchimentoProntuario: 94,
        satisfacaoUsuarios: 88,
        densidadeQuedas: 0.3,
        densidadeLesaoPressao: 2.8,
        naoConformidadeMedicamentos: 1,
        acoesSegurancaPaciente: 20,
        educacaoPermanente: 30,
        saidasAdulto: 54,
        taxaReadmissao48h: 7.5,
        taxaMortalidade24h: 10.8,
        densidadeITU: 4.2,
        densidadePneumonia: 5.5,
        tempoPortaECG: 7
      }
    },
    {
      id: 'ucinco',
      nome: 'UCINCO',
      tipo: 'uti',
      mesReferencia: 'Março/2026',
      indicadores: {
        preenchimentoProntuario: 98,
        satisfacaoUsuarios: 92,
        densidadeQuedas: 0.2,
        densidadeLesaoPressao: 1.8,
        naoConformidadeMedicamentos: 1,
        acoesSegurancaPaciente: 25,
        educacaoPermanente: 35,
        saidasNeonatal: 42,
        taxaReadmissao48h: 5.2,
        taxaMortalidade24h: 8.5,
        densidadeITU: 2.8,
        densidadePneumonia: 3.2,
        tempoPortaECG: 5
      }
    },
    // MATERNIDADE
    {
      id: 'maternidade',
      nome: 'Maternidade',
      tipo: 'maternidade',
      mesReferencia: 'Março/2026',
      indicadores: {
        preenchimentoProntuario: 93,
        satisfacaoUsuarios: 95,
        densidadeQuedas: 0.3,
        densidadeLesaoPressao: 0.5,
        naoConformidadeMedicamentos: 2,
        acoesSegurancaPaciente: 16,
        educacaoPermanente: 26,
        saidasMaternidade: 186,
        atendimentosUrgenciaObstetrico: 245,
        taxaPartosNormal: 62,
        taxaPartosCesarea: 38
      }
    },
    // CENTRO CIRÚRGICO
    {
      id: 'centro-cirurgico',
      nome: 'Centro Cirúrgico',
      tipo: 'centro-cirurgico',
      mesReferencia: 'Março/2026',
      indicadores: {
        preenchimentoProntuario: 97,
        satisfacaoUsuarios: 89,
        densidadeQuedas: 0.1,
        densidadeLesaoPressao: 0.4,
        naoConformidadeMedicamentos: 1,
        acoesSegurancaPaciente: 28,
        educacaoPermanente: 22,
        cirurgiasEletivas: 342,
        cirurgiasUrgenciaEmergencia: 128,
        taxaSuspensaoOperacional: 3.2
      }
    },
    // AMBULATÓRIO
    {
      id: 'ambulatorio',
      nome: 'Ambulatório',
      tipo: 'ambulatorio',
      mesReferencia: 'Março/2026',
      indicadores: {
        preenchimentoProntuario: 91,
        satisfacaoUsuarios: 86,
        densidadeQuedas: 0.1,
        densidadeLesaoPressao: 0.1,
        naoConformidadeMedicamentos: 3,
        acoesSegurancaPaciente: 8,
        educacaoPermanente: 15,
        razaoConsultasOfertadas: 94,
        absenteismo: 12.5
      }
    },
    // SETORES DE APOIO
    {
      id: 'nir',
      nome: 'NIR - Núcleo Interno de Regulação',
      tipo: 'apoio',
      mesReferencia: 'Março/2026',
      indicadores: {
        indiceSustentabilidadeFinanceira: 1.15,
        custoVsOrcamento: 97.8
      }
    },
    {
      id: 'farmacia',
      nome: 'Farmácia',
      tipo: 'apoio',
      mesReferencia: 'Março/2026',
      indicadores: {
        indiceAcuraciaEstoque: 96.5,
        investigacaoReacoesAdversas: 8
      }
    },
    {
      id: 'ccih',
      nome: 'CCIH - Comissão de Controle de Infecção',
      tipo: 'apoio',
      mesReferencia: 'Março/2026',
      indicadores: {
        taxaGlosasSIH: 2.3,
        atualizacaoCNES: '2026-03-15',
        monitoramentoDensidades: 45
      }
    }
  ],
  historicoMensal: [
    { mes: 'Set/25', incidentes: 145, taxa: 14.2 },
    { mes: 'Out/25', incidentes: 168, taxa: 15.8 },
    { mes: 'Nov/25', incidentes: 152, taxa: 14.5 },
    { mes: 'Dez/25', incidentes: 189, taxa: 17.2 },
    { mes: 'Jan/26', incidentes: 175, taxa: 16.1 },
    { mes: 'Fev/26', incidentes: 198, taxa: 18.3 },
    { mes: 'Mar/26', incidentes: 283, taxa: 19.8 }
  ],
  dataLiberada: false,
  // ============ DADOS DO CENTRO CIRÚRGICO ============
  patients: [
    {
      id: 'p1',
      record_number: '2024-001234',
      full_name: 'Maria da Silva Santos',
      cpf: '123.456.789-00',
      date_of_birth: '1958-05-15',
      gender: 'feminino',
      phone: '(11) 98765-4321',
      blood_type: 'O+',
      allergies: 'Penicilina, Dipirona',
      medical_history: 'Hipertensão arterial, Diabetes tipo 2',
      health_insurance: 'Unimed',
      emergency_contact: 'João Santos - (11) 98765-1234',
      status: 'internado'
    },
    {
      id: 'p2',
      record_number: '2024-001235',
      full_name: 'José Carlos Oliveira',
      cpf: '987.654.321-00',
      date_of_birth: '1972-08-22',
      gender: 'masculino',
      phone: '(11) 97654-3210',
      blood_type: 'A+',
      allergies: 'Nenhuma alergia conhecida',
      medical_history: 'Cirurgia prévia de apendicite (2015)',
      health_insurance: 'Bradesco Saúde',
      emergency_contact: 'Ana Oliveira - (11) 97654-9999',
      status: 'ativo'
    },
    {
      id: 'p3',
      record_number: '2024-001236',
      full_name: 'Ana Paula Ferreira',
      cpf: '456.789.123-00',
      date_of_birth: '1985-11-30',
      gender: 'feminino',
      phone: '(11) 96543-2109',
      blood_type: 'B+',
      allergies: 'Látex',
      medical_history: 'Histórico familiar de cardiopatia',
      health_insurance: 'SulAmérica',
      emergency_contact: 'Paulo Ferreira - (11) 96543-8888',
      status: 'ativo'
    },
    {
      id: 'p4',
      record_number: '2024-001237',
      full_name: 'Roberto Alves Lima',
      cpf: '789.123.456-00',
      date_of_birth: '1965-03-10',
      gender: 'masculino',
      phone: '(11) 95432-1098',
      blood_type: 'AB+',
      allergies: 'Contraste iodado',
      medical_history: 'DPOC, Ex-tabagista (parou há 5 anos)',
      health_insurance: 'Amil',
      emergency_contact: 'Mariana Lima - (11) 95432-7777',
      status: 'alta'
    }
  ],
  operatingRooms: [
    {
      id: 'sala1',
      name: 'Pré-Operatório',
      tipo: 'pre_operatorio',
      status: 'disponivel',
      capacity: 10,
      equipment_list: ['Monitor multiparamétrico', 'Bomba de infusão', 'Carro de emergência'],
      notes: 'Sala de preparação pré-cirúrgica'
    },
    {
      id: 'sala2',
      name: 'Sala Transoperatório 1',
      tipo: 'transoperatorio',
      status: 'em_uso',
      capacity: 1,
      equipment_list: ['Mesa cirúrgica', 'Foco cirúrgico', 'Monitor multiparamétrico', 'Eletrocautério', 'Arco cirúrgico'],
      current_surgery_id: 'surg1',
      notes: 'Sala cirúrgica principal'
    },
    {
      id: 'sala3',
      name: 'Sala Transoperatório 2',
      tipo: 'transoperatorio',
      status: 'disponivel',
      capacity: 1,
      equipment_list: ['Mesa cirúrgica', 'Foco cirúrgico', 'Monitor multiparamétrico', 'Eletrocautério'],
      notes: 'Sala cirúrgica secundária'
    },
    {
      id: 'sala4',
      name: 'RPA - Recuperação Pós-Anestésica',
      tipo: 'rpa',
      status: 'em_uso',
      capacity: 5,
      equipment_list: ['Monitores cardíacos', 'Oxímetros', 'Ventiladores', 'Bombas de infusão'],
      notes: 'Recuperação imediata pós-cirúrgica'
    },
    {
      id: 'sala5',
      name: 'Pós-Operatório',
      tipo: 'pos_operatorio',
      status: 'disponivel',
      capacity: 8,
      equipment_list: ['Monitores', 'Oxigênio', 'Aspiradores'],
      notes: 'Recuperação intermediária'
    }
  ],
  medicalStaff: [
    // Enfermeiros
    { id: 'enf1', full_name: 'Isabela', role: 'enfermeiro', crm_coren: 'COREN 12345', specialty: 'Centro Cirúrgico', phone: '(85) 99999-0001', email: 'isabela@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    { id: 'enf2', full_name: 'Nelyvania', role: 'enfermeiro', crm_coren: 'COREN 12346', specialty: 'Centro Cirúrgico', phone: '(85) 99999-0002', email: 'nelyvania@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    { id: 'enf3', full_name: 'Hersilane', role: 'enfermeiro', crm_coren: 'COREN 12347', specialty: 'Centro Cirúrgico', phone: '(85) 99999-0003', email: 'hersilane@hospital.com', availability_status: 'disponivel', shift: 'MT' },
    { id: 'enf4', full_name: 'Iraneide', role: 'enfermeiro', crm_coren: 'COREN 12348', specialty: 'Centro Cirúrgico', phone: '(85) 99999-0004', email: 'iraneide@hospital.com', availability_status: 'disponivel', shift: 'SN' },
    
    // Cirurgiões
    { id: 'cir1', full_name: 'Dr. Fernando', role: 'cirurgiao', crm_coren: 'CRM 54321', specialty: 'Cirurgia Geral', phone: '(85) 99999-1001', email: 'fernando@hospital.com', availability_status: 'disponivel', shift: '24h' },
    { id: 'cir2', full_name: 'Dra. Simone', role: 'cirurgiao', crm_coren: 'CRM 54322', specialty: 'Cirurgia Geral', phone: '(85) 99999-1002', email: 'simone@hospital.com', availability_status: 'disponivel', shift: '12h' },
    
    // Bucomaxilo
    { id: 'buco1', full_name: 'Dr. Matheus', role: 'bucomaxilo', crm_coren: 'CRM 54323', specialty: 'Cirurgia Bucomaxilofacial', phone: '(85) 99999-2001', email: 'matheus@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    
    // Anestesistas
    { id: 'anest1', full_name: 'Dra. Camila', role: 'anestesista', crm_coren: 'CRM 54324', specialty: 'Anestesiologia', phone: '(85) 99999-3001', email: 'camila@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    { id: 'anest2', full_name: 'Dr. Erick', role: 'anestesista', crm_coren: 'CRM 54325', specialty: 'Anestesiologia', phone: '(85) 99999-3002', email: 'erick@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    
    // Ortopedista
    { id: 'orto1', full_name: 'Dr. Marcus', role: 'ortopedista', crm_coren: 'CRM 54326', specialty: 'Ortopedia', phone: '(85) 99999-4001', email: 'marcus@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    
    // Obstetras
    { id: 'obst1', full_name: 'Dra. Gisele', role: 'obstetra', crm_coren: 'CRM 54327', specialty: 'Obstetrícia', phone: '(85) 99999-5001', email: 'gisele@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    { id: 'obst2', full_name: 'Dra. Luciana', role: 'obstetra', crm_coren: 'CRM 54328', specialty: 'Obstetrícia', phone: '(85) 99999-5002', email: 'luciana@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    
    // Pediatra
    { id: 'ped1', full_name: 'Dra. Juliana', role: 'pediatra', crm_coren: 'CRM 54329', specialty: 'Pediatria', phone: '(85) 99999-6001', email: 'juliana@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    
    // Técnicos de Enfermagem SD
    { id: 'tec1', full_name: 'Cristiane', role: 'tecnico_enfermagem', crm_coren: 'COREN 78901', specialty: 'Técnico de Enfermagem', phone: '(85) 99999-7001', email: 'cristiane@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    { id: 'tec2', full_name: 'Samara', role: 'tecnico_enfermagem', crm_coren: 'COREN 78902', specialty: 'Técnico de Enfermagem', phone: '(85) 99999-7002', email: 'samara@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    { id: 'tec3', full_name: 'Rafaela', role: 'tecnico_enfermagem', crm_coren: 'COREN 78903', specialty: 'Técnico de Enfermagem', phone: '(85) 99999-7003', email: 'rafaela@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    { id: 'tec4', full_name: 'Rayane', role: 'tecnico_enfermagem', crm_coren: 'COREN 78904', specialty: 'Técnico de Enfermagem', phone: '(85) 99999-7004', email: 'rayane@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    { id: 'tec5', full_name: 'Wellida', role: 'tecnico_enfermagem', crm_coren: 'COREN 78905', specialty: 'Técnico de Enfermagem', phone: '(85) 99999-7005', email: 'wellida@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    { id: 'tec6', full_name: 'Gracijane', role: 'tecnico_enfermagem', crm_coren: 'COREN 78906', specialty: 'Técnico de Enfermagem', phone: '(85) 99999-7006', email: 'gracijane@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    { id: 'tec7', full_name: 'Simone', role: 'tecnico_enfermagem', crm_coren: 'COREN 78907', specialty: 'Técnico de Enfermagem', phone: '(85) 99999-7007', email: 'simone.tec@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    { id: 'tec8', full_name: 'Elisangela', role: 'tecnico_enfermagem', crm_coren: 'COREN 78908', specialty: 'Técnico de Enfermagem', phone: '(85) 99999-7008', email: 'elisangela@hospital.com', availability_status: 'disponivel', shift: 'SD' },
    
    // Técnicos de Enfermagem SN
    { id: 'tec9', full_name: 'Beatriz', role: 'tecnico_enfermagem', crm_coren: 'COREN 78909', specialty: 'Técnico de Enfermagem', phone: '(85) 99999-7009', email: 'beatriz@hospital.com', availability_status: 'disponivel', shift: 'SN' },
    { id: 'tec10', full_name: 'Remedios', role: 'tecnico_enfermagem', crm_coren: 'COREN 78910', specialty: 'Técnico de Enfermagem', phone: '(85) 99999-7010', email: 'remedios@hospital.com', availability_status: 'disponivel', shift: 'SN' },
    { id: 'tec11', full_name: 'Camila', role: 'tecnico_enfermagem', crm_coren: 'COREN 78911', specialty: 'Técnico de Enfermagem', phone: '(85) 99999-7011', email: 'camila.tec@hospital.com', availability_status: 'disponivel', shift: 'SN' },
    
    // Maqueiro
    { id: 'maq1', full_name: 'Wandersonh', role: 'maqueiro', crm_coren: '', specialty: 'Transporte', phone: '(85) 99999-8001', email: 'wandersonh@hospital.com', availability_status: 'disponivel', shift: 'SD' }
  ],
  surgeries: [
    {
      id: 'surg1',
      ordem: 1,
      data: '2025-12-19',
      sala_operatoria: 'Sala Transoperatório 1',
      especialidade: 'Cirurgia Geral',
      prontuario: '2024-001234',
      iniciais_paciente: 'M.S.S.',
      data_nascimento: '1958-05-15',
      procedimento: 'Colecistectomia Videolaparoscópica',
      tipo_cirurgia: 'eletiva',
      nivel_contaminacao: 'potencialmente_contaminada',
      cirurgiao: 'Dr. Fernando',
      auxiliar: 'Cristiane',
      anestesista: 'Dra. Camila',
      tipo_anestesia: 'geral',
      enfermeira: 'Isabela',
      instrumentadora: 'Samara',
      circulante: 'Rafaela',
      status: 'concluida',
      hora_inicio: '08:00',
      hora_fim: '09:30',
      duracao_estimada_min: 90,
      observacoes: 'Cirurgia eletiva sem intercorrências'
    },
    {
      id: 'surg2',
      ordem: 2,
      data: '2025-12-19',
      sala_operatoria: 'Sala Transoperatório 2',
      especialidade: 'Ortopedia',
      prontuario: '2024-001235',
      iniciais_paciente: 'J.C.O.',
      data_nascimento: '1972-08-22',
      procedimento: 'Redução Cirúrgica de Fratura',
      tipo_cirurgia: 'urgencia',
      nivel_contaminacao: 'limpa',
      cirurgiao: 'Dr. Marcus',
      auxiliar: 'Rayane',
      anestesista: 'Dr. Erick',
      tipo_anestesia: 'raquidiana',
      enfermeira: 'Nelyvania',
      instrumentadora: 'Wellida',
      circulante: 'Gracijane',
      status: 'concluida',
      hora_inicio: '10:00',
      hora_fim: '12:00',
      duracao_estimada_min: 120,
      observacoes: 'Paciente vítima de acidente - fratura consolidada com sucesso'
    },
    {
      id: 'surg3',
      ordem: 3,
      data: '2025-12-19',
      sala_operatoria: 'Sala Transoperatório 1',
      especialidade: 'Obstetrícia',
      prontuario: '2024-001236',
      iniciais_paciente: 'A.P.F.',
      data_nascimento: '1985-11-30',
      procedimento: 'Cesárea',
      tipo_cirurgia: 'emergencia',
      nivel_contaminacao: 'limpa',
      cirurgiao: 'Dra. Gisele',
      auxiliar: 'Elisangela',
      anestesista: 'Dra. Camila',
      tipo_anestesia: 'raquidiana',
      enfermeira: 'Hersilane',
      instrumentadora: 'Samara',
      circulante: 'Cristiane',
      status: 'concluida',
      hora_inicio: '14:30',
      hora_fim: '15:30',
      duracao_estimada_min: 60,
      observacoes: 'Sofrimento fetal agudo - RN e mãe em boas condições'
    },
    {
      id: 'surg4',
      ordem: 4,
      data: '2026-03-30',
      sala_operatoria: 'Sala Transoperatório 1',
      especialidade: 'Cirurgia Bucomaxilofacial',
      prontuario: '2024-001237',
      iniciais_paciente: 'R.A.L.',
      data_nascimento: '1965-03-10',
      procedimento: 'Exodontia de Dentes Inclusos',
      tipo_cirurgia: 'eletiva',
      nivel_contaminacao: 'potencialmente_contaminada',
      cirurgiao: 'Dr. Matheus',
      auxiliar: 'Rafaela',
      anestesista: 'Dr. Erick',
      tipo_anestesia: 'geral',
      enfermeira: 'Isabela',
      instrumentadora: 'Wellida',
      circulante: 'Rayane',
      status: 'agendada',
      hora_inicio: '08:00',
      hora_fim: '10:00',
      duracao_estimada_min: 120,
      observacoes: 'Paciente com 4 dentes inclusos para remoção'
    },
    {
      id: 'surg5',
      ordem: 5,
      data: '2026-03-30',
      sala_operatoria: 'Sala Transoperatório 2',
      especialidade: 'Pediatria',
      prontuario: '2024-001238',
      iniciais_paciente: 'L.M.S.',
      data_nascimento: '2018-06-15',
      procedimento: 'Herniorrafia Inguinal Pediátrica',
      tipo_cirurgia: 'eletiva',
      nivel_contaminacao: 'limpa',
      cirurgiao: 'Dra. Juliana',
      auxiliar: 'Gracijane',
      anestesista: 'Dra. Camila',
      tipo_anestesia: 'geral',
      enfermeira: 'Nelyvania',
      instrumentadora: 'Samara',
      circulante: 'Elisangela',
      status: 'agendada',
      hora_inicio: '11:00',
      hora_fim: '12:00',
      duracao_estimada_min: 60,
      observacoes: 'Cirurgia pediátrica - hérnia inguinal direita'
    },
    {
      id: 'surg6',
      ordem: 6,
      data: '2026-03-30',
      sala_operatoria: 'Sala Transoperatório 1',
      especialidade: 'Ortopedia',
      prontuario: '2024-001239',
      iniciais_paciente: 'C.R.M.',
      data_nascimento: '1980-02-25',
      procedimento: 'Artroscopia de Joelho',
      tipo_cirurgia: 'eletiva',
      nivel_contaminacao: 'limpa',
      cirurgiao: 'Dr. Marcus',
      auxiliar: 'Cristiane',
      anestesista: 'Dr. Erick',
      tipo_anestesia: 'raquidiana',
      enfermeira: 'Isabela',
      instrumentadora: 'Wellida',
      circulante: 'Rafaela',
      status: 'agendada',
      hora_inicio: '14:00',
      hora_fim: '15:30',
      duracao_estimada_min: 90,
      observacoes: 'Lesão de menisco medial'
    },
    {
      id: 'surg7',
      ordem: 7,
      data: '2026-03-30',
      sala_operatoria: 'Sala Transoperatório 2',
      especialidade: 'Cirurgia Geral',
      prontuario: '2024-001240',
      iniciais_paciente: 'P.S.A.',
      data_nascimento: '1952-09-12',
      procedimento: 'Herniorrafia Incisional',
      tipo_cirurgia: 'eletiva',
      nivel_contaminacao: 'limpa',
      cirurgiao: 'Dr. Fernando',
      auxiliar: 'Rayane',
      anestesista: 'Dra. Camila',
      tipo_anestesia: 'geral',
      enfermeira: 'Nelyvania',
      instrumentadora: 'Samara',
      circulante: 'Wellida',
      status: 'agendada',
      hora_inicio: '13:00',
      hora_fim: '15:00',
      duracao_estimada_min: 120,
      observacoes: 'Hérnia incisional volumosa - pós cirurgia abdominal prévia'
    },
    {
      id: 'surg8',
      ordem: 8,
      data: '2026-03-30',
      sala_operatoria: 'Sala Transoperatório 1',
      especialidade: 'Obstetrícia',
      prontuario: '2024-001241',
      iniciais_paciente: 'T.F.L.',
      data_nascimento: '1993-07-18',
      procedimento: 'Cesárea Eletiva',
      tipo_cirurgia: 'eletiva',
      nivel_contaminacao: 'limpa',
      cirurgiao: 'Dra. Luciana',
      auxiliar: 'Gracijane',
      anestesista: 'Dr. Erick',
      tipo_anestesia: 'raquidiana',
      enfermeira: 'Hersilane',
      instrumentadora: 'Samara',
      circulante: 'Cristiane',
      status: 'agendada',
      hora_inicio: '16:00',
      hora_fim: '17:00',
      duracao_estimada_min: 60,
      observacoes: 'Paciente com 2 cesáreas prévias - iterativa'
    }
  ],
  equipment: [
    {
      id: 'eq1',
      name: 'Arco Cirúrgico Portátil',
      category: 'equipamento_movel',
      code: 'AC-001',
      location: 'Sala 1',
      status: 'em_uso',
      quantity: 1,
      min_quantity: 1,
      expiration_date: '',
      last_maintenance: '2026-02-15',
      notes: 'Próxima manutenção em 08/2026'
    },
    {
      id: 'eq2',
      name: 'Monitor Multiparamétrico',
      category: 'equipamento_fixo',
      code: 'MM-005',
      location: 'Sala 1',
      status: 'em_uso',
      quantity: 1,
      min_quantity: 1,
      expiration_date: '',
      last_maintenance: '2026-01-20',
      notes: ''
    },
    {
      id: 'eq3',
      name: 'Luva Cirúrgica Estéril 7.5',
      category: 'material_descartavel',
      code: 'LC-75',
      location: 'Almoxarifado CC',
      status: 'disponivel',
      quantity: 50,
      min_quantity: 100,
      expiration_date: '2027-12-31',
      last_maintenance: '',
      notes: 'Estoque abaixo do mínimo - solicitar reposição'
    },
    {
      id: 'eq4',
      name: 'Fio de Sutura Absorvível 3-0',
      category: 'material_descartavel',
      code: 'FS-30',
      location: 'Almoxarifado CC',
      status: 'disponivel',
      quantity: 180,
      min_quantity: 150,
      expiration_date: '2028-06-30',
      last_maintenance: '',
      notes: ''
    },
    {
      id: 'eq5',
      name: 'Pinça Kelly Curva',
      category: 'instrumental',
      code: 'PK-C001',
      location: 'CME',
      status: 'esterilizacao',
      quantity: 25,
      min_quantity: 20,
      expiration_date: '',
      last_maintenance: '2026-03-25',
      notes: 'Ciclo de esterilização em andamento'
    },
    {
      id: 'eq6',
      name: 'Propofol 200mg/20ml',
      category: 'medicamento',
      code: 'MD-PRO200',
      location: 'Farmácia Satélite CC',
      status: 'disponivel',
      quantity: 45,
      min_quantity: 60,
      expiration_date: '2026-11-30',
      last_maintenance: '',
      notes: 'Estoque abaixo do mínimo'
    },
    {
      id: 'eq7',
      name: 'Prótese de Joelho',
      category: 'implante',
      code: 'IMP-JOE-TT',
      location: 'Sala de Implantes',
      status: 'disponivel',
      quantity: 3,
      min_quantity: 2,
      expiration_date: '2030-12-31',
      last_maintenance: '',
      notes: 'Diferentes tamanhos disponíveis'
    },
    {
      id: 'eq8',
      name: 'Microscópio Cirúrgico',
      category: 'equipamento_fixo',
      code: 'MC-NEU-01',
      location: 'Sala 4',
      status: 'manutencao',
      quantity: 1,
      min_quantity: 1,
      expiration_date: '',
      last_maintenance: '2026-03-28',
      notes: 'Manutenção preventiva - retorno 02/04'
    }
  ],
  shiftSchedule: [
    {
      id: 'shift1',
      staff_name: 'Dr. Carlos Eduardo Mendes',
      staff_id: 'staff1',
      role: 'cirurgiao',
      date: '2026-03-30',
      shift: 'manha',
      status: 'confirmado',
      notes: 'Revascularização agendada'
    },
    {
      id: 'shift2',
      staff_name: 'Dra. Patricia Souza Lima',
      staff_id: 'staff2',
      role: 'cirurgiao',
      date: '2026-03-30',
      shift: 'tarde',
      status: 'confirmado',
      notes: ''
    },
    {
      id: 'shift3',
      staff_name: 'Dr. Roberto Santos Silva',
      staff_id: 'staff3',
      role: 'anestesista',
      date: '2026-03-30',
      shift: 'manha',
      status: 'confirmado',
      notes: ''
    },
    {
      id: 'shift4',
      staff_name: 'Dra. Juliana Costa Oliveira',
      staff_id: 'staff4',
      role: 'anestesista',
      date: '2026-03-30',
      shift: 'tarde',
      status: 'confirmado',
      notes: ''
    },
    {
      id: 'shift5',
      staff_name: 'Enf. Amanda Ferreira Costa',
      staff_id: 'staff5',
      role: 'enfermeiro',
      date: '2026-03-30',
      shift: 'manha',
      status: 'confirmado',
      notes: ''
    },
    {
      id: 'shift6',
      staff_name: 'Enf. Marcos Paulo Alves',
      staff_id: 'staff6',
      role: 'enfermeiro',
      date: '2026-03-30',
      shift: 'noite',
      status: 'confirmado',
      notes: 'Plantão noturno'
    },
    {
      id: 'shift7',
      staff_name: 'Tec. Enf. Carla Regina Santos',
      staff_id: 'staff7',
      role: 'instrumentador',
      date: '2026-03-30',
      shift: 'manha',
      status: 'confirmado',
      notes: ''
    },
    {
      id: 'shift8',
      staff_name: 'Tec. Enf. Carla Regina Santos',
      staff_id: 'staff7',
      role: 'instrumentador',
      date: '2026-03-30',
      shift: 'tarde',
      status: 'confirmado',
      notes: 'Dobra de plantão'
    }
  ],
  lgpdConsents: [
    {
      id: 'lgpd1',
      record_number: '2024-001234',
      patient_id: 'p1',
      consent_date: '2026-03-15',
      consent_type: 'tratamento_dados',
      accepted: true,
      collected_by: 'Enf. Amanda Ferreira Costa',
      notes: 'Consentimento coletado na admissão'
    },
    {
      id: 'lgpd2',
      record_number: '2024-001234',
      patient_id: 'p1',
      consent_date: '2026-03-15',
      consent_type: 'compartilhamento',
      accepted: true,
      collected_by: 'Enf. Amanda Ferreira Costa',
      notes: 'Autorizado compartilhamento com convênio'
    },
    {
      id: 'lgpd3',
      record_number: '2024-001235',
      patient_id: 'p2',
      consent_date: '2026-03-20',
      consent_type: 'tratamento_dados',
      accepted: true,
      collected_by: 'Recepção CC',
      notes: ''
    },
    {
      id: 'lgpd4',
      record_number: '2024-001236',
      patient_id: 'p3',
      consent_date: '2026-03-22',
      consent_type: 'tratamento_dados',
      accepted: true,
      collected_by: 'Recepção CC',
      notes: ''
    },
    {
      id: 'lgpd5',
      record_number: '2024-001236',
      patient_id: 'p3',
      consent_date: '2026-03-22',
      consent_type: 'pesquisa',
      accepted: false,
      collected_by: 'Recepção CC',
      notes: 'Paciente optou por não participar de pesquisas'
    }
  ]
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const data = JSON.parse(stored);
    // Garantir que arrays existam
    return {
      ...data,
      incidentes: data.incidentes || [],
      analises: data.analises || [],
      planosAcao: data.planosAcao || [],
      patients: data.patients || [],
      surgeries: data.surgeries || [],
      operatingRooms: data.operatingRooms || [],
      medicalStaff: data.medicalStaff || [],
      equipment: data.equipment || [],
      shiftSchedule: data.shiftSchedule || [],
      lgpdConsents: data.lgpdConsents || []
    };
  }
  saveData(initialData);
  return initialData;
};

export const saveData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportData = (): string => {
  const data = loadData();
  return JSON.stringify(data, null, 2);
};

export const calculateBusinessDay = (): number => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  let businessDays = 0;
  let currentDate = new Date(year, month, 1);
  const today = now.getDate();
  
  for (let day = 1; day <= today; day++) {
    currentDate.setDate(day);
    const dayOfWeek = currentDate.getDay();
    
    // Se não for sábado (6) ou domingo (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDays++;
    }
  }
  
  return businessDays;
};

export const isDataEntryBlocked = (userRole: string, dataLiberada: boolean): boolean => {
  const businessDay = calculateBusinessDay();
  
  if (businessDay <= 5) {
    return false;
  }
  
  if (userRole === 'admin') {
    return false;
  }
  
  return !dataLiberada;
};