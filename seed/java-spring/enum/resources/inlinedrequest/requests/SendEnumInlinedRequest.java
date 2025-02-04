/**
 * This file was auto-generated by Fern from our API Definition.
 */

package resources.inlinedrequest.requests;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import core.ObjectMappers;
import java.lang.Object;
import java.lang.String;
import java.util.Objects;
import java.util.Optional;
import types.Operand;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonDeserialize(
    builder = SendEnumInlinedRequest.Builder.class
)
public final class SendEnumInlinedRequest {
  private final Optional<Operand> operand;

  private SendEnumInlinedRequest(Optional<Operand> operand) {
    this.operand = operand;
  }

  @JsonProperty("operand")
  public Optional<Operand> getOperand() {
    return operand;
  }

  @java.lang.Override
  public boolean equals(Object other) {
    if (this == other) return true;
    return other instanceof SendEnumInlinedRequest && equalTo((SendEnumInlinedRequest) other);
  }

  private boolean equalTo(SendEnumInlinedRequest other) {
    return operand.equals(other.operand);
  }

  @java.lang.Override
  public int hashCode() {
    return Objects.hash(this.operand);
  }

  @java.lang.Override
  public String toString() {
    return ObjectMappers.stringify(this);
  }

  public static Builder builder() {
    return new Builder();
  }

  @JsonIgnoreProperties(
      ignoreUnknown = true
  )
  public static final class Builder {
    private Optional<Operand> operand = Optional.empty();

    private Builder() {
    }

    public Builder from(SendEnumInlinedRequest other) {
      operand(other.getOperand());
      return this;
    }

    @JsonSetter(
        value = "operand",
        nulls = Nulls.SKIP
    )
    public Builder operand(Optional<Operand> operand) {
      this.operand = operand;
      return this;
    }

    public Builder operand(Operand operand) {
      this.operand = Optional.of(operand);
      return this;
    }

    public SendEnumInlinedRequest build() {
      return new SendEnumInlinedRequest(operand);
    }
  }
}
