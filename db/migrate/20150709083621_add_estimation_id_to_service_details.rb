class AddEstimationIdToServiceDetails < ActiveRecord::Migration
  def change
    add_column :service_details, :estimation_id, :integer
    add_index :service_details, :estimation_id
  end
end
