class Api::V1::AvailabilitiesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_provider
  before_action :set_availability, only: [:show, :update, :destroy]

  def index
    @availabilities = @provider.availabilities.order(date: :asc, start_time: :asc)
    render json: { data: @availabilities }
  end

  def show
    render json: { data: @availability }
  end

  def create
    @availability = @provider.availabilities.new(availability_params)

    if @availability.save
      render json: { data: @availability }, status: :created
    else
      render json: { errors: @availability.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @availability.update(availability_params)
      render json: { data: @availability }
    else
      render json: { errors: @availability.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @availability.destroy
    head :no_content
  end

  private

  def set_provider
    @provider = if current_user.user_type == 'provider'
                  current_user.provider
                else
                  Provider.find(params[:provider_id])
                end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Provider not found' }, status: :not_found
  end

  def set_availability
    @availability = @provider.availabilities.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Availability not found' }, status: :not_found
  end

  def availability_params
    params.require(:availability).permit(:date, :start_time, :end_time, :is_available, :cost)
  end
end
