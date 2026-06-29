//go:build webview

package webview

import (
	"strconv"

	webview "github.com/Ghibranalj/webview_go"
)

// New opens a real native desktop window (WebKitGTK 4.1 on Linux, WebView2 on
// Windows) pointing at the already-served SPA. Built only with -tags webview;
// requires CGO and the platform's webview libraries.
func New(cfg Config) Window {
	if cfg.Host == "" {
		cfg.Host = "localhost"
	}
	if cfg.Protocol == "" {
		cfg.Protocol = "http"
	}

	w := webview.New(cfg.Debug)
	w.SetSize(cfg.Width, cfg.Height, webview.HintNone)
	w.Navigate(cfg.Protocol + "://" + cfg.Host + ":" + strconv.Itoa(cfg.Port))
	return w
}
