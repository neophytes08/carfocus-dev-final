class ServicesController < ApplicationController
  def index
     @services = Service.all
    
    render json: @services, status: :ok 
  end
end
