package network

import (
	"log"
	"net"
	"net/http"
	"strings"
	"time"
)

func IsValidIP(address string) bool {
	result := net.ParseIP(address)
	return result != nil
}

func IsHostReachable(client *http.Client, address string) bool {
	res, err := client.Head("http://" + address)
	return err == nil && res.StatusCode == 405
}

// NewHttpClient returns and http client with sensible timeouts
func NewHttpClient() *http.Client {
	// https://github.com/golang/go/issues/24138
	return &http.Client{
		Timeout: 5 * time.Second,
		Transport: &http.Transport{
			Dial: (&net.Dialer{
				Timeout:   800 * time.Millisecond,
				KeepAlive: 5 * time.Second,
			}).Dial,
			IdleConnTimeout:       10 * time.Second,
			ResponseHeaderTimeout: 10 * time.Second,
			MaxConnsPerHost:       3000,
			MaxIdleConns:          10000,
			MaxIdleConnsPerHost:   1000,
			DisableKeepAlives:     false,
		},
	}
}

func NewFastHttpClient() *http.Client {
	return &http.Client{
		Timeout: 1 * time.Second,
		Transport: &http.Transport{
			Dial: (&net.Dialer{
				Timeout:   800 * time.Millisecond,
				KeepAlive: 1 * time.Second,
			}).Dial,
			IdleConnTimeout:       1 * time.Second,
			ResponseHeaderTimeout: 1 * time.Second,
			MaxConnsPerHost:       3000,
			MaxIdleConns:          10000,
			MaxIdleConnsPerHost:   1000,
			DisableKeepAlives:     false,
		},
	}
}

func isIPv4(address string) bool {
	return strings.Count(address, ":") < 2
}

func GetLocalIPs() []string {
	ifaces, err := net.Interfaces()
	if err != nil {
		log.Fatal("failed to retrieve network interfaces")
	}
	result := []string{}
	for _, i := range ifaces {
		addrs, err := i.Addrs()
		if err != nil {
			log.Fatal("failed to retrieve network address")
		}
		for _, addr := range addrs {
			var ip net.IP
			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
			}
			if isIPv4(ip.String()) {
				result = append(result, ip.String())
			}
		}
	}

	return result
}

// SelfIP  helps getting the machine IP, first we get all interfaces, then we iterate
// discard the loopback and get the IPv4 address, which should be the eth0
func SelfIP() net.IP {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		panic(err)
	}

	for _, a := range addrs {
		if ipnet, ok := a.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP
			}
		}
	}

	return net.ParseIP("127.0.0.1")
}
