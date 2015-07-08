class AddColumnToInventoryStocks < ActiveRecord::Migration
  def change
    add_column :inventory_stocks, :product_name, :string
    add_column :inventory_stocks, :product_details, :text
    add_column :inventory_stocks, :quantity, :integer
    add_column :inventory_stocks, :price, :integer
  end
end
