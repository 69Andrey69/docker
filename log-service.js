const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  try {
    // Получаем логи из всех volumes
    getLogsFromVolumes().then(logs => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(logs);
    }).catch(error => {
      res.statusCode = 500;
      res.end('Error reading logs: ' + error.message);
    });
  } catch (error) {
    res.statusCode = 500;
    res.end('Error: ' + error.message);
  }
});

async function getLogsFromVolumes() {
  let result = '=== Last 5 lines from each log file ===\n\n';
  
  // Пути к volumes
  const volumePaths = [
    '/logs/instance1',  // для volume-instance-1
    '/logs/instance2',  // для volume-instance-2
    '/logs/shared'      // для shared logs
  ];
  
  for (const volumePath of volumePaths) {
    try {
      if (fs.existsSync(volumePath)) {
        const files = fs.readdirSync(volumePath);
        const logFiles = files.filter(f => f.endsWith('.log'));
        
        if (logFiles.length === 0) {
          result += `📁 No log files found in ${path.basename(volumePath)}\n\n`;
          continue;
        }
        
        for (const file of logFiles) {
          const filePath = path.join(volumePath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const lines = content.split('\n').filter(line => line.trim());
          const lastLines = lines.slice(-5); // Последние 5 строк
          
          result += `📁 ${file} (from ${path.basename(volumePath)}):\n`;
          if (lastLines.length > 0) {
            result += lastLines.join('\n') + '\n\n';
          } else {
            result += 'No logs yet\n\n';
          }
        }
      } else {
        result += ` Volume not found: ${volumePath}\n\n`;
      }
    } catch (error) {
      result += ` Error reading ${volumePath}: ${error.message}\n\n`;
    }
  }
  
  if (result === '=== Last 5 lines from each log file ===\n\n') {
    result += 'No volumes mounted or log files found!\n';
  }
  
  return result;
}

server.listen(port, () => {
  console.log(`Log service running on port ${port}`);
  console.log(`Available at: http://localhost:${port}`);
});