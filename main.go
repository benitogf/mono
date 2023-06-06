package main

import (
	"embed"
	"fmt"
	"io"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/webview/webview"
)

//go:embed build/*
var content embed.FS

// helper functions (https://github.com/webview/webview/issues/561#issuecomment-1364533953)
// bits to filereader (https://stackoverflow.com/a/57583377)
type MyReader struct {
	src []byte
	pos int
}

func (r *MyReader) Read(dst []byte) (n int, err error) {
	n = copy(dst, r.src[r.pos:])
	r.pos += n
	if r.pos == len(r.src) {
		return n, io.EOF
	}
	return
}

func NewMyReader(b []byte) *MyReader { return &MyReader{b, 0} }

func expandEmbed(eFS embed.FS) (string, error) {
	// expand embedded dir into temp fs
	dir, err := os.MkdirTemp("", "")
	if err != nil {
		return "", err
	}

	fmt.Println("expanding to temp dir:", dir)

	err = fs.WalkDir(eFS, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		fileName := filepath.Join(dir, path)
		if d.IsDir() {
			fmt.Println("dir", fileName)
			os.MkdirAll(fileName, os.ModePerm)
		} else {
			fmt.Println("file", fileName)
			destination, err := os.Create(fileName)
			if err != nil {
				return err
			}
			defer destination.Close()
			file, err := content.ReadFile(path)
			if err != nil {
				log.Println("failed to read file", err)
				return err
			}
			// replacing absolute paths in the index
			if strings.Contains(fileName, "index.html") {
				current := string(file)
				current = strings.ReplaceAll(current, `href="/`, `href="./`)
				current = strings.ReplaceAll(current, `src="/`, `src="./`)
				nBytes, err := io.Copy(destination, NewMyReader([]byte(current)))
				_ = nBytes
				return err
			}
			nBytes, err := io.Copy(destination, NewMyReader(file))
			_ = nBytes
			return err
		}

		return nil
	})

	return dir, err
}

func main() {
	w := webview.New(false)
	defer w.Destroy()

	d, err := expandEmbed(content)
	if err != nil {
		log.Panic("Error expanding FS")
	}
	defer os.RemoveAll(d)

	w.SetSize(480, 320, webview.HintNone)
	index := filepath.Join(d, "build", "index.html")
	log.Println("index", index)

	w.Navigate("file://" + index)
	w.Run()
}
