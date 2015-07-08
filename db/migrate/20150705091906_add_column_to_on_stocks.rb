class AddColumnToOnStocks < ActiveRecord::Migration
  def change
    add_column :on_stocks, :product_name, :string
    add_column :on_stocks, :product_details, :text
    add_column :on_stocks, :quantity, :integer
    add_column :on_stocks, :price, :integer
  end
end
