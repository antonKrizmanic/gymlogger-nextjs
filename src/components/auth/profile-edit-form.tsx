"use client";

import { updateProfile } from "@/src/actions/update-profile";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { IconInput } from "@/src/components/ui/icon-input";
import { cn } from "@/src/lib/utils";
import { Check, Edit3, Loader2, Ruler, Weight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

interface ProfileEditFormProps {
    initialWeight?: number | null;
    initialHeight?: number | null;
}

export function ProfileEditForm({ initialWeight, initialHeight }: ProfileEditFormProps) {
    const router = useRouter();
    const [weight, setWeight] = useState(initialWeight?.toString() || "");
    const [height, setHeight] = useState(initialHeight?.toString() || "");
    const [isPending, startTransition] = useTransition();
    const [isEditing, setIsEditing] = useState(false);

    const formattedInitialWeight = useMemo(() => initialWeight?.toString() || "", [initialWeight]);
    const formattedInitialHeight = useMemo(() => initialHeight?.toString() || "", [initialHeight]);

    useEffect(() => {
        if (!isEditing) {
            setWeight(formattedInitialWeight);
            setHeight(formattedInitialHeight);
        }
    }, [formattedInitialHeight, formattedInitialWeight, isEditing]);

    const steps = [
        {
            title: "Review metrics",
            description: "Confirm the body data saved to your profile.",
        },
        {
            title: "Update values",
            description: "Adjust weight or height to keep insights accurate.",
        },
    ];

    const activeStep = isEditing ? 2 : 1;

    const handleSave = () => {
        const weightValue = weight ? parseFloat(weight) : undefined;
        const heightValue = height ? parseFloat(height) : undefined;

        startTransition(async () => {
            const result = await updateProfile({
                weight: weightValue,
                height: heightValue,
            });

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(result?.success || "Profile updated successfully");
                setIsEditing(false);
                router.refresh();
            }
        });
    };

    const handleCancel = () => {
        setWeight(formattedInitialWeight);
        setHeight(formattedInitialHeight);
        setIsEditing(false);
    };

    return (
        <Card>
            <form onSubmit={(event) => {
                event.preventDefault();
                if (!isEditing) {
                    setIsEditing(true);
                    return;
                }
                handleSave();
            }} className="flex flex-col gap-6">
                <CardHeader className="gap-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Weight className="h-5 w-5" />
                            </span>
                            Body metrics
                        </CardTitle>
                        <CardDescription>
                            Keep your measurements current so analytics and training plans stay personalized.
                        </CardDescription>
                    </div>
                    <div className="col-span-full grid gap-3 sm:grid-cols-2">
                        {steps.map((step, index) => {
                            const stepNumber = index + 1;
                            const isActive = stepNumber === activeStep;
                            const isCompleted = stepNumber < activeStep;

                            return (
                                <div
                                    key={step.title}
                                    className={cn(
                                        "flex items-start gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 motion-base transition-all",
                                        isActive && "border-primary bg-primary/5 shadow-card-hover",
                                        isCompleted && "border-primary/50 bg-primary/10"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-muted-foreground",
                                            (isActive || isCompleted) && "border-primary bg-primary text-primary-foreground",
                                        )}
                                    >
                                        {isCompleted ? <Check className="h-4 w-4" /> : `0${stepNumber}`}
                                    </span>
                                    <div className="space-y-1">
                                        <p className="type-label text-muted-foreground">{step.title}</p>
                                        <p className="type-body-sm text-muted-foreground/80">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <IconInput
                        icon={Weight}
                        label="Weight (kg)"
                        id="weight"
                        type="number"
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Enter weight in kg"
                        disabled={!isEditing || isPending}
                    />
                    <IconInput
                        icon={Ruler}
                        label="Height (cm)"
                        id="height"
                        type="number"
                        step="0.1"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Enter height in cm"
                        disabled={!isEditing || isPending}
                    />
                </CardContent>

                <CardFooter className="justify-end gap-3">
                    {isEditing ? (
                        <>
                            <Button type="button" variant="ghost" onClick={handleCancel} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving
                                    </>
                                ) : (
                                    "Save changes"
                                )}
                            </Button>
                        </>
                    ) : (
                        <Button type="submit" className="justify-center" disabled={isPending}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit metrics
                        </Button>
                    )}
                </CardFooter>
            </form>
        </Card>
    );
}
