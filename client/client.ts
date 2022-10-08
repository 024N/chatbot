import Websocket from "ws";

export class Client {

    // You can change max_client_number but also you need to change that value in main.ts and server.ts at the same time.
    max_client_number = 1000

    my_client_id: any = null; 
    ws = this.websocket_connector();
    response = this.client_message_handler(this.ws);

    // This method creates websocket connection
    websocket_connector(){
        const port = 7071
        const host = 'ws://localhost'
        const ws = new Websocket(`${host}:${port}`);

        ws.on('open', () => {
            console.log(`I connected to server`);
        });
        return ws;
    }

    // This method handles message process
    client_message_handler(ws: any){
        ws.on('message', (message: any) => {
        
            let received_message = JSON.parse(message)
            console.log(`Received a message from server:`, received_message);
            
            // If it is ServerHello message
            if(received_message.command === 2){
                this.my_client_id = received_message.client_id
                console.log(`My client id: ${this.my_client_id}`)
            // If it is SendMessage
            }else if(received_message.command === 3 && received_message.receiver_id === this.my_client_id){
                received_message.sender_id = this.my_client_id
                // If it reaches to 1000. client, send message to 1. client
                if(this.my_client_id === this.max_client_number){
                    received_message.receiver_id = 1
                // Send message to next client
                }else{
                    received_message.receiver_id = this.my_client_id + 1
                }
                console.log(`Message sent to server by my_client_id:${this.my_client_id} message:`, received_message);
                ws.send(JSON.stringify(received_message))
            }
        });
        
        ws.on('error', (error: any) => {
            console.log(`Received a error from server ${error}`);
        })
    }
}
