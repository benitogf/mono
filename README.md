# Mono

A full-stack boilerplate combining a Go backend with a React 19 frontend, designed to run as a web application, SPA server, or native desktop application using [webview](https://github.com/webview/webview).

## Features

- **React 19** with Material-UI v7 and Vite 7
- **Go backend** with JWT authentication and embedded frontend
- **Dual deployment**: Web server or native desktop window
- **Modern tooling**: ES modules, code splitting, hot reload
- **Zero configuration**: Embedded assets, single binary output

## Tech Stack

**Frontend**: React 19, MUI v7, Vite 7, Emotion, React Router  
**Backend**: Go, Gorilla Mux, JWT, embedded FS, webview, leveldb

## Quickstart

> Note: Vite 7 requires **Node.js 20.19+** or **22.12+**.

```bash
# Download and extract into current directory
wget https://github.com/benitogf/mono/archive/refs/heads/main.zip
unzip -j main.zip "mono-main/*" -d .
rm main.zip

# Install frontend dependencies
npm install

# Build frontend
npm run build

# Install webview dependencies
apt install pkg-config libgtk-3-dev libwebkit2gtk-4.1-dev

# Run as web application (API + embedded SPA on spaPort)
go run main.go -ui=false

# Run as desktop application (opens webview window pointing to SPA)
go run main.go -ui=true

# Build single binary
go build
./mono
```

## Development

```bash
# Frontend dev server (hot reload)
npm start

# Backend dev server
go run main.go -ui=false -port=8888
```
