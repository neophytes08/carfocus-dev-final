class CustomerInfo < ActiveRecord::Base

  validates :fullname, :contact_no, :address, presence: true
end
