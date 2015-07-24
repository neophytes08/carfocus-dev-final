class UserInfosController < ApplicationController
  def index
  end

  def settings
    @user_id = current_user.id
    # @user = ActiveRecord::Base.connection.select_all("select * from users a inner join user_infos b on b.user_id = a.id && a.id = #{@user_id} ")
    # @user = User.joins(:user_info).where(id: current_user.id)
    @user = UserInfo.find_by(user_id: current_user.id)
  end

  def update
    @user_info = UserInfo.find(params[:id])
      if @user_info.update(profile_params)
        redirect_to users_path
      else
        redirect_to users_settings_path
      end
  end

   private
  def profile_params
    params.require(:user_info).permit(:firstname, :lastname, :contact, :address, :image)
  end
end
