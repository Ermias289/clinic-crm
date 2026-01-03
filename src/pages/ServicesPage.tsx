import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Plus,
  Search,
  Clock,
  Edit,
  Trash2,
  User,
  ClipboardList,
} from "lucide-react";

import {
  MedicalService,
  medicalServicesService,
} from "@/lib/api/medicalServices";

import {
  MedicalProfessional,
  medicalProfessionalsService,
} from "@/lib/api/medicalProfessionals";

import {
  BranchSettingDTO,
  branchService,
} from "@/lib/api/branches";

/* ======================================================= */

const ServicesPage = () => {
  /* -------------------- STATE -------------------- */
  const [services, setServices] = useState<MedicalService[]>([]);
  const [doctors, setDoctors] = useState<MedicalProfessional[]>([]);
  const [branches, setBranches] = useState<BranchSettingDTO[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] =
    useState<MedicalService | null>(null);

  /* FORM STATE */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(0);
  const [servicePicture, setServicePicture] = useState("");
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);

  /* -------------------- LOAD DATA -------------------- */
  const loadData = async () => {
    const [srv, docs, brs] = await Promise.all([
      medicalServicesService.getAll(),
      medicalProfessionalsService.getAll(),
      branchService.getAll(),
    ]);

    setServices(srv);
    setDoctors(docs);
    setBranches(brs);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* -------------------- FILTER -------------------- */
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* -------------------- HELPERS -------------------- */
  const resetForm = () => {
    setName("");
    setDescription("");
    setDuration(0);
    setServicePicture("");
    setSelectedDoctors([]);
    setSelectedBranches([]);
    setEditingService(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const openEditDialog = (service: MedicalService) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description);
    setDuration(service.durationInMinutes);
    setServicePicture(service.servicePicture ?? "");

    setSelectedDoctors(
      service.medicalProfessionals?.map((d) => d.id) ?? []
    );

    setSelectedBranches([]);


    setOpenDialog(true);
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async () => {
    const payload = {
      name,
      description,
      durationInMinutes: duration,
      servicePicture,
      medicalProfessionalsId: selectedDoctors,
      branches: selectedBranches,
    };

    if (editingService) {
      await medicalServicesService.update({
        ...payload,
        id: editingService.id,
      });
    } else {
      await medicalServicesService.create(payload);
    }

    setOpenDialog(false);
    resetForm();
    loadData();
  };

  /* -------------------- UI -------------------- */
  return (
    <DashboardLayout
      title="Medical Services"
      subtitle="Manage dental services offered at your clinic"
    >
      {/* SEARCH + ADD */}
      <Card className="mb-6">
        <CardContent className="p-4 flex gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button variant="dental" onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-1" />
            Add Service
          </Button>
        </CardContent>
      </Card>

      {/* SERVICES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="mt-2">{service.name}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {service.description}
              </p>

              <div className="flex items-center gap-2 text-sm mb-3">
                <Clock className="w-4 h-4" />
                {service.durationInMinutes} minutes
              </div>

        {/* DOCTORS */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.medicalProfessionals && service.medicalProfessionals.length > 0 ? (
            service.medicalProfessionals.map((doc) => (
              <span
                key={doc.id}
                className="px-2 py-1 bg-primary/10 rounded-full text-xs flex items-center gap-1"
              >
                <User className="w-3 h-3" />
                {doc.fName} {doc.mName ?? ""} {doc.lName}
              </span>
            ))
          ) : (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
              No doctor assigned
            </span>
          )}
        </div>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(service)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={async () => {
                    await medicalServicesService.delete(service.id);
                    loadData();
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add Service"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <label className="text-sm font-medium">Service name</label>
            <Input
              placeholder="Service name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label className="text-sm font-medium">Duration (minutes)</label>
            <Input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="no-spinner"
            />
            <label className="text-sm font-medium">Service picture</label>
            <Input
              placeholder="Service picture URL"
              value={servicePicture}
              onChange={(e) => setServicePicture(e.target.value)}
            />

            {/* DOCTORS */}
            <div>
              <p className="text-sm font-medium mb-1">Doctors</p>
              {doctors.map((doc) => (
                <label
                  key={doc.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedDoctors.includes(doc.id)}
                    onChange={(e) =>
                      setSelectedDoctors((prev) =>
                        e.target.checked
                          ? [...prev, doc.id]
                          : prev.filter((id) => id !== doc.id)
                      )
                    }
                  />
                  {doc.fName} {doc.lName}
                </label>
              ))}
            </div>

            {/* BRANCHES */}
            <div>
              <p className="text-sm font-medium mb-1">Branches</p>
              {branches.map((b) => (
                <label
                  key={b.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedBranches.includes(b.id)}
                    onChange={(e) =>
                      setSelectedBranches((prev) =>
                        e.target.checked
                          ? [...prev, b.id]
                          : prev.filter((id) => id !== b.id)
                      )
                    }
                  />
                  {b.name}
                </label>
              ))}
            </div>

            <Button className="w-full mt-4" onClick={handleSubmit}>
              {editingService ? "Update Service" : "Create Service"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ServicesPage;
