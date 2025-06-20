import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function SelectComponent({
  options,
  label,
  placeholder,
  className,
  value,
  onValueChange,
  disabled,
  defaultValue,
}: {
  options: { label: string; value: string; disabled?: boolean }[];
  label?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onValueChange?: () => void;
  disabled?: boolean;
  defaultValue?: string;
}) {
  return (
    <Select
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={clsx("capitalize", className)}>
        <SelectValue className="capitalize" placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}
          {options?.map((option, i) => (
            <SelectItem
              disabled={option.disabled}
              key={`${option.value}_${i}`}
              className="capitalize"
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectComponent;
