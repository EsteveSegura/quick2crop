const fs = require('fs');
const jimp = require('jimp');

function getFilesInDir(folder){
    return new Promise((resolve,reject) =>{
        fs.readdir(folder, (err, files) => {
            if(err)
                reject(err)
            
            resolve(files)
        });
    })
}

async function cropImage(path,x,y,width,height){
    console.log(path)
    let ext = path.split('.')
    let name = path.split('/')
    
    path.replace(`${name[name.length-1].split('.')[0]}.${ext[ext.length-1]}`,"")
    jimp.read(path)
    .then(image => {
        console.log(image)
        image.crop( x, y, width, height ).quality(60).write(`${path.replace(`${name[name.length-1].split('.')[0]}.${ext[ext.length-1]}`,"")}/crop_${name[name.length-1].split('.')[0]}.${ext[ext.length-1]}`)
    })
    .catch(err => {
      
    });
}


(async () => {
//console.log(await getFilesInDir("Z:\\Code\\BicingCount\\node_modules"))
//await cropImage('C:/Users/Estev/Desktop/img/1.jpg',159,90,379,319)
})();


module.exports = { getFilesInDir, cropImage }