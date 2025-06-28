import { useAuth } from "@/contexts/AuthContext";
import { Auth } from "@/components/Auth";
import { UserBooking } from "@/components/UserBooking";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChefHat, Users, Calendar, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome back, {user.user_metadata?.first_name || "Chef Lover"}!
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover and book the perfect chef for your next event
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Browse Chefs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/profile">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                View My Bookings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ChefBooking?
            </h3>
            <p className="text-xl text-gray-600">
              Experience culinary excellence at your fingertips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <ChefHat className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Expert Chefs</CardTitle>
                <CardDescription>
                  Carefully curated professional chefs with years of experience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Easy Booking</CardTitle>
                <CardDescription>
                  Simple and secure booking process for all your events
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Quality Guaranteed</CardTitle>
                <CardDescription>
                  Highly rated chefs with verified reviews and ratings
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Access to Booking */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserBooking />
        </div>
      </section>
    </div>
  );
};

export default Index;
