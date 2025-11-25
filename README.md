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

## Requirements

Mono is tested on **Ubuntu 24.04**. You need:

- **Go** 1.21+
- **Node.js** 20.19+ or 22.12+
- Webview system libraries:

```bash
sudo apt update
sudo apt install pkg-config libgtk-3-dev libwebkit2gtk-4.1-dev
```

## Quickstart

> Note: Vite 7 requires **Node.js 20.19+** or **22.12+**.

### One-liner (recommended)

From an empty directory:

```bash
curl -s https://raw.githubusercontent.com/benitogf/mono/master/use.sh | bash
```

This will:

- Download the `master` branch zip
- Extract it and move the contents into the current directory
- Run `npm install` and `npm run build` if `npm` is available

### Manual setup

```bash
# Download and extract into current directory (preserve repo structure)
wget https://github.com/benitogf/mono/archive/refs/heads/master.zip -O mono-master.zip
unzip mono-master.zip
rm mono-master.zip
mv mono-master/* .
rmdir mono-master

# Install frontend dependencies
npm install

# Build frontend
npm run build

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