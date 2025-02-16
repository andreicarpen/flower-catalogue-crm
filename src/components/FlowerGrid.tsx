
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
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";

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

  const filteredAndSortedFlowers = useMemo(() => {
    let result = [...flowers];

    if (selectedDistributor !== "all") {
      result = result.filter((f) => f.distributorId === selectedDistributor);
    }
    if (selectedCategory !== "all") {
      result = result.filter((f) => f.categoryId === selectedCategory);
    }

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
    <div className="space-y-4 sm:space-y-6 animate-slideUp">
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtre
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4 p-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Distribuitori</label>
                <Select onValueChange={setSelectedDistributor} value={selectedDistributor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toți distribuitorii" />
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Categorii</label>
                <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toate categoriile" />
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sortare</label>
                <Select onValueChange={setSortBy} value={sortBy}>
                  <SelectTrigger>
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
            </div>
          </PopoverContent>
        </Popover>
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
