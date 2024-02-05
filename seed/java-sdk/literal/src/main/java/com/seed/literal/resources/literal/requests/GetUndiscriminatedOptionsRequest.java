/**
 * This file was auto-generated by Fern from our API Definition.
 */
package com.seed.literal.resources.literal.requests;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.seed.literal.core.ObjectMappers;
import java.util.Map;

public final class GetUndiscriminatedOptionsRequest {
    private final Map<String, Object> additionalProperties;

    private GetUndiscriminatedOptionsRequest(Map<String, Object> additionalProperties) {
        this.additionalProperties = additionalProperties;
    }

    @JsonProperty("dryRun")
    public Boolean getDryRun() {
        return true;
    }

    @java.lang.Override
    public boolean equals(Object other) {
        if (this == other) return true;
        return other instanceof GetUndiscriminatedOptionsRequest;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @java.lang.Override
    public String toString() {
        return ObjectMappers.stringify(this);
    }
}