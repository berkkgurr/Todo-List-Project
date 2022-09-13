//tüm elementleri seçme
const form=document.querySelector("#todo-form");
const todoInput=document.getElementById("todo");
const todoList=document.querySelector(".list-group");
const firstCardBody=document.querySelectorAll(".card-body")[0];
const secondCardBody=document.querySelectorAll(".card-body")[1];
const filter=document.getElementById("filter");
const clearButton=document.getElementById("clear-todos");

eventListeners();

function eventListeners() { //tüm event listener lar
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}
function clearAllTodos() {
    if(confirm("Hepsini silmek istediğinize emin misiniz?")){
          //arayüzden todoları temizleme
          while (todoList.firstElementChild!=null) {
            todoList.removeChild(todoList.firstElementChild);
          }
          localStorage.removeItem("todos");
    }
}
function filterTodos(params) {
    const filterValue=params.target.value.toLowerCase();
    const listItems=document.querySelectorAll(".list-group-item");
    listItems.forEach(function (listItem) {
        const text=listItem.textContent.toLowerCase();

        if(text.indexOf(filterValue)===-1)
        listItem.setAttribute("style","display:none !important");
        else
        listItem.setAttribute("style","display:block");
    })
}
function loadAllTodosToUI(params) {
    let todos=getTodosFromStorage();

    todos.forEach(function (todo) {
        addTodoToUI(todo);
    });
}
function deleteTodo(params) {
    if(params.target.className==="fa fa-remove"){
        params.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(params.target.parentElement.parentElement.textContent);
        showAlert("success","Todo başarıyla silindi..");
    }
}
function deleteTodoFromStorage(todo) {
    let todos=getTodosFromStorage();
    todos.forEach(function (params,index) {
       if(params===todo){
        todos.splice(index,1); //arrayden değeri silme
       }
       
    });
    localStorage.setItem("todos",JSON.stringify(todos));
}
function addTodo(params) {
    const newTodo=todoInput.value.trim(); //trim() boşlukları siler
    let todos=getTodosFromStorage();
    if(newTodo==="")
    showAlert("danger","Lütfen bir todo girin..");
    else if(todos.indexOf(newTodo)!=-1)
    showAlert("warning","Bu todo zaten mevcut..");
    else{
    addTodoToUI(newTodo); //aldığı değeri list item olarak eklemek üzere fonksiyona yolladı
    addTodoStorage(newTodo);
    showAlert("success","Başarıyla eklendi..")
        }
    params.preventDefault();
}
function getTodosFromStorage() {
    let todos;
    if(localStorage.getItem("todos")===null)
    todos=[];
    else
    todos=JSON.parse(localStorage.getItem("todos"));
    return todos;
}
function addTodoStorage(newTodo) {
    let todos=getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));
}
function showAlert(type,message) {
    const alert=document.createElement("div");
    alert.className=`alert alert-${type}`;
    alert.textContent=message;

    firstCardBody.appendChild(alert);

    setTimeout(function () { //setTimeout metodu
        alert.remove();
    },1000);
}
function addTodoToUI(newTodo) {
    const listItem=document.createElement("li"); //list item oluşturma
    const link=document.createElement("a"); //link oluşturma
    link.href="#";
    link.className="delete-item";
    link.innerHTML="<i class = 'fa fa-remove'></i>";

    listItem.className="list-group-item d-flex justify-content-between";
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    todoList.appendChild(listItem); //todolist e list item ı ekleme

    todoInput.value="";
}