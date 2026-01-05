import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  MapPin,
  Stethoscope,
  AlertTriangle,
  Contact,
  Hash,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { patientsService, Patient, AddPatientDTO, UpdatePatientDTO } from "@/lib/api/patients";

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Selected patient states
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  
  // Form state for add/edit
  const [formData, setFormData] = useState<AddPatientDTO>({
    fName: "",
    mName: "",
    lName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    alergies: "",
    chronicConditions: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    address: "",
    subCity: "",
    country: "",
    city: "",
    dateOfBirth: "",
    requiresUserAccount: false,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientsService.getAll();
      setPatients(data ?? []);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    const nameMatch = `${p.fName ?? ""} ${p.lName ?? ""} ${p.mName ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    
    const phoneMatch = phoneFilter ? 
      (p.phoneNumber ?? "").includes(phoneFilter) : true;
    
    return nameMatch && phoneMatch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  // Handle view patient
  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewDialogOpen(true);
  };

  // Handle edit patient
  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({
      fName: patient.fName || "",
      mName: patient.mName || "",
      lName: patient.lName || "",
      email: patient.email || "",
      phoneNumber: patient.phoneNumber || "",
      gender: patient.gender || "",
      alergies: patient.alergies || "",
      chronicConditions: patient.chronicConditions || "",
      emergencyContactName: patient.emergencyContactName || "",
      emergencyContactPhone: patient.emergencyContactPhone || "",
      address: patient.address || "",
      subCity: patient.subCity || "",
      country: patient.country || "",
      city: patient.city || "",
      dateOfBirth: patient.dateOfBirth || "",
      requiresUserAccount: patient.requiresUserAccount || false,
    });
    setEditDialogOpen(true);
  };

  // Handle delete patient
  const handleDeletePatient = (patient: Patient) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!patientToDelete) return;
    
    try {
      await patientsService.delete(patientToDelete.id);
      setPatients(patients.filter(p => p.id !== patientToDelete.id));
      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
    } catch (err) {
      console.error("Failed to delete patient:", err);
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  // Handle add patient
  const handleAddPatient = async () => {
    try {
      const newPatient = await patientsService.create(formData);
      setPatients([...patients, newPatient]);
      toast({
        title: "Success",
        description: "Patient added successfully",
      });
      setAddDialogOpen(false);
      resetForm();
    } catch (err: any) {
      console.error("Failed to add patient:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add patient",
        variant: "destructive",
      });
    }
  };

  // Handle update patient
  const handleUpdatePatient = async () => {
    if (!selectedPatient) return;
    
    try {
      const updatedPatient = await patientsService.update({
        ...formData,
        id: selectedPatient.id,
      } as UpdatePatientDTO);
      
      setPatients(patients.map(p => 
        p.id === selectedPatient.id ? updatedPatient : p
      ));
      toast({
        title: "Success",
        description: "Patient updated successfully",
      });
      setEditDialogOpen(false);
      resetForm();
      setSelectedPatient(null);
    } catch (err: any) {
      console.error("Failed to update patient:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update patient",
        variant: "destructive",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fName: "",
      mName: "",
      lName: "",
      email: "",
      phoneNumber: "",
      gender: "",
      alergies: "",
      chronicConditions: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      address: "",
      subCity: "",
      country: "",
      city: "",
      dateOfBirth: "",
      requiresUserAccount: false,
    });
  };

  // Handle form input change
  const handleInputChange = (field: keyof AddPatientDTO, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // Format age from date of birth
  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return "-";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <DashboardLayout 
      title="Patients" 
      subtitle="View and manage patient records"
      actions={
        <Button onClick={() => setAddDialogOpen(true)} variant="dental">
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      }
    >
      {/* Search and Filter Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Search */}
            <div className="space-y-2">
              <Label htmlFor="name-search">Search by Name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name-search"
                  placeholder="Search patients by name..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Phone Filter */}
            <div className="space-y-2">
              <Label htmlFor="phone-filter">Filter by Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone-filter"
                  placeholder="Filter by phone number..."
                  className="pl-10"
                  value={phoneFilter}
                  onChange={(e) => setPhoneFilter(e.target.value)}
                />
                {phoneFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setPhoneFilter("")}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p>Loading patients...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Patients ({filteredPatients.length})</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                Showing {startIndex + 1}-{Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Patient Information</th>
                      <th className="text-left p-4 font-medium">Contact</th>
                      <th className="text-left p-4 font-medium">Health Info</th>
                      <th className="text-left p-4 font-medium">Location</th>
                      <th className="text-left p-4 font-medium">Registered</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPatients.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            No patients found
                          </td>
                        </tr>
                      ) : (
                      currentPatients.map((patient) => (
                        <tr key={patient.id} className="border-b hover:bg-muted/25">
                          {/* Patient Information */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {patient.fName || ""} {patient.mName || ""} {patient.lName || ""}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                                    {patient.gender || "N/A"}
                                  </span>
                                  {patient.dateOfBirth && (
                                    <span className="text-xs text-muted-foreground">
                                      Age: {calculateAge(patient.dateOfBirth)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3 text-muted-foreground" />
                                <span className="text-sm truncate max-w-[150px]">
                                  {patient.email || "-"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 text-muted-foreground" />
                                <span className="text-sm">
                                  {patient.phoneNumber || "-"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Health Info */}
                          <td className="p-4">
                            <div className="space-y-1">
                              {patient.alergies ? (
                                <div className="flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                                  <span className="text-xs">Has allergies</span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">No allergies</span>
                              )}
                              {patient.chronicConditions ? (
                                <div className="flex items-center gap-1">
                                  <Stethoscope className="w-3 h-3 text-red-500" />
                                  <span className="text-xs">Chronic conditions</span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">No conditions</span>
                              )}
                            </div>
                          </td>

                          {/* New Location Column */}
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                <span className="text-sm truncate max-w-[150px]">
                                  {patient.city || patient.subCity || "-"}
                                </span>
                              </div>
                              {patient.country && (
                                <span className="text-xs text-muted-foreground">
                                  {patient.country}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Registration Date */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">
                                {formatDate(patient.createdAt)}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleViewPatient(patient)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditPatient(patient)}
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleDeletePatient(patient)}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "dental" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* View Patient Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6">
              {/* Patient Header */}
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selectedPatient.fName} {selectedPatient.mName} {selectedPatient.lName}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">ID: {selectedPatient.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedPatient.gender}</span>
                    </div>
                    {selectedPatient.dateOfBirth && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(selectedPatient.dateOfBirth)} (Age: {calculateAge(selectedPatient.dateOfBirth)})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedPatient.email || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedPatient.phoneNumber || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">
                          {selectedPatient.address || "-"}
                          {selectedPatient.city && `, ${selectedPatient.city}`}
                          {selectedPatient.subCity && `, ${selectedPatient.subCity}`}
                          {selectedPatient.country && `, ${selectedPatient.country}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Health Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Allergies</p>
                      <div className="p-3 bg-muted rounded-md">
                        <p className={selectedPatient.alergies ? "" : "text-muted-foreground"}>
                          {selectedPatient.alergies || "No allergies recorded"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Chronic Conditions</p>
                      <div className="p-3 bg-muted rounded-md">
                        <p className={selectedPatient.chronicConditions ? "" : "text-muted-foreground"}>
                          {selectedPatient.chronicConditions || "No chronic conditions recorded"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              {(selectedPatient.emergencyContactName || selectedPatient.emergencyContactPhone) && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg">Emergency Contact</h4>
                  <div className="flex items-center gap-3">
                    <Contact className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium">{selectedPatient.emergencyContactName || "-"}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPatient.emergencyContactPhone || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Information */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold text-lg">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">User Account</p>
                    <p className="font-medium">
                      {selectedPatient.requiresUserAccount ? "Required" : "Not Required"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDate(selectedPatient.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    {/* <p className="font-medium">{formatDate(selectedPatient.updatedAt)}</p> */}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Patient Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fName">First Name *</Label>
                  <Input
                    id="fName"
                    value={formData.fName}
                    onChange={(e) => handleInputChange("fName", e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mName">Middle Name</Label>
                  <Input
                    id="mName"
                    value={formData.mName || ""}
                    onChange={(e) => handleInputChange("mName", e.target.value)}
                    placeholder="Middle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lName">Last Name *</Label>
                  <Input
                    id="lName"
                    value={formData.lName}
                    onChange={(e) => handleInputChange("lName", e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    placeholder="Male/Female/Other"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="patient@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="+251XXXXXXXXX"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Street address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subCity">Sub City</Label>
                  <Input
                    id="subCity"
                    value={formData.subCity}
                    onChange={(e) => handleInputChange("subCity", e.target.value)}
                    placeholder="Sub city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Health Information</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alergies">Allergies</Label>
                  <Input
                    id="alergies"
                    value={formData.alergies}
                    onChange={(e) => handleInputChange("alergies", e.target.value)}
                    placeholder="List any allergies"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                  <Input
                    id="chronicConditions"
                    value={formData.chronicConditions}
                    onChange={(e) => handleInputChange("chronicConditions", e.target.value)}
                    placeholder="List any chronic conditions"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                    placeholder="Emergency contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                    placeholder="Emergency contact phone"
                  />
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Account Settings</h4>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requiresUserAccount"
                  checked={formData.requiresUserAccount}
                  onChange={(e) => handleInputChange("requiresUserAccount", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="requiresUserAccount" className="cursor-pointer">
                  Requires User Account
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddPatient}
              disabled={!formData.fName || !formData.lName}
            >
              Add Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fName">First Name *</Label>
                  <Input
                    id="edit-fName"
                    value={formData.fName}
                    onChange={(e) => handleInputChange("fName", e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-mName">Middle Name</Label>
                  <Input
                    id="edit-mName"
                    value={formData.mName || ""}
                    onChange={(e) => handleInputChange("mName", e.target.value)}
                    placeholder="Middle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lName">Last Name *</Label>
                  <Input
                    id="edit-lName"
                    value={formData.lName}
                    onChange={(e) => handleInputChange("lName", e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Input
                    id="edit-gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    placeholder="Male/Female/Other"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dateOfBirth">Date of Birth</Label>
                  <Input
                    id="edit-dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="patient@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phoneNumber">Phone Number</Label>
                  <Input
                    id="edit-phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="+251XXXXXXXXX"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input
                    id="edit-address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Street address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-subCity">Sub City</Label>
                  <Input
                    id="edit-subCity"
                    value={formData.subCity}
                    onChange={(e) => handleInputChange("subCity", e.target.value)}
                    placeholder="Sub city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-country">Country</Label>
                  <Input
                    id="edit-country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Health Information</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-alergies">Allergies</Label>
                  <Input
                    id="edit-alergies"
                    value={formData.alergies}
                    onChange={(e) => handleInputChange("alergies", e.target.value)}
                    placeholder="List any allergies"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-chronicConditions">Chronic Conditions</Label>
                  <Input
                    id="edit-chronicConditions"
                    value={formData.chronicConditions}
                    onChange={(e) => handleInputChange("chronicConditions", e.target.value)}
                    placeholder="List any chronic conditions"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-emergencyContactName">Emergency Contact Name</Label>
                  <Input
                    id="edit-emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                    placeholder="Emergency contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-emergencyContactPhone">Emergency Contact Phone</Label>
                  <Input
                    id="edit-emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                    placeholder="Emergency contact phone"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdatePatient}
              disabled={!formData.fName || !formData.lName}
            >
              Update Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete patient{" "}
              <span className="font-semibold">
                {patientToDelete?.fName} {patientToDelete?.lName}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PatientsPage;