Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post '/register', to: 'users/registrations#create'
      
      devise_for :users, 
                 controllers: {
                   sessions: 'api/v1/users/sessions',
                   registrations: 'api/v1/users/registrations'
                 },
                 path: '',
                 path_names: {
                   sign_in: 'login',
                   sign_out: 'logout',
                   registration: 'users'
                 }
      
      resources :users, only: [:show, :update]
      
      get '/auth/me', to: 'users#me'
      
      resources :providers, only: [:index, :show] do
        member do
          get :availability
        end
      end
      
      resources :appointments
    end
  end
end
