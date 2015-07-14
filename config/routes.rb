Rails.application.routes.draw do

  get 'customers/index'

  get 'customers/show'

  get 'categories/index'

  get 'services/index'

  resources :categories, :manufacturers
  resources :users, except: :show
  resources :inventories, except: :show
  resources :services, except: :show
  resources :job_orders, except: :show
  resources :customers, except: :show
  resources :logs, except: :show
  devise_for :users
    
  devise_scope :user do

    authenticated :user do
      root 'users#index', as: :authenticated_root
      # get '*path' => 'application#index'
      get '/users/settings' => 'users#settings', as: 'user_settings'

      post '/inventories/createInventory' => 'inventories#createInventory'

      # submit routes
      post '/inventories/submitDirectPurchase' => 'inventories#submitDirectPurchase'
      post '/inventories/submitProductOrder' => 'inventories#submitProductOrder'
      post '/manufacturers/submitManufacturer' => 'manufacturers#submitManufacturer'
      post '/job_orders/submitJobOrder' => 'job_orders#submitJobOrder'
      post '/customers/submitCustomerInfo' => 'customers#submitCustomerInfo'
      # get list
      get '/inventories/getInventoryStocks' => 'inventories#getInventoryStocks'
      get '/inventories/getProductOrderList' => 'inventories#getProductOrderList'
      get '/inventories/getManufacturerList' => 'inventories#getManufacturerList'
      get '/inventories/getDirectPurchases' => 'inventories#getDirectPurchases'
      get '/services/getServices' => 'services#getServices'
      get '/customers/getCustomerInfo' => 'customers#getCustomerInfo'
      get '/inventories/getLatestInventory' => 'inventories#getLatestInventory'
      get 'logs/getLogs' => 'logs#getLogs'
      #update routes
      post '/inventories/:id/updateInventoryStocks' => 'inventories#updateInventoryStocks'
      post '/inventories/:id/updateProductOrder' => 'inventories#updateProductOrder'
      post '/inventories/:id/updateDirectPurchase' => 'inventories#updateDirectPurchase'

      # delete routes
      get '/inventories/:id/deleteProductOrder' => 'inventories#deleteProductOrder'
      get '/inventories/:id/deleteDirectPurchase' => 'inventories#deleteDirectPurchase'  
      get 'inventories/:id/deleteInventoryStock' => 'inventories#deleteInventoryStock'
      # end of on stock routes

      # test
      get '/users/getUserInfo' => 'users#getUserInfo'
      # end of test
    end

    unauthenticated do
      root 'devise/sessions#new', as: :unauthenticated_root
    end

  end
  
end
