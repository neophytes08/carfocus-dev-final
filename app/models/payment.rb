class Payment < ActiveRecord::Base

  has_many :payment_insurances, dependent: :destroy
  has_many :payment_personals, dependent: :destroy
end
