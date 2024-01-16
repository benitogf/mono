package router

import "os"

func PlaylistStaticDirInit() {
	if _, err := os.Stat("static"); os.IsNotExist(err) {
		mode := int(0777)
		os.Mkdir("static", os.FileMode(mode))
	}
}
