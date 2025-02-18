
import { useState } from "react";
import { Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MainHeader } from "@/components/MainHeader";
import { useFlowerData } from "@/hooks/use-flower-data";

const Categories = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [newCategoryName, setNewCategoryName] = useState("");
  const { flowers } = useFlowerData();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data.map(c => ({ ...c, id: c.id.toString() }));
    }
  });

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast({
        title: "Eroare",
        description: "Vă rugăm introduceți numele categoriei",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .insert({ name: newCategoryName.trim() });

      if (error) throw error;

      setNewCategoryName("");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Succes",
        description: "Categorie adăugată cu succes",
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea categoriei",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader showBackButton title="Categorii" />
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

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="p-4">
                <h3 className="font-medium text-lg mb-4">{category.name}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {flowers
                    .filter(flower => flower.categoryId === category.id)
                    .map(flower => (
                      <div key={flower.id} className="flex items-center gap-2 bg-white rounded-lg p-2 border">
                        <img 
                          src={flower.image} 
                          alt={flower.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="text-sm truncate">{flower.name}</span>
                      </div>
                    ))
                  }
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Categories;
