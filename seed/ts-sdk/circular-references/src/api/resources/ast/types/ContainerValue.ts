/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as SeedApi from "../../..";

export type ContainerValue = SeedApi.ContainerValue.List | SeedApi.ContainerValue.Optional;

export declare namespace ContainerValue {
    interface List {
        type: "list";
        value: SeedApi.FieldValue[];
    }

    interface Optional {
        type: "optional";
        value?: SeedApi.FieldValue;
    }
}
