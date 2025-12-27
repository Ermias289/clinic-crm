import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search,
  ClipboardList,
  Clock,
  DollarSign,
  Edit,
  Trash2
} from "lucide-react";
import { mockServices } from "@/data/mockData";

const ServicesPage = () => {
  return (
    <DashboardLayout title="Medical Services" subtitle="Manage dental services offered at your clinic">
      <Card className="mb-6">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search services..." className="pl-10" />
          </div>
          <Button variant="dental"><Plus className="w-4 h-4" /> Add Service</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockServices.map((service) => (
          <Card key={service.id} className="hover:shadow-dental transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">{service.category}</span>
              </div>
              <CardTitle className="mt-3">{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" /> {service.duration} min
                </div>
                <div className="flex items-center gap-1 font-semibold text-primary">
                  <DollarSign className="w-4 h-4" /> {service.price}
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="flex-1"><Edit className="w-4 h-4 mr-1" /> Edit</Button>
                <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ServicesPage;
