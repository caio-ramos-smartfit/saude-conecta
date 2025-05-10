class Api::V1::RegistrationsController < Devise::RegistrationsController
  include Swagger::Blocks
  respond_to :json

  swagger_path '/register' do
    operation :post do
      key :summary, 'Registra um novo usuário'
      key :description, 'Endpoint para registro de novos usuários'
      key :tags, ['authentication']
      
      parameter do
        key :name, :user
        key :in, :body
        key :description, 'Dados do usuário'
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
            property :password_confirmation do
              key :type, :string
              key :example, 'senha123'
            end
            property :user_type do
              key :type, :string
              key :example, 'provider'
            end
            property :provider_profile_attributes do
              key :type, :object
              property :organization_name do
                key :type, :string
                key :example, 'Clínica Exemplo'
              end
              property :contact_name do
                key :type, :string
                key :example, 'Dr. Exemplo'
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
      
      response 200 do
        key :description, 'Registro realizado com sucesso'
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
              key :example, 'Registro realizado com sucesso.'
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
      
      response 422 do
        key :description, 'Erro de validação'
        schema do
          key :type, :object
          property :status do
            key :type, :object
            property :code do
              key :type, :integer
              key :example, 422
            end
            property :message do
              key :type, :string
              key :example, 'Erro de validação.'
            end
          end
          property :errors do
            key :type, :object
            property :email do
              key :type, :array
              items do
                key :type, :string
                key :example, 'já está em uso'
              end
            end
          end
        end
      end
    end
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: { code: 200, message: 'Registro realizado com sucesso.' },
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
        status: { code: 422, message: 'Erro de validação.' },
        errors: resource.errors
      }, status: :unprocessable_entity
    end
  end
end
