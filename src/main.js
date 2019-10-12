const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron')
const utils = require('./utils');

let win

function createWindow() {
  // Crea la ventana del navegador.
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
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
          }
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
            alert("GiR!")
          },
          accelerator: 'CmdOrCtrl + Shift + H'
        }
      ]
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })

}

app.on('ready', createWindow)

ipcMain.on('filesToCrop', async(event, arg) => {
  console.log(arg) // prints "ping"
  for(let i = 0 ; i < arg.length ; i++){
    await utils.cropImage(arg[i].fileName,arg[i].x,arg[i].y,arg[i].width,arg[i].height)
  }

})

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

