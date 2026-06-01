import { emailLayout } from "./templates";

export const containerStatusTemplate = ({
  customerName,
  containerNumber,
  status,
  location,
  eventDate
}) =>
  emailLayout(
    "Shipment Update",
    `
      <p>
        Dear ${customerName},
      </p>

      <p>
        Your shipment status has been updated.
      </p>

      <table>

        <tr>
          <td><b>Container</b></td>
          <td>${containerNumber}</td>
        </tr>

        <tr>
          <td><b>Status</b></td>
          <td>${status}</td>
        </tr>

        <tr>
          <td><b>Location</b></td>
          <td>${location}</td>
        </tr>

        <tr>
          <td><b>Date</b></td>
          <td>${eventDate}</td>
        </tr>

      </table>

      <p>
        Thank you for choosing ONS Logistics.
      </p>
    `
  );