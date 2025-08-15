import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik, FormikHelpers } from "formik";
import logo from "../../assets/logo-login.png";
import { useNavigate, Link } from "react-router-dom";
interface FormValues {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const validation = useFormik<FormValues>({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please Enter Your Email")
        .email("Invalid Email Format"),
    }),
    onSubmit: (values: FormValues, actions: FormikHelpers<FormValues>) => {
      setLoading(true);
      setErrorMsg(null);

      setTimeout(() => {
        toast.success("Reset link sent to your email!");
        setLoading(false);
        actions.setSubmitting(false);
        actions.resetForm();
        navigate("/"); 
      }, 1000);
    },
  });

  document.title = "AMS Genie | Forgot Password";

  return (
    <div className="min-h-screen flex items-center justify-center card-border ">
      <div
        className="w-full max-w-sm px-6 py-8 bg-transparent text-white card-border"
        style={{ borderRadius: "20px" }}
      >
        <div className="flex justify-center mb-1">
          <img src={logo} alt="AMS Genie" width="170px" />
        </div>

        <h1 className="text-2xl font-semibold text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-sm text-center text-gray-300 mb-6">
          Enter your email address to receive password reset instructions.
        </p>

        {errorMsg && (
          <div className="text-red-400 text-center mb-4">{errorMsg}</div>
        )}

        <form onSubmit={validation.handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={validation.values.email}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            className="w-full px-4 py-2 rounded-md bg-transparent focus:outline-none focus:ring-2"
            style={{ boxShadow: "0 0 0 2px #003386" }}
          />

          {validation.touched.email && validation.errors.email && (
            <div className="text-sm text-red-400 mt-1">
              {validation.errors.email}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-white transition duration-300"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          <div className="text-center mt-4">
            <Link to="/login" className="text-gray-300 hover:underline">
              Login?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
