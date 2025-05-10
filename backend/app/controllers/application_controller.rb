class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  respond_to :json
  
  before_action :configure_permitted_parameters, if: :devise_controller?
  
  def authenticate_user!
    Rails.logger.debug "Autenticando usuário..."
    Rails.logger.debug "Headers: #{request.headers.to_h.select { |k, _| k.start_with?('HTTP_') }}"
    
    if request.headers['Authorization'].present?
      Rails.logger.debug "Token presente: #{request.headers['Authorization']}"
    else
      Rails.logger.debug "Token não encontrado no cabeçalho Authorization"
    end
    
    super
  rescue => e
    Rails.logger.error "Erro na autenticação: #{e.message}"
    render json: { error: 'Não autorizado' }, status: :unauthorized
  end
  
  protected
  
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation, :user_type])
    
    if params[:user] && params[:user][:provider_profile_attributes]
      devise_parameter_sanitizer.permit(:sign_up, keys: [
        provider_profile_attributes: [
          :organization_name, :contact_name, :specialty, :address, :phone
        ]
      ])
    end
  end
end
