module Api
  module V1
    module Users
      class MeController < ApplicationController
        include Swagger::Blocks
        
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
      end
    end
  end
end
