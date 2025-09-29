const http = require('http');
const path = require('path');
const fs = require('fs');

const instanceId = process.env.INSTANCE_ID || 'unknown';
const logsDir = 'logs';
const logsPath = path.resolve('./logs');

if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const file = `access-log-${instanceId}.log`;
const logFilePath = path.resolve(logsPath, file);
const port = process.env.PORT || 3000;

if (!port) {
  throw new Error('PORT variable not set!');
}

const createdAt = new Date();

const server = http.createServer((req, res) => {
  const logMessage = `${new Date().toISOString()}: ${req.method} ${req.url} - Instance: ${instanceId}\n`;
  fs.appendFileSync(logFilePath, logMessage);
  
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Hello from Instance ${instanceId}, started at ${createdAt.toISOString()}`);
});

server.listen(port, () => {
  console.log(`Instance ${instanceId} running at http://localhost:${port}/`);
  console.log(`Log file: ${logFilePath}`);
});