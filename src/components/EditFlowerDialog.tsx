
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
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    onUpdate(flower.id, newQuantity);
    onOpenChange(false);
    toast({
      title: "Success",
      description: "Flower quantity updated successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Quantity - {flower.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              placeholder="New quantity"
            />
          </div>
          <Button type="submit" className="w-full">Update Quantity</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFlowerDialog;
