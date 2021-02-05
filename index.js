const { app, ipcMain, BrowserWindow}=require('electron')
const Scraper                       =require('./scraper');

let mainWindow;
let renderWindow;
let scraper;
let url;
let filename;


app.on('ready',()=>{
    mainWindow=new BrowserWindow({
        webPreferences:{
            nodeIntegration:true
        }
    })
    mainWindow.loadURL(`${__dirname}/index.html`)
})

ipcMain.on('newScrapingInfo',async (event,webUrl,fileName)=>{
    console.log(webUrl,fileName)
    renderWindow=new BrowserWindow({
        webPreferences:{
                            nodeIntegration:true
        }

    })

    renderWindow.loadURL(`${__dirname}/render.html`)
    url=webUrl
    filename=fileName
    
    //renderWindow.webContents.send('new:scrape',webUrl,fileName)
    //console.log('Thats it')
    //let scraper=new Scraper(webUrl,fileName)
    //await scraper.getPage()
    //await scraper.fetching()
    //await scraper.save()
    //console.log(scraper.totalPage)

    
})

ipcMain.on('status:update',(event,status)=>{
    mainWindow.webContents.send('update',status)
    renderWindow.webContents.send('update',status)
})

ipcMain.on('render:ready',(event)=>{
renderWindow.webContents.send('new:scrape',url,filename)

})

ipcMain.on('doc:ready',(event,filePath)=>{
    console.log(filePath)
})
    