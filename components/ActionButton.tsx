import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

export const ActionButton = ({ onSubmit }) => {
  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="cibus"
        type="button"
        className="flex gap-2 w-40"
      >
        סימון כמומש
        <CheckboxIcon className="size-5" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>סימון כמומש</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        האם אתה בטוח שברצונך לסמן את השובר כמומש?
      </AlertDialogDescription>
      <AlertDialogAction asChild>
        <Button type="button" onClick={handleMarkVoucherAsUsed}>
          סימון כמומש
        </Button>
      </AlertDialogAction>
      <AlertDialogCancel asChild>
        <Button variant="cibusGhost" type="button">
          ביטול
        </Button>
      </AlertDialogCancel>
    </AlertDialogContent>
  </AlertDialog>
  );
};