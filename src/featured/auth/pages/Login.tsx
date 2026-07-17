// src/featured/auth/pages/Login.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import { logService } from "../../../lib/logService";
import { font } from "../../../shared/typography/font";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        await logService.catat(user.uid, userData.username, 'login_berhasil', 'auth', 'Login berhasil');

        if (userData.role === "admin") {
          navigate("/admin");
        } else if (userData.role === "superadmin") {
          navigate("/superadmin");
        } else {
          navigate("/");
        }
      } else {
        setError("Data user tidak ditemukan di database.");
      }
    } catch (err: any) {
      await logService.catat('', email, 'login_gagal', 'auth', 'Percobaan login gagal');
      setError("Gagal login. Periksa kembali email dan password Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-surface p-4 transition-colors duration-200 dark:bg-neutral-charcoal">
      <div className="w-full max-w-md rounded-2xl border-2 border-neutral-stone/40 bg-neutral-surface p-8 shadow-sm transition-colors duration-200 dark:border-neutral-stone/25 dark:bg-neutral-charcoal-deep dark:shadow-none">
        <div className="mb-8 text-center">
          <h1 className={`${font.h2} text-neutral-charcoal dark:text-neutral-cream`}>
            Mentoring UMN 2026
          </h1>
          <p className={`${font.body} mt-2 text-neutral-stone`}>
            Sign in to continue
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border-2 border-accent-red/60 bg-accent-red/10 px-4 py-3 text-center font-body text-sm font-medium text-accent-red dark:border-accent-red-light/50 dark:bg-accent-red-light/10 dark:text-accent-red-light">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
              Email
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-2 border-neutral-stone/40 bg-neutral-surface px-4 py-3 font-body text-sm text-neutral-charcoal outline-none transition-colors focus:border-primary-dark dark:border-neutral-stone/30 dark:bg-neutral-charcoal-deep dark:text-neutral-cream dark:focus:border-primary-light"
              placeholder="Masukkan email Anda"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-neutral-stone/40 bg-neutral-surface py-3 pl-4 pr-12 font-body text-sm text-neutral-charcoal outline-none transition-colors focus:border-primary-dark dark:border-neutral-stone/30 dark:bg-neutral-charcoal-deep dark:text-neutral-cream dark:focus:border-primary-light"
                placeholder="Masukkan password Anda"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-neutral-stone transition-colors duration-200 hover:text-neutral-charcoal dark:hover:text-neutral-cream"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary-dark px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(180,124,91,0.45)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none dark:bg-primary-light dark:text-neutral-charcoal-deep dark:hover:shadow-[0_0_16px_rgba(231,196,140,0.5)]"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}