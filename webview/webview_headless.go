//go:build !webview

// Package webview's headless build provides a no-op Window so the binary can be
// compiled without CGO or a platform webview toolchain (e.g. CGO_ENABLED=0
// server-only and cross-compiled headless targets). It is the default build,
// used whenever the `webview` build tag is absent.
package webview

// headlessWindow satisfies the Window interface without opening anything.
type headlessWindow struct{}

func (headlessWindow) Run()       {}
func (headlessWindow) Terminate() {}

// New returns a no-op Window. The config is normalized for parity with the
// native build, but no window is created.
func New(cfg Config) Window {
	_ = cfg.url()
	return headlessWindow{}
}
