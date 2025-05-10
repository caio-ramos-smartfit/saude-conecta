require 'rails_helper'
require 'swagger_helper'

RSpec.describe "Api::V1::Users", type: :request do
  path '/api/v1/auth/me' do
    get 'Retorna os dados do usuário autenticado' do
      tags 'Usuários'
      produces 'application/json'
      security [Bearer: []]
      
      response '200', 'Dados do usuário obtidos com sucesso' do
        schema type: :object,
          properties: {
            status: {
              type: :object,
              properties: {
                code: { type: :integer, example: 200 },
                message: { type: :string, example: 'Dados do usuário obtidos com sucesso.' }
              }
            },
            data: {
              type: :object,
              properties: {
                user: {
                  type: :object,
                  properties: {
                    id: { type: :integer, example: 1 },
                    email: { type: :string, example: 'usuario@exemplo.com' },
                    user_type: { type: :string, example: 'provider' },
                    profile: {
                      type: :object,
                      properties: {
                        id: { type: :integer, example: 1 },
                        organization_name: { type: :string, example: 'Clínica Exemplo' },
                        contact_name: { type: :string, example: 'Dr. Exemplo' },
                        specialty: { type: :string, example: 'Cardiologia' },
                        address: { type: :string, example: 'Rua Exemplo, 123' },
                        phone: { type: :string, example: '(11) 99999-9999' }
                      }
                    }
                  }
                }
              }
            }
          }
        
        let(:Authorization) { 'Bearer eyJhbGciOiJIUzI1NiJ9...' }
        run_test!
      end
      
      response '401', 'Não autorizado' do
        schema type: :object,
          properties: {
            error: { type: :string, example: 'Não autorizado' }
          }
        
        let(:Authorization) { 'Bearer invalid_token' }
        run_test!
      end
    end
  end
end
