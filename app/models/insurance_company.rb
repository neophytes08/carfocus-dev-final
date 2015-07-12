class InsuranceCompany < ActiveRecord::Base

  validates :name, :insured_parts, :amount, presence: true
end
