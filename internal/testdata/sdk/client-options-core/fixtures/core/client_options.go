// This file was auto-generated by Fern from our API Definition.

package core

import (
	http "net/http"
)

// ClientWithBaseURL sets the client's base URL, overriding the
// default environment, if any.
func ClientWithBaseURL(baseURL string) ClientOption {
	return func(opts *ClientOptions) {
		opts.BaseURL = baseURL
	}
}

// ClientWithHTTPClient uses the given HTTPClient to issue all HTTP requests.
func ClientWithHTTPClient(httpClient HTTPClient) ClientOption {
	return func(opts *ClientOptions) {
		opts.HTTPClient = httpClient
	}
}

// ClientWithHTTPHeader adds the given http.Header to all requests
// issued by the client. The given headers are added to the final set
// after the standard headers (e.g. Content-Type), but before the
// endpoint-specific headers.
func ClientWithHTTPHeader(httpHeader http.Header) ClientOption {
	return func(opts *ClientOptions) {
		// Clone the headers so they can't be modified after the option call.
		opts.HTTPHeader = httpHeader.Clone()
	}
}

// ClientWithAuthBearer sets the 'Authorization: Bearer <token>' header on every request.
func ClientWithAuthBearer(bearer string) ClientOption {
	return func(opts *ClientOptions) {
		opts.Bearer = bearer
	}
}
