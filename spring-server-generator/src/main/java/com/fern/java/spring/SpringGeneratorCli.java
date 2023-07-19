/*
 * (c) Copyright 2022 Birch Solutions Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.fern.java.spring;

import com.fasterxml.jackson.databind.JsonNode;
import com.fern.generator.exec.model.config.GeneratorConfig;
import com.fern.generator.exec.model.config.GeneratorPublishConfig;
import com.fern.generator.exec.model.config.GithubOutputMode;
import com.fern.irV16.core.ObjectMappers;
import com.fern.irV16.model.commons.ErrorId;
import com.fern.irV16.model.ir.ErrorDiscriminationByPropertyStrategy;
import com.fern.irV16.model.ir.IntermediateRepresentation;
import com.fern.java.AbstractGeneratorCli;
import com.fern.java.DefaultGeneratorExecClient;
import com.fern.java.generators.AuthGenerator;
import com.fern.java.generators.ObjectMappersGenerator;
import com.fern.java.generators.TypesGenerator;
import com.fern.java.generators.TypesGenerator.Result;
import com.fern.java.output.GeneratedAuthFiles;
import com.fern.java.output.GeneratedJavaFile;
import com.fern.java.output.GeneratedObjectMapper;
import com.fern.java.output.gradle.GradleDependency;
import com.fern.java.spring.generators.ApiExceptionGenerator;
import com.fern.java.spring.generators.ErrorBodyGenerator;
import com.fern.java.spring.generators.ExceptionGenerator;
import com.fern.java.spring.generators.SpringServerInterfaceGenerator;
import com.palantir.common.streams.KeyedStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class SpringGeneratorCli
        extends AbstractGeneratorCli<SpringCustomConfig, SpringDownloadFilesCustomConfig> {

    private static final Logger log = LoggerFactory.getLogger(SpringGeneratorCli.class);

    private final List<String> subprojects = new ArrayList<>();

    @Override
    public void runInDownloadFilesModeHook(
            DefaultGeneratorExecClient generatorExecClient,
            GeneratorConfig generatorConfig,
            IntermediateRepresentation ir,
            SpringDownloadFilesCustomConfig customConfig) {
        SpringGeneratorContext context = new SpringGeneratorContext(
                ir,
                generatorConfig,
                SpringCustomConfig.builder()
                        .wrappedAliases(customConfig.wrappedAliases())
                        .build(),
                customConfig);
        generateClient(context, ir);
    }

    @Override
    public void runInGithubModeHook(
            DefaultGeneratorExecClient generatorExecClient,
            GeneratorConfig generatorConfig,
            IntermediateRepresentation ir,
            SpringCustomConfig customConfig,
            GithubOutputMode githubOutputMode) {
        throw new RuntimeException("Github mode is unsupported!");
    }

    @Override
    public void runInPublishModeHook(
            DefaultGeneratorExecClient generatorExecClient,
            GeneratorConfig generatorConfig,
            IntermediateRepresentation ir,
            SpringCustomConfig customConfig,
            GeneratorPublishConfig publishOutputMode) {
        throw new RuntimeException("Publish mode is unsupported!");
    }

    public void generateClient(SpringGeneratorContext context, IntermediateRepresentation ir) {

        SpringCustomConfig springCustomConfig = getCustomConfig(context.getGeneratorConfig());

        // core
        ObjectMappersGenerator objectMappersGenerator = new ObjectMappersGenerator(context);
        GeneratedObjectMapper objectMapper = objectMappersGenerator.generateFile();
        this.addGeneratedFile(objectMapper);

        ApiExceptionGenerator apiExceptionGenerator = new ApiExceptionGenerator(context);
        GeneratedJavaFile apiException = apiExceptionGenerator.generateFile();
        this.addGeneratedFile(apiException);

        Optional<GeneratedJavaFile> errorBodyFile = getErrorBody(context);
        errorBodyFile.ifPresent(this::addGeneratedFile);

        // auth
        AuthGenerator authGenerator = new AuthGenerator(context);
        Optional<GeneratedAuthFiles> maybeAuth = authGenerator.generate();
        maybeAuth.ifPresent(this::addGeneratedFile);

        // types
        TypesGenerator typesGenerator = new TypesGenerator(context, springCustomConfig.enablePublicConstructors());
        Result generatedTypes = typesGenerator.generateFiles();
        generatedTypes.getTypes().values().forEach(this::addGeneratedFile);
        generatedTypes.getInterfaces().values().forEach(this::addGeneratedFile);

        // errors
        Map<ErrorId, GeneratedSpringException> generatedErrors = KeyedStream.stream(
                        context.getIr().getErrors())
                .map(errorDeclaration -> {
                    ExceptionGenerator exceptionGenerator =
                            new ExceptionGenerator(context, apiException, errorBodyFile, errorDeclaration);
                    GeneratedSpringException springException = exceptionGenerator.generateFile();
                    this.addGeneratedFile(springException);
                    this.addGeneratedFile(springException.controllerAdvice());
                    return springException;
                })
                .collectToMap();

        // services
        List<GeneratedSpringServerInterface> generatedSpringServerInterfaces = ir.getServices().values().stream()
                .map(httpService -> {
                    SpringServerInterfaceGenerator httpServiceClientGenerator = new SpringServerInterfaceGenerator(
                            context, maybeAuth, generatedTypes.getInterfaces(), generatedErrors, httpService);
                    return httpServiceClientGenerator.generateFile();
                })
                .collect(Collectors.toList());
        generatedSpringServerInterfaces.forEach(generatedSpringServerInterface -> {
            addGeneratedFile(generatedSpringServerInterface);
            generatedSpringServerInterface.geenratedRequestBodyFiles().forEach(this::addGeneratedFile);
        });
    }

    @Override
    public List<GradleDependency> getBuildGradleDependencies() {
        return List.of();
    }

    @Override
    public List<String> getSubProjects() {
        return subprojects;
    }

    @Override
    public SpringDownloadFilesCustomConfig getDownloadFilesCustomConfig(GeneratorConfig generatorConfig) {
        if (generatorConfig.getCustomConfig().isPresent()) {
            JsonNode node = ObjectMappers.JSON_MAPPER.valueToTree(
                    generatorConfig.getCustomConfig().get());
            return ObjectMappers.JSON_MAPPER.convertValue(node, SpringDownloadFilesCustomConfig.class);
        }
        return SpringDownloadFilesCustomConfig.builder().build();
    }

    @Override
    public SpringCustomConfig getCustomConfig(GeneratorConfig generatorConfig) {
        if (generatorConfig.getCustomConfig().isPresent()) {
            JsonNode node = ObjectMappers.JSON_MAPPER.valueToTree(
                    generatorConfig.getCustomConfig().get());
            return ObjectMappers.JSON_MAPPER.convertValue(node, SpringCustomConfig.class);
        }
        return SpringCustomConfig.builder().build();
    }

    private Optional<GeneratedJavaFile> getErrorBody(SpringGeneratorContext context) {
        if (context.getIr().getErrorDiscriminationStrategy().isProperty()) {
            ErrorDiscriminationByPropertyStrategy errorDiscriminationByPropertyStrategy = context.getIr()
                    .getErrorDiscriminationStrategy()
                    .getProperty()
                    .get();
            ErrorBodyGenerator errorBodyGenerator =
                    new ErrorBodyGenerator(errorDiscriminationByPropertyStrategy, context);
            return Optional.of(errorBodyGenerator.generateFile());
        }
        return Optional.empty();
    }

    public static void main(String... args) {
        SpringGeneratorCli cli = new SpringGeneratorCli();
        cli.run(args);
    }
}
