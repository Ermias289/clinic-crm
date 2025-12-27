import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Save, Upload } from "lucide-react";
import { mockCompany } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const CompanySettingsPage = () => {
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Company settings have been updated successfully.",
    });
  };

  return (
    <DashboardLayout title="Company Settings" subtitle="Configure your clinic's company information">
      <div className="max-w-4xl space-y-6">
        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Company Logo
            </CardTitle>
            <CardDescription>Upload your clinic's logo for branding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30">
                <Building className="w-10 h-10 text-primary/50" />
              </div>
              <div className="space-y-2">
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground">Recommended: 200x200px, PNG or JPG</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your company's core details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" defaultValue={mockCompany.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / Registration Number</Label>
                <Input id="taxId" defaultValue={mockCompany.taxId} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" defaultValue={mockCompany.address} rows={2} />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How patients and partners can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={mockCompany.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue={mockCompany.phone} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" defaultValue={mockCompany.website} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="dental" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanySettingsPage;
