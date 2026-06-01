export const emailLayout = (title, content) => `
<div style="
  font-family: Arial, sans-serif;
  background:#f5f7fa;
  padding:30px;
">

  <div style="
    max-width:700px;
    margin:auto;
    background:white;
    border-radius:12px;
    overflow:hidden;
  ">

    <div style="
      background:#003366;
      color:white;
      padding:20px;
    ">
      <h2 style="margin:0">
        ONS Logistics India
      </h2>
    </div>

    <div style="padding:30px">
      ${content}
    </div>

    <div style="
      background:#f1f5f9;
      padding:15px;
      text-align:center;
      color:#64748b;
      font-size:12px;
    ">
      ONS Logistics India
    </div>

  </div>

</div>
`;