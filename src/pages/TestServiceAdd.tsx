import { useState } from "react";
import { medicalServicesService } from "@/lib/api/medicalServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const TestServiceAdd = () => {
  const [name, setName] = useState("Test Service");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);

  const testAddService = async () => {
    setLoading(true);
    try {
      const serviceData = {
        name,
        description: "Test description",
        durationInMinutes: duration,
        servicePicture: "",
        medicalProfessionalsId: [],
        branchesId: [1], // Assuming branch ID 1 exists
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
        
        <div className="space-x-2">
          <Button 
            onClick={testAddService} 
            disabled={loading}
          >
            {loading ? "Creating..." : "Test Add Service"}
          </Button>
          
          <Button 
            onClick={testGetServices}
            variant="outline"
          >
            Test Get Services
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestServiceAdd;