
import { useState } from "react";
import { Flower, Distributor, Category } from "@/types";
import FlowerGrid from "@/components/FlowerGrid";
import AddFlowerForm from "@/components/AddFlowerForm";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch data using React Query
  const { data: distributors = [] } = useQuery<Distributor[]>({
    queryKey: ['distributors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('distributors')
        .select('*');
      if (error) throw error;
      return data.map(d => ({ ...d, id: d.id.toString() }));
    }
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      if (error) throw error;
      return data.map(c => ({ ...c, id: c.id.toString() }));
    }
  });

  const { data: flowers = [], isLoading } = useQuery<Flower[]>({
    queryKey: ['flowers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flowers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data.map(f => ({ ...f, id: f.id.toString(), distributorId: f.distributor_id.toString(), categoryId: f.category_id.toString() }));
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
    } catch (error) {
      console.error('Error adding flower:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea florii",
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      const { error } = await supabase
        .from('flowers')
        .update({ quantity })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['flowers'] });
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la deconectare",
        variant: "destructive",
      });
    } else {
      navigate("/login");
    }
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
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </Button>
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
