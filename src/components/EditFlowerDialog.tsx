import { useState, useEffect } from "react";
import { Flower } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
interface EditFlowerDialogProps {
  flower: Flower;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, quantity: number) => void;
  onDelete?: (id: string) => void;
}
const EditFlowerDialog = ({
  flower,
  open,
  onOpenChange,
  onUpdate,
  onDelete
}: EditFlowerDialogProps) => {
  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();
  const [quantity, setQuantity] = useState(flower.quantity.toString());
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Reset quantity when dialog opens/closes
  useEffect(() => {
    if (open) {
      setQuantity(flower.quantity.toString());
    }
  }, [open, flower.quantity]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuantity = parseInt(quantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast({
        title: "Eroare",
        description: "Vă rugăm introduceți o cantitate validă",
        variant: "destructive"
      });
      return;
    }
    onUpdate(flower.id, newQuantity);
    onOpenChange(false);
    toast({
      title: "Succes",
      description: "Cantitatea a fost actualizată cu succes"
    });
  };
  const handleCancel = () => {
    setQuantity(flower.quantity.toString());
    onOpenChange(false);
  };
  return <>
      <Dialog open={open} onOpenChange={newOpen => {
      if (!newOpen) {
        setQuantity(flower.quantity.toString());
      }
      onOpenChange(newOpen);
    }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{flower.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-[32px]">
            <Input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="0" placeholder="Cantitate nouă" className="my-[10px]" />
            <Button type="button" variant="destructive" onClick={() => setShowDeleteAlert(true)} className="w-full bg-transparent text-black border">
              Șterge floarea
            </Button>
          </form>
          <DialogFooter className="sm:justify-end gap-2">
            
            <Button onClick={handleSubmit}>
              Actualizează Cantitatea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmați ștergerea</AlertDialogTitle>
            <AlertDialogDescription>
              Doriți să ștergeți floarea din baza de date?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Nu</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => {
            if (onDelete) {
              onDelete(flower.id);
              setShowDeleteAlert(false);
              onOpenChange(false);
            }
          }}>
              Da
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>;
};
export default EditFlowerDialog;