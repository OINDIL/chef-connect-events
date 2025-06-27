
import { useState, useEffect } from 'react';
import { eventService, Event, CreateEventData } from '@/services/eventService';
import { useToast } from '@/hooks/use-toast';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (eventData: CreateEventData) => {
    try {
      const newEvent = await eventService.createEvent(eventData);
      setEvents(prev => [newEvent, ...prev]);
      toast({
        title: "Success",
        description: "Event created successfully!",
      });
      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEventStatus = async (id: string, status: Event['status']) => {
    try {
      const updatedEvent = await eventService.updateEventStatus(id, status);
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      toast({
        title: "Success",
        description: `Event status updated to ${status}`,
      });
      return updatedEvent;
    } catch (error) {
      console.error('Error updating event status:', error);
      toast({
        title: "Error",
        description: "Failed to update event status",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      toast({
        title: "Success",
        description: "Event deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    addEvent,
    updateEventStatus,
    deleteEvent,
    refetch: fetchEvents
  };
};
