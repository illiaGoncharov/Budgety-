// BUDGETY


// Data Structure • Sonstructors for add / remove operations • Public methods for data manipulations
var budgetController = (function() {

	// Constructors for income / outcome data packages (names for parametes are different to avoid confusion)
	var Expenses = function(id, description, value) {
		this.id = id;
		this.description  = description;
		this.value = value;
		this.percentage = -1;
	};

	Expenses.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0) {
			this.percentage = ((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1; 
		};
		
	};

	Expenses.prototype.getPercentage = function() {
		return this.percentage;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description  = description;
		this.value = value;
	};
	var CalcTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(curent) {
			sum += curent.value;
		});	
		data.totals[type] = sum;
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
		},
		budget: 0,
		// -1 for "not exist"
		percentage: -1
	};

	// Public methods of data manipulation
 	return {

 		// Add  
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
				newItem = new Expenses(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			};
			// Push to Data Structure
			data.allItems[type].push(newItem);
				// TEST :: data.allItems.type.push(newItem);
			// Return New Element
			return newItem;
		},

		// Delete (.map metod to loop through our data st. and get ids + .indexOf metod to get their indexes)
		deleteItem: function(type, id) {
			// console.log('1 deleting inside');
			var ids,
				index;
			ids = data.allItems[type].map(function(current) {
				// console.log('2 return id');
				return current.id;
			});
			index = ids.indexOf(id);
			// .splice is defferent from .slice because it mutates an array 
			if (index !== -1) {
				// console.log('3 return id');
				data.allItems[type].splice(index, 1);
			} else {};
		},

		// Calc Whole Budg
		calculateBudget: function() {
			// calculate all income and expenses 
			CalcTotal('inc');
			CalcTotal('exp');
			// calc budget (income - expenses)
			data.budget = data.totals.inc - data.totals.exp; 
			// calc percentage
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
			} else {
				data.percentage = -1;
			}
		},

		// Calc Percentages 
		calculatePercentages: function() { 
			data.allItems.exp.forEach(function(cur) { 
				cur.calcPercentage(data.totals.inc); 
			});
		},

		getPercentages: function() {
			var allPerc = data.allItems.exp.map(function(cur) {
				return cur.getPercentage();
			});
			return allPerc;
		},

		// Return Budget 
		getBudget: function() {
			return {
				budget: data.budget,
				expTotal: data.totals.exp,
				incTotal: data.totals.inc,
				percentage: data.percentage	
			}
		},

		// Basic Testing public method 
		testing: function() {
			console.log(data);
		}
	};
})();


// UI Manipulations 
var UIControler = (function() {

	// list of DOM strings in case of name changes in DOM 
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel:'.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container:'.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};

	var formatNumber = function(num, type) {
		var numSplit, 
			int, 
			dec, 
			type,
			sign;
		num = Math.abs(num);
		// Decimal Points (.6578 to .65 and + .00 if nothing)
		num = num.toFixed(2);

		numSplit = num.split('.');
		int = numSplit[0];
		if(int.length > 3) {
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
		}
		dec = numSplit[1];
		return (type === 'exp' ? '- ' : '+ ') + int + "." + dec;
	};

	var nodeListForEach = function(list, callback) {
		// console.log('2. nodelist to array');
		for(var i = 0; i < list.length; i++) {
			callback(list[i], i);
		};	 
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstrings.inputType).value, // inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			}
		},

		// Update UI +
		addListItem: function(obj, type) {
			// Create HTML string with a placeholder text
			var html,
				newHTML,
				element;
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
			} else {};
			// Add real data to placeholder
			// TEST // var newHTML = html.replace(searchValue: '%id%', replaceValue: 'obj.id').replace(searchValue: '%description%', replaceValue: 'obj.description');
			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));
			// Add HTML to DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
		}, 

		// Update UI -
		deleteListItem: function(selectorID) {
			var element;
			element = document.getElementById(selectorID);
			element.parentNode.removeChild(element);
		},

		clearFields: function() {
			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
			// Slice trick to make ann array of list ?
			fieldsArr = Array.prototype.slice.call(fields);
			// forEach method is great to work with arrays (it can recieve up to 3 arguments/parametrs)
			fieldsArr.forEach(function(current, index, array) {
				current.value = "";
			});
			fieldsArr[0].focus();
			// console.log(fieldsArr);
		},

		displayBudget: function(obj) {
			var type;
			obj.budget > 0 ? type = 'inc' : type = 'exp';
			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.incTotal, 'inc');
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.expTotal, 'exp');
			if(obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			};
		},

		displayPercentages: function(percentages) {
			// console.log('1. started display');
			var fields;
			fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
			nodeListForEach(fields, function(current, index){
				// console.log('3. ui update');
				if(percentages[index] > 0) {
					current.textContent = percentages[index] + "%";
				} else {
					current.textContent = '---';
				};
			});
		}, 

		displayMonth: function() {
			var now,
				year,
				month;
			now  = new Date();
			year = now.getFullYear();
			month = now.getMonth();
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
		},
 
		changedType: function() {
			var fields = document.querySelectorAll(
					 DOMstrings.inputType + ', ' + 
					 DOMstrings.inputDescription + ', ' + 
					 DOMstrings.inputValue
				);
			nodeListForEach(fields, function(cur) {
				cur.classList.toggle('red-focus'); 
			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
		},

		getDomStrings: function() {
			return DOMstrings;
		}
	};
})();


// Global App Controller 
var controller = (function(budgCo, UICo) {

	function setEventListeners() {
		var DOM = UICo.getDomStrings();
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress', function(event) {
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			} else {};
		});		
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
		document.querySelector(DOM.inputType).addEventListener('change', UICo.changedType);
	};

	var updateBudget = function() {
		// Calc budget 
		budgCo.calculateBudget();
		// Return budget 
		var budget = budgCo.getBudget();
		// Display budget UI
		UICo.displayBudget(budget);
	};

	var updatePercentages = function() {

		// 1. Calc percentages
		budgCo.calculatePercentages();

		// 2. Read percentages from budget controller 
		var percentages = budgCo.getPercentages();

		// 3. Update UI
		UICo.displayPercentages(percentages);
	};

	var ctrlAddItem = function() {
		// 1. Get input
		var input = UICo.getInput();
		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			// 2. Add data to budgetController 
			newItem = budgetController.addItem(input.type, input.description, input.value);
			// 3. Update UI
			UICo.addListItem(newItem, input.type);
			// 4 Clear Feilds 
			UIControler.clearFields();
			// 5. Update Budget UI
			updateBudget();
			// 6. Update Percentages 
			updatePercentages();
		} 
	};

	var ctrlDeleteItem = function(event) {
		var itemID, 
			splitID,
			type;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemID) { 
			splitID = itemID.split("-");
			type = splitID[0];
			ID = parseInt(splitID[1]);
			// 1. Delete item from Data Str.
			budgCo.deleteItem(type, ID); 
			// 2. Delete item from DOM aka UI
			UICo.deleteListItem(itemID);
			// 3. Update and show Budget
			updateBudget();
			// 4. Update Percentages 
			updatePercentages();
		}
	};

	return {
		init: function() {
			console.log('App has Started');
			UICo.displayMonth();
			UICo.displayBudget({
				budget: 0,
				expTotal: 0,
				incTotal: 0,
				percentage: 0
			});
			setEventListeners();
		}
	};

})(budgetController, UIControler);


controller.init();