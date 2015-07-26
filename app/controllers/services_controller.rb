class ServicesController < ApplicationController
  def getServices
     @services = Service.all
    
    render json: @services, status: :ok 
  end


  def showCustomerServices
    estimation_id = params[:id]
    serve = ActiveRecord::Base.connection.select_all("select a.id as service_detail_id, a.service_id,a.service_description,service_amount,b.service_name from service_details a inner join services b on b.id = a.service_id and a.estimation_id = #{estimation_id}")

    render json: serve, :status => "success"
  end

  def createService
    service = Service.create(service_name: params[:service_name])

    if service.save
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :ok, :message => "Success" }
    end
  end

  def updateService
    service = Service.find_by(id: params[:id])

    if service.update_attributes(service_name: params[:service_name])
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error" }
    end
  end

  def deleteService
    service = Service.find_by(id: params[:id])

    if service.destroy
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error" }
    end
  end
end
