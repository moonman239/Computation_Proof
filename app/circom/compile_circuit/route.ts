import { NextResponse, NextRequest } from 'next/server';
import * as types from "./types";
const { v4: uuidv4 } = require('uuid');
import {spawnSync} from "child_process";
import * as fs from "fs";
import { NetConnectOpts } from 'net';
import { AppContext } from 'next/app';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function POST(req: NextRequest): Promise<NextResponse<types.SuccessResponseJSON | types.ErrorResponseJSON>>
{
    const formData = await req.formData();
    const values = formData.values();
    let row = values.next();
    const errors = new Array<{blob: Blob,error: string}>();
    const sessionIdCookie = req.cookies.get("session_id");
    if (!sessionIdCookie)
        return NextResponse.json({error: "NO_SESSION_ID"},{status:400});
    const sessionId = (sessionIdCookie as RequestCookie).value;
    const workingDirectory = "circom_user_files/" + sessionId; // where all the stuff inputted by user and generated from user input will go
    let numValues = 0;
    while (!row.done)
    {
        numValues += 1;
        const fileId = uuidv4();
        const inputFileName = fileId + ".circom";
        const blob = (row.value as Blob);
        const value = await blob.text();
        fs.writeFileSync(workingDirectory + "/" + inputFileName,value,{
        flag:"w"
        });
        const buffer = spawnSync("circom",[inputFileName,"--wasm"],{
            stdio:["inherit","pipe","pipe"],
            cwd: workingDirectory
        },);

        if (buffer.error)
        {
            console.error("circom buffer error for file '" + inputFilePath + ": " + buffer.error);
            errors.push({blob: blob,error:buffer.error.message});
        }
        else
        {
            console.log("circom logs: " + buffer.output);
        }
        row = values.next();
    }
    if (errors.length >= numValues)
        return NextResponse.json({error: errors.toString},{
    status:400
        });
    else
    {
        const obj = {sessionId: sessionId};
        if (errors.length == 0)
            return NextResponse.json(obj);
        else
            return NextResponse.json(obj,{status:206});
    }
}
