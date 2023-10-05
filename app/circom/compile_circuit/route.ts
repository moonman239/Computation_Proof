import { NextResponse, NextRequest } from 'next/server';
import * as types from "./types";
const { v4: uuidv4 } = require('uuid');
import {spawnSync} from "child_process";
import * as fs from "fs";
import { NetConnectOpts } from 'net';
import { AppContext } from 'next/app';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import copyFile from '../fileIO';
/***
 * @param circuitFileName The file name of the circuit.
 * @param circuitFileDirectory The directory in which circuitFileName is located.
 *  Compiles a Circom circuit.
 * @returns The output after running the "circom" command.
 */
function compileCircuit(circuitFileName:string,circuitFileDirectory:string)
{
        const {stderr,stdout,status} = spawnSync("circom",[circuitFileName,"--wasm"],{
            cwd: circuitFileDirectory
        });
        if (status !== 0)
            throw new Error(stderr.toString("utf8"));
        else
            return stdout.toString("utf8");
}



/**
 * @param req a request coniaining a session ID cookie, and form data with the source code file for a Circom circuit.
 * @returns A response (indicating whether or not the circuit was successfully compiled)
 */
export async function POST(req: NextRequest)
{
    const formData = await req.formData();
    const circuitFile: File | null = formData.get("circuit") as (File | null);
    const sessionIdCookie = req.cookies.get("session_id");
    if (!sessionIdCookie)
        return NextResponse.json({error: "NO_SESSION_ID"},{status:400});
    if (circuitFile)
    {
        // TODO: validate circuit
        const sessionId = (sessionIdCookie as RequestCookie).value;
        const circuitFileName = `${sessionId}.circom`;
        // write circuit to file
        const circuitFileDirectory = `circom_user_files`;
        await copyFile(circuitFile,circuitFileDirectory + "/" + circuitFileName);
        try
        {
            const c = compileCircuit(circuitFileName,circuitFileDirectory);
            if (c)
                console.warn(c); // this could be an error
            return new NextResponse("success",{status:200});
        }
        catch(e)
        {
            console.error(`error while compiling circuit at ${circuitFileDirectory}/${circuitFileName}: ${e}`);
            return new NextResponse("error",{status:500});
        }
    }
    else
    {
        return new NextResponse("no_valid_id",{status:400});
    }
}
