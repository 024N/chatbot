import { WebSocketServer } from "ws";

const port = 7071;
const wss: any = new WebSocketServer({ port });

const client_list = new Map(); // This parameter stores client id and client meta

// You can change max_client_number but also you need to change it in client.ts and main.ts at the same time.
const max_client_number = 1000
let client_count = 1 // Number of created client 

wss.on('connection', (ws: any) => {

    console.log(`New client connected, Client ID: ${client_count}`)
    // When a client connected to server, server assign a id to this client
    ws.send(JSON.stringify({"command": 2, "client_id": client_count}))
    client_list.set(client_count, ws)
    
    // When 1000 client created, start ring process.
    if(client_count === max_client_number){
        start_ring()
    }
    
    client_count++

    ws.on('message', (message: any) => {
        let received_message = JSON.parse(message)
        let receiver_id = received_message.receiver_id
        let receiver_ws = client_list.get(receiver_id);
        if(receiver_ws)
            receiver_ws.send(message)
            // console.log(`Sent a message to next client`)
    });  
});

wss.on("close", (ws: any) => {
    console.log("Connection Closed")
    client_list.delete(ws);
});

console.log("Server connection ready!")
console.log(`Listening at ${port}...`);

function start_ring() {
    console.log("Message ring started")
    const receiver_ws = client_list.get(1);
    receiver_ws.send(JSON.stringify({
        "command": 3,
        "message": "Chat message",
        "sender_id": 0,
        "receiver_id": 1
    }))
}