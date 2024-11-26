import * as yup from "yup";

type ValidationResult<T> = { error?: string; values?: T };

const formatErrorMessage = (message: string) =>
  message.charAt(0).toUpperCase() +
  message.slice(1) +
  (message.endsWith(".") ? "" : ".");
export const yupValidate = async <T extends object>(
  schema: yup.Schema,
  value: T
): Promise<ValidationResult<T>> => {
  try {
    const data = await schema.validate(value);
    return { values: data };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { error: formatErrorMessage(error.message) };
    } else {
      return { error: formatErrorMessage((error as any).message) };
    }
  }
};

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

yup.addMethod(yup.string, "email", function validateEmail(message) {
  return this.matches(emailRegex, {
    message,
    name: "email",
    excludeEmptyString: true,
  });
});

const password = {
  password: yup
    .string()
    .required()
    .min(8, "Password must be at least 8 characters")
    .matches(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
};

export const newUserSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  name: yup.string().required("Name is required"),
  ...password,
});

export const signInSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  ...password,
});

export const newProductSchema = yup.object({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Description is required"),
  price: yup.string().transform((value) => {
    if (isNaN(+value)) return "";
    return value;
  }),
  purchasingDate: yup.date().required("Purchasing date is required"),
  category: yup.string().required("Category is required"),
  // condition: yup.string().required("Condition is required"),
  // images: yup.array().min(1, "At least one image is required"),
});
