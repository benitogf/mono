//go:build webview

// Package webview's native build wraps Ghibranalj/webview_go, which depends on
// CGO and a platform webview toolchain (WebKitGTK on Linux). It is compiled only
// when the `webview` build tag is set.
package webview

import (
	webview "github.com/Ghibranalj/webview_go"
)

// New creates a real desktop webview window navigated to the configured SPA URL.
func New(cfg Config) Window {
	url := cfg.url()

	w := webview.New(cfg.Debug)
	w.SetSize(cfg.Width, cfg.Height, webview.HintNone)
	w.Navigate(url)
	return w
}
