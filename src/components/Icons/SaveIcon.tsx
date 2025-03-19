import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/src/lib/utils';

interface SaveIconProps {
    className?: string;
    size?: number;
}

export function SaveIcon({ className, size = 18 }: SaveIconProps) {
    return (
        <FontAwesomeIcon
            icon={faFloppyDisk}
            className={cn('w-5 h-5', className)}
            style={{ width: size, height: size }}
        />
    );
}