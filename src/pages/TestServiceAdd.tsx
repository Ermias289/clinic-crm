import { useState } from "react";
import { medicalServicesService } from "@/lib/api/medicalServices";
import { branchService } from "@/lib/api/branches";
import { medicalProfessionalsService } from "@/lib/api/medicalProfessionals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const TestServiceAdd = () => {
  const [name, setName] = useState("Test Service");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const testGetBranches = async () => {
    try {
      console.log("Testing get branches...");
      const branchData = await branchService.getAll();
      console.log("Branches retrieved:", branchData);
      setBranches(branchData);
      
      toast({
        title: "Success!",
        description: `Retrieved ${branchData.length} branches`,
      });
    } catch (error: any) {
      console.error("Error getting branches:", error);
      
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to get branches",
        variant: "destructive",
      });
    }
  };

  const testGetDoctors = async () => {
    try {
      console.log("Testing get doctors...");
      const doctorData = await medicalProfessionalsService.getAll();
      console.log("Doctors retrieved:", doctorData);
      setDoctors(doctorData);
      
      toast({
        title: "Success!",
        description: `Retrieved ${doctorData.length} doctors`,
      });
    } catch (error: any) {
      console.error("Error getting doctors:", error);
      
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to get doctors",
        variant: "destructive",
      });
    }
  };

  const testAddService = async () => {
    setLoading(true);
    try {
      // First ensure we have branches
      if (branches.length === 0) {
        await testGetBranches();
        return;
      }

      const serviceData = {
        name,
        description: "Test description",
        durationInMinutes: duration,
        servicePicture: "",
        medicalProfessionalsId: [],
        branchesId: [branches[0].id], // Use first available branch
      };

      console.log("Testing service creation with data:", serviceData);
      
      const result = await medicalServicesService.create(serviceData);
      
      console.log("Service created successfully:", result);
      
      toast({
        title: "Success!",
        description: "Service created successfully",
      });
    } catch (error: any) {
      console.error("Error creating service:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testGetServices = async () => {
    try {
      console.log("Testing get services...");
      const services = await medicalServicesService.getAll();
      console.log("Services retrieved:", services);
      
      toast({
        title: "Success!",
        description: `Retrieved ${services.length} services`,
      });
    } catch (error: any) {
      console.error("Error getting services:", error);
      
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to get services",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Test Service Add</h1>
      
      <div className="space-y-4 max-w-md">
        <div>
          <label>Service Name:</label>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        
        <div>
          <label>Duration (minutes):</label>
          <Input 
            type="number"
            value={duration} 
            onChange={(e) => setDuration(parseInt(e.target.value) || 0)} 
          />
        </div>
        
        <div className="space-x-2 space-y-2">
          <Button 
            onClick={testGetBranches}
            variant="outline"
          >
            Test Get Branches ({branches.length})
          </Button>
          
          <Button 
            onClick={testGetDoctors}
            variant="outline"
          >
            Test Get Doctors ({doctors.length})
          </Button>
          
          <Button 
            onClick={testGetServices}
            variant="outline"
          >
            Test Get Services
          </Button>
          
          <Button 
            onClick={testAddService} 
            disabled={loading}
          >
            {loading ? "Creating..." : "Test Add Service"}
          </Button>
        </div>

        {branches.length > 0 && (
          <div>
            <h3 className="font-semibold">Available Branches:</h3>
            <ul className="text-sm">
              {branches.map((branch) => (
                <li key={branch.id}>
                  {branch.id}: {branch.name} - {branch.address}
                </li>
              ))}
            </ul>
          </div>
        )}

        {doctors.length > 0 && (
          <div>
            <h3 className="font-semibold">Available Doctors:</h3>
            <ul className="text-sm">
              {doctors.slice(0, 3).map((doctor) => (
                <li key={doctor.id}>
                  {doctor.id}: Dr. {doctor.fName} {doctor.lName} - {doctor.specialty}
                </li>
              ))}
              {doctors.length > 3 && <li>... and {doctors.length - 3} more</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestServiceAdd;