class UsersController < ApplicationController

  def getUserInfo
    personal_data = []

    info = User.select("*").joins(:user_info)

    info.each do |data|
      personal_data.push(user_id: data.user_id, username: data.username, email: data.email, user_type: data.user_type, firstname: data.firstname, lastname: data.lastname)
    end

    render json: personal_data, status: "success"
  end
end
