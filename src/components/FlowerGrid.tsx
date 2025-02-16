
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
    <div className="space-y-6 p-6 animate-slideUp">
      <div className="flex flex-wrap gap-4">
        <Select onValueChange={setSelectedDistributor} value={selectedDistributor}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by distributor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All distributors</SelectItem>
            {distributors.map((distributor) => (
              <SelectItem key={distributor.id} value={distributor.id}>
                {distributor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSortBy} value={sortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="distributor">Distributor</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="date">Date added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
