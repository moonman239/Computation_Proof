import { NextResponse } from 'next/server';
import * as types from "./types";
const { v4: uuidv4 } = require('uuid');
import {spawnSync} from "child_process";
import * as fs from "fs";

export async function POST(req: Request)
{
    const formData = await req.formData();
    req.body
    const values = formData.values();
    let row = values.next();
    const errors = new Array<{blob: Blob,error: string}>();
    const compiledCircuits = new Array<string>();
    while (!row.done)
    {
        const uuid = uuidv4();
        const inputFilePath = uuid + ".circom";
        const blob = (row.value as Blob);
        const value = await blob.text();
        fs.writeFileSync(inputFilePath,value,{
        flag:"w"
        });
        const buffer = spawnSync("circom",[inputFilePath],{
            stdio:["inherit","pipe","pipe"]
        });

        if (buffer.error)
            console.error("circom buffer error" + buffer.error);
        const cmdOut = buffer.stdout;
        if (cmdOut)
            console.log(cmdOut.toString());
        console.log("circom out: " + cmdOut);
        const cmdError = buffer.stderr;
        if (cmdError)
        {
            const errorString = cmdError.toString();
            console.error("circom error:" + errorString);
            errors.push({blob: blob,error:errorString});
        }
        else
        {
            // send file in response
            const fileBuffer = fs.readFileSync(outputFilePath);
            const compiledCircuit = fileBuffer.toString();
            compiledCircuits.push(compiledCircuit);
        }
        row = values.next();
    }
    return NextResponse.json({compiledCircuits:compiledCircuits, errors:errors},{
        status:errors ? 400: 200
    });
}