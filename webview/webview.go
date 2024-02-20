package webview

import (
	"embed"
	"log"
	"path/filepath"

	"github.com/benitogf/mono/embeder"
	webview "github.com/webview/webview_go"
)

func New(content embed.FS, width, height int) (webview.WebView, string) {
	w := webview.New(true)

	d, err := embeder.Expand(content, true)
	if err != nil {
		log.Panic("Error expanding FS")
	}
	// defer func() {
	// 	log.Println("removing directory")
	// 	os.RemoveAll(d)
	// }()

	w.SetSize(width, height, webview.HintNone)
	index := filepath.Join(d, "build", "index.html")
	log.Println("index", index)

	w.Navigate("file://" + index)
	return w, d
}
