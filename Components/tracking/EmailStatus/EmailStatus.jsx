"use client";

import { useState } from "react";
import EmailStatusBadge from "./EmailStatusBadge";
import EmailStatusPanel from "./EmailStatusPanel";

export default function EmailStatus({ emailLog }) {

    const [open,setOpen]=useState(false);

    return (

        <div>

            <EmailStatusBadge

                status={emailLog.currentStatus}

                onClick={() => setOpen(prev => !prev)}

            />

            {

                open && (

                    <EmailStatusPanel

                        emailLog={emailLog}

                    />

                )

            }

        </div>

    );

}