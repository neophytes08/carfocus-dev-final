class ManufacturersController < ApplicationController

  def submitManufacturer
    manufacturer = Manufacturer.create(name: params[:name].titleize, address: params[:address], contact_no: params[:contact_no])

    if manufacturer.save
      logs = Log.create(user_id: current_user.id, action: current_user.user_info.firstname.titleize + " added a Manufacturer " + params[:name].titleize + ".")
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error" }
    end
  end

  def getManufacturerList
    manufacturer = Manufacturer.all.order("created_at asc")
    render json: manufacturer, status: :ok
  end

  def updateManufacturer
    manufacturer = Manufacturer.find_by(id: params[:id])

    if manufacturer.update_attributes(name: params[:name], address: params[:address], contact_no: params[:contact_no])
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error" }
    end
  end
end
