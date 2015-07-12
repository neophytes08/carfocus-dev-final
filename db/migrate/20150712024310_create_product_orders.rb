class CreateProductOrders < ActiveRecord::Migration
  def change
    create_table :product_orders do |t|
      t.integer :stock_id
      t.integer :manufacturer_id
      t.string :product_type

      t.timestamps null: false
    end
    add_index :product_orders, :stock_id
    add_index :product_orders, :manufacturer_id
  end
end
