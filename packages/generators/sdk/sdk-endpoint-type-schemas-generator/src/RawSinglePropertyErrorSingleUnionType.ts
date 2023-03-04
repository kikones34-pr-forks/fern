import { DeclaredErrorName } from "@fern-fern/ir-model/errors";
import { ErrorDiscriminationByPropertyStrategy } from "@fern-fern/ir-model/ir";
import { getTextOfTsNode, Zurg } from "@fern-typescript/commons";
import { SdkEndpointTypeSchemasContext } from "@fern-typescript/contexts";
import { AbstractRawSingleUnionType } from "@fern-typescript/union-schema-generator";
import { OptionalKind, PropertySignatureStructure, ts } from "ts-morph";

export declare namespace RawSinglePropertyErrorSingleUnionType {
    export interface Init extends AbstractRawSingleUnionType.Init {
        errorName: DeclaredErrorName;
        discriminationStrategy: ErrorDiscriminationByPropertyStrategy;
    }
}

export class RawSinglePropertyErrorSingleUnionType extends AbstractRawSingleUnionType<SdkEndpointTypeSchemasContext> {
    private errorName: DeclaredErrorName;
    private discriminationStrategy: ErrorDiscriminationByPropertyStrategy;

    constructor({ errorName, discriminationStrategy, ...superInit }: RawSinglePropertyErrorSingleUnionType.Init) {
        super(superInit);
        this.errorName = errorName;
        this.discriminationStrategy = discriminationStrategy;
    }

    protected getExtends(): ts.TypeNode[] {
        return [];
    }

    protected getNonDiscriminantPropertiesForInterface(
        context: SdkEndpointTypeSchemasContext
    ): OptionalKind<PropertySignatureStructure>[] {
        const errorDeclaration = context.sdkError.getErrorDeclaration(this.errorName);
        if (errorDeclaration.type == null) {
            throw new Error(
                `Cannot generate single-property error because ${this.errorName.name.originalName} does not have a type.`
            );
        }
        const type = context.typeSchema.getReferenceToRawType(errorDeclaration.type).typeNode;

        return [
            {
                name: `"${this.discriminationStrategy.contentProperty.wireValue}"`,
                type: getTextOfTsNode(type),
            },
        ];
    }

    protected getNonDiscriminantPropertiesForSchema(
        context: SdkEndpointTypeSchemasContext
    ): Zurg.union.SingleUnionType["nonDiscriminantProperties"] {
        const errorDeclaration = context.sdkError.getErrorDeclaration(this.errorName);
        if (errorDeclaration.type == null) {
            throw new Error(
                `Cannot generate single-property error because ${this.errorName.name.originalName} does not have a type.`
            );
        }

        return context.base.coreUtilities.zurg.object([
            {
                key: {
                    parsed: this.discriminationStrategy.contentProperty.name.camelCase.unsafeName,
                    raw: this.discriminationStrategy.contentProperty.wireValue,
                },
                value: context.typeSchema.getSchemaOfTypeReference(errorDeclaration.type),
            },
        ]);
    }
}
