
import { Card } from "@/components/ui/card";
import { Flower, Distributor, Category } from "@/types";

interface FlowerCardProps {
  flower: Flower;
  distributor: Distributor;
  category: Category;
}

const FlowerCard = ({ flower, distributor, category }: FlowerCardProps) => {
  return (
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
        <p className="text-sm text-gray-600">Quantity: {flower.quantity}</p>
      </div>
    </Card>
  );
};

export default FlowerCard;
