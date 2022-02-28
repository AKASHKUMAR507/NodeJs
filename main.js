#!/usr/bin/env node
// 1. all about Tree --------------------------------------------

let inputArray = process.argv.slice(2);
console.log(inputArray);

let fs = require("fs");
let path = require("path");


//link help file 
let helpObj = require("./commands/help");
//link tree file
let treeObj = require("./commands/tree");
//link organize file
let organizeObj = require("./commands/organize");



//node main.js tree "directoryPath"
//node main.js organize "directoryPath"
//node main.js help

let command = inputArray[0];

let types = {
    media:["mp4","mkv","img"],
    image:['png','jpg'],
    documents:['docx','doc','pdf','xlsx','xls','odt','odp','txt','ps','odg'],
    archives:['zip','doc','rar','ta','gz','ar','iso',"xz"],
    app:['exe','dmg','pkg',"deb"],
}

// switch (command) {
//     case "organize":
//         organizeObj.organizeKey(inputArray[1]);       
//         break;
//     case "tree":
//         treeObj.treeKey(inputArray[1]);
//         break;
//     case "help":
//         helpObj.helpKey();
//         console.log("Thank you!❤️");
//         break;
//     default:
//         console.log('Please Input Right command ☹️');
// }

switch (command) {
    case "organize":
        organizeFn(inputArray[1]);
        break;
    case "tree":
        treeFn(inputArray[1]);       
        break;
    case "help":
        helpFn();
        console.log("Thank you!❤️");
        break;
    default:
        console.log('Please Input Right command ☹️');
}






function treeFn(dirPath) {
    
    let destPath;

    if(dirPath == undefined){
        treeHelper(process.cwd(), "");
        return;
    }else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            treeHelper(dirPath , "");
        }else{
            console.log("Please Enter currect Derectory Path 😊");
            return;
        }
    }
}





function treeHelper(dirPath,indent){
    // is file or folder
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile == true){
        let fileName = path.basename(dirPath);
        console.log(indent + "├──" + fileName);
    }else{
        let dirName = path.basename(dirPath);
        console.log(indent+"└──"+dirName);
        let childrens = fs.readdirSync(dirPath);
        for(let i = 0; i<childrens.length; i++){
            let childPath = path.join(dirPath,childrens[i]);
            treeHelper(childPath,indent+"\t");
        }
    }
}

function helpFn(dirPath) {
    console.log(`
        List of all command
         node main.js tree "directoryPath"
    node main.js organize "directoryPath"
             node main.js help
    `)
}

// all about organized_files-------------------------------------------------

function organizeFn(dirPath) {
    // console.log("organize command impleamented for ", dirPath)
    // 1. input -> directory path given

    let destPath;

    if(dirPath == undefined){
        destPath = process.cwd();
        return;
    }else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            // 2. create -> organized_files -> directory 
            destPath = path.join(dirPath,"organized_files");
            if(fs.existsSync(destPath) == false){

                fs.mkdirSync(destPath)
            }
        }else{
            console.log("Please Enter currect Derectory Path 😊");
            return;
        }
    }
    organizeHelper(dirPath,destPath);
}
function organizeHelper(src,dest){
    // 3. identify categories of all the files present in that input directory
    let childName = fs.readdirSync(src);
    // console.log(childName);
    for(let i = 0; i<childName.length; i++){
        let childAddress = path.join(src,childName[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            // console.log(childName[i]);
            let category = getCategory(childName[i]);
            console.log(childName[i]," >---belongs to ------->",category);
            // 4. copy /cut file to the organize directory inside the any other folder
            sendFiles(childAddress,dest,category);

        }
    }
}

function sendFiles(srcFilePath ,dest, category){
    let categoryPath = path.join(dest, category);
    if(fs.existsSync(categoryPath) == false){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath,fileName);
    fs.copyFileSync(srcFilePath,destFilePath);
    fs.unlinkSync(srcFilePath);
    console.log(fileName,"copy to ",category);

}

function getCategory(name){
    let ext = path.extname(name);
    // console.log(ext);
    ext = ext.slice(1);
    // console.log(ext);
    for(let type in types){
        let cTypeArray= types[type];
        for(let i = 0; i<cTypeArray.length; i++){
            if(ext == cTypeArray[i]){
                return type;
            }

        }
    }
    return "Others";
}