import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Save, Clock, Bell, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CardSettingsPage = () => {
  const handleSave = () => {
    toast({ title: "Settings Saved", description: "Card settings updated successfully." });
  };

  return (
    <DashboardLayout title="Card Settings" subtitle="Configure patient card options and policies">
      <div className="max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Card Generation
            </CardTitle>
            <CardDescription>Configure how patient cards are generated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Card Prefix</Label>
                <Input defaultValue="BSC" placeholder="BSC" />
                <p className="text-xs text-muted-foreground">Prefix for card reference numbers</p>
              </div>
              <div className="space-y-2">
                <Label>Number Format</Label>
                <Input defaultValue="YYYY-NNNN" placeholder="YYYY-NNNN" />
                <p className="text-xs text-muted-foreground">YYYY = Year, NNNN = Sequential number</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label>Auto-generate card on registration</Label>
                <p className="text-sm text-muted-foreground">Automatically create a pending card when patient registers</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Expiry Settings
            </CardTitle>
            <CardDescription>Configure card expiration policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Grace Period (days)</Label>
                <Input type="number" defaultValue="7" />
                <p className="text-xs text-muted-foreground">Days after expiry to allow renewal</p>
              </div>
              <div className="space-y-2">
                <Label>Reminder Before Expiry (days)</Label>
                <Input type="number" defaultValue="30" />
                <p className="text-xs text-muted-foreground">Send reminder this many days before</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label>Allow expired card benefits</Label>
                <p className="text-sm text-muted-foreground">Continue providing benefits during grace period</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure card-related notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label>Email on card activation</Label>
                <p className="text-sm text-muted-foreground">Send email when card is activated</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label>SMS expiry reminders</Label>
                <p className="text-sm text-muted-foreground">Send SMS reminders before expiry</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label>Email on payment approval</Label>
                <p className="text-sm text-muted-foreground">Notify patient when payment is approved</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Verification
            </CardTitle>
            <CardDescription>Card verification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label>Require ID verification</Label>
                <p className="text-sm text-muted-foreground">Patients must verify identity for new cards</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label>Admin approval required</Label>
                <p className="text-sm text-muted-foreground">All new cards require admin approval</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="dental" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CardSettingsPage;
