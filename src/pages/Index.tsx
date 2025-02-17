
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import FlowerGrid from "@/components/FlowerGrid";
import { useFlowerData } from "@/hooks/use-flower-data";

const Index = () => {
  const { toast } = useToast();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
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
