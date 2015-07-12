class Expense < ActiveRecord::Base

  validates :user_id, :cash_borrowed, :cash_beginning, :bank_id, :cash_withdrawal, :cash_on_hand, :purpose, :amount, presence: true
end
