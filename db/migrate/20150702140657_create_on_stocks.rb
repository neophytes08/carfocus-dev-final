class CreateOnStocks < ActiveRecord::Migration
  def change
    create_table :on_stocks do |t|
      t.integer :category_id
      t.string :type

      t.timestamps null: false
    end
    add_index :on_stocks, :category_id
  end
end
