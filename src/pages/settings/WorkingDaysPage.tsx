import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Save } from "lucide-react";
import { WorkingDay } from "@/types/clinic";
import { toast } from "@/hooks/use-toast";

const WorkingDaysPage = () => {
  const [workingDays, setWorkingDays] = useState<WorkingDay[]>([
    { dayOfWeek: 0, dayName: "Sunday", isOpen: false, openTime: "09:00", closeTime: "17:00" },
    { dayOfWeek: 1, dayName: "Monday", isOpen: true, openTime: "08:00", closeTime: "18:00" },
    { dayOfWeek: 2, dayName: "Tuesday", isOpen: true, openTime: "08:00", closeTime: "18:00" },
    { dayOfWeek: 3, dayName: "Wednesday", isOpen: true, openTime: "08:00", closeTime: "18:00" },
    { dayOfWeek: 4, dayName: "Thursday", isOpen: true, openTime: "08:00", closeTime: "18:00" },
    { dayOfWeek: 5, dayName: "Friday", isOpen: true, openTime: "08:00", closeTime: "16:00" },
    { dayOfWeek: 6, dayName: "Saturday", isOpen: false, openTime: "08:00", closeTime: "14:00" },
  ]);

  const handleToggleDay = (dayOfWeek: number) => {
    setWorkingDays(prev => prev.map(d => 
      d.dayOfWeek === dayOfWeek ? { ...d, isOpen: !d.isOpen } : d
    ));
  };

  const handleTimeChange = (dayOfWeek: number, field: 'openTime' | 'closeTime', value: string) => {
    setWorkingDays(prev => prev.map(d => 
      d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d
    ));
  };

  const handleSave = () => {
    toast({ title: "Working hours saved", description: "Your clinic's schedule has been updated." });
  };

  return (
    <DashboardLayout title="Working Days" subtitle="Set your clinic's operating hours">
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>Configure opening and closing times for each day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workingDays.map((day) => (
              <div 
                key={day.dayOfWeek} 
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  day.isOpen ? 'bg-card' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Switch 
                    checked={day.isOpen} 
                    onCheckedChange={() => handleToggleDay(day.dayOfWeek)}
                  />
                  <div className="w-28">
                    <span className={`font-medium ${!day.isOpen ? 'text-muted-foreground' : ''}`}>
                      {day.dayName}
                    </span>
                  </div>
                </div>
                
                {day.isOpen ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-muted-foreground">Open</Label>
                      <Input 
                        type="time" 
                        value={day.openTime}
                        onChange={(e) => handleTimeChange(day.dayOfWeek, 'openTime', e.target.value)}
                        className="w-32" 
                      />
                    </div>
                    <span className="text-muted-foreground">to</span>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-muted-foreground">Close</Label>
                      <Input 
                        type="time" 
                        value={day.closeTime}
                        onChange={(e) => handleTimeChange(day.dayOfWeek, 'closeTime', e.target.value)}
                        className="w-32" 
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Closed</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Presets</CardTitle>
            <CardDescription>Apply common schedule templates</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => {
              setWorkingDays(prev => prev.map(d => ({
                ...d,
                isOpen: d.dayOfWeek >= 1 && d.dayOfWeek <= 5,
                openTime: '09:00',
                closeTime: '17:00'
              })));
            }}>
              Standard (Mon-Fri 9-5)
            </Button>
            <Button variant="outline" onClick={() => {
              setWorkingDays(prev => prev.map(d => ({
                ...d,
                isOpen: d.dayOfWeek >= 1 && d.dayOfWeek <= 6,
                openTime: '08:00',
                closeTime: d.dayOfWeek === 6 ? '14:00' : '18:00'
              })));
            }}>
              Extended (Mon-Sat)
            </Button>
            <Button variant="outline" onClick={() => {
              setWorkingDays(prev => prev.map(d => ({
                ...d,
                isOpen: true,
                openTime: d.dayOfWeek === 0 ? '10:00' : '08:00',
                closeTime: d.dayOfWeek === 0 || d.dayOfWeek === 6 ? '14:00' : '20:00'
              })));
            }}>
              7 Days (Reduced Weekend)
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="dental" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Schedule
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkingDaysPage;