class CreateCustomerInfos < ActiveRecord::Migration
  def change
    create_table :customer_infos do |t|
      t.string :fullname
      t.string :contact_no
      t.string :address

      t.timestamps null: false
    end
  end
end
