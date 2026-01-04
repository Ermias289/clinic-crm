import { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

import {
  Plus,
  Search,
  Clock,
  Edit,
  Trash2,
  User,
  ClipboardList,
  XCircle,
  Upload,
  Image as ImageIcon,
  Check,
  MapPin,
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
import apiClient from "@/lib/api/client";

interface FileUploadResponse {
  filename: string;
}

/* ======================================================= */

const ServicesPage = () => {
  /* -------------------- STATE -------------------- */
  const [services, setServices] = useState<MedicalService[]>([]);
  const [doctors, setDoctors] = useState<MedicalProfessional[]>([]);
  const [branches, setBranches] = useState<BranchSettingDTO[]>([]);
  const [serviceBranches, setServiceBranches] = useState<{[key: number]: BranchSettingDTO[]}>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<MedicalService | null>(null);
  const [editingService, setEditingService] = useState<MedicalService | null>(null);

  /* CREATE FORM STATE */
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    durationInMinutes: 0,
    servicePicture: "",
  });
  const [createSelectedDoctorIds, setCreateSelectedDoctorIds] = useState<number[]>([]);
  const [createSelectedBranchIds, setCreateSelectedBranchIds] = useState<number[]>([]);
  const [createServicePictureFile, setCreateServicePictureFile] = useState<File | null>(null);
  const [createServicePicturePreview, setCreateServicePicturePreview] = useState<string>("");
  const [isCreateUploading, setIsCreateUploading] = useState(false);

  /* EDIT FORM STATE */
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    durationInMinutes: 0,
    servicePicture: "",
  });
  const [editSelectedDoctorIds, setEditSelectedDoctorIds] = useState<number[]>([]);
  const [editSelectedBranchIds, setEditSelectedBranchIds] = useState<number[]>([]);
  const [editServicePictureFile, setEditServicePictureFile] = useState<File | null>(null);
  const [editServicePicturePreview, setEditServicePicturePreview] = useState<string>("");
  const [isEditUploading, setIsEditUploading] = useState(false);

  const createFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  /* -------------------- LOAD DATA -------------------- */
  const loadData = async () => {
    try {
      const [srv, docs, brs] = await Promise.all([
        medicalServicesService.getAll(),
        medicalProfessionalsService.getAll(),
        branchService.getAll(),
      ]);

      console.log("Services:", srv); // Debug
      console.log("Branches:", brs); // Debug

      setServices(srv);
      setDoctors(docs);
      setBranches(brs);

      // Load branches for each service
      const branchMap: {[key: number]: BranchSettingDTO[]} = {};
      for (const service of srv) {
        try {
          const serviceDetails = await medicalServicesService.getById(service.id);
          console.log(`Service ${service.id} details:`, serviceDetails); // Debug
          
          // if (serviceDetails.branches && Array.isArray(serviceDetails.branches)) {
          //   branchMap[service.id] = serviceDetails.branches.filter(b => b !== null) as BranchSettingDTO[];
          // }
        } catch (error) {
          console.error(`Error loading branches for service ${service.id}:`, error);
        }
      }
      setServiceBranches(branchMap);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Failed to load data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* -------------------- FILTER -------------------- */
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* -------------------- HELPERS -------------------- */
  const getImageUrl = (filename: string) => {
    if (!filename) return "";
    return `https://crmgate.nexabusinessgroup.com/api/FileUpload/${filename}`;
  };

  /* CREATE FORM HANDLERS */
  const resetCreateForm = () => {
    setCreateForm({
      name: "",
      description: "",
      durationInMinutes: 0,
      servicePicture: "",
    });
    setCreateSelectedDoctorIds([]);
    setCreateSelectedBranchIds([]);
    setCreateServicePictureFile(null);
    if (createServicePicturePreview) {
      URL.revokeObjectURL(createServicePicturePreview);
    }
    setCreateServicePicturePreview("");
    if (createFileInputRef.current) {
      createFileInputRef.current.value = "";
    }
  };

  /* EDIT FORM HANDLERS */
  const resetEditForm = () => {
    setEditForm({
      name: "",
      description: "",
      durationInMinutes: 0,
      servicePicture: "",
    });
    setEditSelectedDoctorIds([]);
    setEditSelectedBranchIds([]);
    setEditServicePictureFile(null);
    if (editServicePicturePreview) {
      URL.revokeObjectURL(editServicePicturePreview);
    }
    setEditServicePicturePreview("");
    setEditingService(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  const setupEditForm = async (service: MedicalService) => {
    setEditingService(service);
    setEditForm({
      name: service.name,
      description: service.description,
      durationInMinutes: service.durationInMinutes,
      servicePicture: service.servicePicture || "",
    });
    
    // Set image preview with FULL URL
    if (service.servicePicture) {
      setEditServicePicturePreview(getImageUrl(service.servicePicture));
    }
    
    // Set selected doctors
    if (service.medicalProfessionals) {
      const doctorIds = service.medicalProfessionals
        .filter(doc => doc !== null)
        .map(doc => doc!.id);
      setEditSelectedDoctorIds(doctorIds);
    }
    
    // Load branches for this service
    // try {
    //   const serviceDetails = await medicalServicesService.getById(service.id);
    //   if (serviceDetails.branches && Array.isArray(serviceDetails.branches)) {
    //     const branchIds = serviceDetails.branches
    //       .filter(branch => branch !== null)
    //       .map(branch => (branch as BranchSettingDTO).id);
    //     setEditSelectedBranchIds(branchIds);
    //   }
    // } catch (error) {
    //   console.error("Error loading service branches:", error);
    //   toast({
    //     title: "Failed to load service branches",
    //     variant: "destructive",
    //   });
    // }
    
    setOpenEdit(true);
  };

  /* DELETE CONFIRMATION */
  const confirmDelete = (service: MedicalService) => {
    setServiceToDelete(service);
    setOpenDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;
    
    try {
      await medicalServicesService.delete(serviceToDelete.id);
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      
      toast({
        title: "Service deleted",
        description: `${serviceToDelete.name} has been removed`,
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Delete failed",
        description: "Could not delete the service",
        variant: "destructive",
      });
    } finally {
      setOpenDeleteConfirm(false);
      setServiceToDelete(null);
    }
  };

  /* DOCTOR SELECTION HANDLERS */
  const handleCreateDoctorSelect = (doctorId: string) => {
    const id = parseInt(doctorId);
    if (!createSelectedDoctorIds.includes(id)) {
      setCreateSelectedDoctorIds([...createSelectedDoctorIds, id]);
    }
  };

  const removeCreateDoctor = (doctorId: number) => {
    setCreateSelectedDoctorIds(createSelectedDoctorIds.filter(id => id !== doctorId));
  };

  const handleEditDoctorSelect = (doctorId: string) => {
    const id = parseInt(doctorId);
    if (!editSelectedDoctorIds.includes(id)) {
      setEditSelectedDoctorIds([...editSelectedDoctorIds, id]);
    }
  };

  const removeEditDoctor = (doctorId: number) => {
    setEditSelectedDoctorIds(editSelectedDoctorIds.filter(id => id !== doctorId));
  };

  /* BRANCH SELECTION HANDLERS */
  const handleCreateBranchSelect = (branchId: string) => {
    const id = parseInt(branchId);
    if (!createSelectedBranchIds.includes(id)) {
      setCreateSelectedBranchIds([...createSelectedBranchIds, id]);
    }
  };

  const removeCreateBranch = (branchId: number) => {
    setCreateSelectedBranchIds(createSelectedBranchIds.filter(id => id !== branchId));
  };

  const handleEditBranchSelect = (branchId: string) => {
    const id = parseInt(branchId);
    if (!editSelectedBranchIds.includes(id)) {
      setEditSelectedBranchIds([...editSelectedBranchIds, id]);
    }
  };

  const removeEditBranch = (branchId: number) => {
    setEditSelectedBranchIds(editSelectedBranchIds.filter(id => id !== branchId));
  };

  /* IMAGE UPLOAD HANDLERS */
  const handleCreateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) { 
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setCreateServicePictureFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setCreateServicePicturePreview(previewUrl);
      
      // Upload file immediately
      uploadServicePicture(file, true);
    }
  };

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setEditServicePictureFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setEditServicePicturePreview(previewUrl);
      
      // Upload file immediately
      uploadServicePicture(file, false);
    }
  };

  const uploadServicePicture = async (file: File, isCreate: boolean) => {
    if (isCreate) {
      setIsCreateUploading(true);
    } else {
      setIsEditUploading(true);
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<FileUploadResponse>('/api/FileUpload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const filename = response.data.filename;
      
      if (isCreate) {
        setCreateForm(prev => ({ ...prev, servicePicture: filename }));
      } else {
        setEditForm(prev => ({ ...prev, servicePicture: filename }));
      }
      
      toast({
        title: "Service image uploaded",
        description: "Image successfully uploaded to server",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload service image",
        variant: "destructive",
      });
    } finally {
      if (isCreate) {
        setIsCreateUploading(false);
      } else {
        setIsEditUploading(false);
      }
    }
  };

  /* GET AVAILABLE ITEMS */
  const availableCreateDoctors = doctors.filter(
    doctor => !createSelectedDoctorIds.includes(doctor.id)
  );

  const availableEditDoctors = doctors.filter(
    doctor => !editSelectedDoctorIds.includes(doctor.id)
  );

  const availableCreateBranches = branches.filter(
    branch => !createSelectedBranchIds.includes(branch.id)
  );

  const availableEditBranches = branches.filter(
    branch => !editSelectedBranchIds.includes(branch.id)
  );

  /* FORM SUBMISSION */
  const handleCreate = async () => {
    if (!createForm.name || createForm.durationInMinutes <= 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (createSelectedBranchIds.length === 0) {
      toast({
        title: "No branches selected",
        description: "Please select at least one branch",
        variant: "destructive",
      });
      return;
    }

    try {
      const serviceData = {
        name: createForm.name,
        description: createForm.description,
        durationInMinutes: createForm.durationInMinutes,
        servicePicture: createForm.servicePicture,
        medicalProfessionalsId: createSelectedDoctorIds,
        branches: createSelectedBranchIds,
      };

      console.log("Creating service with data:", serviceData);

      const newService = await medicalServicesService.create(serviceData);

      setServices((prev) => [...prev, newService]);
      
      toast({
        title: "Service added successfully",
        description: `${createForm.name} has been added to the system`,
      });
      
      resetCreateForm();
      setOpenCreate(false);
      loadData(); // Reload data to get branches
    } catch (err: any) {
      console.error("Error adding service:", err);
      toast({
        title: "Failed to add service",
        description: err.response?.data?.message || "Please check the form and try again",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingService) return;

    if (!editForm.name || editForm.durationInMinutes <= 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editSelectedBranchIds.length === 0) {
      toast({
        title: "No branches selected",
        description: "Please select at least one branch",
        variant: "destructive",
      });
      return;
    }

    try {
      const serviceData = {
        id: editingService.id,
        name: editForm.name,
        description: editForm.description,
        durationInMinutes: editForm.durationInMinutes,
        servicePicture: editForm.servicePicture,
        medicalProfessionalsId: editSelectedDoctorIds,
        branches: editSelectedBranchIds,
      };

      console.log("Updating service with data:", serviceData);

      const updatedService = await medicalServicesService.update(serviceData);

      setServices((prev) =>
        prev.map((srv) => (srv.id === editingService.id ? updatedService : srv))
      );
      
      toast({
        title: "Service updated successfully",
        description: `${editForm.name} has been updated`,
      });
      
      resetEditForm();
      setOpenEdit(false);
      loadData(); // Reload data to get updated branches
    } catch (err: any) {
      console.error("Error updating service:", err);
      toast({
        title: "Failed to update service",
        description: err.response?.data?.message || "Please check the form and try again",
        variant: "destructive",
      });
    }
  };

  /* FORM UPDATE HELPERS */
  const updateCreateForm = (field: keyof typeof createForm, value: any) => {
    setCreateForm(prev => ({ ...prev, [field]: value }));
  };

  const updateEditForm = (field: keyof typeof editForm, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  /* -------------------- UI -------------------- */
  return (
    <DashboardLayout
      title="Medical Services"
      subtitle="Manage dental services offered at your clinic"
      actions={
        <Dialog open={openCreate} onOpenChange={(open) => {
          if (!open) {
            resetCreateForm();
          }
          setOpenCreate(open);
        }}>
          <DialogTrigger asChild>
            <Button variant="dental">
              <Plus className="w-4 h-4 mr-1" /> Add Service
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="py-3">Add New Medical Service</DialogTitle>
            </DialogHeader>

            <div className="p-6 space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-name">Service Name *</Label>
                    <Input
                      id="create-name"
                      value={createForm.name}
                      onChange={(e) => updateCreateForm("name", e.target.value)}
                      placeholder="e.g., Dental Cleaning"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-duration">Duration (minutes) *</Label>
                    <Input
                      id="create-duration"
                      type="number"
                      min="1"
                      value={createForm.durationInMinutes}
                      onChange={(e) => updateCreateForm("durationInMinutes", e.target.value ? parseInt(e.target.value) : 0)}
                      placeholder="30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-description">Description</Label>
                  <Input
                    id="create-description"
                    value={createForm.description}
                    onChange={(e) => updateCreateForm("description", e.target.value)}
                    placeholder="Brief description of the service..."
                  />
                </div>
              </div>

              {/* Doctors Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Assigned Doctors</h3>
                <div className="space-y-2">
                  <Label>Select Doctors</Label>
                  <Select onValueChange={handleCreateDoctorSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose doctors..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCreateDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          Dr. {doctor.fName} {doctor.lName} - {doctor.specialty || "General"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {createSelectedDoctorIds.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Doctors</Label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                      {createSelectedDoctorIds.map((doctorId) => {
                        const doctor = doctors.find(d => d.id === doctorId);
                        return doctor ? (
                          <Badge
                            key={doctor.id}
                            variant="secondary"
                            className="px-3 py-1.5 flex items-center gap-2"
                          >
                            <User className="w-3 h-3" />
                            Dr. {doctor.fName} {doctor.lName}
                            <XCircle
                              className="w-3 h-3 cursor-pointer hover:text-destructive"
                              onClick={() => removeCreateDoctor(doctor.id)}
                            />
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Branches Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Available Branches *</h3>
                <div className="space-y-2">
                  <Label>Select Branches (At least one required)</Label>
                  <Select onValueChange={handleCreateBranchSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose branches..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCreateBranches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.name} - {branch.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {createSelectedBranchIds.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Branches</Label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                      {createSelectedBranchIds.map((branchId) => {
                        const branch = branches.find(b => b.id === branchId);
                        return branch ? (
                          <Badge
                            key={branch.id}
                            variant="secondary"
                            className="px-3 py-1.5 flex items-center gap-2"
                          >
                            <MapPin className="w-3 h-3" />
                            {branch.name}
                            <XCircle
                              className="w-3 h-3 cursor-pointer hover:text-destructive"
                              onClick={() => removeCreateBranch(branch.id)}
                            />
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Service Image Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Image</h3>
                <div className="flex items-start gap-6">
                  {/* Image Preview */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                      {createServicePicturePreview ? (
                        <img 
                          src={createServicePicturePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><ImageIcon class="w-8 h-8 text-muted-foreground" /></div>';
                            }
                          }}
                        />
                      ) : createForm.servicePicture ? (
                        <img 
                          src={getImageUrl(createForm.servicePicture)} 
                          alt="Service" 
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><ImageIcon class="w-8 h-8 text-muted-foreground" /></div>';
                            }
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {createServicePictureFile ? createServicePictureFile.name : "No image selected"}
                    </span>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label>Upload Service Image</Label>
                      <Input
                        ref={createFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCreateFileSelect}
                        className="hidden"
                        id="create-service-image-upload"
                      />
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => createFileInputRef.current?.click()}
                          disabled={isCreateUploading}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {isCreateUploading ? "Uploading..." : "Choose Image"}
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          JPG, PNG up to 5MB
                        </span>
                      </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="space-y-2">
                      {isCreateUploading && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <div className="w-3 h-3 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
                          Uploading image to server...
                        </div>
                      )}
                      {createForm.servicePicture && !isCreateUploading && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="w-4 h-4" />
                          Image uploaded successfully
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  resetCreateForm();
                  setOpenCreate(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="dental"
                onClick={handleCreate}
                disabled={isCreateUploading || !createForm.name || createForm.durationInMinutes <= 0 || createSelectedBranchIds.length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isCreateUploading ? "Uploading..." : "Add Service"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
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
        </CardContent>
      </Card>

      {/* SERVICES GRID - FIXED EQUAL SIZE BOXES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
            {/* IMAGE AT THE TOP */}
            <div className="w-full h-48 bg-muted">
              {service.servicePicture ? (
                <img 
                  src={getImageUrl(service.servicePicture)} 
                  alt={service.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-primary/10"><ClipboardList class="w-12 h-12 text-primary/50" /></div>';
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <ClipboardList className="w-12 h-12 text-primary/50" />
                </div>
              )}
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{service.name}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {service.description || "No description provided"}
                </p>

                <div className="flex items-center gap-2 text-sm mb-4">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{service.durationInMinutes} minutes</span>
                </div>

                {/* BRANCHES - Display branches */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Available at:</span>
                  </div>
                  {serviceBranches[service.id] && serviceBranches[service.id].length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {serviceBranches[service.id].slice(0, 2).map((branch) => (
                        <span
                          key={branch.id}
                          className="px-2 py-1 bg-secondary/20 rounded-full text-xs"
                        >
                          {branch.name}
                        </span>
                      ))}
                      {serviceBranches[service.id].length > 2 && (
                        <span className="px-2 py-1 bg-secondary/20 rounded-full text-xs">
                          +{serviceBranches[service.id].length - 2} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-red-500">
                      No branches assigned
                    </span>
                  )}
                </div>

                {/* DOCTORS */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Doctors:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {service.medicalProfessionals && service.medicalProfessionals.length > 0 ? (
                      service.medicalProfessionals.slice(0, 2).map((doc) => (
                        doc && (
                          <span
                            key={doc.id}
                            className="px-2 py-1 bg-primary/10 rounded-full text-xs flex items-center gap-1"
                          >
                            Dr. {doc.fName} {doc.lName}
                          </span>
                        )
                      ))
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        No doctor assigned
                      </span>
                    )}
                    {service.medicalProfessionals && service.medicalProfessionals.length > 2 && (
                      <span className="px-2 py-1 bg-primary/10 rounded-full text-xs">
                        +{service.medicalProfessionals.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-4 border-t mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setupEditForm(service)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => confirmDelete(service)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={openDeleteConfirm} onOpenChange={setOpenDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{serviceToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={openEdit} onOpenChange={(open) => {
        if (!open) {
          resetEditForm();
        }
        setOpenEdit(open);
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="py-3">
              Edit Medical Service - {editForm.name}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Service Name *</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) => updateEditForm("name", e.target.value)}
                    placeholder="e.g., Dental Cleaning"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration (minutes) *</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    min="1"
                    value={editForm.durationInMinutes}
                    onChange={(e) => updateEditForm("durationInMinutes", e.target.value ? parseInt(e.target.value) : 0)}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => updateEditForm("description", e.target.value)}
                  placeholder="Brief description of the service..."
                />
              </div>
            </div>

            {/* Doctors Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assigned Doctors</h3>
              <div className="space-y-2">
                <Label>Select Doctors</Label>
                <Select onValueChange={handleEditDoctorSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose doctors..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEditDoctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        Dr. {doctor.fName} {doctor.lName} - {doctor.specialty || "General"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editSelectedDoctorIds.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Doctors</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                    {editSelectedDoctorIds.map((doctorId) => {
                      const doctor = doctors.find(d => d.id === doctorId);
                      return doctor ? (
                        <Badge
                          key={doctor.id}
                          variant="secondary"
                          className="px-3 py-1.5 flex items-center gap-2"
                        >
                          <User className="w-3 h-3" />
                          Dr. {doctor.fName} {doctor.lName}
                          <XCircle
                            className="w-3 h-3 cursor-pointer hover:text-destructive"
                            onClick={() => removeEditDoctor(doctor.id)}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Branches Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Branches *</h3>
              <div className="space-y-2">
                <Label>Select Branches (At least one required)</Label>
                <Select onValueChange={handleEditBranchSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose branches..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEditBranches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name} - {branch.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editSelectedBranchIds.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Branches</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                    {editSelectedBranchIds.map((branchId) => {
                      const branch = branches.find(b => b.id === branchId);
                      return branch ? (
                        <Badge
                          key={branch.id}
                          variant="secondary"
                          className="px-3 py-1.5 flex items-center gap-2"
                        >
                          <MapPin className="w-3 h-3" />
                          {branch.name}
                          <XCircle
                            className="w-3 h-3 cursor-pointer hover:text-destructive"
                            onClick={() => removeEditBranch(branch.id)}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Service Image Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Service Image</h3>
              <div className="flex items-start gap-6">
                {/* Image Preview */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                    {editServicePicturePreview ? (
                      <img 
                        src={editServicePicturePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><ImageIcon class="w-8 h-8 text-muted-foreground" /></div>';
                          }
                        }}
                      />
                    ) : editForm.servicePicture ? (
                      <img 
                        src={getImageUrl(editForm.servicePicture)} 
                        alt="Service" 
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><ImageIcon class="w-8 h-8 text-muted-foreground" /></div>';
                          }
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {editServicePictureFile ? editServicePictureFile.name : "Current image"}
                  </span>
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label>Change Service Image</Label>
                    <Input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileSelect}
                      className="hidden"
                      id="edit-service-image-upload"
                    />
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => editFileInputRef.current?.click()}
                        disabled={isEditUploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isEditUploading ? "Uploading..." : "Change Image"}
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        JPG, PNG up to 5MB
                      </span>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="space-y-2">
                    {isEditUploading && (
                      <div className="flex items-center gap-2 text-amber-600">
                        <div className="w-3 h-3 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
                        Uploading image to server...
                      </div>
                    )}
                    {editForm.servicePicture && !isEditUploading && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-4 h-4" />
                        Image uploaded successfully
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                resetEditForm();
                setOpenEdit(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="dental"
              onClick={handleUpdate}
              disabled={isEditUploading || !editForm.name || editForm.durationInMinutes <= 0 || editSelectedBranchIds.length === 0}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditUploading ? "Uploading..." : "Update Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ServicesPage;