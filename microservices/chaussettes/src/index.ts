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

wss.on('connection', (ws: WebSocket) => {
  const subscriber = redis.createClient();

  ws.on('message', (message: string) => {
    const commands = message.split(' ');
    if (commands[0] === 'subscribe') {
      subscriber.subscribe(commands[1]);
    } else if (commands[0] === 'unsubscribe') {
      subscriber.unsubscribe(commands[1]);
    }
  });
  subscriber.on("message", (channel, message) => {
    ws.send(JSON.stringify({channel: channel, message: message}));
  })
  ws.on('close', () => {
    subscriber.unsubscribe();
    subscriber.quit();
  })
  ws.send('Connected to WebSocket server');
});

const port = process.env.PORT || 3006;
server.listen(port, () => {
  console.log(`[Chaussette]: Server has started on port ${port}.`);
});
