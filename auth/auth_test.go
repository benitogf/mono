package auth

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/benitogf/ooo"
	"github.com/gorilla/mux"
	"github.com/stretchr/testify/require"
)

func TestRegisterAndAuthorize(t *testing.T) {
	var c Credentials
	authStore := &ooo.MemoryStorage{}
	err := authStore.Start(ooo.StorageOpt{})
	if err != nil {
		log.Fatal(err)
	}
	go ooo.WatchStorageNoop(authStore)
	auth := New(
		NewJwtStore("a-secret-key-0-asdasdada-asdasdasd-asdasdsaweenvurh@!@#12", time.Second*1),
		authStore,
	)
	server := &ooo.Server{}
	server.Silence = true
	server.Audit = auth.Verify
	server.Router = mux.NewRouter()
	auth.Routes(server)
	server.Start("localhost:9060")
	defer server.Close(os.Interrupt)

	// unauthorized
	req, err := http.NewRequest("GET", "/", nil)
	require.NoError(t, err)
	w := httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response := w.Result()
	require.Equal(t, http.StatusUnauthorized, response.StatusCode)

	// register
	payload := []byte(`{
        "name": "root",
        "account":"root",
        "password": "000",
        "email": "root@root.test",
		"phone": "123123123"
    }`)
	req, err = http.NewRequest("POST", "/register", bytes.NewBuffer(payload))
	require.NoError(t, err)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusOK, response.StatusCode)

	dec := json.NewDecoder(response.Body)

	err = dec.Decode(&c)
	require.NoError(t, err)
	require.NotEmpty(t, c.Token)

	regToken := c.Token

	// authorize
	payload = []byte(`{"account":"root","password":"000"}`)
	req, err = http.NewRequest("POST", "/authorize", bytes.NewBuffer(payload))
	require.NoError(t, err)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusOK, response.StatusCode)

	dec = json.NewDecoder(response.Body)
	err = dec.Decode(&c)
	require.NoError(t, err)
	require.NotEmpty(t, c.Token)

	token := c.Token
	require.NotEqual(t, token, regToken)

	// wait expiration of the token
	time.Sleep(time.Second * 2)

	// taken
	req, err = http.NewRequest("GET", "/available?account=root", nil)
	require.NoError(t, err)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusConflict, response.StatusCode)

	//available
	req, err = http.NewRequest("GET", "/available?account=notadmin", nil)
	require.NoError(t, err)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusOK, response.StatusCode)

	// expired
	req, err = http.NewRequest("GET", "/", nil)
	require.NoError(t, err)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusUnauthorized, response.StatusCode)

	// fake
	fakeToken := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjQzMzg1MDk5MDM1OTI5MDAsImlzcyI6InJvb3QiLCJyb2xlIjoicm9vdCJ9.C06Q66Qp9n5rXC7lSdOfmd5iF5BDWw5bTqSqHph7GGQFAKE"
	req, err = http.NewRequest("GET", "/", nil)
	require.NoError(t, err)
	req.Header.Set("Authorization", "Bearer "+fakeToken)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusUnauthorized, response.StatusCode)

	// refresh user doesn't match token
	payload = []byte(`{"account":"notadmin","token":"` + token + `"}`)
	req, err = http.NewRequest("PUT", "/authorize", bytes.NewBuffer(payload))
	require.NoError(t, err)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusBadRequest, response.StatusCode)

	// refresh fake token, with fake user
	payload = []byte(`{"account":"root","token":"` + fakeToken + `"}`)
	req, err = http.NewRequest("PUT", "/authorize", bytes.NewBuffer(payload))
	require.NoError(t, err)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusBadRequest, response.StatusCode)

	// refresh
	payload = []byte(`{"account":"root","token":"` + token + `"}`)
	req, err = http.NewRequest("PUT", "/authorize", bytes.NewBuffer(payload))
	require.NoError(t, err)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusOK, response.StatusCode)

	dec = json.NewDecoder(response.Body)
	err = dec.Decode(&c)
	require.NoError(t, err)
	require.NotEmpty(t, c.Token)

	token = c.Token

	// authorized
	req, err = http.NewRequest("GET", "/", nil)
	require.NoError(t, err)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusOK, response.StatusCode)

	body, err := ioutil.ReadAll(response.Body)
	require.NoError(t, err)
	require.Equal(t, "{\"keys\":[]}", strings.TrimRight(string(body), "\n"))

	// profile
	req, err = http.NewRequest("GET", "/profile", nil)
	require.NoError(t, err)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusOK, response.StatusCode)

	body, err = ioutil.ReadAll(response.Body)
	require.NoError(t, err)
	require.Equal(t, `{"name":"root","account":"root","role":"root"}`, strings.TrimRight(string(body), "\n"))

	// users
	req, err = http.NewRequest("GET", "/users", nil)
	require.NoError(t, err)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusForbidden, response.StatusCode)

	req, err = http.NewRequest("GET", "/users", nil)
	require.NoError(t, err)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusOK, response.StatusCode)
	body, err = ioutil.ReadAll(response.Body)
	require.NoError(t, err)
	require.Equal(t, `[{"name":"root","account":"root","role":"root"}]`, strings.TrimRight(string(body), "\n"))

	// get user
	req, err = http.NewRequest("GET", "/user/root", nil)
	require.NoError(t, err)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusForbidden, response.StatusCode)

	req, err = http.NewRequest("GET", "/user/root", nil)
	require.NoError(t, err)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusOK, response.StatusCode)
	body, err = ioutil.ReadAll(response.Body)
	require.NoError(t, err)
	require.Equal(t, `{"name":"root","account":"root","role":"root"}`, strings.TrimRight(string(body), "\n"))

	// update user
	payload = []byte(`{"phone":"321321321"}`)
	req, err = http.NewRequest("POST", "/user/root", bytes.NewBuffer(payload))
	require.NoError(t, err)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusOK, response.StatusCode)
	body, err = ioutil.ReadAll(response.Body)
	require.NoError(t, err)
	require.Equal(t, `{"name":"root","account":"root","role":"root"}`, strings.TrimRight(string(body), "\n"))

	// get updated user
	req, err = http.NewRequest("GET", "/user/root", nil)
	require.NoError(t, err)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusOK, response.StatusCode)
	body, err = ioutil.ReadAll(response.Body)
	require.NoError(t, err)
	require.Equal(t, `{"name":"root","account":"root","role":"root"}`, strings.TrimRight(string(body), "\n"))

	// delete user
	req, err = http.NewRequest("DELETE", "/user/root", nil)
	require.NoError(t, err)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusNoContent, response.StatusCode)
	body, err = ioutil.ReadAll(response.Body)
	require.NoError(t, err)
	require.Equal(t, `deleted root`, strings.TrimRight(string(body), "\n"))

	// available deleted user
	req, err = http.NewRequest("GET", "/available?account=root", nil)
	require.NoError(t, err)
	w = httptest.NewRecorder()
	server.Router.ServeHTTP(w, req)
	response = w.Result()
	require.Equal(t, http.StatusOK, response.StatusCode)
}
