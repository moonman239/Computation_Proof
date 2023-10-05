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
    // if response OK, nothing should be returned
    if (!response.ok)
        console.error(await response.text());
}

async function generateProof(input:string)
{
    // return a proof
    return null;
}
 function getCookieValue(name: string) { let cookies = document.cookie.split("; "); let startingString = name + "="; let cookie = cookies.filter((value)=>value.startsWith(startingString))[0]; return cookie.replace(startingString,""); };

export default function WitnessGeneration() {
    const [input,setInput] = useState<string>(); // really makes no sense to support more than one
    return <div>
        <form onSubmit={async (e)=>{
            e.preventDefault();
            if (input)
            {
                await generateWitness(input);
                const proof = await generateProof(input);
            }
            else
                alert("please add some input.");
        }}>
        Input: <input type="text" onChange={(e)=>setInput(e.target.value)} />
        <button type="submit">Generate Witness</button>
        </form>
        </div>
}