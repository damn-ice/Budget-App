let budgetController = (
    function (){
        let Expense = function(id, description, value) {
            this.id = id,
            this.description = description,
            this.value = value,
            this.percentage = -1
        }
        Expense.prototype.calcPercentage = function (totalIncome) {
            if (totalIncome > 0){
                this.percentage = Math.round((this.value / totalIncome) * 100);
            }else {
                this.percentage = -1;
            }
        Expense.prototype.getPercentage = function () {
            return this.percentage;
        }
            
        }
        let Income = function(id, description, value) {
            this.id = id,
            this.description = description,
            this.value = value
        }
        let data = {
            all: {
                exp: [],
                inc: [],
            },
            total: {
                exp: 0,
                inc: 0,
            },
            budget: 0,
            percentage: -1 // -1 indicate it doesn't exist yet source ... Js Lecturer...
        }
        let calculateTotal = function(type) {
            let sum = 0;
            data.all[type].forEach(cur => {
                sum += cur.value;
            }) 
            data.total[type] = sum;
        }

        return {
            addItem: function(type, desc, val) {
                let newItem, ID;
                if (data.all[type].length > 0){
                   ID = data.all[type][data.all[type].length -1 ].id + 1 
                }else {
                    ID = 0;
                }
                
                if (type === 'exp'){
                    newItem = new Expense(ID, desc, val)
                }else if (type === 'inc'){
                    newItem = new Income(ID, desc, val)
                }
                data.all[type].push(newItem);
                return newItem;
            },
            testing: function(){
                return data;
            },
            calculateBudget: function(){
                calculateTotal('exp');
                calculateTotal('inc');
                data.budget = data.total.inc - data.total.exp;
                if (data.total.inc > 0){
                    data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
                }else {
                    data.percentage = -1;
                }
                
            },
            calculatePercentages: function(){
                data.all.exp.forEach(cur => {
                    cur.calcPercentage(data.total.inc)
                })
            },
            getPercentages: function() {
                let allPercentages = data.all.exp.map(cur => {
                    return cur.getPercentage()
                })
                return allPercentages;
            },
            getBudget: function (){
                let {budget, percentage,  total} = data;
                return {
                    budget,
                    percentage,
                    totalExpense: total.exp,
                    totalIncome: total.inc
                }
            },
            deleteItem: function (type, id){
                let index, ids;
                // indx = data.all[type][id]
                // ans = data.all[type].indexOf(indx);
                // data.all[type].splice(ans, 1)

                // Put all ids of a given type into an Array...
                ids = data.all[type].map(cur => {
                    return cur.id;
                })
                // Get the index number of the target id...
                index = ids.indexOf(id);
                // Removing item from array if found...
                if (index !== -1){
                    data.all[type].splice(index, 1);
                }
            }
        }
    }
)();


let UIController = (function () {
        let DOMString = {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            inputButton: ".add__btn",
            incomeContainer: '.income__list',
            expenseContainer: '.expenses__list',
            budgetLabel: ".budget__value",
            incomeLabel:".budget__income--value",
            expensesLabel: ".budget__expenses--value",
            percentageLabel:".budget__expenses--percentage",
            container:'.container',
            expensePercentage: '.item__percentage',
            dateLabel: '.budget__title--month'

        }
        let formatting = function(num){
            let reverseNumber = function(param) {
                let rev = param.split("").reverse().join('');
                return rev;
            }
            // 12345now becomes 54321
            // 1234567 noe becomes 7654321
            num = reverseNumber(num)
            let n = '';
            let count = 0
            for (let i=0; i < num.length; i++){
                n += num[i]
                if (count === 2) {
                    n += ',' 
                    count = -1
                }
                count++
            }
            ans = reverseNumber(n);
            if (ans.charAt(0) === ',') {
                ans = ans.slice(1)
            }
            return ans;
        };
        let formatNumber =  function(num, type){
            let numSplit, int, dec;
            num = Math.abs(num);
            num = num.toFixed(2);
            numSplit = num.split('.');
            int = numSplit[0];
            int = formatting(int)
            dec = numSplit[1];
            return (type === 'exp' ? '-': '+') + ' ' + int + '.' + dec;
        };

        let nodeListForEach = function(list, callback){
            for (let i=0; i < list.length; i++){
                callback(list[i], i)
            }
        };
        return {
            getInput: function (){
                return {
                    type: document.querySelector(DOMString.inputType).value,
                    description: document.querySelector(DOMString.inputDescription).value,
                    value: parseFloat(document.querySelector(DOMString.inputValue).value),
                }
            },
            addListItem: function(obj, type) {
                let html, element;
                if (type === 'inc'){
                    element = DOMString.incomeContainer;
                    html = `<div class="item clearfix" id="inc-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${formatNumber(obj.value, type)}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"><i></button></div></div></div>`
                }else {
                    element = DOMString.expenseContainer;
                    html = `<div class="item clearfix" id="exp-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix"><div class="item__value">${formatNumber(obj.value, type)}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
                }
                document.querySelector(element).insertAdjacentHTML('beforeend', html)
            },
            deleteListItem: function(selectorID) {
                let el;
                el = document.getElementById(selectorID);
                el.parentNode.removeChild(el);
            },
            clearField: function(){
                let fields, fieldsArr;
                // Returns a JS List?
                fields = document.querySelectorAll(DOMString.inputDescription + ', ' + DOMString.inputValue);
                // Convert JS List To Array... Using Array Prototype property slice...
                fieldsArr = Array.prototype.slice.call(fields);

                fieldsArr.forEach((cur) => {
                    cur.value = "";
                })
                fieldsArr[0].focus();
            },
            displayBudget: function (obj){
                let type;
                obj.budget < 0 ? type = 'exp': type = 'inc';
                document.querySelector(DOMString.budgetLabel).textContent = formatNumber(obj.budget, type);
                document.querySelector(DOMString.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
                document.querySelector(DOMString.expensesLabel).textContent = formatNumber(obj.totalExpense, 'exp');
                if (obj.percentage > 0){
                    document.querySelector(DOMString.percentageLabel).textContent = obj.percentage + '%';
                }else{
                    document.querySelector(DOMString.percentageLabel).textContent = '--';
                }
                
            },
            displayMonth: function (){
                let now, month, months, year
                now = new Date();
                months = [
                    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                    'October', 'November', 'December'
                ]
                month = now.getMonth();
                year = now.getFullYear();
                document.querySelector(DOMString.dateLabel).textContent =months[month] + ' ' + year; 
            },
            displayPercentages: function(percentages){
                let fields = document.querySelectorAll(DOMString.expensePercentage);

                nodeListForEach(fields, function(current, index){
                    if (percentages[index] > 0){
                        current.textContent = percentages[index] + '%'
                    }else {
                        current.textContent = '__'
                    }
                })
            },
            changedType: function (){
                let fields;
                fields = document.querySelectorAll(
                    DOMString.inputType + ',' +
                    DOMString.inputDescription + ',' +
                    DOMString.inputValue
                )
                nodeListForEach(fields, function (cur){
                    cur.classList.toggle('red-focus');
                })
                document.querySelector(DOMString.inputButton).classList.toggle('red')
            },
            getDOMString: function(){
                return DOMString;
            }
        }
    }
)();

let controller = (function (budget, ui){

    let setUpListener = function() {
        let DOM = ui.getDOMString();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddFunc)
        document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13) {
                ctrlAddFunc();
            } 
        }) 
        document.querySelector(DOM.container).addEventListener('click', ctrlDelete);

        document.querySelector(DOM.inputType).addEventListener('change', ui.changedType)
    }

    let updateBudget = function() {
        // Calculate the Budget...
        budget.calculateBudget();
        // Return the budget...
        let budgetData = budget.getBudget(); 
        // Display the result...
        ui.displayBudget(budgetData);
    }

    let updatePercentages = function (){
        budget.calculatePercentages();
        let percentages = budget.getPercentages();
        ui.displayPercentages(percentages);
    }

    let ctrlAddFunc = function () {
        let input, newItem
        // Get the Field input Item...
        input = ui.getInput();      

        if (input.description !== '' && !isNaN(input.value) && input.value > 0){
            // Add items to the budget controller
            newItem = budget.addItem(input.type, input.description, input.value)
            // Add item to the UI
            ui.addListItem(newItem, input.type)
            ui.clearField();
            // Update Budget...
            updateBudget();
            updatePercentages();
        } 
    }

    let ctrlDelete = function(event) {
        let itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budget.deleteItem(type, ID);
            ui.deleteListItem(itemID);
            updateBudget();
            updatePercentages();
        }
        
    }
    // document.querySelector(".add__description").addEventListener("keypress", (event) => {
    //     if (event.keyCode === 13) {
    //         console.log('Enter');
    //     } 
    // })

    return {
        init: function(){
            console.log('App started...');
            ui.displayBudget({
                budget: 0,
                percentage: -1,
                totalExpense: 0,
                totalIncome: 0
            })
            ui.displayMonth();
            setUpListener();
        }
    }
})(budgetController, UIController);

controller.init();