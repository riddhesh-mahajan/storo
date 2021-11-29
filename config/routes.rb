Rails.application.routes.draw do
  root to: 'home#index'

  namespace :api do
    namespace :v1 do
      get '/user/login', to: 'user#login'
      post '/user/create', to: 'user#create'

      post '/file/upload', to: 'dashboard#upload'
    end
  end
  
end
