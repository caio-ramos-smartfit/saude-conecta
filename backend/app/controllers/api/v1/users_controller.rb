class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!

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
