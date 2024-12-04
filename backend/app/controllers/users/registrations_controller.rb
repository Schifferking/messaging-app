# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  # POST /signup
  def create
    @user = User.new(registration_params)

    if @user.save
      render json: {email: @user.email, status: :ok }
    else
      render json: { error: @user.errors }
    end
  end

  private

  def registration_params
    params.require(:formData).permit(:email, :password, :passwordRepeat)
  end
end
