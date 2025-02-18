
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import FlowerGrid from "@/components/FlowerGrid";
import { useFlowerData } from "@/hooks/use-flower-data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { flowers, distributors, categories } = useFlowerData();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader showSearch showFilter />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <FlowerGrid
          flowers={flowers}
          distributors={distributors}
          categories={categories}
          onUpdateQuantity={handleUpdateQuantity}
          onDeleteFlower={handleDeleteFlower}
        />
      </main>
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-sage-600 hover:bg-sage-700"
        onClick={() => navigate('/add')}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Index;
