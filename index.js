const { app, ipcMain, BrowserWindow}=require('electron')
const Scraper                       =require('./scraper');

let mainWindow;
let renderWindow;


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
   /* renderWindow=new BrowserWindow({
        webPreferences:{
                            nodeIntegration:true
    }})*/
    let scraper=new Scraper(webUrl,fileName)
    await scraper.getPage()
    await scraper.fetching()
    await scraper.save()
    console.log(scraper.totalPage)
    
})

ipcMain.on('scrape:update',(event,status)=>{
    mainWindow.webContents.send('update',status)
})
    