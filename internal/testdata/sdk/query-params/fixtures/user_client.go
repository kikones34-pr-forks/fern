// Generated by Fern. Do not edit.

package api

import (
	context "context"
	core "github.com/fern-api/fern-go/internal/testdata/sdk/query-params/fixtures/core"
	http "net/http"
	strings "strings"
)

type UserClient interface {
	GetAllUsers(ctx context.Context, request *GetAllUsersRequest) (string, error)
}

func NewUserClient(baseURL string, httpClient core.HTTPClient, opts ...core.ClientOption) UserClient {
	options := new(core.ClientOptions)
	for _, opt := range opts {
		opt(options)
	}
	return &userClient{
		baseURL:    strings.TrimRight(baseURL, "/"),
		httpClient: httpClient,
		header:     options.ToHeader(),
	}
}

type userClient struct {
	baseURL    string
	httpClient core.HTTPClient
	header     http.Header
}

func (u *userClient) GetAllUsers(ctx context.Context, request *GetAllUsersRequest) (string, error) {
	endpointURL := u.baseURL + "/" + "/users/all"
	var response string
	if err := core.DoRequest(
		ctx,
		u.httpClient,
		endpointURL,
		http.MethodGet,
		request,
		&response,
		u.header,
		nil,
	); err != nil {
		return response, err
	}
	return response, nil
}
