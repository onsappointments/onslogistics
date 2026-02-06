// utils/locationHelpers.js
import { Country, State } from 'country-state-city';

export function getCountryName(code) {
  const country = Country.getCountryByCode(code);
  return country?.name || code;
}

export function getStateName(countryCode, stateCode) {
  const state = State.getStateByCodeAndCountry(stateCode, countryCode);
  return state?.name || stateCode;
}