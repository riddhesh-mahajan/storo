class Api::V1::UserController < ApplicationController
    def create
        render :json => {:name => "any name"}
    end
end