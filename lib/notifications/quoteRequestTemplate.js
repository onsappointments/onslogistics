import { emailLayout } from "./templates";

export const quoteRequestTemplate = (quote) =>
  emailLayout(
    "New Quote Request",
    `
      <h3>New Quote Request Received</h3>

      <table>

        <tr>
          <td><b>Company</b></td>
          <td>${quote.company}</td>
        </tr>

        <tr>
          <td><b>Email</b></td>
          <td>${quote.email}</td>
        </tr>

        <tr>
          <td><b>Phone</b></td>
          <td>${quote.phone}</td>
        </tr>

        <tr>
          <td><b>Transport</b></td>
          <td>${quote.modeOfTransport}</td>
        </tr>

        <tr>
          <td><b>Route</b></td>
          <td>${quote.fromCountry} → ${quote.toCountry}</td>
        </tr>

      </table>
    `
  );