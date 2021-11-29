class Api::V1::DashboardController < ActionController::API
    def upload
        
        render json: {}, status: :created
        
    end
end
