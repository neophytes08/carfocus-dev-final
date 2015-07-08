class RemoveColumnFromLogs < ActiveRecord::Migration
  def change
    remove_column :logs, :date, :string
  end
end
