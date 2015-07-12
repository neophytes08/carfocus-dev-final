class Bank < ActiveRecord::Base

  validates :user_id, :bank_name, :total_cash, presence: true
end
