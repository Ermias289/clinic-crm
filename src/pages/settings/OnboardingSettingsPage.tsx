import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UserCog, Save, FileText, CheckSquare, Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const OnboardingSettingsPage = () => {
  const handleSave = () => {
    toast({ title: "Onboarding settings saved" });
  };

  return (
    <DashboardLayout title="User Onboarding" subtitle="Configure patient registration and onboarding flow">
      <div className="max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Registration Fields
            </CardTitle>
            <CardDescription>Configure which fields are required during registration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Full Name', required: true, locked: true },
              { label: 'Email Address', required: true, locked: true },
              { label: 'Phone Number', required: true, locked: false },
              { label: 'Date of Birth', required: true, locked: false },
              { label: 'Gender', required: false, locked: false },
              { label: 'Address', required: false, locked: false },
              { label: 'Emergency Contact', required: false, locked: false },
              { label: 'Insurance Information', required: false, locked: false },
            ].map((field) => (
              <div key={field.label} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-4 h-4 text-muted-foreground" />
                  <span className={field.locked ? 'text-muted-foreground' : ''}>{field.label}</span>
                  {field.locked && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">Required</span>
                  )}
                </div>
                <Switch defaultChecked={field.required} disabled={field.locked} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Welcome Message
            </CardTitle>
            <CardDescription>Customize the welcome message for new patients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Welcome Email Subject</Label>
              <Input defaultValue="Welcome to Bright Smile Dental Clinic!" />
            </div>
            <div className="space-y-2">
              <Label>Welcome Message</Label>
              <Textarea 
                rows={6}
                defaultValue="Dear {patient_name},

Welcome to Bright Smile Dental Clinic! We're delighted to have you as a new patient.

Your account has been created successfully. You can now book appointments, view your dental history, and manage your patient card through our mobile app.

If you have any questions, please don't hesitate to contact us.

Best regards,
The Bright Smile Team"
              />
              <p className="text-xs text-muted-foreground">
                Available variables: {'{patient_name}'}, {'{email}'}, {'{clinic_name}'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Onboarding Notifications
            </CardTitle>
            <CardDescription>Configure automated notifications for new patients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label>Send welcome email</Label>
                <p className="text-sm text-muted-foreground">Email sent immediately after registration</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label>Send SMS confirmation</Label>
                <p className="text-sm text-muted-foreground">SMS with registration confirmation code</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label>Notify admin on new registration</Label>
                <p className="text-sm text-muted-foreground">Send email to admin when new patient registers</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label>First appointment reminder</Label>
                <p className="text-sm text-muted-foreground">Remind patient to book their first appointment</p>
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

export default OnboardingSettingsPage;
