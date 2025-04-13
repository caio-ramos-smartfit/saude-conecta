class Api::V1::UsersController < ApplicationController
  include Swagger::Blocks
  before_action :authenticate_user!

  swagger_path '/auth/me' do
    operation :get do
      key :summary, 'Retorna os dados do usuário autenticado'
      key :description, 'Retorna os dados do usuário autenticado com base no token JWT'
      key :tags, ['users']
      
      security do
        key :Bearer, []
      end
      
      response 200 do
        key :description, 'Dados do usuário obtidos com sucesso'
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
              key :example, 'Dados do usuário obtidos com sucesso.'
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
              property :profile do
                key :type, :object
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
      end
      
      response 401 do
        key :description, 'Não autorizado'
        schema do
          key :type, :object
          property :error do
            key :type, :string
            key :example, 'Não autorizado'
          end
        end
      end
    end
  end

  def me
    user_data = {
      id: current_user.id,
      email: current_user.email,
      user_type: current_user.user_type
    }

    if current_user.patient?
      user_data[:profile] = {
        id: current_user.patient.id,
        first_name: current_user.patient.first_name,
        last_name: current_user.patient.last_name,
        phone: current_user.patient.phone,
        address: current_user.patient.address
      }
    elsif current_user.provider?
      user_data[:profile] = {
        id: current_user.provider.id,
        organization_name: current_user.provider.organization_name,
        contact_name: current_user.provider.contact_name,
        specialty: current_user.provider.specialty,
        address: current_user.provider.address,
        phone: current_user.provider.phone
      }
    end

    render json: {
      status: { code: 200, message: 'Dados do usuário obtidos com sucesso.' },
      data: { user: user_data }
    }
  end
end
