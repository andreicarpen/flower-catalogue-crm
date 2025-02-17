
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Flower, Distributor, Category } from "@/types";

export const useFlowerData = () => {
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

  const { data: flowers = [] } = useQuery<Flower[]>({
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

  return {
    flowers,
    distributors,
    categories
  };
};
