const express = require('express');
const { Client } = require('pg');

const app = express();
const port = process.env.APP_PORT || 3000;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'myapp_db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'secret123'
};

app.use(express.json());

// Test database connection
app.get('/api/test-db', async (req, res) => {
  let client;
  try {
    client = new Client(dbConfig);
    await client.connect();
    
    // Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS visitors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        visit_count INTEGER DEFAULT 1,
        last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Simple insert without ON CONFLICT
    await client.query(`
      INSERT INTO visitors (name, email) 
      VALUES ('First Visitor', 'visitor@example.com')
    `);
    
    // Get all visitors
    const result = await client.query('SELECT * FROM visitors ORDER BY last_visit DESC');
    
    res.json({
      success: true,
      message: 'Database connection successful!',
      visitors: result.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
});

// Add new visitor
app.post('/api/visitors', async (req, res) => {
  let client;
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }

    client = new Client(dbConfig);
    await client.connect();
    
    // Simple insert without ON CONFLICT
    const result = await client.query(
      'INSERT INTO visitors (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    
    res.json({
      success: true,
      message: 'Visitor created successfully',
      visitor: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding visitor:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
});

// Get all visitors
app.get('/api/visitors', async (req, res) => {
  let client;
  try {
    client = new Client(dbConfig);
    await client.connect();
    
    const result = await client.query('SELECT * FROM visitors ORDER BY last_visit DESC');
    
    res.json({
      success: true,
      visitors: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
});

// Health check
app.get('/health', async (req, res) => {
  let client;
  try {
    client = new Client(dbConfig);
    await client.connect();
    
    // Test database connection
    await client.query('SELECT 1');
    
    res.json({
      status: 'OK',
      service: 'Node.js App with PostgreSQL',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      service: 'Node.js App with PostgreSQL',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      error: error.message
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
});

// Home page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Docker Compose Demo</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        ul { list-style-type: none; padding: 0; }
        li { margin: 10px 0; }
        a { text-decoration: none; color: #007bff; }
        a:hover { text-decoration: underline; }
        .endpoint { background: #f8f9fa; padding: 10px; border-radius: 5px; }
        code { background: #f1f3f4; padding: 2px 5px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <h1>🚀 Docker Compose Demo</h1>
      <p>Available endpoints:</p>
      <ul>
        <li class="endpoint"><a href="/health">GET /health</a> - Health check</li>
        <li class="endpoint"><a href="/api/test-db">GET /api/test-db</a> - Test database connection</li>
        <li class="endpoint"><a href="/api/visitors">GET /api/visitors</a> - Get all visitors</li>
        <li class="endpoint">POST /api/visitors - Add new visitor</li>
      </ul>
      
      <h3>Test POST request:</h3>
      <code>
        curl -X POST http://localhost:3000/api/visitors -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@example.com\"}"
      </code>
    </body>
    </html>
  `);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`📊 Database config: ${dbConfig.host}:${dbConfig.port}`);
  console.log(`🌐 Health check: http://localhost:${port}/health`);
  console.log(`📝 API test: http://localhost:${port}/api/test-db`);
});