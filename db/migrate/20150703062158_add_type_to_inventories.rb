class AddTypeToInventories < ActiveRecord::Migration
  def change
    add_column :inventories, :type, :string
  end
end
