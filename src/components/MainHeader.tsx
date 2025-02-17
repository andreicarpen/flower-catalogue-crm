
import { Button } from "@/components/ui/button";
import { Menu, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const MainHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
  );
};
