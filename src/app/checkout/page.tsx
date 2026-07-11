"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle2, 
  Printer, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Lock
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/marketplace/Navbar";
import { getCart, getCartTotal, clearCart, CartItem } from "@/lib/cart";
import { getToken } from "@/lib/auth";
import { Toaster, toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  
  // Shipping form state
  const [shippingForm, setShippingForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardBrand, setCardBrand] = useState<"visa" | "mastercard" | "amex" | "generic">("generic");

  useEffect(() => {
    const activeCart = getCart();
    setCart(activeCart);
    
    // Auto populate shipping form if user is logged in
    if (typeof window !== "undefined") {
      try {
        const pkUser = localStorage.getItem("pk_user");
        if (pkUser) {
          const user = JSON.parse(pkUser);
          setShippingForm(prev => ({
            ...prev,
            name: user.name || "",
            email: user.email || "",
          }));
        }
      } catch {}
    }
  }, []);

  // Detect card brand
  useEffect(() => {
    const num = paymentForm.cardNumber.replace(/\D/g, "");
    if (num.startsWith("4")) {
      setCardBrand("visa");
    } else if (num.startsWith("5") || (parseInt(num.slice(0, 2)) >= 51 && parseInt(num.slice(0, 2)) <= 55)) {
      setCardBrand("mastercard");
    } else if (num.startsWith("34") || num.startsWith("37")) {
      setCardBrand("amex");
    } else {
      setCardBrand("generic");
    }
  }, [paymentForm.cardNumber]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    // Formatting rules
    if (name === "cardNumber") {
      // Allow only numbers and space every 4 digits
      value = value.replace(/\D/g, "").substring(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    } else if (name === "cardExpiry") {
      // Add slash between MM and YY
      value = value.replace(/\D/g, "").substring(0, 4);
      if (value.length > 2) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
    } else if (name === "cardCvv") {
      value = value.replace(/\D/g, "").substring(0, 4);
    } else if (name === "cardName") {
      value = value.toUpperCase();
    }

    setPaymentForm(prev => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    const { name, email, phone, address, city, state, pincode } = shippingForm;
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      toast.error("Please fill in all shipping details");
      return false;
    }
    // Simple email regex
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    // Simple phone regex (at least 10 digits)
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    const { cardNumber, cardName, cardExpiry, cardCvv } = paymentForm;
    const cardNumClean = cardNumber.replace(/\s/g, "");
    
    if (cardNumClean.length < 15) {
      toast.error("Please enter a valid credit card number");
      return false;
    }
    if (!cardName) {
      toast.error("Please enter the cardholder's name");
      return false;
    }
    if (cardExpiry.length < 5) {
      toast.error("Please enter a valid expiration date (MM/YY)");
      return false;
    }
    if (cardCvv.length < 3) {
      toast.error("Please enter a valid security code (CVV)");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setSubmitting(true);
    const token = getToken();

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: cart,
          shipping_address: shippingForm,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to place order");
        setSubmitting(false);
        return;
      }

      setOrderResult(data.order);
      clearCart();
      
      // Dispatch storage event to update cart icons in headers
      window.dispatchEvent(new Event("storage"));
      
      // Trigger gorgeous success state
      setStep("success");
      toast.success("Order placed successfully!");
      triggerConfetti();
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while placing your order.");
    } finally {
      setSubmitting(false);
    }
  };

  // Simple canvas-based confetti for luxury presentation
  const triggerConfetti = () => {
    const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#D4AF37", "#F3E5AB", "#097969", "#0F52BA", "#E5D3B3"];
    const particles: any[] = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 4 + 2,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 15;

        if (p.y <= canvas.height) {
          active = true;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      if (active) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    return () => cancelAnimationFrame(animationFrameId);
  };

  const handlePrint = () => {
    window.print();
  };

  const cartTotal = getCartTotal(cart);
  const shippingFee = cartTotal > 15000 ? 0 : 250;
  const finalTotal = cartTotal + shippingFee;

  if (cart.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen flex flex-col justify-between" style={{ background: "var(--pk-bg)" }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
          <ShoppingBag className="w-16 h-16 text-white/10 mb-5" strokeWidth={0.8} />
          <h2 className="font-serif text-2xl text-white mb-2">Your Shopping Bag is empty</h2>
          <p className="text-white/40 text-sm max-w-sm mb-8">
            You cannot checkout without items in your shopping bag. Choose something beautiful from our atelier.
          </p>
          <Link
            href="/marketplace"
            className="px-8 py-3 text-sm font-semibold tracking-wider text-black rounded transition-all"
            style={{ background: "#D4AF37" }}
          >
            Browse Sarees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: "var(--pk-bg)" }}>
      {step !== "success" && <Navbar />}
      <Toaster theme="dark" position="bottom-center" toastOptions={{ style: { background: "rgba(10,13,20,0.9)", color: "#F8F9FA", border: "1px solid rgba(212,175,55,0.25)", backdropFilter: "blur(12px)" } }} />

      {step === "success" && <canvas id="confetti-canvas" className="fixed inset-0 pointer-events-none z-[9999]" />}

      {step !== "success" ? (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="mb-8">
            <Link href="/marketplace" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-[#D4AF37] transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl text-white mt-4 font-light">Secure Checkout</h1>
            
            {/* Step Breadcrumb Indicators */}
            <div className="flex items-center gap-3 mt-4 text-xs tracking-widest uppercase">
              <span className={step === "shipping" ? "text-[#D4AF37]" : "text-white/40"}>1. Shipping</span>
              <span className="text-white/20">/</span>
              <span className={step === "payment" ? "text-[#D4AF37]" : "text-white/40"}>2. Payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Step Form */}
            <div className="lg:col-span-7 space-y-6">
              {step === "shipping" && (
                <div className="p-6 rounded-xl space-y-5" style={{ background: "rgba(15,20,30,0.6)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}>
                  <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-2">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.4} />
                    <h2 className="font-serif text-xl">Shipping Address</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] tracking-widest uppercase text-[#D4AF37]/75">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="text"
                            name="name"
                            value={shippingForm.name}
                            onChange={handleShippingChange}
                            placeholder="e.g. Priyadarshini Sen"
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] tracking-widest uppercase text-[#D4AF37]/75">Contact Phone *</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="tel"
                            name="phone"
                            value={shippingForm.phone}
                            onChange={handleShippingChange}
                            placeholder="10 digit number"
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] tracking-widest uppercase text-[#D4AF37]/75">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="email"
                          name="email"
                          value={shippingForm.email}
                          onChange={handleShippingChange}
                          placeholder="yourname@domain.com"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] tracking-widest uppercase text-[#D4AF37]/75">Street Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={shippingForm.address}
                        onChange={handleShippingChange}
                        placeholder="Suite, apartment, street name"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] tracking-widest uppercase text-[#D4AF37]/75">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={shippingForm.city}
                          onChange={handleShippingChange}
                          placeholder="Chennai"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] tracking-widest uppercase text-[#D4AF37]/75">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={shippingForm.state}
                          onChange={handleShippingChange}
                          placeholder="Tamil Nadu"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1 space-y-1.5">
                        <label className="block text-[10px] tracking-widest uppercase text-[#D4AF37]/75">Pincode *</label>
                        <input
                          type="text"
                          name="pincode"
                          value={shippingForm.pincode}
                          onChange={handleShippingChange}
                          placeholder="600004"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (validateShipping()) setStep("payment");
                    }}
                    className="w-full flex items-center justify-center gap-2 mt-6 py-3.5 bg-[#D4AF37] text-black font-semibold text-sm tracking-widest uppercase rounded hover:bg-[#F3E5AB] transition-all"
                  >
                    Proceed to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === "payment" && (
                <div className="space-y-6">
                  {/* Glassmorphic Interactive Credit Card Graphic */}
                  <div className="relative w-full max-w-sm mx-auto aspect-[1.586/1] preserve-3d perspective-1000 select-none">
                    <div 
                      className={`relative w-full h-full duration-700 transform-style-3d cursor-pointer ${isCardFlipped ? "rotate-y-180" : ""}`}
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                    >
                      {/* CARD FRONT */}
                      <div className="absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl border border-white/15" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 100%)", backdropFilter: "blur(20px)" }}>
                        {/* Background glowing mesh */}
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)", filter: "blur(30px)" }} />
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(9,121,105,0.4) 0%, transparent 70%)", filter: "blur(20px)" }} />

                        <div className="flex items-start justify-between">
                          {/* Chip */}
                          <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-300/40 via-yellow-100/10 to-yellow-500/30 border border-yellow-400/25 flex items-center justify-center">
                            <div className="w-8 h-6 border border-yellow-400/15 rounded flex flex-col justify-between p-1">
                              <div className="h-px bg-yellow-400/20 w-full" />
                              <div className="h-px bg-yellow-400/20 w-full" />
                            </div>
                          </div>
                          {/* Logo Brand */}
                          <span className="font-serif italic text-base text-[#F3E5AB] tracking-widest">
                            {cardBrand === "visa" && "VISA"}
                            {cardBrand === "mastercard" && "Mastercard"}
                            {cardBrand === "amex" && "AMEX"}
                            {cardBrand === "generic" && "Atelier Saree"}
                          </span>
                        </div>

                        {/* Card Number */}
                        <div className="font-mono text-lg md:text-xl tracking-[0.18em] text-white/90 my-4 text-center">
                          {paymentForm.cardNumber || "•••• •••• •••• ••••"}
                        </div>

                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <span className="block text-[8px] uppercase tracking-widest text-white/30">Cardholder Name</span>
                            <span className="block font-mono text-xs text-white/70 max-w-[200px] truncate">
                              {paymentForm.cardName || "YOUR NAME"}
                            </span>
                          </div>
                          <div className="space-y-1 text-right">
                            <span className="block text-[8px] uppercase tracking-widest text-white/30">Expires</span>
                            <span className="block font-mono text-xs text-white/70">
                              {paymentForm.cardExpiry || "MM/YY"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CARD BACK */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl py-6 flex flex-col justify-between overflow-hidden shadow-2xl border border-white/15" style={{ background: "linear-gradient(135deg, rgba(20,25,35,0.98) 0%, rgba(10,13,20,0.98) 100%)", backdropFilter: "blur(20px)" }}>
                        {/* Magnetic Strip */}
                        <div className="w-full h-10 bg-black/60 mt-1" />

                        {/* Signature Strip & CVV */}
                        <div className="px-6 flex items-center justify-between gap-4 mt-2">
                          <div className="flex-1 h-8 bg-white/5 rounded-md border border-white/5 flex items-center px-3 text-white/30 italic text-xs font-mono select-none">
                            Authorized Signature
                          </div>
                          <div className="w-16 h-8 bg-yellow-400 text-black font-mono text-sm font-bold flex items-center justify-center rounded">
                            {paymentForm.cardCvv || "•••"}
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="px-6 text-[8px] text-white/20 text-center leading-relaxed">
                          This simulated card is property of Peacock Blouse House. Dedicated to artisan luxury craftsmanship.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handlePlaceOrder} className="p-6 rounded-xl space-y-5" style={{ background: "rgba(15,20,30,0.6)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}>
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.4} />
                        <h2 className="font-serif text-xl">Payment Details</h2>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setStep("shipping")}
                        className="text-xs text-white/40 hover:text-[#D4AF37] transition-colors"
                      >
                        Edit Shipping
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] tracking-widest uppercase text-[#D4AF37]/75">Card Number *</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="text"
                            name="cardNumber"
                            value={paymentForm.cardNumber}
                            onChange={handlePaymentChange}
                            onFocus={() => setIsCardFlipped(false)}
                            placeholder="xxxx xxxx xxxx xxxx"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] tracking-widest uppercase text-[#D4AF37]/75">Cardholder Name *</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="text"
                            name="cardName"
                            value={paymentForm.cardName}
                            onChange={handlePaymentChange}
                            onFocus={() => setIsCardFlipped(false)}
                            placeholder="e.g. PRIYADARSHINI SEN"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-mono uppercase focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] tracking-widest uppercase text-[#D4AF37]/75">Expiry Date *</label>
                          <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                              type="text"
                              name="cardExpiry"
                              value={paymentForm.cardExpiry}
                              onChange={handlePaymentChange}
                              onFocus={() => setIsCardFlipped(false)}
                              placeholder="MM/YY"
                              required
                              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] tracking-widest uppercase text-[#D4AF37]/75">CVV / CVN *</label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                              type="password"
                              name="cardCvv"
                              value={paymentForm.cardCvv}
                              onChange={handlePaymentChange}
                              onFocus={() => setIsCardFlipped(true)}
                              onBlur={() => setIsCardFlipped(false)}
                              placeholder="•••"
                              required
                              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 py-3 border-t border-b border-white/5 my-4">
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                      <span className="text-xs text-white/50 leading-tight">
                        Your transaction is encrypted securely. Funds are only drawn as mock-payment checkout items.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#D4AF37] text-black font-bold text-sm tracking-widest uppercase rounded hover:bg-[#F3E5AB] transition-all"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Processing Order...
                        </>
                      ) : (
                        <>
                          Place Order (₹{finalTotal.toLocaleString("en-IN")})
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-xl space-y-4" style={{ background: "rgba(15,20,30,0.4)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <h3 className="font-serif text-lg border-b border-white/5 pb-3">Order Summary</h3>

                {/* Items */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="w-16 h-20 rounded overflow-hidden flex-shrink-0 bg-white/5 border border-white/5">
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm text-white/80 leading-tight truncate">{item.product.name}</h4>
                        <p className="text-xs text-white/30 mt-0.5">{item.product.fabric || "Pure Fabric"} · Qty: {item.quantity}</p>
                        <p className="text-sm text-[#D4AF37] font-medium mt-1">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-white/5 mt-4" />

                {/* Pricing Summary */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? "Free Shipping" : `₹${shippingFee}`}</span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-[10px] text-white/30 italic text-right">
                      Add ₹{(15000 - cartTotal).toLocaleString("en-IN")} more for Free Shipping
                    </p>
                  )}
                  
                  <div className="h-px bg-white/5 my-2" />
                  
                  <div className="flex justify-between text-base font-medium">
                    <span className="text-white/80 uppercase tracking-widest text-xs">Total Due</span>
                    <span className="text-[#D4AF37] font-serif text-lg">₹{finalTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Step 3: Success Confirmation (Receipt / Invoice view) */
        <div className="min-h-screen flex flex-col justify-between" style={{ background: "var(--pk-bg)" }}>
          <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-20 flex flex-col items-center">
            
            {/* Header Success Ring */}
            <div className="relative mb-6 text-center animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-400" strokeWidth={1.2} />
              </div>
              <h2 className="font-serif text-3xl font-light text-white mt-5">Order Confirmed</h2>
              <p className="text-xs text-white/40 tracking-widest uppercase mt-1">Thank you for your order</p>
            </div>

            {/* Print/Download Invoice Block */}
            <div 
              id="invoice-print-area"
              className="w-full rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl print:bg-white print:text-black" 
              style={{ background: "rgba(15,20,30,0.6)", border: "1px solid rgba(212,175,55,0.15)", backdropFilter: "blur(20px)" }}
            >
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4 print:border-black/10">
                <div>
                  <h3 className="font-serif text-xl text-white print:text-black italic">Peacock Blouse House</h3>
                  <p className="text-[10px] text-white/30 tracking-widest uppercase print:text-black/50">Atelier Luxury Saree Collection</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#D4AF37] tracking-widest uppercase print:text-black/70">Order Invoice</p>
                  <p className="text-sm font-mono text-white/70 print:text-black">#{orderResult?.id}</p>
                </div>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-white/30 uppercase tracking-widest text-[9px] print:text-black/50">Shipped To</p>
                  <p className="text-white/80 font-medium mt-1 print:text-black">{shippingForm.name}</p>
                  <p className="text-white/50 print:text-black/70 mt-0.5">{shippingForm.address}</p>
                  <p className="text-white/50 print:text-black/70">{shippingForm.city}, {shippingForm.state} - {shippingForm.pincode}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/30 uppercase tracking-widest text-[9px] print:text-black/50">Contact Detail</p>
                  <p className="text-white/80 mt-1 print:text-black">{shippingForm.email}</p>
                  <p className="text-white/50 print:text-black/70 mt-0.5">{shippingForm.phone}</p>
                  <p className="text-white/30 uppercase tracking-widest text-[9px] mt-2 print:text-black/50">Date</p>
                  <p className="text-white/60 print:text-black/70 mt-0.5">
                    {orderResult ? new Date(orderResult.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : new Date().toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Invoice Items Table */}
              <div className="border-t border-b border-white/5 py-4 print:border-black/10">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-white/30 print:text-black/50 text-[9px] uppercase tracking-widest">
                      <th className="text-left font-normal pb-2">Item Description</th>
                      <th className="text-center font-normal pb-2">Qty</th>
                      <th className="text-right font-normal pb-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderResult?.items?.map((item: any) => (
                      <tr key={item.product.id} className="border-t border-white/5 print:border-black/5">
                        <td className="py-2 text-white/80 print:text-black">
                          <p className="font-serif">{item.product.name}</p>
                          <p className="text-[10px] text-white/40 print:text-black/50">{item.product.fabric} · {item.product.color}</p>
                        </td>
                        <td className="py-2 text-center text-white/60 print:text-black">{item.quantity}</td>
                        <td className="py-2 text-right text-white/80 print:text-black">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end text-xs">
                <div className="w-48 space-y-2">
                  <div className="flex justify-between text-white/50 print:text-black/60">
                    <span>Subtotal</span>
                    <span>₹{((orderResult?.total ? orderResult.total - (orderResult.total > 15000 ? 0 : 250) : 0)).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-white/50 print:text-black/60">
                    <span>Shipping Fee</span>
                    <span>{(orderResult?.total > 15000) ? "Free" : "₹250"}</span>
                  </div>
                  <div className="h-px bg-white/5 my-1 print:bg-black/15" />
                  <div className="flex justify-between font-medium">
                    <span className="text-[#D4AF37] print:text-black uppercase tracking-widest text-[10px]">Total Paid</span>
                    <span className="text-[#D4AF37] print:text-black font-serif text-sm">₹{orderResult?.total ? Number(orderResult.total).toLocaleString("en-IN") : "0"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/50 rounded transition-all text-sm tracking-wider uppercase"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
              <Link
                href="/marketplace"
                className="flex items-center gap-2 px-8 py-3 text-black font-semibold text-sm tracking-widest uppercase rounded transition-all"
                style={{ background: "#D4AF37" }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Visual styles injection */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        /* Custom print stylesheet override */
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          #invoice-print-area {
            background: white !important;
            color: black !important;
            border: 1px solid black !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          #invoice-print-area * {
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
}
