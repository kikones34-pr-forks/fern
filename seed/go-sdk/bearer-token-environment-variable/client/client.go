// This file was auto-generated by Fern from our API Definition.

package client

import (
	core "github.com/bearer-token-environment-variable/fern/core"
	option "github.com/bearer-token-environment-variable/fern/option"
	service "github.com/bearer-token-environment-variable/fern/service"
	http "net/http"
)

type Client struct {
	baseURL string
	caller  *core.Caller
	header  http.Header

	Service *service.Client
}

func NewClient(opts ...option.RequestOption) *Client {
	options := core.NewRequestOptions(opts...)
	return &Client{
		baseURL: options.BaseURL,
		caller: core.NewCaller(
			&core.CallerParams{
				Client:      options.HTTPClient,
				MaxAttempts: options.MaxAttempts,
			},
		),
		header:  options.ToHeader(),
		Service: service.NewClient(opts...),
	}
}
