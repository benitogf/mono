package webview

import (
	"strconv"

	webview "github.com/Ghibranalj/webview_go"
)

type Config struct {
	Width   int
	Height  int
	Debug   bool
	SpaPort int
}

func New(cfg Config) webview.WebView {
	w := webview.New(cfg.Debug)
	w.SetSize(cfg.Width, cfg.Height, webview.HintNone)
	w.Navigate("http://localhost:" + strconv.Itoa(cfg.SpaPort))
	return w
}
