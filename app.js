// BUDGET CONTROLLER
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var data = {
    items: {
      exp: [],
      inc: []
    },
    total: {
      exp: 0,
      inc: 0,
      bud: 0
    }
  }

  return {
    addNewItem: function(type, description, value) {
      
      var newItem, id;

      // Create Id for new item
      if(data.items[type].length > 0) {
        id = data.items[type][data.items[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      // Create item base on type
      if (type === 'exp') {
        newItem = new Expense(id, description, value);
      } else if (type === 'inc') {
        newItem = new Income(id, description, value);
      }

      // Add new item
      data.items[type].push(newItem);

      // Return new data structure
      return newItem;
    }
  }
})();

// UI CONTROLLER
var UIController = (function() {

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list'
  };

  return {
    getDOMStrings: function() {
      return DOMStrings;
    },
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      }
    },
    addItemToList: function(obj, type) {
      
      var html, newHtml, element;

      // Prepare html string with placeholder
      if (type === 'inc') {
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        element = DOMStrings.incomeContainer;
      } else if (type === 'exp') {
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        element = DOMStrings.expenseContainer;
      }

      // Replace placeholder with real data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert new html to DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    clearFields: function() {
      
      var inputList, inputArray;

      // Get and convert list of input elements to array
      inputList = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
      inputArray = Array.prototype.slice.call(inputList);

      // Clear all input values
      inputArray.forEach(function (current, index, array) {
        current.value = '';
      });

      // Place cusor in description input
      inputArray[0].focus();
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

    // 2. Add new item to budget controller
    var newItem = budgetController.addNewItem(input.type, input.description, input.value);

    // 3. Add new item to UI controller
    UICtrl.addItemToList(newItem, input.type);

    // 4. Clear the input fields
    UICtrl.clearFields();

    // 5. Calculate budget

    // 6. Display the budget on the UI

  }

  return {
    init: function() {
      setupEventListeners();
    }
  }
})(budgetController, UIController);

controller.init();
