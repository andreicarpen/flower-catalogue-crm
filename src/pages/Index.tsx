import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import FlowerGrid from "@/components/FlowerGrid";
import { useFlowerData } from "@/hooks/use-flower-data";
import { Button } from "@/components/ui/button";
import { Plus, Grid, List, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryFilter from "@/components/CategoryFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { flowers, distributors, categories } = useFlowerData();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      const {
        error
      } = await supabase.from('flowers').update({
        quantity
      }).eq('id', id);
      if (error) throw error;
      toast({
        title: "Succes",
        description: "Cantitate actualizată cu succes"
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la actualizarea cantității",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFlower = async (id: string) => {
    try {
      const {
        data: flower
      } = await supabase.from('flowers').select('image').eq('id', id).single();
      if (flower?.image) {
        const imagePath = flower.image.split('/').pop();
        if (imagePath) {
          await supabase.storage.from('flower-images').remove([imagePath]);
        }
      }
      const {
        error
      } = await supabase.from('flowers').delete().eq('id', id);
      if (error) throw error;
      toast({
        title: "Succes",
        description: "Floare ștearsă cu succes"
      });
    } catch (error) {
      console.error('Error deleting flower:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la ștergerea florii",
        variant: "destructive"
      });
    }
  };

  const sortedAndFilteredFlowers = flowers
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
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Caută..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex gap-4 flex-1">
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
                  ))}
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

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className={viewMode === "grid" ? "" : "space-y-4"}>
          {viewMode === "grid" ? (
            <FlowerGrid
              flowers={sortedAndFilteredFlowers}
              distributors={distributors}
              categories={categories}
              onUpdateQuantity={handleUpdateQuantity}
              onDeleteFlower={handleDeleteFlower}
            />
          ) : (
            sortedAndFilteredFlowers.map(flower => {
              const distributor = distributors.find(d => d.id === flower.distributorId);
              const category = categories.find(c => c.id === flower.categoryId);
              
              return (
                <div key={flower.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src={flower.image}
                    alt={flower.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{flower.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-sm text-gray-500">
                        {distributor?.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {category?.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Cantitate</div>
                    <div className="text-gray-500">{flower.quantity}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <Button
        onClick={() => navigate('/add')}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary/90"
      >
        <Plus className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default Index;
