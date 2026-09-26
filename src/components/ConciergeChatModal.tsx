import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  MapPin,
  Search,
  Compass,
  ArrowUpRight,
  RefreshCw,
  Layers,
  MessageSquare,
  Bot,
  User,
  ExternalLink,
  Shield,
  Map,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ChatMessage, GroundingData } from '../types';
import { db, auth } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebase/errors';

export const ConciergeChatModal: React.FC = () => {
  const { isConciergeOpen, setIsConciergeOpen, user, navigateTo } = useShop();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Greetings. I am your private ZENVY Sartorial Concierge. How may I assist your wardrobe curation today? I can formulate bespoke old-money ensembles, search global archival textiles, or pinpoint luxury tailoring and flagships on Google Maps.',
      timestamp: 'Just now',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'search' | 'maps'>('search');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isConciergeOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isConciergeOpen, loading]);

  // Request user geolocation when in Maps mode for enhanced local boutique grounding
  useEffect(() => {
    if (activeMode === 'maps' && !userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn('Geolocation unavailable for Maps Grounding:', err.message);
        },
        { timeout: 8000 }
      );
    }
  }, [activeMode, userLocation]);

  if (!isConciergeOpen) return null;

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputValue.trim();
    if (!textToSend || loading) return;

    const userMsgId = `usr_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!customPrompt) setInputValue('');
    setLoading(true);

    // Save user message to Firestore if authenticated
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'chat_messages', userMsgId), {
          id: userMsgId,
          userId: auth.currentUser.uid,
          role: 'user',
          text: userMsg.text,
          mode: activeMode,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Could not save user chat message to Firestore:', err);
      }
    }

    try {
      // Send multi-turn history to backend proxy route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role === 'model' ? 'model' : 'user',
            text: m.text,
          })),
          mode: activeMode,
          latLng: userLocation,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server returned an error');
      }

      const data = await response.json();
      const modelMsgId = `mdl_${Date.now()}`;

      const modelMsg: ChatMessage = {
        id: modelMsgId,
        role: 'model',
        text: data.reply || 'Apologies, I could not synthesize a recommendation at this moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grounding: data.grounding,
      };

      setMessages((prev) => [...prev, modelMsg]);

      // Save model reply to Firestore if authenticated
      if (auth.currentUser) {
        try {
          await setDoc(doc(db, 'users', auth.currentUser.uid, 'chat_messages', modelMsgId), {
            id: modelMsgId,
            userId: auth.currentUser.uid,
            role: 'model',
            text: modelMsg.text,
            mode: activeMode,
            createdAt: new Date().toISOString(),
          });
        } catch (err) {
          console.warn('Could not save assistant chat message to Firestore:', err);
        }
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'model',
          text: `I encountered an issue connecting to the styling atelier: ${err.message}. Please try again shortly.`,
          timestamp: 'Now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome_refreshed',
        role: 'model',
        text: 'Consultation ledger cleared. How may I curate your quiet luxury wardrobe today?',
        timestamp: 'Just now',
      },
    ]);
  };

  const quickPrompts = [
    {
      label: 'Formula for Lake Como',
      prompt: 'Curate a quiet luxury outfit for an autumn evening by Lake Como using ZENVY garments.',
      mode: 'search' as const,
    },
    {
      label: 'Nearby Tailoring & Boutiques',
      prompt: 'Find premier bespoke tailors, luxury dry cleaners, and high-fashion shopping districts near me.',
      mode: 'maps' as const,
    },
    {
      label: '2026 Quiet Luxury Trends',
      prompt: 'What are the current global trends in old money fashion and noble textiles?',
      mode: 'search' as const,
    },
    {
      label: '4-Ply Cashmere Care',
      prompt: 'What is the optimal care ritual for 4-ply Grade-A Mongolian cashmere to guarantee decades of wear?',
      mode: 'search' as const,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] w-full max-w-3xl h-[88vh] border border-[#121212]/20 shadow-2xl flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#121212] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] font-['Syne']">
                  ZENVY Haute Concierge
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-mono uppercase tracking-wider rounded-xs border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-[10px] text-white/60 font-light tracking-wide mt-0.5">
                AI Private Stylist · Grounded with Google Search & Google Maps
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              title="Reset conversation"
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsConciergeOpen(false)}
              className="p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Close concierge"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector Strip */}
        <div className="bg-white border-b border-[#121212]/10 px-4 py-2 flex items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373] hidden sm:inline">
            Intelligence Mode:
          </span>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveMode('search')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase transition-colors border ${
                activeMode === 'search'
                  ? 'bg-[#121212] text-white border-[#121212]'
                  : 'bg-white text-[#666666] border-[#121212]/15 hover:border-[#121212]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Google Search Grounding</span>
            </button>

            <button
              onClick={() => setActiveMode('maps')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase transition-colors border ${
                activeMode === 'maps'
                  ? 'bg-[#121212] text-white border-[#121212]'
                  : 'bg-white text-[#666666] border-[#121212]/15 hover:border-[#121212]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Google Maps Grounding</span>
            </button>
          </div>
        </div>

        {/* Chat Scrollable Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[90%] sm:max-w-[80%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs ${
                    isUser
                      ? 'bg-[#121212] text-white font-mono'
                      : 'bg-[#EDEBE6] border border-[#121212]/15 text-[#121212]'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 border text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#121212] text-white border-[#121212]'
                      : 'bg-white text-[#121212] border-[#121212]/15'
                  }`}
                >
                  <div className="whitespace-pre-line font-light">{msg.text}</div>

                  {/* Grounding Citations: Google Search Sources */}
                  {msg.grounding?.webChunks && msg.grounding.webChunks.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#121212]/10 space-y-1.5">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                        <Search className="w-3 h-3 text-[#121212]" />
                        <span>Google Search Verified Sources</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.grounding.webChunks.map((chunk, idx) => (
                          <a
                            key={idx}
                            href={chunk.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4F4F0] hover:bg-[#121212] hover:text-white text-[#121212] text-[10px] font-medium border border-[#121212]/15 transition-colors"
                          >
                            <span className="truncate max-w-[180px]">{chunk.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grounding Citations: Google Maps Places & Reviews */}
                  {msg.grounding?.mapsChunks && msg.grounding.mapsChunks.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#121212]/10 space-y-2">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                        <MapPin className="w-3 h-3 text-red-600" />
                        <span>Google Maps Locations & Ateliers</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {msg.grounding.mapsChunks.map((chunk, idx) => (
                          <a
                            key={idx}
                            href={chunk.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-[#F9F9F7] hover:bg-white text-[#121212] text-[11px] border border-[#121212]/15 hover:border-[#121212] transition-colors flex items-start justify-between gap-2 group"
                          >
                            <div>
                              <p className="font-semibold text-xs group-hover:underline">
                                {chunk.title}
                              </p>
                              {chunk.placeAnswerSources?.reviewSnippets?.[0] && (
                                <p className="text-[10px] text-[#666666] italic mt-1 line-clamp-2">
                                  &quot;{chunk.placeAnswerSources.reviewSnippets[0]}&quot;
                                </p>
                              )}
                            </div>
                            <ExternalLink className="w-3 h-3 shrink-0 text-[#888888] group-hover:text-[#121212] mt-0.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-2 font-mono ${
                      isUser ? 'text-white/50 text-right' : 'text-[#888888]'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-7 h-7 shrink-0 rounded-full bg-[#EDEBE6] border border-[#121212]/15 text-[#121212] flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-4 bg-white border border-[#121212]/15 text-xs text-[#666666] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#121212]" />
                <span className="font-light">
                  {activeMode === 'maps'
                    ? 'Consulting Google Maps spatial database & locations...'
                    : 'Searching noble textile archives & fashion history...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 bg-[#F4F4F0] border-t border-[#121212]/10 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] shrink-0">
            Ask:
          </span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveMode(qp.mode);
                handleSendMessage(qp.prompt);
              }}
              className="px-3 py-1 bg-white hover:bg-[#121212] hover:text-white text-[#121212] border border-[#121212]/15 text-[11px] font-medium whitespace-nowrap transition-colors"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#121212]/15 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={
                activeMode === 'maps'
                  ? 'Ask for bespoke tailors, dry cleaners, or flagships in your city...'
                  : 'Ask about Old Money styling formulas, fabric care, or archives...'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              className="flex-1 bg-[#F9F9F8] border border-[#121212]/20 px-3.5 py-2.5 text-xs sm:text-sm text-[#121212] focus:outline-none focus:border-[#121212] placeholder:text-[#999999]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="px-5 py-2.5 bg-[#121212] text-white hover:bg-black disabled:opacity-40 transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>Transmit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-[#737373] mt-2 px-1">
            <span>Powered by Gemini 3.5 Flash</span>
            {user.isLoggedIn ? (
              <span className="text-emerald-700 font-medium">
                ● Synchronized to Firestore ({user.email})
              </span>
            ) : (
              <span>Guest Session · Sign in with Google to persist notes</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
