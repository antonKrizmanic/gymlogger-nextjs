"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AlertTriangle, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteUser } from "@/src/actions/delete-user";
import { useRouter } from "next/navigation";

export interface UserDeleteDialogProps {	
	userEmail?: string;
}

export default function UserDeleteDialog({ userEmail }: UserDeleteDialogProps) {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	const [confirmation, setConfirmation] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	
	const handleDelete = async () => {
		if (!userEmail || confirmation !== userEmail) {
			toast.error("Email doesn't match");
			return;
		}
		
		try {
			setIsDeleting(true);
			await deleteUser(confirmation);
			setIsDialogOpen(false);
			toast.success("Account deleted successfully");
			router.push("/");
		} catch (error) {
			console.error("Failed to delete account:", error);
			toast.error("Failed to delete account");
		} finally {
			setIsDeleting(false);
		}
	};
	
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" className="w-full sm:w-auto hover:cursor-pointer hover:opacity-80 transition-opacity duration-200 ease-in-out">
					<Trash className="h-4 w-4 mr-2" /> Delete Account
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] bg-white text-black dark:bg-slate-900 dark:text-white">
				<DialogHeader>
					<DialogTitle className="flex items-center text-destructive">
						<AlertTriangle className="h-5 w-5 mr-2" /> Delete Your Account
					</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<p className="text-sm font-medium">
							Please type your email <span className="font-bold">{userEmail}</span> to confirm
						</p>
						<Input 
							value={confirmation} 
							onChange={(e) => setConfirmation(e.target.value)}
							className="w-full" 
							placeholder={userEmail} 
							type="email"
						/>
					</div>
					<div className="text-sm text-muted-foreground">
						<p>All your workouts, exercises, and personal data will be permanently removed.</p>
					</div>
				</div>
				<DialogFooter className="flex gap-2 sm:gap-1">
					<Button
						variant="ghost"
						onClick={() => setIsDialogOpen(false)}
					>
						Cancel
					</Button>
					<Button 
						variant="destructive" 
						onClick={handleDelete}
						disabled={!userEmail || confirmation !== userEmail || isDeleting}
					>
						{isDeleting ? "Deleting..." : "Delete Account"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}