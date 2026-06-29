//go:build !webview

// Package webview's headless build provides a no-op Window so the binary can be
// compiled without CGO or a platform webview toolchain (e.g. CGO_ENABLED=0
// server-only and cross-compiled headless targets such as linux/arm64 and
// darwin/*). It is the default build, used whenever the `webview` build tag is
// absent. The SPA is already served on its port; Run blocks until Terminate is
// called (the server's OnClose calls Terminate on shutdown), keeping the process
// alive as a plain server. Build with -tags webview for a real desktop window.
package webview

import "sync"

// New returns a no-op Window. The config is normalized for parity with the
// native build, but no window is created.
func New(cfg Config) Window {
	_ = cfg.url()
	return &headlessWindow{done: make(chan struct{})}
}

// headlessWindow satisfies the Window interface without opening anything.
type headlessWindow struct {
	done chan struct{}
	once sync.Once
}

// Run blocks until Terminate is called, so a UI-mode headless binary keeps
// serving the SPA instead of exiting immediately.
func (w *headlessWindow) Run() { <-w.done }

// Terminate unblocks Run; safe to call more than once.
func (w *headlessWindow) Terminate() { w.once.Do(func() { close(w.done) }) }
