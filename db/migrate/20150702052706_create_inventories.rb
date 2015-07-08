class CreateInventories < ActiveRecord::Migration
  def change
    create_table :inventories do |t|
      t.integer :user_id
      t.integer :category_id
      t.date :transaction_date
      t.string :product_name
      t.integer :quantity
      t.integer :price
      t.text :product_details
      t.integer :group_id

      t.timestamps null: false
    end
    add_index :inventories, :user_id
    add_index :inventories, :category_id
    add_index :inventories, :group_id
  end
end
