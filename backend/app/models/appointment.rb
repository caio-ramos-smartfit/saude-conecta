class Appointment < ApplicationRecord
  belongs_to :patient
  belongs_to :provider
  
  validates :date, presence: true
  validates :time, presence: true
  validates :duration, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :service, presence: true
  validates :status, presence: true, inclusion: { in: ['pending', 'confirmed', 'cancelled', 'completed'] }
  
  scope :upcoming, -> { where('date >= ?', Date.today).order(date: :asc, time: :asc) }
  scope :past, -> { where('date < ?', Date.today).order(date: :desc, time: :desc) }
  scope :by_status, ->(status) { where(status: status) if status.present? }
  
  def cancel
    update(status: 'cancelled')
  end
  
  def complete
    update(status: 'completed')
  end
end
