const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron')
const utils = require('./utils');

let win
let actualDir;

function createWindow() {
  // Crea la ventana del navegador.
  win = new BrowserWindow({
    width: 1620,
    height: 780,
    titleBarStyle: 'hidden',
    frame: false,
    backgroundColor: '#2e2c29',
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('./src/windows/cropper/index.html')

  //Menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Folder',
          click: function () {
            let options = {properties:["openDirectory"]}
            
            //Or asynchronous - using callback
            dialog.showOpenDialog(options, async (dir) => {
              let allFiles = {
                files: await utils.getFilesInDir(dir[0]),
                dir: dir
              }
              win.webContents.send('getFiles', allFiles);
            })
          },
          accelerator: 'CmdOrCtrl + O'
        },
        {
          type: 'separator'
        },
        {
          label: 'Exit'
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Electron',
          click: function () {
            console.log("GiR!")
          },
          accelerator: 'CmdOrCtrl + Shift + H'
        }
      ]
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  //win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })

}

app.on('ready', createWindow)

ipcMain.on('filesToCrop', async(event, arg) => {
  //console.log(arg) // prints "ping"
  for(let i = 0 ; i < arg.length ; i++){
    //console.log(arg[i].fileName.split('/')[0])
    await utils.cropImage(arg[i].fileName,arg[i].x,arg[i].y,arg[i].width,arg[i].height)
    if(i == arg.length - 1){
      //console.log("END")
      //await loading(arg[i].fileName.split('/')[0])
    }
  }
})

async function loading(dir){
  let count = await utils.getLengthFilesInDirFiltered(dir)
  console.log(count)
  let countPresent = await utils.getLengthFilesInDirFiltered(dir)
  console.log(countPresent)
  while(count != countPresent/2){
    
    countPresent = await utils.getLengthFilesInDir(dir) 
    console.log(count + "---OLD")
    console.log(countPresent/2 + "---PRESENT / 2")
    console.log(countPresent + "---PRESENT")
  }
  
}

//mac
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

