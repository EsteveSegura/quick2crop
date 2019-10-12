const fs = require('fs');

function getFilesInDir(folder){
    return new Promise((resolve,reject) =>{
        fs.readdir(folder, (err, files) => {
            if(err)
                reject(err)
            
            resolve(files)
        });
    })
}

/*
(async () => {
console.log(await getFilesInDir("Z:\\Code\\BicingCount\\node_modules"))
})();
*/

module.exports = { getFilesInDir }