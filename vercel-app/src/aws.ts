// function that uploads a file given a path to S3

import {  S3 } from 'aws-sdk';
import fs from 'fs';


const s3 = new S3({
    accessKeyId: "your Key",
    secretAccessKey: "your Key",
    endpoint: "your Key"
});


// this function uploads a file to S3
//fileName is the name of the file in the S3 bucket
//localFilePath is the path of the file in the local system
export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-app",
        Key: fileName,
    }).promise();
    console.log(response);
}