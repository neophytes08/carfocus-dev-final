class CreatePaymentInsurances < ActiveRecord::Migration
  def change
    create_table :payment_insurances do |t|
      t.integer :payment_id
      t.string :company_name
      t.string :insured_parts
      t.float :amount
      t.boolean :payment_status

      t.timestamps null: false
    end
    add_index :payment_insurances, :payment_id
  end
end
