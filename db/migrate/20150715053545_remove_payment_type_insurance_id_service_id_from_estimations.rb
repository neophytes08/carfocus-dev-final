class RemovePaymentTypeInsuranceIdServiceIdFromEstimations < ActiveRecord::Migration
  def change
    remove_column :estimations, :payment_type, :string
    remove_index :estimations, :insurance_id
    remove_column :estimations, :insurance_id, :string
  end
end
