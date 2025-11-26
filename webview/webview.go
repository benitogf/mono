package webview

import (
	"strconv"

	webview "github.com/Ghibranalj/webview_go"
)

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
type Window interface {
	Run()
	Terminate()
}

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
