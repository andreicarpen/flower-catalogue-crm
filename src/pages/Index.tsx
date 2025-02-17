import { useState } from "react";
import { Flower, Distributor, Category } from "@/types";
import FlowerGrid from "@/components/FlowerGrid";
import AddFlowerForm from "@/components/AddFlowerForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, Plus, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MobileDialog,
  MobileDialogContent,
  MobileDialogHeader,
  MobileDialogTitle,
} from "@/components/ui/mobile-dialog";

const Index = () => {
  const isMobile = useIsMobile();
  const [dialogOpen, setDialogOpen] = useState(false);
  // Mock data - in a real app, this would come from an API
  const [distributors] = useState<Distributor[]>([
    { id: "1", name: "Dutch Flower Group" },
    { id: "2", name: "FlowerPlus" },
    { id: "3", name: "Garden Fresh" },
  ]);

  const [categories] = useState<Category[]>([
    { id: "1", name: "Roses" },
    { id: "2", name: "Tulips" },
    { id: "3", name: "Lilies" },
    { id: "4", name: "Orchids" },
  ]);

  const [flowers, setFlowers] = useState<Flower[]>([
    {
      id: "1",
      name: "Red Rose",
      image: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=800",
      distributorId: "1",
      categoryId: "1",
      quantity: 100,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "White Tulip",
      image: "https://images.unsplash.com/photo-1600333859399-228aa03f7dba?w=800",
      distributorId: "2",
      categoryId: "2",
      quantity: 50,
      createdAt: new Date().toISOString(),
    },
  ]);

  const handleAddFlower = (newFlower: Omit<Flower, "id" | "createdAt">) => {
    const flower: Flower = {
      ...newFlower,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setFlowers((prev) => [flower, ...prev]);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setFlowers((prev) =>
      prev.map((flower) =>
        flower.id === id ? { ...flower, quantity } : flower
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <Link to="/distributors">
                  <DropdownMenuItem className="cursor-pointer">
                    Distribuitori
                  </DropdownMenuItem>
                </Link>
                <Link to="/categories">
                  <DropdownMenuItem className="cursor-pointer">
                    Categorii
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <MobileDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <Button onClick={() => setDialogOpen(true)} className="bg-sage-600 hover:bg-sage-700">
                  <Plus className="h-4 w-4 mr-1" /> Adaugă
                </Button>
                <MobileDialogContent>
                  <MobileDialogHeader>
                    <MobileDialogTitle>Adaugă Floare Nouă</MobileDialogTitle>
                  </MobileDialogHeader>
                  <AddFlowerForm
                    distributors={distributors}
                    categories={categories}
                    onAdd={(flower) => {
                      handleAddFlower(flower);
                      setDialogOpen(false);
                    }}
                  />
                </MobileDialogContent>
              </MobileDialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <FlowerGrid
          flowers={flowers}
          distributors={distributors}
          categories={categories}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </main>
    </div>
  );
};

export default Index;
