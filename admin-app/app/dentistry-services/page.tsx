
"use client";

import { useEffect, useState } from "react";
import DentistryServiceModal from "../../components/modals/DentistryServiceModal";

interface DentistryService {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function DentistryServices() {
  const [services, setServices] = useState<DentistryService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<DentistryService | null>(null);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/MedicalService`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        console.error("Failed to fetch services");
      }
    } catch (error) {
      console.error("An error occurred while fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (service: DentistryService | null = null) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  const handleSave = async (service: DentistryService) => {
    const method = service.id ? "PUT" : "POST";
    const url = service.id
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/MedicalService`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/MedicalService`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(service),
      });

      if (response.ok) {
        await fetchServices();
        handleCloseModal();
      } else {
        console.error("Failed to save service");
      }
    } catch (error) {
      console.error("An error occurred while saving the service:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/MedicalService/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchServices();
      } else {
        console.error("Failed to delete service");
      }
    } catch (error) {
      console.error("An error occurred while deleting the service:", error);
    }
  };


  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Dentistry Services</h1>
      <div className="w-full max-w-4xl">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Service
          </button>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td className="py-2 px-4 border-b text-center">{service.id}</td>
                <td className="py-2 px-4 border-b">{service.name}</td>
                <td className="py-2 px-4 border-b">{service.description}</td>
                <td className="py-2 px-4 border-b text-right">{service.price}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleOpenModal(service)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DentistryServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        service={selectedService}
      />
    </main>
  );
}
