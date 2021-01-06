require('dotenv').config();
import *  as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as WebSocket from 'ws';
import * as http from 'http';
import * as redis from 'redis';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

wss.on('connection', (ws: ExtWebSocket) => {
  try {
    ws.isAlive = true;
    const subscriber = redis.createClient(process.env.REDIS_URL);

    ws.on('message', (message: string) => {
      const commands = message.split(' ');
      if (commands[0] === 'subscribe') {
        subscriber.subscribe(commands[1]);
      } else if (commands[0] === 'unsubscribe') {
        subscriber.unsubscribe(commands[1]);
      } else if (commands[0] === 'send') {
        subscriber.publish(commands[1], commands[2]);
      }
    });
    subscriber.on("message", (channel, message) => {
      ws.send(JSON.stringify({channel: channel, message: message}));
    })
    ws.on('close', () => {
      subscriber.unsubscribe();
      subscriber.quit();
      console.log('close');
    })
    ws.on('pong', () => {
      ws.isAlive = true
    });
    ws.send('Connected to WebSocket server');
  } catch (e) {
    ws.send('Error');
  }
});

const interval = setInterval(() => {
  wss.clients.forEach((ws: ExtWebSocket) => {
    if (ws.isAlive === false) {
      console.log('terminate');
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping(() => {});
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
})

const port = process.env.PORT || 3006;
server.listen(port, () => {
  console.log(`[Chaussette]: Server has started on port ${port}.`);
});
