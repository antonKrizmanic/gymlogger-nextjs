"use client"

import { ExerciseLogType } from "@/src/types/enums"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"

interface LogTypeSelectProps {
  selectedLogType: ExerciseLogType
  onLogTypeChange: (logType: ExerciseLogType) => void
  required?: boolean
  showAllOption?: boolean
}

const logTypeOptions = [
  { value: ExerciseLogType.WeightAndReps, label: "Weight and Reps" },
  { value: ExerciseLogType.TimeOnly, label: "Time Only" },
  { value: ExerciseLogType.RepsOnly, label: "Reps Only" },
]

export function LogTypeSelect({
  selectedLogType,
  onLogTypeChange,
  required = false,
  showAllOption = true,
}: LogTypeSelectProps) {
  const options = showAllOption
    ? [{ value: ExerciseLogType.Unknown, label: "All Log Types" }, ...logTypeOptions]
    : logTypeOptions

  // Convert enum value to string for shadcn Select
  const handleValueChange = (value: string) => {
    onLogTypeChange(Number(value) as ExerciseLogType)
  }

  return (
    <div className="space-y-2">
      <label htmlFor="logType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Log Type {required && "*"}
      </label>
      <Select value={selectedLogType.toString()} onValueChange={handleValueChange} required={required}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select log type" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

