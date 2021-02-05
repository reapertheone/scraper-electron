const { JSDOM } = require('jsdom')
const fetch     = require('node-fetch')
const {ipcRenderer}     = require('electron')
const fs        = require('fs')
const path      = require('path')

class Scraper{
    constructor(url,filename){
        this.filename=filename.split(' ').join('_').split('.').join('_')
        this.url=url
        this.status=null
        this.totalPage=null
        //this.name=name
        this.addresses=[]
        this.path=null
    }

    fetching=async function(){
        let regex=new RegExp('[0-9]')
        for(let i=1;i<=this.totalPage;i++){
            let response=await fetch(`${this.url}?page=${i}`)
            let text=await response.text()
            let dom=new JSDOM(text)

            let addresses=dom.window.document.querySelectorAll('.listing__address')
            for(let address of addresses){
                let toCheck=address.textContent
                if(regex.test(toCheck)&&!this.addresses.includes(`Budapest,${toCheck}`)||regex.test(toCheck)&&!this.addresses.includes(`${toCheck}`)){
                    let kerregex=new RegExp('kerület')
                    kerregex.test(toCheck)?this.addresses.push(`Budapest,${toCheck.trim()}`):this.addresses.push(`${toCheck.trim()}`)
                    }
                
            }
            this.status=Math.floor((i/this.totalPage)*100)
            ipcRenderer.send('status:update',this.status)
            
        }
    }

    getPage=async function(){
        let response=await fetch(this.url)
        let text=await response.text()
        let dom=new JSDOM(text)
        const pageNumber=dom.window.document.querySelector('.pagination__page-number').textContent
        this.totalPage = parseInt(pageNumber.split(" ")[3])

    }

    save=async function(){
        let folderPath=path.join(__dirname,`./output_files`)
        let filePath=path.join(folderPath,`${this.filename}_${new Date().getTime()}.json`)
        let data=JSON.stringify(this.addresses)
        fs.writeFile(filePath,data.split('\",').join('\",\n'),(err)=>{
            if(err) throw err;
            if (!fs.existsSync(folderPath)){
                fs.mkdirSync(folderPath);
            }
            console.log(`${filePath}`)
           
        })
        this.path=filePath
    }
    
}

module.exports=Scraper;