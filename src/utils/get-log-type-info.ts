import { ExerciseLogType } from "@/src/types/enums";
import { Activity, Clock, Repeat, Weight, type LucideIcon } from "lucide-react";

export type LogTypeInfo = {
    label: string;
    icon: LucideIcon;
    variant: "default" | "secondary" | "outline";
};

export function getLogTypeInfo(logType: ExerciseLogType): LogTypeInfo {
    switch (logType) {
        case ExerciseLogType.WeightAndReps:
            return { label: "Weight & Reps", icon: Weight, variant: "default" };
        case ExerciseLogType.TimeOnly:
            return { label: "Time Only", icon: Clock, variant: "secondary" };
        case ExerciseLogType.RepsOnly:
            return { label: "Reps Only", icon: Repeat, variant: "outline" };
        case ExerciseLogType.BodyWeight:
            return { label: "Body Weight", icon: Activity, variant: "secondary" };
        case ExerciseLogType.BodyWeightWithAdditionalWeight:
            return { label: "Body Weight + Additional", icon: Weight, variant: "default" };
        case ExerciseLogType.BodyWeightWithAssistance:
            return { label: "Body Weight with Assistance", icon: Weight, variant: "secondary" };
        default:
            return { label: "Unknown", icon: Activity, variant: "outline" };
    }
}


