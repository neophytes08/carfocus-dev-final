class CreateServiceDetails < ActiveRecord::Migration
  def change
    create_table :service_details do |t|
      t.integer :service_get_id
      t.integer :service_id
      t.string :service_description

      t.timestamps null: false
    end
    add_index :service_details, :service_get_id
    add_index :service_details, :service_id
  end
end
