import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Building, Save, Upload, Loader2, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { companySettingService, CompanySettingDTO, UpdateCompanySettingDTO } from "@/lib/api/companySettings";
import { workingDayService, WorkingDayDTO, UpdateWorkingDayDTO } from "@/lib/api/workingDays";
import { fileUploadService } from "@/lib/api/fileUpload";

const CompanySettingsPage = () => {
  const [companyData, setCompanyData] = useState<CompanySettingDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    emergencyPhoneNumber: "",
    address: "",
    city: "",
    country: "",
    subCity: "",
    prefix: "",
    locationOnMap: "",
    logo: "",
  });
  const [workdays, setWorkdays] = useState<WorkingDayDTO[]>([]);

  useEffect(() => {
    loadCompanySettings();
  }, []);

  // Get full image URL from filename (same pattern as other pages)
  const getImageUrl = (filename: string) => {
    if (!filename) return "";
    return fileUploadService.getFileUrl(filename);
  };

  const loadCompanySettings = async () => {
    try {
      setLoading(true);

      // Load company settings and workdays separately
      const [companyData, workdaysData] = await Promise.all([
        companySettingService.get(),
        workingDayService.getAll()
      ]);

      setCompanyData(companyData);
      setFormData({
        name: companyData.name || "",
        email: companyData.email || "",
        phoneNumber: companyData.phoneNumber || "",
        emergencyPhoneNumber: companyData.emergencyPhoneNumber || "",
        address: companyData.address || "",
        city: companyData.city || "",
        country: companyData.country || "",
        subCity: companyData.subCity || "",
        prefix: companyData.prefix || "",
        locationOnMap: companyData.locationOnMap || "",
        logo: companyData.logo || "",
      });

      // Initialize workdays with defaults if missing
      const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const defaultOpening = "2:00";
      const defaultClosing = "11:00";

      const existingDaysMap = new Map((workdaysData || []).map(d => [d.day, d]));

      const fullWorkdays = DAYS.map(dayName => {
        if (existingDaysMap.has(dayName)) {
          return existingDaysMap.get(dayName)!;
        }
        return {
          id: 0, // 0 indicates new record
          day: dayName,
          openingTime: defaultOpening,
          closingTime: defaultClosing,
          isWorkingDay: dayName !== "Sunday", // Open 6 days by default
          companySettingId: companyData.id
        } as WorkingDayDTO;
      });

      setWorkdays(fullWorkdays);
    } catch (error) {
      console.error("Failed to load company settings:", error);
      toast({
        title: "Error",
        description: "Failed to load company settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkdayChange = (dayName: string, field: keyof WorkingDayDTO, value: string | boolean) => {
    setWorkdays(prev => prev.map(workday =>
      workday.day === dayName
        ? { ...workday, [field]: value }
        : workday
    ));
  };

  const formatTimeForInput = (time: string) => {
    // Convert backend time format to HTML input format
    if (!time) return "";

    // Handle "2:00" format from backend - convert to "02:00" for HTML input
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${(minutes || '00').padStart(2, '0')}`;
    }

    return time;
  };

  const formatTimeForAPI = (time: string) => {
    // Convert HTML input time back to backend format
    if (!time) return "0:00";

    // Convert "02:00" back to "2:00" format (matching original API response)
    const [hours, minutes] = time.split(':');
    return `${parseInt(hours)}:${minutes || '00'}`;
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const fileName = await fileUploadService.upload(file);
      setFormData(prev => ({
        ...prev,
        logo: fileName
      }));
      toast({
        title: "Logo Uploaded",
        description: "Logo has been uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare company settings update (without workdays)
      const companyUpdateData: UpdateCompanySettingDTO = {
        id: companyData?.id || 0,
        ...formData,
      };

      // Split workdays into new (id=0) and existing
      const newWorkdays = workdays.filter(w => w.id === 0);
      const existingWorkdays = workdays.filter(w => w.id !== 0);

      // Prepare updates for existing workdays
      const workdaysUpdateData: UpdateWorkingDayDTO[] = existingWorkdays.map(workday => ({
        id: workday.id,
        day: workday.day,
        openingTime: formatTimeForAPI(workday.openingTime),
        closingTime: formatTimeForAPI(workday.closingTime),
        isWorkingDay: workday.isWorkingDay,
      }));

      // Prepare creation data for new workdays
      const workdaysCreateData = newWorkdays.map(workday => ({
        day: workday.day,
        openingTime: formatTimeForAPI(workday.openingTime),
        closingTime: formatTimeForAPI(workday.closingTime),
        isWorkingDay: workday.isWorkingDay,
      }));

      // Update company settings and workdays (update existing, create new)
      const promises: Promise<any>[] = [
        companySettingService.update(companyUpdateData)
      ];

      if (workdaysUpdateData.length > 0) {
        promises.push(workingDayService.updateMultiple(workdaysUpdateData));
      }

      if (workdaysCreateData.length > 0) {
        promises.push(workingDayService.createMultiple(workdaysCreateData));
      }

      await Promise.all(promises);

      // Reload to get new IDs
      loadCompanySettings();

      toast({
        title: "Settings Saved",
        description: "Company settings and working hours have been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to save company settings:", error);
      toast({
        title: "Error",
        description: "Failed to save company settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Company Settings" subtitle="Configure your clinic's company information">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

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
              <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30 overflow-hidden">
                {formData.logo ? (
                  <img
                    src={getImageUrl(formData.logo)}
                    alt="Company Logo"
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      // Hide image on error and show fallback
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                {!formData.logo && (
                  <Building className="w-10 h-10 text-primary/50" />
                )}
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <Button variant="outline" disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Recommended: 200x200px, PNG or JPG, Max 5MB</p>
                {formData.logo && (
                  <p className="text-xs text-success">Current: {formData.logo}</p>
                )}
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
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prefix">Company Prefix</Label>
                <Input
                  id="prefix"
                  value={formData.prefix}
                  onChange={(e) => handleInputChange("prefix", e.target.value)}
                  placeholder="e.g., BSC"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subCity">Sub City</Label>
                <Input
                  id="subCity"
                  value={formData.subCity}
                  onChange={(e) => handleInputChange("subCity", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                />
              </div>
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
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhoneNumber">Emergency Phone Number</Label>
              <Input
                id="emergencyPhoneNumber"
                value={formData.emergencyPhoneNumber}
                onChange={(e) => handleInputChange("emergencyPhoneNumber", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locationOnMap">Location on Map</Label>
              <Input
                id="locationOnMap"
                value={formData.locationOnMap}
                onChange={(e) => handleInputChange("locationOnMap", e.target.value)}
                placeholder="Google Maps URL or coordinates"
              />
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Working Hours
            </CardTitle>
            <CardDescription>Set your clinic's operating hours for each day of the week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workdays.map((workday) => (
              <div key={workday.day} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-24 font-medium">
                  {workday.day}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={workday.isWorkingDay}
                    onCheckedChange={(checked) => handleWorkdayChange(workday.day, 'isWorkingDay', checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {workday.isWorkingDay ? 'Open' : 'Closed'}
                  </span>
                </div>
                {workday.isWorkingDay && (
                  <>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`opening-${workday.day}`} className="text-sm">From:</Label>
                      <Input
                        id={`opening-${workday.day}`}
                        type="time"
                        value={formatTimeForInput(workday.openingTime)}
                        onChange={(e) => handleWorkdayChange(workday.day, 'openingTime', formatTimeForAPI(e.target.value))}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`closing-${workday.day}`} className="text-sm">To:</Label>
                      <Input
                        id={`closing-${workday.day}`}
                        type="time"
                        value={formatTimeForInput(workday.closingTime)}
                        onChange={(e) => handleWorkdayChange(workday.day, 'closingTime', formatTimeForAPI(e.target.value))}
                        className="w-32"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            variant="dental"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanySettingsPage;
