import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building, CreditCard, Users, Clock, Building2, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { mockCompany, mockWorkingDays } from "@/data/mockData";

const settingsCards = [
  { title: "Company Settings", description: "Configure company information", icon: Building, href: "/settings/company" },
  { title: "Branch Settings", description: "Manage clinic branches", icon: Building2, href: "/settings/branches" },
  { title: "Card Settings", description: "Configure card options", icon: CreditCard, href: "/settings/cards" },
  { title: "Card Types", description: "Manage membership tiers", icon: CreditCard, href: "/settings/card-types" },
  { title: "User Onboarding", description: "Setup patient onboarding", icon: Users, href: "/settings/onboarding" },
  { title: "Working Days", description: "Set business hours", icon: Clock, href: "/settings/working-days" },
];

const SettingsPage = () => {
  return (
    <DashboardLayout title="Settings" subtitle="Manage your clinic configuration">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {settingsCards.map((card) => (
          <Link key={card.href} to={card.href}>
            <Card className="h-full hover:shadow-dental transition-all hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5" /> Company Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2"><Label>Company Name</Label><Input defaultValue={mockCompany.name} /></div>
            <div className="grid gap-2"><Label>Email</Label><Input defaultValue={mockCompany.email} /></div>
            <div className="grid gap-2"><Label>Phone</Label><Input defaultValue={mockCompany.phone} /></div>
            <Button variant="dental">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Working Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockWorkingDays.map((day) => (
                <div key={day.dayOfWeek} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <Switch checked={day.isOpen} />
                    <span className="font-medium w-24">{day.dayName}</span>
                  </div>
                  {day.isOpen ? (
                    <span className="text-sm text-muted-foreground">{day.openTime} - {day.closeTime}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
