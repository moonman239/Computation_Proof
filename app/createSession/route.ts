import { NextResponse } from "next/server";
import { mkdirSync } from "fs";
const { v4: uuidv4 } = require('uuid');
export function POST()
{
    const response: NextResponse = new NextResponse();
    const sessionId = uuidv4();
    response.cookies.set("session_id",sessionId);
    // create directory
    mkdirSync("circom_user_files/" + sessionId);
    return response;
}