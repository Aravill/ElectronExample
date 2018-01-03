const electron = require("electron");
const {ipcRenderer} = electron;

const form = document.querySelector("form");
form.addEventListener("submit", submitForm);

function submitForm(e){
  e.preventDefault();
  let task = document.querySelector("#task").value;
  ipcRenderer.send("task:add", task);
}
