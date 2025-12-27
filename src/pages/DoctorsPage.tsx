import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search,
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Clock,
  ClipboardList
} from "lucide-react";
import { mockDoctors, mockBranches, mockServices } from "@/data/mockData";
import { MedicalProfessional } from "@/types/clinic";

const DoctorsPage = () => {
  const [doctors] = useState<MedicalProfessional[]>(mockDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<MedicalProfessional | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const filteredDoctors = doctors.filter(doc => {
    const fullName = `${doc.firstName} ${doc.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
           doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <DashboardLayout 
      title="Medical Professionals" 
      subtitle="Manage doctors and their schedules"
      actions={
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="dental">
              <Plus className="w-4 h-4" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Doctor</DialogTitle>
              <DialogDescription>
                Register a new medical professional
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>First Name</Label>
                  <Input placeholder="John" />
                </div>
                <div className="grid gap-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Specialization</Label>
                <Input placeholder="General Dentistry" />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" placeholder="doctor@clinic.com" />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input placeholder="+1 (555) 000-0000" />
              </div>
              <div className="grid gap-2">
                <Label>License Number</Label>
                <Input placeholder="DEN-2024-001" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button variant="dental" onClick={() => setIsCreateOpen(false)}>Add Doctor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden hover:shadow-dental transition-shadow">
            <div className="h-2 bg-gradient-to-r from-primary to-dental-medium" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  </div>
                </div>
                <StatusBadge status={doctor.status} />
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{doctor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.branches.length} branch(es)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ClipboardList className="w-4 h-4" />
                  <span>{doctor.services.length} service(s)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setIsScheduleOpen(true);
                  }}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Schedule
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Doctor Details Dialog */}
      <Dialog open={!!selectedDoctor && !isScheduleOpen} onOpenChange={() => setSelectedDoctor(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Doctor Details</DialogTitle>
            <DialogDescription>
              View doctor information and assignments
            </DialogDescription>
          </DialogHeader>
          {selectedDoctor && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                  </h3>
                  <p className="text-muted-foreground">{selectedDoctor.specialization}</p>
                  <p className="text-sm text-muted-foreground">License: {selectedDoctor.licenseNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="font-medium">{selectedDoctor.email}</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <p className="font-medium">{selectedDoctor.phone}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Assigned Branches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.branches.map(branch => (
                    <span 
                      key={branch.id}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {branch.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <ClipboardList className="w-4 h-4" />
                  <span className="text-sm font-medium">Services Provided</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.services.map(service => (
                    <span 
                      key={service.id}
                      className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium"
                    >
                      {service.name}
                    </span>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedDoctor(null)}>Close</Button>
                <Button variant="dental" onClick={() => setIsScheduleOpen(true)}>
                  <Calendar className="w-4 h-4 mr-1" />
                  Manage Schedule
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={(open) => {
        setIsScheduleOpen(open);
        if (!open) setSelectedDoctor(null);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Doctor Schedule</DialogTitle>
            <DialogDescription>
              Manage working hours for Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
              <div key={day} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium">{day}</span>
                </div>
                {idx < 5 ? (
                  <div className="flex items-center gap-2">
                    <Input type="time" defaultValue="09:00" className="w-28" />
                    <span className="text-muted-foreground">to</span>
                    <Input type="time" defaultValue="17:00" className="w-28" />
                  </div>
                ) : idx === 5 ? (
                  <div className="flex items-center gap-2">
                    <Input type="time" defaultValue="09:00" className="w-28" />
                    <span className="text-muted-foreground">to</span>
                    <Input type="time" defaultValue="14:00" className="w-28" />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Closed</span>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
            <Button variant="dental" onClick={() => setIsScheduleOpen(false)}>Save Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DoctorsPage;
