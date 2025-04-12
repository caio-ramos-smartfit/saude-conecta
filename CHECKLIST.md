# Checklist de Desenvolvimento - SaúdeConecta

Este documento apresenta um checklist detalhado das tabelas de banco de dados necessárias para o backend Rails, páginas acessadas durante a análise, e recomendações para compatibilidade multiplataforma.

## Legenda
- ✅ Implementado/Disponível
- ⬜ A implementar/Pendente

## Tabelas de Banco de Dados

### 1. Users (Usuários)
✅ Implementar tabela base para autenticação
- **Campos principais**: 
  - ✅ id
  - ✅ email
  - ✅ password_digest
  - ✅ user_type
  - ✅ created_at
  - ✅ updated_at
- **Relacionamentos**: 
  - ✅ Has one: patient OU provider (polimórfico baseado em user_type)

### 2. Patients (Pacientes)
❌ Não será implementado nesta versão
- **Nota**: Funcionalidade de pacientes não será incluída na versão atual do projeto

### 3. Providers (Profissionais de Saúde)
⬜ Implementar tabela para informações de profissionais
- **Campos principais**: 
  - ⬜ id
  - ⬜ user_id
  - ⬜ organization_name
  - ⬜ contact_name
  - ⬜ specialty
  - ⬜ address
  - ⬜ phone
  - ⬜ description
  - ⬜ created_at
  - ⬜ updated_at
- **Relacionamentos**:
  - ⬜ Belongs to: user
  - ⬜ Has many: appointments
  - ⬜ Has many: availabilities
  - ⬜ Has many: services
  - ⬜ Has many: reviews

### 4. Appointments (Consultas)
⬜ Implementar tabela para agendamento de consultas
- **Campos principais**: 
  - ⬜ id
  - ⬜ patient_id
  - ⬜ provider_id
  - ⬜ service_id
  - ⬜ date
  - ⬜ time
  - ⬜ duration
  - ⬜ status
  - ⬜ notes
  - ⬜ created_at
  - ⬜ updated_at
- **Relacionamentos**:
  - ⬜ Belongs to: patient
  - ⬜ Belongs to: provider
  - ⬜ Belongs to: service

### 5. Availabilities (Disponibilidades)
✅ Implementar tabela para horários disponíveis
- **Campos principais**: 
  - ✅ id
  - ✅ provider_id
  - ✅ date
  - ✅ start_time
  - ✅ end_time
  - ✅ is_available
  - ✅ cost
  - ✅ created_at
  - ✅ updated_at
- **Relacionamentos**:
  - ✅ Belongs to: provider

### 6. Services (Serviços)
⬜ Implementar tabela para serviços oferecidos
- **Campos principais**: 
  - ⬜ id
  - ⬜ provider_id
  - ⬜ name
  - ⬜ description
  - ⬜ duration
  - ⬜ cost
  - ⬜ created_at
  - ⬜ updated_at
- **Relacionamentos**:
  - ⬜ Belongs to: provider
  - ⬜ Has many: appointments

### 7. HealthRecords (Registros de Saúde)
❌ Não será implementado nesta versão
- **Nota**: Funcionalidade de registros de saúde não será incluída na versão atual do projeto

### 8. Recommendations (Recomendações)
❌ Não será implementado nesta versão
- **Nota**: Funcionalidade de recomendações não será incluída na versão atual do projeto

### 9. Reviews (Avaliações)
❌ Não será implementado nesta versão
- **Nota**: Funcionalidade de avaliações não será incluída na versão atual do projeto

## Páginas e Funcionalidades

### Páginas Funcionais
- ✅ **Página Inicial** - Apresentação da plataforma
- ✅ **Login** - Formulário de autenticação
- ✅ **Registro** - Formulários para pacientes e profissionais
- ✅ **Dashboard do Paciente** - Visão geral de consultas e recomendações
- ✅ **Dashboard do Profissional** - Gerenciamento de disponibilidade e consultas
- ✅ **Busca de Profissionais** - Filtro por especialidade, localização e custo

### Componentes de Interface
- ⬜ **Navbar** - Implementar barra de navegação com:
  - ⬜ Opções "Cadastrar-se" e "Fazer login" para usuários não autenticados
  - ⬜ Menu de perfil com acesso a dados pessoais para usuários autenticados
  - ⬜ Opção de logout no menu de perfil
- ⬜ **Controle de Visibilidade** - Esconder botões de login/cadastro quando usuário estiver logado

### Páginas com Erros (404)
- ⬜ **Perfil do Paciente** - `/patient/profile`
- ⬜ **Gerenciamento de Disponibilidade do Profissional** - `/providers/availability`
- ⬜ **Registros de Saúde** - `/patient/health-records`
- ⬜ **Detalhes de Consulta** - `/appointments/[id]`

## Configuração do Ambiente

### Compatibilidade Multiplataforma
- ✅ Criar arquivo Gemfile.lock inicial
- ⬜ Adicionar suporte para plataforma x86_64-linux
- ⬜ Adicionar suporte para plataforma aarch64-linux (Apple Silicon)
- ⬜ Documentar no README a importância do Gemfile.lock para compatibilidade

### Configuração do Docker
- ✅ Configurar docker-compose.yml
- ✅ Configurar Dockerfile para o backend
- ✅ Configurar Dockerfile para o frontend
- ⬜ Implementar entrypoint.sh com permissões corretas
- ⬜ Configurar variáveis de ambiente para desenvolvimento

## Implementação do Backend

### Autenticação
- ⬜ Implementar Devise para autenticação
- ⬜ Configurar Devise JWT para tokens
- ⬜ Implementar endpoints de registro e login
- ⬜ Implementar autorização baseada em papéis (paciente/profissional)

### API RESTful
- ⬜ Implementar controladores para Appointments
- ⬜ Implementar controladores para Providers
- ⬜ Implementar controladores para Patients
- ⬜ Implementar controladores para Services
- ⬜ Implementar controladores para Availabilities
- ⬜ Implementar controladores para HealthRecords
- ⬜ Implementar controladores para Recommendations
- ⬜ Implementar controladores para Reviews

### Configuração CORS
- ✅ Configurar CORS para permitir requisições do frontend
- ✅ Definir origens permitidas
- ✅ Configurar métodos HTTP permitidos
- ✅ Configurar cabeçalhos permitidos

## Recomendações para Compatibilidade Multiplataforma

Para garantir a compatibilidade entre diferentes sistemas operacionais e arquiteturas de processador, é essencial configurar corretamente o arquivo `Gemfile.lock`. Adicione o seguinte ao README.md:

```markdown
## Compatibilidade Multiplataforma

Este projeto suporta desenvolvimento em diferentes sistemas operacionais e arquiteturas de processador, incluindo Linux e MacOS com processadores M1+. Para garantir a compatibilidade entre ambientes, é essencial manter o arquivo `Gemfile.lock` configurado corretamente.

### Configurando o Gemfile.lock

Antes de iniciar o projeto pela primeira vez, execute:

```bash
# Para usuários de Linux (x86_64)
bundle lock --add-platform x86_64-linux

# Para usuários de MacOS com Apple Silicon (M1/M2)
bundle lock --add-platform aarch64-linux
```

Isso garante que o `Gemfile.lock` inclua as plataformas necessárias para todos os ambientes de desenvolvimento da equipe, evitando problemas de compatibilidade durante a execução do Docker.

### Por que isso é importante?

O Docker utiliza o `Gemfile.lock` para determinar quais versões exatas das gems instalar. Quando desenvolvedores usam diferentes sistemas operacionais ou arquiteturas de processador, o Ruby pode gerar versões do `Gemfile.lock` incompatíveis entre si.

Ao adicionar explicitamente todas as plataformas necessárias, garantimos que:

1. O ambiente Docker funcione consistentemente para todos os membros da equipe
2. As mesmas versões de gems sejam instaladas em todos os ambientes
3. Evitamos o famoso problema "funciona na minha máquina"

Sempre faça commit do `Gemfile.lock` atualizado para o repositório após adicionar novas plataformas.
```
