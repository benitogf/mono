// Package version holds the build version, injected at release time via
// -ldflags "-X github.com/benitogf/mono/internal/version.Version=vX.Y.Z".
package version

// Version is "dev" for local builds; release builds set it from the git tag.
var Version = "dev"
