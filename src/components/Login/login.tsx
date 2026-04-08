import React, { useState } from "react";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import backImg from "../../assets/images/Loginbk.jpg";
const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { superAdminlogin } = useAuth();

  /* =========================
     State
  ========================= */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     Submit
  ========================= */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await superAdminlogin(email, password);

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      switch (storedUser.role) {
        case "SUPER_ADMIN":
          navigate("/super/dashboard");
          break;

        case "SHOP_ADMIN":
          navigate("/shop/dashboard");
          break;

        default:
          navigate("/staff/dashboard");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={backImg}
          className="h-full w-full object-cover"
          alt="Background"
        />
        {/* Professional Overlay: Darkens the image slightly for better focus on the card */}
        {/* <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div> */}
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#] backdrop-blur-sm rounded-2xl shadow-2xl p-10 m-6 z-10 border-2 border-blue-500">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Sign In
          </h1>
          <p className="text-gray-500 text-sm">
            Access your shop management dashboard
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 ml-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none pr-12"
                required
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 ml-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <p className="text-red-600 text-xs font-bold uppercase tracking-wide text-center">
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Verifying...</span>
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
