class CustomersController < ApplicationController
  def index
  end

  def show
  end

  def getCustomerInfo
    customer = CustomerInfo.all.order("created_at asc")

    render json: customer, status: :ok
  end

  def submitCustomerInfo
    customer = CustomerInfo.create(fullname: params[:fullname], address: params[:address], contact_no: params[:contact_no])

    if customer.save
      logs = Logs.create(action: current_user.user_type + "added a customer " + params[:fullname].titleize + " at " + Date.today.to_datetime + " .")
      logs.save

      render json: {status: :ok, message: "Success!"}
    else
      render json: {status: :error, message: "Error!"}
    end
  end

  private

  def customer_params
    params.require(:customer).permit(:fullname, :address, :contact_no)
  end
end
