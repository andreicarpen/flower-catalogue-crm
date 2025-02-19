import { useState } from "react";
import { Distributor } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MainHeader } from "@/components/MainHeader";
import { useFlowerData } from "@/hooks/use-flower-data";

const Distributors = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [newDistributorName, setNewDistributorName] = useState("");
  const { flowers } = useFlowerData();

  const { data: distributors = [] } = useQuery<Distributor[]>({
    queryKey: ['distributors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('distributors')
        .select('*')
        .order('name');
      if (error) throw error;
      return data.map(d => ({ ...d, id: d.id.toString() }));
    }
  });

  const handleAddDistributor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistributorName.trim()) {
      toast({
        title: "Eroare",
        description: "Vă rugăm introduceți numele distribuitorului",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('distributors')
        .insert({ name: newDistributorName.trim() });

      if (error) throw error;

      setNewDistributorName("");
      queryClient.invalidateQueries({ queryKey: ['distributors'] });
      toast({
        title: "Succes",
        description: "Distribuitor adăugat cu succes",
      });
    } catch (error) {
      console.error('Error adding distributor:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea distribuitorului",
        variant: "destructive",
      });
    }
  };

  const sortedDistributors = [...distributors].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader showBackButton title="Distribuitori" />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <Card className="p-6">
            <form onSubmit={handleAddDistributor} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label htmlFor="distributorName" className="text-sm font-medium">
                  Nume distribuitor
                </label>
                <Input
                  id="distributorName"
                  placeholder="Nume distribuitor nou"
                  value={newDistributorName}
                  onChange={(e) => setNewDistributorName(e.target.value)}
                />
              </div>
              <Button type="submit" className="self-end">
                Adaugă Distribuitor
              </Button>
            </form>
          </Card>

          <div className="grid gap-6">
            {sortedDistributors.map((distributor) => {
              const distributorFlowers = flowers
                .filter(flower => flower.distributorId === distributor.id)
                .sort((a, b) => a.name.localeCompare(b.name));

              return (
                <Card key={distributor.id} className="p-6">
                  <h3 className="font-medium text-lg mb-4">{distributor.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {distributorFlowers.map(flower => (
                      <div key={flower.id} className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                        <img 
                          src={flower.image} 
                          alt={flower.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="text-sm truncate flex-1">{flower.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Distributors;
