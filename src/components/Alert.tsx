import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export const useAlertState = () => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    description: "",
    onAccept: () => {},
  });

  const openAlert = (state: Omit<typeof alertState, "isOpen">) => {
    setAlertState({ isOpen: true, ...state });
  };

  const closeAlert = () => {
    setAlertState({
      isOpen: false,
      title: "",
      description: "",
      onAccept: () => {},
    });
  };

  return { openAlert, closeAlert, alertState };
};
export function AppAlertDialog({
  title,
  isOpen,
  description,
  onAccept,
  onCancel,
  loading,
}: {
  isOpen: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onAccept: () => void;
  loading?: boolean;
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 300); // match your exit animation duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onAccept}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AppAlert({
  description,
  title = "Error!",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
