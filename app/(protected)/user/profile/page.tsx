import { ProfileEditForm } from "@/src/components/auth/profile-edit-form";
import UserDeleteDialog from "@/src/components/auth/user-delete-dialog";
import { Container } from "@/src/components/common/container";
import UserAvatar from "@/src/components/navigation/user-avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { getUserByEmail } from "@/src/data/user";
import { auth } from "@/src/lib/auth";
import { AlertTriangle, Mail, Shield, User } from "lucide-react";
import { SessionProvider } from "next-auth/react";


export default async function ProfilePage() {
	const session = await auth();
	const user = session?.user;

	// Get full user data to access weight and height
	const fullUserData = user?.email ? await getUserByEmail(user.email) : null;

	return (
		<Container>
			{/* Hero Section */}
			<div className="text-center space-y-4 mb-8">
				<div className="mx-auto w-24 h-24 flex items-center justify-center">
					<SessionProvider>
						<div className="scale-[3] transform">
							<UserAvatar />
						</div>
					</SessionProvider>
				</div>
				<div>
					<h1 className="text-3xl font-bold">Welcome, {user?.name || "User"}!</h1>
					<p className="text-muted-foreground">Manage your account settings and preferences</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
				{/* Personal Information Card */}
				<Card className="border-2 shadow-xl">
					<CardHeader className="pb-4">
						<CardTitle className="flex items-center space-x-3">
							<div className="p-2 bg-primary/10 rounded-lg">
								<Shield className="h-5 w-5 text-primary" />
							</div>
							<span>Personal Information</span>
						</CardTitle>
						<CardDescription>Your account details and basic information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							<div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border">
								<div className="p-2 bg-primary/10 rounded-lg">
									<User className="h-5 w-5 text-primary" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Full Name</p>
									<p className="text-lg font-semibold">{user?.name || "Not provided"}</p>
								</div>
							</div>
							<div className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg border">
								<div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
									<Mail className="h-5 w-5 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Email Address</p>
									<p className="text-lg font-semibold break-all">{user?.email}</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Physical Information Card */}
				<ProfileEditForm
					initialWeight={fullUserData?.weight ? Number(fullUserData.weight) : null}
					initialHeight={fullUserData?.height ? Number(fullUserData.height) : null}
				/>

				{/* Account Management Card */}
				<Card className="border-2 shadow-xl">
					<CardHeader className="pb-4">
						<CardTitle className="flex items-center space-x-3">
							<div className="p-2 bg-destructive/10 rounded-lg">
								<AlertTriangle className="h-5 w-5 text-destructive" />
							</div>
							<span>Account Management</span>
						</CardTitle>
						<CardDescription>Manage your account settings and data</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="p-4 bg-destructive/5 border-2 border-destructive/20 rounded-lg">
								<div className="flex items-start space-x-3">
									<AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
									<div className="flex-1">
										<h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
										<p className="text-sm text-muted-foreground mb-4">
											Once you delete your account, there is no going back. Please be certain.
										</p>
										<UserDeleteDialog
											userEmail={user?.email || ""}
										/>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</Container>
	);
}