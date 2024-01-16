package router

import (
	"github.com/benitogf/ooo"
)

func OnStartup(server *ooo.Server, opt Opt) {
	TusdDirInit()
}
