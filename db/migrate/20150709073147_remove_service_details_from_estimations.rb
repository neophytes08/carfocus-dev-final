class RemoveServiceDetailsFromEstimations < ActiveRecord::Migration
  def change
    remove_column :estimations, :service_details, :string
  end
end
