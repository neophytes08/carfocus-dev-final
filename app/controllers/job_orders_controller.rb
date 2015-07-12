class JobOrdersController < ApplicationController
  

  def submitJobOrder
    # customer = CustomerInfo.where(fullname: params[:fullname])any?

    if params[:customer_exist] == true
      job = Estimation.create(user_id: current_user.id, customer_id: customer_id.id, payment_type: params[:payment_type], car_model: params[:car_model], plate_no: params[:plate_no], color: params[:color], insurance_id: params[:insurance_id], service_id: params[:service_id], approved: false)
      job.save

      service_detail = ServiceDetail.create([{service_id: params[:service_id], service_details: params[:service_details], price: params[:price], customer_id: params[:customer_id], estimation_id: job.id}])

    elsif params[:customer_exist] == false
      customer_info = CustomerInfo.create(fulllname: params[:fullname].downcase, address: params[:address], contact_no: params[:contact_no])
      customer.save

      job = Estimation.create(user_id: current_user.id, customer_id: customer.id, payment_type: params[:payment_type], car_model: params[:car_model], plate_no: params[:plate_no], color: params[:color], insurance_id: params[:insurance_id], service_id: params[:service_id], approved: false)
      job.save

      service_detail = ServiceDetail.create([{service_id: params[:service_id], service_details: params[:service_details], price: params[:price], customer_id: customer.id, estimation_id: job.id}])
    end
    
    if service_detail
      logs = Log.create(action: current_user.user_type.titleize + "added a job order with customer");
      logs.save
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :err, :message => "Error" }
    end
  end
end
