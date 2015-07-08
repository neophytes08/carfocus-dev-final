class RemoveColumnFromProductOrders < ActiveRecord::Migration
  def change
    remove_column :product_orders, :car_brand, :string
    remove_column :product_orders, :or_no, :string
    remove_column :product_orders, :person_incharge, :string
    remove_column :product_orders, :cash_onhand, :string
  end
end
