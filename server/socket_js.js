import WebSocket, { WebSocketServer } from 'ws';

function heartbeat() {
  this.isAlive = true;
}

const wss = new WebSocketServer({ port: 8999 });

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    setInterval( function() {
        wss.clients.forEach(function each(client) {
            console.log('a client: ');
            if (client.readyState === WebSocket.OPEN) {
                console.log('ping');

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

