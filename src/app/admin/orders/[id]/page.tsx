"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getOrderById, saveOrder, deleteOrder, Order } from "@/utils/orders";
import { ChatMessage, getChatMessages, sendChatMessage } from "@/utils/chat";
import { getCurrentUserPhone } from "@/utils/userData";
import { ChevronLeft } from "lucide-react";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const currentPhone = getCurrentUserPhone();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Order["status"]>("pending");
  const [stage, setStage] = useState<Order["stage"]>("processing");
  const [features, setFeatures] = useState<string[]>([]);
  const [partnerName, setPartnerName] = useState("");
  const [clientName, setClientName] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [focusedFeatureIdx, setFocusedFeatureIdx] = useState<number | null>(null);

  // Tab State
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const [activeTab, setActiveTabInternal] = useState<"details" | "chat">((searchParams.get('tab') as "chat") || "details");
  
  const setActiveTab = (tab: "details" | "chat") => {
    const params = new URLSearchParams(searchParams);
    if (tab === 'chat') {
        params.set('tab', 'chat');
    } else {
        params.delete('tab');
    }
    router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
    setActiveTabInternal(tab);
  };

  // Chat states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [hasUnreadInOrder, setHasUnreadInOrder] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (messages.length === 0) return;
    const lastConnectIdx = [...messages].reverse().findIndex(m => m.text === "Администратор подключился к чату");
    // For regular orders we don't really have "close request" in the same way, but we can assume once connected, always connected for this session or until refresh.
    // Or we can just check if any message from admin exists.
    if (lastConnectIdx !== -1) {
      setIsConnected(true);
    }
  }, [messages]);

  const connectToChat = async () => {
    if (isConnected || !orderId || !currentPhone) return;

    const systemMsg: ChatMessage = {
      id: `msg_sys_${Date.now()}`,
      orderId: orderId,
      senderPhone: 'SYSTEM',
      text: "Администратор подключился к чату",
      timestamp: new Date().toISOString(),
      isSystem: true
    };

    try {
        await window.fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(systemMsg)
        });
        setMessages(prev => [...prev, systemMsg]);
        setIsConnected(true);
    } catch (e) {
        console.error(e);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const orderData = await getOrderById(orderId);
        if (orderData) {
          setOrder(orderData);
          setTitle(orderData.title || "");
          setStatus(orderData.status || "pending");
          setStage(orderData.stage || "processing");
          setFeatures(orderData.features || []);
          setPartnerName(orderData.partnerName || "");
          setClientName(orderData.clientName || "");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!orderId || !currentPhone) return;

    const checkUnread = async () => {
      try {
        const res = await window.fetch(`/api/chat?orderId=${orderId}`);
        if (res.ok) {
          const msgs = await res.json();
          const unread = msgs.some((m: any) => m.senderPhone !== currentPhone && !m.isRead);
          setHasUnreadInOrder(unread);
          if (activeTab === 'chat') {
            setMessages(msgs);
            if (unread) {
              window.fetch(`/api/chat?markRead=true&orderId=${orderId}&phone=${currentPhone}`)
                .then(() => {
                  window.dispatchEvent(new CustomEvent('refreshUnread'));
                });
            }
          }
        }
      } catch (e) {}
    };

    checkUnread();
    const interval = setInterval(checkUnread, 3000);
    return () => clearInterval(interval);
  }, [orderId, currentPhone, activeTab]);

  useEffect(() => {
    if (activeTab === "chat" && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, activeTab]);
  
  useEffect(() => {
    if ((status === 'completed' || status === 'cancelled') && activeTab === 'chat') {
      setActiveTab('details');
    }
  }, [status, activeTab]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !orderId || !currentPhone) return;
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      orderId: orderId,
      senderPhone: currentPhone,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      isAdminSender: true
    };
    sendChatMessage(newMessage);
    setMessages(prev => [...prev, newMessage]);
    setInputText("");
  };

  const handleUpdate = async (updates: Partial<Order>) => {
    if (!order) return;
    
    const updatedOrder: Order = { 
      ...order, 
      title, 
      status, 
      stage, 
      features, 
      partnerName, 
      clientName, 
      ...updates,
      updatedAt: new Date().toISOString() 
    };
    
    setOrder(updatedOrder);
    if (updates.features) {
      setFeatures(updates.features);
    }
    
    try {
      await saveOrder(updatedOrder);
    } catch (err) {
      console.error("Failed to save order:", err);
    }
  };

  const handleCompleteOrder = async () => {
    if (!confirm("Завершить заказ и закрыть спор?")) return;
    
    const updates = { status: 'completed' as const, isDisputed: false, disputeResolved: true };
    setOrder(prev => prev ? { ...prev, ...updates } : null);
    setStatus('completed');
    
    // Send system message
    const sysMsg: ChatMessage = {
      id: `msg_resolve_${Date.now()}`,
      orderId: orderId,
      senderPhone: 'SYSTEM',
      text: "✅ Спор разрешен администратором. Заказ завершен.",
      timestamp: new Date().toISOString(),
      isSystem: true
    };
    await sendChatMessage(sysMsg);
    setMessages(prev => [...prev, sysMsg]);
    
    await handleUpdate(updates);

    // Close the support request/dispute
    await window.fetch('/api/support', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: 'closed' })
    });
  };

  const handleCancelOrder = async () => {
    if (!confirm("Отменить заказ и закрыть спор?")) return;
    
    const updates = { status: 'cancelled' as const, isDisputed: false, disputeResolved: true };
    setOrder(prev => prev ? { ...prev, ...updates } : null);
    setStatus('cancelled');
    
    // Send system message
    const sysMsg: ChatMessage = {
      id: `msg_resolve_${Date.now()}`,
      orderId: orderId,
      senderPhone: 'SYSTEM',
      text: "❌ Спор разрешен администратором. Заказ отменен.",
      timestamp: new Date().toISOString(),
      isSystem: true
    };
    await sendChatMessage(sysMsg);
    setMessages(prev => [...prev, sysMsg]);
    
    await handleUpdate(updates);

    // Close the support request/dispute
    await window.fetch('/api/support', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: 'closed' })
    });
  };

  const handleDelete = async () => {
    if (confirm("Удалить этот заказ?")) {
      await deleteOrder(orderId);
      router.push("/admin/orders");
    }
  };

  const addFeature = () => {
    const trimmed = newFeature.trim();
    if (!trimmed) return;
    
    const updatedFeatures = [...features, trimmed];
    setFeatures(updatedFeatures);
    handleUpdate({ features: updatedFeatures });
    
    setNewFeature("");
    setIsAdding(false);
  };

  const removeFeature = (idx: number) => {
    const updatedFeatures = features.filter((_, i) => i !== idx);
    setFeatures(updatedFeatures);
    handleUpdate({ features: updatedFeatures });
  };

  if (loading || !order) return <div className="min-h-screen bg-[var(--bg-color)]" />;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[var(--text-primary)] font-sans relative overflow-hidden">
      {/* Background Architectural Grid */}
      <div className="hidden md:block absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      
      {/* Background Accents */}
      <div className="hidden md:block absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent-cyan)]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="hidden md:block absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full relative min-h-screen flex flex-col md:max-w-none md:w-full z-10">
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col w-full max-w-[1600px] mx-auto px-12 xl:px-24 pt-12 pb-4">
          <header className="flex flex-col md:flex-row items-center justify-between w-full bg-[var(--card-bg)] border border-[var(--border-color)] shadow-2xl rounded-[32px] px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex flex-col gap-1 cursor-pointer group w-fit relative z-10" onClick={() => router.back()}>
              <div className="flex items-center gap-3 text-[var(--accent-cyan)] opacity-60 hover:opacity-100 transition-opacity">
                 <ChevronLeft className="w-5 h-5" />
                 <span className="font-bold text-[10px] uppercase tracking-[0.2em]">Назад к списку</span>
              </div>
              <h1 className="text-3xl font-bold font-cera text-[var(--text-primary)] mt-2">
                Заказ <span className="text-[var(--accent-cyan)] opacity-40">#{order.orderNumber || order.id.slice(-2)}</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0 relative z-10">
               <button 
                onClick={handleDelete}
                className="h-12 px-8 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
               >
                 Удалить заказ
               </button>
            </div>
          </header>
        </div>

        {/* Header - EXACT matching layout from client/seller orders */}
        <header className="md:hidden fixed top-0 w-full max-w-[375px] h-[160px] bg-black/40 backdrop-blur-3xl border-b border-white/5 shadow-2xl z-50 px-[24px] pt-[64px] pb-[16px] flex flex-col justify-between left-1/2 -translate-x-1/2">
          <div className="relative flex items-center justify-center w-full h-[32px]">
            <button 
              onClick={() => router.back()} 
              className="absolute left-0 w-[32px] h-[32px] flex items-center justify-center active:scale-95 transition-all text-[var(--text-primary)]"
            >
              <svg width="24" height="24" viewBox="29 63 22 18" fill="none">
                <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
              Заказ № {order.orderNumber || order.id.slice(-2)}
            </h1>
            <button 
              onClick={handleDelete} 
              className="absolute right-0 w-[32px] h-[32px] flex items-center justify-center active:scale-95 transition-all"
            >
              <svg width="20" height="22" viewBox="325 61 20 22" fill="none">
                <path d="M337.5 69.5556V78.1111M332.5 69.5556V78.1111M327.5 64.6667V79.0889C327.5 80.4579 327.5 81.1419 327.772 81.6648C328.012 82.1248 328.394 82.4995 328.865 82.7338C329.399 83 330.099 83 331.496 83H338.504C339.901 83 340.6 83 341.134 82.7338C341.605 82.4995 341.988 82.1248 342.228 81.6648C342.5 81.1425 342.5 80.459 342.5 79.0927V64.6667M327.5 64.6667H330M327.5 64.6667H325M330 64.6667H340M330 64.6667C330 63.5277 330 62.9585 330.19 62.5093C330.444 61.9103 330.93 61.4342 331.543 61.1861C332.002 61 332.585 61 333.75 61H336.25C337.415 61 337.997 61 338.457 61.1861C339.069 61.4342 339.556 61.9103 339.81 62.5093C340 62.9585 340 63.5277 340 64.6667M340 64.6667H342.5M342.5 64.6667H345" stroke="#FF8C67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="relative flex bg-white/5 backdrop-blur-md rounded-full border border-white/10 h-[56px] w-full p-[4px] mt-[24px] shadow-sm">
            <div
              className={`absolute top-[4px] bottom-[4px] ${(status === 'completed' || status === 'cancelled') ? 'w-[calc(100%-8px)]' : 'w-[calc(50%-4px)]'} rounded-full transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] border border-white ${activeTab === 'details' || (status === 'completed' || status === 'cancelled') ? 'left-[4px]' : 'left-[50%]'}`}
            />
            <button
              onClick={() => setActiveTab('details')}
              className={`relative z-10 flex-1 rounded-full text-[17px] font-semibold transition-all duration-500 flex items-center justify-center ${activeTab === 'details' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
            >
              Детали
            </button>
            {(status !== 'completed' && status !== 'cancelled') && (
              <button
                onClick={() => setActiveTab('chat')}
                className={`relative z-10 flex-1 rounded-full text-[17px] font-semibold transition-all duration-500 flex items-center justify-center ${activeTab === 'chat' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
              >
                Чат
                {activeTab !== 'chat' && hasUnreadInOrder && (
                  <div className="absolute top-[16px] right-[24px] w-[8px] h-[8px] bg-[#FF8C67] rounded-full border border-[var(--bg-color)] shadow-[0_0_10px_rgba(255,140,103,0.5)]" />
                )}
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 relative overflow-hidden h-full md:overflow-visible md:px-8 md:px-10 lg:px-12 md:pb-12">
          <div
            className={`flex h-full will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] w-[200%] md:w-full md:grid md:grid-cols-2 md:gap-10 md:!transform-none ${activeTab === 'details' ? 'translate-x-0' : '-translate-x-1/2'}`}
          >
            {/* Details Tab */}
            <div className="w-1/2 md:w-full h-full shrink-0 overflow-y-auto hide-scrollbar px-6 pt-[180px] md:pt-0 pb-24 md:pb-0 space-y-6 md:p-8 md:bg-[var(--card-bg)] md:border md:border-[var(--border-color)] md:rounded-[32px]">
              {/* NAME FIELD */}
              <div className="space-y-2">
                <p className="text-[13px] font-medium text-[var(--text-secondary)] ml-1">Название</p>
                <div className="w-full h-[56px] bg-[var(--border-color)] rounded-[16px] flex items-center px-6">
                  <input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    onBlur={() => handleUpdate({ title })} 
                    className="w-full bg-transparent border-none outline-none text-[15px] font-medium text-[var(--text-primary)] placeholder-[#666]"
                    placeholder="Фудтех приложение"
                  />
                </div>
              </div>
              
              {/* STATUS SECTION */}
              <div className="space-y-2">
                <p className="text-[13px] font-medium text-[var(--text-secondary)] ml-1">Статус</p>
                <div className="relative h-[31px] w-full border border-[var(--border-color)] rounded-full flex items-center p-0">
                  {(['in_progress', 'pending', 'cancelled'] as const).map((s) => {
                    const isActive = status === s;
                    const label = s === 'in_progress' ? 'В работе' : s === 'pending' ? 'Ожидает' : 'Остановлен';
                    const activeBg = s === 'in_progress' ? '#4AC99B' : s === 'pending' ? '#FFC700' : '#FF8C67';
                    
                    return (
                      <div key={s} className="flex-1 h-full relative z-10">
                        {isActive && (
                          <div 
                            className="absolute inset-[0px] rounded-full border border-[var(--text-primary)] z-0 transition-all duration-300" 
                            style={{ backgroundColor: activeBg }}
                          />
                        )}
                        <button 
                          onClick={() => { setStatus(s); handleUpdate({ status: s }); }} 
                          className={`relative z-10 w-full h-full text-[12px] font-bold transition-all duration-300 ${isActive ? 'text-[var(--bg-color)]' : 'text-[var(--text-primary)]/40'}`}
                        >
                          {label}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STAGE SECTION */}
              <div className="space-y-2">
                <p className="text-[13px] font-medium text-[var(--text-secondary)] ml-1">Этап</p>
                <div className="relative h-[31px] w-full border border-[var(--border-color)] rounded-full flex items-center px-[2px]">
                  {(['processing', 'design', 'development', 'test', 'ready'] as const).map((s) => {
                    const isActive = stage === s;
                    const label = s === 'processing' ? 'Обраб.' : s === 'design' ? 'Дизайн' : s === 'development' ? 'Разраб.' : s === 'test' ? 'Тест.' : 'Готов';
                    return (
                      <div key={s} className="flex-1 h-full flex items-center justify-center relative">
                          {isActive && (
                            <div className="absolute inset-x-0 h-full border border-[var(--text-primary)] rounded-full bg-transparent z-0" />
                          )}
                          <button 
                            onClick={() => { setStage(s); handleUpdate({ stage: s }); }} 
                            className={`relative z-10 w-full h-full text-[10px] font-bold transition-all duration-300 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]/20'}`}
                          >
                            {label}
                          </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FUNCTIONS SECTION */}
              <div className="space-y-3">
                <p className="text-[13px] font-medium text-[var(--text-secondary)] ml-1">Функции</p>
                <div className="space-y-2">
                  {features.map((f, i) => (
                    <div 
                      key={i} 
                      className={`w-full h-[56px] rounded-[16px] flex items-center justify-between px-6 transition-all border ${focusedFeatureIdx === i ? 'bg-[var(--border-color)] border-[var(--text-primary)]' : 'bg-[var(--border-color)] border-transparent'}`}
                    >
                      <input 
                        value={f} 
                        onFocus={() => setFocusedFeatureIdx(i)}
                        onBlur={() => {
                            setFocusedFeatureIdx(null);
                            handleUpdate({ features });
                        }}
                        onChange={e => {
                          const updated = [...features];
                          updated[i] = e.target.value;
                          setFeatures(updated);
                        }}
                        className="bg-transparent border-none outline-none text-[15px] font-medium text-[var(--text-primary)] w-full"
                      />
                      <button onClick={() => removeFeature(i)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all ml-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {isAdding && (
                    <div className="w-full h-[56px] bg-[var(--border-color)] rounded-[16px] flex items-center px-6 border border-[var(--text-primary)]">
                      <input 
                        autoFocus
                        value={newFeature} 
                        onChange={e => setNewFeature(e.target.value)} 
                        onKeyDown={e => {
                          if (e.key === 'Enter') addFeature();
                          if (e.key === 'Escape') setIsAdding(false);
                        }} 
                        placeholder="Название..." 
                        className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-[var(--text-primary)] placeholder-white/20"
                      />
                    </div>
                  )}

                  <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full h-[31px] rounded-full border border-[var(--border-color)] flex items-center justify-center gap-2 text-[13px] font-bold text-[var(--text-primary)] active:scale-95 transition-all mt-1"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    <span>Добавить</span>
                  </button>
                </div>
              </div>

              {/* PARTNER FIELD */}
              <div className="space-y-2">
                <p className="text-[13px] font-medium text-[var(--text-secondary)] ml-1">Партнер</p>
                <div 
                  onClick={() => order.sellerPhone && router.push(`/admin/users/${encodeURIComponent(order.sellerPhone)}`)}
                  className="w-full h-[56px] bg-[var(--border-color)] rounded-[16px] flex items-center px-6 cursor-pointer active:scale-[0.98] transition-all hover:bg-[#383838] border border-transparent hover:border-[var(--border-color)] group"
                >
                  <span className="text-[15px] font-medium text-[var(--text-primary)] group-hover:text-[#FF8C67] transition-colors">
                    {partnerName || "—"}
                  </span>
                  <div className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* CLIENT FIELD */}
              <div className="space-y-2">
                <p className="text-[13px] font-medium text-[var(--text-secondary)] ml-1">Клиент</p>
                <div 
                  onClick={() => order.clientPhone && router.push(`/admin/users/${encodeURIComponent(order.clientPhone)}`)}
                  className="w-full h-[56px] bg-[var(--border-color)] rounded-[16px] flex items-center px-6 cursor-pointer active:scale-[0.98] transition-all hover:bg-[#383838] border border-transparent hover:border-[var(--border-color)] group"
                >
                  <span className="text-[15px] font-medium text-[var(--text-primary)] group-hover:text-[#FF8C67] transition-colors">
                    {clientName || order.clientPhone || "—"}
                  </span>
                  <div className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* DISPUTE MANAGEMENT - Simple and consistent with the app design */}
              {order.isDisputed && (
                <div className="space-y-3 pt-4">
                  <p className="text-[13px] font-medium text-[#FF8C67] ml-1">Разрешение спора</p>
                  <div className="space-y-2">
                    <button
                      onClick={handleCompleteOrder}
                      className="w-full h-[56px] bg-[var(--text-primary)] rounded-[16px] text-[var(--bg-color)] text-[16px] font-bold active:scale-95 transition-all flex items-center justify-center"
                    >
                      Завершить заказ
                    </button>
                    <button
                      onClick={handleCancelOrder}
                      className="w-full h-[56px] bg-[var(--border-color)] border border-[var(--border-color)] rounded-[16px] text-[#FF8C67] text-[16px] font-bold active:scale-95 transition-all flex items-center justify-center"
                    >
                      Отменить заказ
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Tab content */}
            <div
              className={`w-1/2 md:w-full h-full shrink-0 flex flex-col pt-[180px] md:pt-0 pb-[100px] md:pb-0 relative md:bg-[var(--card-bg)] md:border md:border-[var(--border-color)] md:rounded-[32px] md:overflow-hidden ${status === 'completed' || status === 'cancelled' ? 'md:hidden' : ''}`}
            >
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto hide-scrollbar px-[24px] md:p-8">
                <div className="flex flex-col space-y-6 pb-32 md:pb-0">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center pt-20 opacity-30 text-center text-[var(--text-primary)]">
                    <p className="font-bold">Сообщений пока нет</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.senderPhone === currentPhone;
                    const isSystem = msg.isSystem || msg.senderPhone === 'SYSTEM' || (msg.text && msg.text.includes("⚠️ Спор открыт"));

                    if (isSystem) {
                      return (
                        <div key={index} className="flex justify-center w-full py-2">
                          <div className="max-w-[90%] text-center px-4 py-2 text-[13px] font-medium text-[var(--text-secondary)] leading-tight">
                            {msg.text}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] px-[16px] py-[12px] text-[16px] font-normal leading-tight break-words whitespace-pre-wrap shadow-sm transition-all duration-300 ${msg.isAdminSender ? "bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-color)] text-[var(--text-primary)] border border-[#FF8C67]/50 shadow-[0_0_20px_rgba(255,140,103,0.15)]" : (isMe ? "bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)]" : "bg-[var(--border-color)] text-[var(--text-primary)]")} ${isMe ? "rounded-[16px] rounded-tr-none" : "rounded-[16px] rounded-tl-none"}`}>
                          {msg.isAdminSender && !isMe && (
                            <div className="text-[10px] font-black text-[#FF8C67] mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-[#FF8C67] animate-pulse" />
                              Администратор
                            </div>
                          )}
                          {msg.text}
                          <div className={`text-[10px] mt-1.5 opacity-30 tabular-nums ${isMe ? "text-right" : "text-left"}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

              {/* Chat Input attached inside the chat tab for desktop, but fixed bottom for mobile */}
              <div className={`fixed bottom-0 w-full max-w-[375px] px-[16px] pb-[34px] bg-black/40 backdrop-blur-3xl border-t border-white/5 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] left-1/2 -translate-x-1/2 z-50 ${activeTab === 'chat' ? 'translate-y-0' : 'translate-y-full'} md:static md:w-full md:max-w-none md:p-6 md:bg-[var(--card-bg)] md:translate-y-0 md:transform-none md:border-t md:border-[var(--border-color)] md:shadow-none md:backdrop-blur-none md:z-10`}>
                {!isConnected ? (
                   <button 
                      onClick={connectToChat}
                      className="w-full h-[56px] bg-[var(--border-color)] rounded-full flex items-center justify-center active:scale-[0.98] transition-all border border-[var(--border-color)]"
                  >
                      <span className="text-[16px] font-bold text-[var(--text-primary)] uppercase tracking-wider">Подключиться</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-[8px] h-[48px]">
                    {/* Attachment Button */}
                    <button className="w-[48px] h-[48px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 active:scale-90 transition-transform md:bg-[var(--border-color)] md:border-transparent">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    </button>
      
                    {/* Input Area */}
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-full h-full flex items-center px-[20px] md:bg-[var(--border-color)] md:border-transparent">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (inputText.trim()) handleSendMessage();
                          }
                        }}
                        placeholder="Написать ответ..."
                        className="w-full bg-transparent text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/40 outline-none"
                      />
                    </div>
      
                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim()}
                      className="w-[48px] h-[48px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all shrink-0 active:scale-90 disabled:opacity-50 md:bg-[var(--border-color)] md:border-transparent"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={inputText.trim() ? "var(--text-primary)" : "var(--text-secondary)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5M12 5l-7 7M12 5l7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <style jsx global>{` body { background-color: var(--bg-color); } ::-webkit-scrollbar { display: none; } .hide-scrollbar::-webkit-scrollbar { display: none; } `}</style>
    </div>
  );
}
