-- CreateTable
CREATE TABLE "WorkoutTemplate" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "belongsToUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_WorkoutTemplates" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutTemplateExercise" (
    "id" UUID NOT NULL,
    "workoutTemplateId" UUID NOT NULL,
    "exerciseId" UUID NOT NULL,
    "sets" INTEGER NOT NULL DEFAULT 0,
    "reps" INTEGER NOT NULL DEFAULT 0,
    "index" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_WorkoutTemplateExercises" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkoutTemplate_belongsToUserId_name_idx" ON "WorkoutTemplate"("belongsToUserId", "name");

-- CreateIndex
CREATE INDEX "WorkoutTemplate_belongsToUserId_createdAt_idx" ON "WorkoutTemplate"("belongsToUserId", "createdAt");

-- CreateIndex
CREATE INDEX "IX_WorkoutTemplateExercises_WorkoutTemplateId" ON "WorkoutTemplateExercise"("workoutTemplateId");

-- CreateIndex
CREATE INDEX "IX_WorkoutTemplateExercises_ExerciseId" ON "WorkoutTemplateExercise"("exerciseId");

-- AddForeignKey
ALTER TABLE "WorkoutTemplateExercise" ADD CONSTRAINT "FK_WorkoutTemplateExercises_Exercises_ExerciseId" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WorkoutTemplateExercise" ADD CONSTRAINT "FK_WorkoutTemplateExercises_WorkoutTemplates_WorkoutTemplateId" FOREIGN KEY ("workoutTemplateId") REFERENCES "WorkoutTemplate"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
