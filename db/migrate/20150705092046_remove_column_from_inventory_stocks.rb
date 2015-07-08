class RemoveColumnFromInventoryStocks < ActiveRecord::Migration
  def change
    remove_column :inventory_stocks, :product_name, :string
    remove_column :inventory_stocks, :product_details, :string
    remove_column :inventory_stocks, :quantity, :string
    remove_column :inventory_stocks, :price, :string
  end
end
