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

package com.fern.java.output;

import com.squareup.javapoet.ClassName;
import com.squareup.javapoet.JavaFile;
import java.io.IOException;
import java.nio.file.Path;

public abstract class AbstractGeneratedJavaFile extends GeneratedFile {

    public abstract ClassName getClassName();

    public abstract JavaFile javaFile();

    @Override
    public final String filename() {
        return getClassName().simpleName() + ".java";
    }

    @Override
    public final void writeToFile(Path directory, boolean isLocal) throws IOException {
        if (isLocal) {
            javaFile().writeToFile(directory.toFile());
        } else {
            javaFile().writeToFile(directory.resolve("src/main/java").toFile());
        }
    }
}
