import { format } from "date-fns";

import { ProfileEditForm } from "@/src/components/auth/profile-edit-form";
import UserDeleteDialog from "@/src/components/auth/user-delete-dialog";
import { Container } from "@/src/components/common/container";
import { WeightHistoryChart } from "@/src/components/profile/weight-history-chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { getUserByEmail, getUserWeights } from "@/src/data/user";
import { auth } from "@/src/lib/auth";
import { AlertTriangle, Mail, Shield } from "lucide-react";


export default async function ProfilePage() {
        const session = await auth();
        const user = session?.user;

        // Get full user data to access weight and height
        const fullUserData = user?.email ? await getUserByEmail(user.email) : null;
        const weightHistory = fullUserData?.id ? await getUserWeights(fullUserData.id, 365) : [];

        const latestWeightEntry = weightHistory.length ? weightHistory[weightHistory.length - 1] : null;
        const firstWeightEntry = weightHistory.length ? weightHistory[0] : null;

        const latestWeightValue = latestWeightEntry ? Number(latestWeightEntry.weight) : null;
        const firstWeightValue = firstWeightEntry ? Number(firstWeightEntry.weight) : null;
        const weightDelta =
                latestWeightValue !== null && firstWeightValue !== null
                        ? Number((latestWeightValue - firstWeightValue).toFixed(1))
                        : null;

        const lastLoggedAt = latestWeightEntry
                ? format(
                          typeof latestWeightEntry.createdAt === "string"
                                  ? new Date(latestWeightEntry.createdAt)
                                  : latestWeightEntry.createdAt,
                          "MMM d, yyyy",
                  )
                : null;

        const firstLoggedAt = firstWeightEntry
                ? format(
                          typeof firstWeightEntry.createdAt === "string"
                                  ? new Date(firstWeightEntry.createdAt)
                                  : firstWeightEntry.createdAt,
                          "MMM d, yyyy",
                  )
                : null;

        const displayName = user?.name || "User";
        const emailAddress = user?.email || "Email not provided";
        const avatarInitials = displayName
                .split(" ")
                .filter(Boolean)
                .map((part) => part[0]?.toUpperCase())
                .join("")
                .slice(0, 2) || "U";

        const quickStats = [
                {
                        label: "Current weight",
                        value:
                                latestWeightValue !== null && Number.isFinite(latestWeightValue)
                                        ? `${latestWeightValue.toFixed(1)} kg`
                                        : "Not set",
                        helper: lastLoggedAt ? `Updated ${lastLoggedAt}` : "Log your first weight entry",
                },
                {
                        label: "Height",
                        value:
                                fullUserData?.height !== null && fullUserData?.height !== undefined
                                        ? `${Number(fullUserData.height).toFixed(0)} cm`
                                        : "Not set",
                        helper: "Used across training summaries",
                },
                {
                        label: "Entries logged",
                        value: weightHistory.length ? weightHistory.length.toString() : "0",
                        helper:
                                weightDelta !== null && weightHistory.length > 1
                                        ? `${weightDelta > 0 ? "▲" : "▼"} ${Math.abs(weightDelta).toFixed(1)} kg since ${firstLoggedAt}`
                                        : firstLoggedAt
                                        ? `Tracking since ${firstLoggedAt}`
                                        : "Start tracking to see progress",
                },
        ];

        return (
                <Container className="py-10">
                        <div className="space-y-10">
                                <header className="max-w-4xl space-y-3">
                                        <Badge variant="outline" className="w-fit rounded-full border-primary/30 bg-primary/10 text-primary">
                                                Profile
                                        </Badge>
                                        <div className="space-y-2">
                                                <h1 className="type-heading-lg text-foreground">Account &amp; wellness overview</h1>
                                                <p className="type-body-md text-muted-foreground">
                                                        Review your saved details, keep body metrics current, and manage sensitive account actions.
                                                </p>
                                        </div>
                                </header>

                                <div className="grid gap-6 lg:grid-cols-[minmax(280px,320px)_1fr] lg:items-start">
                                        <div className="space-y-6">
                                                <Card>
                                                        <CardHeader className="gap-4">
                                                                <div className="flex items-center gap-4">
                                                                        <Avatar className="h-16 w-16 rounded-2xl border border-border bg-primary/10 text-primary shadow-card-rest">
                                                                                <AvatarImage src={user?.image ?? undefined} alt={displayName} />
                                                                                <AvatarFallback className="rounded-2xl bg-primary text-primary-foreground text-lg font-semibold">
                                                                                        {avatarInitials}
                                                                                </AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="space-y-1">
                                                                                <CardTitle className="type-heading-sm text-foreground">{displayName}</CardTitle>
                                                                                <div className="flex items-center gap-2 text-left">
                                                                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                                                                        <span className="type-body-sm text-muted-foreground break-all">{emailAddress}</span>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                                <CardDescription className="text-muted-foreground">
                                                                        Personal information used across your training summaries and preferences.
                                                                </CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="space-y-4">
                                                                <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
                                                                        <Shield className="h-4 w-4 text-primary" />
                                                                        <span className="type-body-sm text-muted-foreground">Your details are private and visible only to you.</span>
                                                                </div>
                                                                <div className="grid gap-3">
                                                                        {quickStats.map((stat) => (
                                                                                <div
                                                                                        key={stat.label}
                                                                                        className="flex flex-col rounded-xl border border-border bg-background/90 px-4 py-3 shadow-card-rest"
                                                                                >
                                                                                        <span className="type-label text-muted-foreground">{stat.label}</span>
                                                                                        <span className="type-body-lg font-semibold text-foreground">{stat.value}</span>
                                                                                        <span className="type-body-sm text-muted-foreground">{stat.helper}</span>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        </CardContent>
                                                </Card>
                                        </div>

                                        <div className="space-y-6">
                                                <ProfileEditForm
                                                        initialWeight={fullUserData?.weight ? Number(fullUserData.weight) : null}
                                                        initialHeight={fullUserData?.height ? Number(fullUserData.height) : null}
                                                />

                                                <Card className="border border-destructive/20 bg-destructive/5">
                                                        <CardHeader className="gap-4">
                                                                <div className="flex items-center gap-3">
                                                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
                                                                                <AlertTriangle className="h-5 w-5" />
                                                                        </div>
                                                                        <div>
                                                                                <CardTitle className="text-destructive">Danger zone</CardTitle>
                                                                                <p className="type-body-sm text-destructive/80">Delete your account and all saved training data.</p>
                                                                        </div>
                                                                </div>
                                                        </CardHeader>
                                                        <CardContent className="space-y-3">
                                                                <p className="type-body-sm text-muted-foreground">
                                                                        Once deleted, your workouts, exercise history, and measurements cannot be recovered. Be sure you’ve exported any records you might need.
                                                                </p>
                                                                <div className="rounded-lg border border-destructive/20 bg-background px-3 py-2 text-xs text-muted-foreground">
                                                                        Type your email during confirmation to finalize this action.
                                                                </div>
                                                        </CardContent>
                                                        <CardFooter className="justify-end gap-3 pt-0">
                                                                <UserDeleteDialog userEmail={user?.email || ""} />
                                                        </CardFooter>
                                                </Card>
                                        </div>

                                        <div className="lg:col-span-2">
                                                <WeightHistoryChart data={weightHistory as any} />
                                        </div>
                                </div>
                        </div>
                </Container>
        );
}