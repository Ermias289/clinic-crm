
"use client";

import { useEffect, useState } from "react";
import MedicalProfessionalModal from "../../components/modals/MedicalProfessionalModal";

interface MedicalProfessional {
  id: number;
  name: string;
  specialty: string;
  contact: string;
}

export default function MedicalProfessionals() {
  const [professionals, setProfessionals] = useState<MedicalProfessional[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<MedicalProfessional | null>(null);

  const fetchProfessionals = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/MedicalProfessional`);
      if (response.ok) {
        const data = await response.json();
        setProfessionals(data);
      } else {
        console.error("Failed to fetch medical professionals");
      }
    } catch (error) {
      console.error("An error occurred while fetching medical professionals:", error);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleOpenModal = (professional: MedicalProfessional | null = null) => {
    setSelectedProfessional(professional);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProfessional(null);
    setIsModalOpen(false);
  };

  const handleSave = async (professional: MedicalProfessional) => {
    const method = professional.id ? "PUT" : "POST";
    const url = professional.id
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/MedicalProfessional`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/MedicalProfessional`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(professional),
      });

      if (response.ok) {
        await fetchProfessionals();
        handleCloseModal();
      } else {
        console.error("Failed to save professional");
      }
    } catch (error) {
      console.error("An error occurred while saving the professional:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/MedicalProfessional/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProfessionals();
      } else {
        console.error("Failed to delete professional");
      }
    } catch (error) {
      console.error("An error occurred while deleting the professional:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Medical Professionals</h1>
      <div className="w-full max-w-4xl">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Professional
          </button>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Specialty</th>
              <th className="py-2 px-4 border-b">Contact</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {professionals.map((professional) => (
              <tr key={professional.id}>
                <td className="py-2 px-4 border-b text-center">{professional.id}</td>
                <td className="py-2 px-4 border-b">{professional.name}</td>
                <td className="py-2 px-4 border-b">{professional.specialty}</td>
                <td className="py-2 px-4 border-b">{professional.contact}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleOpenModal(professional)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(professional.id)}
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
      <MedicalProfessionalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        professional={selectedProfessional}
      />
    </main>
  );
}
