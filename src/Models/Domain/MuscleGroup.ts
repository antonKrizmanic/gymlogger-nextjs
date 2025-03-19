export interface IMuscleGroup {
    id: string;
    name?: string;
    description?: string | null;
} 

export type DbMuscleGroup = {
    id: string;
    name: string;
    description: string | null;
};

export function mapMuscleGroupToIMuscleGroup(muscleGroup: DbMuscleGroup) :IMuscleGroup{
    return {
        id: muscleGroup.id,
        name: muscleGroup.name,
        description: muscleGroup.description
    }
}