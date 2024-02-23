// This file was auto-generated by Fern from our API Definition.

package client

import (
	core "github.com/error-property/fern/core"
	option "github.com/error-property/fern/option"
	propertybasederror "github.com/error-property/fern/propertybasederror"
	http "net/http"
)

type Client struct {
	baseURL string
	caller  *core.Caller
	header  http.Header

	PropertyBasedError *propertybasederror.Client
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
		header:             options.ToHeader(),
		PropertyBasedError: propertybasederror.NewClient(opts...),
	}
}
