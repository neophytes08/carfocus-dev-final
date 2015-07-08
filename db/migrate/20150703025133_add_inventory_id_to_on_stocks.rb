class AddInventoryIdToOnStocks < ActiveRecord::Migration
  def change
    add_column :on_stocks, :inventory_id, :integer
    add_index :on_stocks, :inventory_id
  end
end
