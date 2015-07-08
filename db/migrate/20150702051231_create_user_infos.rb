class CreateUserInfos < ActiveRecord::Migration
  def change
    create_table :user_infos do |t|
      t.integer :user_id
      t.string :firstname
      t.string :lastname
      t.string :address
      t.string :contact

      t.timestamps null: false
    end
    add_index :user_infos, :user_id
  end
end
