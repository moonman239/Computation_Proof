import { NextResponse } from 'next/server';
import * as types from "./types";
const { v4: uuidv4 } = require('uuid');
const {exec} = require("child_process");
import * as fs from "fs";

export async function POST(req: Request)
{
    const formData = await req.formData();
    req.body
    const values = formData.values();
    let row = values.next();
    const badBlobs: Array<Blob | undefined> = [];
    while (!row.done)
    {
        const uuid = uuidv4();
        const inputFilePath = uuid + ".circom";
        const outputFilePath = uuid + ".json";
        const blob: Blob | undefined = row.value;

        if (blob)
        {
            const value = await blob.text();
            fs.writeFileSync(inputFilePath,value,{
            flag:"w"
            });
            exec("npx circom " + inputFilePath + " -o " + outputFilePath);
        }
        else
        {
            badBlobs.push(blob);
            console.error("undefined blob");
        }
        row = values.next();
    }
    return NextResponse.json({badBlobs: badBlobs});
}