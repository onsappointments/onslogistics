import { emailLayout } from "./templates";

export const jobAssignedTemplate = (job) =>
  emailLayout(
    "Job Assigned",
    `
      <h3>You Have Been Assigned A Job</h3>

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
        Please login to ERP and begin processing.
      </p>
    `
  );