import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import joinBg from "@/assets/join-bg.jpg";
import { SEO } from "@/components/SEO";
import { MpesaPayment } from "@/components/MpesaPayment";

const Join = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedTierName, setSelectedTierName] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'form' | 'payment'>('select');
  const [selectedTierPrice, setSelectedTierPrice] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    year_of_study: "",
    course: "",
    interests: "",
  });

  // Fetch membership tiers
  const { data: tiers, isLoading: tiersLoading } = useQuery({
    queryKey: ["membership-tiers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_tiers")
        .select("*")
        .eq("active", true)
        .order("price", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const handleTierSelect = (tierId: string, tierName: string, price: number) => {
    setSelectedTier(tierId);
    setSelectedTierName(tierName);
    setSelectedTierPrice(price);
    setPaymentStep('form');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to join as a paid member",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!selectedTier) {
      toast({
        title: "Select a membership tier",
        description: "Please choose a membership tier to continue",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First add to community members
      const { error: communityError } = await supabase
        .from("community_members")
        .insert([{ ...formData, email: user.email }]);

      if (communityError && communityError.code !== "23505") {
        throw communityError;
      }

      setPaymentStep('payment');
    } catch (error) {
      console.error("Form error:", error);
      toast({
        title: "Error",
        description: "Failed to process form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Create membership record
      const { data: membershipData, error: membershipError } = await supabase
        .from("memberships")
        .insert([
          {
            user_id: user?.id,
            tier_id: selectedTier,
            status: "active",
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            membership_number: `MUMBSO-${Date.now()}`,
          },
        ])
        .select();

      if (membershipError) throw membershipError;

      toast({
        title: "Welcome to MUMBSO!",
        description: "Your membership is now active. Welcome aboard!",
      });

      // Redirect after short delay
      setTimeout(() => {
        navigate("/members");
      }, 2000);
    } catch (error) {
      console.error("Membership creation error:", error);
      toast({
        title: "Success",
        description: "Payment received! Your membership is being activated.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleFormSubmit(e);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Join MUMBSO - Medical & Biotechnology Student Organization"
        description="Become part of our biotechnology community. Access exclusive workshops, research opportunities, and networking events."
      />
      <Header />
      <section className="relative py-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={joinBg}
            alt="Medical Biotechnology Research Laboratory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/75" />
        </div>
        
        {/* Content */}
        <div className="container text-center relative z-10">
          <h1 className="text-4xl font-bold mb-6 text-white">Join MUMBSO</h1>
          <p className="text-xl text-white/95">Become part of our biotechnology community</p>
        </div>
      </section>
      <section className="py-20 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="container max-w-4xl relative z-10">
          {/* Membership Tiers */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Membership</h2>
            {tiersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {tiers?.map((tier) => (
                  <Card
                    key={tier.id}
                    className={`p-6 cursor-pointer transition-all ${
                      selectedTier === tier.id
                        ? "ring-2 ring-primary shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => handleTierSelect(tier.id, tier.name, Number(tier.price))}
                  >
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <div className="text-3xl font-bold mb-4">
                      KES {Number(tier.price).toLocaleString()}
                      <span className="text-sm text-muted-foreground font-normal">
                        /{tier.duration_months} months
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{tier.description}</p>
                    {tier.benefits && typeof tier.benefits === 'object' && (
                      <ul className="space-y-2">
                        {Object.entries(tier.benefits as Record<string, boolean>)
                          .filter(([_, value]) => value)
                          .map(([key, _], idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                            </li>
                          ))}
                      </ul>
                    )}
                    <Button className="w-full mt-6" variant={selectedTier === tier.id ? "hero" : "outline"}>
                      Select Plan
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {paymentStep !== 'select' && (
            <div className="bg-card rounded-lg shadow-lg p-8 mt-8">
              <h2 className="text-2xl font-bold mb-6">
                {paymentStep === 'form' ? 'Your Information' : 'Complete Payment'}
              </h2>

              {paymentStep === 'payment' && selectedTierPrice ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" onClick={() => setPaymentStep('form')}>
                      ← Back
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Plan: <span className="font-semibold">{selectedTierName}</span> - {selectedTierPrice} KES
                    </p>
                  </div>
                  <MpesaPayment
                    amount={selectedTierPrice}
                    description={`MUMBSO ${selectedTierName} Membership`}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+254 700 000000"
                />
              </div>
              
              <div>
                <Label htmlFor="year">Year of Study *</Label>
                <Select
                  value={formData.year_of_study}
                  onValueChange={(value) => setFormData({ ...formData, year_of_study: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Year 1">Year 1</SelectItem>
                    <SelectItem value="Year 2">Year 2</SelectItem>
                    <SelectItem value="Year 3">Year 3</SelectItem>
                    <SelectItem value="Year 4">Year 4</SelectItem>
                    <SelectItem value="Alumni">Alumni</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="course">Course/Program *</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  required
                  placeholder="Bachelor of Medical Biotechnology"
                />
              </div>
              
              <div>
                <Label htmlFor="interests">Areas of Interest</Label>
                <Textarea
                  id="interests"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="Tell us about your interests in biotechnology..."
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={isLoading || !selectedTier} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>
              {!user && (
                <p className="text-sm text-center text-muted-foreground">
                  You'll be redirected to log in before payment
                </p>
              )}
                </form>
              )}
            </div>
          )}
          </div>

          <div className="mt-12 bg-accent/10 rounded-lg p-6">
            <h3 className="font-bold text-xl mb-4">Member Benefits</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Access to exclusive workshops and training sessions</li>
              <li>✓ Networking opportunities with industry professionals</li>
              <li>✓ Participation in research projects and conferences</li>
              <li>✓ Career development and mentorship programs</li>
              <li>✓ Community service and outreach activities</li>
              <li>✓ Access to biotechnology resources and journals</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Join;
