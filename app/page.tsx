"use client";  // since state is used, we can't use a server-based component
import Image from 'next/image'
import { ChangeEvent, FormEvent, useState } from 'react';
import {ErrorResponseJSON,SuccessResponseJSON } from "./circom/compile_circuit/types";
import { ConfirmCustomerBalancePaymentData } from '@stripe/stripe-js';

async function compileCircuit(files: FileList): Promise<SuccessResponseJSON>
{
  const filesFormData = new FormData();
  for (let i=0; i<files.length; i++)
    filesFormData.append("files_" + i,files[i]);
  const sessionIdResponse = await fetch("createSession",{method:"POST"});
  const compilationResponse = await fetch("circom/compile_circuit",{
          method: "POST",
          body: filesFormData
        });
  const crJson: SuccessResponseJSON | ErrorResponseJSON = await compilationResponse.json();
  if (compilationResponse.ok)
  {
    return (crJson as SuccessResponseJSON);
  }
  else
  {
    throw new Error((crJson as ErrorResponseJSON).error);
  }  
}
async function generateWitnesses(sessionId: string)
{
  const sessionFormData = new FormData();
  console.log("generating witness for id " + sessionId);
  sessionFormData.append("session_id",sessionId);
  const generateWitnessesResponse = await fetch("circom/generateWitnesses",{
    method: "POST",
    body: sessionFormData
  });
  const generateWitnessesResponseJson = await generateWitnessesResponse.json();
  return generateWitnessesResponseJson;
}


export default function Home() {
  const [files,setFiles] = useState<FileList>();
  const onSubmit = (e:FormEvent)=>{
    e.preventDefault();
    
    if (files)
    {
          // generate witnesses for each file
                compileCircuit(files).then((json)=>generateWitnesses(json.sessionId)).catch((e)=>console.error("Response error:" + e))
      }
        else
      alert("Please add files.");
  }
  const fileChange = (event:ChangeEvent<HTMLInputElement>)=>
  {
    console.log("file change");
    const fileList = event.target.files;
    if (fileList)
      setFiles(fileList);
    else
    {
      alert("Can't add files.");
      console.error("fileList is null");
    }
  }
  return (
    <div>
      <h3>Circuit Prover</h3>
      Select a circum file, then click Upload to prove it.
      <form onSubmit={onSubmit}>
      <input type="file" accept=".circom" onChange={fileChange}></input>
      <button type="submit">Upload</button>
      </form>
      <div></div>
    </div>
  )
}
