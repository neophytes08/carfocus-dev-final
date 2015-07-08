class CreateExpenses < ActiveRecord::Migration
  def change
    create_table :expenses do |t|
      t.integer :user_id
      t.integer :cash_borrowed
      t.integer :cash_beginning
      t.integer :bank_id
      t.integer :cash_withdrawal
      t.integer :cash_on_hand
      t.text :purpose
      t.integer :amount
      t.integer :group_id

      t.timestamps null: false
    end
    add_index :expenses, :user_id
    add_index :expenses, :bank_id
    add_index :expenses, :group_id
  end
end
