
"use client";

import { useState } from "react";

interface ReceptionistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (receptionist: any) => void;
  receptionist?: any;
}

export default function ReceptionistModal({
  isOpen,
  onClose,
  onSave,
  receptionist,
}: ReceptionistModalProps) {
  const [name, setName] = useState(receptionist?.name || "");
  const [email, setEmail] = useState(receptionist?.email || "");

  const handleSave = () => {
    onSave({ ...receptionist, name, email });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {receptionist ? "Edit Receptionist" : "Add Receptionist"}
        </h3>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
