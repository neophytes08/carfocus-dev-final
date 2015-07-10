class CreateServiceDetails < ActiveRecord::Migration
  def change
    create_table :service_details do |t|
      t.string :service_id
      t.string :service_details
      t.integer :price
      t.integer :customer_id

      t.timestamps null: false
    end
    add_index :service_details, :service_id
    add_index :service_details, :customer_id
  end
end
