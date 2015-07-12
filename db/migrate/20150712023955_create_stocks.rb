class CreateStocks < ActiveRecord::Migration
  def change
    create_table :stocks do |t|
      t.integer :inventory_id
      t.integer :category_id
      t.string :product_name
      t.string :product_details
      t.float :price
      t.integer :quantity
      t.string :classification_table

      t.timestamps null: false
    end
    add_index :stocks, :inventory_id
    add_index :stocks, :category_id
  end
end
