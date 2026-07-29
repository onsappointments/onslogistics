export const runtime = "nodejs";

import { NextResponse } from "next/server";
import countries from "@/lib/location-data/countries+states+cities.json";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get("endpoint");

    if (!endpoint) {
      return NextResponse.json(
        { error: "Missing endpoint" },
        { status: 400 }
      );
    }

    const parts = endpoint.split("/");

    // ------------------------------------
    // /countries
    // ------------------------------------
    if (endpoint === "countries") {
      return NextResponse.json(countries);
    }

    // ------------------------------------
    // /countries/IN/states
    // ------------------------------------
    if (
      parts.length === 3 &&
      parts[0] === "countries" &&
      parts[2] === "states"
    ) {
      const country = countries.find(
        (c) => c.iso2 === parts[1]
      );

      return NextResponse.json(country?.states || []);
    }

    // ------------------------------------
    // /countries/IN/states/PB/cities
    // ------------------------------------
    if (
      parts.length === 5 &&
      parts[0] === "countries" &&
      parts[2] === "states" &&
      parts[4] === "cities"
    ) {
      const country = countries.find(
        (c) => c.iso2 === parts[1]
      );

      if (!country) {
        return NextResponse.json([]);
      }

      const state = country.states.find(
        (s) => s.iso2 === parts[3]
      );

      return NextResponse.json(state?.cities || []);
    }

    return NextResponse.json(
      { error: "Invalid endpoint" },
      { status: 404 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}