class CreateEstimations < ActiveRecord::Migration
  def change
    create_table :estimations do |t|
      t.integer :user_id
      t.integer :customer_id
      t.string :payment_type
      t.string :car_model
      t.string :plat_no
      t.string :color
      t.integer :insurance_id
      t.integer :service_id
      t.text :service_details
      t.boolean :approved

      t.timestamps null: false
    end
    add_index :estimations, :user_id
    add_index :estimations, :customer_id
    add_index :estimations, :insurance_id
    add_index :estimations, :service_id
  end
end
