import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}
const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory
}: CategoryFilterProps) => {
  return <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2">
            <Button variant={selectedCategory === null ? "default" : "outline"} onClick={() => onSelectCategory(null)} className="shrink-0 text-xs p-2 py-[8px] px-[10px]">
              Toate
            </Button>
            {categories.sort((a, b) => a.name.localeCompare(b.name)).map(category => <Button key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} onClick={() => onSelectCategory(category.id)} className="shrink-0 text-xs p-2 px-[9px] py-[7px]">
                {category.name}
              </Button>)}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>;
};
export default CategoryFilter;