class CreateInventories < ActiveRecord::Migration
  def change
    create_table :inventories do |t|
      t.datetime :transaction_date

      t.timestamps null: false
    end
  end
end
