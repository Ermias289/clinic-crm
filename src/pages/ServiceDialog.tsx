import { useEffect, useState } from "react";
import { MedicalService, servicesService } from "../lib/api/servicesService";

interface Props {
  open: boolean;
  onClose: () => void;
  service?: MedicalService | null;
  onSaved: () => void;
}

const ServiceDialog = ({ open, onClose, service, onSaved }: Props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setPrice(service.price);
    } else {
      setName("");
      setPrice(0);
    }
  }, [service]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (service) {
      await servicesService.update(service.id, { name, price });
    } else {
      await servicesService.create({ name, price });
    }

    onSaved();
    onClose();
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h3>{service ? "Edit Service" : "Add Service"}</h3>

        <input
          placeholder="Service name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <div className="actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>
            {service ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDialog;
