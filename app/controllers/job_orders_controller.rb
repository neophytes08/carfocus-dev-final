class JobOrdersController < ApplicationController
  
  def showJobOrder
    job = ActiveRecord::Base.connection.select_all("select a.id as estimation_id, a.customer_id, a.car_model, a.plate_no, a.car_brand, a.approved, a.job_status, a.created_at, b.fullname from estimations a inner join customer_infos b on b.id = a.customer_id and a.approved = 'true'")

    render json: job, :status => "succes"    
  end

  def jobDone
    job = Estimation.find_by(id: params[:id])

    if job.update_attributes(:job_status => true)
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error" }
    end
  end

  def jobUnDone
    job = Estimation.find_by(id: params[:id])

    if job.update_attributes(:job_status => false)
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error" }
    end
  end
end
