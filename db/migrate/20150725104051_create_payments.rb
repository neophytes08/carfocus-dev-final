class CreatePayments < ActiveRecord::Migration
  def change
    create_table :payments do |t|
      t.integer :customer_id
      t.integer :estimation_id
      t.string :payment_method

      t.timestamps null: false
    end
    add_index :payments, :customer_id
    add_index :payments, :estimation_id
  end
end
