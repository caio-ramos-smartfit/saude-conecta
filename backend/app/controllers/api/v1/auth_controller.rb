class Api::V1::AuthController < ApplicationController
  include Swagger::Blocks
  respond_to :json
  
  skip_before_action :authenticate_user!, only: [:login, :register]
  
  swagger_path '/api/v1/login' do
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

  def login
    Rails.logger.debug "Login request received: #{params.inspect}"
    
    user = User.find_for_authentication(email: login_params[:email])
    
    if user && user.valid_password?(login_params[:password])
      sign_in(user)
      token = generate_jwt_token(user)
      
      Rails.logger.debug "User authenticated: #{user.inspect}"
      Rails.logger.debug "JWT token: #{token}"
      
      render json: {
        status: { code: 200, message: 'Login realizado com sucesso.' },
        data: {
          user: {
            id: user.id,
            email: user.email,
            user_type: user.user_type
          },
          token: token
        }
      }
    else
      Rails.logger.error "Login failed: Invalid credentials"
      render json: {
        status: { code: 401, message: 'Credenciais inválidas.' }
      }, status: :unauthorized
    end
  end

  def logout
    sign_out(current_user)
    render json: {
      status: { code: 200, message: 'Logout realizado com sucesso.' }
    }
  end

  private

  def login_params
    params.require(:user).permit(:email, :password)
  end

  def generate_jwt_token(user)
    JWT.encode(
      { sub: user.id, exp: 24.hours.from_now.to_i },
      Rails.application.credentials.secret_key_base || 'supersecretkey123'
    )
  end
end
