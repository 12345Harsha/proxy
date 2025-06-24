// websocket_client.js

import WebSocket from 'ws';
import { fileURLToPath } from 'url';
import path from 'path';

console.log("websocket_client.js started");

// Get the current directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to your local WebSocket server
const socket = new WebSocket('ws://localhost:3000/ws');

// Prepare fake audio chunks (simulating µ-law audio)
let audioChunks = [];

// Simulate 20 chunks of random µ-law audio data (320 bytes each)
const chunkSize = 320;
for (let i = 0; i < 20; i++) {
  const fakeChunk = Buffer.alloc(chunkSize, Math.floor(Math.random() * 256));
  audioChunks.push(fakeChunk);
}

console.log("⚠️ Using fake audio chunks for testing (no audio file required)");

socket.on('open', () => {
  console.log("🔌 Connected to ws://localhost:3000/ws");

  let index = 0;
  const interval = setInterval(() => {
    if (index >= audioChunks.length) {
      clearInterval(interval);
      console.log("✅ Finished sending test audio");
      return;
    }

    const chunk = audioChunks[index];
    socket.send(chunk);
    index++;
  }, 500); // Send a chunk every 500ms
});

socket.on('message', (data) => {
  console.log(`📥 Received audio from server: ${data.length} bytes`);
});

socket.on('close', () => {
  console.log("❎ Connection closed");
});

socket.on('error', (err) => {
  console.error("💥 WebSocket error:", err.message);
});
