'use client';
import { IMuscleGroup } from '@/src/Models/Domain/MuscleGroup';
import { Select } from '../Form/Select';
import { MuscleGroupApiService } from '@/src/Api/Services/MuscleGroupApiService';
import { useEffect, useState } from 'react';

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
    const[groups, setGroups] = useState<IMuscleGroup[]>([]);
    const[selectedOption, setSelectedOption] = useState<IMuscleGroup>({ id: '', name: '' });

    useEffect(() => {
        const fetchMuscleGroups = async () => {
            const service = new MuscleGroupApiService();
            const groups = await service.getMuscleGroups();
            
            const options = showAllOption ? [{ id: '', name: 'All Muscle Groups' }, ...groups] : showMessageOption ? [{ id: '', name: 'Select Muscle Group' }, ...groups] : groups;            
            setGroups(options);
            const option = options.find(group => group.id === selectedMuscleGroup) || options[0];    
            setSelectedOption(option);
        }
        fetchMuscleGroups();        
    },[selectedMuscleGroup, showAllOption, showMessageOption]);    

    return (

        <div className="space-y-2">
            <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Muscle Group
            </label>
            <Select
                options={groups}
                selected={selectedOption}
                onChange={(group) => onMuscleGroupChange(group.id)}
                getOptionLabel={(group) => group.name ?? ''}
                getOptionValue={(group) => group.id}
            />            
        </div>
    );
} 