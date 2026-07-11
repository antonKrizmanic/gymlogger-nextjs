import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ExerciseLogType } from '@/src/types/enums';
import { MobileExerciseSetEdit } from './mobile-exercise-set-edit';

describe('MobileExerciseSetEdit', () => {
    it('edits a set inline and shows previous values', async () => {
        const user = userEvent.setup();
        const onSetChange = vi.fn();
        render(
            <MobileExerciseSetEdit
                set={{ index: 0, reps: 8, weight: 80 }}
                index={0}
                exerciseType={ExerciseLogType.WeightAndReps}
                previousSet={{ id: 'previous', index: 0, reps: 8, weight: 75 }}
                onSetChange={onSetChange}
                onCopy={vi.fn()}
                onRemove={vi.fn()}
            />,
        );

        expect(
            screen.getByText(/Previous: 8 reps × 75 kg/),
        ).toBeInTheDocument();
        const weight = screen.getByLabelText('Weight (kg)');
        await user.clear(weight);
        await user.type(weight, '82.5');
        expect(onSetChange).toHaveBeenCalled();
    });
});
