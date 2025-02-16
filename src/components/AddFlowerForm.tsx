
import { useState, useRef } from "react";
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
import { Camera, Upload } from "lucide-react";

interface AddFlowerFormProps {
  distributors: Distributor[];
  categories: Category[];
  onAdd: (flower: Omit<Flower, "id" | "createdAt">) => void;
}

const AddFlowerForm = ({ distributors, categories, onAdd }: AddFlowerFormProps) => {
  const { toast } = useToast();
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
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    onAdd({
      name,
      image: imagePreview,
      distributorId,
      categoryId,
      quantity: parseInt(quantity),
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

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Image
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.capture = "environment";
                  fileInputRef.current.click();
                }
              }}
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview && (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
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
