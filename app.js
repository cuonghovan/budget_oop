// BUDGET CONTROLLER
var budgetController = (function() {

})();

// UI CONTROLLER
var UIController = (function() {

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      }
    },

    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListeners = function() {
    
    var DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
  
    document.addEventListener('keypress', function(event) {
      if(event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function() {

    // 1. Get field input values
    var input = UICtrl.getInput();
    console.log(input)

    // 2. Add new item to budget controller

    // 3. Add new item to UI controller

    // 4. Calculate budget

    // 5. Display the budget on the UI

  }

  return {
    init: function() {
      setupEventListeners();
    }
  }
})(budgetController, UIController);

controller.init();
