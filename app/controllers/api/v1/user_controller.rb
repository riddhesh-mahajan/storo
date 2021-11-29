class Api::V1::UserController < ActionController::API
    def create
        @user = User.new(user_params)

        if @user.save
            render json: @user, status: :created
        else
            render json: @user.errors, status: :unprocessable_entity
        end
    end

    def login
        @matchedUser = User.find_by(email: params['email'], password: params['password'])

        if @matchedUser
            render json: @matchedUser, status: :ok
        else
            render json: {}, status: :forbidden
        end
    end

    private
    def user_params
        params.permit(:first_name, :last_name, :email, :password)
        end

end