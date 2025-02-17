
import { useNavigate } from "react-router-dom";
import { Flower } from "@/types";
import AddFlowerForm from "@/components/AddFlowerForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

const AddFlower = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: distributors = [] } = useQuery({
    queryKey: ['distributors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('distributors')
        .select('*');
      if (error) throw error;
      return data.map(d => ({ ...d, id: d.id.toString() }));
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      if (error) throw error;
      return data.map(c => ({ ...c, id: c.id.toString() }));
    }
  });

  const handleAddFlower = async (newFlower: Omit<Flower, "id" | "createdAt">) => {
    try {
      // Upload image to Storage
      const { data: imageData, error: uploadError } = await supabase.storage
        .from('flower-images')
        .upload(`${crypto.randomUUID()}.jpg`, await fetch(newFlower.image).then(r => r.blob()));

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('flower-images')
        .getPublicUrl(imageData.path);

      // Insert flower data into the database
      const { error: insertError } = await supabase
        .from('flowers')
        .insert({
          name: newFlower.name,
          image: publicUrl,
          distributor_id: newFlower.distributorId,
          category_id: newFlower.categoryId,
          quantity: newFlower.quantity
        });

      if (insertError) throw insertError;

      queryClient.invalidateQueries({ queryKey: ['flowers'] });
      toast({
        title: "Succes",
        description: "Floare adăugată cu succes",
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding flower:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea florii",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')} className="hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Adaugă Floare Nouă</h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <AddFlowerForm
          distributors={distributors}
          categories={categories}
          onAdd={handleAddFlower}
        />
      </main>
    </div>
  );
};

export default AddFlower;
