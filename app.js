//Global Variables
var totalCash = 100;
var gameOver = false;
var timer = 300;

//Fruit Constructor
function Fruit(name, currentPrice){
  this.name = name;
  this.currentPrice = currentPrice;
  this.inv = 0;
  this.totalBought = 0;
  this.totalSpent = 0;
}

//Fruit Array
var apple = new Fruit ('apple', 1);
var orange = new Fruit ('orange', 2);
var banana = new Fruit ('banana', 3);
var grape = new Fruit ('grape', 4);

var fruitArray = [apple, orange, banana, grape];
// console.log(fruitArray);

//When Document Loads
$(function () {
  //Changes the current price every 15 seconds
  setTimeout(endGame, 300000);
  setInterval(changePriceAll, 15000);
  setInterval(updateTimer, 1000);

// buy one share of a fruit
  $('#buyButtons').on('click','button', function () {
    var fruitToBeBought = $(this).closest('td').attr('class');
    // console.log(fruitToBeBought);
        $('*').removeClass('badSell');
    for(var i =0; i < fruitArray.length; i++){
      if(fruitToBeBought == fruitArray[i].name){
        buyOne(fruitArray[i])
      }
    }
    if(totalCash > 100){
      $('#totalCash').css('color', 'green');
    }else if (totalCash < 100){
      $('#totalCash').css('color', 'red');
    }else{
      $('#totalCash').css('color', 'black');
    }

  });

  // sell one share of a fruit
    $('#sellButtons').on('click','button', function () {
      var fruitToBeSold = $(this).closest('td').attr('class');
      // console.log(fruitToBeSold);
            $('*').removeClass('badSell');
      for(var i =0; i < fruitArray.length; i++){
        if(fruitToBeSold == fruitArray[i].name){
          sellOne(fruitArray[i])
        }
      }
      if(totalCash > 100){
        $('#totalCash').css('color', 'green');
      }else if (totalCash < 100){
        $('#totalCash').css('color', 'red');
      }else{
        $('#totalCash').css('color', 'black');
      }

    });


    // //listener for totalCash above or below 100
    // $('button').on('click', function() {
    //   console.log(totalCash);
    //
    //
    // });


});

//Runs changePriceOne on each object in the fruitArray
function changePriceAll() {
  if(!gameOver){
    for (var i =0; i < 4; i++){
      changePriceOne(fruitArray[i]);
      currentPriceUpdate(fruitArray[i]);
    }
  }
}

//Calls priceFluc and adds the value returned to the current price of the inputted fruit object
function changePriceOne(fruit){
  fruit.currentPrice += priceFluc();
  //Checks to ensure fruit price is between 0.50 and 9.99
  if (fruit.currentPrice > 9.99){
    fruit.currentPrice = 9.99;
  } else if (fruit.currentPrice < 0.50) {
    fruit.currentPrice = 0.50;
  }
}

//Returns a random value between -0.50 and 0.50
function priceFluc() {
  var fluc = 0;
  while (fluc.toFixed(2) == 0){
    fluc = (Math.random()-0.50);
  }
  return fluc;
}

//Adds one fruit to the inventory, while deducting the cost from totalCash. Also adds to totalPurchased and totalSpent
function buyOne(fruit){
  if(totalCash >= fruit.currentPrice){
  totalCash -= fruit.currentPrice;
  fruit.inv++;
  fruit.totalBought++;
  fruit.totalSpent += fruit.currentPrice;
  $('#inventory').find('.'+fruit.name).text("Total Owned: " + fruit.inv);
  $('#totalCash').text(totalCash.toFixed(2));
  $('#avgBuyPrices').find('.'+fruit.name).text("Average Buy Price: $ " + (fruit.totalSpent/fruit.totalBought).toFixed(2));
  } else {
  $('#messages').fadeIn(0);
  $('#messages').text("You don't have enough money").fadeOut(1500);
  // $('#messages').text().fadeOut(2000);

  }
}

//Deducts one fruit from the inventory, whild adding the current price to totalCash
function sellOne(fruit){
  if (fruit.inv > 0){
  totalCash += fruit.currentPrice;
  fruit.inv--;
  $('#inventory').find('.'+fruit.name).text("Total Owned: " + fruit.inv);
  $('#totalCash').text(totalCash.toFixed(2));
  } else {
    $('#messages').fadeIn(0);
    $('#messages').text("You don't have enough " + fruit.name + "s");//Update Messages Dom placeholder (You don't have enough 'Fruit')
    $('#messages').fadeOut(1500);
    $('#inventory').find('.'+fruit.name).toggleClass('badSell');
    // $('#inventory').find('.'+fruit.name).delay(1000).toggleClass('badSell');

    // setTimeout(($('#inventory').find('.'+fruit.name).toggleClass('badSell')), 500);
  }
}

function currentPriceUpdate (fruit){
  var nameFruit = fruit.name;
  // console.log(fruit);
  $('#currentPrices').find('.' + nameFruit).text("Current Price: $ " + (fruit.currentPrice).toFixed(2));
}

function endGame () {
  fruitArray.forEach(function(fruit) {
    while(fruit.inv > 0){
      sellOne(fruit);
    }
  });
  if(totalCash > 100){
    $('#messages').fadeIn(0);
    $('#messages').text("Congratulations you made a profit of: $ " + (totalCash-100).toFixed(2));
  } else if (totalCash == 100) {
    $('#messages').fadeIn(0);
    $('#messages').text("You didn't make any profit.");
  } else {
    $('#messages').fadeIn(0);
    $('#messages').text("I'm sorry, you lost: $ " + (100-totalCash).toFixed(2) + ". Don't be a fruit trader");
  }
  $('button').closest('tr').remove();
  gameOver = true;
}

function updateTimer(){
  if(timer > 0){
    timer--;
    $('#timeLeft').text(timer);
    if(timer < 30){
      $('#timeLeft').css('color','red').css('font-size', '1.5em');
    }
  }
}
