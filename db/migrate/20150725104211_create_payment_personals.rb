class CreatePaymentPersonals < ActiveRecord::Migration
  def change
    create_table :payment_personals do |t|
      t.integer :payment_id
      t.string :payment_type
      t.float :amount
      t.boolean :payment_status

      t.timestamps null: false
    end
    add_index :payment_personals, :payment_id
  end
end
