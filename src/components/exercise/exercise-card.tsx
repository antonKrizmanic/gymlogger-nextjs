'use client';

import Link from "next/link";

import { ExerciseApiService } from "@/src/api/services/exercise-api-service";
import { IExercise } from "@/src/models/domain/exercise";
import { getLogTypeInfo } from "@/src/utils/get-log-type-info";
import { Activity, Eye, Lock, Pencil, ShieldCheck } from "lucide-react";

import { DeleteButton } from "../common/delete-button";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";

interface ExerciseCardProps {
  exercise: IExercise;
  onDelete: () => void;
}

export function ExerciseCard({ exercise, onDelete }: ExerciseCardProps) {
  const deleteAction = async () => {
    const service = new ExerciseApiService();
    await service.deleteExercise(exercise.id);
  };

  const logTypeInfo = getLogTypeInfo(exercise.exerciseLogType);
  const LogTypeIcon = logTypeInfo.icon;

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-card-rest transition-all duration-200 motion-base hover:-translate-y-1 hover:shadow-card-hover focus-visible:shadow-card-hover">
      <CardHeader className="relative space-y-4 border-b border-border/60 bg-gradient-to-br from-primary/10 via-transparent to-transparent pb-6">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Activity className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="space-y-3">
          <CardTitle className="type-heading-sm text-foreground">
            {exercise.name || "Unnamed exercise"}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {exercise.muscleGroupName ? (
              <Badge variant="secondary" className="rounded-full px-3 py-1 type-label tracking-normal uppercase">
                {exercise.muscleGroupName}
              </Badge>
            ) : null}
            <Badge variant={logTypeInfo.variant} className="flex items-center gap-1 rounded-full px-3 py-1 type-label tracking-normal uppercase">
              <LogTypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {logTypeInfo.label}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1 type-label tracking-normal uppercase">
              {exercise.isPublic ? (
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {exercise.isPublic ? "Community" : "Personal"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5 p-6">
        {exercise.description ? (
          <p className="line-clamp-4 type-body-sm text-muted-foreground">
            {exercise.description}
          </p>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 bg-muted/40 p-4 text-center">
            <p className="type-body-sm text-muted-foreground">
              No description added yet. Use the edit action to add coaching cues or setup notes.
            </p>
          </div>
        )}

        <dl className="grid gap-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-between rounded-2xl border border-transparent bg-background/60 px-4 py-3">
            <dt className="type-label uppercase tracking-wide">Muscle focus</dt>
            <dd className="type-body-sm font-semibold text-foreground">
              {exercise.muscleGroupName ?? "Full body"}
            </dd>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-transparent bg-background/60 px-4 py-3">
            <dt className="type-label uppercase tracking-wide">Log type</dt>
            <dd className="type-body-sm font-semibold text-foreground">{logTypeInfo.label}</dd>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-transparent bg-background/60 px-4 py-3">
            <dt className="type-label uppercase tracking-wide">Visibility</dt>
            <dd className="type-body-sm font-semibold text-foreground">{exercise.isPublic ? "Shared" : "Private"}</dd>
          </div>
        </dl>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-border/60 bg-background/70 p-4 sm:flex-row sm:items-center">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full flex-1 rounded-full border border-border/70 bg-card/80 hover:bg-primary/10 hover:text-primary"
        >
          <Link href={`/exercises/${exercise.id}`}>
            <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
            View
          </Link>
        </Button>
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="w-full flex-1 rounded-full"
        >
          <Link href={`/exercises/${exercise.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
            Edit
          </Link>
        </Button>
        <DeleteButton
          entityName={exercise.name}
          entityType="Exercise"
          deleteAction={deleteAction}
          onDelete={onDelete}
          size="sm"
          text="Delete"
          className="w-full flex-1 rounded-full"
        />
      </CardFooter>
    </Card>
  );
}