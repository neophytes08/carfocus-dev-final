class RemoveManufacturerIdFromDirectPurchases < ActiveRecord::Migration
  def change
    remove_column :direct_purchases, :manufacturer_id, :string
  end
end
