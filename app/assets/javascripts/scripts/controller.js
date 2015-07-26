app
  .controller('dashBoardCtrl', [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {
      console.log("dashBoardCtrl");
      $scope.manufacturerData = {};
      $scope.stockList = {};
      $scope.logList = {};

      $scope.getLatestInventory = function getLatestInventory(){

        CarServer.request("get", '/inventories/getLatestInventory',
          function(response){
            $scope.stockList = response;
          })
      }

      $scope.getLogs = function getLogs(){

        CarServer.request("get", '/logs/getLogs',
          function(response){
            console.log(response);
            $scope.logList = response;
          });
      }
      // load functions
      $scope.getLatestInventory();
      $scope.getLogs();

      $scope.$on( "show-dashboard" , 
        function onReceive(){
          $scope.getLatestInventory();
          $scope.getLogs();
      }); 
    }
  ])
  .controller('inventoryViewCtrl', [
    "$scope",
    "$http",
    "CarServer",
    "$timeout",
    function controller($scope, $http, CarServer, $timeout)
    {
      $scope.onStockList = {};
      $scope.dirPurchList = {};
      $scope.productOrderList = {};
      $scope.displayModalInfo = {};
      $scope.statusActive = false;
      $scope.tableHeadings1 = true;


      /*----- Get list of On Stock -----*/
      $scope.displayOnStockList = function displayOnStockList(){
        CarServer.request("get", "/inventories/getInventoryStocks",
        function(response){
          console.log( response );
          $scope.onStockList = response;
        });
      }
      /*----- Get list of Direct Purchase -----*/
      $scope.displayDirectPurchaseList = function displayDirectPurchaseList(){
        CarServer.request("get", "/inventories/getDirectPurchases",
        function(response){
          console.log( response );
          $scope.dirPurchList = response;
        });
      }
      /*----- Get list of Product Order -----*/
      $scope.getProductOrderList = function getProductOrderList(){
        CarServer.request("get", "/inventories/getProductOrderList",
        function(response){
          console.log( response );
          $scope.productOrderList = response;
        });
      }

      /*----- Load list after adding data -----*/
      $scope.$on( 'loadTableData', 
        function( evt , data ){
          console.log( data )
          if (data === 'onStock') {
            $scope.displayOnStockList();
          }else if( data === 'directPurchase' ) {
            $scope.displayDirectPurchaseList();
          }else if( data === 'productOrder' ) {
            $scope.displayDirectPurchaseList();
          }
        } );
      
      /*----- Transfer Info to modal -----*/
      $scope.displayProductInfo = function displayProductInfo( list , action ){
        console.log( action );
        $scope.tableHeadings = [];

        if ( action == 'viewOnStock' ) {
          $scope.tableHeadings1 = true;    
          $scope.displayModalInfo = list;
        }else if( action == 'edit' ) {
          $scope.displayModalInfo = list;
        }
      }

      /*----- Edit Individual Product on Tables -----*/
      $scope.editProductInfo = function editProductInfo( ){
        console.log($scope.displayModalInfo);
        CarServer.request("post", "/inventories/"+$scope.displayModalInfo.id+"/updateInventoryStocks",
          function(response){
            console.log( response );
            $('#productModalInfoEdit').modal('hide');
        }, $scope.displayModalInfo); 
      }
      
      /*----- Delete Individual Product on Tables -----*/
      $scope.removeProduct = function removeProduct( list , category ){
        var uri = "";
        var dataObj = {};
        if( confirm("Are you sure you want to delete this item?") ){
          switch( category ) {
            case 'on-stock':
              uri = 'deleteInventoryStock';
              dataObj = $scope.onStockList;
              break;
            case 'direct-purchase':
              uri = 'deleteDirectPurchase';
              dataObj = $scope.dirPurchList;
              break;
            case 'product-order':
              uri = '';
              dataObj = {}; 
              break;
            default:
              break;
          }
          CarServer.request("get", "/inventories/"+list.id+"/"+uri,
            function(response){
              console.log( response );
              dataObj.splice( dataObj.indexOf(list) , 1 );
          });
        }
      }

      // load available stock
      $scope.getAvailableStockList = function getAvailableStockList(){
        CarServer.request("get", '/inventories/getAvailableStockList',
          function(response){
            console.log(response);
            $scope.availableList = response;
          });
      }

       // get total
      $scope.getTotal = function getTotal(){
        var total = 0;
        var total = 0;
        for(var i = 0; i < $scope.inventoryList.length; i++){
            var product = $scope.inventoryList[i];
            total += (product.price * product.quantity);
        }
        return total;
      }

      /* Display all inventory table Lists */
      $scope.$on( "show-inventory-view" , 
        function onReceive(){
          $scope.displayOnStockList();
          $scope.displayDirectPurchaseList();
      }); 
    }
  ])
  .controller('inventoryAddCtrl', [
    "$scope",
    "$http",
    "CarServer",
    "$timeout",
    "$rootScope",
    function controller($scope, $http, CarServer , $timeout, $rootScope)
    {
      $scope.categoryList = {};
      $scope.manufacturerList = {};
      $scope.list = {};
      $scope.category = {};
      $scope.inventoryData = {};
      $scope.inventoryList = {};
      $scope.categoryShow = 'on-stock';
      $scope.total = {};
      $scope.dataEdit = {};
      $scope.dataStored = {};
      $scope.showLoadState = false;
      $scope.successLoadState = false;
      $scope.alertmsg = false;
      $scope.errormsg = false;
      $scope.msg = "";
      $scope.orderHolder = [];
      $scope.addOnStock = [];

      $scope.lists = [ 
          { 'value' : 'direct-purchase' , 'category' : 'Direct Purchase'  }, 
          { 'value' : 'product-order' , 'category' : 'Product Order'  }
      ];
      $scope.category.list = $scope.lists[0];
      var totalAmount = 0;

      /*----- Disable button -----*/
      disabledButton();

      // Get list of services
      $scope.categories = function categories(){
        CarServer.request("get", "/categories",
        function(response){
          $scope.categoryList = response;
          console.log($scope.categoryList);

        });
      }

      /*----- Get list of Manufacturers -----*/
      $scope.manufacturers = function manufacturers(){
        CarServer.request("get", "/manufacturers/getManufacturerList",
        function(response){
          console.log( response );
          $scope.manufacturerList = response;
        });
      }

      // Add Direct Purchase to Basket 
      $scope.addToBasketDirPurch = function addToBasketDirPurch(){
        console.log( 'Added to On Stock basket' );
        console.log($scope.inventoryData);
        var today = new Date();
        var randomID = new Date().getTime() + '-' + Math.random().toString(36).slice(2);
        var totalQuantityPrice = parseFloat( $scope.inventoryData.price ) * parseFloat( $scope.inventoryData.quantity );
        var htmlList = '<li>'
                     + '<button priceQtyValue="'+totalQuantityPrice+'" id="' + randomID + '" class="btn btn-default btn-remove-stock-order" data-toggle="tooltip" data-placement="left" title="Click to Remove"><i class="fa fa-minus"></i></button>' 
                     + '<label><a href="#" id="'+ randomID +'" data-toggle="modal" class="edit-selection" data-target="#modal-edit-selection" >'+ $scope.inventoryData.product_name +'</a></label>'
                     + '<span class="price pull-right">Php <span class="price-value">' + totalQuantityPrice + '</span></span>'
                     + '</li>';
        $( '#basket-ordered-lists' ).append( htmlList );  
        
        $scope.addOnStock.push({ 
          'cartID'           : randomID,
          'category_id'      : 1,  
          'transaction_date' : today.toISOString().substring(0, 10),
          'or_no'            : $scope.inventoryData.or_no,
          'in_charge'        : $scope.inventoryData.in_charge,
          'cash_onhand'      : $scope.inventoryData.cash_onhand,
          'store_name'       : $scope.inventoryData.store_name,
          'product_name'     : $scope.inventoryData.product_name, 
          'quantity'         : $scope.inventoryData.quantity, 
          'price'            : $scope.inventoryData.price,
          'product_details'          : $scope.inventoryData.product_details
        } );

        disabledButton();
        $scope.inventoryData.product_name = "";
        $scope.inventoryData.product_details = "";
        $scope.inventoryData.price = "";
        $scope.inventoryData.quantity = "";  
        console.log($scope.addOnStock);
        getTotal( totalQuantityPrice , '+' );
      }

      // Add Product Order to Basket 
      $scope.addToBasketProdOrder = function addToBasketProdOrder(){
        console.log( 'Added to Prodct Order basket' );
        console.log($scope.inventoryData);

        var today = new Date();
        var randomID = new Date().getTime() + '-' + Math.random().toString(36).slice(2);
        var totalQuantityPrice = parseFloat( $scope.inventoryData.price ) * parseFloat( $scope.inventoryData.quantity );
        var htmlList = '<li>'
                     + '<button priceQtyValue="'+totalQuantityPrice+'" id="' + randomID + '" class="btn btn-default btn-remove-stock-order" data-toggle="tooltip" data-placement="left" title="Click to Remove"><i class="fa fa-minus"></i></button>' 
                     + '<label><a href="#" id="'+ randomID +'" data-toggle="modal" class="edit-selection" data-target="#modal-edit-selection" >'+ $scope.inventoryData.product_name +'</a></label>'
                     + '<span class="price pull-right">Php <span class="price-value">' + totalQuantityPrice + '</span></span>'
                     + '</li>';
        $( '#basket-ordered-lists' ).append( htmlList );  

        $scope.addOnStock.push({ 
          'cartID'            : randomID,
          'category_id'       : 2,
          'transaction_date'  : today.toISOString().substring(0, 10) ,
          'manufacturer_id'   : $scope.inventoryData.manufacturer_id ,
          'product_name'      : $scope.inventoryData.product_name ,
          'quantity'          : $scope.inventoryData.quantity,
          'price'             : $scope.inventoryData.price ,
          'product_type'      : $scope.inventoryData.product_type ,
          'product_details'   : $scope.inventoryData.product_details
        });

        disabledButton();
        $scope.inventoryData.product_name = "";
        $scope.inventoryData.quantity = "";
        $scope.inventoryData.price = "";
        $scope.inventoryData.product_type = "";
        $scope.inventoryData.product_details = "";
        
        getTotal( totalQuantityPrice , '+' );
      }

       // To Remove the Added Product
       $( 'body' ).delegate( '.btn-remove-stock-order' , 'click' , function(){
          var ID = $( this ).attr( 'id' );
          var pqv = $( this ).attr( 'priceQtyValue' );
          var priceValue = parseFloat( pqv );
          getTotal( priceValue , '-' );

          $.each( $scope.addOnStock , function(i){
              if($scope.addOnStock[i].cartID === ID) {
                  $scope.addOnStock.splice(i,1);
                  return false;
              }
          });
          console.log($scope.addOnStock);
          $( '#' + ID ).parent().remove();
          disabledButton();
       } );

       // Pass data to modal edit form
       $( 'body' ).delegate( '.edit-selection' , 'click' , function(){
        var ID = $( this ).attr( 'id' );
         $.each( $scope.addOnStock , function(i){
            console.log( $scope.addOnStock[i] );
            if ( $scope.addOnStock[i].cartID == ID ) {
              $timeout(function(){
                $scope.dataEdit.cartID = ID;
                $scope.dataEdit.price = $scope.addOnStock[i].price;
                $scope.dataEdit.product_name = $scope.addOnStock[i].product_name;
                $scope.dataEdit.product_details = $scope.addOnStock[i].product_details;
                $scope.dataEdit.product_type = $scope.addOnStock[i].product_type;
                $scope.dataEdit.quantity = $scope.addOnStock[i].quantity;
              },10);
            };

          });
       } );

       // Make all Changes for ordered items 
       $scope.updateOrderedProduct = function updateOrderedProduct() {
          console.log( $scope.dataEdit );
          $.each( $scope.addOnStock , function(i){
              $scope.addOnStock[i] = $scope.dataEdit;
          });
       } 

      function getTotal( orderValue , operation ) {
        var total = 0;
        if ( operation == '+' ) {
          total = totalAmount + orderValue;
        } else if( operation == '-' ) {
          total = totalAmount - orderValue;
        }
        totalAmount = total;
        $( '#totalBasketPrice' ).text( total.toLocaleString() );
      }

      function disabledButton() {
        console.log( $scope.addOnStock.length )
        if( $scope.addOnStock.length < 1 ) {
          $( '#submitProductBasket' ).attr( 'disabled' , true );
        }else {
          $( '#submitProductBasket' ).removeAttr( 'disabled' );
        }
      }

      // add inventory data
      $scope.showCategoryForm = function showCategoryForm( categoryType ) {
        console.log( categoryType )
        if (categoryType.value == 'direct-purchase') {
          $( '.form-wrapper' ).css( 'display','none' );
          $( '.form-' + categoryType.value ).show();
        
        }else if(categoryType.value == 'product-order') {
          $( '.form-wrapper' ).css( 'display','none' );
          $( '.form-' + categoryType.value ).show();

        } else {
          $( '.form-wrapper' ).css( 'display','none' );
          $( '.form-direct-purchase' ).show();
        };
        totalAmount = 0;
        resetData();
      }
      $scope.showCategoryForm(false);

      function resetData() {
        $( '#basket-ordered-lists li' ).remove();
        $scope.inventoryData = {};
        $scope.addOnStock = [];
        $( '#totalBasketPrice' ).text( '0.00' );
      }

      // Create Inventory  -- call
      $scope.createInventory = function createInventory(){

        CarServer.request("post", '/inventories/createInventory',
          function(response){
            console.log(console);
          }, $scope.addOnStock);
      }

      // Insert All Selected Products
      $scope.storeSelectedData = function storeSelectedData() {
        $scope.createInventory();

        for( x in $scope.addOnStock ) {
          $scope.showLoadState = true;
          $scope.hideLoadState = true;

          if ( $scope.addOnStock.length > 0 ) {
            switch( $scope.addOnStock[x].category_id ) {
              // case 1: // Insert On Stock Products
              // console.log($scope.addOnStock[x]);
              //   CarServer.request( "post" , "/inventories/submitStock" , 
              //     function( response ) {
              //       console.log( 'success on-stock' )
              //       $scope.showLoadState = false;
              //       $scope.hideLoadState = true;
              //       $scope.successLoadState = true;  
              //       $timeout( function(){
              //         $scope.successLoadState = false;
              //         $scope.hideLoadState = false;
              //         resetData();
              //       }, 3000 );
              //       $rootScope.$broadcast( 'loadTableData', 'onStock' );
              //   } , $scope.addOnStock[x] );
              //   break;

              case 1: // Insert Direct Purchase Products
                CarServer.request( "post" , "/inventories/submitDirectPurchase" , 
                  function( response ) {
                    console.log( 'success direct-purchase' );
                    console.log( $scope.addOnStock[x] );
                    $scope.showLoadState = false;
                    $scope.hideLoadState = true;
                    $scope.successLoadState = true;  
                    $timeout( function(){
                      $scope.successLoadState = false;
                      $scope.hideLoadState = false;
                    }, 3000 );
                    resetData();
                    $rootScope.$broadcast( 'loadTableData', 'directPurchase' );
                } , $scope.addOnStock[x] );
                break;

              case 2: // Insert Product Orders
              console.log($scope.addOnStock[x]);
                CarServer.request( "post" , "/inventories/submitProductOrder" , 
                  function( response ) {
                    console.log( 'success product-order' );
                    $scope.showLoadState = false;
                    $scope.hideLoadState = true;
                    $scope.successLoadState = true;  
                    $timeout( function(){
                      $scope.successLoadState = false;
                      $scope.hideLoadState = false;
                      resetData();
                    }, 3000 );
                    $rootScope.$broadcast( 'loadTableData', 'productOrder' );
                } , $scope.addOnStock[x] );
                break;

              default:
                console.log( 'Error daw' );
                break;
            }
          }
        }


        // if ( $scope.addOnStock.length < 1 ) {
        //     $scope.errormsg = true;
        //     $scope.msg = "Empty/Invalid entry.";
        //     $timeout( function() {
        //       $scope.errormsg = false;
        //     },3000 );
        // };
        disabledButton();
        console.log($scope.addOnStock.length);
      }

      // get inventories
      $scope.getInventories = function getInventories(){
        var forTotal =  {}
        CarServer.request("get", '/inventories/getInventories',
          function(response){
            $scope.inventoryList = response;
          });
      }


      // get total
      $scope.getTotal = function getTotal(){
        var total = 0;
        for(var i = 0; i < $scope.inventoryList.length; i++){
            var product = $scope.inventoryList[i];
            total += (product.price * product.quantity);
        }
        return total;
      }
      // get stocks
      $scope.getInventoryStocks = function getInventoryStocks(){
        CarServer.request("get",'/inventories/getInventoryStocks',
          function(response){
            console.log(response)
          });
      }


      // load functions
       $scope.$on( "show-inventory-add" , 
        function onReceive(){
            $scope.getInventoryStocks();
            $scope.categories();
            $scope.manufacturers();
      }); 
     
    }
  ])
  .controller('expenseAddCtrl', [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {

      $scope.$on( "show-expense-add" , 
        function onReceive ( ) {
          
        });
    }
  ])
  .controller('expenseViewCtrl', [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {

      $scope.$on( "show-expense-view" , 
        function onReceive ( ) {
          
        });
    }
  ])
  .controller('estimationAddCtrl', [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {
      localStorage.clear();

      var localStoredServices = [];

      $scope.serviceList = {};
      $scope.showServiceStatus = false;
      $scope.serviceDetails = {};
      $scope.customerLists = {};
      $scope.noCustomerExist = false;
      $scope.customerExist = false;
      $scope.userInfo = {};
      $scope.jobOrderInfo = {};
      $scope.jobOrderInfo.customer_exist = false

      $scope.serviceDataToModal = {};
      $scope.servicePushToBox = [];
      $scope.selectedServices = [];

      // $scope.totalPartAmount = 0;

      $scope.totalServiceAmountDetailPerBox = 0;

      /*----- Display Services ------*/
      $scope.getServices = function getServices(){
        CarServer.request("get", "/services/getServices",
          function(response){
            console.log(response);
            $scope.serviceList = response;
          });
      }

      /*----- Display Existing Customer -----*/
      $scope.getExistingCustomer = function getExistingCustomer() {
        CarServer.request("get", "/customers/getCustomerInfo",
          function(response){
            $scope.customerLists = response;
          });
      }
      /*----- Search Existing Customer -----*/
      $scope.submitCustomerQuery = function submitCustomerQuery( searchQuery ) {
        console.log(  searchQuery  );
        $scope.noCustomerExist = true;
        $scope.customerExist = true;
        $scope.jobOrderInfo.customer_exist = true;
        $scope.jobOrderInfo.id = searchQuery.id;
        $scope.userInfo.fullname = searchQuery.fullname;
        $scope.userInfo.contact_no = searchQuery.contact_no;
        $scope.userInfo.address = searchQuery.address;

        $scope.jobOrderInfo.fullname = searchQuery.fullname;
        $scope.jobOrderInfo.contact_no = searchQuery.contact_no;
        $scope.jobOrderInfo.address = searchQuery.address;
      }
      $scope.addCustomerInfoManually = function addCustomerInfoManually() {
        $scope.noCustomerExist = false;
        $scope.customerExist = false;
        $scope.jobOrderInfo.customer_exist = false;
        $scope.jobOrderInfo.id = '';
        $scope.userInfo.fullname = '';
        $scope.userInfo.contact_no = '';
        $scope.userInfo.address = '';
        $scope.jobOrderInfo.fullname = null;
        $scope.jobOrderInfo.contact_no = null;
        $scope.jobOrderInfo.address = null;
      }
      /*----- Add Payment Type -----*/
      $scope.setPaymentType = function setPaymentType( type ) {
        $scope.jobOrderInfo.payment_method = type;
      }


      /* ----------------------------------------------------------------------------------------------- */
      /* ----------------------------------------- PREVIEW ESTTIMATION --------------------------------- */ 
      /* ----------------------------------------------------------------------------------------------- */
      $scope.previewEstimation = function previewEstimation() {

        console.log( '-----totalServiceAmountDetailPerBox-----' )
        console.log( $scope.totalServiceAmountDetailPerBox );
        console.log( '-----jobOrderInfo.job_details-----' )
        console.log( $scope.jobOrderInfo.job_details );

        var selectedServiceNames = [];
        var totalBoxOutput = 0; 
        $scope.totalPartAmount = 0;
        $scope.totalEstimationAmount = 0;
        var transaction_date = new Date();
        transaction_date = transaction_date.toDateString() + " , " + transaction_date.toLocaleTimeString().replace(/:\d+ /, ' '); 
        var getTotalServiceAmount = [];
        var displayTotalBoxOutput = 0;
        
        console.log( $scope.partsLists );

        for( x in $scope.partsLists ) {
            $scope.totalPartAmount += ( $scope.partsLists[x].selectedAmountQuantity * $scope.partsLists[x].price );
        }

        for( x in $scope.selectedServices ) {

            for( y in $scope.jobOrderInfo.job_details ) {
                if ( $scope.selectedServices[x].service_id == $scope.jobOrderInfo.job_details[y].service_id ) {
                    getTotalServiceAmount.push( 
                      {
                          boxID : $scope.jobOrderInfo.job_details[y].boxID,
                          service_id : $scope.jobOrderInfo.job_details[y].service_id,
                          perBox : $scope.jobOrderInfo.job_details[y].totalPerBox
                      } 
                    )
                    // console.log( Math.max( $scope.jobOrderInfo.job_details[y].totalPerBox ) );
                }
                console.log( '-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+' )
                console.log( $scope.jobOrderInfo.job_details[y] );
            }

            for( z in getTotalServiceAmount ) {
                // console.log( getTotalServiceAmount[z] );
                if ( getTotalServiceAmount[z].service_id == $scope.selectedServices[x].service_id ) {
                     displayTotalBoxOutput = Math.max( getTotalServiceAmount[z].perBox );
                }else {
                     displayTotalBoxOutput = getTotalServiceAmount[z].perBox;
                }
            }

                // console.log( '-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+' )
                // console.log( displayTotalBoxOutput );

            selectedServiceNames.push( 
              { 
                service_name : $scope.selectedServices[x].service_name , 
                randomID : $scope.selectedServices[x].randomID , 
                service_id : $scope.selectedServices[x].service_id,
                boxTots :  displayTotalBoxOutput
              } 
            );
        }

        for( a in selectedServiceNames ) {
            totalBoxOutput += selectedServiceNames[a].boxTots;
        }
        
        $scope.totalEstimationAmount = totalBoxOutput + $scope.totalPartAmount;


        // console.log( '---------boxTots-----------' )
        // console.log( selectedServiceNames )
        
        $scope.jobOrderInfo.partsLists = $scope.partsLists;
        $scope.jobOrderInfo.service_name = selectedServiceNames;
        $scope.jobOrderInfo.transaction_date = transaction_date;
          $( '#job-order-form-wrapper' ).fadeOut();
          $( '#preview-estimation-wrapper' ).fadeIn();
      }
      /* ----------------------------------------- End: Preview Estimation ----------------------------- */ 


      /* ----------------------------------------------------------------------------------------------- */
      /* ----------------------------------------- SUBMIT JOB ORDER ------------------------------------ */ 
      /* ----------------------------------------------------------------------------------------------- */
      $scope.submitJobOrder = function submitJobOrder() {
        var selectedServiceNames = [];
        var totalBoxOutput = 0; 
        $scope.totalPartAmount = 0;
        $scope.totalEstimationAmount = 0;
        var transaction_date = new Date();
        transaction_date = transaction_date.toDateString() + " , " + transaction_date.toLocaleTimeString().replace(/:\d+ /, ' '); 
        var getTotalServiceAmount = [];
        var displayTotalBoxOutput = 0;
        


        for( x in $scope.partsLists ) {
            $scope.totalPartAmount += ( $scope.partsLists[x].selectedAmountQuantity * $scope.partsLists[x].price );
        }

        for( x in $scope.selectedServices ) {

            for( y in $scope.jobOrderInfo.job_details ) {
                if ( $scope.selectedServices[x].service_id == $scope.jobOrderInfo.job_details[y].service_id ) {
                    getTotalServiceAmount.push( 
                      {
                          boxID : $scope.jobOrderInfo.job_details[y].boxID,
                          service_id : $scope.jobOrderInfo.job_details[y].service_id,
                          perBox : $scope.jobOrderInfo.job_details[y].totalPerBox
                      } 
                    )
                    // console.log( Math.max( $scope.jobOrderInfo.job_details[y].totalPerBox ) );
                }
            }

            for( z in getTotalServiceAmount ) {
                if ( getTotalServiceAmount[z].service_id == $scope.selectedServices[x].service_id ) {
                     displayTotalBoxOutput = Math.max( getTotalServiceAmount[z].perBox );
                }
            }
                // console.log( '-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+' )
                // console.log( $scope.selectedServices[x] );

            selectedServiceNames.push( 
              { 
                service_name : $scope.selectedServices[x].service_name , 
                randomID : $scope.selectedServices[x].randomID , 
                service_id : $scope.selectedServices[x].service_id,
                boxTots :  displayTotalBoxOutput
              } 
            );
        }

        for( a in selectedServiceNames ) {
            totalBoxOutput += selectedServiceNames[a].boxTots;
        }
        
        $scope.totalEstimationAmount = totalBoxOutput + $scope.totalPartAmount;

        
        $scope.jobOrderInfo.partsLists = $scope.partsLists;
        $scope.jobOrderInfo.service_name = selectedServiceNames;
        $scope.jobOrderInfo.transaction_date = transaction_date;




        $scope.finalEstimation  = {};
        $scope.finalJobDetails  = {};
        $scope.finalPartsNeeded = {};
        /* ------------------------------ DATA TO BE SENT TO DATABASE ------------------------------------ */
        $scope.finalEstimation = {  
            'fullname'        : $scope.jobOrderInfo.fullname,
            'address'         : $scope.jobOrderInfo.address,
            'contact_no'      : $scope.jobOrderInfo.contact_no,
            'car_model'       : $scope.jobOrderInfo.car_model,
            'car_brand'       : $scope.jobOrderInfo.car_brand,
            'chasis_no'       : $scope.jobOrderInfo.chasis_no,
            'color'           : $scope.jobOrderInfo.color,
            'engine_type'     : $scope.jobOrderInfo.engine_type,
            'customer_exist'  : $scope.jobOrderInfo.customer_exist,
            'id'              : $scope.jobOrderInfo.id,
            'plate_no'        : $scope.jobOrderInfo.plate_no,
            'transaction_date': $scope.jobOrderInfo.transaction_date
        };

        CarServer.request("post", "/estimations/submitEstimation",
          function(response){

            console.log(response);
            for( d in $scope.jobOrderInfo.part_needed ) {
              CarServer.request("post", "/estimations/savePartNeeds",
                function(response){
                  console.log(response);
                  // console.log( $scope.jobOrderInfo.job_details[d] );
                },$scope.jobOrderInfo.part_needed[d]);
            }

            for( f in $scope.jobOrderInfo.job_details ) {
              CarServer.request("post", "/estimations/saveServiceDetails",
                function(response){
                  console.log(response);

                },$scope.jobOrderInfo.job_details[f]);
            }

          },$scope.finalEstimation);

        console.log( $scope.jobOrderInfo );

        // console.log( $scope.partsLists );
        $( '#job-order-form-wrapper' ).fadeOut();
        $( '#preview-estimation-wrapper' ).fadeIn();
      }
      /* ----------------------------------------- End: SUBMIT JOB ORDER ------------------------------- */ 


      /*----- BACK TO FORM -----*/
      $scope.backToForm = function backToForm() {
        $( '#job-order-form-wrapper' ).fadeIn();
        $( '#preview-estimation-wrapper' ).fadeOut();
        // selectedServiceNames = [];
      }


      /*----- Show selected status on alert box ( green ,red , yellow, blue) ------*/
      /*----- Displays the selected services -----*/
      $scope.displayService = function displayService( service ) {
        $scope.showServiceStatus = true;
        var randomID = new Date().getTime() + '-' + Math.random().toString(36).slice(2);
        var colors = new Array('success','warning','danger','info');
        var pushedServices = {};
        pushedServices = { 'service_id' : service.id , 'randomID' : randomID, 'service_name' : service.service_name , 'class' : colors[$scope.selectedServices.length % colors.length]  };
        $scope.selectedServices.push( pushedServices );
        console.log($scope.selectedServices);
        console.log(service);
        $( 'option[label="'+service.service_name+'"]' ).attr( 'disabled' , true );
      }

      /*------ Remove Selected Service with alert box ( green ,red , yellow, blue) ------*/
      $scope.removeSelectedService = function removeSelectedService(service) {
        var getBoxTotalAmount = null;
        var totalTobeSubtracted = 0;


        /*----- Get the largest Total amount value -----*/
        getBoxTotalAmount = getSum( localStoredServices );
        // console.log( getSum( localStoredServices ))
        for( x in $scope.selectedServices ) { // Loop for Service Box 
          if( $scope.selectedServices[x].randomID == service.randomID ){
            $scope.selectedServices.splice(x,1);
            $( 'option[label="'+service.service_name+'"]' ).removeAttr( 'disabled' );
          }
        }

        var setNewValue = [];
        for( z in localStoredServices ) {
          if (localStoredServices[z].boxID == service.randomID) {
            totalTobeSubtracted += localStoredServices[z].serviceAmount;
          }else {
            console.log( '--------else---------' );
            console.log( localStoredServices[z] );
            setNewValue.push({
              'service_id' : localStoredServices[z].service_id,
              'boxID' : localStoredServices[z].boxID,
              'totalBoxAmount' : localStoredServices[z].totalBoxAmount,
              'serviceAmount' : localStoredServices[z].serviceAmount
            });
          }
        }
        localStoredServices = setNewValue;
        $scope.jobOrderInfo.job_details = setNewValue;
        $scope.totalServiceAmountDetailPerBox =  getSum(localStoredServices);
        $( 'option[label="default"]' ).attr( 'selected' );
      }

      /*----- Gets the largest Total amount value -----*/
      function getSum( dataArr ) {
        var sum = 0;
        for ( x in dataArr ){
          sum += dataArr[x].serviceAmount;
        }
        return sum;
      }

      /*------ Save service data list to modal ------*/
      $scope.saveToModalAdd = function saveToModalAdd( service ) {
        $scope.serviceDataToModal = service;
      }

      /*------ Add service on list to alert box ( green ,red , yellow, blue) ------*/
      $scope.insertServiceDetails = function insertServiceDetails(data,boxData) {
        var addedValue = 0;
        var boxTotal = 0;
        var dataServiceAdded = { service_id : boxData.service_id , description : data.description , amount : data.amount , randomID : boxData.randomID  };
        $scope.servicePushToBox.push(dataServiceAdded);        
        for( x in $scope.servicePushToBox ) {
          if ( boxData.randomID == $scope.servicePushToBox[x].randomID ) {
            addedValue = $scope.servicePushToBox[x].amount;
            boxTotal += $scope.servicePushToBox[x].amount;
          }else {
            boxTotal = 0;
          }
        }
        // console.log( boxTotal );

        $scope.totalServiceAmountDetailPerBox = $scope.totalServiceAmountDetailPerBox + addedValue;


        $scope.serviceDetails = {};
        $('#modal-add-service-detail').modal('hide');

        /*----- Add total amount and data to localStoredServices -----*/
        localStoredServices.push({
          'service_id' : boxData.service_id,
          'boxID' : boxData.randomID,
          'totalBoxAmount' : $scope.totalServiceAmountDetailPerBox,
          'service_description' : data.description,
          'serviceAmount' : addedValue,
          'totalPerBox' : boxTotal
        });
        $scope.jobOrderInfo.job_details = localStoredServices;
        // console.log( localStoredServices );
      }

      /* Get ALL inventory lists */
      $scope.inventoryStocksLists = {};
      $scope.getInventoryLists = function getInventoryLists() {
        CarServer.request("get", "/inventories/getInventoryStocks",
          function(response){
            $scope.inventoryStocksLists = response;
            console.log( 'line 786' );
            console.log( response );
            console.log( 'line 786' );
          });
      }
      $scope.partsLists = {};
      $scope.partsListsContainer = [];
      /* Insert all Selected Parts to Table */ 
      $scope.displaySelectedParts = function displaySelectedParts( selectedPart ) {
          $scope.partsLists = selectedPart;
      } 

      $scope.singlePartAmount = {};
      $scope.quantityVal = {};
      /* Calculate Total Parts Amount (price * quantity) */
      $scope.calculateTotalAmount = function calculateTotalAmount( price, quantity, index, id, part ) {
        if ( $scope.singlePartAmount ) {
          $scope.singlePartAmount[id] = price * quantity;

          for( x in $scope.partsLists ) {
            if ( $scope.partsLists[x].id == id ) {
                $scope.partsLists[x].selectedAmountQuantity = quantity;
            }
          }

        }

        if(typeof quantity === "undefined") {
            console.log( 'undefined ko gard' )
            $scope.quantityVal[id] = true;
        }else {
            $scope.quantityVal[id] = false;
        }

      }  

      $scope.PreviewCalculateTotalAmount = function PreviewCalculateTotalAmount( price, quantity, index, id, part ) {
        if ( $scope.singlePartAmount ) {
          $scope.singlePartAmount[id] = price * quantity;

          for( x in $scope.partsLists ) {
            if ( $scope.partsLists[x].id == id ) {
                $scope.partsLists[x].selectedAmountQuantity = quantity;
            }
          }

        }
      }

      // console.log( $scope.partsLists ); 


      // load functions
      
      $(".existing_customer_lists_wrapper").select2({
          placeholder: "Search for existing customer",
          allowClear: true
      });
      
      $(".inventory-parts-list").select2({
          placeholder: "Search for part(s) needed",
          allowClear: true
      });


      // $scope.$on( "show-estimation-add" , 
      //   function onReceive ( ) {
          $scope.getServices();
          $scope.getExistingCustomer();
          $scope.getInventoryLists();
        // });
    }
  ])
  .controller('estimationViewCtrl', [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {
      $scope.estimationList = {};
      $scope.showServiceDetailsList = {};
      $scope.getEstimationList = function getEstimationList(){

        CarServer.request("get", '/estimations/getEstimationList',
          function(response){
            $scope.estimationList = response;
            console.log(response);
          });
      }

      // show services
      $scope.showServices = function showServices(list){
        console.log(list);
        CarServer.request("get", '/services/' + list + '/showCustomerServices',
          function(response){
            console.log(response);
            $scope.showServiceDetailsList = response;
            $('#showCustomerServices').modal('show');
          })
      }

      // ready for ready for job order
      $scope.readyForJobOrder = function readyForJobOrder(list){
        CarServer.request("get", '/estimations/' + list + '/readyForJobOrder',
          function(response){
            $scope.getEstimationList();
          });
      }

      // delete estimation
      $scope.deleteEstimation = function deleteEstimation(list){

        console.log(list);
        CarServer.request("get", "/estimations/" + list.estimation_id + "/deleteEstimation",
          function(response){
            $scope.estimationList.splice($scope.estimationList.indexOf(list), 1);
          });
      }

      $scope.getEstimationList();

      $scope.$on( "show-estimation-view" , 
        function onReceive ( ) {
            $scope.getEstimationList();
        });
    }
  ])
  .controller('summaryViewCtrl', [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {
      $scope.$on( "show-summary" , 
        function onReceive ( ) {
          
        });
    }
  ])
  .controller('customerCtrl', [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {
      $scope.$on( "show-customer" , 
        function onReceive ( ) {
          
        });
    }
  ])
  .controller("jobOrderCtrl", [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {

      $scope.jobOrderList = {};

      $scope.getJobOrder = function getJobOrder(){
        CarServer.request("get", '/job_orders/showJobOrder',
          function(response){
            $scope.jobOrderList = response;
            console.log(response);
          });
      }

      // show services
      $scope.showServices = function showServices(list){
        console.log(list);
        CarServer.request("get", '/services/' + list + '/showCustomerServices',
          function(response){
            console.log(response);
            $scope.showServiceDetailsList = response;
            $('#showCustomerServices').modal('show');
          })
      }

      $scope.jobDone = function jobDone(list){
        CarServer.request("get", '/job_orders/' + list + '/jobDone',
          function(response){
            $scope.getJobOrder();
          });
      }

      $scope.jobUnDone = function jobUnDone(list){
        CarServer.request("get", '/job_orders/' + list + '/jobUnDone',
          function(response){
            $scope.getJobOrder();
          });
      }

      // delete estimation
      $scope.deleteEstimation = function deleteEstimation(list){

        console.log(list);
        CarServer.request("get", "/estimations/" + list.estimation_id + "/deleteEstimation",
          function(response){
            $scope.jobOrderList.splice($scope.jobOrderList.indexOf(list), 1);
          });
      }


      $scope.$on("show-joborder",
        function onReceive(){
          $scope.getJobOrder();
      });
    }
  ])
.controller("settingsCtrl", [
  "$scope",
  "$http",
  "CarServer",
  function controller($scope, $http, CarServer){

    $scope.users = {};
    $scope.User = {};
    $scope.edit = {};
    $scope.serviceList = {};
    $scope.service = {};
    $scope.edit_service = {};
    $scope.manufacturerList = {};
    $scope.manufacturer = {};
    $scope.edit_manufacturer = {};

    $scope.getUser = function getUser(){
      CarServer.request("get", "/users/getUserInfo",
        function(response){
          console.log(response);
          $scope.users = response;
        });
    }

    $scope.createUser = function createUser(){

      CarServer.request("post", "/users/createUser",
        function(response){
          $scope.getUser();
          $("#user").modal('hide');
        }, $scope.User);
    }

    $scope.deleteUser = function deleteUser(list){

      CarServer.request("get", '/users/' + list.id + '/deleteUser',
        function(response){
           $scope.users.splice($scope.users.indexOf(list) , 1)
        });
    }

    $scope.resetUser = function resetUser(list){

      CarServer.request("get", '/users/' + list + '/resetUser',
        function(response){
          $("#reset-success").modal('show');
        });
    }

    $scope.editUser = function editUser(list){
      $scope.edit = list;
      $("#user-edit").modal('show');
    }

    $scope.updateUser = function updateUser(){
      CarServer.request("post", '/users/updateUser',
        function(response){
          $("#user-edit").modal('hide');
          $scope.getUser();
        }, $scope.edit);
    }

    // get services
    $scope.getServices = function getServices(){
      CarServer.request("get", "/services/getServices",
      function(response){
        $scope.serviceList = response;
      });
    }
    
    // save service
    $scope.createService = function createService(){
      CarServer.request("post", '/services/createService',
        function(response){
          $scope.getServices();
          $("#services").modal('hide');
        }, $scope.service);
    }

    // edit service
    $scope.editService = function editService(list){
      $scope.edit_service = list;
      $("#edit-services").modal('show');
    }

    // update service
    $scope.updateService = function updateService(){

      CarServer.request("post", '/services/' + $scope.edit_service.id + '/updateService',
        function(response){
          $scope.getServices();
          $("#edit-services").modal('hide');
        }, $scope.edit_service);
    }

    // delete service
    $scope.deleteService = function deleteService(list){

      CarServer.request("get", '/services/' + list.id + '/deleteService',
        function(response){
          $scope.serviceList.splice($scope.serviceList.indexOf(list), 1);
        });
    }
    
    // get manufacturer list
    $scope.getManufacturerList = function getManufacturerList(){

      CarServer.request("get", "/manufacturers/getManufacturerList",
        function(response){
          $scope.manufacturerList = response;
        });
    }

    // create manufacturer
    $scope.createManufacturer = function createManufacturer(){
      CarServer.request("post", '/manufacturers/submitManufacturer',
        function(response){
          $scope.getManufacturerList();
          $("#manufacturer").modal('hide');
        }, $scope.manufacturer);
    }

    // edit manufacturer
    $scope.editManufacturer = function editManufacturer(list){
      $scope.edit_manufacturer = list;
      $("#edit-manufacturer").modal('show');
    }

    // update manufacturer
    $scope.updateManufacturer = function updateManufacturer(){
      CarServer.request("post", '/manufacturers/' + $scope.edit_manufacturer.id + '/updateManufacturer',
        function(response){
          $scope.getManufacturerList();
          $('#edit-manufacturer').modal('hide');
        }, $scope.edit_manufacturer);
    }

    $scope.$on("show-settings",
        function onReceive(){
          $scope.getUser();
          $scope.getServices();
          $scope.getManufacturerList();
    });
  }
]);