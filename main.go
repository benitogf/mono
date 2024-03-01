package main

import (
	"embed"
	"flag"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/benitogf/ko"
	"github.com/benitogf/mono/auth"
	"github.com/benitogf/mono/network"
	"github.com/benitogf/mono/router"
	"github.com/benitogf/mono/spa"
	"github.com/benitogf/mono/webview"
	"github.com/benitogf/ooo"
	"github.com/gorilla/mux"
	wv "github.com/webview/webview_go"
)

//go:embed build/*
var uiBuildFS embed.FS

var tempPathSpa string
var tempPathUI string
var view wv.WebView

var key = flag.String("key", "a-secret-key", "secret key for tokens")
var dataPath = flag.String("dataPath", "db/data", "data storage path")
var authPath = flag.String("authPath", "db/auth", "auth storage path")
var port = flag.Int("port", 8888, "service port")
var silence = flag.Bool("silence", true, "silence output")
var ui = flag.Bool("ui", false, "run with UI")
var spaUI = flag.Bool("spa", true, "run with spa UI")
var windowWidth = flag.Int("width", 800, "webview window width")
var windowHeight = flag.Int("height", 600, "webview window height")
var debugWebview = flag.Bool("debugWebview", false, "debug webview")

func cleanup() {
	if tempPathSpa != "" {
		defer os.RemoveAll(tempPathSpa)
	}

	if tempPathUI != "" {
		defer os.RemoveAll(tempPathUI)
	}
}

func main() {
	flag.Parse()

	// auth storage
	authStore := &ko.Storage{Path: *authPath}
	err := authStore.Start(ooo.StorageOpt{})
	if err != nil {
		log.Fatal(err)
	}
	go ooo.WatchStorageNoop(authStore)
	autho := auth.New(
		auth.NewJwtStore(*key, time.Hour*48),
		authStore,
	)

	// Server
	server := &ooo.Server{
		ReadTimeout:    20 * time.Minute,
		WriteTimeout:   20 * time.Minute,
		IdleTimeout:    20 * time.Minute,
		AllowedMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowedHeaders: []string{"Authorization", "X-Requested-With", "X-Request-ID", "X-HTTP-Method-Override", "Upload-Length", "Upload-Offset", "Tus-Resumable", "Upload-Metadata", "Upload-Defer-Length", "Upload-Concat", "User-Agent", "Referrer", "Origin", "Content-Type", "Content-Length"},
		ExposedHeaders: []string{"Upload-Offset", "Location", "Upload-Length", "Tus-Version", "Tus-Resumable", "Tus-Max-Size", "Tus-Extension", "Upload-Metadata", "Upload-Defer-Length", "Upload-Concat", "Location", "Upload-Offset", "Upload-Length"},
		Router:         mux.NewRouter(),
		Static:         true,
		Workers:        2,
		Storage:        &ko.Storage{Path: *dataPath},
		OnClose: func() {
			log.Println("going away")
			cleanup()
			if *ui && view != nil {
				log.Println("closing window")
				defer view.Terminate()
			}
		},
		Client:  network.NewHttpClient(),
		Silence: *silence,
	}

	router.Routes(server, router.Opt{})

	autho.Routes(server)
	if *spaUI {
		tempPathSpa = spa.Start(uiBuildFS)
	}
	server.Start("0.0.0.0:" + strconv.Itoa(*port))

	// startup tasks and continuous threads
	router.OnStartup(server, router.Opt{})

	if *ui {
		view, tempPathUI = webview.New(uiBuildFS, *windowWidth, *windowHeight, *debugWebview)
		go server.WaitClose()
		view.Run()
		server.Close(os.Interrupt)
		return
	}

	server.WaitClose()
}
