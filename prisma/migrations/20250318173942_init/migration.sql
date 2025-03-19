-- CreateTable
CREATE TABLE "ExerciseSet" (
    "id" UUID NOT NULL,
    "exerciseWorkoutId" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "weight" DECIMAL(18,6),
    "reps" DECIMAL(18,6),
    "time" DECIMAL(18,6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,

    CONSTRAINT "PK_ExerciseSets" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseWorkout" (
    "id" UUID NOT NULL,
    "workoutId" UUID NOT NULL,
    "exerciseId" UUID NOT NULL,
    "totalWeight" DECIMAL(18,6),
    "totalReps" DECIMAL(18,6),
    "totalSets" DECIMAL(18,6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "index" INTEGER NOT NULL DEFAULT 0,
    "belongsToUserId" TEXT,

    CONSTRAINT "PK_ExerciseWorkouts" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "muscleGroupId" UUID NOT NULL,
    "exerciseLogType" INTEGER NOT NULL,
    "description" TEXT,
    "belongsToUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Exercises" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuscleGroup" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_MuscleGroups" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMPTZ(6) NOT NULL,
    "muscleGroupId" UUID NOT NULL,
    "totalWeight" DECIMAL(18,6),
    "totalReps" DECIMAL(18,6),
    "totalSets" DECIMAL(18,6),
    "belongsToUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Workouts" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateIndex
CREATE INDEX "IX_ExerciseSets_ExerciseWorkoutId" ON "ExerciseSet"("exerciseWorkoutId");

-- CreateIndex
CREATE INDEX "IX_ExerciseWorkouts_ExerciseId" ON "ExerciseWorkout"("exerciseId");

-- CreateIndex
CREATE INDEX "IX_ExerciseWorkouts_WorkoutId" ON "ExerciseWorkout"("workoutId");

-- CreateIndex
CREATE INDEX "IX_Exercises_MuscleGroupId" ON "Exercise"("muscleGroupId");

-- CreateIndex
CREATE INDEX "IX_Workouts_MuscleGroupId" ON "Workout"("muscleGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ExerciseSet" ADD CONSTRAINT "FK_ExerciseSet_ExerciseWorkout_ExerciseWorkoutId" FOREIGN KEY ("exerciseWorkoutId") REFERENCES "ExerciseWorkout"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ExerciseWorkout" ADD CONSTRAINT "FK_ExerciseWorkouts_Exercises_Exerciseid" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ExerciseWorkout" ADD CONSTRAINT "FK_ExerciseWorkouts_Workouts_WorkoutId" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "FK_Exercises_MuscleGroups_MuscleGroupId" FOREIGN KEY ("muscleGroupId") REFERENCES "MuscleGroup"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "FK_Workouts_MuscleGroups_MuscleGroupId" FOREIGN KEY ("muscleGroupId") REFERENCES "MuscleGroup"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
