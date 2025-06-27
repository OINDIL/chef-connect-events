
import { useState } from "react";
import { AdminDashboard } from "@/components/AdminDashboard";
import { UserBooking } from "@/components/UserBooking";
import { Button } from "@/components/ui/button";
import { ChefHat, Calendar, BarChart3 } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState<'user' | 'admin'>('user');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ChefEvents</h1>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={activeView === 'user' ? 'default' : 'outline'}
                onClick={() => setActiveView('user')}
                className="flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Events</span>
              </Button>
              <Button
                variant={activeView === 'admin' ? 'default' : 'outline'}
                onClick={() => setActiveView('admin')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Admin Panel</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'user' ? <UserBooking /> : <AdminDashboard />}
      </main>
    </div>
  );
};

export default Index;
