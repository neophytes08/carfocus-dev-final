class CreateProductOrders < ActiveRecord::Migration
  def change
    create_table :product_orders do |t|
      t.integer :category_id
      t.integer :manufacturer_id
      t.string :product_name
      t.integer :quantity
      t.integer :price
      t.string :product_type
      t.string :product_details
      t.integer :inventory_id

      t.timestamps null: false
    end
    add_index :product_orders, :category_id
    add_index :product_orders, :manufacturer_id
    add_index :product_orders, :inventory_id
  end
end
