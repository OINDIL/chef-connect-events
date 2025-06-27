
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Star, MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Chef {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  rating: number;
  location: string;
  bio: string;
  priceRange: string;
  status: 'active' | 'inactive';
  image: string;
}

const initialChefs: Chef[] = [
  {
    id: 1,
    name: "Chef Mario Rossi",
    email: "mario@example.com",
    phone: "+1 (555) 123-4567",
    specialty: "Italian Cuisine",
    experience: 15,
    rating: 4.9,
    location: "New York, NY",
    bio: "Passionate Italian chef with 15 years of experience in fine dining.",
    priceRange: "$150-250/hour",
    status: 'active',
    image: "photo-1649972904349-6e44c42644a7"
  },
  {
    id: 2,
    name: "Chef Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 234-5678",
    specialty: "French Cuisine",
    experience: 12,
    rating: 4.8,
    location: "Los Angeles, CA",
    bio: "French cuisine specialist with expertise in molecular gastronomy.",
    priceRange: "$120-200/hour",
    status: 'active',
    image: "photo-1488590528505-98d2b5aba04b"
  },
  {
    id: 3,
    name: "Chef David Chen",
    email: "david@example.com",
    phone: "+1 (555) 345-6789",
    specialty: "Asian Fusion",
    experience: 10,
    rating: 4.7,
    location: "San Francisco, CA",
    bio: "Creative Asian fusion chef blending traditional and modern techniques.",
    priceRange: "$100-180/hour",
    status: 'active',
    image: "photo-1581091226825-a6a2a5aee158"
  }
];

export const ChefManagement = () => {
  const [chefs, setChefs] = useState<Chef[]>(initialChefs);
  const [isAddingChef, setIsAddingChef] = useState(false);
  const [editingChef, setEditingChef] = useState<Chef | null>(null);
  const { toast } = useToast();

  const [newChef, setNewChef] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    experience: 0,
    location: "",
    bio: "",
    priceRange: "",
    status: 'active' as 'active' | 'inactive'
  });

  const handleAddChef = () => {
    if (!newChef.name || !newChef.email || !newChef.specialty) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const chef: Chef = {
      id: Date.now(),
      ...newChef,
      rating: 0,
      image: "photo-1649972904349-6e44c42644a7"
    };

    setChefs([...chefs, chef]);
    setNewChef({
      name: "",
      email: "",
      phone: "",
      specialty: "",
      experience: 0,
      location: "",
      bio: "",
      priceRange: "",
      status: 'active'
    });
    setIsAddingChef(false);
    
    toast({
      title: "Success",
      description: "Chef added successfully!",
    });
  };

  const handleDeleteChef = (id: number) => {
    setChefs(chefs.filter(chef => chef.id !== id));
    toast({
      title: "Success",
      description: "Chef removed successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Chef Management</h3>
          <p className="text-gray-600">Manage your chef network</p>
        </div>
        <Dialog open={isAddingChef} onOpenChange={setIsAddingChef}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Chef
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Chef</DialogTitle>
              <DialogDescription>
                Add a new chef to your network
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newChef.name}
                  onChange={(e) => setNewChef({ ...newChef, name: e.target.value })}
                  placeholder="Chef's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newChef.email}
                  onChange={(e) => setNewChef({ ...newChef, email: e.target.value })}
                  placeholder="chef@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newChef.phone}
                  onChange={(e) => setNewChef({ ...newChef, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty *</Label>
                <Select
                  value={newChef.specialty}
                  onValueChange={(value) => setNewChef({ ...newChef, specialty: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Italian Cuisine">Italian Cuisine</SelectItem>
                    <SelectItem value="French Cuisine">French Cuisine</SelectItem>
                    <SelectItem value="Asian Fusion">Asian Fusion</SelectItem>
                    <SelectItem value="American Cuisine">American Cuisine</SelectItem>
                    <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                    <SelectItem value="Pastry & Desserts">Pastry & Desserts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input
                  id="experience"
                  type="number"
                  value={newChef.experience}
                  onChange={(e) => setNewChef({ ...newChef, experience: parseInt(e.target.value) || 0 })}
                  placeholder="Years of experience"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newChef.location}
                  onChange={(e) => setNewChef({ ...newChef, location: e.target.value })}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceRange">Price Range</Label>
                <Input
                  id="priceRange"
                  value={newChef.priceRange}
                  onChange={(e) => setNewChef({ ...newChef, priceRange: e.target.value })}
                  placeholder="$100-200/hour"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newChef.status}
                  onValueChange={(value: 'active' | 'inactive') => setNewChef({ ...newChef, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={newChef.bio}
                  onChange={(e) => setNewChef({ ...newChef, bio: e.target.value })}
                  placeholder="Brief description of the chef's background and expertise"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddChef} className="flex-1">
                Add Chef
              </Button>
              <Button variant="outline" onClick={() => setIsAddingChef(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chefs.map((chef) => (
          <Card key={chef.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://images.unsplash.com/${chef.image}?auto=format&fit=crop&w=100&h=100`}
                    alt={chef.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{chef.name}</CardTitle>
                    <CardDescription>{chef.specialty}</CardDescription>
                  </div>
                </div>
                <Badge variant={chef.status === 'active' ? 'default' : 'secondary'}>
                  {chef.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{chef.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">• {chef.experience} years exp.</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{chef.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{chef.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{chef.phone}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2">{chef.bio}</p>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-green-600">{chef.priceRange}</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteChef(chef.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
