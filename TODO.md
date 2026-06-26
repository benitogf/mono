# TODO

## Adopt the Bazel + Zig release build (cross-compile the webview from Linux)

mono already ships the desktop webview (`webview/`, `Ghibranalj/webview_go`,
WebKitGTK 4.1), but its release build is the conventional per-OS path. candyland
(built from this template) now cross-compiles its webview binaries for every
OS/arch **from a single Linux runner** using **Bazel + a Zig hermetic C
toolchain**, the approach proven in
[`spartan/samples/webcanvas`](https://github.com/benitogf/spartan). Bring the same
build here so any mono-based app inherits a one-runner, all-platform release.

Reference implementation (copy + adapt from candyland):
- `MODULE.bazel` — `hermetic_cc_toolchain` (Zig) + `platforms`; register the
  windows toolchains.
- `.bazelrc` — forward `PATH` (system zig + go), `HOME`/`GOPATH`/`GOMODCACHE`, and
  the version env into actions.
- `BUILD.bazel` — one `genrule` per target; build in the **real source tree**
  (resolve symlinks with `readlink -f`) so `//go:embed` sees real files, not the
  symlinks Bazel stages:
  - linux/amd64: native CGO `-tags webview` against host WebKitGTK 4.1.
  - windows/amd64 + arm64: `CC="zig cc -target <triple>"` cross-compile with a
    minimal WebView2 `EventToken.h` shim and `CGO_LDFLAGS="-Wl,--subsystem,windows"`
    (GUI subsystem — no console window).
  - linux/arm64 + darwin/*: headless CGO-free `go build` (no native webview
    toolchain for those targets yet).
- CI: one Linux job — `npm`/`vite` build → apt `libwebkit2gtk-4.1-dev` → fetch
  Zig 0.13 → `bazel build //:release` → publish.

Notes:
- The Zig cross-compile is the real enabler; Bazel is the orchestration wrapper.
- Cross-compiling the **Linux/arm64** GTK webview needs an arm64 WebKitGTK
  sysroot — deferred; arm64 Linux stays headless until that's set up.
- macOS webview (Cocoa) still needs a macOS runner; darwin stays headless here.

Tracked as a follow-on to the candyland webview work (option 3: share the build
story across both desktop apps).
