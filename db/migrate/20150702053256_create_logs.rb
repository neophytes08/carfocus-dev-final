class CreateLogs < ActiveRecord::Migration
  def change
    create_table :logs do |t|
      t.integer :user_id
      t.string :action
      t.date :date

      t.timestamps null: false
    end
    add_index :logs, :user_id
  end
end
