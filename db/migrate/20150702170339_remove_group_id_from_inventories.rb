class RemoveGroupIdFromInventories < ActiveRecord::Migration
  def change
    remove_index :inventories, :group_id
    remove_column :inventories, :group_id, :integer
  end
end
