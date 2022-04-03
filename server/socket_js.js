import WebSocket, { WebSocketServer } from 'ws';

function heartbeat() {
  this.isAlive = true;
}

const wss = new WebSocketServer({ port: 8999 });

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    // ws.send('something');

    // setInterval( function() {
    //     console.log('ping');
    //     ws.send('ping');
    // }, 3000);

    setInterval( function() {
        wss.clients.forEach(function each(client) {
            console.log('a client: ');
            if (client.readyState === WebSocket.OPEN) {
                console.log('ping');
                // client.send("bla bla");
                // ws.send('something');

                const randomData = generateRandomData();
                ws.send(createMessage(randomData));
            }
        });
    }, 1000); //5000
});

const getRandomData = (from, to) =>  Math.floor(Math.random() * to) + from

const generateRandomData = () => {
    const currentTimestampDate = Date.now();

    return [
        {
            id: 1, timestamp: currentTimestampDate, temperature: getRandomData(0, 40), data: getRandomData(0, 150)
        },
        {
            id: 2, timestamp: currentTimestampDate, temperature: getRandomData(0, 40), data: getRandomData(0, 150)
        },
    ]
}

function createMessage(data) {
    return JSON.stringify(data);
}



// // Importing the required modules
// import { WebSocketServer } from 'ws';
 
// // Creating a new websocket server
// const wss = new WebSocketServer.Server({ port: 8999 })
 
// // Creating connection using websocket
// wss.on("connection", ws => {
    
//     console.log("new client connected");
    
//     // sending message
//     ws.on("message", data => {
//         console.log(`Client has sent us: ${data}`)
//     });
    
//     // handling what to do when clients disconnects from server
//     ws.on("close", () => {
//         console.log("the client has connected");
//     });
    
//     // handling client connection error
//     ws.onerror = function () {
//         console.log("Some Error occurred")
//     }

//     setInterval( function() {
//         ws.send('something');
//     }, 1000);

    
// });
// console.log("The WebSocket server is running on port 8080");