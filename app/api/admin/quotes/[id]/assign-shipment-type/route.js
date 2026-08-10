import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";


export async function PATCH(req,{params}) {

try {

await connectDB();

const {id}=await params;

const {shipmentType}=await req.json();


if(!["import","export"].includes(shipmentType)){
 return NextResponse.json(
  {
   error:"Invalid shipment type"
  },
  {
   status:400
  }
 );
}


const quote = await Quote.findById(id);


if(!quote){
 return NextResponse.json(
  {
   error:"Quote not found"
  },
  {
   status:404
  }
 );
}


// only XTR can use this assignment
if(quote.shipmentType !== "Cross Trade"){
 return NextResponse.json(
 {
  error:"Shipment assignment only allowed for Cross Trade quotes"
 },
 {
  status:400
 });
}


quote.shipmentType = shipmentType;
quote.originalShipmentType = "Cross Trade";


await quote.save();


return NextResponse.json({
 success:true,
 quote
});


}
catch(error){

console.error(error);

return NextResponse.json(
 {
  error:error.message
 },
 {
  status:500
 }
);

}

}