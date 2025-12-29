package main

import (
	"embed"
	"flag"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/benitogf/auth"
	"github.com/benitogf/ko"
	"github.com/benitogf/mono/router"
	"github.com/benitogf/mono/spa"
	"github.com/benitogf/mono/webview"
	"github.com/benitogf/network"
	"github.com/benitogf/ooo"
	"github.com/benitogf/ooo/storage"
	"github.com/gorilla/mux"
)

//go:embed build/*
var uiBuildFS embed.FS

var tempPathSpa string
var view webview.Window

// server
var key = flag.String("key", "a-secret-key", "secret key for tokens")
var dataPath = flag.String("dataPath", "db/data", "data storage path")
var authPath = flag.String("authPath", "db/auth", "auth storage path")
var port = flag.Int("port", 8888, "service port")
var silence = flag.Bool("silence", true, "silence output")

// webview
var ui = flag.Bool("ui", true, "run with UI")
var windowWidth = flag.Int("width", 800, "webview window width")
var windowHeight = flag.Int("height", 600, "webview window height")
var debugWebview = flag.Bool("debugWebview", false, "debug webview")

// spa
var spaPort = flag.Int("spaPort", 80, "spa port")
var spaHost = flag.String("spaHost", "localhost", "spa host")
var spaProtocol = flag.String("spaProtocol", "http", "spa protocol")

func cleanup() {
	if tempPathSpa != "" {
		defer os.RemoveAll(tempPathSpa)
	}
}

func main() {
	flag.Parse()

	authStorage := storage.New(storage.LayeredConfig{
		Memory:   storage.NewMemoryLayer(),
		Embedded: ko.NewEmbeddedStorage(*authPath),
	})

	// auth storage
	err := authStorage.Start(storage.Options{})
	if err != nil {
		log.Fatal(err)
	}
	go storage.WatchStorageNoop(authStorage)
	autho := auth.New(
		auth.NewJwtStore(*key, time.Hour*48),
		authStorage,
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
		Storage: storage.New(storage.LayeredConfig{
			Memory:   storage.NewMemoryLayer(),
			Embedded: ko.NewEmbeddedStorage(*dataPath),
		}),
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
			Width:    *windowWidth,
			Height:   *windowHeight,
			Debug:    *debugWebview,
			Port:     *spaPort,
			Host:     *spaHost,
			Protocol: *spaProtocol,
		})
		go server.WaitClose()
		view.Run()
		server.Close(os.Interrupt)
		return
	}

	server.WaitClose()
}
