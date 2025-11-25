//go:build windows

package webview

type Config struct {
	Width   int
	Height  int
	Debug   bool
	SpaPort int
}

// Window abstracts the underlying webview implementation.
// On Windows we provide a no-op implementation so the binary can still build
// and run the SPA/server without a desktop window.
type Window interface {
	Run()
	Terminate()
}

type noopWindow struct{}

func (noopWindow) Run()       {}
func (noopWindow) Terminate() {}

func New(cfg Config) Window {
	// No-op on Windows: return a dummy window so calls like Terminate() are safe.
	return noopWindow{}
}
