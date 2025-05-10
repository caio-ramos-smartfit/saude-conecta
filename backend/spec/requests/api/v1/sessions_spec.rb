require 'rails_helper'
require 'swagger_helper'

RSpec.describe "Api::V1::Sessions", type: :request do
  path '/api/v1/login' do
    post 'Autentica um usuário' do
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
              password: { type: :string, example: 'senha123' }
            },
            required: ['email', 'password']
          }
        }
      }
      
      response '200', 'Login realizado com sucesso' do
        schema type: :object,
          properties: {
            status: {
              type: :object,
              properties: {
                code: { type: :integer, example: 200 },
                message: { type: :string, example: 'Login realizado com sucesso.' }
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
        
        let(:user) { { user: { email: 'test@example.com', password: 'password123' } } }
        run_test!
      end
      
      response '401', 'Credenciais inválidas' do
        schema type: :object,
          properties: {
            status: {
              type: :object,
              properties: {
                code: { type: :integer, example: 401 },
                message: { type: :string, example: 'Credenciais inválidas.' }
              }
            }
          }
        
        let(:user) { { user: { email: 'wrong@example.com', password: 'wrongpassword' } } }
        run_test!
      end
    end
  end
end
