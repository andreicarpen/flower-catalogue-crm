
import { useState } from "react";
import { Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Categories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Roses" },
    { id: "2", name: "Tulips" },
    { id: "3", name: "Lilies" },
    { id: "4", name: "Orchids" },
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCategoryName.trim(),
    };

    setCategories((prev) => [...prev, newCategory]);
    setNewCategoryName("");
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  const handleRemoveCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: "Success",
      description: "Category removed successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="font-serif text-2xl font-semibold text-gray-900">Categories</h1>
            <Link to="/">
              <Button variant="outline">Back to Inventory</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Card className="p-6">
            <form onSubmit={handleAddCategory} className="flex gap-4">
              <Input
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Add Category</Button>
            </form>
          </Card>

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="p-4 flex justify-between items-center">
                <span className="font-medium">{category.name}</span>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Categories;
