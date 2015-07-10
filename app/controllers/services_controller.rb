class ServicesController < ApplicationController
  def getServices
     @services = Service.all
    
    render json: @services, status: :ok 
  end
end
