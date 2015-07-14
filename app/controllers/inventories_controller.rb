class InventoriesController < ApplicationController

  def index
     
  end

  def getServices
    
  end

  def show

  end


  #create Inventory
  def createInventory
     inventory = Inventory.create( transaction_date: Date.today.to_datetime, user_id: current_user.id)
     if inventory.save
        render :json => { :status => :ok, :message => "Success" }
     else
        render :json => { :status => :error, :message => "Error" }
     end
  end

  #get inventory stocks
  def getInventoryStocks
    inventoryStock = Stock.all.order("created_at desc")
    render json: inventoryStock, :status => "ok"
  end

  # delete inventory stocks
  def deleteInventoryStock
    inventory = Stock.find(params[:id])
    if inventory.destroy
      logs = Log.create(user_id: current_user.id, action: current_user.user_info.firstname.titleize + " deleted an item to Inventory(Stocks).")
      logs.save
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error!" }
    end  
  end

  # update inventoryStock
  def updateInventoryStocks
    on_stock = Stock.find_by_id(params[:id])

    if on_stock.update(category_id: params[:category_id], inventory_id: params[:inventory_id], price: params[:price], product_details: params[:product_details], product_name: params[:product_name], quantity: params[:quantity])
      logs = Log.create(user_id: current_user.id, action: current_user.user_info.firstname.titleize + " updated an item from Inventory(Stocks).")
      logs.save
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error!" }
    end
  end
  # end of on stock functions

  # for direct purchase functions
  def getManufacturerList
    manufacturer = Manufacturer.all.order("created_at asc")
    render json: manufacturer, status: :ok
  end

  def submitDirectPurchase
  inventory_data = Inventory.last

  stock = Stock.create(category_id: params[:category_id], inventory_id: inventory_data.id, product_name: params[:product_name], product_details: params[:product_details], quantity: params[:quantity], price: params[:price], classification_table: "direct purchase")
  stock.save
  direct = DirectPurchase.create(stock_id: stock.id, or_no: params[:or_no], in_charge: params[:in_charge], cash_onhand: params[:cash_onhand], store_name: params[:store_name])    
    
    if direct.save
      logs = Log.create(user_id: current_user.id, action: current_user.user_info.firstname.titleize + " added an item to Inventory(Direct Purchase)")
      logs.save
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error!" }
    end
  end

  def getDirectPurchases
    purchase_data = []

    purchases = Stock.select("*").joins(:direct_purchases).where(classification_table: "direct purchase")
    
    purchases.each do |purchases_extract|
      purchase_data.push(or_no: purchases_extract.or_no, product_name: purchases_extract.product_name, quantity: purchases_extract.quantity, price: purchases_extract.price, store_name: purchases_extract.store_name, created_at: purchases_extract.created_at)
    end

    render json: purchase_data, status: :ok
  end

  def deleteDirectPurchase
    purchase = DirectPurchase.find(params[:id])
    if purchase.destroy
      logs = Log.create(user_id: current_user.id, action: current_user.user_info.firstname.titleize + " deleted an item to Inventory(Direct Purchase).")
      logs.save
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error!" }
    end  
  end

  def updateDirectPurchase
     purchase = DirectPurchase.find_by_id(params[:id])

    if purchase.update(category_id: params[:category_id], manufacturer_id: params[:manufacturer_id], car_brand: params[:car_brand], car_model: params[:car_model], inventory_id: params[:inventory_id], or_no: params[:or_no], in_charge: params[:in_charge], cash_on_hand: params[:cash_on_hand], product_name: params[:product_name], quantity: params[:quantity], price: params[:price])
      logs = Log.create(user_id: current_user.id, action: current_user.user_info.firstname.titleize + " updated an item from Inventory(Direct Purchase).")
      logs.save
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error!" }
    end
  end
  # end of direct purchase functions

  # start of product order functions

  def getProductOrderList
    product_data = []
    products = ActiveRecord::Base.connection.select_all("select * from stocks s inner join product_orders p on s.id = p.stock_id inner join manufacturers m on p.manufacturer_id = m.id order by s.created_at desc")
    
    render json: products, status: :ok
  end

  def submitProductOrder
    inventory_data = Inventory.last
    stock = Stock.create(category_id: params[:category_id], inventory_id: inventory_data.id, product_name: params[:product_name], product_details: params[:product_details], quantity: params[:quantity], price: params[:price], classification_table: "product order")
    stock.save
    product = ProductOrder.create(stock_id: stock.id, manufacturer_id: params[:manufacturer_id], product_type: params[:product_type])
    
    if product.save
      logs = Log.create(user_id: current_user.id, action: current_user.user_info.firstname.titleize + " added an item to Inventory(Product Order)")
      logs.save
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error!" }
    end
  end

  def updateProductOrder
    product = ProductOrder.find_by_id(params[:id])

    if product.update(category_id: params[:category_id], manufacturer_id: params[:manufacturer_id], product_type: params[:product_type], inventory_id: inventory.id, product_name: params[:product_name], quantity: params[:quantity], price: params[:quantity])
      logs = Log.create(user_id: current_user.id, action: current_user.user_info.firstname.titleize + " updated an item from Inventory(Product Order).")
      logs.save
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error!" }
    end
  end

  def deleteProductOrder
    product = ProductOrder.find(params[:id])
    if product.destroy
      logs = Log.create(user_id: current_user.id, action: current_user.user_info.firstname.titleize + " deleted an item from Inventory(Product Order).")
      logs.save
      render :json => { :status => :ok, :message => "Success" }
    else
      render :json => { :status => :error, :message => "Error!" }
    end
  end
  # end of product order functions

  def getLatestInventory
      inventory = Stock.all.order("created_at asc").limit(5);

      render json: inventory.to_json(:only => ["product_name","quantity"]) , :status => "success"
  end

end
