class AddInventoryIdToDirectPurchases < ActiveRecord::Migration
  def change
    add_column :direct_purchases, :inventory_id, :integer
    add_index :direct_purchases, :inventory_id
  end
end
