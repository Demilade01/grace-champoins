import { useState, useRef, useEffect, FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Calendar, Heart, BookOpen, Globe, UserPlus, Loader2, ExternalLink, Church, Mail, Phone, User } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
}

export function LandingPage() {
  const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Fetch total count on mount
  useEffect(() => {
    fetchTotalCount();
  }, []);

  const fetchTotalCount = async () => {
    try {
      const response = await fetch('/api/contacts/count');
      const data = await response.json();
      if (data.success) {
        setTotalCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter your full name");
      nameInputRef.current?.focus();
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success!
        toast.success(`Welcome ${formData.name}! 🙌`, {
          description: 'You have been registered successfully',
        });

        // Clear form
        setFormData({ name: '', email: '', phone: '' });

        // Auto-focus on name field for next entry
        nameInputRef.current?.focus();

        // Update count
        fetchTotalCount();
      } else if (response.status === 409 && data.duplicate) {
        // Duplicate
        toast.error(data.message || "This contact already exists", {
          description: 'You may already be registered',
        });
      } else {
        // Other errors
        toast.error(data.message || "Failed to register");
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Unable to connect to the server. Please try again.", {
        description: 'Connection error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewSheet = async () => {
    try {
      const response = await fetch('/api/contacts/sheet-url');
      const data = await response.json();
      if (data.success && data.url) {
        window.open(data.url, '_blank');
        toast.success("Opening registration list");
      }
    } catch (error) {
      toast.error("Could not retrieve sheet URL");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-purple-900 via-blue-900 to-purple-800">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">

        {/* Logo and Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          {/* RCCG Logo */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-30 animate-pulse" />
              <img
                src="/Rccg_logo.png"
                alt="The Redeemed Christian Church of God"
                className="w-24 h-24 md:w-32 md:h-32 relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-white drop-shadow-lg">
            Grace Champions
          </h1>

          {/* Church Name */}
          <div className="mb-4">
            <p className="text-base md:text-lg text-green-400 font-semibold tracking-wider uppercase mb-2">
              The Redeemed Christian Church of God
            </p>
            <div className="h-1 w-40 mx-auto bg-linear-to-r from-transparent via-red-500 to-transparent rounded-full" />
          </div>
        </div>

        {/* Main Container with Form and Info */}
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left Side - Info Cards */}
          <div className="space-y-6">
            {/* Tagline Card */}
            <div className="backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-2xl p-6 text-center">
              <p className="text-xl md:text-2xl text-purple-100 mb-2 font-light">
                Champions of Faith • Vessels of Grace
              </p>
              <p className="text-lg text-blue-200 italic">
                "I am redeemed by the blood of Jesus"
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="backdrop-blur-xl bg-white/10 border-2 border-green-400/30 rounded-xl p-5 hover:bg-white/15 hover:border-green-400/50 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white mb-1">Join Our Community</h3>
                    <p className="text-sm text-purple-100">Be part of a fellowship of redeemed believers</p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border-2 border-purple-400/30 rounded-xl p-5 hover:bg-white/15 hover:border-purple-400/50 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white mb-1">Upcoming Events</h3>
                    <p className="text-sm text-purple-100">Stay connected with our programs and services</p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border-2 border-red-400/30 rounded-xl p-5 hover:bg-white/15 hover:border-red-400/50 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white mb-1">Experience Grace</h3>
                    <p className="text-sm text-purple-100">Discover God's transforming love and power</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <BookOpen className="w-5 h-5 text-green-400" />
                <h3 className="text-xl font-bold text-white">Our Mission</h3>
                <Globe className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-purple-100 text-sm leading-relaxed">
                To make heaven, to take as many people with us, and to have a member of RCCG in every family of all nations.
              </p>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="lg:sticky lg:top-8">
            <Card className="backdrop-blur-xl bg-white/98 border-2 border-green-500/30 shadow-2xl shadow-green-500/20">
              <CardHeader className="space-y-1 pb-4 border-b-2 border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-linear-to-br from-green-600 to-green-700 rounded-lg shadow-lg">
                      <Church className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-green-700">
                        Grace Champions
                      </CardTitle>
                      {totalCount !== null && (
                        <p className="text-xs text-purple-700 font-semibold">{totalCount} registered</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="h-1 w-20 bg-linear-to-r from-green-600 via-purple-600 to-red-600 rounded-full" />
              </CardHeader>

              <CardContent className="pt-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                      <User className="w-4 h-4 text-green-600" />
                      Full Name <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      ref={nameInputRef}
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={isSubmitting}
                      className="h-11 text-base border-2 border-gray-300 focus:border-green-600 focus:ring-green-600 transition-colors bg-white"
                      autoFocus
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-purple-600" />
                      Email Address <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isSubmitting}
                      className="h-11 text-base border-2 border-gray-300 focus:border-purple-600 focus:ring-purple-600 transition-colors bg-white"
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-blue-600" />
                      Phone Number <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="08012345678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={isSubmitting}
                      className="h-11 text-base border-2 border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors bg-white"
                      autoComplete="tel"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-bold bg-linear-to-r from-green-600 via-green-700 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-500 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/50 transition-all duration-300 border-2 border-white/50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-5 w-5" />
                          Register Now
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-10 border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400 text-purple-700 font-semibold transition-all text-sm"
                      onClick={handleViewSheet}
                      disabled={isSubmitting}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View All Registrations
                    </Button>
                  </div>
                </form>

                <div className="mt-4 pt-4 border-t-2 border-green-100 text-center text-xs text-gray-600">
                  <div className="flex items-center justify-center gap-2 mb-2 text-green-700 font-semibold">
                    <Church className="w-3 h-3" />
                    <span>Quick Entry Mode</span>
                  </div>
                  <div className="space-x-1">
                    <kbd className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-mono border border-green-200">Tab</kbd>
                    <span>navigate •</span>
                    <kbd className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-mono border border-green-200">Enter</kbd>
                    <span>register</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center space-y-2">
          <div className="text-green-300 text-xs font-semibold">
            <p>THE REDEEMED CHRISTIAN CHURCH OF GOD</p>
          </div>
          <div className="text-purple-200/80 text-xs italic">
            <p>"For by grace you have been saved through faith" - Ephesians 2:8</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-20 right-20 w-48 h-48 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 right-40 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
}
