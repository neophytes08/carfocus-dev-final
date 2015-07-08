class ChangeColumnDataTypeInDirectPurchases < ActiveRecord::Migration
  def up
   change_column :direct_purchases, :price, :integer
   change_column :direct_purchases, :quantity, :integer
  end

  def down
   change_column :direct_purchases, :price, :string
   change_column :direct_purchases, :quantity, :string
  end
end
