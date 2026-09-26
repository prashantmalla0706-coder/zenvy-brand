import React, { useState } from 'react';
import { X, User, Package, Clock, LogOut, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AccountModal: React.FC = () => {
  const { isAccountOpen, setIsAccountOpen, user, loginUser, logoutUser, orders, signInWithGoogle, isFirebaseLoading } = useShop();
  const [authMode, setAuthMode] = useState<'profile' | 'login'>('profile');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  if (!isAccountOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    loginUser(nameInput.trim() || 'Valued Client', emailInput.trim());
    setAuthMode('profile');
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    setAuthMode('profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FBFBFA] w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl border border-[#121212]/10 p-6 md:p-8 relative">
        <button
          onClick={() => setIsAccountOpen(false)}
          className="absolute top-6 right-6 p-1 text-[#121212] hover:opacity-60 transition-opacity"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {user.isLoggedIn && authMode === 'profile' ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-[#121212]/10">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border border-[#121212]/20 object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-[#121212] text-white flex items-center justify-center font-['Syne'] font-bold text-lg rounded-full">
                  {user.name.charAt(0) || 'C'}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold uppercase tracking-wider text-[#121212]">
                    {user.name}
                  </h2>
                  {user.uid && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold tracking-wider uppercase rounded-xs">
                      Firebase Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#737373] mt-0.5">{user.email}</p>
              </div>
              <button
                onClick={logoutUser}
                className="text-xs text-[#888888] hover:text-[#121212] flex items-center gap-1.5 uppercase tracking-wider"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Zenvy VIP Tier */}
            <div className="my-6 p-4 bg-[#F2F2EE] flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#737373]">
                  Client Tier
                </p>
                <p className="text-sm font-semibold tracking-wide text-[#121212] mt-0.5">
                  {user.tier || 'Zenvy Black Member'}
                </p>
              </div>
              <span className="text-xs text-[#555555]">Synchronized with Cloud Firestore</span>
            </div>

            {/* Orders Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#121212] flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Order Archive ({orders.length})</span>
                </h3>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#737373]">
                  No orders placed yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-white border border-[#121212]/10 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-semibold text-[#121212]">{order.id}</span>
                        <span className="text-[#737373]">{order.date}</span>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-[#121212]/5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="truncate max-w-[200px] font-medium text-[#121212]">
                                {item.name}
                              </span>
                              <span className="text-[#888888]">
                                ({item.size} · {item.color}) × {item.quantity}
                              </span>
                            </div>
                            <span className="font-mono tabular-nums text-[#121212]">
                              ${item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#121212]/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{order.status}</span>
                          <span className="text-[#888888] font-mono ml-1 text-[11px]">
                            ({order.trackingNumber})
                          </span>
                        </div>
                        <div className="font-mono font-semibold text-[#121212]">
                          Total: ${order.total}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center pb-6">
              <h2 className="text-lg font-bold uppercase tracking-[0.2em] font-['Syne'] text-[#121212]">
                Zenvy Client Sign-In
              </h2>
              <p className="text-xs text-[#737373] mt-1">
                Access your private order archive and sync your wardrobe notes via Firebase.
              </p>
            </div>

            {/* Google Sign-In Primary Button */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isFirebaseLoading}
                className="w-full py-3.5 px-4 bg-white border border-[#121212]/20 hover:border-[#121212] text-[#121212] text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-colors shadow-xs hover:bg-[#F8F8F6] disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.02h3.87c2.27-2.09 3.675-5.17 3.675-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.12C3.32 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.27c-.25-.72-.39-1.49-.39-2.27s.14-1.55.39-2.27V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.12z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.32 2.64 1.28 6.61l3.99 3.12c.95-2.85 3.6-4.98 6.73-4.98z"
                  />
                </svg>
                <span>{isFirebaseLoading ? 'Connecting to Firebase...' : 'Continue with Google'}</span>
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-[#121212]/15 w-full" />
                <span className="bg-[#FBFBFA] px-3 text-[10px] font-mono uppercase tracking-wider text-[#888888]">
                  Or Enter Email
                </span>
                <div className="border-t border-[#121212]/15 w-full" />
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#555555] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Julian Vance"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-white border border-[#121212]/15 px-3 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#555555] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@zenvy.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-white border border-[#121212]/15 px-3 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#121212] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-black transition-colors"
                >
                  Sign In with Email
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

