import { useState } from "react";
import { Distributor } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Distributors = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [newDistributorName, setNewDistributorName] = useState("");

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

  const handleRemoveDistributor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('distributors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['distributors'] });
      toast({
        title: "Succes",
        description: "Distribuitor șters cu succes",
      });
    } catch (error) {
      console.error('Error removing distributor:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la ștergerea distribuitorului",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader showBackButton title="Distribuitori" />
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
