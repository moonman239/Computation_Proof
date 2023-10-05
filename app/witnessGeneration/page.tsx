"use client";

import { useState } from "react";
/**
 * calls the witness generation endpoint
 * @param input The input to the circuit
 * @throws Errors when the client does not receive an "OK" from the server.
 */
async function generateWitness(input: string)
{
    const formData = new FormData();
    formData.append("circuit_input",input);
    const response = await fetch("/circom/generateWitnesses",{
        body:formData,
        method: "POST"
    });
    if (!response.ok)
        throw new Error(await response.text());

}
/**
 * Gets the value of a cookie.
 * @param name The cookie name.
 * @returns The value of the cookie.
 */
function getCookieValue(name: string) { let cookies = document.cookie.split("; "); let startingString = name + "="; let cookie = cookies.filter((value)=>value.startsWith(startingString))[0]; return cookie.replace(startingString,""); };
/**
 * React component for generating witnesses.
 */
export default function WitnessGeneration() {
    const [input,setInput] = useState<string>(); // really makes no sense to support more than one
    const [success,setSuccess]= useState(false);
    return <div>
        <form onSubmit={async (e)=>{
            e.preventDefault();
            if (input)
            {
                try
                {
                    await generateWitness(input);
                    setSuccess(true);
                }
                catch (e)
                {
                    console.error(e);
                    setSuccess(false);
                }
            }
            else
                alert("please add some input.");
        }}>
        Enter your input in JSON format, then click "Generate Witness" to generate a witness file.
        If successful, a "Download WTNS" link will appear.
        Input: <input type="text" onChange={(e)=>setInput(e.target.value)} />
        <button type="submit">Generate Witness</button>
        </form>
        {success ? <a href="/circom/downloadWtns">Download WTNS</a> : ""}
        </div>
}