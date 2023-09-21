import { NextResponse } from 'next/server';
import * as types from "./types";
const { v4: uuidv4 } = require('uuid');
const {exec} = require("child_process");
const fs = require("fs");

export async function POST(req: Request)
{
    const formData = await req.formData();
    req.body
    const values = formData.values();
    let row = values.next();
    while (row)
    {
        console.log(row.value);
        const uuid = uuidv4();
        const inputFilePath = ".circom/ " + uuid + ".circom";
        const outputFilePath = ".json/" + uuid + ".json";
        const blob: Blob = row.value;
        const value = await blob.text();
        fs.writeFileSync(inputFilePath,value);
        exec("npx circom " + inputFilePath + " -o " + outputFilePath);
        row = values.next();
    }
    return NextResponse.json();
}