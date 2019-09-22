
// ****** begin get data from purchased_items.json file  ******
    var product = "";
    var productCost = [];
    var ingredients;
    var purchasedIngredients = {};
    var arrayPurchasedIngredients = [];
    var purchasedURL = 'purchased_items.json';
    var purchasedData = new XMLHttpRequest();
    var conversionItemsArray = [];
    var conversionFactors = {};
    var arrayConversionFactors = [];
    var optionsUS = {style: 'currency', currency: 'USD'};
    var numberFormatUS = new Intl.NumberFormat('en-US', optionsUS);
    
        purchasedData.open('GET', purchasedURL);
        purchasedData.responseType = 'json';
        purchasedData.send();
        purchasedData.onload = function() {   
        purchasedIngredients = purchasedData.response;
        arrayPurchasedIngredients = Object.entries(purchasedIngredients.ingredients);
        populatePurchasedHeader(purchasedIngredients, arrayPurchasedIngredients);
        populatePurchasedTable(purchasedIngredients, arrayPurchasedIngredients);
            };
  
    //  ****** end get data from purchased_items.json file   ****** 

// ****** begin get data from ingredientsByProduct.json file  ******
  
    var requestURL = 'ingredientsByProduct.json';
    var request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();
       
        request.onload = function() {
        ingredients = request.response;
          
        populateSummaryHeader(ingredients);
            }
// ****** end get data from ingredientsByProduct.json file  ******
        
// ****** begin get data from ingredients_convert_units.json file  ****** 
        
    var convertURL = 'ingredients_convert_units.json';
    var convertData = new XMLHttpRequest();
        
        convertData.open('GET', convertURL);
        convertData.responseType = 'json';
        convertData.send();

        convertData.onload = function() {   
        conversionFactors = convertData.response;
          
        arrayConversionFactors =  conversionFactors.ingredients; 
          
   populateConversionHeader(conversionFactors);
   populateConversionTable(arrayConversionFactors);
            };

    //  ****** end get data from ingredients_convert_units.json file   ******   

        //  ****** begin tablink pages  ******  //

function openPage(pageName,element,color) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
    for (i=0; i<tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  tablinks = document.getElementsByClassName("tablink");
    for(i=0; i<tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    }
  document.getElementById(pageName).style.display="block";
  element.style.backgroundColor = color;
}

//  ****** end tablink pages  ******  //
 
   
        // <<<<<<  begin Summary tab  >>>>>> 
        
    //  ****** begin populate the Summary table header  ******  //     
   function populateSummaryHeader(ingredients) {
         var header = document.querySelector('#summaryHeader');
         var titleNode = document.createElement('h1');
         var titleNodeText1 = document.createTextNode('This Program Reports the Estimated Cost of the Ingredients of Selected Baked Goods. Click a Product to Select the Recipe');
         titleNode.appendChild(titleNodeText1);
         header.appendChild(titleNode);
         
         var descriptionNode = document.createElement('h1');
             descriptionNode.innerHTML = 'Contains: ' + ingredients.description;
         header.appendChild(descriptionNode);
        
         var sourceNode = document.createElement('h1');
         sourceNode.innerHTML = 'Recipes Are Sourced ' + ingredients.source;
         header.appendChild(sourceNode);
           
         var paragraph = document.createElement('div'); 
           paragraph.setAttribute("class", "flex-container");
         var ingredientsList = ingredients.product.map((prod) => {
           var figure = document.createElement('figure');
           var img = document.createElement('img'),
               figCaption = document.createElement('figcaption'),
               figTextNode = document.createElement("figtextnode"); 
            img.setAttribute("class", "productImage");
            img.setAttribute("class", "thisImage");
            img.setAttribute("src", prod.photo);
         
            figCaption.setAttribute("class", "productName");

            figCaption.addEventListener('click', function(){ 
             //  document.location.reload();
             var summaryTable =  document.querySelector('#summaryTable');
             summaryTable.innerHTML = "<caption>The Cost of Ingredients of this " + prod.name + " recipe.</caption>";
              populateSummaryTable(prod);
              product = prod.name;
               });
           
            figTextNode.innerHTML = prod.name;
            figCaption.appendChild(figTextNode);
            figure.appendChild(figCaption); 
            figure.appendChild(img);
            
            paragraph.appendChild(figure);
            header.appendChild(paragraph);
         });        
  };
//  ****** end populate the Summary table header  ******  //

//  ****** begin populate the Summary table details  ******  //

  var selectedProduct = [];
  var selectedProductIngredients = [];

function populateSummaryTable(product){
  
  var summaryTable = document.querySelector('#summaryTable'); 
  var row = summaryTable.insertRow(0);
  var cell0 = row.insertCell(0); 
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);
  var cell3 = row.insertCell(3);
  var cell4 = row.insertCell(4);
  var cell5 = row.insertCell(5);
  var cell6 = row.insertCell(6);
  var cell7 = row.insertCell(7);
    cell0.innerHTML = "<b>Ingredient</b>";
    cell1.innerHTML = "<b>Amount</b>";
    cell2.innerHTML = "<b>Recipe Unit</b>";
    cell3.innerHTML = "<b>Purchase Unit</b>";
    cell4.innerHTML = "<b>Purchase Unit Price</b>";
      cell4.setAttribute("class", "costTitle");
    cell5.innerHTML = "<b>Conversion Factor</b>";
      cell5.setAttribute("class", "convertTitle");
    cell6.innerHTML = "<b>Recipe Unit Price</b>";
      cell6.setAttribute("class", "costTitle");
    cell7.innerHTML = "<b>Ingredient Cost</b>";
      cell7.setAttribute("class", "costTitle");
  
// &&&&& Begin zero out any previous entries &&&&&
      cell0 = "";
      cell1 = 0;
      cell2 = "";
      cell3 = "";
      cell4 = 0;
      cell5 = 0;
      cell6 = 0;
      cell7 = 0;
  var totalCell7 = 0;
  
  // &&&&& End zero out any previous entries &&&&&
  
  
  for (i = 0; i < product.ingredients.length; i++) { 
    ingredients = Object.values(product.ingredients[i]);
    selectedProduct.push(product.ingredients[i]);
    var productIngredients = product.ingredients[i];
    var productName = product.name;
 // console.log(selectedProduct); 
   var row = summaryTable.insertRow(i+1); 
    // begin ingredients, amount, and recipe unit from: ingredientsByProduct.json
     cell0 = row.insertCell(0);
     cell1 = row.insertCell(1);
     cell2 = row.insertCell(2);
       cell0.innerHTML = ingredients[0];
       cell1.innerHTML = ingredients[1]; 
       cell2.innerHTML = ingredients[2]; 
    
   // ***** begin purchase unit cell   *****
   // ***** begin purchase price cell  *****
   // ***** from purchased_items.json  *****
    var purchasedItemsArray = [];
    for (j=0; j<arrayPurchasedIngredients.length;j++){
  purchasedItemsArray.push(Object.entries(arrayPurchasedIngredients[j][1])); 
    };
// console.log(purchasedItemsArray);    
     cell3 = row.insertCell(3);
     cell4 = row.insertCell(4);
    purchasedItemsArray.find(purchaseUnit); 
    function purchaseUnit(purchasedItem) { // the find reference function 
    if (product.ingredients[i].item === purchasedItem[0][1]) { 
        cell3.innerHTML = purchasedItem[1][1]; 
        cell4.innerHTML = parseFloat(purchasedItem[2][1]);
         }
       };       
  // ***** end purchase unit cell *****
  // ***** end purchase price cell  *****
    
  //   ***** begin "conversion cell" from: ingredients_convert_units.json  *****
     for (k=0; k<arrayConversionFactors.length;k++){    conversionItemsArray.push(Object.entries(arrayConversionFactors[k][1])); 
    };
    cell5 = row.insertCell(5);
    cell6 = row.insertCell(6);
   conversionItemsArray.find(unitConversion);  // find function 
    function unitConversion(convertRate) {
      if (product.ingredients[i].item === convertRate[0][1]) { 
        cell5.innerHTML = parseFloat(convertRate[3][1]);
        cell6.innerHTML = Math.round(parseFloat(convertRate[3][1] * cell4.innerHTML * 100, 3))/100;
         };
       };    
    // ***** end "conversion" cell  *****
    
    // ***** begin calculated ingredient cost cell  *****
       
     cell7 = row.insertCell(7);
    
       cell7.innerHTML = Math.round(parseFloat(cell1.innerHTML * cell6.innerHTML*100))/100; 
    
// console.log(typeof(parseFloat(cell1.innerHTML * cell6.innerHTML*100)/100));
    
       totalCell7 = totalCell7 + Math.round(parseFloat(cell1.innerHTML * cell6.innerHTML*100)/100); 
    
// console.log(typeof(Math.round(parseFloat(totalCell7))));
    
    // ***** end ingredient cost cell  *****
  }; 
  var tFooter = summaryTable.createTFoot(),
      tFRow = tFooter.insertRow(),
      tFDetail0 = tFRow.insertCell(0),
      tFDetail1 = tFRow.insertCell(1),
      tFDetail2 = tFRow.insertCell(2),
      tFDetail3 = tFRow.insertCell(3),
      tFDetail4 = tFRow.insertCell(4),
      tFDetail5 = tFRow.insertCell(5),
      tFDetail6 = tFRow.insertCell(6),
      tFDetail7 = tFRow.insertCell(7);
  
      tFDetail0.setAttribute("style", "background-color: red");
      tFDetail1.setAttribute("style", "display: none");
      tFDetail2.setAttribute("style", "display: none");
      tFDetail4.setAttribute("style", "display: none");
      tFDetail3.setAttribute("colspan", 4);
      tFDetail3.innerHTML = ("Total Cost of " + product.name +  " Ingredients:");
      tFDetail7.innerHTML = parseFloat(totalCell7);
        tFDetail7.setAttribute("class", "cost");
  
  
 // console.log(tFDetail7.innerHTML);  
  };
        
//  ****** end populate the Summary table details  ******  //

     // <<<<<<  end Summary tab  >>>>>> 

     // <<<<<<  begin Purchased tab  >>>>>> 

//  ****** begin populate the Purchased header  ******  //

   function populatePurchasedHeader(purchasedIngredients) {
     var pageTab = document.querySelector("#purchasedHeader");        
     var titleNode = document.createElement('h2');
     var titleNodeText = document.createTextNode('This Page Reports the Purchase Cost of the Ingredients');
         titleNode.appendChild(titleNodeText);
         pageTab.appendChild(titleNode);
     var subtitleNode = document.createElement('h2');
     var subtitleNodeText = document.createTextNode(purchasedIngredients.description);
     subtitleNode.appendChild(subtitleNodeText);
     pageTab.appendChild(subtitleNode);
   };
  
//  ****** end populate the Purchased header  ******  //

//  ****** begin Populate the Purchased table  ******  // 
  function populatePurchasedTable(purchasedIngredients, arrayPurchasedIngredients) {
//    console.log(arrayPurchasedIngredients);
   var purchasedTable = document.querySelector('#purchasedTable'); 
    var row = purchasedTable.insertRow(0);
     var cell0 = row.insertCell(0); 
     var cell1 = row.insertCell(1);
     var cell2 = row.insertCell(2);
    
      cell0.innerHTML = "<b>Ingredient</b>";
      cell1.innerHTML = "<b>Purchased Unit</b>";
      cell2.innerHTML = "<b>Unit Price</b>";
 
   for (i = 0; i < arrayPurchasedIngredients.length; i++) {
    var row = purchasedTable.insertRow(i+1);
     var cell0 = row.insertCell(0);
       cell0.innerHTML = arrayPurchasedIngredients[i][1].item; 
     var cell1 = row.insertCell(1);
       cell1.innerHTML = arrayPurchasedIngredients[i][1].Punit;
     var cell2 = row.insertCell(2);
       cell2.innerHTML = arrayPurchasedIngredients[i][1].PPrice;
     };
   };   
    
//  ****** end populate the Purchased table  ******  //

    // <<<<<<  end Purchased tab  >>>>>> 

    // <<<<<<  begin Conversion tab  >>>>>> 

//  ****** begin populate the Conversion header  ******  //
   
   function populateConversionHeader(conversionFactors) {
     var conversionHeader = document.querySelector("#conversionHeader"); 
     var titleNode = document.createElement('h1');
     var titleNodeText = document.createTextNode('This Page Reports the Measured Conversion Factors. The Conversion Factors represent the measured number of Recipe Units per Purchased Unit.');
         titleNode.appendChild(titleNodeText);
         conversionHeader.appendChild(titleNode);
     
     var subtitleNode = document.createElement('h2');
     var description = conversionFactors.description;
     subtitleNode.innerHTML = description;
     conversionHeader.appendChild(subtitleNode);
   };

//  ****** end populate the Conversion header  ******  

//  ****** begin populate the Conversion table  ******  
  function populateConversionTable(conversionFactors) {
   var tableConversion = document.querySelector("#conversionTable");
    var row = tableConversion.insertRow(0);
    var cell0 = row.insertCell(0); 
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
     cell0.innerHTML = "Ingredients";
     cell1.innerHTML = "Recipe Unit";
     cell2.innerHTML = "Purchase Unit";
     cell3.innerHTML = "Conversion Factor";
     cell4.innerHTML = "Conversion Source";
    arrayConversionFactors = Object.entries(conversionFactors); 
    
  for (i = 0; i < arrayConversionFactors.length; i++) { 
   var row = tableConversion.insertRow(i+1);
    var cell0 = row.insertCell(0);
        cell0.innerHTML = arrayConversionFactors[i][1].item;  // from .json file
    var cell1 = row.insertCell(1);
        cell1.innerHTML = arrayConversionFactors[i][1].RecipeUnit; // from .json file
    var cell2 = row.insertCell(2);
        cell2.innerHTML = arrayConversionFactors[i][1].PurchaseUnit; // from .json file
    var cell3 = row.insertCell(3);
        cell3.innerHTML = arrayConversionFactors[i][1].convert; // from from.json file.
    var cell4 = row.insertCell(4);
        cell4.innerHTML = arrayConversionFactors[i][1].source; // from from.json file.
   };
  };
//  ****** end populate the Conversion table  ******  //

    // <<<<<<  end Conversion tab  >>>>>> 
 

