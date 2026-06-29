// Package version exposes build metadata for the mono binary. The values are
// overridden at link time via -ldflags, e.g.:
//
//	go build -ldflags "-X github.com/benitogf/mono/internal/version.Version=v1.2.3"
//
// They default to development placeholders for local builds.
package version

var (
	// Version is the released semantic version, or "dev" for local builds.
	Version = "dev"
	// Commit is the git commit hash the binary was built from.
	Commit = "none"
	// Date is the build timestamp (RFC3339), or "unknown" for local builds.
	Date = "unknown"
)

// String returns a human-readable summary of the build metadata.
func String() string {
	return Version + " (commit " + Commit + ", built " + Date + ")"
}
