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
	"github.com/benitogf/mono/router"
	"github.com/benitogf/mono/spa"
	"github.com/benitogf/mono/webview"
	"github.com/benitogf/network"
	"github.com/benitogf/ooo"
	"github.com/gorilla/mux"
)

//go:embed build/*
var uiBuildFS embed.FS

var tempPathSpa string
var tempPathUI string
var view webview.Window

var key = flag.String("key", "a-secret-key", "secret key for tokens")
var dataPath = flag.String("dataPath", "db/data", "data storage path")
var authPath = flag.String("authPath", "db/auth", "auth storage path")
var port = flag.Int("port", 8888, "service port")
var spaPort = flag.Int("spaPort", 80, "spa port")
var silence = flag.Bool("silence", true, "silence output")
var ui = flag.Bool("ui", true, "run with UI")
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

	// Start SPA server (always on)
	tempPathSpa = spa.Start(uiBuildFS, "build", *spaPort)

	// Server
	server := &ooo.Server{
		ReadTimeout:  20 * time.Minute,
		WriteTimeout: 20 * time.Minute,
		IdleTimeout:  20 * time.Minute,
		Router:       mux.NewRouter(),
		Static:       true,
		Workers:      2,
		Storage:      &ko.Storage{Path: *dataPath},
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
	server.Start("0.0.0.0:" + strconv.Itoa(*port))

	// startup tasks and continuous threads
	router.OnStartup(server, router.Opt{})

	// Run desktop webview UI when the UI flag is set.
	if *ui {
		view = webview.New(webview.Config{
			Width:   *windowWidth,
			Height:  *windowHeight,
			Debug:   *debugWebview,
			SpaPort: *spaPort,
		})
		go server.WaitClose()
		view.Run()
		server.Close(os.Interrupt)
		return
	}

	server.WaitClose()
}
