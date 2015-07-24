class AddServiceAmountToServiceDetails < ActiveRecord::Migration
  def change
    add_column :service_details, :service_amount, :float
  end
end
