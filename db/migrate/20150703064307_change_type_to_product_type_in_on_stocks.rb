class ChangeTypeToProductTypeInOnStocks < ActiveRecord::Migration
  def change
    rename_column :on_stocks, :type, :product_type
  end
end
