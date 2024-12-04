# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json
  before_action :configure_sign_in_params, only: [:create]

  # POST /login
  def create
     @user = User.find_by(email: params[:formData][:email])
     if @user
      if @user.valid_password?(params[:formData][:password])
        render json: { email: @user.email, status: :ok }
        sign_in @user, store: false
      else
        render json: { error: "incorrect password" }
      end
     else
        render json: { error: "incorrect email" }
     end
  end

  # DELETE /logout
   def destroy
     sign_out current_user
   end

   protected

  # If you have extra params to permit, append them to the sanitizer.
   def configure_sign_in_params
     devise_parameter_sanitizer.permit(:create, keys: [formData: [:email, :password]])
   end
end
