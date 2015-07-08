class RemoveColumnFromInventories < ActiveRecord::Migration
  def change
    remove_column :inventories, :product_type, :string
  end
end
