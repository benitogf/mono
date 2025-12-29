package router

import (
	"github.com/benitogf/ooo"
)

type Opt struct {
}

func Routes(server *ooo.Server, opt Opt) {
	// server.LimitFilter("things/*", 3)
	// server.OpenFilter("items/*")
	// server.OpenFilter("thing")
	// server.ReadObjectFilter("item", ooo.NoopObjectFilter)
	// server.ReadListFilter("stuff/*", ooo.NoopListFilter)
	// server.DeleteFilter("thing", ooo.NoopHook)
	// server.AfterWriteFilter("debris", ooo.NoopNotify)
	// server.OpenFilter("statistics/*/*/*")
}
