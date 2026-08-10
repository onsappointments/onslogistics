"use client";

import {useState} from "react";


export default function ShipmentAssignmentSelector({
 id
}){

const [loading,setLoading]=useState(false);


async function assign(type){

setLoading(true);


await fetch(
 `/api/admin/quotes/${id}/assign-shipment-type`,
 {
  method:"PATCH",
  headers:{
   "Content-Type":"application/json"
  },
  body:JSON.stringify({
   shipmentType:type
  })
 }
);


window.location.reload();

}


return (

<div className="flex gap-3 mt-3">

<button
disabled={loading}
onClick={()=>assign("import")}
className="px-4 py-2 bg-blue-600 text-white rounded"
>
Import
</button>


<button
disabled={loading}
onClick={()=>assign("export")}
className="px-4 py-2 bg-green-600 text-white rounded"
>
Export
</button>


</div>

);

}