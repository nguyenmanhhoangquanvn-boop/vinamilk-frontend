import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle,
  FiLogIn, FiShield, FiPhone, FiX, FiCheckCircle, FiArrowLeft, FiRefreshCw,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../services/axiosClient";

// ─── Left decorative panel ──────────────────────────────────────────────────
const LeftPanel = () => (
  <div
    className="hidden lg:flex flex-col items-center justify-center flex-none w-[44%] relative overflow-hidden"
    style={{ background: "linear-gradient(145deg,#0057b8 0%,#003d9c 45%,#0099e6 100%)" }}
  >
    <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
    <div className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full bg-white/5" />
    <div className="absolute top-1/3 right-0 w-24 h-24 rounded-full bg-white/5" />

    {/* Logo */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex items-center gap-3 mb-10"
    >
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-blue-700 text-xl shadow-lg">
        V
      </div>
      <span className="text-white text-xl font-black tracking-wide">Vinamilk</span>
    </motion.div>

    {/* Product illustration */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      className="relative mb-8"
    >
      {/* Main milk box */}
      <div
        className="w-40 h-52 rounded-3xl flex flex-col items-center justify-center shadow-2xl relative z-10"
        style={{ background: "linear-gradient(160deg,#e8f4ff 0%,#fff 55%,#cfe8ff 100%)" }}
      >
        <div className="w-20 h-6 rounded-t-lg mb-3"
             style={{ background: "linear-gradient(90deg,#0057b8,#0099e6)" }} />
        <span className="text-5xl mb-3">🥛</span>
        <div className="bg-gradient-to-br from-blue-600 to-blue-400 text-white text-xs font-bold px-4 py-2 rounded-xl text-center leading-snug shadow">
          VINAMILK<br />100% Sữa Tươi
        </div>
        <div className="text-yellow-400 text-sm tracking-widest mt-2">★★★★★</div>
      </div>
      {/* Small boxes */}
      <div className="absolute -left-10 top-8 w-16 h-20 rounded-2xl shadow-lg opacity-80 flex items-center justify-center text-2xl"
           style={{ background: "linear-gradient(160deg,#e8f4ff,#fff)" }}>🧃</div>
      <div className="absolute -right-10 top-12 w-16 h-20 rounded-2xl shadow-lg opacity-80 flex items-center justify-center text-2xl"
           style={{ background: "linear-gradient(160deg,#fff8e1,#fff)" }}>🧈</div>
    </motion.div>

    {/* Text */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="text-center px-6"
    >
      <p className="text-white text-lg font-bold leading-snug">
        Sữa sạch cho <span className="text-sky-300">mọi gia đình</span>
      </p>
      <p className="text-blue-200 text-sm mt-2">Hơn 50 năm tin dùng trên toàn Việt Nam</p>
    </motion.div>

    {/* Stats */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex gap-6 mt-8"
    >
      {[["50+", "Năm"], ["200+", "Sản phẩm"], ["10M+", "Khách hàng"]].map(([num, label]) => (
        <div key={label} className="text-center">
          <p className="text-white font-black text-lg">{num}</p>
          <p className="text-blue-200 text-xs">{label}</p>
        </div>
      ))}
    </motion.div>
  </div>
);

// ─── Forgot Password Modal ───────────────────────────────────────────────────
const ForgotPasswordModal = ({ onClose }) => {
  const [fpStep, setFpStep] = useState(1); // 1=phone, 2=otp, 3=new-pass
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const startCountdown = () => {
    setCountdown(60);
    const t = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
    }, 1000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{9,11}$/.test(phone)) { toast.error("Số điện thoại không hợp lệ"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success(`📱 Mã OTP đã gửi đến ${phone}`);
    startCountdown();
    setFpStep(2);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) { toast.error("Nhập đủ mã OTP"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setFpStep(3);
  };

  const handleResetPw = async (e) => {
    e.preventDefault();
    if (newPw.length < 6) { toast.error("Mật khẩu tối thiểu 6 ký tự"); return; }
    if (newPw !== confirm) { toast.error("Mật khẩu xác nhận không khớp"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("✅ Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
    onClose();
  };

  const stepTitles = [
    "",
    "Quên mật khẩu",
    "Xác thực OTP",
    "Tạo mật khẩu mới",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-8 relative"
      >
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-all">
          <FiX size={18} />
        </button>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-300
              ${s === fpStep ? "w-8 bg-blue-600" : s < fpStep ? "w-4 bg-emerald-400" : "w-4 bg-slate-200 dark:bg-slate-600"}`} />
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-sky-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            {fpStep === 3 ? <FiCheckCircle size={24} className="text-white" /> : <FiLock size={24} className="text-white" />}
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-white">{stepTitles[fpStep]}</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {fpStep === 1 && "Nhập số điện thoại để nhận mã xác thực"}
            {fpStep === 2 && `Mã OTP đã gửi đến ${phone}. Kiểm tra SMS.`}
            {fpStep === 3 && "Tạo mật khẩu mới cho tài khoản của bạn"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: phone */}
          {fpStep === 1 && (
            <motion.form key="fp1" onSubmit={handleSendOtp}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="relative mb-4">
                <FiPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="Số điện thoại (vd: 0901234567)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm
                             text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none transition-all" />
              </div>
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2
                           disabled:opacity-70 transition-all"
                style={{ background: "linear-gradient(90deg,#0057b8,#0099e6)" }}>
                {loading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Đang gửi...</> : <><FiPhone size={15} /> Gửi mã OTP</>}
              </motion.button>
            </motion.form>
          )}

          {/* Step 2: OTP */}
          {fpStep === 2 && (
            <motion.form key="fp2" onSubmit={handleVerifyOtp}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-2 mb-4 text-center">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">💡 Demo: nhập bất kỳ 4–6 số</p>
              </div>
              <div className="relative mb-4">
                <FiShield size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={otp} maxLength={6}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Nhập mã OTP (4–6 số)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm
                             text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700 text-center tracking-widest font-bold text-lg
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none transition-all" />
              </div>
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2
                           disabled:opacity-70 transition-all mb-3"
                style={{ background: "linear-gradient(90deg,#0057b8,#0099e6)" }}>
                {loading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Đang xác thực...</> : <><FiCheckCircle size={15} /> Xác nhận OTP</>}
              </motion.button>
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-xs text-slate-400">Gửi lại sau <span className="font-bold text-slate-700 dark:text-slate-300">{countdown}s</span></p>
                ) : (
                  <button type="button" onClick={() => { setFpStep(1); }}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 mx-auto">
                    <FiRefreshCw size={11} /> Gửi lại OTP
                  </button>
                )}
              </div>
            </motion.form>
          )}

          {/* Step 3: new password */}
          {fpStep === 3 && (
            <motion.form key="fp3" onSubmit={handleResetPw}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="relative mb-3">
                <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showNew ? "text" : "password"} value={newPw}
                  onChange={(e) => setNewPw(e.target.value)} placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm
                             text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none transition-all" />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                  {showNew ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              <div className="relative mb-5">
                <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showConfirm ? "text" : "password"} value={confirm}
                  onChange={(e) => setConfirm(e.target.value)} placeholder="Xác nhận mật khẩu mới"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm
                    text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700
                    focus:ring-2 outline-none transition-all
                    ${confirm && confirm !== newPw ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/50"}`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                  {showConfirm ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2
                           disabled:opacity-70 transition-all"
                style={{ background: "linear-gradient(90deg,#0057b8,#0099e6)" }}>
                {loading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Đang lưu...</> : <><FiCheckCircle size={15} /> Đổi mật khẩu</>}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// ─── InputField ─────────────────────────────────────────────────────────────
const Field = ({ label, name, type, placeholder, value, onChange, error, icon: Icon, extra }) => {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon size={15} className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none z-10" />
        <input
          type={isPass ? (show ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-${isPass ? "10" : "4"} py-3 rounded-xl border text-sm font-medium text-slate-800 dark:text-white
            placeholder-slate-300 dark:placeholder-slate-500 outline-none transition-all duration-200
            ${error
              ? "border-red-400 bg-red-50 dark:bg-red-900/20 focus:ring-3 focus:ring-red-100"
              : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-600 focus:ring-3 focus:ring-blue-100 dark:focus:ring-blue-900/50"
            }`}
        />
        {isPass && (
          <button type="button" tabIndex={-1} onClick={() => setShow(!show)}
            className="absolute right-3.5 text-slate-400 hover:text-blue-600 transition-colors">
            {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
          </button>
        )}
      </div>
      {extra}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1 mt-1 text-red-500 text-xs font-medium">
            <FiAlertCircle size={12} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Login Page ──────────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email không hợp lệ";
    if (!form.password) errs.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 6) errs.password = "Mật khẩu ít nhất 6 ký tự";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await axiosClient.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });
      const { access_token, user } = res.data;
      login(access_token, user, remember);

      toast.success(`Chào mừng trở lại, ${user?.fullName || "bạn"}! 👋`, {
        duration: 2500,
        style: { fontWeight: "600" },
      });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || "Email hoặc mật khẩu không đúng";
      toast.error(msg, { duration: 3000 });
      setErrors({ password: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex w-full max-w-3xl overflow-hidden"
          style={{ minHeight: 520 }}
        >
          <LeftPanel />

          {/* Right: form */}
          <div className="flex-1 flex flex-col justify-center px-8 py-10 sm:px-12">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-sm">V</div>
              <span className="font-black text-blue-700 text-lg">Vinamilk</span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-1">Chào mừng trở lại</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-7">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Đăng ký ngay</Link>
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <Field label="Email" name="email" type="email" placeholder="example@gmail.com"
                value={form.email} onChange={handleChange} error={errors.email} icon={FiMail} />

              <Field label="Mật khẩu" name="password" type="password" placeholder="Nhập mật khẩu"
                value={form.password} onChange={handleChange} error={errors.password} icon={FiLock}
                extra={
                  <div className="flex justify-end mt-1">
                    <button type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      Quên mật khẩu?
                    </button>
                  </div>
                }
              />

              {/* Remember me */}
              <label className="flex items-center gap-2 cursor-pointer mb-5 select-none">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded" />
                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Ghi nhớ đăng nhập</span>
              </label>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.01, y: -1 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2
                           transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                style={{ background: "linear-gradient(90deg,#0057b8 0%,#0099e6 100%)" }}
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Đang đăng nhập...</>
                ) : (
                  <><FiLogIn size={16} /> Đăng nhập</>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">hoặc tiếp tục với</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Google mockup */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast("Google Login sẽ được tích hợp sau!", { icon: "ℹ️" })}
              className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 flex items-center justify-center gap-2.5
                         text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-300 transition-all shadow-sm"
            >
              <FcGoogle size={19} />
              Đăng nhập bằng Google
            </motion.button>

            {/* Trust */}
            <div className="flex justify-center gap-1 mt-6">
              <FiShield size={12} className="text-emerald-500 mt-0.5" />
              <span className="text-xs text-slate-400">Đăng nhập bảo mật SSL 256-bit</span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;