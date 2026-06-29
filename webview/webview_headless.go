//go:build !webview

package webview

import "sync"

// New (default build) returns a no-op window so mono cross-compiles CGO-free for
// platforms without a native webview toolchain (linux/arm64, darwin/*). The SPA
// is already served on its port; Run blocks until Terminate is called (the
// server's OnClose calls Terminate on shutdown), keeping the process alive as a
// plain server. Build with -tags webview for a real desktop window.
func New(_ Config) Window {
	return &headlessWindow{done: make(chan struct{})}
}

type headlessWindow struct {
	done chan struct{}
	once sync.Once
}

// Run blocks until Terminate is called, so a UI-mode headless binary keeps
// serving the SPA instead of exiting immediately.
func (w *headlessWindow) Run() { <-w.done }

// Terminate unblocks Run; safe to call more than once.
func (w *headlessWindow) Terminate() { w.once.Do(func() { close(w.done) }) }
