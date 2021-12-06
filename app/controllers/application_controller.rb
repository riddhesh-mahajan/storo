class ApplicationController < ActionController::Base
    $userData = nil
    
    def login_required()
        begin
            token = request.headers["Authorization"]
            decoded_array = JWT.decode(token, hmac_secret, true, { algorithm: 'HS256' })
            payload = decoded_array.first
            $userData = JSON.parse(payload)
        rescue #JWT::VerificationError
            render json: ["Error": "Unauthorized JWT token"], status: :unauthorized
        end
    end

    def hmac_secret
        return ENV["JWT_SECRET"]
    end
end
