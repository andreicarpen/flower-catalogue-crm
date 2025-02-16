
import { useState } from "react";
import { Flower } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-auto max-w-md mx-4">
        <DialogHeader>
          <DialogTitle>Actualizare Cantitate - {flower.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              placeholder="Cantitate nouă"
            />
          </div>
          <Button type="submit" className="w-full">Actualizează Cantitatea</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFlowerDialog;
