import { NextResponse } from 'next/server';
const { v4: uuidv4 } = require('uuid');
const {exec} = require("child_process");
export async function POST(req: Request)
{
    const text = await req.text();
    console.log("received " + text);
    return NextResponse.json({"text":text});
}