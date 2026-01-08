import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Copy, Stethoscope, Users, Heart, Briefcase, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MpesaPayment } from "@/components/MpesaPayment";
import { useState } from "react";

const Contribution = () => {
  const [selectedTierForPayment, setSelectedTierForPayment] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const donationTiers = [
    {
      name: "Friend",
      amount: "500 KES",
      description: "Monthly supporter",
      benefits: [
        "Recognition on our newsletter",
        "Tax receipt",
        "Monthly impact updates"
      ],
      icon: Heart,
      highlight: false
    },
    {
      name: "Sponsor",
      amount: "2,500 KES",
      description: "Quarterly supporter",
      benefits: [
        "All Friend benefits",
        "Sponsorship certificate",
        "Featured on website",
        "Event invitations",
        "Direct impact reports"
      ],
      icon: Briefcase,
      highlight: true
    },
    {
      name: "Partner",
      amount: "10,000 KES+",
      description: "Major supporter",
      benefits: [
        "All Sponsor benefits",
        "Custom partnership agreement",
        "Brand visibility",
        "Quarterly strategy meetings",
        "Naming rights options"
      ],
      icon: Building2,
      highlight: false
    }
  ];

  const supportWays = [
    {
      icon: Heart,
      title: "Financial Donations",
      description: "Make direct monetary contributions to support our programs"
    },
    {
      icon: BookOpen,
      title: "Sponsor a Workshop",
      description: "Fund a specific training program or research project"
    },
    {
      icon: Users,
      title: "Volunteer Your Time",
      description: "Share your expertise and mentor our students"
    },
    {
      icon: Briefcase,
      title: "Corporate Partnership",
      description: "Partner with us for mutually beneficial opportunities"
    }
  ];

  const impactStats = [
    { number: "500+", label: "Students Reached", color: "text-primary" },
    { number: "15+", label: "Research Projects", color: "text-secondary" },
    { number: "30+", label: "Workshops Conducted", color: "text-accent" },
    { number: "100%", label: "Community Impact", color: "text-primary" }
  ];

  return (
    <>
      <SEO
        title="Support MUMBSO - Make a Contribution"
        description="Support Maseno University Medical Biotechnology Students Organization (MUMBSO) through donations. Help us advance biotechnology education and research."
        keywords="donate to MUMBSO, support biotech students, contribute to MUMBSO, KCB donations, student organization support"
      />
      <div className="min-h-screen bg-background">
        <Header />

        {/* Page Header */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary via-primary/90 to-secondary" />
          <div className="container text-center relative z-10">
            <Stethoscope className="h-16 w-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 text-white">
              Support MUMBSO
            </h1>
            <p className="text-xl text-white/95 max-w-3xl mx-auto">
              Your contribution helps us empower the next generation of biotechnology professionals and advance medical research
            </p>
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">Our Impact So Far</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactStats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className={`text-5xl font-bold mb-3 ${stat.color}`}>{stat.number}</div>
                  <p className="text-lg text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Contribute Section */}
        <section className="py-20">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Why Your Support Matters</h2>
              <p className="text-lg text-muted-foreground">
                Your generous contributions enable us to continue our mission of advancing biotechnology education, research, and community health
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Student Development</h3>
                  <p className="text-muted-foreground">
                    Fund workshops, seminars, training programs, and mentorship initiatives for our members
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-secondary/10 p-3">
                    <TrendingUp className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Research Projects</h3>
                  <p className="text-muted-foreground">
                    Support groundbreaking student-led research in medical biotechnology and public health
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-accent/10 p-3">
                    <Stethoscope className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Community Outreach</h3>
                  <p className="text-muted-foreground">
                    Enable health education programs, community screenings, and capacity building initiatives
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Ways to Support Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Ways to Support MUMBSO</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                There are many ways you can make a difference in the lives of our students and communities
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportWays.map((way, idx) => {
                const IconComponent = way.icon;
                return (
                  <Card key={idx} className="hover:shadow-card transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{way.title}</h3>
                      <p className="text-sm text-muted-foreground">{way.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Donation Tiers */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Become a MUMBSO Supporter</h2>
              <p className="text-lg text-muted-foreground">
                Choose a tier that works best for you and join our mission
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {donationTiers.map((tier, idx) => {
                const TierIcon = tier.icon;
                return (
                  <Card key={idx} className={`relative transition-all ${tier.highlight ? "ring-2 ring-primary shadow-lg scale-105" : "hover:shadow-card"}`}>
                    {tier.highlight && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader className="text-center pt-8">
                      <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 mx-auto">
                        <TierIcon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">{tier.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{tier.description}</p>
                      <div className="text-3xl font-bold text-primary mt-4">{tier.amount}</div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {tier.benefits.map((benefit, bidx) => (
                          <li key={bidx} className="flex items-start gap-2 text-sm">
                            <Heart className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        variant={tier.highlight ? "hero" : "outline"} 
                        className="w-full" 
                        size="lg"
                        onClick={() => setSelectedTierForPayment(tier.name)}
                      >
                        Pay Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bank Details Card */}
        <section className="py-20 bg-muted/30">
          <div className="container max-w-4xl">
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Make a Donation</CardTitle>
                <p className="text-muted-foreground">
                  Support MUMBSO through Kenya Commercial Bank (KCB)
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
                      <p className="text-lg font-semibold">Kenya Commercial Bank (KCB)</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Business Number</p>
                      <p className="text-2xl font-bold text-primary">522522</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard("522522", "Business Number")}
                      className="ml-4"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                      <p className="text-2xl font-bold text-primary">1270503820</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard("1270503820", "Account Number")}
                      className="ml-4"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm text-center text-muted-foreground">
                    <strong>Note:</strong> Please send us an email at{" "}
                    <a href="mailto:masenomedicalbiotechnologists@gmail.com" className="text-primary hover:underline">
                      masenomedicalbiotechnologists@gmail.com
                    </a>{" "}
                    after making a donation so we can acknowledge your contribution and provide a receipt.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* M-Pesa Payment Section */}
        <section className="py-20">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Pay via M-Pesa</h2>
              <p className="text-lg text-muted-foreground">
                Quick and secure payment using M-Pesa STK Push
              </p>
            </div>

            {!selectedTierForPayment ? (
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {donationTiers.map((tier, idx) => (
                  <Card key={idx} className="hover:shadow-card transition-all cursor-pointer" onClick={() => setSelectedTierForPayment(tier.name)}>
                    <CardHeader>
                      <CardTitle className="text-center">{tier.name}</CardTitle>
                      <div className="text-2xl font-bold text-primary text-center mt-4">
                        {tier.amount.replace(' KES', '')} KES
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        Pay Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="outline" onClick={() => setSelectedTierForPayment(null)}>
                    ← Back
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Selected: <span className="font-semibold">{selectedTierForPayment}</span>
                  </p>
                </div>
                
                {selectedTierForPayment && donationTiers.find(t => t.name === selectedTierForPayment) && (
                  <MpesaPayment
                    amount={parseInt(donationTiers.find(t => t.name === selectedTierForPayment)?.amount || '0')}
                    description={`${selectedTierForPayment} Support for MUMBSO`}
                    onPaymentSuccess={() => {
                      toast.success('Thank you for your support!');
                      setSelectedTierForPayment(null);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </section>

        {/* Bank Transfer Section */}
        <section className="py-20 bg-muted/30">
          <div className="container max-w-4xl">
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Bank Transfer (Alternative)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
                      <p className="text-lg font-semibold">Kenya Commercial Bank (KCB)</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex-1">
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="container text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our community of supporters in advancing medical biotechnology education and research. Every contribution, no matter the size, makes a significant impact on our mission to empower students and improve public health in Kenya and beyond.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <a href="#support">Support MUMBSO</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/contact">Get in Touch</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Thank You Message */}
        <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
          <div className="container text-center max-w-3xl">
            <h3 className="text-2xl font-bold mb-4">Thank You for Your Support!</h3>
            <p className="text-lg text-muted-foreground">
              Your generosity helps us shape the future of healthcare in Kenya and beyond. Together, we're building a community of compassionate, skilled biotechnology professionals who will drive innovation and improve lives. With your support, we're not just changing individual lives—we're transforming the landscape of medical biotechnology in Africa.
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Contribution;
