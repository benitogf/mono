package router

import (
	"net/http"

	"github.com/benitogf/ooo"
)

type Opt struct {
}

func Routes(server *ooo.Server, opt Opt) {

	server.OpenFilter("videos/*")

	u := http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads/")))
	server.Router.PathPrefix("/uploads/").Handler(u)

	TusdRouter(server)
}
