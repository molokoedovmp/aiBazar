// File: components/category-combobox.tsx
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Id } from "@/convex/_generated/dataModel"

export interface CategoryComboboxProps {
  categories: { value: Id<"categories">; label: string }[]
  onSelect: (value: Id<"categories">) => void
}

export function CategoryCombobox({ categories, onSelect }: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<Id<"categories"> | null>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? categories.find((category) => category.value === value)?.label
            : "Select category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup>
            {categories.map((category) => (
              <CommandItem
                key={category.value}
                onSelect={() => {
                  setValue(category.value)
                  setOpen(false)
                  onSelect(category.value)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === category.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {category.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


// Нет, предупреждение, связанное с использованием тега <img> вместо <Image />, не является фатальной ошибкой. Это всего лишь предупреждение, указывающее на то, что ваше приложение могло бы работать быстрее и эффективнее, если бы вы использовали компонент <Image /> из next/image.

// Эти предупреждения не остановят процесс сборки и не вызовут сбой. Ваше приложение все равно должно скомпилироваться и работать, но с некоторыми рекомендациями по оптимизации.

// Если ваша сборка действительно завершилась с ошибкой, причина может быть в другом месте. В выводе сборки не было сообщений об остановке процесса из-за этого предупреждения, поэтому проблема может быть связана с другими аспектами вашего кода.

// Чтобы устранить предупреждение и следовать рекомендациям по оптимизации, замените <img> на <Image />. Но если ваше приложение не запускается, стоит проверить другие части логов или убедиться, что ошибки связаны не с этой рекомендацией.