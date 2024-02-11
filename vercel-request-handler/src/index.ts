import express from "express";
import { S3 } from "aws-sdk";

const app = express();

const s3 = new S3({
    accessKeyId: "your Key",
    secretAccessKey: "your Key",
    endpoint: "your Key"
});

// it is used to parse the incoming request body

app.get("/*", async (req, res) => {
    
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    // get the file from the s3 bucket
    const contents = await s3.getObject({
        Bucket: "vercel-app",
        Key: `dist/${id}${filePath}`
    }).promise();
    
    // this helps to set the content type of the response
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);
})

app.listen(3001);