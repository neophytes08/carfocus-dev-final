class ChangeColumnStockIdToOnStockIdInInventoryStocks < ActiveRecord::Migration
  def change
    rename_column :inventory_stocks, :stock_id, :on_stock_id
  end
end
