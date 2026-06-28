// Searchable subject picker for Step 1 of the lesson-plan wizard.
// Replaces the plain <Select> for subjects, which grows very long for SHS grades.
// Uses Popover + Command (cmdk) so the user can type to filter subjects inline.
// Handles both flat K-10 lists and grouped SHS lists (Core / Academic / TechPro tracks).

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Subject } from "@/features/generate/types"

interface SubjectComboboxProps {
  /** All subjects for the selected grade level (flat list from API). */
  subjects: Subject[]
  /** Currently selected subject name (controlled). */
  value: string
  /** Called with the selected subject name on change. */
  onValueChange: (value: string) => void
  /** Disables the trigger when true (e.g. no grade selected, or loading). */
  disabled?: boolean
  /** Placeholder text shown inside the closed trigger button. */
  placeholder?: string
}

/**
 * Searchable combobox for picking a subject from the curriculum API list.
 *
 * @param subjects - Flat API subject list for the active grade.
 * @param value - Controlled selected value (subject name).
 * @param onValueChange - Callback on selection change.
 * @param disabled - Disables trigger when true.
 * @param placeholder - Trigger placeholder text.
 * @returns A Popover/Command combobox that filters subjects by typed text.
 */
export function SubjectCombobox({
  subjects,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select subject",
}: SubjectComboboxProps) {
  const [open, setOpen] = useState(false)

  // Separate core subjects from electives; group electives by track → cluster.
  const coreSubjects = subjects.filter((s) => s.cluster === null)
  const electiveSubjects = subjects.filter((s) => s.cluster !== null)

  const clusterMap = new Map<string, { track: string; subjects: Subject[] }>()
  for (const subject of electiveSubjects) {
    const clusterName = subject.cluster!.name
    if (!clusterMap.has(clusterName)) {
      clusterMap.set(clusterName, { track: subject.cluster!.track, subjects: [] })
    }
    clusterMap.get(clusterName)!.subjects.push(subject)
  }

  const academicClusters = [...clusterMap.entries()].filter(([, v]) => v.track === "ACADEMIC")
  const techProClusters = [...clusterMap.entries()].filter(([, v]) => v.track === "TECHPRO")
  const hasClusters = clusterMap.size > 0

  const handleSelect = (subjectName: string) => {
    onValueChange(subjectName === value ? "" : subjectName)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-required="true"
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0"
        // Match the trigger width so it doesn't jump.
        style={{ width: "var(--radix-popover-trigger-width)" }}
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search subjects…" />
          <CommandList>
            <CommandEmpty>No subjects found.</CommandEmpty>

            {hasClusters ? (
              <>
                {/* Core subjects (no cluster) */}
                {coreSubjects.length > 0 && (
                  <CommandGroup heading="Core Subjects">
                    {coreSubjects.map((s) => (
                      <CommandItem
                        key={s.id}
                        value={s.name}
                        onSelect={handleSelect}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4 shrink-0",
                            value === s.name ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {s.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Academic track clusters — flat CommandGroup per cluster avoids nested-group cmdk bug */}
                {academicClusters.length > 0 && (
                  <>
                    {coreSubjects.length > 0 && <CommandSeparator />}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Academic Track
                    </div>
                    {academicClusters.map(([clusterName, { subjects: cs }]) => (
                      <CommandGroup key={clusterName} heading={clusterName}>
                        {cs.map((s) => (
                          <CommandItem
                            key={s.id}
                            value={`${s.name} ${clusterName}`}
                            onSelect={() => handleSelect(s.name)}
                            className="pl-6"
                          >
                            <Check
                              className={cn(
                                "mr-2 size-4 shrink-0",
                                value === s.name ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {s.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </>
                )}

                {/* Technical-Professional track clusters */}
                {techProClusters.length > 0 && (
                  <>
                    <CommandSeparator />
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Technical-Professional Track
                    </div>
                    {techProClusters.map(([clusterName, { subjects: cs }]) => (
                      <CommandGroup key={clusterName} heading={clusterName}>
                        {cs.map((s) => (
                          <CommandItem
                            key={s.id}
                            value={`${s.name} ${clusterName}`}
                            onSelect={() => handleSelect(s.name)}
                            className="pl-6"
                          >
                            <Check
                              className={cn(
                                "mr-2 size-4 shrink-0",
                                value === s.name ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {s.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </>
                )}
              </>
            ) : (
              /* K-10: flat subject list */
              <CommandGroup>
                {subjects.map((s) => (
                  <CommandItem
                    key={s.id}
                    value={s.name}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4 shrink-0",
                        value === s.name ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {s.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
