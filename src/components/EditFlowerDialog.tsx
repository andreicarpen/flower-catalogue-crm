
import { useState } from "react";
import { Flower } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  MobileDialog, 
  MobileDialogContent, 
  MobileDialogHeader,
  MobileDialogTitle,
  MobileDialogFooter 
} from "@/components/ui/mobile-dialog";
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(flower.quantity.toString());
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [originalQuantity] = useState(flower.quantity.toString());

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
    setQuantity(originalQuantity);
    onOpenChange(false);
  };

  return (
    <>
      <MobileDialog open={open} onOpenChange={onOpenChange}>
        <MobileDialogContent className="!px-0">
          <MobileDialogHeader className="px-6">
            <MobileDialogTitle>{flower.name}</MobileDialogTitle>
          </MobileDialogHeader>
          <form onSubmit={handleSubmit} className="flex-1 px-6">
            <div className="space-y-4">
              <Input 
                type="number" 
                value={quantity} 
                onChange={e => setQuantity(e.target.value)} 
                min="0" 
                placeholder="Cantitate nouă" 
              />
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                onClick={() => setShowDeleteAlert(true)}
              >
                Șterge floarea
              </Button>
            </div>
          </form>
          <MobileDialogFooter className="px-6 py-4 border-t fixed bottom-0 w-full bg-white keyboard-safe">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Anulează
            </Button>
            <Button onClick={handleSubmit}>
              Actualizează Cantitatea
            </Button>
          </MobileDialogFooter>
        </MobileDialogContent>
      </MobileDialog>

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
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (onDelete) {
                  onDelete(flower.id);
                  setShowDeleteAlert(false);
                  onOpenChange(false);
                }
              }}
            >
              Da
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditFlowerDialog;
