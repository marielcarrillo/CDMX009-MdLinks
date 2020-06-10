let fs = require ('fs')
const fetch = require('node-fetch')
//const colors = require('colors')
const path = require('path');

function init() {
    let index = process.argv.indexOf('--file')
    let uri = process.argv[index + 1]
    if (index<0) {
      console.log('Use the flag --file before your path, hommie')
      return false
    }
    else if (path.extname(uri) != '.md'){ 
      console.log('Ths is not a markdown file')
      return false 
    }
    else if (path.extname(uri) === '.md') { 
      let string = fs.readFileSync(uri, 'utf8')
      //console.log(uri)
      return string
    }
    else{  
      console.log('Something´s wrong try again baby :( ')
      return false
    }
}

function findLink(string) { 
    let file = (`Content:${string.toString()}`)
    let regexp = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    let links = file.match(regexp)
    //console.log(links)
    return links
}


function array(links) { 
    
    const results = links.map(link => fetch(link)
    .then( res  => {
        //const validatedLinks= []
        if(res.status == 200){
            //console.log(`${link} good one `.underline.brightGreen)
            let goodResult = {
                url: link,
                status: res.status,
                text: res.statusText 
            }
            //return validatedLinks.push(goodResult)
            return goodResult
        }
        else if (res.status == 404){
            //console.log(`${link} bad one`.underline.brightRed)
            let badResult = {
                url: link,
                status: res.status,
                text: res.statusText 
            }
            //return validatedLinks.push(badResult)
            return badResult
        }
    })
    .catch(
     error => {
        console.log(`${error.url} bad one.`)
    })
    )
   
    // console.log('que ondi:', results)
    // return Promise.all(results).then(resp => {
    //     resp 
    // } ) 
    return results 
   };
   
function validate (array){
    const validations = Promise.all(array)
    .then(res => {
        //console.log('this is an array validate:', res)
        //stats(res)
        return res
    })
    
        
        return validations
}    
    
function stats(res){
    //console.log('this is an array for stats:', res)
    console.log("✔ Total Links:",res.length)
    console.log("✔ Total Working Links: ",res.reduce((acc, el)=>{
        //console.log(el.status === 200)
            if(el.status === 200){      
                return acc +=1
        }
        return acc ++
    },0))
    console.log("✖ Total Broken links: ",res.reduce((acc, el)=>{
        //console.log(el.status === 404)
        if(el.status === 404){
            return acc+=1
        }
        return acc ++       
        },0))

}







let validateStats =async () => {
 let getInit = init()
 let getLinks = findLink(getInit)
 let getArray =  array (getLinks)
 let getVal=  await validate(getArray)
 let getStats=  await stats(getVal)
 return getStats
}
validateStats();