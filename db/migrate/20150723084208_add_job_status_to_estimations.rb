class AddJobStatusToEstimations < ActiveRecord::Migration
  def change
    add_column :estimations, :job_status, :boolean
  end
end
