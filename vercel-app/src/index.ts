import express from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import { generateId } from './generateId';
import path from 'path';
import { getAllFiles } from './file';
import { uploadFile } from './aws';
import { createClient } from 'redis'; //import the redis client
import { subscribe } from 'diagnostics_channel';

const publisher = createClient(); 
publisher.connect(); 

const subscriber = createClient();
subscriber.connect(); 


const app = express();
app.use(cors());
app.use(express.json()); // this is to parse the body of the request


//initate endpoint that user will hit
app.post('/deploy', async (req, res) => {
    const repoUrl = req.body.repoUrl; //actual url of the repository
    console.log(repoUrl);
    const id = generateId(); 
    await simpleGit().clone(repoUrl, path.join(__dirname, `output / ${id}`)); //clone the repository

    const files = getAllFiles(path.join(__dirname, `output / ${id}`)); //get all the files from the repository
    files.forEach(async (file) => {
       // Users/chinmay/vercel/dist/output/abc for example
       // converts to /abc
        await uploadFile(file.slice(__dirname.length + 1), file); //upload the files to S3 bucket
    });

    publisher.lPush('build-queue', id); //give the id to the build queue
    publisher.hSet('status', id, 'uploaded'); //set the status of the id to uploaded


    // put this to S3 bucket
    res.json({ 
        id: id,
        message: 'Repository cloned successfully'
     });
});

app.get('/status', async (req, res) => {
    const id = req.query.id ;
    const response = await subscriber.hGet('status', id as string ); //get the status of the id
    res.json({ 
        status: response 
    });
 });

app.listen(3000);
