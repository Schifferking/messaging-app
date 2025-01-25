

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  validates :email, presence: { message: "enter an email" }
  validates :email, uniqueness: { message: "email entered is already used, enter another one" }
  validates :email, format: { with: /\A[\w.+-]+@\w+\.\w+\z/, message: "enter a valid email address" }

  validates :password, presence: { message: "enter a password" }
  validates :password, length: { minimum: 8 }
  validate :password_score_cannot_be_equal_or_lower_than_two
  validate :password_cannot_be_different_from_password_confirmation

  def password_score_cannot_be_equal_or_lower_than_two
    if Zxcvbn.zxcvbn(password)["score"] <= 2
      errors.add(:password, "score can't be equal or lower than two")
    end
  end

  def password_cannot_be_different_from_password_confirmation
    if password != password_confirmation
      errors.add(:password, "can't be different from password_confirmation")
    end
  end
end
