class Service < ActiveRecord::Base

  has_many :service_details
  # validates :service_name, presence: true
end
