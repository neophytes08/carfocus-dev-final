class AddInventoryIdToProductOrders < ActiveRecord::Migration
  def change
    add_column :product_orders, :inventory_id, :integer
    add_index :product_orders, :inventory_id
  end
end
