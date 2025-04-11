class Provider < ApplicationRecord
  belongs_to :user
  has_many :appointments, dependent: :destroy
  has_many :availabilities, dependent: :destroy
  
  validates :organization_name, presence: true
  validates :contact_name, presence: true
  validates :specialty, presence: true
  
  scope :by_specialty, ->(specialty) { where(specialty: specialty) if specialty.present? }
  
  def available_slots(date = nil)
    query = availabilities.where(is_available: true)
    query = query.where(date: date) if date.present?
    query
  end
end
