
"use client";

import { useEffect, useState } from "react";
import ReceptionistModal from "../../components/modals/ReceptionistModal";

interface User {
  id: number;
  name: string;
  email: string;
  userRoleId: number;
}

export default function Receptionists() {
  const [receptionists, setReceptionists] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceptionist, setSelectedReceptionist] = useState<User | null>(null);
  const [receptionistRoleId, setReceptionistRoleId] = useState<number | null>(null);


  const fetchReceptionists = async () => {
    try {
      const roleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/UserRole/getRoleByName?Name=Receptionist`);
      if (!roleResponse.ok) {
        console.error("Failed to fetch receptionist role");
        return;
      }
      const role = await roleResponse.json();
      const receptionistRoleId = role.id;
      setReceptionistRoleId(receptionistRoleId);

      const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User`);
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        const filteredReceptionists = users.filter(
          (user: User) => user.userRoleId === receptionistRoleId
        );
        setReceptionists(filteredReceptionists);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("An error occurred while fetching receptionists:", error);
    }
  };

  useEffect(() => {
    fetchReceptionists();
  }, []);

  const handleOpenModal = (receptionist: User | null = null) => {
    setSelectedReceptionist(receptionist);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReceptionist(null);
    setIsModalOpen(false);
  };

  const handleSave = async (receptionist: User) => {
    const method = receptionist.id ? "PUT" : "POST";
    const url = receptionist.id
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/User`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/User`;

    const body = {
        ...receptionist,
        userRoleId: receptionistRoleId
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchReceptionists();
        handleCloseModal();
      } else {
        console.error("Failed to save receptionist");
      }
    } catch (error) {
      console.error("An error occurred while saving the receptionist:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchReceptionists();
      } else {
        console.error("Failed to delete receptionist");
      }
    } catch (error) {
      console.error("An error occurred while deleting the receptionist:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Receptionists</h1>
      <div className="w-full max-w-4xl">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Receptionist
          </button>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {receptionists.map((receptionist) => (
              <tr key={receptionist.id}>
                <td className="py-2 px-4 border-b text-center">{receptionist.id}</td>
                <td className="py-2 px-4 border-b">{receptionist.name}</td>
                <td className="py-2 px-4 border-b">{receptionist.email}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleOpenModal(receptionist)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(receptionist.id)}
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
      <ReceptionistModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        receptionist={selectedReceptionist}
      />
    </main>
  );
}
