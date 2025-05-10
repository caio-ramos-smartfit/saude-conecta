class Api::V1::Users::SessionsController < Devise::SessionsController
  respond_to :json

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
    jwt_payload = JWT.decode(request.headers['Authorization'].split(' ')[1], 'supersecretkey123').first
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
