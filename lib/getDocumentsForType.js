// lib/getDocumentsForType.js

export default function getDocumentsForType(shipmentType) {
    switch (shipmentType) {
      case "import":
        return [
          "KYC Documents",
          "Import Invoice",
          "Packing List",
          "Bill of Lading Copy",
        ];
  
      case "export":
        return [
          "KYC Documents",
          "Export Invoice",
          "Packing List",
          "Shipping Bill Copy",
        ];
  
      case "courier":
        return [
          "KYC Documents",
          "Courier Invoice",
          "Packing List",
          "Airway Bill Copy",
        ];
  
      default:
        return ["KYC Documents"];
    }
  }
  