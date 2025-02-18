
import { Flower, Distributor, Category } from "@/types";
import FlowerCard from "./FlowerCard";

interface FlowerGridProps {
  flowers: Flower[];
  distributors: Distributor[];
  categories: Category[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onDeleteFlower?: (id: string) => void;
}

const FlowerGrid = ({ 
  flowers, 
  distributors, 
  categories, 
  onUpdateQuantity,
  onDeleteFlower 
}: FlowerGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {flowers.map((flower) => {
        const distributor = distributors.find(d => d.id === flower.distributorId);
        const category = categories.find(c => c.id === flower.categoryId);
        
        if (!distributor || !category) return null;
        
        return (
          <FlowerCard
            key={flower.id}
            flower={flower}
            distributor={distributor}
            category={category}
            onUpdateQuantity={onUpdateQuantity}
            onDeleteFlower={onDeleteFlower}
          />
        );
      })}
    </div>
  );
};

export default FlowerGrid;
