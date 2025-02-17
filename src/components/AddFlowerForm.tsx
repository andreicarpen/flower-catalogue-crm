import { useState, useRef } from "react";
import { Flower, Distributor, Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Upload } from "lucide-react";
interface AddFlowerFormProps {
  distributors: Distributor[];
  categories: Category[];
  onAdd: (flower: Omit<Flower, "id" | "createdAt">) => void;
}
const AddFlowerForm = ({
  distributors,
  categories,
  onAdd
}: AddFlowerFormProps) => {
  const {
    toast
  } = useToast();
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [distributorId, setDistributorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imagePreview || !distributorId || !categoryId || !quantity) {
      toast({
        title: "Eroare",
        description: "Vă rugăm completați toate câmpurile",
        variant: "destructive"
      });
      return;
    }
    onAdd({
      name,
      image: imagePreview,
      distributorId,
      categoryId,
      quantity: parseInt(quantity)
    });

    // Reset form
    setName("");
    setImagePreview(null);
    setDistributorId("");
    setCategoryId("");
    setQuantity("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "Succes",
      description: "Floare adăugată cu succes"
    });
  };
  return <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <Input placeholder="Nume floare" value={name} onChange={e => setName(e.target.value)} className="w-full" />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Alege Imagine
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.capture = "environment";
              fileInputRef.current.click();
            }
          }}>
              <Camera className="w-4 h-4 mr-2" />
              Fă o Poză
            </Button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          {imagePreview && <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
              <img src={imagePreview} alt="Previzualizare" className="h-full w-full object-cover" />
            </div>}
        </div>

        <div>
          <Select onValueChange={setDistributorId} value={distributorId}>
            <SelectTrigger>
              <SelectValue placeholder="Selectează distribuitor" />
            </SelectTrigger>
            <SelectContent>
              {distributors.map(distributor => <SelectItem key={distributor.id} value={distributor.id}>
                  {distributor.name}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select onValueChange={setCategoryId} value={categoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Selectează categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Input type="number" placeholder="Cantitate" value={quantity} onChange={e => setQuantity(e.target.value)} min="0" className="w-full" />
        </div>
      </div>

      <div className="p-6 border-t mt-auto space-x-2 flex justify-end sticky bottom-0 bg-white">
        <Button type="submit" className="bg-sage-600 hover:bg-sage-700">
          Adaugă Floare
        </Button>
      </div>
    </form>;
};
export default AddFlowerForm;