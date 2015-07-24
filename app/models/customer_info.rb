class CustomerInfo < ActiveRecord::Base
  belongs_to :estimation
  validates :fullname, :contact_no, :address, presence: true
end
