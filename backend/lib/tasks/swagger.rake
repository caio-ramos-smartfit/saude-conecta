namespace :swagger do
  desc 'Generate Swagger JSON files from API controllers'
  task :generate => :environment do
    require 'swagger/blocks'
    
    # Define API documentation
    class ApiDocumentation
      include Swagger::Blocks
      
      swagger_root do
        key :swagger, '2.0'
        info do
          key :version, '1.0.0'
          key :title, 'SaúdeConecta API'
          key :description, 'API para o aplicativo SaúdeConecta'
          contact do
            key :name, 'SaúdeConecta Team'
          end
        end
        
        key :basePath, '/api/v1'
        key :produces, ['application/json']
        key :consumes, ['application/json']
        
        # Authentication schemes
        security_definition :Bearer do
          key :type, :apiKey
          key :name, :Authorization
          key :in, :header
          key :description, 'JWT token de autenticação. Exemplo: Bearer {token}'
        end
        
        # Define tags for API groups
        tag do
          key :name, 'authentication'
          key :description, 'Operações de autenticação'
        end
        
        tag do
          key :name, 'users'
          key :description, 'Operações de usuários'
        end
        
        tag do
          key :name, 'providers'
          key :description, 'Operações de profissionais'
        end
        
        tag do
          key :name, 'availabilities'
          key :description, 'Operações de disponibilidade'
        end
      end
      
      # Authentication endpoints
      swagger_path '/login' do
        operation :post do
          key :summary, 'Login de usuário'
          key :description, 'Autentica um usuário e retorna um token JWT'
          key :operationId, 'loginUser'
          key :tags, ['authentication']
          
          parameter do
            key :name, :user
            key :in, :body
            key :description, 'Credenciais do usuário'
            key :required, true
            schema do
              key :'$ref', :LoginParams
            end
          end
          
          response 200 do
            key :description, 'Login realizado com sucesso'
            schema do
              key :'$ref', :LoginResponse
            end
          end
          
          response 401 do
            key :description, 'Credenciais inválidas'
            schema do
              key :'$ref', :ErrorResponse
            end
          end
        end
      end
      
      swagger_path '/register' do
        operation :post do
          key :summary, 'Registro de usuário'
          key :description, 'Registra um novo usuário e retorna um token JWT'
          key :operationId, 'registerUser'
          key :tags, ['authentication']
          
          parameter do
            key :name, :registration
            key :in, :body
            key :description, 'Dados de registro do usuário'
            key :required, true
            schema do
              key :'$ref', :RegistrationParams
            end
          end
          
          response 200 do
            key :description, 'Registro realizado com sucesso'
            schema do
              key :'$ref', :LoginResponse
            end
          end
          
          response 422 do
            key :description, 'Dados inválidos'
            schema do
              key :'$ref', :ErrorResponse
            end
          end
        end
      end
      
      swagger_path '/auth/me' do
        operation :get do
          key :summary, 'Dados do usuário autenticado'
          key :description, 'Retorna os dados do usuário autenticado'
          key :operationId, 'getCurrentUser'
          key :tags, ['users']
          
          security do
            key :Bearer, []
          end
          
          response 200 do
            key :description, 'Dados do usuário obtidos com sucesso'
            schema do
              key :'$ref', :UserResponse
            end
          end
          
          response 401 do
            key :description, 'Não autenticado'
            schema do
              key :'$ref', :ErrorResponse
            end
          end
        end
      end
      
      # Models
      swagger_schema :LoginParams do
        property :user do
          property :email do
            key :type, :string
            key :format, :email
            key :example, 'usuario@exemplo.com'
          end
          property :password do
            key :type, :string
            key :format, :password
            key :example, 'senha123'
          end
        end
      end
      
      swagger_schema :RegistrationParams do
        property :user do
          property :email do
            key :type, :string
            key :format, :email
            key :example, 'usuario@exemplo.com'
          end
          property :password do
            key :type, :string
            key :format, :password
            key :example, 'senha123'
          end
          property :password_confirmation do
            key :type, :string
            key :format, :password
            key :example, 'senha123'
          end
          property :user_type do
            key :type, :string
            key :enum, ['provider']
            key :example, 'provider'
          end
        end
        property :provider do
          property :organization_name do
            key :type, :string
            key :example, 'Clínica Exemplo'
          end
          property :contact_name do
            key :type, :string
            key :example, 'Dr. João Silva'
          end
          property :specialty do
            key :type, :string
            key :example, 'Cardiologia'
          end
          property :address do
            key :type, :string
            key :example, 'Rua Exemplo, 123'
          end
          property :phone do
            key :type, :string
            key :example, '(11) 99999-9999'
          end
        end
      end
      
      swagger_schema :LoginResponse do
        property :status do
          property :code do
            key :type, :integer
            key :example, 200
          end
          property :message do
            key :type, :string
            key :example, 'Login realizado com sucesso.'
          end
        end
        property :data do
          property :user do
            property :id do
              key :type, :integer
              key :example, 1
            end
            property :email do
              key :type, :string
              key :example, 'usuario@exemplo.com'
            end
            property :user_type do
              key :type, :string
              key :example, 'provider'
            end
          end
          property :token do
            key :type, :string
            key :example, 'eyJhbGciOiJIUzI1NiJ9...'
          end
        end
      end
      
      swagger_schema :UserResponse do
        property :status do
          property :code do
            key :type, :integer
            key :example, 200
          end
          property :message do
            key :type, :string
            key :example, 'Dados do usuário obtidos com sucesso.'
          end
        end
        property :data do
          property :user do
            property :id do
              key :type, :integer
              key :example, 1
            end
            property :email do
              key :type, :string
              key :example, 'usuario@exemplo.com'
            end
            property :user_type do
              key :type, :string
              key :example, 'provider'
            end
            property :profile do
              property :id do
                key :type, :integer
                key :example, 1
              end
              property :organization_name do
                key :type, :string
                key :example, 'Clínica Exemplo'
              end
              property :contact_name do
                key :type, :string
                key :example, 'Dr. João Silva'
              end
              property :specialty do
                key :type, :string
                key :example, 'Cardiologia'
              end
              property :address do
                key :type, :string
                key :example, 'Rua Exemplo, 123'
              end
              property :phone do
                key :type, :string
                key :example, '(11) 99999-9999'
              end
            end
          end
        end
      end
      
      swagger_schema :ErrorResponse do
        property :status do
          property :code do
            key :type, :integer
            key :example, 401
          end
          property :message do
            key :type, :string
            key :example, 'Credenciais inválidas.'
          end
        end
        property :errors do
          key :type, :array
          items do
            key :type, :string
          end
          key :example, ['Email ou senha inválidos']
        end
      end
    end
    
    # Generate Swagger JSON file
    swagger_data = Swagger::Blocks.build_root_json([ApiDocumentation])
    File.open(Rails.root.join('public', 'swagger.json'), 'w') do |file|
      file.write(JSON.pretty_generate(swagger_data))
    end
    
    puts "Swagger JSON file generated at public/swagger.json"
  end
end
