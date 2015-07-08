class ChangeColumnTypeToInventories < ActiveRecord::Migration
  def change
     rename_column :inventories, :type, :product_type
  end
end
