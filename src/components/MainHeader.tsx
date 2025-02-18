import { Button } from "@/components/ui/button";
import { Menu, Store, Tag, LogOut, Filter, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface MainHeaderProps {
  showBackButton?: boolean;
  title?: string;
  showSearch?: boolean;
  onSearchChange?: (value: string) => void;
}

export const MainHeader = ({ 
  showBackButton, 
  title, 
  showSearch = false,
  onSearchChange 
}: MainHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
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

  if (showBackButton) {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')} className="hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">{title}</h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>
    );
  }

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
            <SheetContent side="left" className="flex flex-col">
              <div className="flex-1 mt-6 space-y-4">
                <Link to="/distributors" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Store className="mr-2 h-4 w-4" />
                    Distribuitori
                  </Button>
                </Link>
                <Link to="/categories" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Tag className="mr-2 h-4 w-4" />
                    Categorii
                  </Button>
                </Link>
              </div>
              <div className="border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-4"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Deconectare
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {showSearch && (
            <div className="flex-1 mx-4">
              <Input
                type="search"
                placeholder="Caută..."
                className="max-w-sm"
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          )}

          {showFilter && (
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
