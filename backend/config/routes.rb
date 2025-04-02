Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  devise_scope :user do
    get '/users' => 'users/registrations#index'
    get '/user/:id' => 'users/registrations#show'
    patch '/user/:id' => 'users/registrations#update'
  end

  devise_for :users, path: '', path_names: {
                                 sign_in: 'login',
                                 sign_out: 'logout',
                                 registration: 'signup'
                               },
                     controllers: {
                       registrations: 'users/registrations',
                       sessions: 'users/sessions'
                     },
                     default: {
                       format: :json
                     }

  resources :messages, only: %i[create index]
end
