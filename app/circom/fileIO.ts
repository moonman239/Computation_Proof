import { writeFile } from "fs/promises";
/**
 * Copies inputFile to a file at path outputFilePath
 * @param inputFile 
 * @param outputFilePath 
 */
export default async function copyFile(inputFile:File,outputFilePath:string)
{
    const text = await inputFile.text();
    await writeFile(outputFilePath,text);
}
