
import { Flower, Distributor, Category } from "@/types";
import FlowerGrid from "@/components/FlowerGrid";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const { data: flowers = [] } = useQuery({
    queryKey: ['flowers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flowers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data.map(f => ({
        id: f.id.toString(),
        name: f.name,
        image: f.image,
        distributorId: f.distributor_id.toString(),
        categoryId: f.category_id.toString(),
        quantity: f.quantity,
        createdAt: f.created_at || new Date().toISOString()
      }));
    }
  });

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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Meniu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Link to="/distributors" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      Distribuitori
                    </Button>
                  </Link>
                  <Link to="/categories" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      Categorii
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Deconectare
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Button onClick={() => navigate('/add')} className="bg-sage-600 hover:bg-sage-700">
              <Plus className="h-4 w-4 mr-1" /> Adaugă
            </Button>
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
