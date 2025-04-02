# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # update this when deploying
    origins 'http://localhost:5173'

    # add destroy to methods when implementing account deletions
    # note: Authorization header is exposed to be able to store token in frontend
    resource '/signup',
             headers: :any,
             methods: [:post],
             expose: %w[access-token expiry token-type Authorization]

    # allow post requests to log in users
    resource '/login',
             headers: :any,
             methods: [:post],
             expose: %w[access-token expiry token-type Authorization]

    # only allow delete requests
    resource '/logout',
             headers: :any,
             methods: [:delete],
             expose: %w[access-token expiry token-type Authorization]

    resource '/users',
             headers: :any,
             methods: [:get],
             expose: %w[access-token expiry token-type Authorization]

    resource '/messages',
             headers: :any,
             methods: %i[get post],
             expose: %w[access-token expiry token-type Authorization]

    resource %r{/user/\d*},
             headers: :any,
             methods: %i[get patch],
             expose: %w[access-token expiry token-type Authorization]
  end
end
