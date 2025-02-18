import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flower, Distributor, Category } from "@/types";
import EditFlowerDialog from "./EditFlowerDialog";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
interface FlowerCardProps {
  flower: Flower;
  distributor: Distributor;
  category: Category;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onDeleteFlower?: (id: string) => void;
}
const FlowerCard = ({
  flower,
  distributor,
  category,
  onUpdateQuantity,
  onDeleteFlower
}: FlowerCardProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  return <>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fadeIn">
        <div className="aspect-square overflow-hidden">
          <img src={flower.image} alt={flower.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div className="p-3 sm:p-4">
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-sage-100 text-sage-900">
              {distributor?.name}
            </span>
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-sage-100 text-sage-900">
              {category?.name}
            </span>
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-sage-100 text-sage-900">
              {format(new Date(flower.createdAt), 'dd/MM/yyyy')}
            </span>
          </div>
          <h3 className="font-serif text-base sm:text-lg font-semibold">{flower.name}</h3>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Cantitate: {flower.quantity}</p>
            <Button variant="ghost" size="icon" onClick={() => setEditDialogOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      <EditFlowerDialog flower={flower} open={editDialogOpen} onOpenChange={setEditDialogOpen} onUpdate={onUpdateQuantity} onDelete={onDeleteFlower} />
    </>;
};
export default FlowerCard;