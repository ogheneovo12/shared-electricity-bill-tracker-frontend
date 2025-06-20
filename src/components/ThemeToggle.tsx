import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { setMode } from "@/lib/redux/slices/layout.slice";
import { RootState } from "@/lib/redux/store";
import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function ThemeToggle() {
  const { mode } = useSelector((state: RootState) => state.layout);
  const dispatch = useDispatch();

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);
  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value) => {
        dispatch(setMode(value as "dark" | "light"));
      }}
    >
      <ToggleGroupItem value="light" aria-label="Toggle Light">
        <SunIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Toggle Dark">
        <MoonIcon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
