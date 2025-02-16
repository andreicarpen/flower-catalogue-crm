import { useState } from "react";
import { Distributor } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Distributors = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [distributors, setDistributors] = useState<Distributor[]>([
    { id: "1", name: "Dutch Flower Group" },
    { id: "2", name: "FlowerPlus" },
    { id: "3", name: "Garden Fresh" },
  ]);
  const [newDistributorName, setNewDistributorName] = useState("");

  const handleAddDistributor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistributorName.trim()) {
      toast({
        title: "Eroare",
        description: "Vă rugăm introduceți numele distribuitorului",
        variant: "destructive",
      });
      return;
    }

    const newDistributor: Distributor = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDistributorName.trim(),
    };

    setDistributors((prev) => [...prev, newDistributor]);
    setNewDistributorName("");
    toast({
      title: "Succes",
      description: "Distribuitor adăugat cu succes",
    });
  };

  const handleRemoveDistributor = (id: string) => {
    setDistributors((prev) => prev.filter((d) => d.id !== id));
    toast({
      title: "Succes",
      description: "Distribuitor șters cu succes",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'}`}>
            <h1 className="font-serif text-xl sm:text-2xl font-semibold text-gray-900">Distribuitori</h1>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto">Înapoi la Inventar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          <Card className="p-4 sm:p-6">
            <form onSubmit={handleAddDistributor} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Input
                placeholder="Nume distribuitor nou"
                value={newDistributorName}
                onChange={(e) => setNewDistributorName(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="w-full sm:w-auto">Adaugă Distribuitor</Button>
            </form>
          </Card>

          <div className="grid gap-2 sm:gap-4">
            {distributors.map((distributor) => (
              <Card key={distributor.id} className="p-4 flex justify-between items-center">
                <span className="font-medium">{distributor.name}</span>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveDistributor(distributor.id)}
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

export default Distributors;
