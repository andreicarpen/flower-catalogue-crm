import { useState } from "react";
import { Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Categories = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
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
        title: "Eroare",
        description: "Vă rugăm introduceți numele categoriei",
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
      title: "Succes",
      description: "Categorie adăugată cu succes",
    });
  };

  const handleRemoveCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: "Succes",
      description: "Categorie ștearsă cu succes",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'}`}>
            <h1 className="font-serif text-xl sm:text-2xl font-semibold text-gray-900">Categorii</h1>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto">Înapoi la Inventar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          <Card className="p-4 sm:p-6">
            <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Input
                placeholder="Nume categorie nouă"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="w-full sm:w-auto">Adaugă Categorie</Button>
            </form>
          </Card>

          <div className="grid gap-2 sm:gap-4">
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
