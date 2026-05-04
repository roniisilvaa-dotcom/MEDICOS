# Sistema de Indicadores VITALLIS

## 🏥 Sobre o Projeto

Dashboard de gestão de indicadores hospitalares **VITALLIS** com funcionalidades de controle de acesso, monitoramento de dados médicos, **análise de incidentes com metodologia Ishikawa** e **gestão de planos de ação corretiva**.

---

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação e Controle de Acesso

#### **Administrador**
- ✅ Acesso completo ao sistema
- ✅ Visualização do Dashboard com KPIs, gráficos e tabelas
- ✅ Gerenciamento de todos os setores
- ✅ Alimentação de dados de qualquer setor
- ✅ Gerenciamento de usuários
- ✅ Backup e exportação de dados
- ✅ Liberação temporária de entrada de dados após 5º dia útil

#### **Usuário Comum**
- ✅ Acesso restrito apenas à **Alimentação de Dados**
- ✅ Pode alimentar dados **APENAS do seu próprio setor**
- ✅ Não tem acesso ao Dashboard
- ✅ Não tem acesso à visualização de outros setores
- ✅ Não tem acesso ao gerenciamento de usuários
- ✅ Não tem acesso ao backup

---

## 👥 Credenciais de Acesso

### Administrador
- **Usuário:** `admin`
- **Senha:** `admin123`
- **Acesso:** Total

### Usuários por Setor

| Usuário | Senha | Setor | Acesso |
|---------|-------|-------|--------|
| `ucinco` | `ucinco123` | UCINCO | Apenas alimentação UCINCO |
| `pa` | `pa123` | Pronto Socorro | Apenas alimentação Pronto Socorro |
| `uti1` | `uti123` | UTI I Adulto | Apenas alimentação UTI I |
| `pediatria` | `ped123` | Pediatria | Apenas alimentação Pediatria |

---

## 🎨 Design e Layout

### Logos
- ✅ Logo VITALLIS com ícone Activity
- ✅ Presente na tela de login e sidebar
- ✅ Design moderno e minimalista

### Cores
- **Azul Marinho:** `#0a2b3e` (principal)
- **Azul Médio:** `#1e6a8f` (secundário)
- **Sidebar:** `#2c3e50` (escura)
- **Azul Ação:** `#3498db` (botões e highlights)

### Fonte
- **Inter** (Google Fonts)

---

## 📊 Estrutura de Setores

### Setores Assistenciais

#### **Internação**
- Pediatria
- Clínica Ortopédica
- Clínica de Internação

#### **UTI**
- UTI I Adulto
- UTI II Adulto
- UCINCO (Neonatal)

#### **Emergência**
- Pronto Socorro

#### **Cirúrgico**
- Centro Cirúrgico

#### **Maternidade**
- Maternidade

#### **Ambulatório**
- Ambulatório

### Setores de Apoio
- NIR (Núcleo Interno de Regulação)
- Farmácia
- CCIH (Comissão de Controle de Infecção)

---

## 📈 Indicadores

### Indicadores Coletivos (Transversais)
Aplicáveis a todos os setores assistenciais:
- Preenchimento de Prontuário (%)
- Satisfação de Usuários (%)
- Densidade de Quedas (/1000 pacientes-dia)
- Densidade de Lesão por Pressão (/1000 pacientes-dia)
- Não Conformidade de Medicamentos
- Ações de Segurança do Paciente
- Educação Permanente (horas)

### Indicadores Individuais
Cada tipo de setor possui seus indicadores específicos:

**Internação:**
- Saídas, Média de Permanência, Taxa de Ocupação
- Taxa de Readmissão (29 dias)
- LOS com/sem Exames
- Utilização de Protocolos

**UTI:**
- Taxa de Mortalidade (>24h)
- Densidade de ITU e Pneumonia
- Tempo Porta-ECG

**Pronto Atendimento:**
- Tempo de Espera por Classificação (Vermelho, Amarelo, Verde, Azul)
- Tempo Porta-Médico
- Taxa de Evasão

**Maternidade:**
- Taxa de Partos Normal vs Cesárea
- Saídas Maternidade

**Centro Cirúrgico:**
- Cirurgias Eletivas e de Urgência
- Taxa de Suspensão Operacional

---

## 🔒 Regra de Bloqueio (5º Dia Útil)

### Funcionamento
1. **Até o 5º dia útil:** Todos os usuários podem alimentar dados
2. **Após o 5º dia útil:** Alimentação bloqueada automaticamente
3. **Liberação temporária:** Apenas Admin pode liberar

### Cálculo de Dia Útil
- Conta apenas dias úteis (segunda a sexta)
- Exclui sábados e domingos
- Recalcula automaticamente a cada mês

---

## 📂 Estrutura de Arquivos

```
src/
├── app/
│   ├── components/
│   │   ├── Dashboard.tsx          # Dashboard completo (Admin only)
│   │   ├── Sidebar.tsx            # Menu lateral com logos
│   │   ├── LoginScreen.tsx        # Tela de login com logos
│   │   ├── DataEntryForm.tsx      # Formulário de alimentação (filtrado por role)
│   │   ├── SetoresView.tsx        # Visualização de setores (Admin only)
│   │   ├── AnaliseIncidentes.tsx  # Análise de Incidentes com Ishikawa (Admin only)
│   │   ├── PlanosAcao.tsx         # Gestão de Planos de Ação (Admin only)
│   │   ├── UserManagement.tsx     # Gerenciamento de usuários (Admin only)
│   │   └── BackupView.tsx         # Backup de dados (Admin only)
│   ├── context/
│   │   └── AuthContext.tsx        # Contexto de autenticação
│   ├── types/
│   │   └── index.ts               # Tipos TypeScript (User, Incidente, Ishikawa, PlanoAcao)
│   ├── utils/
│   │   └── storage.ts             # LocalStorage e dados iniciais
│   ├── routes.tsx                 # Rotas com controle de acesso
│   └── App.tsx                    # Componente principal
└── styles/
    └── fonts.css                  # Fonte Inter
```

---

## 🔬 Análise de Incidentes (Metodologia Manual de Análise)

### Classificação de Gravidade
O sistema classifica incidentes em 4 níveis:

1. **Near Miss (Quase Erro)** 🔵
   - Evento que não gerou dano
   - Interceptado antes de atingir o paciente
   - Exemplo: Identificação incorreta detectada antes do procedimento

2. **Dano Leve** 🟢
   - Recuperação rápida, sem intervenção complexa
   - Exemplo: Pequeno atraso no atendimento

3. **Dano Moderado** 🟡
   - Requer intervenção médica adicional
   - Exemplo: Queda com necessidade de exames

4. **Dano Grave** 🔴
   - Lesão permanente ou risco à vida
   - Exemplo: Erro de medicação com reação adversa grave

### Diagrama de Ishikawa (Espinha de Peixe)
Para cada incidente crítico, analise os 6 fatores contributivos:

1. **👤 Paciente**
   - Idade, condição clínica
   - Comunicação prejudicada
   - Mobilidade reduzida

2. **📋 Tarefa**
   - Procedimento complexo
   - Protocolo não seguido
   - Falta de checklist

3. **🧑‍⚕️ Indivíduo**
   - Falta de treinamento
   - Fadiga da equipe
   - Primeiro dia após férias

4. **👥 Equipe**
   - Falha de comunicação
   - Sobrecarga de trabalho
   - Passagem de plantão incompleta

5. **🏥 Ambiente**
   - Iluminação inadequada
   - Ruído excessivo
   - Espaço físico reduzido

6. **🏢 Organização**
   - Falta de recursos
   - Política inadequada
   - Protocolo desatualizado

### Processo de Análise
> "O processo não serve para punir, mas para aprender."

1. Registrar o incidente com todas as informações
2. Classificar a gravidade do dano
3. Realizar análise de causa raiz (Ishikawa)
4. Criar plano de ação baseado na análise
5. Acompanhar eficácia das ações

---

## 📋 Planos de Ação (Guia Prático de Análise Crítica)

### Metodologia em 5 Etapas

#### 1️⃣ Definição do Problema
Identifique claramente o desvio encontrado no Dashboard
- **Exemplo:** "A taxa de quedas na Enfermaria subiu 12% em relação a Fevereiro"

#### 2️⃣ Análise Crítica
Reunião com líderes do setor para entender as causas
- **Exemplo:** "Novos funcionários sem treinamento adequado"

#### 3️⃣ Ação Imediata ⚡
Solução rápida para conter o problema
- **Exemplo:** "Treinamento de beira de leito para equipe noturna"

#### 4️⃣ Ação Sistêmica 🔧
Mudança estrutural para evitar recorrência
- **Exemplo:** "Revisão do protocolo de classificação de risco de queda na admissão"

#### 5️⃣ Verificação de Eficácia ✅
Acompanhar no próximo mês se o indicador melhorou
- **Exemplo:** "Gráfico de Evolução Mensal mostra retorno à média esperada"

### Status do Plano
- **Pendente** 🟡 - Aguardando início
- **Em Andamento** 🔵 - Ações sendo executadas
- **Concluído** 🟢 - Verificação de eficácia realizada

### Alertas Automáticos
- ⚠️ **Prazo Vencido:** Destaque vermelho para planos não concluídos após prazo
- 📊 **Frequência vs Gravidade:** Incidentes frequentes (mesmo sem dano grave) exigem plano de ação imediato

---

## 🚀 Como Usar

### 1. Login como Admin
- Acesse com `admin` / `admin123`
- Terá acesso total ao sistema

### 2. Login como Usuário de Setor
- Acesse com credenciais de setor (ex: `ucinco` / `ucinco123`)
- Será direcionado automaticamente para **Alimentar Dados**
- Verá apenas o seu setor no dropdown

### 3. Alimentar Dados
- Selecione o setor (ou será selecionado automaticamente)
- Preencha os indicadores coletivos e individuais
- Clique em **Salvar Dados**

### 4. Bloqueio de Dados (Admin)
- Após o 5º dia útil, dados são bloqueados
- Admin pode clicar em **Liberar** para permitir entrada temporária

---

## 💾 Persistência de Dados

- Todos os dados são salvos no **localStorage** do navegador
- Dados persistem entre sessões
- Admin pode fazer backup/exportação em JSON

---

## 🎯 Características Técnicas

### Tecnologias
- **React 18.3.1**
- **TypeScript**
- **Tailwind CSS v4**
- **React Router 7**
- **Chart.js** (gráficos)
- **Lucide React** (ícones)
- **Sonner** (notificações)

### Responsividade
- Layout adaptável para desktop e tablet
- Cards e tabelas responsivas

---

## 📝 Observações Importantes

1. ✅ **Admin** tem acesso total
2. ✅ **Usuários comuns** veem apenas seu setor
3. ✅ **Logo VITALLIS** moderno em login e sidebar
4. ✅ **Bloqueio automático** após 5º dia útil
5. ✅ **Dados fictícios** realistas para demonstração
6. ✅ **Cálculo automático** de Taxa/1k
7. ✅ **LocalStorage** para persistência
8. ✅ **Alertas amigáveis** para usuários sem setor vinculado

---

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com a equipe de TI.

---

**© 2024 VITALLIS - Sistema de Gestão Hospitalar**