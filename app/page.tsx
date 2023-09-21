"use client";  // since state is used, we can't use a server-based component
import Image from 'next/image'
import { ChangeEvent, FormEvent, useState } from 'react';
import {ResponseJSON } from "./circom/types";
import { ConfirmCustomerBalancePaymentData } from '@stripe/stripe-js';

export default function Home() {
  const [files,setFiles] = useState<FileList>();
  const onSubmit = (e:FormEvent)=>{
    e.preventDefault();
    
    if (files)
    {
      const formData = new FormData();
      for (let i=0; i<files.length; i++)
        formData.append("files_" + i,files[i]);
       fetch("circom",{
          headers: {"Content-Type":"application/json"},
          method: "POST",
          body: formData
        }).then((response)=>response.json()).then((json: ResponseJSON)=>{
          alert(JSON.stringify(json));
        }).catch((e)=>console.error("Response error:" + e))
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
