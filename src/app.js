const Electron = require("electron");
const URL = require("url");
const Path = require("path");

const {app, BrowserWindow, Menu, ipcMain} = Electron;

process.env.NODE_ENV = "production";

let mainWindow;
let addTaskWindow;

//Wait for app to be ready and create its window
app.on("ready", function(){
  mainWindow = new BrowserWindow({});
  //Load HTML file
  mainWindow.loadURL(URL.format({
    //Path.join ads slashes between separate items
    pathname: Path.join(__dirname, "..", "window", "mainwindow.html"),
    protocol: "file",
    slashes: true
  }));
  //Quit app completely when X button clicked
  mainWindow.on("close", function(){
    app.quit();
  });
  //Build menu from mainMenuTemplate
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Insert menu
  Menu.setApplicationMenu(mainMenu);
});

//Handle creation of add task window
function createAddTaskWindow(){
  addTaskWindow = new BrowserWindow({
    width: 400,
    height: 300
  });
  addTaskWindow.loadURL(URL.format({
    pathname: Path.join(__dirname, "..", "window", "addtaskwindow.html"),
    protocol: "file",
    slashes: true
  }));
  //Example of a more direct way to load url
  //mainWindow.loadURL("file://" + __dirname + "/../window/addtaskwindow.html");
  //Garbage collection handle
  addTaskWindow.on("close", function(){
     addTaskWindow = null;
  });
}

//Catch task:add from addTaskWindow.html
ipcMain.on("task:add", function(e, task){
  mainWindow.webContents.send("task:add", task);
  addTaskWindow.close();
});

//Create menu template
const mainMenuTemplate = [
  {
    label:"File",
    submenu: [
      {
        label: "Add Task",
        click(){
          createAddTaskWindow();
        }
      },
      {
        label: "Clear Tasks",
        click(){
          mainWindow.webContents.send("task:clear");
        }
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click(){
          app.quit();
        }
      }
    ]
  }
];
//If on MAC, add empty object to menu
if(process.platform == "darwin"){
  //Add empty object to beginning of field
  mainMenuTemplate.unshift({});
}
//Add developer tools if not in production
if(process.env.NODE_ENV != "production"){
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });
}
