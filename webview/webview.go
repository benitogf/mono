package webview

import (
	"embed"
	"log"
	"strconv"

	"github.com/benitogf/mono/spa"
	webview "github.com/webview/webview_go"
)

type Config struct {
	Content        embed.FS
	Width          int
	Height         int
	Debug          bool
	SpaPort        int
	ExistingServer string // tempPath from existing SPA server, empty if none
}

func New(cfg Config) (webview.WebView, string) {
	w := webview.New(cfg.Debug)

	tempPath := cfg.ExistingServer
	// If no tempPath provided, start a new SPA server
	if tempPath == "" {
		tempPath = spa.Start(cfg.Content, "build", cfg.SpaPort)
		log.Println("Webview started SPA server on port", cfg.SpaPort)
	} else {
		log.Println("Webview reusing existing SPA server on port", cfg.SpaPort)
	}

	w.SetSize(cfg.Width, cfg.Height, webview.HintNone)
	w.Navigate("http://localhost:" + strconv.Itoa(cfg.SpaPort))
	return w, tempPath
}
