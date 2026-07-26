import { useState } from "react";

import type { ChangeEvent, SubmitEvent } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type {
  CheckoutFormValues,
  PaymentMethod,
  ShippingAddress,
} from "../../types/checkout";

interface CheckoutFormProps {
  isSubmitting?: boolean;

  initialShippingAddress?: Partial<ShippingAddress>;

  onSubmit: (values: CheckoutFormValues) => void | Promise<void>;
}

type ShippingAddressErrors = Partial<Record<keyof ShippingAddress, string>>;

const EMPTY_SHIPPING_ADDRESS: ShippingAddress = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  postalCode: "",
  country: "",
};

function createInitialShippingAddress(
  initialAddress: Partial<ShippingAddress> | undefined,
): ShippingAddress {
  return {
    ...EMPTY_SHIPPING_ADDRESS,
    ...initialAddress,
  };
}

function normalizeShippingAddress(address: ShippingAddress): ShippingAddress {
  return {
    firstName: address.firstName.trim(),
    lastName: address.lastName.trim(),
    email: address.email.trim().toLowerCase(),
    phone: address.phone.trim(),
    street: address.street.trim(),
    city: address.city.trim(),
    postalCode: address.postalCode.trim(),
    country: address.country.trim(),
  };
}

function validateShippingAddress(
  address: ShippingAddress,
): ShippingAddressErrors {
  const errors: ShippingAddressErrors = {};

  if (!address.firstName) {
    errors.firstName = "First name is required.";
  }

  if (!address.lastName) {
    errors.lastName = "Last name is required.";
  }

  if (!address.email) {
    errors.email = "Email is required.";
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(address.email)) {
      errors.email = "Enter a valid email address.";
    }
  }

  if (!address.phone) {
    errors.phone = "Phone number is required.";
  } else {
    const phoneDigits = address.phone.replace(/\D/g, "");

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      errors.phone = "Enter a valid phone number.";
    }
  }

  if (!address.street) {
    errors.street = "Street address is required.";
  }

  if (!address.city) {
    errors.city = "City is required.";
  }

  if (!address.postalCode) {
    errors.postalCode = "Postal code is required.";
  }

  if (!address.country) {
    errors.country = "Country is required.";
  }

  return errors;
}

export function CheckoutForm({
  isSubmitting = false,
  initialShippingAddress,
  onSubmit,
}: CheckoutFormProps) {
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(() =>
    createInitialShippingAddress(initialShippingAddress),
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const [fieldErrors, setFieldErrors] = useState<ShippingAddressErrors>({});

  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  function updateAddressField(
    field: keyof ShippingAddress,
    value: string,
  ): void {
    setShippingAddress((currentAddress) => ({
      ...currentAddress,
      [field]: value,
    }));

    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const updatedErrors = {
        ...currentErrors,
      };

      delete updatedErrors[field];

      return updatedErrors;
    });

    setValidationMessage(null);
  }

  function handlePaymentMethodChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    setPaymentMethod(event.target.value as PaymentMethod);
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const normalizedAddress = normalizeShippingAddress(shippingAddress);

    const errors = validateShippingAddress(normalizedAddress);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);

      setValidationMessage(
        "Check the highlighted fields before placing your order.",
      );

      return;
    }

    setFieldErrors({});
    setValidationMessage(null);

    setShippingAddress(normalizedAddress);

    await onSubmit({
      shippingAddress: normalizedAddress,

      paymentMethod,
    });
  }

  return (
    <Paper
      component="form"
      variant="outlined"
      noValidate
      onSubmit={handleSubmit}
      sx={{
        p: {
          xs: 2,
          sm: 3,
        },
      }}
    >
      <Stack spacing={3}>
        <div>
          <Typography
            component="h2"
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            Shipping information
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Review your information and enter the address where the order should
            be delivered.
          </Typography>
        </div>

        {validationMessage && (
          <Alert severity="error">{validationMessage}</Alert>
        )}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >
          <TextField
            label="First name"
            value={shippingAddress.firstName}
            onChange={(event) => {
              updateAddressField("firstName", event.target.value);
            }}
            name="firstName"
            autoComplete="given-name"
            required
            fullWidth
            disabled={isSubmitting}
            error={fieldErrors.firstName !== undefined}
            helperText={fieldErrors.firstName}
          />

          <TextField
            label="Last name"
            value={shippingAddress.lastName}
            onChange={(event) => {
              updateAddressField("lastName", event.target.value);
            }}
            name="lastName"
            autoComplete="family-name"
            required
            fullWidth
            disabled={isSubmitting}
            error={fieldErrors.lastName !== undefined}
            helperText={fieldErrors.lastName}
          />
        </Stack>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >
          <TextField
            label="Email"
            type="email"
            value={shippingAddress.email}
            onChange={(event) => {
              updateAddressField("email", event.target.value);
            }}
            name="email"
            autoComplete="email"
            required
            fullWidth
            disabled={isSubmitting}
            error={fieldErrors.email !== undefined}
            helperText={fieldErrors.email}
          />

          <TextField
            label="Phone"
            type="tel"
            value={shippingAddress.phone}
            onChange={(event) => {
              updateAddressField("phone", event.target.value);
            }}
            name="phone"
            autoComplete="tel"
            required
            fullWidth
            disabled={isSubmitting}
            error={fieldErrors.phone !== undefined}
            helperText={fieldErrors.phone}
          />
        </Stack>

        <TextField
          label="Street and house number"
          value={shippingAddress.street}
          onChange={(event) => {
            updateAddressField("street", event.target.value);
          }}
          name="street"
          autoComplete="street-address"
          required
          fullWidth
          disabled={isSubmitting}
          error={fieldErrors.street !== undefined}
          helperText={fieldErrors.street}
        />

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >
          <TextField
            label="City"
            value={shippingAddress.city}
            onChange={(event) => {
              updateAddressField("city", event.target.value);
            }}
            name="city"
            autoComplete="address-level2"
            required
            fullWidth
            disabled={isSubmitting}
            error={fieldErrors.city !== undefined}
            helperText={fieldErrors.city}
          />

          <TextField
            label="Postal code"
            value={shippingAddress.postalCode}
            onChange={(event) => {
              updateAddressField("postalCode", event.target.value);
            }}
            name="postalCode"
            autoComplete="postal-code"
            required
            fullWidth
            disabled={isSubmitting}
            error={fieldErrors.postalCode !== undefined}
            helperText={fieldErrors.postalCode}
          />
        </Stack>

        <TextField
          label="Country"
          value={shippingAddress.country}
          onChange={(event) => {
            updateAddressField("country", event.target.value);
          }}
          name="country"
          autoComplete="country-name"
          required
          fullWidth
          disabled={isSubmitting}
          error={fieldErrors.country !== undefined}
          helperText={fieldErrors.country}
        />

        <FormControl disabled={isSubmitting}>
          <FormLabel id="payment-method-label">Payment method</FormLabel>

          <RadioGroup
            aria-labelledby="payment-method-label"
            name="paymentMethod"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
          >
            <FormControlLabel value="card" control={<Radio />} label="Card" />

            <FormControlLabel
              value="cash-on-delivery"
              control={<Radio />}
              label="Cash on delivery"
            />
          </RadioGroup>
        </FormControl>

        <Typography variant="caption" color="text.secondary">
          Card payment is simulated in this frontend demo. No real payment
          information is collected.
        </Typography>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={18} color="inherit" />
            ) : undefined
          }
        >
          {isSubmitting ? "Creating order..." : "Place order"}
        </Button>
      </Stack>
    </Paper>
  );
}
