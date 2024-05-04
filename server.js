const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let isReadingFile = false;

function startReadingFile() {
  const filePath = './file2.txt';
  const readStream = fs.createReadStream(filePath, { highWaterMark: 1024 });

  readStream.on('data', (chunk) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(chunk.toString());
      }
    });
  });

  readStream.on('error', (err) => {
    console.error('Error reading file:', err);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send('Error reading file');
      }
    });
  });

  readStream.on('end', () => {
    isReadingFile = false;
  });
}

function generateTextData(socket) {
  const filePath = './file2.txt';
  let currentPosition = 0;
  const readStream = fs.createReadStream(filePath, {
    highWaterMark: 1024, // Size of each chunk
    start: currentPosition
  });

  readStream.on('data', (chunk) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(chunk);
    } else {
    //   console.warn('WebSocket not ready. Skipping send');
    }
  });

  readStream.on('error', (err) => {
    console.error('Error reading file:', err);
    socket.send('Error reading file');
  });
}

wss.on('connection', (socket) => {
  if (!isReadingFile) {
    isReadingFile = true;
    startReadingFile();
  }

  // Associate the interval with the socket
  socket.dataInterval = setInterval(() => {
    generateTextData(socket);
  }, 100);

  socket.on('close', () => {
    clearInterval(socket.dataInterval); // Clear the associated interval
  });
});

server.listen(3050, () => console.log('Server listening on port 3050'));
