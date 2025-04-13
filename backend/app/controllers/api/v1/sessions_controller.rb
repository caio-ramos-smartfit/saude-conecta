class Api::V1::SessionsController < Devise::SessionsController
  include Swagger::Blocks
  respond_to :json

  swagger_path '/login' do
    operation :post do
      key :summary, 'Autentica um usuário e retorna um token JWT'
      key :description, 'Endpoint para login de usuários'
      key :tags, ['authentication']
      
      parameter do
        key :name, :user
        key :in, :body
        key :description, 'Credenciais do usuário'
        key :required, true
        schema do
          key :type, :object
          property :user do
            key :type, :object
            property :email do
              key :type, :string
              key :example, 'usuario@exemplo.com'
            end
            property :password do
              key :type, :string
              key :example, 'senha123'
            end
          end
        end
      end
      
      response 200 do
        key :description, 'Login realizado com sucesso'
        schema do
          key :type, :object
          property :status do
            key :type, :object
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
            key :type, :object
            property :user do
              key :type, :object
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
      end
      
      response 401 do
        key :description, 'Credenciais inválidas'
        schema do
          key :type, :object
          property :status do
            key :type, :object
            property :code do
              key :type, :integer
              key :example, 401
            end
            property :message do
              key :type, :string
              key :example, 'Credenciais inválidas.'
            end
          end
        end
      end
    end
  end

  def create
    Rails.logger.debug "Login request received: #{params.inspect}"
    
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    
    Rails.logger.debug "User authenticated: #{resource.inspect}"
    Rails.logger.debug "JWT token: #{request.env['warden-jwt_auth.token']}"
    
    respond_with(resource)
  rescue => e
    Rails.logger.error "Login error: #{e.message}"
    render json: {
      status: { code: 401, message: 'Credenciais inválidas.' }
    }, status: :unauthorized
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: { code: 200, message: 'Login realizado com sucesso.' },
        data: {
          user: {
            id: resource.id,
            email: resource.email,
            user_type: resource.user_type
          },
          token: request.env['warden-jwt_auth.token']
        }
      }
    else
      render json: {
        status: { code: 401, message: 'Credenciais inválidas.' }
      }, status: :unauthorized
    end
  end

  def respond_to_on_destroy
    jwt_payload = JWT.decode(request.headers['Authorization'].split(' ')[1], Rails.application.credentials.secret_key_base).first
    current_user = User.find(jwt_payload['sub'])
    
    if current_user
      render json: {
        status: { code: 200, message: 'Logout realizado com sucesso.' }
      }
    else
      render json: {
        status: { code: 401, message: 'Usuário não encontrado.' }
      }, status: :unauthorized
    end
  rescue JWT::DecodeError
    render json: {
      status: { code: 401, message: 'Token inválido.' }
    }, status: :unauthorized
  end
end
