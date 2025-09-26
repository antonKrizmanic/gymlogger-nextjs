-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "height" DECIMAL(18,6),
ADD COLUMN     "weight" DECIMAL(18,6);

-- CreateIndex
CREATE INDEX "Exercise_belongsToUserId_name_idx" ON "public"."Exercise"("belongsToUserId", "name");

-- CreateIndex
CREATE INDEX "Exercise_muscleGroupId_exerciseLogType_idx" ON "public"."Exercise"("muscleGroupId", "exerciseLogType");

-- CreateIndex
CREATE INDEX "Exercise_name_idx" ON "public"."Exercise"("name");

-- CreateIndex
CREATE INDEX "ExerciseWorkout_belongsToUserId_createdAt_idx" ON "public"."ExerciseWorkout"("belongsToUserId", "createdAt");

-- CreateIndex
CREATE INDEX "ExerciseWorkout_exerciseId_createdAt_idx" ON "public"."ExerciseWorkout"("exerciseId", "createdAt");

-- CreateIndex
CREATE INDEX "ExerciseWorkout_exerciseId_belongsToUserId_idx" ON "public"."ExerciseWorkout"("exerciseId", "belongsToUserId");

-- CreateIndex
CREATE INDEX "Workout_belongsToUserId_date_idx" ON "public"."Workout"("belongsToUserId", "date");

-- CreateIndex
CREATE INDEX "Workout_belongsToUserId_muscleGroupId_idx" ON "public"."Workout"("belongsToUserId", "muscleGroupId");

-- CreateIndex
CREATE INDEX "Workout_date_idx" ON "public"."Workout"("date");

-- CreateIndex
CREATE INDEX "Workout_name_idx" ON "public"."Workout"("name");
