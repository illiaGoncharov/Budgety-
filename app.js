// Module Pattern
// Private / Public Data 
// Encapsulation ?
// Separation of corners ?

// Controller Module
// 	Add event handler

// UI Module
// 	Get input values 
// 	Add to UI 
// 	Update UI

// Data Module
// 	Add to data structure 
// 	Calculate budget 


// Module for data structure, add/remove operations constructor and public method of data manipulation
var budgetController = (function() {

	// Constructors for income/outcome data packages (names for paramets are different to avoid confusion)
	var Expences = function(id, description, value) {
		this.id = id;
		this.description  = description;
		this.value = value;
	};
	var Income = function(id, description, value) {
		this.id = id;
		this.description  = description;
		this.value = value;
	};

	// Data structure 
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	};

	// Public method to add package to data structure (names for paramets are different to avoid confusion)
 	return {
		addItem: function(type, des, val) {
			var newItem, ID;

			if ( data.allItems[type].length > 0) {
				// Create new ID 
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			};
			
			// Create new Item based on 'inc' and 'exp' type
			if(type === 'exp') {
				newItem = new Expences(type, des, val);
			} else if (type === 'inc') {
				newItem = new Income(type, des, val);
			};
			// Push to data structure
			data.allItems[type].push(newItem);
			// TEST // data.allItems.type.push(newItem);

			// Return New Element
			return newItem;
		},

		testing: function() {
			console.log(data);
		}

	};

})();



var UIControler = (function() {

	var DOMstrings = {
		inpuType: '.add__type',
		inputDescription: '.add__description',
		inpuValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list'
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstrings.inpuType).value, // inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: document.querySelector(DOMstrings.inpuValue).value,
			}
		},

		getDomStrings: function() {
			return DOMstrings;
		},

		// Update UI
		addListItem: function(obj, type) {
			// Create HTML string with a placeholder text
			var html,
				newHTML,
				element;

			if (type === 'inc') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
			} else {};

			// Add real data to placeholder
			// TEST // var newHTML = html.replace(searchValue: '%id%', replaceValue: 'obj.id').replace(searchValue: '%description%', replaceValue: 'obj.description');
			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', obj.value);

			// Add HTML to DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

		}, 

		clearFields: function() {

			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inpuValue);

			console.log(fields);

			// Slice trick to make ann array of HTML list
			fieldsArr = Array.prototype.slice.call(fields);

			// forEach method is great to work with arrays (it can recieve up to 3 arguments/parametrs)
			fieldsArr.forEach(function(current, index, array) {
				current.value = "";
			});

			fieldsArr[0].focus();

			console.log(fieldsArr);
		}
	};

})();



var controller = (function(budgCo, UICo) {
	
	function setEventListeners() {
		var DOM = UICo.getDomStrings();
		// console.log(DOM);
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress', function() {
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			} else {};
		});		
	};

	var ctrlAddItem = function() {
		// 1. Get input
		var input = UICo.getInput();
		// console.log(input);

		// 2. Add data to budgetController 
		newItem = budgetController.addItem(input.type, input.description, input.value);

		// 3. Update UI
		UICo.addListItem(newItem, input.type);

		// 3.5 Clear Feilds 
		UIControler.clearFields();

		// 4. Calc Budget 
 
		// 5. Update Budget UI

	};

	return {
		init: function() {
			console.log('App Started');
			setEventListeners();
		}
	};

})(budgetController, UIControler);

controller.init();