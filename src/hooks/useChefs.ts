
import { useState, useEffect } from 'react';
import { chefService, Chef, CreateChefData } from '@/services/chefService';
import { useToast } from '@/hooks/use-toast';

export const useChefs = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchChefs = async () => {
    try {
      setLoading(true);
      const data = await chefService.getAllChefs();
      setChefs(data);
    } catch (error) {
      console.error('Error fetching chefs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch chefs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addChef = async (chefData: CreateChefData) => {
    try {
      const newChef = await chefService.createChef(chefData);
      setChefs(prev => [newChef, ...prev]);
      toast({
        title: "Success",
        description: "Chef added successfully!",
      });
      return newChef;
    } catch (error) {
      console.error('Error adding chef:', error);
      toast({
        title: "Error",
        description: "Failed to add chef",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateChef = async (id: string, chefData: Partial<CreateChefData>) => {
    try {
      const updatedChef = await chefService.updateChef(id, chefData);
      setChefs(prev => prev.map(chef => chef.id === id ? updatedChef : chef));
      toast({
        title: "Success",
        description: "Chef updated successfully!",
      });
      return updatedChef;
    } catch (error) {
      console.error('Error updating chef:', error);
      toast({
        title: "Error",
        description: "Failed to update chef",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteChef = async (id: string) => {
    try {
      await chefService.deleteChef(id);
      setChefs(prev => prev.filter(chef => chef.id !== id));
      toast({
        title: "Success",
        description: "Chef removed successfully!",
      });
    } catch (error) {
      console.error('Error deleting chef:', error);
      toast({
        title: "Error",
        description: "Failed to remove chef",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  return {
    chefs,
    loading,
    addChef,
    updateChef,
    deleteChef,
    refetch: fetchChefs
  };
};
