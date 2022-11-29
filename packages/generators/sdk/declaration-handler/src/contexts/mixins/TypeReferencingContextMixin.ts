import { DeclaredTypeName, ResolvedTypeReference, TypeReference } from "@fern-fern/ir-model/types";
import { TypeReferenceNode } from "@fern-typescript/commons-v2";
import { GeneratedType } from "../../generated-types";
import { Reference } from "../../Reference";

export interface TypeReferencingContextMixin {
    getReferenceToType: (typeReference: TypeReference) => TypeReferenceNode;
    getReferenceToNamedType: (typeName: DeclaredTypeName) => Reference;
    resolveTypeReference: (typeReference: TypeReference) => ResolvedTypeReference;
    resolveTypeName: (typeName: DeclaredTypeName) => ResolvedTypeReference;
    getGeneratedType: (typeName: DeclaredTypeName) => GeneratedType;
}
