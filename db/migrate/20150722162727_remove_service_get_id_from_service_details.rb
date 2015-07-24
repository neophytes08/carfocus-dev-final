class RemoveServiceGetIdFromServiceDetails < ActiveRecord::Migration
  def change
    remove_index :service_details, :service_get_id
    remove_column :service_details, :service_get_id, :string
  end
end
