const fs = require('fs');
const jimp = require('jimp');

function getFilesInDir(folder){
    return new Promise((resolve,reject) =>{
        fs.readdir(folder, (err, files) => {
            if(err)
                reject(err)
            
            files = files.filter((filesInFolder) => {
                if(filesInFolder.includes(".jpg") || filesInFolder.includes(".png") || filesInFolder.includes(".jpeg")){
                    if(!filesInFolder.includes("crop_") ){
                        return filesInFolder
                    }
                }
            })
            
            resolve(files)
        });
    })
}



function getLengthFilesInDir(folder){
    return new Promise((resolve,reject) =>{
        fs.readdir(folder, (err, files) => {
            if(err)
                reject(err)

                resolve(files.length)
            });
        })
    }

function getLengthFilesInDirFiltered(folder){
    return new Promise((resolve,reject) =>{
        fs.readdir(folder, (err, files) => {
            if(err)
                reject(err)
                
            files = files.filter((filesInFolder) => {
                if(!filesInFolder.includes("crop_")){
                    //console.log(filesInFolder)
                    return filesInFolder
                }
            })
            resolve(files.length)
        });
    })
}


async function cropImage(path,x,y,width,height){
    //console.log(path)
    let ext = path.split('.')
    let name = path.split('/')
    
    //console.log(`${path.replace(`${name[name.length-1].split('.')[0]}.${ext[ext.length-1]}`,"")}/crop_${name[name.length-1].split('.')[0]}_${Date.now()}.${ext[ext.length-1]}`)
    jimp.read(path)
    .then(image => {
        //console.log(image)
        image.crop( x, y, width, height ).quality(60).write(`${path.replace(`${name[name.length-1].split('.')[0]}.${ext[ext.length-1]}`,"")}/crop_${name[name.length-1].split('.')[0]}_${Date.now()}.${ext[ext.length-1]}`)
    })
    .catch(err => {
      //console.log(err)
    });
}


(async () => {
//console.log(await getFilesInDir("Z:\\Code\\BicingCount\\node_modules"))
//await cropImage('C:/Users/Estev/Desktop/img/1.jpg',159,90,379,319)
//console.log(await getLengthFilesInDir('C:/Users/Estev/Desktop/img/'))
})();


module.exports = { getFilesInDir, cropImage, getLengthFilesInDir, getLengthFilesInDirFiltered }