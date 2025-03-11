export interface IMuscleGroup {
    id: string;
    name?: string;
    description?: string | null;
} 

export type DbMuscleGroup = {
    Id: string;
    Name: string;
    Description: string | null;
};

export function mapMuscleGroupToIMuscleGroup(muscleGroup: DbMuscleGroup) :IMuscleGroup{
    return {
        id: muscleGroup.Id,
        name: muscleGroup.Name,
        description: muscleGroup.Description
    }
}