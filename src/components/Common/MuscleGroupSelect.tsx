"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import type { IMuscleGroup } from "@/src/Models/Domain/MuscleGroup"
import { MuscleGroupApiService } from "@/src/Api/Services/MuscleGroupApiService"

interface MuscleGroupSelectProps {
  selectedMuscleGroup: string
  onMuscleGroupChange: (muscleGroupId: string) => void
  showAllOption?: boolean
  showMessageOption?: boolean
}

export function MuscleGroupSelect({
  selectedMuscleGroup,
  onMuscleGroupChange,
  showAllOption = true,
  showMessageOption = false,
}: MuscleGroupSelectProps) {
  const [groups, setGroups] = useState<IMuscleGroup[]>([])

  // Special identifiers for placeholder options
  const ALL_GROUPS_ID = "all-groups"
  const SELECT_MESSAGE_ID = "select-message"

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      const service = new MuscleGroupApiService()
      const muscleGroups = await service.getMuscleGroups()

      const options = showAllOption
        ? [{ id: ALL_GROUPS_ID, name: "All Muscle Groups" }, ...muscleGroups]
        : showMessageOption
          ? [{ id: SELECT_MESSAGE_ID, name: "Select Muscle Group" }, ...muscleGroups]
          : muscleGroups
      setGroups(options)
    }

    fetchMuscleGroups()
  }, [showAllOption, showMessageOption])

  // Handle the value conversion
  const handleValueChange = (value: string) => {
    // Convert special identifiers back to empty string for the parent component
    if (value === ALL_GROUPS_ID || value === SELECT_MESSAGE_ID) {
      onMuscleGroupChange("")
    } else {
      onMuscleGroupChange(value)
    }
  }

  // Convert empty string to the appropriate special identifier for the Select component
  const getSelectValue = () => {
    if (selectedMuscleGroup === "") {
      return showAllOption ? ALL_GROUPS_ID : showMessageOption ? SELECT_MESSAGE_ID : undefined
    }
    return selectedMuscleGroup
  }

  return (
    <div className="space-y-2">
      <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Muscle Group
      </label>
      <Select value={getSelectValue()} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={showMessageOption ? "Select Muscle Group" : "All Muscle Groups"} />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

