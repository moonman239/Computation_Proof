"use client";  // since state is used, we can't use a server-based component
import Image from 'next/image'
import { ChangeEvent, FormEvent, useState } from 'react';
import {ResponseJSON } from "./circom/types";
import { ConfirmCustomerBalancePaymentData } from '@stripe/stripe-js';

export default function Home() {
  const [files,setFiles] = useState<FileList | null>();
  const onSubmit = (e:FormEvent)=>{
    e.preventDefault();
    if (files)
       fetch("circom",{
          headers: {"Content-Type":"application/json"},
          method: "POST",
          body: JSON.stringify(files)
        }).then((response)=>response.json()).then((json: ResponseJSON)=>{
          alert(JSON.stringify(json));
        }).catch((e)=>console.error("Response error:" + e))
    else
      alert("Please add files.");
  }
  const fileChange = (event:ChangeEvent<HTMLInputElement>)=>
  {
    const _files = event.target.files;
    setFiles(_files);
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
