const electron = require("electron");
const {ipcRenderer} = electron;

let ul = document.querySelector("ul");

//Catch add task from main window
ipcRenderer.on("task:add", function(e, task){
  //Style UL
  ul.className = "collection";
  //Create new list element
  let li = document.createElement("li");
  //Create text node for list element
  let itemText = document.createTextNode(task);
  li.className = "collection-item";
  li.appendChild(itemText);
  ul.appendChild(li);
});

//Catch clear task from main window
ipcRenderer.on("task:clear", function(){
  //Clear UL
  ul.innerHTML = "";
  if(ul.children.length == 0){
    ul.className = "";
  }
});

//Catch double click event on UL to remove item
ul.addEventListener("dblclick", removeItem);
function removeItem(e){
  e.target.remove();
  if(ul.children.length == 0){
    ul.className = "";
  }
}
