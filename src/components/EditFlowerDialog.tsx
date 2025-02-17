
import { useState } from "react";
import { Flower } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MobileDialog,
  MobileDialogContent,
  MobileDialogHeader,
  MobileDialogTitle,
  MobileDialogFooter,
} from "@/components/ui/mobile-dialog";
import { useToast } from "@/components/ui/use-toast";

interface EditFlowerDialogProps {
  flower: Flower;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, quantity: number) => void;
}

const EditFlowerDialog = ({ flower, open, onOpenChange, onUpdate }: EditFlowerDialogProps) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(flower.quantity.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuantity = parseInt(quantity);
    
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast({
        title: "Eroare",
        description: "Vă rugăm introduceți o cantitate validă",
        variant: "destructive",
      });
      return;
    }

    onUpdate(flower.id, newQuantity);
    onOpenChange(false);
    toast({
      title: "Succes",
      description: "Cantitatea a fost actualizată cu succes",
    });
  };

  return (
    <MobileDialog open={open} onOpenChange={onOpenChange}>
      <MobileDialogContent>
        <MobileDialogHeader>
          <MobileDialogTitle>Actualizare Cantitate - {flower.name}</MobileDialogTitle>
        </MobileDialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 p-6">
          <div className="space-y-4">
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              placeholder="Cantitate nouă"
            />
          </div>
        </form>
        <MobileDialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Anulează
          </Button>
          <Button onClick={handleSubmit}>
            Actualizează Cantitatea
          </Button>
        </MobileDialogFooter>
      </MobileDialogContent>
    </MobileDialog>
  );
};

export default EditFlowerDialog;
