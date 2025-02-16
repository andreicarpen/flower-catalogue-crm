
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flower, Distributor, Category } from "@/types";
import EditFlowerDialog from "./EditFlowerDialog";

interface FlowerCardProps {
  flower: Flower;
  distributor: Distributor;
  category: Category;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const FlowerCard = ({ flower, distributor, category, onUpdateQuantity }: FlowerCardProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fadeIn">
        <div className="aspect-square overflow-hidden">
          <img
            src={flower.image}
            alt={flower.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <div className="flex gap-2 mb-2">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-sage-100 text-sage-900">
              {distributor.name}
            </span>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-sage-100 text-sage-900">
              {category.name}
            </span>
          </div>
          <h3 className="font-serif text-lg font-semibold">{flower.name}</h3>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-600">Quantity: {flower.quantity}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
            >
              Edit
            </Button>
          </div>
        </div>
      </Card>
      <EditFlowerDialog
        flower={flower}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={onUpdateQuantity}
      />
    </>
  );
};

export default FlowerCard;
