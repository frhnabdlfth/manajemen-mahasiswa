import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout.jsx";
import AuthHeader from "./AuthHeader.jsx";
import AuthMessage from "./AuthMessage.jsx";
import LoginForm from "./LoginForm.jsx";
import RegisterForm from "./RegisterForm.jsx";
import VerifyEmailForm from "./VerifyEmailForm.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const emptyForm = {
  nama: "",
  email: "",
  password: "",
  confirm_password: "",
  code: "",
};

const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function LoginPage({ initialMode = "login", onLogin }) {
  const [mode, setMode] = useState(initialMode);
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifyExpiresIn, setVerifyExpiresIn] = useState(0);
  const [form, setForm] = useState(emptyForm);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isVerify = mode === "verify";

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    if (!isVerify || verifyExpiresIn <= 0) return;

    const timer = setInterval(() => {
      setVerifyExpiresIn((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVerify, verifyExpiresIn]);

  const validateLogin = () => {
    if (!form.email.trim()) return "Email wajib diisi dong.";

    if (!emailRegex.test(form.email.trim())) {
      return "Format email tidak valid.";
    }

    if (!form.password) return "Password wajib diisi dong.";

    return "";
  };

  const validateRegister = () => {
    if (!form.nama.trim()) return "Nama wajib diisi.";

    if (!emailRegex.test(form.email.trim())) {
      return "Format email tidak valid.";
    }

    if (!passwordRegex.test(form.password)) {
      return "Password minimal 8 karakter, wajib ada huruf besar, huruf kecil, angka, dan simbol.";
    }

    if (form.password !== form.confirm_password) {
      return "Konfirmasi password tidak sama.";
    }

    return "";
  };

  const validateVerify = () => {
    if (!form.email.trim()) return "Email wajib diisi.";

    if (!emailRegex.test(form.email.trim())) {
      return "Format email tidak valid.";
    }

    if (!/^[0-9]{6}$/.test(form.code.trim())) {
      return "Kode verifikasi harus 6 digit angka.";
    }

    return "";
  };

  const handleLogin = async () => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || "Login gagal.");
    }

    if (!result.token || !result.user) {
      throw new Error("Response login tidak lengkap dari server.");
    }

    onLogin(result.token, result.user);
  };

  const handleRegister = async () => {
    const registeredEmail = form.email.trim().toLowerCase();

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama: form.nama.trim(),
        email: registeredEmail,
        password: form.password,
        confirm_password: form.confirm_password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || "Registrasi gagal.");
    }

    setVerifyMessage(
      result.message ||
        "Registrasi berhasil. Masukkan kode verifikasi yang dikirim ke email.",
    );

    setVerifyExpiresIn(result.expires_in || 60);

    setForm({
      ...emptyForm,
      email: result.email || registeredEmail,
    });

    navigate("/verify-email");
  };

  const handleVerify = async () => {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email.trim().toLowerCase(),
        code: form.code.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || "Verifikasi email gagal.");
    }

    setVerifyMessage(
      result.message || "Email berhasil diverifikasi. Silakan login.",
    );
    setVerifyExpiresIn(0);

    setForm({
      ...emptyForm,
      email: result.email || form.email.trim().toLowerCase(),
    });

    navigate("/login");
  };

  const handleResendVerification = async () => {
    const email = form.email.trim().toLowerCase();

    if (!email) {
      setError("Email wajib diisi untuk kirim ulang kode.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Gagal mengirim ulang kode.");
      }

      setVerifyMessage(result.message || "Kode baru sudah dikirim ke email.");
      setVerifyExpiresIn(result.expires_in || 60);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = isRegister
      ? validateRegister()
      : isVerify
        ? validateVerify()
        : validateLogin();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (isRegister) {
        await handleRegister();
      } else if (isVerify) {
        await handleVerify();
      } else {
        await handleLogin();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout variant={initialMode === "register" ? "register" : "login"}>
      <AuthHeader mode={mode} />

      <AuthMessage type="error" message={error} />
      <AuthMessage type="success" message={verifyMessage} />

      {isLogin && (
        <LoginForm
          form={form}
          loading={loading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onGoRegister={() => navigate("/register")}
          onGoVerify={() => navigate("/verify-email")}
        />
      )}

      {isRegister && (
        <RegisterForm
          form={form}
          loading={loading}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          setShowPassword={setShowPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onGoLogin={() => navigate("/login")}
        />
      )}

      {isVerify && (
        <VerifyEmailForm
          form={form}
          loading={loading}
          countdown={verifyExpiresIn}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onResend={handleResendVerification}
          onGoLogin={() => navigate("/login")}
        />
      )}
    </AuthLayout>
  );
}
