import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Validate GUID format
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!id || !guidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid GUID format' }, { status: 400 });
        }

        const workout = await prisma.workouts.findUnique({
            select: {
                Id: true,
                Name: true,
                MuscleGroupId: true,
                Description: true,
                Date: true,
                MuscleGroups: {
                    select: {
                        Name: true
                    }
                },
                ExerciseWorkouts: {
                    select: {
                        Index: true,
                        TotalReps: true,
                        TotalWeight: true,
                        TotalSets: true,
                        Note: true,
                        ExerciseSets: {
                            select: {
                                Id: true,
                                Weight: true,
                                Reps: true,
                                Time: true,
                                Index: true,
                                Note: true
                            }
                        },
                        Exercises: {
                            select: {
                                Id: true,
                                Name: true,
                                Description: true,
                                ExerciseLogType: true,
                                BelongsToUserId: true,                                
                                MuscleGroupId: true,
                                MuscleGroups: {
                                    select: {
                                        Name: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            where: {
                Id: id
            }
        });
        
        if (!workout) {
            return NextResponse.json(
                { message: 'Workout not found' },
                { status: 404 }
            );
        }
        console.log('Workout:', workout.ExerciseWorkouts.map(ew => ew.ExerciseSets));
        // Map from DB schema to our interface
        return NextResponse.json({
            id: workout.Id,
            name: workout.Name,
            muscleGroupId: workout.MuscleGroupId,
            muscleGroupName: workout.MuscleGroups.Name,
            totalWeight: workout.ExerciseWorkouts.reduce((acc, ew) => acc + Number(ew.TotalWeight), 0),
            totalReps: workout.ExerciseWorkouts.reduce((acc, ew) => acc + Number(ew.TotalReps), 0),
            totalSets: workout.ExerciseWorkouts.reduce((acc, ew) => acc + Number(ew.TotalSets), 0),
            description: workout.Description,
            date: workout.Date,
            exercises: workout.ExerciseWorkouts.map(ew => ({
                note: ew.Note,
                index: ew.Index,
                totalReps: ew.TotalReps,
                totalWeight: ew.TotalWeight,
                totalSets: ew.TotalSets,
                exerciseId: ew.Exercises.Id,
                exerciseName: ew.Exercises.Name,
                exerciseLogType: ew.Exercises.ExerciseLogType,                
                sets: ew.ExerciseSets.map(set => ({                    
                    id: set.Id,
                    index: set.Index,
                    time: set.Time,
                    weight: set.Weight,
                    reps: set.Reps,  
                    note: set.Note
                }))
            }))
        });
    } catch (error) {
        console.error('Error fetching workout:', error);
        return NextResponse.json(
            { message: 'Failed to fetch workout' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validate GUID format
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!id || !guidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid GUID format' }, { status: 400 });
        }

        // Calculate total reps, weight, and sets
        const exercises = body.exercises.map((exercise: any) => {
            const totalReps = exercise.sets.reduce((acc: number, set: any) => acc + (set.reps || 0), 0);
            const totalWeight = exercise.sets.reduce((acc: number, set: any) => acc + ((set.weight || 0) * (set.reps || 0)), 0);
            const totalSets = exercise.sets.length;
            return {
                ...exercise,
                totalReps,
                totalWeight,
                totalSets
            };
        });

        // Update workout
        const updatedWorkout = await prisma.workouts.update({
            where: { Id: id },
            data: {
                Name: body.name,
                MuscleGroupId: body.muscleGroupId,
                Description: body.description,
                Date: new Date(body.date),
                ExerciseWorkouts: {
                    deleteMany: {}, // Delete existing exercise workouts
                    create: exercises.map((exercise: any) => ({
                        Id:uuidv4(),
                        ExerciseId: exercise.exerciseId,                        
                        Index: exercise.index,
                        Note: exercise.note,
                        TotalReps: exercise.totalReps,
                        TotalWeight: exercise.totalWeight,
                        TotalSets: exercise.totalSets,
                        CreatedAt: new Date(),
                        UpdatedAt: new Date(),
                        ExerciseSets: {
                            create: exercise.sets.map((set: any) => ({
                                Id:uuidv4(),
                                Index: set.index,
                                Time: set.time,
                                Weight: set.weight,
                                Reps: set.reps,
                                Note: set.note,
                                CreatedAt: new Date(),
                                UpdatedAt: new Date(),
                            }))
                        }
                    }))
                }
            }
        });

        return NextResponse.json({
            id: updatedWorkout.Id,
            name: updatedWorkout.Name,
            muscleGroupId: updatedWorkout.MuscleGroupId,
            description: updatedWorkout.Description,
            date: updatedWorkout.Date
        });
    } catch (error) {
        console.error('Error updating workout:', error);
        return NextResponse.json(
            { message: 'Failed to update workout' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Validate GUID format
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!id || !guidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid GUID format' }, { status: 400 });
        }

        await prisma.workouts.delete({
            where: {
                Id: id
            }
        });
        return NextResponse.json({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error('Error deleting workout:', error);
        return NextResponse.json(
            { message: 'Failed to delete workout' },
            { status: 500 }
        );
    }
}