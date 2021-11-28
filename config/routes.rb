Rails.application.routes.draw do
  root to: 'home#index'

  namespace :api do
    namespace :v1 do
      post '/user/create', to: 'user#create'
    end
  end
  
end
