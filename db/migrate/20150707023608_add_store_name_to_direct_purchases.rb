class AddStoreNameToDirectPurchases < ActiveRecord::Migration
  def change
    add_column :direct_purchases, :store_name, :string
  end
end
