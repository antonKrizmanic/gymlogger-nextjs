import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Archive, Edit3, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";

interface WorkoutCardProps {
    title: string;
    date: string;
    sets: number;
    reps: number;
    weight: number;
    muscleGroup: string;
    viewHref: string;
    editHref: string;
}

export function WorkoutCard({ title, date, sets, reps, weight, muscleGroup, viewHref, editHref }: WorkoutCardProps) {
    const getMuscleGroupColor = (muscle: string) => {
        const colors: Record<string, string> = {
            Shoulders: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-400/15 dark:text-orange-200 dark:border-orange-400/20",
            Back: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-400/15 dark:text-blue-200 dark:border-blue-400/20",
            Chest: "bg-red-100 text-red-800 border-red-200 dark:bg-red-400/15 dark:text-red-200 dark:border-red-400/20",
            Arm: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-400/15 dark:text-purple-200 dark:border-purple-400/20",
            Leg: "bg-green-100 text-green-800 border-green-200 dark:bg-green-400/15 dark:text-green-200 dark:border-green-400/20",
        };
        return colors[muscle] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-white/10 dark:text-white dark:border-white/10";
    };

    return (
        <Card className="group hover:shadow-lg transition-all duration-200 border-0 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 dark:bg-primary-800/90 backdrop-blur">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <Badge variant="outline" className={`${getMuscleGroupColor(muscleGroup)} border`}>{muscleGroup}</Badge>
                        <CardTitle className="text-lg mt-2">{title}</CardTitle>
                        <CardDescription className="mt-1">{date}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary-50 dark:hover:bg-primary-900/30">
                            <Link href={viewHref} aria-label="View workout">
                                <Eye className="h-4 w-4 text-primary-600" />
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gold-50 dark:hover:bg-gold-900/20">
                            <Link href={editHref} aria-label="Edit workout">
                                <Edit3 className="h-4 w-4 text-gold-600" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary-50 dark:hover:bg-primary-900/30" disabled>
                            <Archive className="h-4 w-4 text-primary-600" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-semibold text-primary-900 dark:text-primary-50">{sets}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Sets</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-semibold text-primary-900 dark:text-primary-50">{reps}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Reps</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-semibold text-primary-900 dark:text-primary-50">{weight}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">kg</div>
                    </div>
                </div>
                <div className="mt-4 pt-3 border-t border-primary-100 dark:border-primary-700/60">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <div className="flex items-center gap-1 text-success-600">
                            <TrendingUp className="h-3 w-3" />
                            <span className="text-xs">+5%</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


