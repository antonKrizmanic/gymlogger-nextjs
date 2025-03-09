import { ExerciseLogType } from '@/src/Types/Enums';
import { Select } from '../Form/Select';


interface LogTypeSelectProps {
    selectedLogType: ExerciseLogType;
    onLogTypeChange: (logType: ExerciseLogType) => void;
    required?: boolean;
    showAllOption?: boolean;
}

const logTypeOptions = [    
    { value: ExerciseLogType.WeightAndReps, label: 'Weight and Reps' },
    { value: ExerciseLogType.TimeOnly, label: 'Time Only' },
    { value: ExerciseLogType.RepsOnly, label: 'Reps Only' },
];

export function LogTypeSelect({ selectedLogType, onLogTypeChange, required = false, showAllOption = true }: LogTypeSelectProps) {
    const selectedOption = logTypeOptions.find(option => option.value === selectedLogType) || logTypeOptions[0];

    const options = showAllOption ? [{ value: ExerciseLogType.Unknown, label: 'All Log Types' }, ...logTypeOptions] : logTypeOptions;

    return (
        <div className="space-y-2">
            <label htmlFor="logType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Log Type {required && '*'}
            </label>
            <Select
                options={options}
                selected={selectedOption}
                onChange={(option) => onLogTypeChange(option.value)}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value.toString()}
            />
        </div>
    );
}
