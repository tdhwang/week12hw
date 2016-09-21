var inquirer = require('inquirer');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "koreanfury192", //Your password
    database: "Bamazon",
    debug: false
})

connection.connect(function(err) {
    if (err) {console.log(err)};
});

function listItems() {
  connection.query('SELECT * FROM Products ORDER BY ItemID', function(error, rows, fields){
    if (error) {console.log(error)};
    var strOutput = "   ";
    for (var i = 0; i < fields.length; i++) {
      strOutput += fields[i].name;
      strOutput += "   |   ";
    }
    console.log(strOutput);

    

    for (var j = 0; j < rows.length; j++) {
      strOutput = "";
      strOutput += rows[j].ItemID + " | " + rows[j].Producto + "   | " + rows[j].Department + "   | " + rows[j].Price + "   | " + rows[j].StockQuantity;
      console.log(strOutput);
    }
    begin();
  });
}


function begin() {
  
  inquirer.prompt([{
    type: 'input',
    message: 'Which item would you like to purchase?',
    name: 'itemNum'
  }]).then(function(response){
    inquirer.prompt([{
      type: 'input',
      message: 'How many?',
      name: 'qty'
    }]).then(function(res){

      console.log("I'm here in the second question before the query ");
      // console.log(res.qty);
      var query = "SELECT StockQuantity, Price FROM Products WHERE ItemID=" + response.itemNum; 
      connection.query(query, function(er, rows){
        if (er) {console.log(er)};
        if (rows[0].StockQuantity < res.qty) {
          console.log("Insufficient quantity in stock!");
        } else {
          // This means updating the SQL database to reflect the remaining quantity.
          query = "UPDATE Products SET StockQuantity = " + (row[0].StockQuantity - res.qty) + " WHERE ItemID =" + response.itemNum;
          // console.log(query);
          connection.query(query, function(error1, res){
            if(error1){console.log(error1)}
          });

          // Once the update goes through, show the customer the total cost of their purchase.
          var totalCost = res.qty * row[0].price;
          console.log(" You owe me: " + totalCost);
          begin();
        }
      });
    });
  });
}

listItems();
// connection.end();