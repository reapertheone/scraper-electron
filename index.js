const { app, ipcMain, BrowserWindow}=require('electron')
const Scraper                       =require('./scraper');

let mainWindow;
let renderWindow;
let url;
let filename;


app.on('ready',()=>{
    mainWindow=new BrowserWindow({
        
        webPreferences:{
            nodeIntegration:true
        }
    })
    mainWindow.loadURL(`${__dirname}/index.html`)

    mainWindow.on('closed',()=>{
        app.quit()
    })
})

ipcMain.on('newScrapingInfo',async (event,webUrl,fileName)=>{
    console.log(webUrl,fileName)
    renderWindow=new BrowserWindow({
        resizable:false,
        width:300,
        height:200,
        backgroundThrottling:false,
        frame:false,
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

ipcMain.on('abort',()=>{
    renderWindow.close();
    renderWindow=null
})

ipcMain.on('status:update',(event,status)=>{
    mainWindow.webContents.send('update',status)
    renderWindow.webContents.send('update',status)
})

ipcMain.on('render:ready',(event)=>{
renderWindow.webContents.send('new:scrape',url,filename)

})

ipcMain.on('doc:ready',(event,filePath)=>{
    mainWindow.webContents.send('task:ready',filePath)
    renderWindow.close()
    renderWindow=null
    url=null
    filname=null

})

