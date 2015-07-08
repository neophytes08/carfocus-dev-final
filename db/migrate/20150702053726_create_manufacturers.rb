class CreateManufacturers < ActiveRecord::Migration
  def change
    create_table :manufacturers do |t|
      t.string :name
      t.string :address
      t.string :contact_no

      t.timestamps null: false
    end
  end
end
