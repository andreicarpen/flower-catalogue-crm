
import { useState } from "react";
import { Flower, Distributor, Category } from "@/types";
import FlowerGrid from "@/components/FlowerGrid";
import AddFlowerForm from "@/components/AddFlowerForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

const Index = () => {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="font-serif text-2xl font-semibold text-gray-900">Flower Inventory</h1>
            <div className="flex gap-4">
              <Link to="/distributors">
                <Button variant="outline">Manage Distributors</Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline">Manage Categories</Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-sage-600 hover:bg-sage-700">Add New Flower</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <AddFlowerForm
                    distributors={distributors}
                    categories={categories}
                    onAdd={handleAddFlower}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
