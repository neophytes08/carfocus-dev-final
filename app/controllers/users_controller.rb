class UsersController < ApplicationController

  def getUserInfo
    personal_data = []

    info = User.select("*").joins(:user_info)

    info.each do |data|
      personal_data.push(id: data.id, user_id: data.user_id, username: data.username, email: data.email, user_type: data.user_type, firstname: data.firstname, lastname: data.lastname, contact: data.contact, address: data.address)
    end

    render json: personal_data, status: "success"
  end

  def createUser
    user = User.create(email: params[:email], password: params[:password], user_type: params[:user_type])
    
    if user.save
      info = UserInfo.create(user_id: user.id, firstname: params[:firstname], lastname: params[:lastname], contact: params[:contact], address: params[:address])
      info.save

      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Erorr" }
    end
  end

  def deleteUser
      user = User.find_by(id: params[:id])

      if user.destroy
        render :json => { :status => :ok, :message => "Success" }
      else
        render :json => { :status => :error, :message => "Error" }
      end
  end

  def resetUser
    user = User.find_by(id: params[:id])

    if user.update_attributes(password: "password123")
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error" }
    end
  end

  def updateUser
    user = User.find_by(id: params[:id])

    if user.update_attributes(email: params[:email], user_type: params[:user_type])
      info = UserInfo.find_by(user_id: params[:id])
      info.update_attributes(firstname: params[:firstname], lastname: params[:lastname], contact: params[:contact], address: params[:address])
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error" }
    end
  end
end
