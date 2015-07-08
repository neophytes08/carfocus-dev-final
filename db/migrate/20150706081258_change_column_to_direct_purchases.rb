class ChangeColumnInDirectPurchases < ActiveRecord::Migration
  def self.up
    change_column :direct_purchases, :product_name, :string
  end
 
  def self.down
    change_column :direct_purchases, :product_name, :integer
  end
end
