import { IExerciseSetCreate } from '@/src/Models/Domain/Workout';
import { ExerciseLogType } from '@/src/Types/Enums';
import { NumberInput, TextInput } from '../Form/TextInput';
import { CloseIcon } from '../Icons/CloseIcon';
import { Button } from '../ui/button';

interface ExerciseSetEditProps {
    set: IExerciseSetCreate;
    index: number;
    exerciseType: ExerciseLogType;
    onSetChange: (updatedSet: IExerciseSetCreate) => void;
    onCopy: () => void;
    onRemove: () => void;
}

export function ExerciseSetEdit({ set, index, exerciseType, onSetChange, onCopy, onRemove }: ExerciseSetEditProps) {
    const handleWeightChange = (weight: number) => {        
        onSetChange({ ...set, weight });
    };

    const handleRepsChange = (reps: number) => {        
        onSetChange({ ...set, reps });
    };

    const handleTimeChange = (time: number) => {
        onSetChange({ ...set, time });
    };

    const handleNoteChange = (note: string) => {
        onSetChange({ ...set, note });
    };

    return (
        <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-50 dark:bg-slate-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">
                {index + 1}
            </span>
            {exerciseType === ExerciseLogType.WeightAndReps && (
                <>                    
                    <div className="flex-1">
                        <NumberInput
                            label=''
                            placeholder='Reps'
                            id={`reps-${index}`}
                            value={set.reps || undefined}
                            onChange={handleRepsChange} />                        
                    </div>
                    <div className="flex-1">
                        <NumberInput 
                            label='' 
                            placeholder='Weight'
                            id={`weight-${index}`} 
                            value={set.weight || undefined} 
                            onChange={handleWeightChange} />                        
                    </div>
                </>
            )}
            {exerciseType === ExerciseLogType.RepsOnly && (
                <div className="flex-1">
                    <NumberInput
                            label=''
                            placeholder='Reps'
                            id={`reps-${index}`}
                            value={set.reps || undefined}
                            onChange={handleRepsChange} />                        
                </div>
            )}
            {exerciseType === ExerciseLogType.TimeOnly && (
                <div className="flex-1">
                    <NumberInput
                        label=''
                        placeholder='Time (s)'
                        id={`time-${index}`}
                        value={set.time || undefined}
                        onChange={handleTimeChange} />                    
                </div>
            )}
            <div className="flex-1">
                <TextInput
                    label=''
                    placeholder='Notes'
                    id={`note-${index}`}
                    value={set.note || ''}
                    onChange={handleNoteChange} />                
            </div>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    onClick={onCopy}
                    variant="ghost"
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                </Button>
                <Button
                    type="button"
                    onClick={onRemove}
                    variant="ghost"
                    className="p-1 text-gray-400 hover:text-red-500"
                >
                    <CloseIcon />
                </Button>
            </div>
        </div>
    );
} 