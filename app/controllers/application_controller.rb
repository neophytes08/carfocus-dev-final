class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  before_filter :cors_preflight
  after_filter :cors_set_access_control_headers
  before_filter :set_current_user

  def index
    
  end

  def set_current_user
    User.current_user = current_user
  end

  def cors_set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    headers['Access-Control-Allow-Headers'] = '*'    
  end

  def cors_preflight 
    if request.method == :options
      render json: { status: "success" } , status: :ok
    end
  end
end
