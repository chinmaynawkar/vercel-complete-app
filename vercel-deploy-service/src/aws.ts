//function called downloadS3Folder that downloads all the files from a given location in S3.

import path from "path";
import fs from "fs";
import { S3 } from "aws-sdk";

const s3 = new S3({
    accessKeyId: "your Key",
    secretAccessKey: "your Key",
    endpoint: "your Key"
});

//output/abc
export async function downloadS3Dolder(prefix: string) {
    const allFiles = await s3.listObjectsV2({
        Bucket: 'vercel-app',
        Prefix: prefix,
    }).promise();
    
    //output/abc/1.txt
    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            // finalOutputPath =  for ex /dist/output/123123
            const finalOutputPath = path.join(__dirname, Key);
            const outputFile = fs.createWriteStream(finalOutputPath); 
            // this helps to create the folder if it does not exist
            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: "vercel-app",
                Key: Key 
            }).createReadStream().pipe(outputFile).on("finish", () => { // this is a event listener that listens to the finish event
                resolve("");
            })
        })
    }) || []
    console.log("awaiting");

    await Promise.all(allPromises?.filter(x => x !== undefined));
}

// this function is responsible for copying the final dist folder to the S3 bucket.
export function copyFinalDist(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    })
}

// this function is responsible for getting all the files in a folder and its subfolders.
const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

// this function is responsible for uploading the file to the S3 bucket.
const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-app",
        Key: fileName,
    }).promise();
    console.log(response);
}
