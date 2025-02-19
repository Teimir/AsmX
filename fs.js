const fs = require("fs");
const path = require("path");

const getAllFiles = function(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(__dirname, dirPath, file))
        }
    });

    return arrayOfFiles;
}


const getTotalSize = (directoryPath) => {
    const arrayOfFiles = getAllFiles(directoryPath);
    let totalSize = 0;
    arrayOfFiles.forEach((filePath) => { totalSize += fs.statSync(filePath).size });
    return totalSize;
}


function getDirs(path) {
    return fs.readdirSync(path,  { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
}


function getFiles(path) {
    return fs.readdirSync(path,  { withFileTypes: true }).filter(d => d.isFile()).map(d => d.name);
}


function printDirs(dirs) {
    for (let index = 0; index < dirs.length; index++) console.log(`${index + 1}. ${dirs[index]}`);
}


module.exports = {
    getAllFiles: getAllFiles,
    getTotalSize: getTotalSize,
    getDirs: getDirs,
    getFiles: getFiles,
    printDirs: printDirs
}