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
  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [newCategoryName, setNewCategoryName] = useState("");
  const {
    flowers
  } = useFlowerData();
  const {
    data: categories = []
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data.map(c => ({
        ...c,
        id: c.id.toString()
      }));
    }
  });
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast({
        title: "Eroare",
        description: "Vă rugăm introduceți numele categoriei",
        variant: "destructive"
      });
      return;
    }
    try {
      const {
        error
      } = await supabase.from('categories').insert({
        name: newCategoryName.trim()
      });
      if (error) throw error;
      setNewCategoryName("");
      queryClient.invalidateQueries({
        queryKey: ['categories']
      });
      toast({
        title: "Succes",
        description: "Categorie adăugată cu succes"
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea categoriei",
        variant: "destructive"
      });
    }
  };
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  return <div className="min-h-screen bg-gray-50">
      <MainHeader showBackButton title="Categorii" />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <Card className="p-6">
            <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label htmlFor="categoryName" className="text-sm font-medium">
                  Nume categorie
                </label>
                <Input id="categoryName" placeholder="Nume categorie nouă" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
              </div>
              <Button type="submit" className="self-end">
                Adaugă Categorie
              </Button>
            </form>
          </Card>

          <div className="grid gap-6">
            {sortedCategories.map(category => {
            const categoryFlowers = flowers.filter(flower => flower.categoryId === category.id).sort((a, b) => a.name.localeCompare(b.name));
            return <Card key={category.id} className="bg-black/0 border-0 shadow-none">
                  <h3 className="font-medium text-lg mb-1">{category.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {categoryFlowers.map(flower => <div key={flower.id} className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                        <img src={flower.image} alt={flower.name} className="w-12 h-12 object-cover rounded" />
                        <span className="text-sm truncate flex-1">{flower.name}</span>
                      </div>)}
                  </div>
                </Card>;
          })}
          </div>
        </div>
      </main>
    </div>;
};
export default Categories;