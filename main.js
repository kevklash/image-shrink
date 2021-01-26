const { app, BrowserWindow, Menu, globalShortcut, ipcMain } = require('electron')

// Set environment
process.env.NODE.ENV = 'development'

// Checking environment
const isDev = process.env.NODE.ENV !== 'production' ? true : false
// Console loggin the platform
console.log(process.platform)
const isWindows = process.platform == 'win32' ? true : false
const isMac = process.platform == 'darwin' ? true : false

// Application windows
let mainWindow
let aboutWindow

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: isDev ? 800 : 450,
        height: 600,
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        resizable: isDev ? true : false,
        webPreferences: {
            nodeIntegration: true,
        }
        // backgroundColor: 'white'
    })

    if (isDev) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.loadURL(`file://${__dirname}/app/index.html`)
    // With loadURL we need to define a protocol, e.g. file, https, etc
    // mainWindow.loadURL(`https://www.twitter.com`)
    // With loadFile we don't need to define a protocol, e.g.
    // mainWindow.loadFile('/app/index.html')
}

function createAboutWindow() {
    aboutWindow = new BrowserWindow({
        title: 'About ImageShrink',
        width: 300,
        height: 200,
        resizable: false,
        // frame: false // Remove control buttons(close, minimize, etc.)
        // backgroundColor: 'white'
    })

    aboutWindow.loadFile(`${__dirname}/app/about.html`)
    aboutWindow.removeMenu() // Remove menu
}

app.on('ready', () => {
    createMainWindow()
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)
    // Global shortcut example(not required when using roles)
    globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload() )
    mainWindow.on('closed', () => mainWindow = null)
})

const menu = [
    // Setting menu in case of using Mac using roles(submenu items can use roles too)
    ...(isMac ? 
        [{ 
            label : app.name,
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow()
                }
            ] 
        }] : [ 
            
         ]),
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                // Keyboard shortcuts
                accelerator: 'CmdOrCtrl+W',
                // Another way: isWindows ? 'Ctrl+W' : 'Command+W'
                click: () => app.quit()
            }
        ]
    },
    // Creating a new menu and submenu item using roles
    ...(isDev ? [
            {
                label: 'Developer',
                submenu: [
                    { role: 'reload' },
                    { role: 'forcereload' },
                    { type: 'separator' },
                    { role: 'toggledevtools' }
                ]
            }
        ] 
        : 
    []),
    ...(!isMac ? [
            {
                label: 'About',
                submenu: [
                    {
                        label: 'About ImageShrink',
                        click: () => createAboutWindow()
                    }
                ]
            }
        ] 
        : 
    [])    
]

ipcMain.on('image:minimize', (e, options) => {
    console.log(options)
})

app.allowRendererProcessReuse = true