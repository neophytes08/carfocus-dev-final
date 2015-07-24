class AddEngineTypeChasisNumberToEstimation < ActiveRecord::Migration
  def change
    add_column :estimations, :engine_type, :string
    add_column :estimations, :chasis_no, :string
  end
end
