import { AbsoluteFilePath } from "@fern-api/fs-utils";
import { DeclaredErrorName } from "@fern-fern/ir-model/errors";
import { IntermediateRepresentation } from "@fern-fern/ir-model/ir";
import { DeclaredTypeName, ShapeType, TypeReference } from "@fern-fern/ir-model/types";
import { EndpointTypeSchemasGenerator } from "@fern-typescript/endpoint-type-schemas-generator";
import { EndpointTypesGenerator } from "@fern-typescript/endpoint-types-generator";
import { ErrorGenerator } from "@fern-typescript/error-generator";
import { ErrorSchemaGenerator } from "@fern-typescript/error-schema-generator";
import { ErrorResolver, ServiceResolver, TypeResolver } from "@fern-typescript/resolvers";
import { GeneratorContext, SdkFile } from "@fern-typescript/sdk-declaration-handler";
import { ServiceDeclarationHandler } from "@fern-typescript/sdk-service-declaration-handler";
import { TypeGenerator } from "@fern-typescript/type-generator";
import {
    TypeReferenceToParsedTypeNodeConverter,
    TypeReferenceToRawTypeNodeConverter,
    TypeReferenceToSchemaConverter,
    TypeReferenceToStringExpressionConverter,
} from "@fern-typescript/type-reference-converters";
import { TypeSchemaGenerator } from "@fern-typescript/type-schema-generator";
import { EnumTypeGenerator, getSubImportPathToRawSchema } from "@fern-typescript/types-v2";
import { Volume } from "memfs/lib/volume";
import { Directory, Project, SourceFile, ts } from "ts-morph";
import { constructAugmentedServices } from "./constructAugmentedServices";
import { EndpointTypeSchemasContextImpl } from "./contexts/EndpointTypeSchemasContextImpl";
import { EndpointTypesContextImpl } from "./contexts/EndpointTypesContextImpl";
import { ErrorContextImpl } from "./contexts/ErrorContextImpl";
import { ErrorSchemaContextImpl } from "./contexts/ErrorSchemaContextImpl";
import { TypeContextImpl } from "./contexts/TypeContextImpl";
import { TypeSchemaContextImpl } from "./contexts/TypeSchemaContextImpl";
import { CoreUtilitiesManager } from "./core-utilities/CoreUtilitiesManager";
import { ImportStrategy } from "./declaration-referencers/DeclarationReferencer";
import { EndpointDeclarationReferencer } from "./declaration-referencers/EndpointDeclarationReferencer";
import { ErrorDeclarationReferencer } from "./declaration-referencers/ErrorDeclarationReferencer";
import { RootServiceDeclarationReferencer } from "./declaration-referencers/RootServiceDeclarationReferencer";
import { ServiceDeclarationReferencer } from "./declaration-referencers/ServiceDeclarationReferencer";
import { TypeDeclarationReferencer } from "./declaration-referencers/TypeDeclarationReferencer";
import { DependencyManager } from "./dependency-manager/DependencyManager";
import { EnvironmentsGenerator } from "./environments/EnvironmentsGenerator";
import {
    convertExportedFilePathToFilePath,
    ExportedDirectory,
    ExportedFilePath,
} from "./exports-manager/ExportedFilePath";
import { ExportsManager } from "./exports-manager/ExportsManager";
import { createExternalDependencies } from "./external-dependencies/createExternalDependencies";
import { generateTypeScriptProject } from "./generate-ts-project/generateTypeScriptProject";
import { ImportsManager } from "./imports-manager/ImportsManager";
import { parseAuthSchemes } from "./parseAuthSchemes";
import { parseGlobalHeaders } from "./parseGlobalHeaders";

const FILE_HEADER = `/**
 * This file auto-generated by Fern from our API Definition.
 */
`;

export declare namespace SdkGenerator {
    export interface Init {
        apiName: string;
        intermediateRepresentation: IntermediateRepresentation;
        context: GeneratorContext;
        volume: Volume;
        packageName: string;
        packageVersion: string | undefined;
        repositoryUrl: string | undefined;
        config: Config;
    }

    export interface Config {
        shouldUseBrandedStringAliases: boolean;
        isPackagePrivate: boolean;
    }
}

export class SdkGenerator {
    private context: GeneratorContext;
    private intermediateRepresentation: IntermediateRepresentation;

    private rootDirectory: Directory;
    private exportsManager: ExportsManager;
    private dependencyManager = new DependencyManager();
    private coreUtilitiesManager: CoreUtilitiesManager;
    private typeResolver: TypeResolver;
    private errorResolver: ErrorResolver;
    private serviceResolver: ServiceResolver;

    private typeDeclarationReferencer: TypeDeclarationReferencer;
    private typeSchemaDeclarationReferencer: TypeDeclarationReferencer;
    private errorDeclarationReferencer: ErrorDeclarationReferencer;
    private errorSchemaDeclarationReferencer: ErrorDeclarationReferencer;
    private serviceDeclarationReferencer: ServiceDeclarationReferencer;
    private rootServiceDeclarationReferencer: RootServiceDeclarationReferencer;
    private endpointDeclarationReferencer: EndpointDeclarationReferencer;
    private endpointSchemaDeclarationReferencer: EndpointDeclarationReferencer;

    private typeGenerator: TypeGenerator;
    private typeSchemaGenerator: TypeSchemaGenerator;
    private errorGenerator: ErrorGenerator;
    private errorSchemaGenerator: ErrorSchemaGenerator;
    private endpointTypesGenerator: EndpointTypesGenerator;
    private endpointTypeSchemasGenerator: EndpointTypeSchemasGenerator;
    private environmentsGenerator: EnvironmentsGenerator;

    private generatePackage: () => Promise<void>;

    constructor({
        apiName,
        intermediateRepresentation,
        context,
        volume,
        packageName,
        packageVersion,
        repositoryUrl,
        config,
    }: SdkGenerator.Init) {
        this.context = context;
        this.intermediateRepresentation = intermediateRepresentation;

        this.exportsManager = new ExportsManager({ packageName });
        this.coreUtilitiesManager = new CoreUtilitiesManager({ packageName });

        const project = new Project({
            useInMemoryFileSystem: true,
        });
        this.rootDirectory = project.createDirectory("/");
        this.typeResolver = new TypeResolver(intermediateRepresentation);
        this.errorResolver = new ErrorResolver(intermediateRepresentation);
        this.serviceResolver = new ServiceResolver(intermediateRepresentation);

        const apiDirectory: ExportedDirectory[] = [
            {
                nameOnDisk: "resources",
                exportDeclaration: { namespaceExport: apiName },
            },
        ];

        const schemaDirectory: ExportedDirectory[] = [
            {
                nameOnDisk: "serialization",
            },
        ];

        this.typeDeclarationReferencer = new TypeDeclarationReferencer({
            containingDirectory: apiDirectory,
            packageName,
        });
        this.typeSchemaDeclarationReferencer = new TypeDeclarationReferencer({
            containingDirectory: schemaDirectory,
            packageName,
        });
        this.errorDeclarationReferencer = new ErrorDeclarationReferencer({
            containingDirectory: apiDirectory,
            packageName,
        });
        this.errorSchemaDeclarationReferencer = new ErrorDeclarationReferencer({
            containingDirectory: schemaDirectory,
            packageName,
        });
        this.serviceDeclarationReferencer = new ServiceDeclarationReferencer({
            containingDirectory: apiDirectory,
            packageName,
        });
        this.rootServiceDeclarationReferencer = new RootServiceDeclarationReferencer({
            containingDirectory: [],
            packageName,
            apiName,
        });
        this.endpointDeclarationReferencer = new EndpointDeclarationReferencer({
            containingDirectory: apiDirectory,
            packageName,
        });
        this.endpointSchemaDeclarationReferencer = new EndpointDeclarationReferencer({
            containingDirectory: schemaDirectory,
            packageName,
        });

        this.typeGenerator = new TypeGenerator({ useBrandedStringAliases: config.shouldUseBrandedStringAliases });
        this.typeSchemaGenerator = new TypeSchemaGenerator();
        this.errorGenerator = new ErrorGenerator({ useBrandedStringAliases: config.shouldUseBrandedStringAliases });
        this.errorSchemaGenerator = new ErrorSchemaGenerator();
        this.endpointTypesGenerator = new EndpointTypesGenerator();
        this.endpointTypeSchemasGenerator = new EndpointTypeSchemasGenerator({
            errorResolver: this.errorResolver,
        });
        this.environmentsGenerator = new EnvironmentsGenerator({ intermediateRepresentation, packageName });

        this.generatePackage = async () => {
            await generateTypeScriptProject({
                volume,
                packageName,
                packageVersion,
                isPackagePrivate: config.isPackagePrivate,
                project,
                dependencies: this.dependencyManager.getDependencies(),
                repositoryUrl,
            });
        };
    }

    public async generate(): Promise<void> {
        this.generateTypeDeclarations();
        this.generateTypeSchemas();
        this.generateErrorDeclarations();
        this.generateErrorSchemas();
        this.generateEndpointTypes();
        this.generateEndpointTypeSchemas();
        this.generateServiceDeclarations();
        this.generateEnvironments();
        this.coreUtilitiesManager.finalize(this.exportsManager, this.dependencyManager);
        this.exportsManager.writeExportsToProject(this.rootDirectory);
        await this.generatePackage();
    }

    public async copyCoreUtilities({ pathToPackage }: { pathToPackage: AbsoluteFilePath }): Promise<void> {
        await this.coreUtilitiesManager.copyCoreUtilities({ pathToPackage });
    }

    private generateTypeDeclarations() {
        for (const typeDeclaration of this.intermediateRepresentation.types) {
            this.withSourceFile({
                filepath: this.typeDeclarationReferencer.getExportedFilepath(typeDeclaration.name),
                run: ({ sourceFile, importsManager }) => {
                    const typeContext = new TypeContextImpl({
                        sourceFile,
                        coreUtilitiesManager: this.coreUtilitiesManager,
                        dependencyManager: this.dependencyManager,
                        fernConstants: this.intermediateRepresentation.constantsV2,
                        importsManager,
                        typeResolver: this.typeResolver,
                        typeDeclarationReferencer: this.typeDeclarationReferencer,
                        typeGenerator: this.typeGenerator,
                    });
                    typeContext.getGeneratedType(typeDeclaration.name).writeToFile(typeContext);
                },
            });
        }
    }

    private generateTypeSchemas() {
        for (const typeDeclaration of this.intermediateRepresentation.types) {
            this.withSourceFile({
                filepath: this.typeSchemaDeclarationReferencer.getExportedFilepath(typeDeclaration.name),
                run: ({ sourceFile, importsManager }) => {
                    const typeSchemaContext = new TypeSchemaContextImpl({
                        sourceFile,
                        coreUtilitiesManager: this.coreUtilitiesManager,
                        dependencyManager: this.dependencyManager,
                        fernConstants: this.intermediateRepresentation.constantsV2,
                        importsManager,
                        typeResolver: this.typeResolver,
                        typeDeclarationReferencer: this.typeDeclarationReferencer,
                        typeSchemaDeclarationReferencer: this.typeSchemaDeclarationReferencer,
                        typeGenerator: this.typeGenerator,
                        typeSchemaGenerator: this.typeSchemaGenerator,
                    });
                    typeSchemaContext.getGeneratedTypeSchema(typeDeclaration.name).writeToFile(typeSchemaContext);
                },
            });
        }
    }

    private generateErrorDeclarations() {
        for (const errorDeclaration of this.intermediateRepresentation.errors) {
            this.withSourceFile({
                filepath: this.errorDeclarationReferencer.getExportedFilepath(errorDeclaration.name),
                run: ({ sourceFile, importsManager }) => {
                    const errorContext = new ErrorContextImpl({
                        sourceFile,
                        coreUtilitiesManager: this.coreUtilitiesManager,
                        dependencyManager: this.dependencyManager,
                        fernConstants: this.intermediateRepresentation.constantsV2,
                        importsManager,
                        typeResolver: this.typeResolver,
                        typeDeclarationReferencer: this.typeDeclarationReferencer,
                        typeGenerator: this.typeGenerator,
                        errorDeclarationReferencer: this.errorDeclarationReferencer,
                        errorGenerator: this.errorGenerator,
                        errorResolver: this.errorResolver,
                    });
                    errorContext.getGeneratedError(errorDeclaration.name)?.writeToFile(errorContext);
                },
            });
        }
    }

    private generateErrorSchemas() {
        for (const errorDeclaration of this.intermediateRepresentation.errors) {
            this.withSourceFile({
                filepath: this.errorSchemaDeclarationReferencer.getExportedFilepath(errorDeclaration.name),
                run: ({ sourceFile, importsManager }) => {
                    const errorSchemaContext = new ErrorSchemaContextImpl({
                        sourceFile,
                        coreUtilitiesManager: this.coreUtilitiesManager,
                        dependencyManager: this.dependencyManager,
                        fernConstants: this.intermediateRepresentation.constantsV2,
                        importsManager,
                        typeResolver: this.typeResolver,
                        typeDeclarationReferencer: this.typeDeclarationReferencer,
                        typeSchemaDeclarationReferencer: this.typeSchemaDeclarationReferencer,
                        errorDeclarationReferencer: this.errorDeclarationReferencer,
                        errorGenerator: this.errorGenerator,
                        errorResolver: this.errorResolver,
                        typeGenerator: this.typeGenerator,
                        typeSchemaGenerator: this.typeSchemaGenerator,
                        errorSchemaDeclarationReferencer: this.errorSchemaDeclarationReferencer,
                        errorSchemaGenerator: this.errorSchemaGenerator,
                    });
                    errorSchemaContext.getGeneratedErrorSchema(errorDeclaration.name)?.writeToFile(errorSchemaContext);
                },
            });
        }
    }

    private generateEndpointTypes() {
        for (const service of this.intermediateRepresentation.services.http) {
            for (const endpoint of service.endpoints) {
                this.withSourceFile({
                    filepath: this.endpointDeclarationReferencer.getExportedFilepath({
                        serviceName: service.name,
                        endpoint,
                    }),
                    run: ({ sourceFile, importsManager }) => {
                        const endpointTypesContext = new EndpointTypesContextImpl({
                            sourceFile,
                            coreUtilitiesManager: this.coreUtilitiesManager,
                            dependencyManager: this.dependencyManager,
                            fernConstants: this.intermediateRepresentation.constantsV2,
                            importsManager,
                            typeResolver: this.typeResolver,
                            typeDeclarationReferencer: this.typeDeclarationReferencer,
                            errorDeclarationReferencer: this.errorDeclarationReferencer,
                            endpointDeclarationReferencer: this.endpointDeclarationReferencer,
                            serviceName: service.name,
                            endpoint,
                            errorGenerator: this.errorGenerator,
                            errorResolver: this.errorResolver,
                            typeGenerator: this.typeGenerator,
                            serviceResolver: this.serviceResolver,
                            endpointTypesGenerator: this.endpointTypesGenerator,
                        });
                        endpointTypesContext
                            .getGeneratedEndpointTypes(service.name, endpoint.id)
                            .writeToFile(endpointTypesContext);
                    },
                });
            }
        }
    }

    private generateEndpointTypeSchemas() {
        for (const service of this.intermediateRepresentation.services.http) {
            for (const endpoint of service.endpoints) {
                this.withSourceFile({
                    filepath: this.endpointSchemaDeclarationReferencer.getExportedFilepath({
                        serviceName: service.name,
                        endpoint,
                    }),
                    run: ({ sourceFile, importsManager }) => {
                        const endpointTypeSchemasContext = new EndpointTypeSchemasContextImpl({
                            sourceFile,
                            coreUtilitiesManager: this.coreUtilitiesManager,
                            dependencyManager: this.dependencyManager,
                            fernConstants: this.intermediateRepresentation.constantsV2,
                            importsManager,
                            typeResolver: this.typeResolver,
                            typeDeclarationReferencer: this.typeDeclarationReferencer,
                            typeSchemaDeclarationReferencer: this.typeSchemaDeclarationReferencer,
                            errorDeclarationReferencer: this.errorDeclarationReferencer,
                            errorSchemaDeclarationReferencer: this.errorSchemaDeclarationReferencer,
                            endpointDeclarationReferencer: this.endpointDeclarationReferencer,
                            endpointTypesGenerator: this.endpointTypesGenerator,
                            typeGenerator: this.typeGenerator,
                            errorGenerator: this.errorGenerator,
                            errorResolver: this.errorResolver,
                            serviceResolver: this.serviceResolver,
                            endpointTypeSchemasGenerator: this.endpointTypeSchemasGenerator,
                            typeSchemaGenerator: this.typeSchemaGenerator,
                            errorSchemaGenerator: this.errorSchemaGenerator,
                        });
                        endpointTypeSchemasContext
                            .getGeneratedEndpointTypeSchemas(service.name, endpoint.id)
                            .writeToFile(endpointTypeSchemasContext);
                    },
                });
            }
        }
    }

    private generateServiceDeclarations() {
        const services = constructAugmentedServices(this.intermediateRepresentation);
        for (const service of services) {
            const declarationReferencer =
                service.name.fernFilepath.length > 0
                    ? this.serviceDeclarationReferencer
                    : this.rootServiceDeclarationReferencer;
            this.withSdkFile({
                filepath: declarationReferencer.getExportedFilepath(service.name),
                run: (serviceFile) => {
                    ServiceDeclarationHandler(service, {
                        serviceClassName: declarationReferencer.getExportedName(),
                        context: this.context,
                        serviceFile,
                    });
                },
            });
        }
    }

    private generateEnvironments(): void {
        this.withSourceFile({
            filepath: this.environmentsGenerator.getFilepath(),
            run: ({ sourceFile }) => {
                this.environmentsGenerator.generateEnvironments(sourceFile);
            },
        });
    }

    private withSdkFile({
        run,
        filepath,
        isGeneratingSchemaFile = false,
    }: {
        run: (file: SdkFile) => void;
        filepath: ExportedFilePath;
        // TODO switch to classes so we can override via subclass
        isGeneratingSchemaFile?: boolean;
    }) {
        this.withSourceFile({
            filepath,
            run: ({ sourceFile, importsManager }) => {
                const getReferenceToNamedType = (typeName: DeclaredTypeName) =>
                    this.typeDeclarationReferencer.getReferenceToType({
                        name: typeName,
                        importStrategy: { type: "fromRoot" },
                        referencedIn: sourceFile,
                        importsManager,
                    });

                const typeReferenceToParsedTypeNodeConverter = new TypeReferenceToParsedTypeNodeConverter({
                    getReferenceToNamedType: (typeName) => getReferenceToNamedType(typeName).getEntityName(),
                    typeResolver: this.typeResolver,
                });

                const getReferenceToRawNamedType = (typeName: DeclaredTypeName) =>
                    this.typeSchemaDeclarationReferencer.getReferenceToType({
                        name: typeName,
                        importStrategy: getSchemaImportStrategy({ useDynamicImport: false }),
                        subImport: getSubImportPathToRawSchema(),
                        importsManager,
                        referencedIn: sourceFile,
                    });

                const typeReferenceToRawTypeNodeConverter = new TypeReferenceToRawTypeNodeConverter({
                    getReferenceToNamedType: (typeName) => getReferenceToRawNamedType(typeName).getEntityName(),
                    typeResolver: this.typeResolver,
                });

                const coreUtilities = this.coreUtilitiesManager.getCoreUtilities({ sourceFile, importsManager });

                const getReferenceToNamedTypeSchema = (typeName: DeclaredTypeName) =>
                    this.typeSchemaDeclarationReferencer.getReferenceToType({
                        name: typeName,
                        importStrategy: getSchemaImportStrategy({ useDynamicImport: isGeneratingSchemaFile }),
                        importsManager,
                        referencedIn: sourceFile,
                    });

                const getSchemaOfNamedType = (typeName: DeclaredTypeName) => {
                    let schema = coreUtilities.zurg.Schema._fromExpression(
                        getReferenceToNamedTypeSchema(typeName).getExpression()
                    );

                    // when generating schemas, wrapped named types with lazy() to prevent issues with circular imports
                    if (isGeneratingSchemaFile) {
                        const resolvedType = this.typeResolver.resolveTypeName(typeName);
                        schema =
                            resolvedType._type === "named" && resolvedType.shape === ShapeType.Object
                                ? coreUtilities.zurg.lazyObject(schema)
                                : coreUtilities.zurg.lazy(schema);
                    }

                    return schema;
                };

                const typeReferenceToSchemaConverter = new TypeReferenceToSchemaConverter({
                    getSchemaOfNamedType,
                    zurg: coreUtilities.zurg,
                    typeResolver: this.typeResolver,
                });

                const externalDependencies = createExternalDependencies({
                    dependencyManager: this.dependencyManager,
                    importsManager,
                });

                const getErrorSchema = (errorName: DeclaredErrorName) => {
                    let schema = coreUtilities.zurg.Schema._fromExpression(
                        this.errorSchemaDeclarationReferencer
                            .getReferenceToError({
                                name: errorName,
                                importStrategy: getSchemaImportStrategy({ useDynamicImport: false }),
                                importsManager,
                                referencedIn: sourceFile,
                            })
                            .getExpression()
                    );

                    // when generating schemas, wrapped errors with lazy() to prevent issues with circular imports
                    if (isGeneratingSchemaFile) {
                        schema = coreUtilities.zurg.lazy(schema);
                    }

                    return schema;
                };

                const typeReferenceToStringExpressionConverter = new TypeReferenceToStringExpressionConverter({
                    typeResolver: this.typeResolver,
                    stringifyEnum: EnumTypeGenerator.getReferenceToRawValue.bind(this),
                });

                const getReferenceToType = (typeReference: TypeReference) =>
                    typeReferenceToParsedTypeNodeConverter.convert(typeReference).typeNode;

                const convertExpressionToString = (expression: ts.Expression, typeReference: TypeReference) =>
                    typeReferenceToStringExpressionConverter.convert(typeReference)(expression);

                const file: SdkFile = {
                    sourceFile,
                    getReferenceToType: typeReferenceToParsedTypeNodeConverter.convert.bind(
                        typeReferenceToParsedTypeNodeConverter
                    ),
                    getReferenceToNamedType,
                    getReferenceToService: (serviceName, { importAlias }) =>
                        this.serviceDeclarationReferencer.getReferenceToClient({
                            name: serviceName,
                            referencedIn: sourceFile,
                            importsManager,
                            importStrategy: { type: "direct", alias: importAlias },
                        }),
                    getReferenceToEndpointFileExport: (serviceName, endpoint, export_) =>
                        this.endpointDeclarationReferencer.getReferenceToEndpointExport({
                            name: { serviceName, endpoint },
                            referencedIn: sourceFile,
                            importsManager,
                            importStrategy: { type: "fromRoot" },
                            subImport: typeof export_ === "string" ? [export_] : export_,
                        }),
                    getReferenceToEndpointSchemaFileExport: (serviceName, endpoint, export_) =>
                        this.endpointSchemaDeclarationReferencer.getReferenceToEndpointExport({
                            name: { serviceName, endpoint },
                            referencedIn: sourceFile,
                            importsManager,
                            importStrategy: getSchemaImportStrategy({ useDynamicImport: false }),
                            subImport: typeof export_ === "string" ? [export_] : export_,
                        }),
                    resolveTypeReference: this.typeResolver.resolveTypeReference.bind(this.typeResolver),
                    resolveTypeName: this.typeResolver.resolveTypeName.bind(this.typeResolver),
                    getErrorDeclaration: (errorName) => this.errorResolver.getErrorDeclarationFromName(errorName),
                    getReferenceToError: (errorName) =>
                        this.errorDeclarationReferencer.getReferenceToError({
                            name: errorName,
                            importStrategy: { type: "fromRoot" },
                            referencedIn: sourceFile,
                            importsManager,
                        }),
                    externalDependencies,
                    coreUtilities,
                    getSchemaOfNamedType,
                    getErrorSchema,
                    authSchemes: parseAuthSchemes({
                        apiAuth: this.intermediateRepresentation.auth,
                        coreUtilities,
                        getReferenceToType,
                    }),
                    fernConstants: this.intermediateRepresentation.constants,
                    getReferenceToRawType: typeReferenceToRawTypeNodeConverter.convert.bind(
                        typeReferenceToRawTypeNodeConverter
                    ),
                    getReferenceToRawNamedType,
                    getReferenceToRawError: (errorName) =>
                        this.errorSchemaDeclarationReferencer.getReferenceToError({
                            name: errorName,
                            importStrategy: getSchemaImportStrategy({ useDynamicImport: false }),
                            subImport: getSubImportPathToRawSchema(),
                            importsManager,
                            referencedIn: sourceFile,
                        }),
                    getSchemaOfTypeReference:
                        typeReferenceToSchemaConverter.convert.bind(typeReferenceToSchemaConverter),
                    convertExpressionToString,
                    environments: this.environmentsGenerator.toParsedEnvironments({
                        sourceFile,
                        importsManager,
                    }),
                    globalHeaders: parseGlobalHeaders({
                        headers: this.intermediateRepresentation.headers,
                        getReferenceToType,
                        convertExpressionToString,
                    }),
                };

                run(file);
            },
        });
    }

    private withSourceFile({
        run,
        filepath,
    }: {
        run: (args: { sourceFile: SourceFile; importsManager: ImportsManager }) => void;
        filepath: ExportedFilePath;
    }) {
        const filepathStr = convertExportedFilePathToFilePath(filepath);
        this.context.logger.debug(`Generating ${filepathStr}`);

        const sourceFile = this.rootDirectory.createSourceFile(filepathStr);
        const importsManager = new ImportsManager();

        run({ sourceFile, importsManager });

        if (sourceFile.getStatements().length === 0) {
            sourceFile.delete();
            this.context.logger.debug(`Skipping ${filepathStr} (no content)`);
        } else {
            importsManager.writeImportsToSourceFile(sourceFile);
            this.exportsManager.addExportsForFilepath(filepath);

            // this needs to be last.
            // https://github.com/dsherret/ts-morph/issues/189#issuecomment-414174283
            sourceFile.insertText(0, (writer) => {
                writer.writeLine(FILE_HEADER);
            });

            this.context.logger.debug(`Generated ${filepathStr}`);
        }
    }
}

function getSchemaImportStrategy({ useDynamicImport }: { useDynamicImport: boolean }): ImportStrategy {
    return {
        type: "fromRoot",
        namespaceImport: "serializers",
        useDynamicImport,
    };
}
