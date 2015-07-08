class CreateBanks < ActiveRecord::Migration
  def change
    create_table :banks do |t|
      t.integer :user_id
      t.string :bank_name
      t.integer :total_cash

      t.timestamps null: false
    end
    add_index :banks, :user_id
  end
end
