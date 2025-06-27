
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Clock, Phone, Mail, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  guests: number;
  chef: string;
  client: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  description: string;
}

const initialEvents: Event[] = [
  {
    id: 1,
    title: "Elegant Wedding Reception",
    type: "Wedding",
    date: "2024-07-15",
    time: "18:00",
    location: "Grand Ballroom, NYC",
    guests: 150,
    chef: "Chef Mario Rossi",
    client: {
      name: "Emily & James",
      email: "emily.james@example.com",
      phone: "+1 (555) 123-4567"
    },
    status: "confirmed",
    price: 3500,
    description: "Elegant Italian wedding reception with multi-course dinner"
  },
  {
    id: 2,
    title: "Corporate Annual Dinner",
    type: "Corporate",
    date: "2024-07-20",
    time: "19:00",
    location: "Tech Center, SF",
    guests: 80,
    chef: "Chef Sarah Johnson",
    client: {
      name: "TechCorp Inc.",
      email: "events@techcorp.com",
      phone: "+1 (555) 234-5678"
    },
    status: "pending",
    price: 2400,
    description: "Annual corporate dinner with French cuisine theme"
  },
  {
    id: 3,
    title: "Birthday Celebration",
    type: "Birthday",
    date: "2024-07-18",
    time: "17:00",
    location: "Private Home, LA",
    guests: 25,
    chef: "Chef David Chen",
    client: {
      name: "Michael Rodriguez",
      email: "michael@example.com",
      phone: "+1 (555) 345-6789"
    },
    status: "confirmed",
    price: 1200,
    description: "50th birthday celebration with Asian fusion menu"
  }
];

export const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.chef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateEventStatus = (eventId: number, newStatus: Event['status']) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, status: newStatus } : event
    ));
    toast({
      title: "Success",
      description: `Event status updated to ${newStatus}`,
    });
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Event Management</h3>
          <p className="text-gray-600">Manage and track all your events</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events, clients, or chefs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{event.type}</Badge>
                    <span>•</span>
                    <span>{event.chef}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(event.status)}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                  <span className="text-lg font-semibold text-green-600">
                    ${event.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{event.guests} guests</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Client Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{event.client.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{event.client.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{event.client.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{event.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {event.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => updateEventStatus(event.id, 'confirmed')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateEventStatus(event.id, 'cancelled')}
                      className="text-red-600 hover:text-red-700"
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {event.status === 'confirmed' && (
                  <Button
                    size="sm"
                    onClick={() => updateEventStatus(event.id, 'completed')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Mark Complete
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  Contact Client
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No events found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
