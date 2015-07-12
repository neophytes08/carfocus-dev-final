class AddCarBrandToEstimations < ActiveRecord::Migration
  def change
    add_column :estimations, :car_brand, :string
  end
end
