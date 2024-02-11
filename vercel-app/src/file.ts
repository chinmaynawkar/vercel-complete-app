import fs from "fs";
import path from "path";

export const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    // read all the files and folders from the folder for example /users/chinmay/vercel/dist/output/abc
    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        
        //check if the file is a folder or a file 
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath)) //recursively call the function to get all the files from the folder
            
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}