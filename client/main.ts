import { Client } from "./client";

// You can change max_client_number but also you need to change it in client.ts and server.ts at the same time.
const max_client_number: number = 1000

// This create 1000 different client
for (let i = 0; i < max_client_number; i++) {
    new Client()
    if(i === max_client_number-1){
        console.log(`Total number of created client: ${max_client_number}`)
    }
}
