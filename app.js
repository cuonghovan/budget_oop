// BUDGET CONTROLLER
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  Expense.prototype.calPercentage = function(totalInc) {
    if (totalInc > 0) {
      this.percentage = Math.round((this.value/totalInc)*100);
    } else {
      this.percentage = -1;
    }
  }

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  }

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var calculateTotal = function(type) {
    var sum = 0;
    data.items[type].forEach(function(cur) {
      sum += cur.value;
    });

    data.total[type] = sum;
  }

  var data = {
    items: {
      exp: [],
      inc: []
    },
    total: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: 0
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
    },
    deleteItem: function(type, id) {

      var deleteIndex;

      data.items[type].forEach(function(current, index) {
        if (current.id === id) {
          deleteIndex = index;
        }
      });

      if (deleteIndex !== -1) {
        data.items[type].splice(deleteIndex, 1);
      }
    },
    calculateBudget: function() {
      
      // Total income and expense 
      calculateTotal('inc');
      calculateTotal('exp');

      // Total budget
      data.budget = data.total.inc - data.total.exp;

      // Percentage
      if (data.total.inc > 0 && data.total.exp > 0) {
        data.percentage = Math.round((data.total.exp/data.total.inc)*100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {

      return {
        budget: data.budget,
        totalInc: data.total.inc,
        totalExp: data.total.exp,
        percentage: data.percentage
      }
    },
    calculatePercentage: function() {
      data.items.exp.forEach(function(cur) {
        cur.calPercentage(data.total.inc);
      });
    },
    getPercentages: function() {
      var percentages = data.items.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return percentages;
    },
    test: function() {
      console.log(data)
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
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensePercLabel: '.item__percentage'
  };

  return {
    getDOMStrings: function() {
      return DOMStrings;
    },
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      }
    },
    addItemToList: function(obj, type) {
      
      var html, newHtml, element;

      // Prepare html string with placeholder
      if (type === 'inc') {
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        element = DOMStrings.incomeContainer;
      } else if (type === 'exp') {
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        element = DOMStrings.expenseContainer;
      }

      // Replace placeholder with real data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert new html to DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    removeListItem: function(removedSelector) {
      var el = document.getElementById(removedSelector);
      el.parentElement.removeChild(el);
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
    },
    displayBudget: function(obj) {
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },
    displayExpensePerc: function(percentages) {
      var nodeListForeach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      var itemPercentageNodes = document.querySelectorAll(DOMStrings.expensePercLabel);

      nodeListForeach(itemPercentageNodes, function(cur, index) {
        cur.textContent = percentages[index] + '%';
      });
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };
  
  var updateBudget = function() {
    
    // 1. Calculate budget
    budgetCtrl.calculateBudget();
  
    // 2. Return budget
    var budget = budgetCtrl.getBudget();

    // 3. Display budget
    UICtrl.displayBudget(budget);
  }

  var updatePercentages = function() {
  
    // 1. Calculate percentages
    budgetCtrl.calculatePercentage();
  
    // 2. Return percentages
    var percentages = budgetCtrl.getPercentages();

    // 3. Show percentages in the UI
    UICtrl.displayExpensePerc(percentages);
  }

  var ctrlAddItem = function() {

    // 1. Get field input values
    var input = UICtrl.getInput();

    if (input.description.trim() !== '' && !isNaN(input.value) && input.value > 0) {
      
      // 2. Add new item to budget controller
      var newItem = budgetController.addNewItem(input.type, input.description, input.value);
  
      // 3. Add new item to UI controller
      UICtrl.addItemToList(newItem, input.type);
  
      // 4. Clear the input fields
      UICtrl.clearFields();
  
      // 5. Calculate and update budget
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();
    }
  }

  var ctrlDeleteItem = function(event) {
    var itemId, type, id;

    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      type = itemId.split('-')[0];
      id = parseInt(itemId.split('-')[1]);

      // 1. Delete the item in the data structure
      budgetCtrl.deleteItem(type, id);
  
      // 2. Delete the item in the UI
      UICtrl.removeListItem(itemId);
  
      // 3. Update and show the budget
      updateBudget();
      
      // 4. Calculate and update percentages
      updatePercentages();
    }
  }

  return {
    init: function() {
      setupEventListeners();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
    }
  }
})(budgetController, UIController);

controller.init();
