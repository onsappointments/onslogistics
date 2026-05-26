// lib/locations/locationsData.js

import { freightForwardingLocations } from "./freightForwarding";
import { customsClearanceLocations } from "./customsClearance";
import { seaFreightLocations } from "./seaFreight";
import { airFreightLocations } from "./airFreight";
import { roadTransportationLocations } from "./roadTransportation";
import { licensingLocations } from "./licensing";
import { importExportConsultationLocations } from "./importExportConsultation";

export const locationsData = {

  "freight-forwarding":
    freightForwardingLocations,

  "customs-clearance":
    customsClearanceLocations,

  "sea-freight":
    seaFreightLocations,

  "air-freight":
    airFreightLocations,

  "road-transportation":
    roadTransportationLocations,

  "licensing":
    licensingLocations,
  "importExportConsultation":
    importExportConsultationLocations,
};