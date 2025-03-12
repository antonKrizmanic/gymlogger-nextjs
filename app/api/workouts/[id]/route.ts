import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

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