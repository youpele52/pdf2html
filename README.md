# PDF2HTML Service

A modern PDF to HTML conversion service built with **Bun** and **Hono.js**.

## Project Structure

```
src/
├── index.ts           # Application entry point
├── controllers/       # Request handlers
├── routers/          # Route definitions
├── services/         # Business logic layer
└── utils/            # Utility functions
```

## Setup

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)

### Installation

```bash
bun install
```

## Development

Start the development server with hot reload:

```bash
bun run dev
```

The server will start on `http://localhost:3000`

## Endpoints

- **GET `/is-alive`** - Health check endpoint
  - Returns: `{ status: "alive", timestamp: "ISO8601" }`

## Build

```bash
bun run build
```

## Production

```bash
bun start
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## Technologies

- **Bun** - Fast JavaScript runtime
- **Hono.js** - Lightweight web framework
- **TypeScript** - Type-safe development
