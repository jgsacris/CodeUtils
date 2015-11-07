/**
 * This code is base on the pluralsight curse 
 * JavaScript Fundamentals for ES6
 */

/**
 * General Function to combine Promises with Generators
 * to process async functions
 * TODO: Move this from the global name space (window)
 * to a module
 */

(function() {
  var run = function(generator) {
    var sequence;
    //result is the result of calling yield {value:Promise, done:bool}
    var process = function(result) {
      result.value.then(
        function(value) {
          if(!result.done) {
            process(sequence.next(value))
          }
        }, 
        function(error) {
          if(!result.done) {
            process(sequence.throw(error));
          }
      })
    }

    sequence = generator();
    var next = sequence.next();
    process(next);
  }

  window.asyncP = {
    run: run
  }
}());

/**
 * Usage:
 * All async functions have to return Promises
 * For example:
 */

function getStockPriceP() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(50);
    }, 300);
  });
}
function executeTradeP() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(Error('failure!'));
      // resolve();
    }, 300);
  });
}

/**
 * And then you call them in a generator function
 */

(function(){
  function* main() {
      try {
        var price = yield getStockPriceP();
        if(price > 45) {
          yield executeTradeP();
        } else {
          console.log('trade not made');
        }

      } catch(ex) {
        console.log('error! ' + ex.message);

      }
    }

    window.asyncp.run(main);
})()

/**
 * Another variaton of this same ides as explained at:
 * https://www.promisejs.org/generators/
 * by Forbes Lindesay
 */

function async(makeGenerator){
  return function () {
    var generator = makeGenerator.apply(this, arguments);

    function handle(result){
      // result => { done: [Boolean], value: [Object] }
      if (result.done) return Promise.resolve(result.value);

      return Promise.resolve(result.value).then(function (res){
        return handle(generator.next(res));
      }, function (err){
        return handle(generator.throw(err));
      });
    }

    try {
      return handle(generator.next());
    } catch (ex) {
      return Promise.reject(ex);
    }
  }
}