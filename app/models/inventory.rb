class Inventory < ActiveRecord::Base

  validates :transaction_date, presence: true
end
