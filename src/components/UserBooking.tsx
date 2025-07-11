import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  MapPin,
  Users,
  Calendar,
  Clock,
  ChefHat,
  Search,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { chefService, Chef } from "@/services/chefService";
import { eventService, CreateEventData } from "@/services/eventService";
import { supabase } from "@/integrations/supabase/client";

export const UserBooking = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [bookingForm, setBookingForm] = useState({
    eventType: "",
    date: "",
    time: "",
    location: "",
    guests: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    description: "",
    budget: "",
  });

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const data = await chefService.getAllChefs();
        setChefs(data.filter((chef) => chef.status === "active"));
      } catch (error) {
        console.error("Error fetching chefs:", error);
        toast({
          title: "Error",
          description: "Failed to load chefs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, [toast]);

  const filteredChefs = chefs.filter((chef) => {
    const matchesSearch =
      chef.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chef.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      specialtyFilter === "all" ||
      chef.specialty.toLowerCase().includes(specialtyFilter.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  const handleBooking = async () => {
    if (
      !selectedChef ||
      !bookingForm.eventType ||
      !bookingForm.date ||
      !bookingForm.clientName ||
      !bookingForm.clientEmail
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const eventData: CreateEventData = {
        title: `${bookingForm.eventType} Event`,
        type: bookingForm.eventType,
        date: bookingForm.date,
        time: bookingForm.time || "18:00",
        location: bookingForm.location || "TBD",
        guests: parseInt(bookingForm.guests) || 1,
        chef_id: selectedChef.id,
        client_name: bookingForm.clientName,
        client_email: bookingForm.clientEmail,
        client_phone: bookingForm.clientPhone,
        status: "pending",
        price: 0,
        description: bookingForm.description,
      };

      const newEvent = await eventService.createEvent(eventData);

      // Create user booking record if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("user_bookings").insert([
          {
            user_id: user.id,
            event_id: newEvent.id,
            notes: bookingForm.description,
          },
        ]);
      }

      toast({
        title: "Booking Submitted!",
        description: `Your booking with ${selectedChef.name} has been submitted for review.`,
      });

      // Reset form
      setBookingForm({
        eventType: "",
        date: "",
        time: "",
        location: "",
        guests: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        description: "",
        budget: "",
      });
      setIsBookingDialogOpen(false);
      setSelectedChef(null);
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">
          Book Your Perfect Chef
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover talented chefs for your special events. From intimate dinners
          to grand celebrations, find the perfect culinary artist for your
          occasion.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search chefs or cuisines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by cuisine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cuisines</SelectItem>
            <SelectItem value="italian">Italian</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="asian">Asian</SelectItem>
            <SelectItem value="american">American</SelectItem>
            <SelectItem value="mediterranean">Mediterranean</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chef Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChefs.map((chef) => (
          <Card
            key={chef.id}
            className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center space-y-3">
                <img
                  src={`https://images.unsplash.com/${
                    chef.image_url || "photo-1649972904349-6e44c42644a7"
                  }?auto=format&fit=crop&w=200&h=200`}
                  alt={chef.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-50"
                />
                <div className="text-center">
                  <CardTitle className="text-xl">{chef.name}</CardTitle>
                  <CardDescription className="font-medium">
                    {chef.specialty}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{chef.rating}</span>
                </div>
                {chef.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{chef.location}</span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  {chef.experience} years experience
                </Badge>
                {chef.bio && (
                  <p className="text-sm text-gray-600 mb-3">{chef.bio}</p>
                )}
                {chef.price_range && (
                  <p className="text-lg font-semibold text-green-600">
                    {chef.price_range}
                  </p>
                )}
              </div>

              <Dialog
                open={isBookingDialogOpen && selectedChef?.id === chef.id}
                onOpenChange={setIsBookingDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    onClick={() => setSelectedChef(chef)}
                  >
                    <ChefHat className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Book {chef.name}</DialogTitle>
                    <DialogDescription>
                      Fill out the details for your event booking
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type *</Label>
                      <Select
                        value={bookingForm.eventType}
                        onValueChange={(value) =>
                          setBookingForm({ ...bookingForm, eventType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="birthday">
                            Birthday Party
                          </SelectItem>
                          <SelectItem value="corporate">
                            Corporate Event
                          </SelectItem>
                          <SelectItem value="anniversary">
                            Anniversary
                          </SelectItem>
                          <SelectItem value="dinner">Private Dinner</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={bookingForm.time}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            time: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Input
                        id="guests"
                        type="number"
                        value={bookingForm.guests}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            guests: e.target.value,
                          })
                        }
                        placeholder="50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Your Name *</Label>
                      <Input
                        id="clientName"
                        value={bookingForm.clientName}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            clientName: e.target.value,
                          })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientEmail">Email *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={bookingForm.clientEmail}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            clientEmail: e.target.value,
                          })
                        }
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientPhone">Phone</Label>
                      <Input
                        id="clientPhone"
                        value={bookingForm.clientPhone}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            clientPhone: e.target.value,
                          })
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select
                        value={bookingForm.budget}
                        onValueChange={(value) =>
                          setBookingForm({ ...bookingForm, budget: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-1000">
                            Under $1,000
                          </SelectItem>
                          <SelectItem value="1000-2500">
                            $1,000 - $2,500
                          </SelectItem>
                          <SelectItem value="2500-5000">
                            $2,500 - $5,000
                          </SelectItem>
                          <SelectItem value="over-5000">Over $5,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="location">Event Location</Label>
                      <Input
                        id="location"
                        value={bookingForm.location}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            location: e.target.value,
                          })
                        }
                        placeholder="123 Main St, City, State"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="description">Event Description</Label>
                      <Textarea
                        id="description"
                        value={bookingForm.description}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Tell us about your event, dietary restrictions, special requests, etc."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleBooking}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Submit Booking Request
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsBookingDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChefs.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No chefs found matching your search criteria.
            </p>
            <p className="text-gray-400">
              Try adjusting your search or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
