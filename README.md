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
sudo apt install pkg-config libgtk-3-dev libwebkit2gtk-4.1-dev
```

## Release builds (all platforms from one Linux runner)

Mono cross-compiles a release binary for **every OS/arch from a single Linux
machine** using **Bazel + a Zig hermetic C toolchain** — the same approach proven
in [`spartan/samples/webcanvas`](https://github.com/benitogf/spartan). No
per-OS runners and no MinGW: Zig (`zig cc`) cross-compiles the Windows WebView2
binaries from Linux.

| Target | Build | Webview |
| --- | --- | --- |
| linux/amd64 | native CGO `-tags webview` | WebKitGTK 4.1 desktop window |
| windows/amd64, windows/arm64 | Zig cross-compile, CGO `-tags webview` | WebView2 desktop window (no console) |
| linux/arm64, darwin/amd64, darwin/arm64 | headless CGO-free `go build` | none — serves the SPA on a port |

> The Linux/arm64 GTK webview needs an arm64 WebKitGTK sysroot and macOS needs a
> Cocoa runner, so those targets stay headless for now.

### Prerequisites

- **Bazel** (via [bazelisk](https://github.com/bazelbuild/bazelisk))
- **Zig** 0.13 on `PATH` (for the Windows cross-compile)
- WebKitGTK 4.1 dev libraries (for the native linux/amd64 webview build):

```bash
sudo apt install pkg-config libgtk-3-dev libwebkit2gtk-4.1-dev
```

### Build

```bash
npm run build          # vite → build/ (embedded by the Go binary via //go:embed)
bazel build //:release # all six binaries → bazel-bin/mono-<os>-<arch>[.exe]
```

To build a single target, name its genrule, e.g. `bazel build //:windows_amd64`.
The version stamped into the binary comes from the `MONO_VERSION` env var
(defaults to `dev`). CI sets it from the pushed git tag — see
`.github/workflows/release.yml`, which runs this same build on every `v*` tag and
attaches the artifacts to the GitHub Release.

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

## Related Projects

Part of the [ooo](https://github.com/benitogf/ooo) ecosystem:

- [ooo](https://github.com/benitogf/ooo) - Main server library
- [ko](https://github.com/benitogf/ko) - Persistent storage adapter
- [ooo-client](https://github.com/benitogf/ooo-client) - JavaScript client
- [auth](https://github.com/benitogf/auth) - JWT authentication