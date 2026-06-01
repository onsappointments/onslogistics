import { emailLayout } from "./templates";

export const jobCreatedTemplate = (job) =>
  emailLayout(
    "Job Created",
    `
      <h3>New Job Created</h3>

      <table>

        <tr>
          <td><b>Job Number</b></td>
          <td>${job.jobNumber}</td>
        </tr>

        <tr>
          <td><b>Customer</b></td>
          <td>${job.customerName}</td>
        </tr>

        <tr>
          <td><b>Company</b></td>
          <td>${job.company}</td>
        </tr>

      </table>

      <p>
        Please assign this shipment to a team member.
      </p>
    `
  );