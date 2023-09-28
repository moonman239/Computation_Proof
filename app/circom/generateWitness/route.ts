import * as fs from "fs";
import { spawnSync } from "child_process";
import { NextFetchEvent, NextResponse } from "next/server";
export async function POST(req: Request)
{
    // generate witness
    const formData = await req.formData();
    const sessionId = formData.get("session_id");
    if (!sessionId)
    {
        console.error("client did not provide id");
        return NextResponse.json({error: "NO_ID"},{status:400});
    }
    const sessionDirectory = "circom_user_files/" + sessionId;
    const generateWitnessProcess = spawnSync("node",["/generate_witness.js",sessionId + ".wasm","input.json","witness.wtns"],{cwd: sessionDirectory});
    if (generateWitnessProcess.error)
    {
        if (generateWitnessProcess.error.name === "ENOENT")
        {
            // nopnexistent file
            console.error(sessionId + " stuff does not exist");
            return NextResponse.json({error: "INVALID_ID"},{status:400});
        }
        else
        {
            console.error(generateWitnessProcess.error)
            return NextResponse.json({error:"generic server error"},{status: 500});
        }
    }
    return NextResponse.json({});
}