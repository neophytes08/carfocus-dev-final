class AddColumnToProductOrders < ActiveRecord::Migration
  def change
    add_column :product_orders, :or_no, :string
    add_column :product_orders, :person_incharge, :string
    add_column :product_orders, :cash_onhand, :integer
    add_column :product_orders, :product_name, :string
    add_column :product_orders, :quantity, :integer
    add_column :product_orders, :price, :integer
    add_column :product_orders, :car_model, :string
  end
end
