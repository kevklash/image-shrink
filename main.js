const { app, BrowserWindow } = require('electron')

// Set environment
process.env.NODE.ENV = 'development'

// Checking environment
const isDev = process.env.NODE.ENV !== 'production' ? true : false
// Console loggin the platform
console.log(process.platform)
const isWindows = process.platform == 'win32' ? true : false

let mainWindow

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: 500,
        height: 600,
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        resizable: isDev ? true : false
    })

    mainWindow.loadURL(`file://${__dirname}/app/index.html`)
    // With loadURL we need to define a protocol, e.g. file, https, etc
    // mainWindow.loadURL(`https://www.twitter.com`)
    // With loadFile we don't need to define a protocol, e.g.
    // mainWindow.loadFile('/app/index.html')
}

app.on('ready', createMainWindow)

app.allowRendererProcessReuse = true