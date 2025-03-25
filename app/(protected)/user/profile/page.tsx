import { Container } from "@/src/components/Common/Container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Trash } from "lucide-react";
import { auth } from "@/src/lib/auth";

export default async function ProfilePage() {
    const session = await auth();
    const user = session?.user;

    return (
        <Container>
            <div className="pb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">User profile</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal info</CardTitle>
                        <CardDescription>Your personal information and account settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-400">Name</h3>
                                <p className="text-gray-900 dark:text-gray-100">{user?.name || "Not provided"}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-400">Email</h3>
                                <p className="text-gray-900 dark:text-gray-100">{user?.email}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 border-t pt-6">
                        <div className="w-full bg-red-50 rounded border-1 border-red-500 p-4">
                            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-400 mb-2">Danger Zone</h3>
                            <Button variant="destructive" className="w-full sm:w-auto">
                                <Trash className="h-4 w-4 mr-2" /> Delete Account
                            </Button>
                        </div>
                    </CardFooter>
                </Card>            
            </div>
        </Container>
    )
}