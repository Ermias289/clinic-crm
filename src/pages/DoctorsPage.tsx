import { useEffect, useState, useRef } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Trash2,
  Upload,
  User,
  Check,
  XCircle,
  Pencil,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  MedicalProfessional,
  medicalProfessionalsService,
} from "@/lib/api/medicalProfessionals";
import { toast } from "@/hooks/use-toast";
import { medicalServicesService, MedicalService } from "@/lib/api/medicalServices";
import { branchService, BranchSettingDTO } from "@/lib/api/branches";
import { fileUploadService } from "@/lib/api/fileUpload";

interface MedicalServiceWithName {
  id: number;
  name: string;
}

interface BranchWithName {
  id: number;
  name: string;
  location?: string;
}

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<MedicalProfessional[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [branches, setBranches] = useState<BranchSettingDTO[]>([]);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<MedicalProfessional | null>(null);

  // Delete confirmation state
  const [doctorToDelete, setDoctorToDelete] = useState<MedicalProfessional | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Create form states
  const [createForm, setCreateForm] = useState({
    fName: "",
    mName: "",
    lName: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    specialty: "",
    licenseNumber: "",
    educationalBackground: "",
    yearsOfExperience: "" as number | "",
    status: "Active",
    profilePicture: "",
    requiresUserAccount: true,
  });
  const [createSelectedServiceIds, setCreateSelectedServiceIds] = useState<number[]>([]);
  const [createSelectedBranchIds, setCreateSelectedBranchIds] = useState<number[]>([]);
  const [createProfilePictureFile, setCreateProfilePictureFile] = useState<File | null>(null);
  const [createProfilePicturePreview, setCreateProfilePicturePreview] = useState<string>("");
  const [isCreateUploading, setIsCreateUploading] = useState(false);

  // Edit form states
  const [editForm, setEditForm] = useState({
    fName: "",
    mName: "",
    lName: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    specialty: "",
    licenseNumber: "",
    educationalBackground: "",
    yearsOfExperience: "" as number | "",
    status: "Active",
    profilePicture: "",
    requiresUserAccount: true,
  });
  const [editSelectedServiceIds, setEditSelectedServiceIds] = useState<number[]>([]);
  const [editSelectedBranchIds, setEditSelectedBranchIds] = useState<number[]>([]);
  const [editProfilePictureFile, setEditProfilePictureFile] = useState<File | null>(null);
  const [editProfilePicturePreview, setEditProfilePicturePreview] = useState<string>("");
  const [isEditUploading, setIsEditUploading] = useState(false);

  const createFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorsData, servicesData, branchesData] = await Promise.all([
        medicalProfessionalsService.getAll(),
        medicalServicesService.getAll(),
        branchService.getAll(),
      ]);
      setDoctors(doctorsData);
      setServices(servicesData);
      setBranches(branchesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Failed to load data",
        variant: "destructive",
      });
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    `${d.fName} ${d.lName}`.toLowerCase().includes(search.toLowerCase())
  );

  // Handle file selection for create dialog
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

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setCreateProfilePictureFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setCreateProfilePicturePreview(previewUrl);
      
      // Upload file immediately
      uploadProfilePicture(file, true);
    }
  };

  // Handle file selection for edit dialog
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

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setEditProfilePictureFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setEditProfilePicturePreview(previewUrl);
      
      // Upload file immediately
      uploadProfilePicture(file, false);
    }
  };

  // Upload profile picture to server
  const uploadProfilePicture = async (file: File, isCreate: boolean) => {
    if (isCreate) {
      setIsCreateUploading(true);
    } else {
      setIsEditUploading(true);
    }
    
    try {
      const fileName = await fileUploadService.upload(file);
      
      if (isCreate) {
        setCreateForm(prev => ({ ...prev, profilePicture: fileName }));
      } else {
        setEditForm(prev => ({ ...prev, profilePicture: fileName }));
      }
      
      toast({
        title: "Profile picture uploaded",
        description: "Image successfully uploaded to server",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload profile picture",
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

  // Handle service selection for create dialog
  const handleCreateServiceSelect = (serviceId: string) => {
    const id = parseInt(serviceId);
    if (!createSelectedServiceIds.includes(id)) {
      setCreateSelectedServiceIds([...createSelectedServiceIds, id]);
    }
  };

  const removeCreateService = (serviceId: number) => {
    setCreateSelectedServiceIds(createSelectedServiceIds.filter(id => id !== serviceId));
  };

  // Handle service selection for edit dialog
  const handleEditServiceSelect = (serviceId: string) => {
    const id = parseInt(serviceId);
    if (!editSelectedServiceIds.includes(id)) {
      setEditSelectedServiceIds([...editSelectedServiceIds, id]);
    }
  };

  const removeEditService = (serviceId: number) => {
    setEditSelectedServiceIds(editSelectedServiceIds.filter(id => id !== serviceId));
  };

  // Handle branch selection for create dialog
  const handleCreateBranchSelect = (branchId: string) => {
    const id = parseInt(branchId);
    if (!createSelectedBranchIds.includes(id)) {
      setCreateSelectedBranchIds([...createSelectedBranchIds, id]);
    }
  };

  const removeCreateBranch = (branchId: number) => {
    setCreateSelectedBranchIds(createSelectedBranchIds.filter(id => id !== branchId));
  };

  // Handle branch selection for edit dialog
  const handleEditBranchSelect = (branchId: string) => {
    const id = parseInt(branchId);
    if (!editSelectedBranchIds.includes(id)) {
      setEditSelectedBranchIds([...editSelectedBranchIds, id]);
    }
  };

  const removeEditBranch = (branchId: number) => {
    setEditSelectedBranchIds(editSelectedBranchIds.filter(id => id !== branchId));
  };

  // Get available services for create dialog
  const availableCreateServices = services.filter(
    service => !createSelectedServiceIds.includes(service.id)
  );

  // Get available services for edit dialog
  const availableEditServices = services.filter(
    service => !editSelectedServiceIds.includes(service.id)
  );

  // Get available branches for create dialog
  const availableCreateBranches = branches.filter(
    branch => !createSelectedBranchIds.includes(branch.id)
  );

  // Get available branches for edit dialog
  const availableEditBranches = branches.filter(
    branch => !editSelectedBranchIds.includes(branch.id)
  );

  // Reset create form
  const resetCreateForm = () => {
    setCreateForm({
      fName: "",
      mName: "",
      lName: "",
      email: "",
      phoneNumber: "",
      jobTitle: "",
      specialty: "",
      licenseNumber: "",
      educationalBackground: "",
      yearsOfExperience: "",
      status: "Active",
      profilePicture: "",
      requiresUserAccount: true,
    });
    setCreateSelectedServiceIds([]);
    setCreateSelectedBranchIds([]);
    setCreateProfilePictureFile(null);
    if (createProfilePicturePreview) {
      URL.revokeObjectURL(createProfilePicturePreview);
    }
    setCreateProfilePicturePreview("");
    if (createFileInputRef.current) {
      createFileInputRef.current.value = "";
    }
  };

  // Reset edit form
  const resetEditForm = () => {
    setEditForm({
      fName: "",
      mName: "",
      lName: "",
      email: "",
      phoneNumber: "",
      jobTitle: "",
      specialty: "",
      licenseNumber: "",
      educationalBackground: "",
      yearsOfExperience: "",
      status: "Active",
      profilePicture: "",
      requiresUserAccount: true,
    });
    setEditSelectedServiceIds([]);
    setEditSelectedBranchIds([]);
    setEditProfilePictureFile(null);
    if (editProfilePicturePreview) {
      URL.revokeObjectURL(editProfilePicturePreview);
    }
    setEditProfilePicturePreview("");
    setEditingDoctor(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  // Setup edit form with doctor data
  const setupEditForm = (doctor: MedicalProfessional) => {
    setEditingDoctor(doctor);
    setEditForm({
      fName: doctor.fName,
      mName: doctor.mName || "",
      lName: doctor.lName,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber || "",
      jobTitle: doctor.jobTitle || "",
      specialty: doctor.specialty || "",
      licenseNumber: doctor.licenseNumber || "",
      educationalBackground: doctor.educationalBackground || "",
      yearsOfExperience: doctor.yearsOfExperience || "",
      status: doctor.status || "Active",
      profilePicture: doctor.profilePicture || "",
      requiresUserAccount: doctor.requiresUserAccount !== false,
    });
    
    if (doctor.profilePicture) {
      setEditProfilePicturePreview(getImageUrl(doctor.profilePicture));
    }
    
    // Set selected services
    if (doctor.medicalServices) {
      const serviceIds = doctor.medicalServices.map(service => 
        typeof service === 'object' ? service.id : parseInt(service as string)
      ).filter(id => !isNaN(id));
      setEditSelectedServiceIds(serviceIds);
    }
    
    // Set selected branches
    if (doctor.branches) {
      const branchIds = doctor.branches.map(branch => 
        typeof branch === 'object' ? branch.id : parseInt(branch as string)
      ).filter(id => !isNaN(id));
      setEditSelectedBranchIds(branchIds);
    }
    
    setOpenEdit(true);
  };

  // Handle create save
  const handleSave = async () => {
    // Validate required fields
    if (!createForm.fName || !createForm.lName || !createForm.email || !createForm.phoneNumber) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (createSelectedServiceIds.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one medical service",
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
      const newDoctor = await medicalProfessionalsService.create({
        fName: createForm.fName,
        mName: createForm.mName,
        lName: createForm.lName,
        email: createForm.email,
        phoneNumber: createForm.phoneNumber,
        jobTitle: createForm.jobTitle,
        specialty: createForm.specialty,
        licenseNumber: createForm.licenseNumber,
        educationalBackground: createForm.educationalBackground,
        yearsOfExperience: createForm.yearsOfExperience === "" ? 0 : Number(createForm.yearsOfExperience),
        status: createForm.status,
        profilePicture: createForm.profilePicture,
        requiresUserAccount: createForm.requiresUserAccount,
        medicalServicesId: createSelectedServiceIds,
        branches: createSelectedBranchIds,
      });

      setDoctors((prev) => [...prev, newDoctor]);
      
      toast({
        title: "Doctor added successfully",
        description: `${createForm.fName} ${createForm.lName} has been added to the system`,
      });
      
      resetCreateForm();
      setOpenCreate(false);
    } catch (err: any) {
      console.error("Error adding doctor:", err);
      toast({
        title: "Failed to add doctor",
        description: err.response?.data?.message || "Please check the form and try again",
        variant: "destructive",
      });
    }
  };

  // Handle update save
  const handleUpdate = async () => {
    if (!editingDoctor) return;

    // Validate required fields
    if (!editForm.fName || !editForm.lName || !editForm.email || !editForm.phoneNumber) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editSelectedServiceIds.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one medical service",
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
      const updatedDoctor = await medicalProfessionalsService.update({
        id: editingDoctor.id,
        fName: editForm.fName,
        mName: editForm.mName,
        lName: editForm.lName,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        jobTitle: editForm.jobTitle,
        specialty: editForm.specialty,
        licenseNumber: editForm.licenseNumber,
        educationalBackground: editForm.educationalBackground,
        yearsOfExperience: editForm.yearsOfExperience === "" ? 0 : Number(editForm.yearsOfExperience),
        status: editForm.status,
        profilePicture: editForm.profilePicture,
        requiresUserAccount: editForm.requiresUserAccount,
        medicalServicesId: editSelectedServiceIds,
        branches: editSelectedBranchIds,
      });

      setDoctors((prev) =>
        prev.map((doc) => (doc.id === editingDoctor.id ? updatedDoctor : doc))
      );
      
      toast({
        title: "Doctor updated successfully",
        description: `${editForm.fName} ${editForm.lName} has been updated`,
      });
      
      resetEditForm();
      setOpenEdit(false);
    } catch (err: any) {
      console.error("Error updating doctor:", err);
      toast({
        title: "Failed to update doctor",
        description: err.response?.data?.message || "Please check the form and try again",
        variant: "destructive",
      });
    }
  };

  // Get initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get full image URL from filename
  const getImageUrl = (filename: string) => {
    if (!filename) return "";
    return fileUploadService.getFileUrl(filename);
  };

  // Handle delete confirmation
  const handleDeleteClick = (doctor: MedicalProfessional) => {
    setDoctorToDelete(doctor);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!doctorToDelete) return;

    try {
      await medicalProfessionalsService.delete(doctorToDelete.id);
      setDoctors((prev) => prev.filter((d) => d.id !== doctorToDelete.id));
      
      toast({
        title: "Doctor deleted",
        description: `${doctorToDelete.fName} ${doctorToDelete.lName} has been removed`,
      });
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast({
        title: "Delete failed",
        description: "Could not delete the doctor",
        variant: "destructive",
      });
    } finally {
      setDoctorToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  // Handle edit click
  const handleEditClick = (doctor: MedicalProfessional) => {
    setupEditForm(doctor);
  };

  // Helper function to get service name safely
  const getServiceName = (service: MedicalServiceWithName | string | any): string => {
    if (typeof service === 'object' && service !== null && 'name' in service) {
      return service.name;
    }
    if (typeof service === 'string') {
      return service;
    }
    return "Unknown Service";
  };

  // Update create form field
  const updateCreateForm = (field: keyof typeof createForm, value: any) => {
    setCreateForm(prev => ({ ...prev, [field]: value }));
  };

  // Update edit form field
  const updateEditForm = (field: keyof typeof editForm, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout
      title="Medical Professionals"
      subtitle="Manage doctors"
      actions={
        <Dialog open={openCreate} onOpenChange={(open) => {
          if (!open) {
            resetCreateForm();
          }
          setOpenCreate(open);
        }}>
          <DialogTrigger asChild>
            <Button variant="dental">
              <Plus className="w-4 h-4 mr-1" /> Add Doctor
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="py-3">Add New Medical Professional</DialogTitle>
            </DialogHeader>

            <div className="p-6 space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fName">First Name *</Label>
                    <Input
                      id="fName"
                      value={createForm.fName}
                      onChange={(e) => updateCreateForm("fName", e.target.value)}
                      placeholder="John"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mName">Middle Name</Label>
                    <Input
                      id="mName"
                      value={createForm.mName}
                      onChange={(e) => updateCreateForm("mName", e.target.value)}
                      placeholder="Michael"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lName">Last Name *</Label>
                    <Input
                      id="lName"
                      value={createForm.lName}
                      onChange={(e) => updateCreateForm("lName", e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={createForm.email}
                      onChange={(e) => updateCreateForm("email", e.target.value)}
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      value={createForm.phoneNumber}
                      onChange={(e) => updateCreateForm("phoneNumber", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={createForm.jobTitle}
                      onChange={(e) => updateCreateForm("jobTitle", e.target.value)}
                      placeholder="Senior Dentist"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                      id="specialty"
                      value={createForm.specialty}
                      onChange={(e) => updateCreateForm("specialty", e.target.value)}
                      placeholder="Orthodontics"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={createForm.licenseNumber}
                      onChange={(e) => updateCreateForm("licenseNumber", e.target.value)}
                      placeholder="MED123456"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="educationalBackground">Educational Background</Label>
                    <Input
                      id="educationalBackground"
                      value={createForm.educationalBackground}
                      onChange={(e) => updateCreateForm("educationalBackground", e.target.value)}
                      placeholder="Harvard Medical School"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      max="50"
                      value={createForm.yearsOfExperience}
                      onChange={(e) => updateCreateForm("yearsOfExperience", e.target.value ? parseInt(e.target.value) : "")}
                      placeholder="10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={createForm.status} 
                      onValueChange={(value) => updateCreateForm("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Medical Services Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Medical Services *</h3>
                <div className="space-y-2">
                  <Label>Select Services</Label>
                  <Select onValueChange={handleCreateServiceSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose services..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCreateServices.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {createSelectedServiceIds.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Services</Label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                      {createSelectedServiceIds.map((serviceId) => {
                        const service = services.find(s => s.id === serviceId);
                        return service ? (
                          <Badge
                            key={service.id}
                            variant="secondary"
                            className="px-3 py-1.5 flex items-center gap-2"
                          >
                            {service.name}
                            <XCircle
                              className="w-3 h-3 cursor-pointer hover:text-destructive"
                              onClick={() => removeCreateService(service.id)}
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
                <h3 className="text-lg font-semibold">Branches *</h3>
                <div className="space-y-2">
                  <Label>Select Branches</Label>
                  <Select onValueChange={handleCreateBranchSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose branches..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCreateBranches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.name}
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

              {/* Profile Picture Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile Picture</h3>
                <div className="flex items-start gap-6">
                  {/* Avatar Preview */}
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="w-24 h-24 border-2">
                      {createProfilePicturePreview ? (
                        <AvatarImage src={createProfilePicturePreview} alt="Preview" />
                      ) : createForm.profilePicture ? (
                        <AvatarImage src={getImageUrl(createForm.profilePicture)} alt="Uploaded" />
                      ) : null}
                      <AvatarFallback className="text-lg bg-muted">
                        {createForm.fName || createForm.lName ? getInitials(createForm.fName, createForm.lName) : <User className="w-8 h-8" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {createProfilePictureFile ? createProfilePictureFile.name : "No image selected"}
                    </span>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label>Upload Profile Picture</Label>
                      <Input
                        ref={createFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCreateFileSelect}
                        className="hidden"
                        id="profile-picture-upload"
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
                      {createForm.profilePicture && !isCreateUploading && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="w-4 h-4" />
                          Image uploaded successfully
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Account Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Settings</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="requiresUserAccount"
                    checked={createForm.requiresUserAccount}
                    onChange={(e) => updateCreateForm("requiresUserAccount", e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="requiresUserAccount" className="cursor-pointer">
                    Create user account for this professional
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, the system will create login credentials and send them to the provided email.
                </p>
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
                onClick={handleSave}
                disabled={isCreateUploading}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isCreateUploading ? "Uploading..." : "Add Doctor"}
              </Button>
            </DialogFooter>
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

      {/* DOCTOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => (
          <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {/* Doctor Avatar Header */}
              <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex flex-col items-center">
                <div className="absolute top-4 right-4">
                  <StatusBadge status={doc.status} />
                </div>
                
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  {doc.profilePicture ? (
                    <AvatarImage 
                      src={getImageUrl(doc.profilePicture)} 
                      alt={`Dr. ${doc.fName} ${doc.lName}`}
                    />
                  ) : null}
                  <AvatarFallback className="text-2xl bg-white">
                    {getInitials(doc.fName, doc.lName)}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="mt-4 text-xl font-bold text-center">
                  Dr. {doc.fName} {doc.mName && `${doc.mName} `}{doc.lName}
                </h3>
                <p className="text-sm text-muted-foreground text-center">{doc.specialty || "General Practitioner"}</p>
              </div>

              {/* Doctor Details */}
              <div className="p-2 space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Contact</span>
                    <span className="font-medium">{doc.phoneNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="font-medium truncate">{doc.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Experience</span>
                    <span className="font-medium">{doc.yearsOfExperience || 0} years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">License</span>
                    <span className="font-medium">{doc.licenseNumber || "Not provided"}</span>
                  </div>
                </div>

                {/* Services Badges */}
                {doc.medicalServices && doc.medicalServices.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Services</p>
                    <div className="flex flex-wrap gap-1">
                      {doc.medicalServices.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {getServiceName(service)}
                        </Badge>
                      ))}
                      {doc.medicalServices.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{doc.medicalServices.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEditClick(doc)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDeleteClick(doc)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                Dr. {doctorToDelete?.fName} {doctorToDelete?.lName}
              </span>
              ? This action cannot be undone. All associated appointments and records will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDoctorToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Doctor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={(open) => {
        if (!open) {
          resetEditForm();
        }
        setOpenEdit(open);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="py-3">
              Edit Medical Professional - Dr. {editForm.fName} {editForm.lName}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fName">First Name *</Label>
                  <Input
                    id="edit-fName"
                    value={editForm.fName}
                    onChange={(e) => updateEditForm("fName", e.target.value)}
                    placeholder="John"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-mName">Middle Name</Label>
                  <Input
                    id="edit-mName"
                    value={editForm.mName}
                    onChange={(e) => updateEditForm("mName", e.target.value)}
                    placeholder="Michael"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-lName">Last Name *</Label>
                  <Input
                    id="edit-lName"
                    value={editForm.lName}
                    onChange={(e) => updateEditForm("lName", e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => updateEditForm("email", e.target.value)}
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phoneNumber">Phone Number *</Label>
                    <Input
                    id="edit-phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={(e) => updateEditForm("phoneNumber", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-jobTitle">Job Title</Label>
                  <Input
                    id="edit-jobTitle"
                    value={editForm.jobTitle}
                    onChange={(e) => updateEditForm("jobTitle", e.target.value)}
                    placeholder="Senior Dentist"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-specialty">Specialty</Label>
                  <Input
                    id="edit-specialty"
                    value={editForm.specialty}
                    onChange={(e) => updateEditForm("specialty", e.target.value)}
                    placeholder="Orthodontics"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-licenseNumber">License Number</Label>
                  <Input
                    id="edit-licenseNumber"
                    value={editForm.licenseNumber}
                    onChange={(e) => updateEditForm("licenseNumber", e.target.value)}
                    placeholder="MED123456"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-educationalBackground">Educational Background</Label>
                  <Input
                    id="edit-educationalBackground"
                    value={editForm.educationalBackground}
                    onChange={(e) => updateEditForm("educationalBackground", e.target.value)}
                    placeholder="Harvard Medical School"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-yearsOfExperience">Years of Experience</Label>
                  <Input
                    id="edit-yearsOfExperience"
                    type="number"
                    min="0"
                    max="50"
                    value={editForm.yearsOfExperience}
                    onChange={(e) => updateEditForm("yearsOfExperience", e.target.value ? parseInt(e.target.value) : "")}
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={editForm.status} 
                    onValueChange={(value) => updateEditForm("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Medical Services Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Medical Services *</h3>
              <div className="space-y-2">
                <Label>Select Services</Label>
                <Select onValueChange={handleEditServiceSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose services..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEditServices.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editSelectedServiceIds.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Services</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                    {editSelectedServiceIds.map((serviceId) => {
                      const service = services.find(s => s.id === serviceId);
                      return service ? (
                        <Badge
                          key={service.id}
                          variant="secondary"
                          className="px-3 py-1.5 flex items-center gap-2"
                        >
                          {service.name}
                          <XCircle
                            className="w-3 h-3 cursor-pointer hover:text-destructive"
                            onClick={() => removeEditService(service.id)}
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
              <h3 className="text-lg font-semibold">Branches *</h3>
              <div className="space-y-2">
                <Label>Select Branches</Label>
                <Select onValueChange={handleEditBranchSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose branches..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEditBranches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
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

            {/* Profile Picture Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile Picture</h3>
              <div className="flex items-start gap-6">
                {/* Avatar Preview */}
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="w-24 h-24 border-2">
                    {editProfilePicturePreview ? (
                      <AvatarImage src={editProfilePicturePreview} alt="Preview" />
                    ) : editForm.profilePicture ? (
                      <AvatarImage src={getImageUrl(editForm.profilePicture)} alt="Uploaded" />
                    ) : null}
                    <AvatarFallback className="text-lg bg-muted">
                      {editForm.fName || editForm.lName ? getInitials(editForm.fName, editForm.lName) : <User className="w-8 h-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {editProfilePictureFile ? editProfilePictureFile.name : "Current image"}
                  </span>
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label>Change Profile Picture</Label>
                    <Input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileSelect}
                      className="hidden"
                      id="edit-profile-picture-upload"
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
                    {editForm.profilePicture && !isEditUploading && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-4 h-4" />
                        Image uploaded successfully
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* User Account Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Settings</h3>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="edit-requiresUserAccount"
                  checked={editForm.requiresUserAccount}
                  onChange={(e) => updateEditForm("requiresUserAccount", e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="edit-requiresUserAccount" className="cursor-pointer">
                  User account for this professional
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, the system will maintain login credentials for this professional.
              </p>
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
              disabled={isEditUploading}
            >
              <Pencil className="w-4 h-4 mr-2" />
              {isEditUploading ? "Uploading..." : "Update Doctor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DoctorsPage;