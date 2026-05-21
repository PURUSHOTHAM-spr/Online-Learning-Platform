import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { FiArrowLeft, FiLock, FiCheckCircle, FiStar, FiUsers, FiBook, FiPlay, FiCreditCard } from "react-icons/fi";
import QRCode from "qrcode";

function ConfettiOverlay() {
  const particles = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2.5}s`,
    duration: `${2.5 + Math.random() * 3.5}s`,
    color: ["#c084fc", "#818cf8", "#34d399", "#fbbf24", "#f87171", "#60a5fa"][Math.floor(Math.random() * 6)],
    rotation: `${Math.random() * 360}deg`,
    size: `${6 + Math.random() * 10}px`,
    shape: Math.random() > 0.5 ? "rounded-full" : "rounded-sm"
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute top-[-20px] animate-fall ${p.shape}`}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            transform: `rotate(${p.rotation})`,
            opacity: 0.85,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation-name: fall;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        @keyframes scan {
          0%, 100% {
            top: 24px;
            opacity: 0.15;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          50% {
            top: calc(100% - 24px);
            opacity: 1;
          }
        }
        .animate-scan {
          animation: scan 4s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

function Checkout() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Payment method tab state: "card" | "upi"
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Card input states
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  // UPI payment states
  const [upiQrDataUrl, setUpiQrDataUrl] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [upiTxnId, setUpiTxnId] = useState("");
  const [verificationStep, setVerificationStep] = useState(0); // 0=idle, 1=contacting gateway, 2=verifying ref, 3=registering enrollment

  // Form states
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, authorizing, enrolling, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const [courseRes, enrolledRes] = await Promise.all([
          axiosInstance.get(`/user-api/course/${courseId}`),
          axiosInstance.get("/user-api/my-courses"),
        ]);

        const courseData = courseRes.data.payload;
        const enrolledList = enrolledRes.data.payload || [];
        const enrolled = enrolledList.some((c) => c._id === courseId);

        if (!courseData || courseData.price === 0) {
          toast.error("Invalid course or this is a free course.");
          navigate(`/course/${courseId}`);
          return;
        }

        setCourse(courseData);
        setIsEnrolled(enrolled);
      } catch (err) {
        toast.error("Failed to load checkout details.");
        console.error(err);
        navigate("/all-courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  // UPI QR Code Regeneration function
  const regenerateUpiQr = () => {
    if (!course) return;
    const random12Digits = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const newTxnId = `UPI${random12Digits}`;
    setUpiTxnId(newTxnId);
    setTimeLeft(300);

    const basePrice = course.price;
    const discountAmount = Math.round(basePrice * 0.20);
    const taxableAmount = basePrice - discountAmount;
    const gstAmount = Math.round(taxableAmount * 0.18);
    const totalAmount = taxableAmount + gstAmount;

    // standard UPI URI
    const upiUri = `upi://pay?pa=coursehub@okaxis&pn=CourseHub&am=${totalAmount}&cu=INR&tn=Course_${courseId}_${random12Digits.substring(0, 4)}`;

    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 2,
      color: {
        dark: "#1e1b4b",
        light: "#ffffff"
      }
    })
    .then(url => {
      setUpiQrDataUrl(url);
    })
    .catch(err => {
      console.error("Failed to generate UPI QR:", err);
    });
  };

  // Generate UPI QR Code on method select
  useEffect(() => {
    if (course && paymentMethod === "upi") {
      regenerateUpiQr();
    }
  }, [course, paymentMethod, courseId]);

  // Countdown timer for UPI QR Code
  useEffect(() => {
    if (paymentMethod !== "upi" || paymentStatus === "success" || paymentStatus === "authorizing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentMethod, paymentStatus]);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle Card Number Formatting (Spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length > 16) {
      input = input.substring(0, 16);
    }
    const formatted = input.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Handle Expiry Date Formatting (MM/YY)
  const handleExpiryChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length > 4) {
      input = input.substring(0, 4);
    }
    if (input.length > 2) {
      input = input.substring(0, 2) + "/" + input.substring(2, 4);
    }
    setExpiryDate(input);
  };

  // Handle CVV Formatting (numbers only, max 4 digits)
  const handleCvvChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 4) {
      setCvv(input);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate inputs locally
    const cleanedCardNumber = cardNumber.replace(/\s/g, "");
    if (cleanedCardNumber.length < 13 || cleanedCardNumber.length > 16) {
      setErrorMessage("Card number must be between 13 and 16 digits.");
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
      setErrorMessage("Expiry date must be in MM/YY format.");
      return;
    }
    if (cvv.length < 3 || cvv.length > 4) {
      setErrorMessage("CVV must be 3 or 4 digits.");
      return;
    }

    setPaymentStatus("authorizing");

    // Simulate Payment processing delay
    setTimeout(async () => {
      setPaymentStatus("enrolling");
      try {
        await axiosInstance.post("/user-api/enroll-course", {
          courseId,
          paymentDetails: {
            cardNumber: cleanedCardNumber,
            cardHolder,
            expiryDate,
            cvv
          }
        });

        setPaymentStatus("success");
        toast.success("Enrolled successfully! Enjoy learning! 🎉");
      } catch (err) {
        setPaymentStatus("error");
        setErrorMessage(err.response?.data?.message || "Payment authorization failed. Please try again.");
      }
    }, 2000);
  };

  const handleUpiPaymentSubmit = async (e) => {
    if (e) e.preventDefault();
    if (timeLeft === 0) {
      toast.error("QR Code expired. Please refresh the QR code to make payment.");
      return;
    }

    setErrorMessage("");
    setPaymentStatus("authorizing");
    setVerificationStep(1); // 1 = Contacting payment gateway

    // Step 1: Contacting payment gateway (1.5 seconds)
    setTimeout(() => {
      setVerificationStep(2); // 2 = Verifying transaction reference

      // Step 2: Verifying transaction reference (1.5 seconds)
      setTimeout(async () => {
        setVerificationStep(3); // 3 = Registering student enrollment

        try {
          await axiosInstance.post("/user-api/enroll-course", {
            courseId,
            paymentDetails: {
              paymentMethod: "upi",
              upiTxnId: upiTxnId
            }
          });

          // Step 3: Success!
          setTimeout(() => {
            setPaymentStatus("success");
            toast.success("Enrolled successfully! Enjoy learning! 🎉");
          }, 1000);

        } catch (err) {
          setPaymentStatus("error");
          setVerificationStep(0);
          setErrorMessage(err.response?.data?.message || "UPI Payment verification failed. Please try again or verify your scanning transaction.");
        }
      }, 1500);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Preparing secure checkout...</p>
        </div>
      </div>
    );
  }

  if (!course) return null;

  // Invoice calculations
  const basePrice = course.price;
  const discountAmount = Math.round(basePrice * 0.20);
  const taxableAmount = basePrice - discountAmount;
  const gstAmount = Math.round(taxableAmount * 0.18);
  const totalAmount = taxableAmount + gstAmount;

  // 3D Card Inline Styles
  const cardInnerStyle = {
    width: "100%",
    height: "100%",
    transition: "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    transformStyle: "preserve-3d",
    position: "relative",
    transform: isFlipped ? "rotateY(180deg)" : "none",
  };

  const cardFaceStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: "1.25rem",
    padding: "1.75rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 20px 40px rgba(99, 102, 241, 0.25)",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c084fc 100%)",
  };

  const cardBackStyle = {
    ...cardFaceStyle,
    transform: "rotateY(180deg)",
    padding: "1.5rem 0",
    justifyContent: "flex-start",
    gap: "1.25rem",
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 lg:px-12 flex items-center justify-center relative">
      {paymentStatus === "success" && <ConfettiOverlay />}

      <div className="max-w-6xl w-full bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col lg:flex-row relative min-h-[620px]">
        
        {/* LEFT PANEL: Interactive Checkout Form */}
        <div className="flex-1 p-8 lg:p-12 border-r border-slate-100 flex flex-col justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm mb-8 transition font-medium"
            >
              <FiArrowLeft size={16} /> Back to Course
            </button>

            {paymentStatus === "success" ? (
              /* Success Enrollment Celebration UI */
              <div className="flex flex-col items-center justify-center text-center py-10">
                <div className="w-20 h-20 bg-emerald-100 border-4 border-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-600 animate-bounce">
                  <FiCheckCircle size={44} />
                </div>
                
                <h2 className="text-3xl font-black text-slate-800 mb-3">Order Confirmed!</h2>
                <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
                  Congratulations! Your transaction has been authorized successfully and your student profile is now fully enrolled in this course.
                </p>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 w-full max-w-md text-left space-y-3 mb-8 animate-fadeIn">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Transaction ID</span>
                    <span className="font-mono text-slate-600 font-bold">
                      {paymentMethod === "upi" ? upiTxnId : `TXN-${Math.floor(100000 + Math.random() * 900000)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Payment Method</span>
                    <span className="text-slate-600 font-semibold">
                      {paymentMethod === "upi" ? "UPI QR Code" : `Credit Card (Ending in ${cardNumber.slice(-4)})`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-800 border-t border-slate-200/60 pt-3">
                    <span>Amount Enrolled</span>
                    <span className="text-violet-600">₹{totalAmount}</span>
                  </div>
                </div>

                <Link
                  to={`/learn/${courseId}`}
                  className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-violet-200 flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                >
                  <FiPlay size={14} /> Start Learning Now
                </Link>
              </div>
            ) : (paymentStatus === "authorizing" || paymentStatus === "enrolling") && paymentMethod === "upi" ? (
              /* Multi-step UPI progress loader */
              <div className="flex flex-col items-center justify-center py-12 text-center select-none animate-fadeIn w-full flex-1">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 bg-violet-100 rounded-full animate-ping opacity-60" />
                  <div className="absolute inset-2 bg-indigo-100 rounded-full animate-pulse" />
                  <div className="absolute inset-4 bg-violet-600 rounded-full flex items-center justify-center text-white shadow-xl">
                    <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-2">Verifying Payment</h3>
                <p className="text-sm text-slate-400 max-w-xs mb-8">Do not close this window or refresh the page. We are securely validating your UPI transaction reference.</p>

                <div className="w-full max-w-sm space-y-4">
                  
                  {/* Step 1 */}
                  <div className="flex items-center gap-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      verificationStep >= 1
                        ? "bg-violet-600 text-white shadow-md shadow-violet-100"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {verificationStep > 1 ? "✓" : "1"}
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-bold ${verificationStep >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>Contacting payment gateway</div>
                      <div className="text-[11px] text-slate-400 leading-none mt-0.5">Initializing secure bank API request.</div>
                    </div>
                  </div>

                  {/* Line connector */}
                  <div className="w-[2px] h-4 bg-slate-200 ml-3.5 -my-2" />

                  {/* Step 2 */}
                  <div className="flex items-center gap-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      verificationStep >= 2
                        ? "bg-violet-600 text-white shadow-md shadow-violet-100"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {verificationStep > 2 ? "✓" : "2"}
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-bold ${verificationStep >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>Verifying reference UPI ID</div>
                      <div className="text-[11px] text-slate-400 leading-none mt-0.5">Matching {upiTxnId ? upiTxnId.slice(0, 10) : "UPI..."} with banking node.</div>
                    </div>
                  </div>

                  {/* Line connector */}
                  <div className="w-[2px] h-4 bg-slate-200 ml-3.5 -my-2" />

                  {/* Step 3 */}
                  <div className="flex items-center gap-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      verificationStep >= 3
                        ? "bg-violet-600 text-white shadow-md shadow-violet-100"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {verificationStep > 3 ? "✓" : "3"}
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-bold ${verificationStep >= 3 ? 'text-slate-800' : 'text-slate-400'}`}>Enrolling in course</div>
                      <div className="text-[11px] text-slate-400 leading-none mt-0.5">Granting lifetime access materials.</div>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="w-full">
                <h2 className="text-2xl font-black text-slate-800 mb-1">Secure Checkout</h2>
                <p className="text-slate-400 text-sm mb-6">Select a payment option and complete your simulated enrollment instantly.</p>

                {/* Segmented Payment Method Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 relative select-none">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("card");
                      setErrorMessage("");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 cursor-pointer ${
                      paymentMethod === "card"
                        ? "bg-white text-violet-700 shadow-md"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <FiCreditCard size={16} />
                    <span>Credit / Debit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("upi");
                      setErrorMessage("");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 cursor-pointer ${
                      paymentMethod === "upi"
                        ? "bg-white text-violet-700 shadow-md"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm3 3h-3v3h-2v-3h-2v-2h4v-1h2v3zm-5-3h-2v2h2v-2zm-2 4h2v2h-2v-2zm8 0v2h-2v-2h2zm-12-6h2v2H9v-2zm2 2h2v2h-2v-2zm-2 2h2v2H9v-2zm6-6h2v2h-2V9zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-4-8h2v2h-2V5zm0 8h2v2h-2v-2z" />
                    </svg>
                    <span>UPI QR Code</span>
                  </button>
                </div>

                {paymentMethod === "upi" ? (
                  <div className="flex flex-col items-center animate-fadeIn w-full">
                    
                    {/* UPI QR Scanning Box */}
                    <div className="relative bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl w-full max-w-[320px] mx-auto mb-6 flex flex-col items-center justify-center group overflow-hidden">
                      
                      {/* Scanning visual overlay frame corners */}
                      <div className="absolute top-4 left-4 w-5 h-5 border-t-4 border-l-4 border-violet-600 rounded-tl" />
                      <div className="absolute top-4 right-4 w-5 h-5 border-t-4 border-r-4 border-violet-600 rounded-tr" />
                      <div className="absolute bottom-4 left-4 w-5 h-5 border-b-4 border-l-4 border-violet-600 rounded-bl" />
                      <div className="absolute bottom-4 right-4 w-5 h-5 border-b-4 border-r-4 border-violet-600 rounded-br" />

                      {/* Pulsating scanning radar line */}
                      {paymentStatus === "idle" && timeLeft > 0 && (
                        <div className="absolute left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent shadow-lg shadow-violet-500/80 animate-scan z-10" />
                      )}

                      {/* QR Canvas Render */}
                      <div className="relative w-64 h-64 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                        {timeLeft === 0 ? (
                          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
                            <span className="text-red-500 font-bold text-sm mb-2">QR Code Expired</span>
                            <p className="text-xs text-slate-400 mb-4 leading-relaxed">For security reasons, UPI transaction requests expire after 5 minutes.</p>
                            <button
                              type="button"
                              onClick={regenerateUpiQr}
                              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-bold text-xs shadow-md transition cursor-pointer"
                            >
                              Regenerate QR Code
                            </button>
                          </div>
                        ) : upiQrDataUrl ? (
                          <div className="relative">
                            <img src={upiQrDataUrl} alt="UPI QR Code" className="w-full h-full select-none" />
                            {/* Premium Logo Overlay at the center of the QR code */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-md shadow-md border border-slate-100/50 flex items-center justify-center z-10 w-9 h-9">
                              <div className="bg-violet-600 w-full h-full rounded flex items-center justify-center text-white font-extrabold text-[10px] tracking-tighter">
                                CH
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Time-out Countdown */}
                      {timeLeft > 0 && (
                        <div className="mt-4 flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 select-none">
                          <span className={`w-2 h-2 rounded-full ${timeLeft < 60 ? 'bg-red-500 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
                          <span>Expires in: </span>
                          <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-slate-700'}`}>{formatTime(timeLeft)}</span>
                        </div>
                      )}
                    </div>

                    {/* Scan instructions & transaction metadata */}
                    <div className="w-full max-w-[380px] text-center space-y-4 mb-6 select-none">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-medium">Merchant</span>
                          <span className="font-bold text-slate-700">CourseHub Platform</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-medium">Reference ID</span>
                          <span className="font-mono font-bold text-slate-700">{upiTxnId || "UPI..."}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-t border-slate-200/50 pt-2.5">
                          <span className="text-slate-500 font-semibold">Payment Amount</span>
                          <span className="text-violet-600 font-extrabold text-sm">₹{totalAmount}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 leading-relaxed text-center px-4">
                        💡 <strong>How to pay:</strong> Open GPay, PhonePe, Paytm, or BHIM app on your phone, scan this QR code, authorize the transaction, and click below to verify.
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="w-full max-w-[380px] bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl mb-4">
                        {errorMessage}
                      </div>
                    )}

                    {/* Verify Transaction Button */}
                    <button
                      type="button"
                      onClick={handleUpiPaymentSubmit}
                      disabled={paymentStatus === "authorizing" || paymentStatus === "enrolling" || timeLeft === 0}
                      className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-violet-200 disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FiCheckCircle size={15} /> Verify Payment Status
                    </button>

                  </div>
                ) : (
                  <div className="animate-fadeIn w-full">
                    {/* 3D Rotatable Card Preview */}
                    <div className="w-full max-w-[370px] h-[210px] mx-auto perspective-[1000px] mb-8 relative font-mono text-white select-none">
                      <div style={cardInnerStyle}>
                        
                        {/* Front Face */}
                        <div style={cardFaceStyle}>
                          <div className="flex justify-between items-start">
                            <div className="w-12 h-9 bg-amber-400/90 rounded-md shadow-inner flex items-center justify-center overflow-hidden relative">
                              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-slate-800/20" />
                              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-slate-800/20" />
                              <div className="w-6 h-5 border border-slate-800/30 rounded-sm" />
                            </div>
                            <FiCreditCard size={28} className="text-white/80" />
                          </div>

                          <div className="text-lg lg:text-xl tracking-[0.2em] font-medium py-2 text-center text-white drop-shadow-md">
                            {cardNumber || "•••• •••• •••• ••••"}
                          </div>

                          <div className="flex justify-between items-end">
                            <div className="flex flex-col min-w-0 pr-4">
                              <span className="text-[9px] uppercase tracking-wider text-indigo-200">Card Holder</span>
                              <span className="text-sm font-semibold truncate uppercase tracking-widest drop-shadow-sm">
                                {cardHolder || "FULL NAME"}
                              </span>
                            </div>
                            <div className="flex flex-col shrink-0">
                              <span className="text-[9px] uppercase tracking-wider text-indigo-200">Expires</span>
                              <span className="text-sm font-semibold tracking-widest drop-shadow-sm">
                                {expiryDate || "MM/YY"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Back Face */}
                        <div style={cardBackStyle}>
                          <div className="w-full h-10 bg-slate-900 mt-2" />
                          <div className="px-6 flex flex-col gap-2">
                            <div className="text-[9px] uppercase tracking-wider text-indigo-200 text-right">Authorized Signature</div>
                            <div className="flex items-center">
                              <div className="flex-1 h-9 bg-white/20 backdrop-blur-sm rounded-l-md px-3 flex items-center text-xs italic tracking-widest text-slate-300 font-sans border-r border-white/10 select-none pointer-events-none">
                                Digital Udhaar Platform Card
                              </div>
                              <div className="w-14 h-9 bg-white text-slate-800 rounded-r-md flex items-center justify-center font-bold text-sm tracking-wider shadow-inner">
                                {cvv || "•••"}
                              </div>
                            </div>
                          </div>
                          <div className="px-6 mt-auto text-[8px] text-center text-indigo-100 opacity-60">
                            This card is simulated for educational course purchase. All transactions are local.
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Form Inputs */}
                    <form onSubmit={handlePaymentSubmit} className="space-y-5">
                      <div>
                        <label htmlFor="cc-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cardholder Name</label>
                        <input
                          id="cc-name"
                          name="cc-name"
                          type="text"
                          required
                          placeholder="Jane Doe"
                          maxLength={50}
                          pattern="[A-Za-z\s\-]+"
                          title="Name must only contain alphabets, spaces, or hyphens."
                          autocomplete="cc-name"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          onFocus={() => setIsFlipped(false)}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white transition"
                        />
                      </div>

                      <div>
                        <label htmlFor="cc-number" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Number</label>
                        <div className="relative">
                          <input
                            id="cc-number"
                            name="cc-number"
                            type="text"
                            required
                            inputmode="numeric"
                            placeholder="4532 7182 9381 0293"
                            maxLength={19}
                            autocomplete="cc-number"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            onFocus={() => setIsFlipped(false)}
                            className="w-full border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white transition font-mono tracking-widest"
                          />
                          <FiCreditCard className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span id="exp-hint" className="sr-only">Format: MM/YY</span>
                          <label htmlFor="cc-exp" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Expiration <span className="text-[10px] text-slate-400 font-normal lowercase">(mm/yy)</span>
                          </label>
                          <input
                            id="cc-exp"
                            name="cc-exp"
                            type="text"
                            required
                            aria-describedby="exp-hint"
                            placeholder="12/28"
                            maxLength={5}
                            autocomplete="cc-exp"
                            value={expiryDate}
                            onChange={handleExpiryChange}
                            onFocus={() => setIsFlipped(false)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white transition text-center font-mono tracking-wider"
                          />
                        </div>

                        <div>
                          <label htmlFor="cc-csc" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            CVV <span className="text-[10px] text-slate-400 font-normal lowercase">(csc)</span>
                          </label>
                          <input
                            id="cc-csc"
                            name="cc-csc"
                            type="text"
                            required
                            inputmode="numeric"
                            placeholder="123"
                            maxLength={4}
                            pattern="[0-9]{3,4}"
                            autocomplete="cc-csc"
                            value={cvv}
                            onChange={handleCvvChange}
                            onFocus={() => setIsFlipped(true)}
                            onBlur={() => setIsFlipped(false)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white transition text-center font-mono tracking-widest"
                          />
                        </div>
                      </div>

                      {errorMessage && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl">
                          {errorMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={paymentStatus === "authorizing" || paymentStatus === "enrolling"}
                        className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-violet-200 disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer mt-4"
                      >
                        {paymentStatus === "authorizing" ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Authorizing transaction...
                          </>
                        ) : paymentStatus === "enrolling" ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Enrolling in course...
                          </>
                        ) : (
                          <>
                            <FiLock size={14} /> Pay Securely ₹{totalAmount}
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-slate-100 pt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <FiLock size={12} className="text-emerald-500" /> Secure 256-bit SSL encrypted connection.
          </div>
        </div>

        {/* RIGHT PANEL: Order Invoice & Course Details */}
        <div className="w-full lg:w-96 bg-slate-50/70 p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-800 mb-6 border-b border-slate-200/60 pb-3">Order Summary</h3>
            
            {/* Course Information Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-4 mb-8">
              <div className="relative h-28 bg-gradient-to-br from-violet-600 to-indigo-500 rounded-xl overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiBook size={32} className="text-white/40" />
                  </div>
                )}
              </div>
              
              <div>
                <span className="text-[10px] font-bold text-violet-600 bg-violet-100 border border-violet-200 px-2.5 py-0.5 rounded-full uppercase">
                  {course.category}
                </span>
                <h4 className="font-extrabold text-slate-800 text-sm mt-2 line-clamp-2 leading-tight">{course.title}</h4>
                
                <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-3">
                  <span className="flex items-center gap-1"><FiStar size={11} className="text-amber-400 fill-amber-400" /> {course.rating.toFixed(1)}</span>
                  <span className="flex items-center gap-1"><FiUsers size={11} /> {course.studentsEnrolled} enrolled</span>
                </div>
              </div>
            </div>

            {/* Bill / Invoice Breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Billing Invoice</h4>
              
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Base Price</span>
                  <span className="font-semibold text-slate-800">₹{basePrice}</span>
                </div>
                
                <div className="flex justify-between text-sm text-emerald-600 font-medium">
                  <span>Promotional Discount (20%)</span>
                  <span>-₹{discountAmount}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-600">
                  <span>Estimated GST (18%)</span>
                  <span className="font-semibold text-slate-800">₹{gstAmount}</span>
                </div>

                <div className="border-t border-slate-200/60 my-2 pt-3 flex justify-between text-base font-black text-slate-800">
                  <span>Grand Total</span>
                  <span className="text-violet-600 text-lg">₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-violet-50/50 border border-violet-100 rounded-2xl p-4 text-[11px] text-violet-600 leading-relaxed">
            🎓 <strong>Lifetime Access:</strong> Purchasing gives you unlimited access to lectures, future course updates, and a downloadable certificate upon completion.
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;
