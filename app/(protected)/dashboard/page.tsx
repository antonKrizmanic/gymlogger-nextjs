import { auth } from "@/lib/auth";

const DashboardPage = async() =>{
    const session = await auth();

    return (
        <div>
            {JSON.stringify(session)}
        </div>
    );
}

export default DashboardPage;