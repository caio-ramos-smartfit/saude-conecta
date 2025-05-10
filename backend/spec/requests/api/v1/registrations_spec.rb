require 'rails_helper'
require 'swagger_helper'

RSpec.describe "Api::V1::Registrations", type: :request do
  path '/api/v1/register' do
    post 'Registra um novo usuário' do
      tags 'Autenticação'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string, example: 'usuario@exemplo.com' },
              password: { type: :string, example: 'senha123' },
              password_confirmation: { type: :string, example: 'senha123' },
              user_type: { type: :string, example: 'provider' },
              provider_profile_attributes: {
                type: :object,
                properties: {
                  organization_name: { type: :string, example: 'Clínica Exemplo' },
                  contact_name: { type: :string, example: 'Dr. Exemplo' },
                  specialty: { type: :string, example: 'Cardiologia' },
                  address: { type: :string, example: 'Rua Exemplo, 123' },
                  phone: { type: :string, example: '(11) 99999-9999' }
                }
              }
            },
            required: ['email', 'password', 'password_confirmation', 'user_type']
          }
        }
      }
      
      response '200', 'Registro realizado com sucesso' do
        schema type: :object,
          properties: {
            status: {
              type: :object,
              properties: {
                code: { type: :integer, example: 200 },
                message: { type: :string, example: 'Registro realizado com sucesso.' }
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
                    user_type: { type: :string, example: 'provider' }
                  }
                },
                token: { type: :string, example: 'eyJhbGciOiJIUzI1NiJ9...' }
              }
            }
          }
        
        let(:user) do
          {
            user: {
              email: 'test@example.com',
              password: 'password123',
              password_confirmation: 'password123',
              user_type: 'provider',
              provider_profile_attributes: {
                organization_name: 'Clínica Teste',
                contact_name: 'Dr. Teste',
                specialty: 'Cardiologia',
                address: 'Rua Teste, 123',
                phone: '(11) 99999-9999'
              }
            }
          }
        end
        run_test!
      end
      
      response '422', 'Erro de validação' do
        schema type: :object,
          properties: {
            status: {
              type: :object,
              properties: {
                code: { type: :integer, example: 422 },
                message: { type: :string, example: 'Erro de validação.' }
              }
            },
            errors: {
              type: :object,
              properties: {
                email: {
                  type: :array,
                  items: {
                    type: :string,
                    example: 'já está em uso'
                  }
                }
              }
            }
          }
        
        let(:user) do
          {
            user: {
              email: 'invalid@example',
              password: 'short',
              password_confirmation: 'different',
              user_type: 'invalid'
            }
          }
        end
        run_test!
      end
    end
  end
end
