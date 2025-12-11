
"use client";

import { useState } from "react";

interface DentistryServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: any) => void;
  service?: any;
}

export default function DentistryServiceModal({
  isOpen,
  onClose,
  onSave,
  service,
}: DentistryServiceModalProps) {
  const [name, setName] = useState(service?.name || "");
  const [description, setDescription] = useState(service?.description || "");
  const [price, setPrice] = useState(service?.price || "");

  const handleSave = () => {
    onSave({ ...service, name, description, price });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {service ? "Edit Service" : "Add Service"}
        </h3>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
        </div>
        <div className="items-center px-4 py-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="mt-2 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
