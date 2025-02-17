# Resend MCP Server
[![smithery badge](https://smithery.ai/badge/@pontusab/resend-mcp)](https://smithery.ai/server/@pontusab/resend-mcp)


A Model Context Protocol (MCP) server implementation for the Resend email
service.

## Features

- Send emails using Resend through a standardized MCP interface
- TypeScript support

## Prerequisites

- A Resend API key (get one at [resend.com](https://resend.com))
- Node.js 18 or later

## Installation

### Installing via Smithery

To install Resend Email Service for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@pontusab/resend-mcp):

```bash
npx -y @smithery/cli install @pontusab/resend-mcp --client claude
```

### Manual Installation
1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with your Resend API key:

```env
RESEND_API_KEY=your_api_key_here
PORT=3000  # Optional, defaults to 3000
```

## Development Status

The server implementation is currently blocked by TypeScript type issues with
the MCP SDK. The following issues need to be resolved:

1. The `Server` class from `@modelcontextprotocol/sdk` is not properly exposing
   its request handling methods in the TypeScript types.
2. The exact method name for handling requests needs to be determined (tried:
   `handleRequest`, `handle`, `receiveMessage`, `receive`, `processRequest`).

### Next Steps

1. Check the MCP SDK documentation or source code for the correct method name
2. Update the TypeScript types in the SDK if they are incorrect
3. Consider using JavaScript temporarily until the types are fixed

## Usage

### Development

```bash
bun run dev
```

### Production

```bash
bun run start
```

### Build

```bash
bun run build
```

## API

The server exposes the following MCP function:

### send-email

Sends an email using Resend.

Parameters:

- `from` (required): Sender email address
- `to` (required): Recipient email address
- `subject` (required): Email subject
- `html` (optional): Email content in HTML format
- `text` (optional): Email content in plain text format

Example request:

```json
{
  "method": "send-email",
  "params": {
    "from": "you@example.com",
    "to": "recipient@example.com",
    "subject": "Hello from MCP",
    "html": "<h1>Hello</h1><p>This is a test email.</p>"
  }
}
```

## License

MIT
