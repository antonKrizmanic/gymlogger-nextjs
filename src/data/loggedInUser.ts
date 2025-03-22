import { auth } from "../lib/auth";
import { getUserByEmail } from "./user";

export const getLoggedInUser = async () => {
    const session = await auth();
    if (!session) return null;
    return getUserByEmail(session.user?.email as string);
}