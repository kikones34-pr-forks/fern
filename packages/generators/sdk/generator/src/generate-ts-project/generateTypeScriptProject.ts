import { Volume } from "memfs/lib/volume";
import { Project } from "ts-morph";
import { PackageDependencies } from "../dependency-manager/DependencyManager";
import { generateGitIgnore } from "./generateGitIgnore";
import { generatePackageJson } from "./generatePackageJson";
import { generatePrettierIgnore } from "./generatePrettierIgnore";
import { generateTsConfig } from "./generateTsConfig";
import { writeProjectToVolume } from "./writeProjectToVolume";

export interface GeneratedProjectSrcInfo {
    dependencies: PackageDependencies;
}

export async function generateTypeScriptProject({
    volume,
    packageName,
    packageVersion,
    repositoryUrl,
    project,
    dependencies,
}: {
    volume: Volume;
    packageName: string;
    packageVersion: string | undefined;
    repositoryUrl: string | undefined;
    project: Project;
    dependencies: PackageDependencies;
}): Promise<void> {
    await writeProjectToVolume(project, volume, "/");
    await generatePackageJson({
        volume,
        packageName,
        packageVersion,
        repositoryUrl,
        dependencies,
    });
    await generateTsConfig(volume);
    await generatePrettierIgnore(volume);
    await generateGitIgnore(volume);
}
