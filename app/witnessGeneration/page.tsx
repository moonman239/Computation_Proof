"use client";

import { useState } from "react";
async function generateWitness(input: string)
{
    const formData = new FormData();
    formData.append("circuit_input",input);
    const response = await fetch("/circom/generateWitnesses",{
        body:formData,
        method: "POST"
    })
    return response.ok;  
}

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
                setSuccess(await generateWitness(input));
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