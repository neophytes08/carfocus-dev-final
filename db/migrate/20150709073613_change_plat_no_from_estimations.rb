class ChangePlatNoFromEstimations < ActiveRecord::Migration
  def change
    rename_column :estimations, :plat_no, :plate_no
  end
end
