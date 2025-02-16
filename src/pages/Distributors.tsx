
import { useState } from "react";
import { Distributor } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Distributors = () => {
  const { toast } = useToast();
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
        title: "Error",
        description: "Please enter a distributor name",
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
      title: "Success",
      description: "Distributor added successfully",
    });
  };

  const handleRemoveDistributor = (id: string) => {
    setDistributors((prev) => prev.filter((d) => d.id !== id));
    toast({
      title: "Success",
      description: "Distributor removed successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="font-serif text-2xl font-semibold text-gray-900">Distributors</h1>
            <Link to="/">
              <Button variant="outline">Back to Inventory</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Card className="p-6">
            <form onSubmit={handleAddDistributor} className="flex gap-4">
              <Input
                placeholder="New distributor name"
                value={newDistributorName}
                onChange={(e) => setNewDistributorName(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Add Distributor</Button>
            </form>
          </Card>

          <div className="grid gap-4">
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
