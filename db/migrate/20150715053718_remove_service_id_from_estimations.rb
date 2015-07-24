class RemoveServiceIdFromEstimations < ActiveRecord::Migration
  def change
    remove_index :estimations, :service_id
    remove_column :estimations, :service_id, :integer
  end
end
