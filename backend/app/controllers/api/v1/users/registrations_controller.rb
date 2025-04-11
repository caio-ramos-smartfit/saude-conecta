class Api::V1::Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    build_resource(sign_up_params)
    
    resource.save
    
    if resource.persisted?
      if resource.active_for_authentication?
        if resource.patient?
          resource.create_patient(patient_params)
        elsif resource.provider?
          resource.create_provider(provider_params)
        end
        
        sign_up(resource_name, resource)
        
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
        expire_data_after_sign_in!
        render json: {
          status: { code: 401, message: 'Conta criada, mas não ativada.' }
        }, status: :unauthorized
      end
    else
      clean_up_passwords resource
      render json: {
        status: { code: 422, message: 'Registro falhou.' },
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :user_type)
  end

  def patient_params
    params.require(:patient).permit(:first_name, :last_name, :phone, :address)
  end

  def provider_params
    params.require(:provider).permit(:organization_name, :contact_name, :specialty, :address, :phone)
  end
end
