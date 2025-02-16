import { useState, useMemo } from "react";
import FlowerCard from "./FlowerCard";
import { Flower, Distributor, Category } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface FlowerGridProps {
  flowers: Flower[];
  distributors: Distributor[];
  categories: Category[];
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const FlowerGrid = ({ flowers, distributors, categories, onUpdateQuantity }: FlowerGridProps) => {
  const [selectedDistributor, setSelectedDistributor] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const isMobile = useIsMobile();

  const filteredAndSortedFlowers = useMemo(() => {
    let result = [...flowers];

    // Apply filters
    if (selectedDistributor !== "all") {
      result = result.filter((f) => f.distributorId === selectedDistributor);
    }
    if (selectedCategory !== "all") {
      result = result.filter((f) => f.categoryId === selectedCategory);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "distributor":
          const distributorA = distributors.find((d) => d.id === a.distributorId)?.name || "";
          const distributorB = distributors.find((d) => d.id === b.distributorId)?.name || "";
          return distributorA.localeCompare(distributorB);
        case "category":
          const categoryA = categories.find((c) => c.id === a.categoryId)?.name || "";
          const categoryB = categories.find((c) => c.id === b.categoryId)?.name || "";
          return categoryA.localeCompare(categoryB);
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [flowers, selectedDistributor, selectedCategory, sortBy, distributors, categories]);

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-6 animate-slideUp">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <Select onValueChange={setSelectedDistributor} value={selectedDistributor}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrează după distribuitor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toți distribuitorii</SelectItem>
            {distributors.map((distributor) => (
              <SelectItem key={distributor.id} value={distributor.id}>
                {distributor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrează după categorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate categoriile</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSortBy} value={sortBy}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sortează după" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nume</SelectItem>
            <SelectItem value="distributor">Distribuitor</SelectItem>
            <SelectItem value="category">Categorie</SelectItem>
            <SelectItem value="date">Data adăugării</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
        {filteredAndSortedFlowers.map((flower) => (
          <FlowerCard
            key={flower.id}
            flower={flower}
            distributor={distributors.find((d) => d.id === flower.distributorId)!}
            category={categories.find((c) => c.id === flower.categoryId)!}
            onUpdateQuantity={onUpdateQuantity}
          />
        ))}
      </div>
    </div>
  );
};

export default FlowerGrid;
