   /* Aplicacion para llevar un control de tus gastos semanales */

   //Loader 
   window.addEventListener('load', ()=>{
      setTimeout(() => {
         const loader = document.getElementById('contenedor_carga');
         loader.style.visibility= 'hidden';
         loader.style.opacity=0;
      }, 3000);
   });

  //Guardo el presupuesto ingresado

   var rest = 0; 

   $('#addBudget').click(function saveBudget(){
      let initialbalance = parseInt(document.getElementById('initialBalance').value);

      if(initialbalance < 1 || isNaN(initialbalance) ){
         showError("#errorMessage--Balance", "La cantidad ingresada no es valida, por favor intente nuevamente");
         return;
      } 
      
   //Guardo el presupuesto y gastos en el LocalStorage
      localStorage.setItem("Presupuesto", initialbalance);
      localStorage.setItem("expenses", JSON.stringify([])); 
      refreshView();
   });

   const refreshView = ()=>{
      let initialbalance = localStorage.getItem("Presupuesto");
      rest = initialbalance;

      let divBudget = document.getElementById("divBalance");
      let divExpense = document.getElementById("divExpense");
      let divRemaining = document.getElementById("divRemaining");
      let divList = document.getElementById("divList");

      let balance = `<div class="card-body" id="balance">
                        <div class="alert alert-primary">Presuesto: $ ${initialbalance} </div>
                        <div class="" id="remainingBalance">Saldo Restante: $${rest} </div>
                        <div id="alert-error"></div>
                     </div>`

      divBudget.style.display="none";
      divExpense.style.display="none";
      divList.style.display="none";
      divRemaining.style.display="none";

      if (!initialbalance){  
         divBudget.style.display="block";
      } else {
            divBudget.style.display="none";
            divExpense.style.display="block";
            divRemaining.style.display="block";
            divRemaining.innerHTML=balance;
            refreshList();
      }
   }

   // Creo el constructos
   class Expense {
      constructor (nombre, valor){
         this.nombre = nombre.toString();
         this.valor = parseInt(valor);
      }
   
   }

   //Creo una funcion que permita añadir un nuevo gasto (Objeto) al array de gastos

   $('#btnAdd').click( function addExpense() {
      nombre = document.getElementById("name").value;
      valor = parseInt(document.getElementById("price").value);

      if(nombre.trim()=='') {
         showError('#errorMessage--Expense--Name', 'Nombre invalido, intente nuevamente');
         return;
      } else if (valor < 1 || isNaN(valor)){
         showError('#errorMessage--Expense--Price', 'Precio invalido, intente nuevamente');
         return;
      }
      if(valor > rest){
         showError('#errorMessage--Expense--Price', 'El valor ingresado es mayor al saldo restante');
      }

   //Busco datos almacenados en el localStorage
   
      let expenses = JSON.parse(localStorage.getItem('expenses'));
      expenses.push(new Expense (nombre, valor));
      localStorage.setItem('expenses', JSON.stringify(expenses));
      refreshView();  
      document.getElementById('product-form').reset();
      

      
   });   
   
   const refreshList = ()=>{
      divList.style.display="block";
      let initialbalance = localStorage.getItem("Presupuesto");
      let expenses = JSON.parse(localStorage.getItem('expenses'));

      let totalGastos = 0;
      let expense = ``;

      expenses.map(gasto=>{
         expense += `<li id="item">
                        <span id="item--title">${gasto.nombre}</span>
                        <span id="item--price"> ${gasto.valor}</span>

                     </li>`;

         totalGastos+=parseInt(gasto.valor)
      });

      console.log('Total de gastos : ' + totalGastos);

      rest = initialbalance - totalGastos;

      let resto = document.getElementById('remainingBalance');
      resto.innerHTML = 'Saldo Restante: $ ' + rest;


      if((initialbalance/4) > rest) {
         resto.className = "alert alert-danger";
         showError("#alert-error", "Tu presupuesto semanal esta en niveles criticos, modera tus Gastos!!")
      } else if((initialbalance/2) > rest){
         resto.className = "alert alert-warning";
      } else {
         resto.className = "alert alert-success";
      }

      if(rest <= 0){
         let blockButton = document.getElementById("btnAdd");
         blockButton.disabled=true;
         showError("#alert-error", "Ya no dispones de saldo, no puedes agregar mas gastos!!")
      }
     

      let list = document.getElementById('product-list');
      list.innerHTML = ``;



      list.innerHTML = `${expense}
                        <button  class="btn btn-outline-dark" onclick="resetBalance()" style="width: 100%;">Reiniciar Presupuesto</button>`;
   }

   
   const resetBalance = ()=>{
      localStorage.clear();
      location.reload(true);
   }

   const showError = (element, message) =>{
      divError = document.querySelector(element);
      divError.innerHTML = `<p class="alert-error"> ¡${message}!</p>`;
      setTimeout(() => {
         divError.innerHTML=``;
      }, 3000);

   }

