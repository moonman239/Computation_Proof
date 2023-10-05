import { NextRequest, NextResponse} from "next/server";
import { readFile } from "fs/promises";
import path from "path";
/**
 * 
 * @param request A POST request with a cookie named "session_id."
 * @returns If successful, the user's .wtns file. If unsuccessful, an error response.
 */
export async function GET(request:NextRequest) {
    const sessionId = request.cookies.get("session_id")?.value;
    if (!sessionId)
        return NextResponse.json({error: "NO_SESSION_ID"},{status:400});
    else
    {
        // read .wtns file
        console.log(sessionId);
        const uploadDir = path.join(process.cwd(),`circom_user_files`);
        const userFiles = path.join(uploadDir,`${sessionId}_js`);
    try
    {
        const witnessFile = await readFile(path.join(userFiles,"witness.wtns"));
        return new NextResponse(witnessFile.toString("utf8"),{
            headers: {"Content-Type":"application/wtns"}
        });
    }
    catch(e)
    {
        console.error(e);
        return new NextResponse("generic server error",{status:500});
    }
    }
}