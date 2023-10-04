import { NextResponse, NextRequest } from 'next/server';
import * as types from "./types";
const { v4: uuidv4 } = require('uuid');
import {spawnSync} from "child_process";
import * as fs from "fs";
import { NetConnectOpts } from 'net';
import { AppContext } from 'next/app';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

function compileCircuit(circuitFilePath:string,workingDirectory:string | undefined = undefined)
{
        const buffer = spawnSync("circom",[,"--wasm"],{
            stdio:["inherit","pipe","pipe"],
            cwd: workingDirectory
        });
        if (buffer.error)
            throw new Error(buffer.error.message);
        else
            return buffer.output.toString();
}

export async function POST(req: NextRequest)
{
    const formData = await req.formData();
    const circuit = formData.get("circuit");
    const sessionIdCookie = req.cookies.get("session_id");
    if (!sessionIdCookie)
        return NextResponse.json({error: "NO_SESSION_ID"},{status:400});
    const sessionId = (sessionIdCookie as RequestCookie).value;
    const circuitFilePath = "circom_user_files/${sessionId}"
    if (circuit)
    {
        try
        {
            const c = compileCircuit(circuitFilePath);
            if (c)
                console.warn(c); // this could be an error
            return new NextResponse("success",{status:200});
        }
        catch(e)
        {
            console.error(e);
            return new NextResponse("error",{status:500});
        }
    }
    else
    {
        return new NextResponse("no_valid_id",{status:400});
    }
}
