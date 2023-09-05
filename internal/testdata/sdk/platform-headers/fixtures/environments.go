// This file was auto-generated by Fern from our API Definition.

package api

// Environments defines all of the API environments.
// These values can be used with the WithBaseURL
// ClientOption to override the client's default environment,
// if any.
var Environments = struct {
	Production struct {
		Auth string
		Core string
	}
	Staging struct {
		Auth string
		Core string
	}
}{
	Production: struct {
		Auth string
		Core string
	}{
		Auth: "https://auth.yoursite.com",
		Core: "https://core.yoursite.com",
	},
	Staging: struct {
		Auth string
		Core string
	}{
		Auth: "https://auth.staging.yoursite.com",
		Core: "https://core.staging.yoursite.com",
	},
}
