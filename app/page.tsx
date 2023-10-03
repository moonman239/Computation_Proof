"use client";  // since state is used, we can't use a server-based component
import Image from 'next/image'
import { ChangeEvent, FormEvent, useState } from 'react';
import {ErrorResponseJSON,SuccessResponseJSON } from "./circom/compile_circuit/types";
import { ConfirmCustomerBalancePaymentData } from '@stripe/stripe-js';

async function compileCircuit(circuitFile: File)
{
  const circuitFileFormData = new FormData();
  circuitFileFormData.append("circuit",circuitFile);
  const sessionIdResponse = await fetch("createSession",{method:"POST"});
  const compilationResponse = await fetch("circom/compile_circuit",{
          method: "POST",
          body: circuitFileFormData
        });
  const responseText = await compilationResponse.text();
  return responseText;
}


export default function Home() {
  const [files,setFiles] = useState<FileList>();
  const onSubmit = (e:FormEvent)=>{
    e.preventDefault();
    
    if (files)
    {
          // generate witnesses for each file
                compileCircuit(files[0]).then((t)=>console.log(t)).catch((e)=>console.error("Response error:" + e))
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
