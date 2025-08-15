import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik, FormikHelpers } from "formik";
import logo from "../../assets/logo-login.png";

interface FormValues {
  email: string;
  password: string;
}

const CoverSignIn: React.FC = () => {
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const DUMMY_CREDENTIALS: FormValues = {
    email: "babu.s@sirc.sa",
    password: "Babu@123",
  };

  const validation = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please Enter Your Email")
        .email("Invalid Email Format"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values: FormValues, actions: FormikHelpers<FormValues>) => {
      setLoading(true);
      setErrorMsg(null);

      setTimeout(() => {
        if (
          values.email === DUMMY_CREDENTIALS.email &&
          values.password === DUMMY_CREDENTIALS.password
        ) {
          const authUser = {
            email: values.email,
            name: "Babu",
            role: "User",
            accessToken: "dummyAccessToken123",
          };

          sessionStorage.setItem("authUser", JSON.stringify(authUser));
          localStorage.setItem("isAuthenticated", "true");

          toast.success("Login Successful!");
          navigate("/");
        } else {
          setErrorMsg("Invalid email or password.");
          toast.error("Invalid email or password.");
        }
        setLoading(false);
        actions.setSubmitting(false);
      }, 1000);
    },
  });

  document.title = "AMS Genie | Signin";

  return (
    <div className="min-h-screen flex items-center justify-center card-border ">
      <div
        className="w-full max-w-sm px-6 py-8 bg-transparent text-white card-border"
        style={{ borderRadius: "20px" }}
      >
        <div className="flex justify-center mb-2">
          <img src={logo} alt="AMS Genie" width="170px" />
        </div>

        <h1 className="text-2xl font-semibold text-center mb-1 text-[#f4d06f]">AMS Genie</h1>
        <p className="text-white text-center italic font-normal text-sm">
          Stay lit .. Stay smart
        </p>
        <br /><br />
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
            className={`w-full px-4 py-2   rounded-md   bg-transparent focus:outline-none focus:ring-2`}
            style={{ boxShadow: "0 0 0 2px #003386" }}
          />

          {validation.touched.email && validation.errors.email && (
            <div className="text-sm  mt-1  text-red-400">
              {validation.errors.email}
            </div>
          )}

          <div className="relative">
            <input
              type={passwordShow ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={validation.values.password}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              className={`w-full px-4 py-2   rounded-md  bg-transparent focus:outline-none focus:ring-2`}
              style={{ boxShadow: "0 0 0 2px #003386" }}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
              onClick={() => setPasswordShow(!passwordShow)}
            >
              <i className={`ri-${passwordShow ? "eye-off" : "eye"}-line`}></i>
            </button>
            {validation.touched.password && validation.errors.password && (
              <div className="text-sm text-red-400 mt-1">
                {validation.errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-white transition duration-300"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-center mt-4">
            <Link
              to="/forgot-password"
              className="text-gray-300 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoverSignIn;
