import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressDetails } from "./types";

interface AddressFormProps {
  address: AddressDetails;
  onChange: (address: AddressDetails) => void;
  readOnly?: boolean;
}

export const AddressForm = ({ address, onChange, readOnly = false }: AddressFormProps) => {
  const handleChange = (field: keyof AddressDetails, value: string) => {
    onChange({ ...address, [field]: value });
  };

  return (
    <div className="grid gap-4">
      <div className="address-field">
        <Label htmlFor="formattedAddress">Full Address</Label>
        <Input
          id="formattedAddress"
          value={address.formattedAddress}
          onChange={(e) => handleChange("formattedAddress", e.target.value)}
          readOnly={readOnly}
          className="h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="address-field">
          <Label htmlFor="streetNumber">Street Number</Label>
          <Input
            id="streetNumber"
            value={address.streetNumber}
            onChange={(e) => handleChange("streetNumber", e.target.value)}
            readOnly={readOnly}
            className="h-11"
          />
        </div>
        <div className="address-field">
          <Label htmlFor="route">Street Name</Label>
          <Input
            id="route"
            value={address.route}
            onChange={(e) => handleChange("route", e.target.value)}
            readOnly={readOnly}
            className="h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="address-field">
          <Label htmlFor="premise">Building/Apt</Label>
          <Input
            id="premise"
            value={address.premise || ""}
            onChange={(e) => handleChange("premise", e.target.value)}
            placeholder="Apt, Suite, Unit"
            className="h-11"
          />
        </div>
        <div className="address-field">
          <Label htmlFor="locality">City</Label>
          <Input
            id="locality"
            value={address.locality}
            onChange={(e) => handleChange("locality", e.target.value)}
            readOnly={readOnly}
            className="h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="address-field">
          <Label htmlFor="administrativeArea">State/Region</Label>
          <Input
            id="administrativeArea"
            value={address.administrativeArea}
            onChange={(e) => handleChange("administrativeArea", e.target.value)}
            readOnly={readOnly}
            className="h-11"
          />
        </div>
        <div className="address-field">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            value={address.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
            readOnly={readOnly}
            className="h-11"
          />
        </div>
        <div className="address-field">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={address.country}
            onChange={(e) => handleChange("country", e.target.value)}
            readOnly={readOnly}
            className="h-11"
          />
        </div>
      </div>
    </div>
  );
};
