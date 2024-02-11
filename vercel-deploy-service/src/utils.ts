
// to convert the React code into HTML/CSS files. 
// The function buildProject is responsible for running the npm install and npm run build commands on the project.
import { exec, spawn } from "child_process";
import path from "path";

export function buildProject(id: string) {
    return new Promise((resolve) => {
        const child = exec(`cd ${path.join(__dirname, `output/${id}`)} && npm install && npm run build`)

        child.stdout?.on('data', function(data) { // this helps to listen to the stdout of the child process
            console.log('stdout: ' + data);
        });
        child.stderr?.on('data', function(data) { //  to listen to the stderr of the child process
            console.log('stderr: ' + data);
        });

        child.on('close', function(code) {
           resolve("")
        });

    })
}