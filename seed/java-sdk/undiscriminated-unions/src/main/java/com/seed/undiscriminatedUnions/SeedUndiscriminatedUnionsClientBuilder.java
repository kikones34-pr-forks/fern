/**
 * This file was auto-generated by Fern from our API Definition.
 */
package com.seed.undiscriminatedUnions;

import com.seed.undiscriminatedUnions.core.ClientOptions;
import com.seed.undiscriminatedUnions.core.Environment;

public final class SeedUndiscriminatedUnionsClientBuilder {
    private ClientOptions.Builder clientOptionsBuilder = ClientOptions.builder();

    private Environment environment;

    public SeedUndiscriminatedUnionsClientBuilder url(String url) {
        this.environment = Environment.custom(url);
        return this;
    }

    public SeedUndiscriminatedUnionsClient build() {
        clientOptionsBuilder.environment(this.environment);
        return new SeedUndiscriminatedUnionsClient(clientOptionsBuilder.build());
    }
}