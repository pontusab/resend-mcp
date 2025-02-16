import { createServer } from 'node:http';
import { Resend } from 'resend';
import { Server } from '@modelcontextprotocol/sdk';
import { z } from 'zod';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the MCP server
const server = new Server(
  {
    name: 'resend-mcp',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Define the tool schema
const SendEmailSchema = z.object({
  method: z.literal('send-email'),
  params: z.object({
    from: z.string().email(),
    to: z.string().email(),
    subject: z.string(),
    html: z.string().optional(),
    text: z.string().optional()
  })
});

// Register the tool handler
server.setRequestHandler(SendEmailSchema, async (request) => {
  try {
    const { from, to, subject, html, text } = request.params;
    const emailResponse = await resend.emails.send({
      from,
      to,
      subject,
      html: html || undefined,
      text: text || undefined,
      react: null // Required by type but not actually used when sending plain HTML/text
    });

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(emailResponse)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: error instanceof Error ? error.message : 'Unknown error occurred'
      }],
      isError: true
    };
  }
});

// Create HTTP server
const httpServer = createServer(async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Read request body
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const body = Buffer.concat(chunks).toString();
      
      // Handle MCP request
      const response = await server.processRequest(JSON.parse(body));
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  } else {
    res.writeHead(405);
    res.end('Method not allowed');
  }
});

// Start the server
const port = parseInt(process.env.PORT || '3000', 10);
httpServer.listen(port, () => {
  console.log(`MCP Resend server listening on port ${port}`);
});
