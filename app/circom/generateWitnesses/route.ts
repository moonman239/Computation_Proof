import * as fs from "fs";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import { spawnSync } from "child_process";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { buffer } from "stream/consumers";
/**
 * Generates a WTNS file for use with snarkjs.
 */
export async function POST(req: NextRequest)
{
    const sessionId = req.cookies.get("session_id")?.value;
    if (!sessionId)
        return NextResponse.json({error: "NO_SESSION_ID"},{status:400});
    console.log(sessionId);
    const uploadDir = path.join(process.cwd(),`circom_user_files`);
    const userFiles = path.join(uploadDir,`${sessionId}_js`);
    // save input to input.json
    const formData = await req.formData();
    
    const circuitInput = formData.get("circuit_input") as (string | null);
    if (circuitInput)
    {
        try
        {
            JSON.parse(circuitInput)
        }
        catch (e)
        {
            // invalid input
            return new NextResponse("INVALID_JSON",{status:400});
        }
        await writeFile(path.join(userFiles,"input.json"),circuitInput);
    }
    else
    {
        console.error(`no input provided for session id '${sessionId}'`);
        return new NextResponse("NO_INPUT",{status:400});
    }
    try
    {
        fs.readFileSync(path.join(userFiles,"generate_witness.js"));
    }
    catch (e)
    {
        console.error(e);
        return new NextResponse("NO_VALID_CIRCUIT",{status:400});
    }
    // get user input from file
    // generate witness from user input
    const {stderr, stdout, status}= spawnSync("node",["generate_witness.js",sessionId + ".wasm","input.json","witness.wtns"],{cwd: userFiles});
    console.log("generate_witness output: " + stdout.toString("utf-8"));
    // check for errors
    if (status !== 0)
    {
        console.error("generateWitnessProcess error: " + stderr.toString("utf8"));
        return new NextResponse("error",{status:500});
    }
    console.log("successfully generated witness");
    
    return new NextResponse("success",{status:200});
}