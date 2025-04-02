class MessagesController < ApplicationController
  respond_to :json

  def create
    @message = Message.new(message_params)
    if @message.save
      render json: {
        status: { code: 200, message: 'Message sent.' }
      }, status: :ok
    else
      render json: {
        status: { code: 422, message: 'Error, message cannot be sent.' }
      }, status: :unprocessable_entity
    end
  end

  def index
    messages = Message.chat_history(params[:senderId], params[:receiverId])
    render json: {
      status: { code: 200, message: 'Messages fetched.' },
      data: { messages: messages }
    }, status: :ok
  end

  private

  def message_params
    params.require(:message).permit(:content, :sender_id, :receiver_id)
  end
end
