
import { useState } from "react";
import { Flower, Distributor, Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface AddFlowerFormProps {
  distributors: Distributor[];
  categories: Category[];
  onAdd: (flower: Omit<Flower, "id" | "createdAt">) => void;
}

const AddFlowerForm = ({ distributors, categories, onAdd }: AddFlowerFormProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [distributorId, setDistributorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !image || !distributorId || !categoryId || !quantity) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    onAdd({
      name,
      image,
      distributorId,
      categoryId,
      quantity: parseInt(quantity),
    });

    // Reset form
    setName("");
    setImage("");
    setDistributorId("");
    setCategoryId("");
    setQuantity("");

    toast({
      title: "Success",
      description: "Flower added successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 max-w-xl mx-auto animate-slideUp">
      <div className="space-y-4">
        <div>
          <Input
            placeholder="Flower name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Select onValueChange={setDistributorId} value={distributorId}>
            <SelectTrigger>
              <SelectValue placeholder="Select distributor" />
            </SelectTrigger>
            <SelectContent>
              {distributors.map((distributor) => (
                <SelectItem key={distributor.id} value={distributor.id}>
                  {distributor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select onValueChange={setCategoryId} value={categoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0"
            className="w-full"
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-sage-600 hover:bg-sage-700">
        Add Flower
      </Button>
    </form>
  );
};

export default AddFlowerForm;
