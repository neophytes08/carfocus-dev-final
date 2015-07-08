class CreateInsuranceCompanies < ActiveRecord::Migration
  def change
    create_table :insurance_companies do |t|
      t.string :name
      t.string :insured_parts
      t.integer :amount

      t.timestamps null: false
    end
  end
end
