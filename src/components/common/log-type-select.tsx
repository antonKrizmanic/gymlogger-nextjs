"use client"

import { IconSelect } from "@/src/components/ui/icon-input"
import { ExerciseLogType } from "@/src/types/enums"
import { Activity } from "lucide-react"

interface LogTypeSelectProps {
  selectedLogType: ExerciseLogType
  onLogTypeChange: (logType: ExerciseLogType) => void
  required?: boolean
  showAllOption?: boolean
}

const logTypeOptions = [
  { value: ExerciseLogType.WeightAndReps.toString(), label: "Weight and Reps" },
  { value: ExerciseLogType.TimeOnly.toString(), label: "Time Only" },
  { value: ExerciseLogType.RepsOnly.toString(), label: "Reps Only" },
  { value: ExerciseLogType.BodyWeight.toString(), label: "Body Weight" },
  { value: ExerciseLogType.BodyWeightWithAdditionalWeight.toString(), label: "Body Weight + Additional" },
  { value: ExerciseLogType.BodyWeightWithAssistance.toString(), label: "Body Weight with Assistance" },
]

export function LogTypeSelect({
  selectedLogType,
  onLogTypeChange,
  required = false,
  showAllOption = true,
}: LogTypeSelectProps) {
  const options = showAllOption
    ? [{ value: ExerciseLogType.Unknown.toString(), label: "All Log Types" }, ...logTypeOptions]
    : logTypeOptions

  // Convert enum value to string for IconSelect
  const handleValueChange = (value: string) => {
    onLogTypeChange(Number(value) as ExerciseLogType)
  }

  // Convert selected enum to string for IconSelect
  const selectValue = selectedLogType === ExerciseLogType.Unknown && showAllOption
    ? ExerciseLogType.Unknown.toString()
    : selectedLogType.toString()

  return (
    <IconSelect
      icon={Activity}
      label={`Log Type ${required ? '*' : ''}`}
      placeholder="Select log type"
      value={selectValue}
      onValueChange={handleValueChange}
      options={options}
    />
  )
}

