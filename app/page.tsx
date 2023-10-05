"use client";  // since state is used, we can't use a server-based component
import Image from 'next/image'
import { ChangeEvent, FormEvent, useState } from 'react';
import {ErrorResponseJSON,SuccessResponseJSON } from "./circom/compile_circuit/types";
import { ConfirmCustomerBalancePaymentData } from '@stripe/stripe-js';

async function compileCircuit(circuitFile: File)
{
  const circuitFormData = new FormData();
  circuitFormData.append("circuit",circuitFile);
  const sessionIdResponse = await fetch("createSession",{method:"POST"});
  const compilationResponse = await fetch("circom/compile_circuit",{
          method: "POST",
          body: circuitFormData
        });
  if (!compilationResponse.ok)
  {
    const responseText = await compilationResponse.text();
    throw new Error(responseText);
  }
}


export default function Home() {
  const [files,setFiles] = useState<FileList>();
  const [success,setSuccess] = useState(false);
  const onSubmit = (e:FormEvent)=>{
    e.preventDefault();
    
    if (files)
    {
        compileCircuit(files[0]).then(()=>setSuccess(true)).catch((e)=>{
          alert("Could not compile file. Please check your program and try again later.");
          console.error("Response error:" + e);
          setSuccess(false);
      })
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
      <h3>Circom</h3>
      Select a circom file, then click Compile.
      <form onSubmit={onSubmit}>
      <input type="file" accept=".circom" onChange={fileChange}></input>
      <button type="submit">Compile</button>
      </form>
      {success ? <a href="/witnessGeneration">Generate Witness</a> : ""}
    </div>
  )
}
