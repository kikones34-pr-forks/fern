// This file was auto-generated by Fern from our API Definition.

package file

import (
	bytes "bytes"
	context "context"
	fmt "fmt"
	core "github.com/acme/acme-go/core"
	io "io"
	http "net/http"
)

type Client struct {
	baseURL    string
	httpClient core.HTTPClient
	header     http.Header
}

func NewClient(opts ...core.ClientOption) *Client {
	options := core.NewClientOptions()
	for _, opt := range opts {
		opt(options)
	}
	return &Client{
		baseURL:    options.BaseURL,
		httpClient: options.HTTPClient,
		header:     options.ToHeader(),
	}
}

func (c *Client) Download(ctx context.Context, filename string) (io.Reader, error) {
	baseURL := "https://core.yoursite.com"
	if c.baseURL != "" {
		baseURL = c.baseURL
	}
	endpointURL := fmt.Sprintf(baseURL+"/"+"file/%v/download", filename)

	response := bytes.NewBuffer(nil)
	if err := core.DoRequest(
		ctx,
		c.httpClient,
		endpointURL,
		http.MethodGet,
		nil,
		response,
		false,
		c.header,
		nil,
	); err != nil {
		return nil, err
	}
	return response, nil
}
