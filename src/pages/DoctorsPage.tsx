import { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Trash2,
  Upload,
  User,
  Check,
  XCircle,
  Pencil,
  Clock,
  Building,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  MedicalProfessional,
  medicalProfessionalsService,
  UpdateMedicalProfessionalDTO,
  CreateMedicalProfessionalDTO,
  BranchServiceDTO
} from "@/lib/api/medicalProfessionals";
import { toast } from "@/hooks/use-toast";
import { medicalServicesService, MedicalService } from "@/lib/api/medicalServices";
import { branchService, BranchSettingDTO } from "@/lib/api/branches";
import { fileUploadService } from "@/lib/api/fileUpload";
import { doctorScheduleService, DoctorScheduleDTO, AddDoctorScheduleDTO } from "@/lib/api/doctorSchedules";
import { docServiceService, DocServiceDTO, AddDocServiceDTO } from "@/lib/api/docServices";

interface MedicalServiceWithName {
  id: number;
  name: string;
}

interface BranchWithName {
  id: number;
  name: string;
  location?: string;
}

// Interface for branch-specific service selections
interface BranchServiceSelection {
  branchId: number;
  serviceIds: number[];
}

// ===== NEW: Interface for daily schedule slots =====
interface DailyScheduleSlot {
  id: string; // Unique ID for React keys
  branchId: number;
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  isWorking: boolean;
  slots: DailyScheduleSlot[];
}

// Days of week with full names
const daysOfWeek = [
  { key: 'monday', name: 'Monday' },
  { key: 'tuesday', name: 'Tuesday' },
  { key: 'wednesday', name: 'Wednesday' },
  { key: 'thursday', name: 'Thursday' },
  { key: 'friday', name: 'Friday' },
  { key: 'saturday', name: 'Saturday' },
  { key: 'sunday', name: 'Sunday' },
];

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<MedicalProfessional[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [branches, setBranches] = useState<BranchSettingDTO[]>([]);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<MedicalProfessional | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [isBranchesLoading, setIsBranchesLoading] = useState(false);

  // Delete confirmation state
  const [doctorToDelete, setDoctorToDelete] = useState<MedicalProfessional | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Error states
  const [createError, setCreateError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

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
    requiresUserAccount: false,
  });
  
  // Branch-specific services for create form
  const [createBranchServices, setCreateBranchServices] = useState<BranchServiceSelection[]>([]);
  const [createProfilePictureFile, setCreateProfilePictureFile] = useState<File | null>(null);
  const [createProfilePicturePreview, setCreateProfilePicturePreview] = useState<string>("");
  const [isCreateUploading, setIsCreateUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // ===== UPDATED: Schedule states for create form - Now supports multiple slots per day =====
  const [createSchedules, setCreateSchedules] = useState<Record<string, DaySchedule>>(
    daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day.key]: {
        isWorking: false,
        slots: [{
          id: `slot-${day.key}-1`,
          branchId: 0,
          startTime: "08:00",
          endTime: "17:00"
        }]
      }
    }), {})
  );

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
    requiresUserAccount: false,
  });
  
  // Branch-specific services for edit form
  const [editBranchServices, setEditBranchServices] = useState<BranchServiceSelection[]>([]);
  const [editProfilePictureFile, setEditProfilePictureFile] = useState<File | null>(null);
  const [editProfilePicturePreview, setEditProfilePicturePreview] = useState<string>("");
  const [isEditUploading, setIsEditUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState("basic");

  // ===== UPDATED: Schedule states for edit form - Now supports multiple slots per day =====
  const [editSchedules, setEditSchedules] = useState<Record<string, DaySchedule>>(
    daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day.key]: {
        isWorking: false,
        slots: [{
          id: `edit-slot-${day.key}-1`,
          branchId: 0,
          startTime: "08:00",
          endTime: "17:00"
        }]
      }
    }), {})
  );
  
  const [existingSchedules, setExistingSchedules] = useState<DoctorScheduleDTO[]>([]);
  const [existingDocServices, setExistingDocServices] = useState<DocServiceDTO[]>([]);

  const createFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Helper to generate unique IDs
  const generateId = () => `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    fetchData();
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (createProfilePicturePreview) {
        URL.revokeObjectURL(createProfilePicturePreview);
      }
      if (editProfilePicturePreview) {
        URL.revokeObjectURL(editProfilePicturePreview);
      }
    };
  }, [createProfilePicturePreview, editProfilePicturePreview]);

  const fetchData = async () => {
    setIsLoading(true);
    console.log("🔍 Starting data fetch...");
    
    try {
      // Fetch doctors
      console.log("Fetching doctors...");
      const doctorsData = await medicalProfessionalsService.getAll();
      console.log("Doctors fetched:", doctorsData.length);
      setDoctors(doctorsData);

      // Fetch services
      setIsServicesLoading(true);
      try {
        console.log("Fetching services...");
        const servicesData = await medicalServicesService.getAll();
        console.log("Services fetched:", servicesData.length);
        
        // Transform the services data
        const transformedServices = servicesData.map(service => ({
          id: service.id,
          name: service.name || service.serviceReference || `Service ${service.id}`,
          description: service.description,
          durationInMinutes: service.durationInMinutes,
          servicePicture: service.servicePicture
        }));
        setServices(transformedServices);
      } catch (serviceError: any) {
        console.error("Error fetching services:", serviceError);
        toast({
          title: "Services not loaded",
          description: "Could not load medical services. Please refresh.",
          variant: "destructive",
        });
        setServices([]);
      } finally {
        setIsServicesLoading(false);
      }

      // Fetch branches
      setIsBranchesLoading(true);
      try {
        console.log("Fetching branches...");
        const branchesData = await branchService.getAll();
        console.log("Branches fetched:", branchesData.length);
        setBranches(branchesData);
      } catch (branchError: any) {
        console.error("Error fetching branches:", branchError);
        toast({
          title: "Branches not loaded",
          description: "Could not load branches. Please refresh.",
          variant: "destructive",
        });
        setBranches([]);
      } finally {
        setIsBranchesLoading(false);
      }

    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "Failed to load data",
        description: error.response?.data?.message || "Please check your connection and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) =>
      `${d.fName} ${d.lName}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [doctors, search]);

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

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setCreateProfilePictureFile(file);

      const previewUrl = URL.createObjectURL(file);
      setCreateProfilePicturePreview(previewUrl);

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

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setEditProfilePictureFile(file);

      const previewUrl = URL.createObjectURL(file);
      setEditProfilePicturePreview(previewUrl);

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
    } catch (error: any) {
      console.error("Error uploading image:", error);
      const errorMessage = error.response?.data?.message || "Could not upload profile picture";
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Store the error for display in form
      if (isCreate) {
        setCreateError(errorMessage);
      } else {
        setEditError(errorMessage);
      }
    } finally {
      if (isCreate) {
        setIsCreateUploading(false);
      } else {
        setIsEditUploading(false);
      }
    }
  };

  // ===== Schedule Management Functions =====

  // Add a new time slot to a day
  const addTimeSlot = (dayKey: string, isCreate: boolean) => {
    const newSlot: DailyScheduleSlot = {
      id: generateId(),
      branchId: 0,
      startTime: "08:00",
      endTime: "17:00"
    };

    if (isCreate) {
      setCreateSchedules(prev => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          slots: [...prev[dayKey].slots, newSlot]
        }
      }));
    } else {
      setEditSchedules(prev => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          slots: [...prev[dayKey].slots, newSlot]
        }
      }));
    }
  };

  // Remove a time slot from a day
  const removeTimeSlot = (dayKey: string, slotId: string, isCreate: boolean) => {
    if (isCreate) {
      const daySchedule = createSchedules[dayKey];
      if (daySchedule.slots.length <= 1) {
        toast({
          title: "Cannot remove last slot",
          description: "Each day must have at least one time slot",
          variant: "destructive",
        });
        return;
      }
      
      setCreateSchedules(prev => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          slots: prev[dayKey].slots.filter(slot => slot.id !== slotId)
        }
      }));
    } else {
      const daySchedule = editSchedules[dayKey];
      if (daySchedule.slots.length <= 1) {
        toast({
          title: "Cannot remove last slot",
          description: "Each day must have at least one time slot",
          variant: "destructive",
        });
        return;
      }
      
      setEditSchedules(prev => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          slots: prev[dayKey].slots.filter(slot => slot.id !== slotId)
        }
      }));
    }
  };

  // Update a specific time slot
  const updateTimeSlot = (
    dayKey: string, 
    slotId: string, 
    field: keyof DailyScheduleSlot, 
    value: any, 
    isCreate: boolean
  ) => {
    if (isCreate) {
      setCreateSchedules(prev => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          slots: prev[dayKey].slots.map(slot => 
            slot.id === slotId ? { ...slot, [field]: value } : slot
          )
        }
      }));
    } else {
      setEditSchedules(prev => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          slots: prev[dayKey].slots.map(slot => 
            slot.id === slotId ? { ...slot, [field]: value } : slot
          )
        }
      }));
    }
  };

  // Toggle working day
  const toggleWorkingDay = (dayKey: string, isCreate: boolean) => {
    if (isCreate) {
      const newIsWorking = !createSchedules[dayKey].isWorking;
      setCreateSchedules(prev => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          isWorking: newIsWorking
        }
      }));
    } else {
      const newIsWorking = !editSchedules[dayKey].isWorking;
      setEditSchedules(prev => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          isWorking: newIsWorking
        }
      }));
    }
  };

  // Check if a time slot is valid (has branch and valid times)
  const isValidTimeSlot = (slot: DailyScheduleSlot): boolean => {
    if (slot.branchId === 0) return false;
    if (!slot.startTime || !slot.endTime) return false;
    
    const start = new Date(`1970-01-01T${slot.startTime}`);
    const end = new Date(`1970-01-01T${slot.endTime}`);
    return start < end;
  };

  // Check if day has any valid working slots
  const hasValidWorkingSlots = (daySchedule: DaySchedule): boolean => {
    if (!daySchedule.isWorking) return false;
    return daySchedule.slots.some(slot => isValidTimeSlot(slot));
  };

  // ===== Branch-Specific Service Functions =====
  
  // Add branch with services for create form
  const handleAddBranchServiceCreate = (branchId: number, serviceIds: number[]) => {
    if (branchId === 0 || serviceIds.length === 0) {
      setCreateError("Please select both a branch and at least one service");
      toast({
        title: "Missing information",
        description: "Please select both a branch and at least one service",
        variant: "destructive",
      });
      return;
    }

    if (createBranchServices.some(bs => bs.branchId === branchId)) {
      setCreateError("This branch already has services assigned. Please edit the existing entry.");
      toast({
        title: "Branch already added",
        description: "This branch already has services assigned. Please edit the existing entry.",
        variant: "destructive",
      });
      return;
    }

    setCreateBranchServices([...createBranchServices, { branchId, serviceIds }]);
    setCreateError(null); // Clear error on success
  };

  // Remove branch service for create form
  const handleRemoveBranchServiceCreate = (branchId: number) => {
    setCreateBranchServices(createBranchServices.filter(bs => bs.branchId !== branchId));
  };

  // Add service to existing branch for create form
  const handleAddServiceToBranchCreate = (branchId: number, serviceId: number) => {
    const updated = createBranchServices.map(bs => {
      if (bs.branchId === branchId && !bs.serviceIds.includes(serviceId)) {
        return { ...bs, serviceIds: [...bs.serviceIds, serviceId] };
      }
      return bs;
    });
    setCreateBranchServices(updated);
  };

  // Remove service from branch for create form
  const handleRemoveServiceFromBranchCreate = (branchId: number, serviceId: number) => {
    const updated = createBranchServices.map(bs => {
      if (bs.branchId === branchId) {
        const newServiceIds = bs.serviceIds.filter(id => id !== serviceId);
        if (newServiceIds.length === 0) {
          return null;
        }
        return { ...bs, serviceIds: newServiceIds };
      }
      return bs;
    }).filter((bs): bs is BranchServiceSelection => bs !== null);
    
    setCreateBranchServices(updated);
  };

  // Similar functions for edit form
  const handleAddBranchServiceEdit = (branchId: number, serviceIds: number[]) => {
    if (branchId === 0 || serviceIds.length === 0) {
      setEditError("Please select both a branch and at least one service");
      return;
    }
    
    if (editBranchServices.some(bs => bs.branchId === branchId)) {
      setEditError("This branch already has services assigned");
      toast({
        title: "Branch already added",
        description: "This branch already has services assigned",
        variant: "destructive",
      });
      return;
    }

    setEditBranchServices([...editBranchServices, { branchId, serviceIds }]);
    setEditError(null); // Clear error on success
  };

  const handleRemoveBranchServiceEdit = (branchId: number) => {
    setEditBranchServices(editBranchServices.filter(bs => bs.branchId !== branchId));
  };

  const handleAddServiceToBranchEdit = (branchId: number, serviceId: number) => {
    const updated = editBranchServices.map(bs => {
      if (bs.branchId === branchId && !bs.serviceIds.includes(serviceId)) {
        return { ...bs, serviceIds: [...bs.serviceIds, serviceId] };
      }
      return bs;
    });
    setEditBranchServices(updated);
  };

  const handleRemoveServiceFromBranchEdit = (branchId: number, serviceId: number) => {
    const updated = editBranchServices.map(bs => {
      if (bs.branchId === branchId) {
        const newServiceIds = bs.serviceIds.filter(id => id !== serviceId);
        if (newServiceIds.length === 0) {
          return null;
        }
        return { ...bs, serviceIds: newServiceIds };
      }
      return bs;
    }).filter((bs): bs is BranchServiceSelection => bs !== null);
    
    setEditBranchServices(updated);
  };

  // Get available branches (not already selected) for create form
  const availableCreateBranches = useMemo(() => {
    return branches.filter(
      branch => !createBranchServices.some(bs => bs.branchId === branch.id)
    );
  }, [branches, createBranchServices]);

  // Get available branches for edit form
  const availableEditBranches = useMemo(() => {
    return branches.filter(
      branch => !editBranchServices.some(bs => bs.branchId === branch.id)
    );
  }, [branches, editBranchServices]);

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
      requiresUserAccount: false,
    });
    setCreateBranchServices([]);
    setCreateProfilePictureFile(null);
    if (createProfilePicturePreview) {
      URL.revokeObjectURL(createProfilePicturePreview);
    }
    setCreateProfilePicturePreview("");
    if (createFileInputRef.current) {
      createFileInputRef.current.value = "";
    }
    setCreateError(null);
    // Reset schedules to initial state
    setCreateSchedules(
      daysOfWeek.reduce((acc, day) => ({
        ...acc,
        [day.key]: {
          isWorking: false,
          slots: [{
            id: `slot-${day.key}-1`,
            branchId: 0,
            startTime: "08:00",
            endTime: "17:00"
          }]
        }
      }), {})
    );
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
      requiresUserAccount: false,
    });
    setEditBranchServices([]);
    setEditProfilePictureFile(null);
    if (editProfilePicturePreview) {
      URL.revokeObjectURL(editProfilePicturePreview);
    }
    setEditProfilePicturePreview("");
    setEditingDoctor(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
    setEditError(null);
    setActiveEditTab("basic");
    // Reset edit schedules
    setEditSchedules(
      daysOfWeek.reduce((acc, day) => ({
        ...acc,
        [day.key]: {
          isWorking: false,
          slots: [{
            id: `edit-slot-${day.key}-1`,
            branchId: 0,
            startTime: "08:00",
            endTime: "17:00"
          }]
        }
      }), {})
    );
  };

  // Setup edit form with doctor data
  const setupEditForm = async (doctor: MedicalProfessional) => {
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

    // Fetch the doctor's DocService entries to populate branch services
    try {
      const docServices = await docServiceService.getByDoctorId(doctor.id);
      setExistingDocServices(docServices);
      
      // Group services by branch
      const branchServicesMap = new Map<number, number[]>();
      
      docServices.forEach(docService => {
        const branchId = docService.branchSettingId;
        const serviceId = docService.medicalServiceId;
        
        if (!branchServicesMap.has(branchId)) {
          branchServicesMap.set(branchId, []);
        }
        branchServicesMap.get(branchId)?.push(serviceId);
      });

      // Convert to BranchServiceSelection array
      const branchServices: BranchServiceSelection[] = [];
      branchServicesMap.forEach((serviceIds, branchId) => {
        branchServices.push({
          branchId,
          serviceIds
        });
      });
      
      setEditBranchServices(branchServices);
    } catch (error: any) {
      console.error("Error fetching doc services:", error);
      const errorMessage = error.response?.data?.message || "Unable to load doctor's services.";
      setEditError(errorMessage);
      toast({
        title: "Could not load services",
        description: errorMessage,
        variant: "destructive",
      });
    }

    // Load doctor schedules
    await loadDoctorSchedules(doctor.id);

    setOpenEdit(true);
  };

  // Handle create save
  const handleSave = async () => {
    // Prevent double submission
    if (isCreating) return;
    
    setIsCreating(true);
    setCreateError(null); // Clear previous errors

    // Validate required fields
    if (!createForm.fName || !createForm.lName || !createForm.email || !createForm.phoneNumber) {
      setCreateError("Please fill in all required fields (First Name, Last Name, Email, and Phone Number)");
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsCreating(false);
      return;
    }

    if (createBranchServices.length === 0) {
      setCreateError("Please add at least one branch with services");
      toast({
        title: "No branch services configured",
        description: "Please add at least one branch with services",
        variant: "destructive",
      });
      setIsCreating(false);
      return;
    }

    try {
      // Extract all unique branch IDs and service IDs
      const allBranchIds = Array.from(new Set(createBranchServices.map(bs => bs.branchId)));
      const allServiceIds = Array.from(new Set(createBranchServices.flatMap(bs => bs.serviceIds)));

      // Create the doctor first
      const doctorData: CreateMedicalProfessionalDTO = {
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
        medicalServicesId: allServiceIds,
        branches: allBranchIds,
      };

      const newDoctor = await medicalProfessionalsService.create(doctorData);

      // Create DocService entries for each branch-service combination
      try {
        const docServicePromises: AddDocServiceDTO[] = [];
        
        createBranchServices.forEach(branchService => {
          branchService.serviceIds.forEach(serviceId => {
            docServicePromises.push({
              medicalProfessionalId: newDoctor.id,
              medicalServiceId: serviceId,
              branchSettingId: branchService.branchId
            });
          });
        });

        if (docServicePromises.length > 0) {
          await docServiceService.createMultiple(docServicePromises);
        }
      } catch (docServiceError: any) {
        console.error("DocService creation error:", docServiceError);
        const errorMessage = docServiceError.response?.data?.message || "There was an issue assigning services to branches.";
        toast({
          title: "Doctor added but services assignment failed",
          description: errorMessage,
          variant: "destructive",
        });
      }

      // Save doctor schedules
      try {
        await saveDoctorSchedules(newDoctor.id, createSchedules);
      } catch (scheduleError: any) {
        console.error("Schedule creation error:", scheduleError);
        const errorMessage = scheduleError.response?.data?.message || "There was an issue saving the schedule.";
        toast({
          title: "Doctor added but schedules failed",
          description: errorMessage,
          variant: "destructive",
        });
      }

      // Refresh doctors list
      const updatedDoctors = await medicalProfessionalsService.getAll();
      setDoctors(updatedDoctors);

      toast({
        title: "Dental professional added successfully",
        description: `${createForm.fName} ${createForm.lName} has been added to the system`,
      });

      resetCreateForm();
      setOpenCreate(false);
    } catch (err: any) {
      console.error("Error adding dental professional:", err);
      const errorMessage = err.response?.data?.message || "Please check the form and try again";
      setCreateError(errorMessage);
      toast({
        title: "Failed to add dental professional",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Handle update save
  const handleUpdate = async () => {
    if (!editingDoctor || isUpdating) return;
    
    setIsUpdating(true);
    setEditError(null); // Clear previous errors

    // Validate required fields
    if (!editForm.fName || !editForm.lName || !editForm.email || !editForm.phoneNumber) {
      setEditError("Please fill in all required fields (First Name, Last Name, Email, and Phone Number)");
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsUpdating(false);
      return;
    }

    if (editBranchServices.length === 0) {
      setEditError("Please add at least one branch with services");
      toast({
        title: "No branch services configured",
        description: "Please add at least one branch with services",
        variant: "destructive",
      });
      setIsUpdating(false);
      return;
    }

    let success = false;

    if (activeEditTab === "basic" || activeEditTab === "services") {
      try {
        // Extract all unique branch IDs and service IDs
        const allBranchIds = Array.from(new Set(editBranchServices.map(bs => bs.branchId)));
        const allServiceIds = Array.from(new Set(editBranchServices.flatMap(bs => bs.serviceIds)));

        // Update the doctor
        const updateData: UpdateMedicalProfessionalDTO = {
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
          medicalServicesId: allServiceIds,
          branches: allBranchIds,
        };

        // First, delete all existing DocService entries for this doctor
        try {
          await docServiceService.deleteByDoctorId(editingDoctor.id);
        } catch (deleteError: any) {
          console.error("Error deleting old DocService entries:", deleteError);
        }

        // Create new DocService entries
        try {
          const docServicePromises: AddDocServiceDTO[] = [];
          
          editBranchServices.forEach(branchService => {
            branchService.serviceIds.forEach(serviceId => {
              docServicePromises.push({
                medicalProfessionalId: editingDoctor.id,
                medicalServiceId: serviceId,
                branchSettingId: branchService.branchId
              });
            });
          });

          if (docServicePromises.length > 0) {
            await docServiceService.createMultiple(docServicePromises);
          }
        } catch (docServiceError: any) {
          console.error("DocService creation error:", docServiceError);
          const errorMessage = docServiceError.response?.data?.message || "Error assigning services";
          setEditError(`Services assignment failed: ${errorMessage}`);
        }

        // Update doctor information
        await medicalProfessionalsService.update(updateData);

        // Refresh doctors list
        const updatedDoctors = await medicalProfessionalsService.getAll();
        setDoctors(updatedDoctors);

        toast({
          title: "Doctor information updated",
          description: `${editForm.fName} ${editForm.lName}'s data has been updated`,
        });
        success = true;
      } catch (err: any) {
        console.error("Update error:", err);
        const errorMessage = err.response?.data?.message || `Error: ${err.response?.status} ${err.response?.statusText}`;
        setEditError(errorMessage);
        toast({
          title: "Doctor info update failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else if (activeEditTab === "schedule") {
      try {
        await updateDoctorSchedules(editingDoctor.id, editSchedules);
        toast({
          title: "Schedule updated",
          description: "The doctor's schedule has been updated successfully",
        });
        success = true;
      } catch (scheduleError: any) {
        console.error("Schedule update error:", scheduleError);
        const errorMessage = scheduleError.response?.data?.message || "There was an issue updating the doctor's schedule.";
        setEditError(errorMessage);
        toast({
          title: "Schedule update failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }

    if (success) {
      resetEditForm();
      setOpenEdit(false);
    }
    
    setIsUpdating(false);
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
      // First delete all DocService entries for this doctor
      try {
        await docServiceService.deleteByDoctorId(doctorToDelete.id);
      } catch (docServiceError: any) {
        console.error("Error deleting doc services:", docServiceError);
      }

      // Delete all schedules for this doctor
      try {
        const schedules = await doctorScheduleService.getByDoctorId(doctorToDelete.id);
        const deletePromises = schedules.map(schedule => 
          doctorScheduleService.delete(schedule.id)
        );
        await Promise.all(deletePromises);
      } catch (scheduleError: any) {
        console.error("Error deleting schedules:", scheduleError);
      }

      // Finally delete the doctor
      await medicalProfessionalsService.delete(doctorToDelete.id);
      
      // Refresh doctors list
      const updatedDoctors = await medicalProfessionalsService.getAll();
      setDoctors(updatedDoctors);

      toast({
        title: "Dental professional deleted",
        description: `${doctorToDelete.fName} ${doctorToDelete.lName} has been removed`,
      });
    } catch (error: any) {
      console.error("Error deleting dental professional:", error);
      const errorMessage = error.response?.data?.message || "Could not delete the dental professional";
      toast({
        title: "Delete failed",
        description: errorMessage,
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
  const getServiceName = useCallback((service: MedicalServiceWithName | string | any): string => {
    if (typeof service === 'object' && service !== null && 'name' in service) {
      return service.name;
    }
    if (typeof service === 'string') {
      return service;
    }
    if (typeof service === 'object' && service !== null && 'serviceReference' in service) {
      return service.serviceReference;
    }
    return "Unknown Service";
  }, []);

  // Update create form field
  const updateCreateForm = (field: keyof typeof createForm, value: any) => {
    setCreateForm(prev => ({ ...prev, [field]: value }));
  };

  // Update edit form field
  const updateEditForm = (field: keyof typeof editForm, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  // Helper function to format time for display - FIXED BUG HERE
  const formatTimeForDisplay = (timeString: string): string => {
    if (!timeString || timeString === "" || timeString === "00:00:00" || timeString === "00:00") {
      return "08:00";
    }

    if (timeString.length > 5) {
      // Handle "02:00:00" format -> "02:00"
      return timeString.substring(0, 5);
    }

    if (timeString.match(/^\d{1,2}:\d{2}$/)) {
      const parts = timeString.split(':');
      const hour = parts[0].padStart(2, '0');
      const minute = parts[1];
      return `${hour}:${minute}`;
    }

    return "08:00";
  };

  // Helper function to format time for backend
  const formatTimeForBackend = (timeString: string): string => {
    if (!timeString || timeString === "") {
      return "08:00";
    }

    if (timeString.match(/^\d{1,2}:\d{2}$/)) {
      const parts = timeString.split(':');
      const hour = parts[0].padStart(2, '0');
      const minute = parts[1];
      return `${hour}:${minute}`;
    }

    return "08:00";
  };

  // Load doctor schedules for editing
  const loadDoctorSchedules = async (doctorId: number) => {
    try {
      const schedules = await doctorScheduleService.getByDoctorId(doctorId);
      setExistingSchedules(schedules);

      // Group schedules by day
      const schedulesByDay: Record<string, DailyScheduleSlot[]> = {};
      
      schedules.forEach(schedule => {
        const dayKey = schedule.weekDay.toLowerCase();
        if (!schedulesByDay[dayKey]) {
          schedulesByDay[dayKey] = [];
        }
        
        schedulesByDay[dayKey].push({
          id: generateId(),
          branchId: schedule.branchSettingId,
          startTime: formatTimeForDisplay(schedule.startTime),
          endTime: formatTimeForDisplay(schedule.endTime)
        });
      });

      // Update edit schedules
      const updatedSchedules = { ...editSchedules };
      
      daysOfWeek.forEach(day => {
        const daySchedules = schedulesByDay[day.key] || [{
          id: generateId(),
          branchId: 0,
          startTime: "08:00",
          endTime: "17:00"
        }];
        
        updatedSchedules[day.key] = {
          isWorking: daySchedules.length > 0 && daySchedules.some(s => s.branchId > 0),
          slots: daySchedules
        };
      });

      setEditSchedules(updatedSchedules);
    } catch (error: any) {
      console.error("Error loading schedules:", error);
      const errorMessage = error.response?.data?.message || "Unable to load existing schedules.";
      setEditError(errorMessage);
      toast({
        title: "Could not load schedules",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Save doctor schedules - Now handles multiple slots per day
  const saveDoctorSchedules = async (doctorId: number, schedules: typeof createSchedules) => {
    try {
      const schedulePromises: Promise<any>[] = [];

      Object.entries(schedules).forEach(([dayKey, daySchedule]) => {
        if (daySchedule.isWorking) {
          // Create a schedule for each valid slot
          daySchedule.slots.forEach(slot => {
            if (slot.branchId > 0 && slot.startTime && slot.endTime) {
              const scheduleData: AddDoctorScheduleDTO = {
                medicalProfessionalId: doctorId,
                branchSettingId: slot.branchId,
                weekDay: dayKey.charAt(0).toUpperCase() + dayKey.slice(1),
                startTime: formatTimeForBackend(slot.startTime),
                endTime: formatTimeForBackend(slot.endTime),
              };
              schedulePromises.push(doctorScheduleService.create(scheduleData));
            }
          });
        }
      });

      if (schedulePromises.length > 0) {
        await Promise.all(schedulePromises);
      }
    } catch (error: any) {
      console.error("Error saving schedules:", error);
      const errorMessage = error.response?.data?.message || "Error saving schedules";
      setCreateError(errorMessage);
      throw error;
    }
  };

  // Update doctor schedules - Now handles multiple slots per day
  const updateDoctorSchedules = async (doctorId: number, schedules: typeof editSchedules) => {
    try {
      const schedulePromises: Promise<any>[] = [];
      
      // First, delete all existing schedules for this doctor
      const deletePromises = existingSchedules.map(schedule => 
        doctorScheduleService.delete(schedule.id)
      );
      await Promise.all(deletePromises);
      
      // Then create new schedules based on current state
      Object.entries(schedules).forEach(([dayKey, daySchedule]) => {
        if (daySchedule.isWorking) {
          daySchedule.slots.forEach(slot => {
            if (slot.branchId > 0 && slot.startTime && slot.endTime) {
              const scheduleData: AddDoctorScheduleDTO = {
                medicalProfessionalId: doctorId,
                branchSettingId: slot.branchId,
                weekDay: dayKey.charAt(0).toUpperCase() + dayKey.slice(1),
                startTime: formatTimeForBackend(slot.startTime),
                endTime: formatTimeForBackend(slot.endTime),
              };
              schedulePromises.push(doctorScheduleService.create(scheduleData));
            }
          });
        }
      });

      if (schedulePromises.length > 0) {
        await Promise.all(schedulePromises);
      }
      
      // Refresh existing schedules
      const updatedSchedules = await doctorScheduleService.getByDoctorId(doctorId);
      setExistingSchedules(updatedSchedules);
      
    } catch (error: any) {
      console.error("Error in updateDoctorSchedules:", error);
      const errorMessage = error.response?.data?.message || "Error updating schedules";
      setEditError(errorMessage);
      throw error;
    }
  };

  // ===== Day Schedule Component =====
  const DayScheduleComponent = ({ 
    day, 
    isCreate = false 
  }: { 
    day: { key: string, name: string }, 
    isCreate?: boolean 
  }) => {
    const daySchedule = isCreate ? createSchedules[day.key] : editSchedules[day.key];

    return (
      <div className={`border rounded-lg p-4 transition-colors ${daySchedule.isWorking ? 'bg-card' : 'bg-muted/30'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Switch
              checked={daySchedule.isWorking}
              onCheckedChange={() => toggleWorkingDay(day.key, isCreate)}
            />
            <div className="w-28">
              <span className={`font-medium ${!daySchedule.isWorking ? 'text-muted-foreground' : ''}`}>
                {day.name}
              </span>
            </div>
            {daySchedule.isWorking && (
              <Badge variant="outline" className="ml-2">
                {daySchedule.slots.length} shift{daySchedule.slots.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          {daySchedule.isWorking && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTimeSlot(day.key, isCreate)}
              className="h-8"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Shift
            </Button>
          )}
        </div>

        {daySchedule.isWorking ? (
          <div className="space-y-3">
            {daySchedule.slots.map((slot, slotIndex) => (
              <div key={slot.id} className="flex items-center gap-3 p-3 border rounded-md bg-background">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Branch</Label>
                    <Select
                      value={slot.branchId > 0 ? slot.branchId.toString() : ""}
                      onValueChange={(value) => updateTimeSlot(day.key, slot.id, 'branchId', parseInt(value), isCreate)}
                    >
                      <SelectTrigger className={`${slot.branchId === 0 ? 'border-red-300' : ''}`}>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Select branch</SelectItem>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {slot.branchId === 0 && (
                      <span className="text-xs text-red-500">Required</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Start Time</Label>
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(day.key, slot.id, 'startTime', e.target.value, isCreate)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">End Time</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(day.key, slot.id, 'endTime', e.target.value, isCreate)}
                        className="flex-1"
                      />
                      {daySchedule.slots.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTimeSlot(day.key, slot.id, isCreate)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Example schedule suggestion */}
            {daySchedule.slots.length === 1 && (
              <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/20 rounded">
                <strong>Tip:</strong> Add multiple shifts to work at different branches on the same day.
                Example: Morning at Main Branch (8:00 - 12:00), Afternoon at Downtown Branch (01:00 - 06:00)
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic p-3 bg-muted/20 rounded">
            Not working on {day.name}
          </div>
        )}
      </div>
    );
  };

  // ===== BranchServiceSelector Component =====
  const BranchServiceSelector = ({
    isEdit = false,
    availableBranches,
    branchServices,
    onAddBranchService,
    onRemoveBranchService,
    onAddServiceToBranch,
    onRemoveServiceFromBranch,
  }: {
    isEdit?: boolean;
    availableBranches: BranchSettingDTO[];
    branchServices: BranchServiceSelection[];
    onAddBranchService: (branchId: number, serviceIds: number[]) => void;
    onRemoveBranchService: (branchId: number) => void;
    onAddServiceToBranch: (branchId: number, serviceId: number) => void;
    onRemoveServiceFromBranch: (branchId: number, serviceId: number) => void;
  }) => {
    const [selectedBranchId, setSelectedBranchId] = useState<number>(0);
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

    // Get services that are NOT currently selected (for the dropdown)
    const availableServicesForDropdown = useMemo(() => {
      return services.filter(service => !selectedServiceIds.includes(service.id));
    }, [services, selectedServiceIds]);

    const handleAddBranch = () => {
      if (selectedBranchId && selectedServiceIds.length > 0) {
        onAddBranchService(selectedBranchId, selectedServiceIds);
        setSelectedBranchId(0);
        setSelectedServiceIds([]); // Clear the selected services after adding
      }
    };

    const handleAddService = (serviceId: number) => {
      if (!selectedServiceIds.includes(serviceId)) {
        setSelectedServiceIds([...selectedServiceIds, serviceId]);
      }
    };

    const handleRemoveSelectedService = (serviceId: number) => {
      setSelectedServiceIds(selectedServiceIds.filter(id => id !== serviceId));
    };

    return (
      <div className="space-y-6">
        {/* Add New Branch-Service Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-md flex items-center gap-2">
            <Building className="w-4 h-4" />
            Add Branch with Services
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Branch Selection */}
            <div className="space-y-2">
              <Label htmlFor={`branch-select-${isEdit ? 'edit' : 'create'}`}>Select Branch</Label>
              <Select
                value={selectedBranchId.toString()}
                onValueChange={(value) => {
                  const newBranchId = parseInt(value);
                  setSelectedBranchId(newBranchId);
                }}
              >
                <SelectTrigger id={`branch-select-${isEdit ? 'edit' : 'create'}`}>
                  <SelectValue placeholder="Choose a branch..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Select branch...</SelectItem>
                  {availableBranches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Selection */}
            <div className="space-y-2">
              <Label>Select Services for this Branch</Label>
              <Select
                value=""
                onValueChange={(value) => {
                  const serviceId = parseInt(value);
                  handleAddService(serviceId);
                }}
                disabled={selectedBranchId === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedBranchId === 0 ? "Select branch first" : "Choose services..."} />
                </SelectTrigger>
                <SelectContent>
                  {availableServicesForDropdown.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No more services available
                    </div>
                  ) : (
                    availableServicesForDropdown.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              
              {selectedServiceIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedServiceIds.map((serviceId) => {
                    const service = services.find(s => s.id === serviceId);
                    return service ? (
                      <Badge key={serviceId} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                        {service.name}
                        <XCircle
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => handleRemoveSelectedService(serviceId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddBranch}
            disabled={selectedBranchId === 0 || selectedServiceIds.length === 0}
            size="sm"
            variant="outline"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Branch with Services
          </Button>
        </div>

        {/* Display Selected Branch-Services */}
        {branchServices.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-md">Configured Branch Services</h4>
            <div className="space-y-3">
              {branchServices.map((branchService) => {
                const branch = branches.find(b => b.id === branchService.branchId);
                
                return branch ? (
                  <div key={branch.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{branch.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {branchService.serviceIds.length} service{branchService.serviceIds.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveBranchService(branch.id)}
                        className="h-8 px-2 text-destructive hover:text-destructive"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Services for this branch */}
                    <div className="space-y-2">
                      <Label className="text-sm">Services at this branch:</Label>
                      <div className="flex flex-wrap gap-2">
                        {branchService.serviceIds.map((serviceId) => {
                          const service = services.find(s => s.id === serviceId);
                          return service ? (
                            <Badge key={serviceId} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                              {service.name}
                              <XCircle
                                className="w-3 h-3 cursor-pointer hover:text-destructive"
                                onClick={() => onRemoveServiceFromBranch(branch.id, service.id)}
                              />
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {/* Add more services to this branch */}
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Select
                          value=""
                          onValueChange={(value) => {
                            const serviceId = parseInt(value);
                            onAddServiceToBranch(branch.id, serviceId);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Add more services to this branch..." />
                          </SelectTrigger>
                          <SelectContent>
                            {services
                              .filter(service => !branchService.serviceIds.includes(service.id))
                              .map((service) => (
                                <SelectItem key={service.id} value={service.id.toString()}>
                                  {service.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===== Error Message Component =====
  const ErrorMessage = ({ message, onClose }: { message: string | null; onClose: () => void }) => {
    if (!message) return null;
    
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-destructive">Error</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-destructive/10"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout
      title="Dental Professionals"
      subtitle="Manage dental professionals"
      actions={
        <Dialog open={openCreate} onOpenChange={(open) => {
          if (!open) {
            resetCreateForm();
          }
          setOpenCreate(open);
        }}>
          <DialogTrigger asChild>
            <Button variant="dental">
              <Plus className="w-4 h-4 mr-1" /> Add Dental Professional
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="py-3">Add New Dental Professional</DialogTitle>
            </DialogHeader>

            {/* Error message for create dialog */}
            <div className="px-6">
              <ErrorMessage 
                message={createError} 
                onClose={() => setCreateError(null)} 
              />
            </div>

            <Tabs defaultValue="basic" className="w-full">
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="services">Services & Branches</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="basic" className="p-6 space-y-6 mt-0">
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

                {/* Profile Picture Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Profile Picture</h3>
                  <div className="flex items-start gap-6">
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
                      Create user account for this dental professional
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the system will create login credentials and send them to the provided email.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="services" className="p-6 space-y-6 mt-0">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Branch-Specific Services *</h3>
                  <p className="text-sm text-muted-foreground">
                    Add branches and assign specific services to each branch. For example, "Teeth Cleaning" might be available only at specific branches.
                  </p>
                  
                  <BranchServiceSelector
                    availableBranches={availableCreateBranches}
                    branchServices={createBranchServices}
                    onAddBranchService={handleAddBranchServiceCreate}
                    onRemoveBranchService={handleRemoveBranchServiceCreate}
                    onAddServiceToBranch={handleAddServiceToBranchCreate}
                    onRemoveServiceFromBranch={handleRemoveServiceFromBranchCreate}
                  />
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="p-6 space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Weekly Schedule</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Configure working hours for each day. You can add multiple time slots to work at different branches on the same day.
                    <br />
                    <span className="text-xs text-blue-600">Example: Morning at Main Branch (8:00-12:00), Afternoon at Downtown Branch (1:00 - 6:00)</span>
                  </p>

                  <div className="space-y-4">
                    {daysOfWeek.map((day) => (
                      <DayScheduleComponent key={day.key} day={day} isCreate={true} />
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

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
                disabled={isCreateUploading || isCreating}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isCreating ? "Adding..." : "Add Dental Professional"}
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
              placeholder="Search dental professional..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dental professionals...</p>
          </div>
        </div>
      ) : (
        <>
          {/* DENTAL PROFESSIONAL CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredDoctors.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No dental professionals found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {search ? 'Try a different search term' : 'Add a new dental professional to get started'}
                </p>
              </div>
            ) : (
              filteredDoctors.map((doc) => (
                <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
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
                      <p className="text-sm text-muted-foreground text-center">{doc.specialty || "General Dentist"}</p>
                    </div>

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
              ))
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dental Professional</AlertDialogTitle>
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
              Delete Dental Professional
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
              Edit Dental Professional - Dr. {editForm.fName} {editForm.lName}
            </DialogTitle>
          </DialogHeader>

          {/* Error message for edit dialog */}
          <div className="px-6">
            <ErrorMessage 
              message={editError} 
              onClose={() => setEditError(null)} 
            />
          </div>

          <Tabs value={activeEditTab} onValueChange={setActiveEditTab} className="w-full">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="services">Services & Branches</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="basic" className="p-6 space-y-6 mt-0">
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

              {/* Profile Picture Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile Picture</h3>
                <div className="flex items-start gap-6">
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
                    User account for this dental professional
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, the system will maintain login credentials for this dental professional.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="services" className="p-6 space-y-6 mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Branch-Specific Services *</h3>
                <p className="text-sm text-muted-foreground">
                  Configure which services are available at each branch. Services can be repeated across branches.
                </p>
                
                <BranchServiceSelector
                  isEdit={true}
                  availableBranches={availableEditBranches}
                  branchServices={editBranchServices}
                  onAddBranchService={handleAddBranchServiceEdit}
                  onRemoveBranchService={handleRemoveBranchServiceEdit}
                  onAddServiceToBranch={handleAddServiceToBranchEdit}
                  onRemoveServiceFromBranch={handleRemoveServiceFromBranchEdit}
                />
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="p-6 space-y-6 mt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Weekly Schedule</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure working hours for each day. You can add multiple time slots to work at different branches on the same day.
                  <br />
                  <span className="text-xs text-blue-600">Example: Morning at Main Branch (8:00-12:00), Afternoon at Downtown Branch (1:00 - 6:00)</span>
                </p>

                <div className="space-y-4">
                  {daysOfWeek.map((day) => (
                    <DayScheduleComponent key={day.key} day={day} isCreate={false} />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

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
              disabled={isEditUploading || isUpdating}
            >
              <Pencil className="w-4 h-4 mr-2" />
              {isUpdating ? "Updating..." : "Update Dental Professional"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DoctorsPage;