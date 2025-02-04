/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as FernOpenapiIr from "../../../../api";
import * as core from "../../../../core";

export const RequestWithExample: core.serialization.Schema<
    serializers.RequestWithExample.Raw,
    FernOpenapiIr.RequestWithExample
> = core.serialization
    .union("type", {
        octetStream: core.serialization.lazyObject(async () => (await import("../../..")).OctetStremRequest),
        multipart: core.serialization.lazyObject(async () => (await import("../../..")).MultipartRequest),
        json: core.serialization.lazyObject(async () => (await import("../../..")).JsonRequestWithExample),
    })
    .transform<FernOpenapiIr.RequestWithExample>({
        transform: (value) => {
            switch (value.type) {
                case "octetStream":
                    return FernOpenapiIr.RequestWithExample.octetStream(value);
                case "multipart":
                    return FernOpenapiIr.RequestWithExample.multipart(value);
                case "json":
                    return FernOpenapiIr.RequestWithExample.json(value);
                default:
                    return value as FernOpenapiIr.RequestWithExample;
            }
        },
        untransform: ({ _visit, ...value }) => value as any,
    });

export declare namespace RequestWithExample {
    type Raw = RequestWithExample.OctetStream | RequestWithExample.Multipart | RequestWithExample.Json;

    interface OctetStream extends serializers.OctetStremRequest.Raw {
        type: "octetStream";
    }

    interface Multipart extends serializers.MultipartRequest.Raw {
        type: "multipart";
    }

    interface Json extends serializers.JsonRequestWithExample.Raw {
        type: "json";
    }
}
