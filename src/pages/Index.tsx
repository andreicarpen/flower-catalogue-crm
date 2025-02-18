
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import FlowerGrid from "@/components/FlowerGrid";
import { useFlowerData } from "@/hooks/use-flower-data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryFilter from "@/components/CategoryFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { flowers, distributors, categories } = useFlowerData();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("date");
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      const { error } = await supabase
        .from('flowers')
        .update({ quantity })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succes",
        description: "Cantitate actualizată cu succes",
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la actualizarea cantității",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFlower = async (id: string) => {
    try {
      const { data: flower } = await supabase
        .from('flowers')
        .select('image')
        .eq('id', id)
        .single();

      if (flower?.image) {
        const imagePath = flower.image.split('/').pop();
        if (imagePath) {
          await supabase.storage
            .from('flower-images')
            .remove([imagePath]);
        }
      }

      const { error } = await supabase
        .from('flowers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succes",
        description: "Floare ștearsă cu succes",
      });
    } catch (error) {
      console.error('Error deleting flower:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la ștergerea florii",
        variant: "destructive",
      });
    }
  };

  const filteredAndSortedFlowers = flowers
    .filter(flower => {
      const matchesCategory = !selectedCategory || flower.categoryId === selectedCategory;
      const matchesDistributor = !selectedDistributor || flower.distributorId === selectedDistributor;
      
      if (!searchQuery) return matchesCategory && matchesDistributor;

      const searchLower = searchQuery.toLowerCase();
      const flowerName = flower.name.toLowerCase();
      const category = categories.find(c => c.id === flower.categoryId)?.name.toLowerCase() || '';
      const distributor = distributors.find(d => d.id === flower.distributorId)?.name.toLowerCase() || '';

      return (flowerName.includes(searchLower) || 
              category.includes(searchLower) || 
              distributor.includes(searchLower)) &&
              matchesCategory && matchesDistributor;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "distributor":
          const distA = distributors.find(d => d.id === a.distributorId)?.name || '';
          const distB = distributors.find(d => d.id === b.distributorId)?.name || '';
          return distA.localeCompare(distB);
        case "category":
          const catA = categories.find(c => c.id === a.categoryId)?.name || '';
          const catB = categories.find(c => c.id === b.categoryId)?.name || '';
          return catA.localeCompare(catB);
        case "date":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader 
        showSearch 
        onSearchChange={setSearchQuery} 
      />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="flex gap-4 mb-4">
          <Select value={selectedDistributor || "all"} onValueChange={(value) => setSelectedDistributor(value === "all" ? null : value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Distribuitor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toți distribuitorii</SelectItem>
              {distributors
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(distributor => (
                  <SelectItem key={distributor.id} value={distributor.id}>
                    {distributor.name}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sortează după" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data adăugării</SelectItem>
              <SelectItem value="name">Nume</SelectItem>
              <SelectItem value="distributor">Distribuitor</SelectItem>
              <SelectItem value="category">Categorie</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <FlowerGrid
          flowers={filteredAndSortedFlowers}
          distributors={distributors}
          categories={categories}
          onUpdateQuantity={handleUpdateQuantity}
          onDeleteFlower={handleDeleteFlower}
        />
      </main>
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
        onClick={() => navigate('/add')}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Index;
