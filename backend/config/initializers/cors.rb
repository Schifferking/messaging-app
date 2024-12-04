# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # update this when deploying
    origins "http://localhost:5173"

    # add update and destroy to methods when implementing account editions or deletions
    resource '/signup',
    :headers => :any,
    :methods => [:post]

    # allow post requests to log in users
    resource '/login',
    :headers => :any,
    :methods => [:post]

    # only allow delete requests
    resource '/logout',
    :headers => :any,
    :methods => [:delete]
  end
end
