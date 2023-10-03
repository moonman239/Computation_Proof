import * as fs from "fs";
import { spawnSync } from "child_process";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest)
{
    // generate witness
    const sessionId = req.cookies.get("session_id")?.value;
    if (!sessionId)
        return NextResponse.json({error: "NO_SESSION_ID"},{status:400});
    console.log(sessionId);
    const sessionDirectory = "circom_user_files/" + sessionId;
    try
    {
        fs.readFileSync("${sessionDirectory}/generate_witness.js");
    }
    catch (e)
    {
        console.error(e);
        return new NextResponse("NO_VALID_CIRCUIT",{status:400});
    }
    try
    {
        const generateWitnessProcess = spawnSync("node",["generate_witness.js",sessionId + ".wasm","input.json","witness.wtns"],{cwd: sessionDirectory});
        // check for witness file existence
        fs.readFileSync(sessionDirectory + "/witness.wtns");
    }
    catch (e)
    {
        console.error("Error trying to process '" + sessionId + "': " + e);
        return new NextResponse("error");
    }
    return NextResponse.json({});
}