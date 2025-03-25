import { NewVerificationForm } from "@/src/components/Auth/new-verification";
import { Suspense } from "react";

export default async function NewVerificationPage() {
    return(
        <Suspense>
            <NewVerificationForm />
        </Suspense>
    )
}