class AddManufacturerIdToDirectPurchases < ActiveRecord::Migration
  def change
    add_column :direct_purchases, :manufacturer_id, :integer
    add_index :direct_purchases, :manufacturer_id
  end
end
