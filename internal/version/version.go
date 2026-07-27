// Package version exposes build metadata for the mono binary. The values are
// overridden at link time via -ldflags, e.g.:
//
//	go build -ldflags "-X github.com/benitogf/mono/internal/version.Version=v1.2.3"
//
// The Bazel+Zig release build stamps Version from the pushed git tag
// (MONO_VERSION). Commit and Date stay at their defaults unless a caller
// overrides them with additional -X flags.
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
