class CreateDirectPurchases < ActiveRecord::Migration
  def change
    create_table :direct_purchases do |t|
      t.integer :stock_id
      t.string :or_no
      t.string :in_charge
      t.float :cash_onhand
      t.string :store_name

      t.timestamps null: false
    end
    add_index :direct_purchases, :stock_id
  end
end
