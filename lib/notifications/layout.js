export const emailLayout = (title, content) => `
<div style="background:#f8fafc;padding:30px">

  <div style="
      max-width:700px;
      margin:auto;
      background:white;
      border-radius:12px;
      overflow:hidden;
  ">

    <div style="
      background:#0f172a;
      color:white;
      padding:20px;
    ">
      <h1 style="margin:0">
        ONS Logistics India
      </h1>
    </div>

    <div style="padding:30px">
      ${content}
    </div>

    <div style="
      background:#f1f5f9;
      padding:20px;
      text-align:center;
      font-size:12px;
    ">
      © ONS Logistics India
    </div>

  </div>

</div>
`;