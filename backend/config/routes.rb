Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get '/api-docs', to: 'rswag/ui#index'
  get '/swagger.json', to: 'api/v1/swagger#json'

  namespace :api do
    namespace :v1 do
      devise_scope :user do
        post '/register', to: 'registrations#create'
        post '/login', to: 'sessions#create'
        delete '/logout', to: 'sessions#destroy'
      end
      
      post '/api/v1/login', to: 'api/v1/sessions#create'
      
      devise_for :users, 
                 controllers: {
                   sessions: 'api/v1/sessions',
                   registrations: 'api/v1/registrations'
                 },
                 path: '',
                 path_names: {
                   sign_in: 'login',
                   sign_out: 'logout',
                   registration: 'users'
                 },
                 skip: [:sessions, :registrations]
      
      resources :users, only: [:show, :update]
      
      get '/auth/me', to: 'users#me'
      
      resources :providers, only: [:index, :show] do
        member do
          get :availability
        end
        resources :availabilities
      end
      
      resources :appointments
    end
  end
end
