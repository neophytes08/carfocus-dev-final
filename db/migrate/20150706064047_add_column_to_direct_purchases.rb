class AddColumnToDirectPurchases < ActiveRecord::Migration
  def change
    add_column :direct_purchases, :price, :integer
    add_column :direct_purchases, :quantity, :integer
    add_column :direct_purchases, :car_model, :string
    add_column :direct_purchases, :car_brand, :string
  end
end
