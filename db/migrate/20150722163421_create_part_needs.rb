class CreatePartNeeds < ActiveRecord::Migration
  def change
    create_table :part_needs do |t|
      t.integer :estimation_id
      t.integer :stock_id
      t.string :product_details
      t.string :product_name
      t.integer :quantity
      t.float :price

      t.timestamps null: false
    end
    add_index :part_needs, :estimation_id
    add_index :part_needs, :stock_id
  end
end
