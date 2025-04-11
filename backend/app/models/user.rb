class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  has_one :patient, dependent: :destroy
  has_one :provider, dependent: :destroy
  
  validates :email, presence: true, uniqueness: true
  validates :user_type, presence: true, inclusion: { in: ['patient', 'provider'] }
  
  after_create :create_profile
  
  def create_profile
    if patient?
      create_patient
    elsif provider?
      create_provider
    end
  end
  
  def patient?
    user_type == 'patient'
  end
  
  def provider?
    user_type == 'provider'
  end
end
