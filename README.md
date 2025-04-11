# SaúdeConecta - Plataforma de Saúde Acessível

Uma plataforma web para conectar pessoas vulneráveis a serviços de saúde gratuitos ou de baixo custo. Este projeto implementa funcionalidades essenciais de autenticação e agendamento de consultas.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

### Frontend (Next.js)

- Interface de usuário moderna e responsiva usando Next.js, React e Tailwind CSS
- Autenticação completa com registro e login
- Painel de paciente para agendamento e gerenciamento de consultas
- Painel de profissional para gerenciar disponibilidade e consultas

### Backend (Ruby on Rails)

- API RESTful com Ruby on Rails
- Autenticação segura usando JWT (JSON Web Tokens)
- Banco de dados PostgreSQL para armazenamento de dados
- Docker para fácil configuração e implantação

## Funcionalidades Principais

- **Autenticação**: Registro e login para pacientes e profissionais de saúde
- **Agendamento de Consultas**: Interface intuitiva para pacientes agendarem consultas
- **Listagem de Consultas**: Visualização e gerenciamento de consultas agendadas
- **Perfis de Usuário**: Diferentes fluxos e permissões para pacientes e profissionais

## Contrato de API

### Autenticação
- `POST /api/auth/register` - Registro de novos usuários
- `POST /api/auth/login` - Login de usuários
- `GET /api/auth/me` - Obter dados do usuário autenticado

### Consultas (Appointments)
- `GET /api/appointments` - Listar consultas do usuário
- `POST /api/appointments` - Criar nova consulta
- `PUT /api/appointments/:id` - Atualizar consulta
- `DELETE /api/appointments/:id` - Cancelar consulta

### Profissionais (Providers)
- `GET /api/providers` - Listar profissionais disponíveis
- `GET /api/providers/:id/availability` - Verificar disponibilidade

## Configuração e Execução

### Pré-requisitos
- Docker e Docker Compose
- Git

### Passos para Execução

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/saude-conecta.git
cd saude-conecta
```

2. Inicie os serviços com Docker Compose:
```bash
docker-compose up
```

3. Acesse a aplicação:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

## Esquema do Banco de Dados

O banco de dados inclui as seguintes tabelas principais:

- **users**: Informações básicas de usuários (autenticação)
- **patients**: Dados específicos de pacientes
- **providers**: Dados específicos de profissionais de saúde
- **appointments**: Registros de consultas agendadas
- **availabilities**: Disponibilidade de horários dos profissionais

## Desenvolvimento

### Estrutura de Arquivos Frontend

```
frontend/
├── app/
│   ├── api/                  # Rotas de API do Next.js
│   ├── context/              # Contextos React (autenticação)
│   ├── login/                # Página de login
│   ├── register/             # Página de registro
│   ├── patient/              # Páginas do painel de paciente
│   │   ├── appointments/     # Gerenciamento de consultas
│   │   └── dashboard/        # Dashboard do paciente
│   └── providers/            # Páginas do painel de profissional
├── components/               # Componentes reutilizáveis
└── public/                   # Arquivos estáticos
```

### Estrutura de Arquivos Backend

```
backend/
├── app/
│   ├── controllers/          # Controladores da API
│   │   └── api/
│   │       └── v1/           # Endpoints da API v1
│   ├── models/               # Modelos de dados
│   └── serializers/          # Serializers JSON
├── config/                   # Configurações
│   └── initializers/         # Inicializadores
└── db/
    └── migrations/           # Migrações do banco de dados
```

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request
