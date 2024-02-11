// Create an infinitely running for loop that pulls values from the redis queue.

import { createClient, commandOptions } from "redis";
import { buildProject } from "./utils";
import { copyFinalDist, downloadS3Dolder } from "./aws"; 

const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main() {
    while(1) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0
          );
          //@ts-ignore
          const id = res.element // (badpractice dont do this at production)
          
          await downloadS3Dolder(`output/${id}`)
            await buildProject(id)
            copyFinalDist(id);
        publisher.hSet("status", id, "deployed") // this tells the status of the project
    }
}
main();