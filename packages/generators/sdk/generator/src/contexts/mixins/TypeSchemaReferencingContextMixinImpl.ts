import { DeclaredTypeName, ShapeType, TypeReference } from "@fern-fern/ir-model/types";
import { TypeReferenceNode, Zurg } from "@fern-typescript/commons-v2";
import { TypeResolver } from "@fern-typescript/resolvers";
import {
    CoreUtilities,
    GeneratedTypeSchema,
    Reference,
    TypeSchemaReferencingContextMixin,
} from "@fern-typescript/sdk-declaration-handler";
import { TypeGenerator } from "@fern-typescript/type-generator";
import {
    TypeReferenceToRawTypeNodeConverter,
    TypeReferenceToSchemaConverter,
} from "@fern-typescript/type-reference-converters";
import { TypeSchemaGenerator } from "@fern-typescript/type-schema-generator";
import { getSubImportPathToRawSchema } from "@fern-typescript/types-v2";
import { SourceFile } from "ts-morph";
import { TypeDeclarationReferencer } from "../../declaration-referencers/TypeDeclarationReferencer";
import { ImportsManager } from "../../imports-manager/ImportsManager";
import { getSchemaImportStrategy } from "./getSchemaImportStrategy";

export declare namespace TypeSchemaReferencingContextMixinImpl {
    export interface Init {
        sourceFile: SourceFile;
        coreUtilities: CoreUtilities;
        importsManager: ImportsManager;
        typeResolver: TypeResolver;
        typeDeclarationReferencer: TypeDeclarationReferencer;
        typeSchemaDeclarationReferencer: TypeDeclarationReferencer;
        typeGenerator: TypeGenerator;
        typeSchemaGenerator: TypeSchemaGenerator;
    }
}

export class TypeSchemaReferencingContextMixinImpl implements TypeSchemaReferencingContextMixin {
    private sourceFile: SourceFile;
    private coreUtilities: CoreUtilities;
    private importsManager: ImportsManager;
    private typeDeclarationReferencer: TypeDeclarationReferencer;
    private typeSchemaDeclarationReferencer: TypeDeclarationReferencer;
    private typeReferenceToRawTypeNodeConverter: TypeReferenceToRawTypeNodeConverter;
    private typeReferenceToSchemaConverter: TypeReferenceToSchemaConverter;
    private typeResolver: TypeResolver;
    private typeGenerator: TypeGenerator;
    private typeSchemaGenerator: TypeSchemaGenerator;

    constructor({
        sourceFile,
        coreUtilities,
        importsManager,
        typeResolver,
        typeDeclarationReferencer,
        typeGenerator,
        typeSchemaDeclarationReferencer,
        typeSchemaGenerator,
    }: TypeSchemaReferencingContextMixinImpl.Init) {
        this.sourceFile = sourceFile;
        this.coreUtilities = coreUtilities;
        this.importsManager = importsManager;
        this.typeReferenceToRawTypeNodeConverter = new TypeReferenceToRawTypeNodeConverter({
            getReferenceToNamedType: (typeName) => this.getReferenceToRawNamedType(typeName).getEntityName(),
            typeResolver,
        });
        this.typeReferenceToSchemaConverter = new TypeReferenceToSchemaConverter({
            getSchemaOfNamedType: (typeName) => this.getSchemaOfNamedType(typeName),
            zurg: this.coreUtilities.zurg,
            typeResolver,
        });
        this.typeDeclarationReferencer = typeDeclarationReferencer;
        this.typeSchemaDeclarationReferencer = typeSchemaDeclarationReferencer;
        this.typeResolver = typeResolver;
        this.typeGenerator = typeGenerator;
        this.typeSchemaGenerator = typeSchemaGenerator;
    }

    public getGeneratedTypeSchema(typeName: DeclaredTypeName): GeneratedTypeSchema {
        const typeDeclaration = this.typeResolver.getTypeDeclarationFromName(typeName);
        return this.typeSchemaGenerator.generateTypeSchema({
            shape: typeDeclaration.shape,
            typeName: this.typeSchemaDeclarationReferencer.getExportedName(typeDeclaration.name),
            getGeneratedType: () =>
                this.typeGenerator.generateType({
                    shape: typeDeclaration.shape,
                    docs: typeDeclaration.docs ?? undefined,
                    fernFilepath: typeDeclaration.name.fernFilepathV2,
                    typeName: this.typeDeclarationReferencer.getExportedName(typeDeclaration.name),
                    getReferenceToSelf: (context) => context.getReferenceToNamedType(typeName),
                }),
            getReferenceToGeneratedType: () =>
                this.typeDeclarationReferencer.getReferenceToType({
                    name: typeDeclaration.name,
                    importsManager: this.importsManager,
                    referencedIn: this.sourceFile,
                    importStrategy: { type: "fromRoot" },
                }),
        });
    }

    public getReferenceToRawType(typeReference: TypeReference): TypeReferenceNode {
        return this.typeReferenceToRawTypeNodeConverter.convert(typeReference);
    }

    public getReferenceToRawNamedType(typeName: DeclaredTypeName): Reference {
        return this.typeSchemaDeclarationReferencer.getReferenceToType({
            name: typeName,
            importStrategy: getSchemaImportStrategy({
                // dynamic import not needed for types
                useDynamicImport: false,
            }),
            subImport: getSubImportPathToRawSchema(),
            importsManager: this.importsManager,
            referencedIn: this.sourceFile,
        });
    }

    public getSchemaOfTypeReference(typeReference: TypeReference): Zurg.Schema {
        return this.typeReferenceToSchemaConverter.convert(typeReference);
    }

    public getSchemaOfNamedType(typeName: DeclaredTypeName): Zurg.Schema {
        const referenceToSchema = this.typeSchemaDeclarationReferencer
            .getReferenceToType({
                name: typeName,
                importStrategy: getSchemaImportStrategy({
                    // use dynamic imports when referencing schemas insides schemas,
                    // to avoid issues with circular imports
                    useDynamicImport: true,
                }),
                importsManager: this.importsManager,
                referencedIn: this.sourceFile,
            })
            .getExpression();

        const schema = this.coreUtilities.zurg.Schema._fromExpression(referenceToSchema);

        // when generating schemas, wrap named types with lazy() to prevent issues with circular imports
        return this.wrapSchemaWithLazy(schema, typeName);
    }

    private wrapSchemaWithLazy(schema: Zurg.Schema, typeName: DeclaredTypeName): Zurg.Schema {
        const resolvedType = this.typeResolver.resolveTypeName(typeName);
        return resolvedType._type === "named" && resolvedType.shape === ShapeType.Object
            ? this.coreUtilities.zurg.lazyObject(schema)
            : this.coreUtilities.zurg.lazy(schema);
    }
}
