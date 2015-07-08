class ChangeColumnTypeProductOrders < ActiveRecord::Migration
  def change
    rename_column :product_orders, :type, :product_type
  end
end
