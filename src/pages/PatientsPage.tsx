import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Mail, Phone, Calendar } from "lucide-react";
import { mockPatients } from "@/data/mockData";

const PatientsPage = () => {
  return (
    <DashboardLayout title="Patients" subtitle="View and manage patient records">
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search patients..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>All Patients ({mockPatients.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr><th>Patient</th><th>Email</th><th>Phone</th><th>Registered</th></tr>
            </thead>
            <tbody>
              {mockPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                        <p className="text-xs text-muted-foreground">{patient.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td><div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" />{patient.email}</div></td>
                  <td><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" />{patient.phone}</div></td>
                  <td><div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" />{patient.registeredAt}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default PatientsPage;
