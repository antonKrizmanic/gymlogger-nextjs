'use client';

import { Check, Edit3, Ruler, Weight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateProfile } from '@/src/actions/update-profile';
import { Button } from '@/src/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import { IconInput } from '@/src/components/ui/icon-input';

interface ProfileEditFormProps {
    initialWeight?: number | null;
    initialHeight?: number | null;
}

export function ProfileEditForm({
    initialWeight,
    initialHeight,
}: ProfileEditFormProps) {
    const router = useRouter();
    const [weight, setWeight] = useState(initialWeight?.toString() || '');
    const [height, setHeight] = useState(initialHeight?.toString() || '');
    const [isPending, startTransition] = useTransition();
    const [isEditing, setIsEditing] = useState(false);

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
                toast.success(
                    result?.success || 'Profile updated successfully',
                );
                setIsEditing(false);
                router.refresh();
            }
        });
    };

    const handleEditToggle = () => {
        if (isEditing) {
            handleSave();
        } else {
            setIsEditing(true);
        }
    };

    return (
        <Card className="border-2 shadow-xl">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Weight className="h-5 w-5 text-primary" />
                        </div>
                        <span>Physical Information</span>
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditToggle}
                        disabled={isPending}
                        className="p-2 hover:bg-muted/50"
                    >
                        {isEditing ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Edit3 className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                <CardDescription>
                    Update your weight and height for bodyweight exercises
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
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
                </div>
            </CardContent>
        </Card>
    );
}
