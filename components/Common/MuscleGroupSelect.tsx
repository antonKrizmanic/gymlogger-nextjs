import { useEffect, useState } from 'react';
import { IMuscleGroup } from '@/src/Models/Domain/MuscleGroup';
import { MuscleGroupService } from '@/src/Api/Services/MuscleGroupService';
import { SortDirection } from '@/src/Types/Enums';
import { Select } from '../Form/Select';


interface MuscleGroupSelectProps {
    selectedMuscleGroup: string;
    onMuscleGroupChange: (muscleGroupId: string) => void;
    showAllOption?: boolean;
    showMessageOption?: boolean;
}

export function MuscleGroupSelect({
    selectedMuscleGroup,
    onMuscleGroupChange,
    showAllOption = true,
    showMessageOption = false,
}: MuscleGroupSelectProps) {
    const [muscleGroups, setMuscleGroups] = useState<IMuscleGroup[]>([]);

    useEffect(() => {
        const fetchMuscleGroups = async () => {
            try {
                const service = new MuscleGroupService();
                const response = await service.getMuscleGroups({
                    page: 0,
                    pageSize: 100,
                    sortColumn: 'name',
                    sortDirection: SortDirection.Ascending
                });
                setMuscleGroups(response.items ?? []);
            } catch (error) {
                console.error('Failed to fetch muscle groups:', error);
            }
        };

        fetchMuscleGroups();
    }, []);

    const options = showAllOption ? [{ id: '', name: 'All Muscle Groups' }, ...muscleGroups] : showMessageOption ? [{ id: '', name: 'Select Muscle Group' }, ...muscleGroups] : muscleGroups;
    const selectedOption = options.find(group => group.id === selectedMuscleGroup) || options[0];    

    return (

        <div className="space-y-2">
            <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Muscle Group
            </label>
            <Select
                options={options}
                selected={selectedOption}
                onChange={(group) => onMuscleGroupChange(group.id)}
                getOptionLabel={(group) => group.name ?? ''}
                getOptionValue={(group) => group.id}
            />            
        </div>
    );
} 