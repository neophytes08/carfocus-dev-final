class DirectPurchase < ActiveRecord::Base
  belongs_to :stocks
  # validates :stock_id, :or_no, :in_charge, :cash_onhand, :store_name, presence: true
end
