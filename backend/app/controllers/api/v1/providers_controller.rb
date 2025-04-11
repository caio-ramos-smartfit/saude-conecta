class Api::V1::ProvidersController < ApplicationController
  def index
    @providers = Provider.all
    
    @providers = @providers.by_specialty(params[:specialty]) if params[:specialty].present?

    render json: {
      status: { code: 200, message: 'Profissionais obtidos com sucesso.' },
      data: { providers: @providers.as_json(except: [:user_id], methods: [:user_email]) }
    }
  end

  def show
    @provider = Provider.find(params[:id])
    
    render json: {
      status: { code: 200, message: 'Profissional obtido com sucesso.' },
      data: { provider: @provider.as_json(except: [:user_id], methods: [:user_email]) }
    }
  end

  def availability
    @provider = Provider.find(params[:id])
    
    if params[:date].present?
      @availabilities = @provider.availabilities.available.where(date: params[:date])
    else
      @availabilities = @provider.availabilities.available.upcoming
    end

    render json: {
      status: { code: 200, message: 'Disponibilidades obtidas com sucesso.' },
      data: { availabilities: @availabilities }
    }
  end
end
