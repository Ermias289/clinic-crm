import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Trash2 } from "lucide-react";

import {
  MedicalProfessional,
  medicalProfessionalsService,
} from "@/lib/api/medicalProfessionals";
import { toast } from "@/hooks/use-toast";


const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<MedicalProfessional[]>([]);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const [fName, setFName] = useState("");
  const [mName, setMName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [educationalBackground, setEducationalBackground] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [status, setStatus] = useState("Active");
  const [profilePicture, setProfilePicture] = useState("");
  const [requiresUserAccount, setRequiresUserAccount] = useState(true);
  const [medicalServicesIds, setMedicalServicesIds] = useState("");
  const [branchIds, setBranchIds] = useState("");


  useEffect(() => {
    medicalProfessionalsService.getAll().then(setDoctors);
  }, []);

  const filteredDoctors = doctors.filter((d) =>
    `${d.fName} ${d.lName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Medical Professionals"
      subtitle="Manage doctors"
      actions={
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button variant="dental">
              <Plus className="w-4 h-4 mr-1" /> Add Doctor
            </Button>
          </DialogTrigger>

          <DialogContent   className="
    max-w-4xl w-full
    rounded-xl
    p-0
    overflow-hidden
  ">

<div className="max-h-[85vh] overflow-y-auto p-6">
    <DialogHeader>
              <DialogTitle className="py-3">Add Doctor</DialogTitle>
            </DialogHeader>

            <div className="grid gap-3">
              <Label>First Name</Label>
              <Input value={fName} onChange={(e) => setFName(e.target.value)} />

              <Label>Middle Name</Label>
              <Input value={mName} onChange={(e) => setMName(e.target.value)} />

              <Label>Last Name</Label>
              <Input value={lName} onChange={(e) => setLName(e.target.value)} />

              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />

              <Label>Phone Number</Label>
              <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

              <Label>Job Title</Label>
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />

              <Label>Specialty</Label>
              <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} />

              <Label>License Number</Label>
              <Input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />

              <Label>Educational Background</Label>
              <Input value={educationalBackground} onChange={(e) => setEducationalBackground(e.target.value)} />

              <Label>Years of Experience</Label>
              <Input
                type="number"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
              />

              <Label>Status</Label>
              <Input value={status} onChange={(e) => setStatus(e.target.value)} />

              <Label>Profile Picture URL</Label>
              <Input value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={requiresUserAccount}
                  onChange={(e) => setRequiresUserAccount(e.target.checked)}
                />
                <Label>Requires User Account</Label>
              </div>

              <Label>Medical Services IDs (comma-separated)</Label>
              <Input
                value={medicalServicesIds}
                onChange={(e) => setMedicalServicesIds(e.target.value)}
                placeholder="e.g. 1,2,3"
              />

              <Label>Branch IDs (comma-separated)</Label>
              <Input
                value={branchIds}
                onChange={(e) => setBranchIds(e.target.value)}
                placeholder="e.g. 1,2"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancel</Button>
              <Button
                variant="dental"
                onClick={async () => {
                  try {
                    const newDoctor = await medicalProfessionalsService.create({
                      fName,
                      mName,
                      lName,
                      email,
                      phoneNumber,
                      jobTitle,
                      specialty,
                      licenseNumber,
                      educationalBackground,
                      yearsOfExperience,
                      status,
                      profilePicture,
                      requiresUserAccount,
                      medicalServicesId: medicalServicesIds.split(",").map((s) => Number(s.trim())),
                      branches: branchIds.split(",").map((s) => Number(s.trim())),
                    });
                    setDoctors((prev) => [...prev, newDoctor]);
                    toast({ title: "Doctor added successfully" });
                    setOpenCreate(false);
                  } catch (err) {
                    toast({ title: "Failed to add doctor", variant: "destructive" });
                  }
                }}
              >
                Save
              </Button>
            </DialogFooter>
  </div>
          </DialogContent>
        </Dialog>
      }
    >
      {/* SEARCH */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-6 space-y-2">
              <h3 className="font-semibold">
                Dr. {doc.fName} {doc.mName} {doc.lName}
              </h3>
              <p className="text-sm text-muted-foreground">{doc.specialty}</p>
              <StatusBadge status={doc.status} />

              <Button
                variant="ghost"
                className="text-destructive"
                onClick={() => {
                  medicalProfessionalsService
                    .delete(doc.id)
                    .then(() =>
                      setDoctors((prev) =>
                        prev.filter((d) => d.id !== doc.id)
                      )
                    );
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DoctorsPage;
