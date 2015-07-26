class EstimationsController < ApplicationController
  def index
  end

  def submitEstimation

    if params[:customer_exist] == true
      puts User.current_user

      job = Estimation.create(user_id: current_user.id, customer_id: params[:id], car_model: params[:car_model], car_brand: params[:car_brand], plate_no: params[:plate_no], color: params[:color], chasis_no: params[:chasis_no], engine_type: params[:engine_type], approved: false, job_status: false)
      
      if job.save
        payment = Payment.create(customer_id: params[:id], estimation_id: job.id, payment_method: "personal")
        payment.save
        customer = CustomerInfo.find_by(id: params[:id])

        logs = Log.create(action: current_user.user_info.firstname.titleize + " added a job order with customer " + customer.fullname.titleize);
        logs.save
        render :json => { :status => :ok, :message => "Success" }
      else
        render :json => { :status => :err, :message => "Error" }
      end

    elsif params[:customer_exist] == false
      customer_info = CustomerInfo.create(fullname: params[:fullname].downcase, address: params[:address], contact_no: params[:contact_no])
      customer_info.save

      job = Estimation.create(user_id: current_user.id, customer_id: customer_info.id, car_model: params[:car_model], car_brand: params[:car_brand], plate_no: params[:plate_no], color: params[:color], chasis_no: params[:chasis_no], engine_type: params[:engine_type], approved: false, job_status: false)
          
      if job.save
        payment = Payment.create(customer_id: customer_info.id, estimation_id: job.id, payment_method: "personal")
        payment.save
        logs = Log.create(action: current_user.user_info.firstname.titleize + " added a job order with customer " + customer_info.fullname.titleize);
        logs.save
        render :json => { :status => :ok, :message => "Success" }
      else
        render :json => { :status => :err, :message => "Error" }
      end
    end
  end


  def saveServiceDetails
    estimation = Estimation.last
    details = ServiceDetail.create(estimation_id: estimation.id, service_id: params[:service_id], service_description: params[:service_description], service_amount: params[:serviceAmount])

    if details.save
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error" }
    end
  end

  def savePartNeeds
    estimation = Estimation.last

    parts = PartNeed.create(estimation_id: estimation.id, stock_id: params[:id], product_details: params[:product_details], product_name: params[:product_name], quantity: params[:selectedAmountQuantity], price: params[:price])

    if parts.save
      get_stock = Stock.find_by_id(params[:id]);
      updated_stock = get_stock.quantity - params[:selectedAmountQuantity];
      puts get_stock.to_json

      if get_stock.quantity > 0
          if get_stock.update_attributes(:quantity => updated_stock)
            render :json => { :status => :ok, :message => "Success" }
          else
            render :json => { :status => :error, :message => "Error" }
          end
      else
        render :json => { :status => :error, :message => "Error" }
      end
      
      
    else
      render :json => { :status => :error, :message => "Error" }
    end
  end

  def getEstimationList
    job = ActiveRecord::Base.connection.select_all("select a.id as estimation_id, a.customer_id, a.car_model, a.plate_no, a.car_brand, a.approved, a.job_status, a.created_at, b.fullname from estimations a inner join customer_infos b on b.id = a.customer_id and a.approved = 'false'")

    render json: job, :status => "succes"
  end

  def readyForJobOrder
    job = Estimation.find_by(id: params[:id])

    if job.update_attributes(:approved => true)
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error" }
    end
  end

  def deleteEstimation
    estimation = Estimation.find_by(id: params[:id])

    if estimation.destroy
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error" }
    end
  end
end
