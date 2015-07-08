class CreateInventoryStocks < ActiveRecord::Migration
  def change
    create_table :inventory_stocks do |t|
      t.integer :inventory_id
      t.integer :stock_id

      t.timestamps null: false
    end
    add_index :inventory_stocks, :inventory_id
    add_index :inventory_stocks, :stock_id
  end
end
