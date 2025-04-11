class Api::V1::AppointmentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_appointment, only: [:show, :update, :destroy]
  before_action :authorize_appointment, only: [:show, :update, :destroy]

  def index
    if current_user.patient?
      @appointments = current_user.patient.appointments
    elsif current_user.provider?
      @appointments = current_user.provider.appointments
    else
      return render json: { error: 'Tipo de usuário inválido' }, status: :unauthorized
    end

    @appointments = @appointments.by_status(params[:status]) if params[:status].present?
    
    @appointments = params[:past] == 'true' ? @appointments.past : @appointments.upcoming

    render json: {
      status: { code: 200, message: 'Consultas obtidas com sucesso.' },
      data: { appointments: @appointments.as_json(include: [:patient, :provider]) }
    }
  end

  def show
    render json: {
      status: { code: 200, message: 'Consulta obtida com sucesso.' },
      data: { appointment: @appointment.as_json(include: [:patient, :provider]) }
    }
  end

  def create
    @appointment = Appointment.new(appointment_params)
    
    if current_user.patient?
      @appointment.patient = current_user.patient
    end
    
    provider = Provider.find(appointment_params[:provider_id])
    availability = provider.availabilities.find_by(
      date: appointment_params[:date],
      start_time: appointment_params[:time],
      is_available: true
    )
    
    unless availability
      return render json: {
        status: { code: 422, message: 'Horário não disponível.' }
      }, status: :unprocessable_entity
    end
    
    if @appointment.save
      availability.mark_as_unavailable
      
      render json: {
        status: { code: 201, message: 'Consulta criada com sucesso.' },
        data: { appointment: @appointment.as_json(include: [:patient, :provider]) }
      }, status: :created
    else
      render json: {
        status: { code: 422, message: 'Falha ao criar consulta.' },
        errors: @appointment.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def update
    if @appointment.update(appointment_params)
      render json: {
        status: { code: 200, message: 'Consulta atualizada com sucesso.' },
        data: { appointment: @appointment.as_json(include: [:patient, :provider]) }
      }
    else
      render json: {
        status: { code: 422, message: 'Falha ao atualizar consulta.' },
        errors: @appointment.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    if @appointment.cancel
      render json: {
        status: { code: 200, message: 'Consulta cancelada com sucesso.' }
      }
    else
      render json: {
        status: { code: 422, message: 'Falha ao cancelar consulta.' },
        errors: @appointment.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def set_appointment
    @appointment = Appointment.find(params[:id])
  end

  def authorize_appointment
    unless (current_user.patient? && @appointment.patient.user_id == current_user.id) ||
           (current_user.provider? && @appointment.provider.user_id == current_user.id)
      render json: { error: 'Não autorizado' }, status: :unauthorized
    end
  end

  def appointment_params
    params.require(:appointment).permit(:patient_id, :provider_id, :date, :time, :duration, :service, :status, :notes)
  end
end
