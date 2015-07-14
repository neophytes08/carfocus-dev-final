class LogsController < ApplicationController

  def getLogs
    logs = Log.all.order("created_at desc").limit(5)

    render json: logs.to_json(:only => ["action","created_at"]) , :status => "success"
  end
end
