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

// Window abstracts the underlying webview implementation.
// It matches the subset of methods used by main.go.
type Window interface {
	Run()
	Terminate()
}

func New(cfg Config) Window {
	w := webview.New(cfg.Debug)
	w.SetSize(cfg.Width, cfg.Height, webview.HintNone)
	w.Navigate("http://localhost:" + strconv.Itoa(cfg.SpaPort))
	return w
}
