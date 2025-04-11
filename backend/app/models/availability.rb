class Availability < ApplicationRecord
  belongs_to :provider
  
  validates :date, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :is_available, inclusion: { in: [true, false] }
  
  scope :available, -> { where(is_available: true) }
  scope :upcoming, -> { where('date >= ?', Date.today).order(date: :asc, start_time: :asc) }
  
  def duration_in_minutes
    ((end_time - start_time) / 60).to_i
  end
  
  def mark_as_unavailable
    update(is_available: false)
  end
end
