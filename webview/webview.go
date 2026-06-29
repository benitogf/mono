package webview

import "strconv"

// Config describes the desktop window mono opens over the already-served SPA.
type Config struct {
	Width    int
	Height   int
	Debug    bool
	Port     int
	Host     string
	Protocol string
}

// Window abstracts the underlying webview implementation.
// It matches the subset of methods used by main.go.
//
// New is provided by one of two build-tagged files:
//   - webview_native.go    (-tags webview): a real WebKitGTK/WebView2 window (CGO).
//   - webview_headless.go  (default):       a no-op window so the binary
//     cross-compiles CGO-free and runs as a plain SPA server.
type Window interface {
	Run()
	Terminate()
}

// url normalizes empty fields to their defaults and returns the address the
// webview should navigate to. It is shared by the native and headless builds.
func (cfg *Config) url() string {
	if cfg.Host == "" {
		cfg.Host = "localhost"
	}
	if cfg.Protocol == "" {
		cfg.Protocol = "http"
	}
	return cfg.Protocol + "://" + cfg.Host + ":" + strconv.Itoa(cfg.Port)
}
