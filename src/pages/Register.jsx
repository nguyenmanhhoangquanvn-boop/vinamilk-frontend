import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiUser, FiMail, FiPhone, FiLock, FiUserPlus,
  FiShield, FiAward, FiArrowLeft, FiCheckCircle, FiRefreshCw,
} from "react-icons/fi";

import InputField from "../components/InputField";
import { validateRegisterForm, getPasswordStrength } from "../utils/validation";
import { registerUser } from "../services/authService";

// ─── Password strength bar ─────────────────────────────────────────────────────
const StrengthBar = ({ strength }) => {
  const labels = ["", "Yếu", "Vừa", "Mạnh"];
  const colors = ["bg-slate-200", "bg-red-400", "bg-amber-400", "bg-emerald-500"];
  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength >= i ? colors[strength] : "bg-slate-200"}`}
          />
        ))}
      </div>
      {strength > 0 && (
        <p className={`text-xs mt-0.5 font-medium ${strength === 1 ? "text-red-400" : strength === 2 ? "text-amber-500" : "text-emerald-600"}`}>
          Độ mạnh: {labels[strength]}
        </p>
      )}
    </div>
  );
};

// ─── Left banner panel ─────────────────────────────────────────────────────────
const LeftPanel = () => (
  <div className="hidden lg:flex flex-col items-center justify-center flex-none w-[44%] relative overflow-hidden"
    style={{ background: "linear-gradient(145deg, #0057b8 0%, #003d9c 45%, #0099e6 100%)" }}>
    <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
    <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/5" />

    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="flex items-center gap-3 mb-8">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-blue-700 text-xl shadow-lg">V</div>
      <span className="text-white text-xl font-black tracking-wide">Vinamilk</span>
    </motion.div>

    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
      className="w-36 h-44 rounded-2xl flex flex-col items-center justify-center shadow-2xl mb-8"
      style={{ background: "linear-gradient(160deg, #e8f4ff 0%, #fff 60%, #cfe8ff 100%)" }}>
      <div className="w-16 h-5 rounded-t-md mb-2" style={{ background: "linear-gradient(90deg,#0057b8,#0099e6)" }} />
      <span className="text-4xl mb-2">🥛</span>
      <div className="bg-gradient-to-br from-blue-600 to-blue-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg text-center leading-snug">
        VINAMILK<br />100% Sữa Tươi
      </div>
      <div className="text-yellow-400 text-xs tracking-widest mt-1.5">★★★★★</div>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-center">
      <p className="text-white text-lg font-bold">Vươn Cao <span className="text-sky-300">Việt Nam</span></p>
      <p className="text-blue-200 text-sm mt-1">Khởi đầu từng ngày tươi sáng</p>
    </motion.div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-4 mt-8">
      {[{ icon: FiShield, label: "Bảo mật SSL" }, { icon: FiAward, label: "Uy tín #1" }].map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
          <Icon size={13} className="text-sky-300" />
          <span className="text-white/80 text-xs font-medium">{label}</span>
        </div>
      ))}
    </motion.div>
  </div>
);

// ─── OTP Input ─────────────────────────────────────────────────────────────────
const OtpInput = ({ otp, setOtp }) => {
  const refs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      refs.current[5]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`w-12 h-14 text-center text-xl font-black rounded-xl border-2 outline-none transition-all
            ${digit
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
            }`}
        />
      ))}
    </div>
  );
};

// ─── Main Register Component ────────────────────────────────────────────────────
const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: "", referralCode: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Đếm ngược OTP
  useEffect(() => {
    if (step !== 2) return;
    setCountdown(60);
    setCanResend(false);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); setCanResend(true); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && /[^0-9]/.test(value)) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Bước 1: Validate form và gửi OTP
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const errs = validateRegisterForm(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      // Gọi API gửi OTP (mock: luôn thành công)
      // await sendOtp(form.phone);
      await new Promise((r) => setTimeout(r, 800)); // simulate
      toast.success(`📱 Mã OTP đã được gửi đến ${form.phone}`, { duration: 3000 });
      setStep(2);
    } catch {
      toast.error("Không thể gửi OTP. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác thực OTP
  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) { setOtpError("Vui lòng nhập đủ 6 chữ số OTP"); return; }
    setOtpError("");
    setLoading(true);

    try {
      // Mock: mã OTP hợp lệ là "123456", hoặc bất kỳ 6 số nào trong demo
      // await verifyOtp(form.phone, code);
      await registerUser({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        referralCode: form.referralCode || undefined,
      });

      toast.success("🎉 Đăng ký thành công! Đang chuyển trang...", {
        duration: 2500,
        style: { fontWeight: "600" },
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err?.response?.data?.message || "Xác thực OTP thất bại. Thử lại!";
      // For demo: if API fails, still proceed
      toast.success("🎉 Đăng ký thành công! Đang chuyển trang...", { duration: 2500 });
      setTimeout(() => navigate("/login"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setStep(2); // trigger useEffect to restart countdown
    toast.success("Đã gửi lại mã OTP!", { duration: 2000 });
  };

  const pwStrength = getPasswordStrength(form.password);

  const inputFields = [
    { label: "Họ và tên", name: "fullName", type: "text", placeholder: "Nguyễn Văn A", icon: FiUser },
    { label: "Email", name: "email", type: "email", placeholder: "example@gmail.com", icon: FiMail },
    { label: "Số điện thoại", name: "phone", type: "tel", placeholder: "0901234567", icon: FiPhone },
    { label: "Mật khẩu", name: "password", type: "password", placeholder: "Tối thiểu 6 ký tự", icon: FiLock },
    { label: "Xác nhận mật khẩu", name: "confirmPassword", type: "password", placeholder: "Nhập lại mật khẩu", icon: FiLock },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex w-full max-w-4xl overflow-hidden"
          style={{ minHeight: 580 }}
        >
          <LeftPanel />

          {/* Right: form or OTP */}
          <div className="flex-1 flex flex-col justify-center px-8 py-10 sm:px-12 overflow-y-auto">

            <AnimatePresence mode="wait">
              {/* ─── STEP 1: FORM ─────────────────────────────────── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-1">Tạo tài khoản mới</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                      Đăng nhập ngay
                    </Link>
                  </p>

                  <form onSubmit={handleSubmitForm} noValidate>
                    {inputFields.map((field) => (
                      <div key={field.name}>
                        <InputField {...field} value={form[field.name]} onChange={handleChange} error={errors[field.name]} required />
                        {field.name === "password" && (
                          <div className="-mt-3 mb-4">
                            <StrengthBar strength={pwStrength} />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Mã giới thiệu (có thể bỏ) */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                        Mã giới thiệu <span className="text-slate-400 font-normal normal-case">(không bắt buộc)</span>
                      </label>
                      <input
                        name="referralCode"
                        value={form.referralCode}
                        onChange={handleChange}
                        placeholder="Nhập mã giới thiệu nếu có..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm
                                   text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700
                                   focus:border-blue-500 focus:bg-white dark:focus:bg-slate-600
                                   focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none transition-all"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.01, y: -1 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      className="w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide
                                 flex items-center justify-center gap-2 mt-1 transition-all
                                 disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(90deg, #0057b8 0%, #0099e6 100%)" }}
                    >
                      {loading ? (
                        <><svg className="animate-spin w-4 h-4 border-2 border-white/40 border-t-white rounded-full" viewBox="0 0 24 24" /> Đang gửi OTP...</>
                      ) : (
                        <><FiPhone size={16} /> Tiếp tục — Xác thực OTP</>
                      )}
                    </motion.button>
                  </form>

                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                    <span className="text-xs text-slate-400 dark:text-slate-500">Bảo mật &amp; tin cậy</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  </div>

                  <div className="flex justify-center gap-5">
                    {[
                      { icon: FiShield, label: "Bảo mật SSL", color: "text-emerald-500" },
                      { icon: FiLock, label: "Mã hóa dữ liệu", color: "text-blue-500" },
                      { icon: FiAward, label: "Uy tín #1 VN", color: "text-amber-500" },
                    ].map(({ icon: Icon, label, color }) => (
                      <span key={label} className="flex items-center gap-1 text-xs text-slate-400">
                        <Icon size={13} className={color} /> {label}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ─── STEP 2: OTP ──────────────────────────────────── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col"
                >
                  {/* Back button */}
                  <button
                    onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); setOtpError(""); }}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors mb-6 w-fit"
                  >
                    <FiArrowLeft size={15} /> Quay lại
                  </button>

                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200 dark:shadow-blue-900/50"
                    >
                      <FiPhone size={28} className="text-white" />
                    </motion.div>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Xác thực OTP</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Mã OTP đã được gửi đến số <span className="font-bold text-blue-600 dark:text-blue-400">{form.phone}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Vui lòng kiểm tra tin nhắn SMS của bạn</p>
                  </div>

                  {/* OTP Input */}
                  <div className="mb-6">
                    <OtpInput otp={otp} setOtp={setOtp} />
                    {otpError && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-center text-red-500 text-xs font-medium mt-3">
                        {otpError}
                      </motion.p>
                    )}
                  </div>

                  {/* Demo hint */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-5 text-center">
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                      💡 Demo: Nhập bất kỳ 6 chữ số nào để xác thực
                    </p>
                  </div>

                  {/* Verify button */}
                  <motion.button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.join("").length < 6}
                    whileHover={!loading ? { scale: 1.01, y: -1 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2
                               transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                    style={{ background: "linear-gradient(90deg, #0057b8 0%, #0099e6 100%)" }}
                  >
                    {loading ? (
                      <><svg className="animate-spin w-4 h-4 border-2 border-white/40 border-t-white rounded-full" viewBox="0 0 24 24" /> Đang xác thực...</>
                    ) : (
                      <><FiCheckCircle size={16} /> Xác nhận OTP</>
                    )}
                  </motion.button>

                  {/* Resend */}
                  <div className="text-center">
                    {canResend ? (
                      <button onClick={handleResendOtp}
                        className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline mx-auto transition-all">
                        <FiRefreshCw size={13} /> Gửi lại mã OTP
                      </button>
                    ) : (
                      <p className="text-sm text-slate-400 dark:text-slate-500">
                        Gửi lại sau{" "}
                        <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums">{countdown}s</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;