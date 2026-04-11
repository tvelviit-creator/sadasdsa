"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getOrderById, saveOrder, deleteOrder, Order } from "@/utils/orders";
import { ChatMessage, getChatMessages, sendChatMessage } from "@/utils/chat";
import { getCurrentUserPhone } from "@/utils/userData";

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

  const hasChanges = 
    title !== order?.title || 
    status !== order?.status || 
    stage !== (order?.stage || "processing") || 
    JSON.stringify(features) !== JSON.stringify(order?.features || []);

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

  const handleUpdate = async (updates: Partial<Order> = {}) => {
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
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex justify-center selection:bg-[#FF8C67]/30 overflow-x-hidden">
      <div className="w-full max-w-[375px] relative min-h-screen flex flex-col">
        {/* Header - EXACT matching layout from client/seller orders */}
        <header className="fixed top-0 w-full max-w-[375px] h-[160px] bg-[var(--bg-color)] z-50 px-[24px] pt-[64px] pb-[16px] flex flex-col justify-between left-1/2 -translate-x-1/2 border-b border-[var(--border-color)]">
          <div className="relative flex items-center justify-center w-full h-[32px]">
            <button 
              onClick={() => router.back()} 
              className="absolute left-0 w-[32px] h-[32px] flex items-center justify-center active:scale-95 transition-all text-[var(--text-primary)]"
            >
              <svg width="24" height="24" viewBox="29 63 22 18" fill="none">
                <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 
              className="text-[24px] font-bold text-[var(--text-primary)] leading-[120%]"
              style={{ fontFamily: 'Cera Pro, sans-serif' }}
            >
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

          <div className="relative flex bg-[var(--bg-color)] rounded-full border border-[#FFF]/10 h-[56px] w-full p-[4px] mt-[24px]">
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

        <main className="flex-1 relative overflow-hidden h-full">
          <div
            className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform"
            style={{
              transform: activeTab === 'details' ? 'translateX(0%)' : 'translateX(-50%)',
              width: '200%'
            }}
          >
            {/* Details Tab */}
            <div className="w-1/2 h-full shrink-0 overflow-y-auto hide-scrollbar px-6 pt-[180px] pb-24 space-y-6">
              {/* NAME FIELD */}
              <div className="space-y-2">
                <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Название</p>
                <div className="w-full h-[56px] bg-[var(--border-color)] rounded-[16px] flex items-center px-6">
                  <input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    className="w-full bg-transparent border-none outline-none text-[15px] font-medium text-[var(--text-primary)] placeholder-[#666]"
                    placeholder="Фудтех приложение"
                  />
                </div>
              </div>
              
              {/* STATUS SECTION */}
              <div className="space-y-2">
                <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Статус</p>
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
                          onClick={() => { setStatus(s); }} 
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
                <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Этап</p>
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
                            onClick={() => { setStage(s); }} 
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
                <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Функции</p>
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
                <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Партнер</p>
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
                <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Клиент</p>
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
                  <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Разрешение спора</p>
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
              ref={chatContainerRef}
              className="w-1/2 h-full shrink-0 overflow-y-auto hide-scrollbar pt-[180px] px-[24px]"
            >
              <div className="flex flex-col space-y-6 pb-32">
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
          </div>
        </main>

        <div className={`fixed bottom-0 w-full max-w-[375px] px-[16px] pb-[34px] bg-[var(--bg-color)] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] left-1/2 -translate-x-1/2 z-50 ${activeTab === 'chat' ? 'translate-y-0' : 'translate-y-full'}`}>
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
              <button className="w-[48px] h-[48px] rounded-full bg-[var(--border-color)] flex items-center justify-center shrink-0 active:scale-90 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>

              {/* Input Area */}
              <div className="flex-1 bg-[var(--border-color)] rounded-full h-full flex items-center px-[20px]">
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
                className="w-[48px] h-[48px] rounded-full bg-[var(--border-color)] flex items-center justify-center transition-all shrink-0 active:scale-90 disabled:opacity-50"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={inputText.trim() ? "var(--text-primary)" : "var(--text-secondary)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M12 5l-7 7M12 5l7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Save Button - Using Provided SVG - Only on Details Tab */}
      {activeTab === 'details' && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${hasChanges ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-[120%] opacity-0 scale-95 pointer-events-none'}`}>
            <button
                onClick={() => handleUpdate({})} 
                className="w-[327px] h-[56px] relative flex items-center justify-center active:scale-95 transition-all"
            >
                <svg width="327" height="56" viewBox="0 0 327 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
                    <rect width="327" height="56" rx="28" fill="#F5F5F5"/>
                    <path d="M128.122 32.692C127.088 32.692 126.138 32.452 125.274 31.972C124.421 31.492 123.744 30.836 123.242 30.004C122.752 29.1613 122.506 28.2333 122.506 27.22C122.506 26.2067 122.757 25.284 123.258 24.452C123.76 23.6093 124.437 22.948 125.29 22.468C126.154 21.988 127.104 21.748 128.138 21.748C129.141 21.748 130.048 21.9827 130.858 22.452C131.68 22.9107 132.325 23.5507 132.794 24.372L131.162 25.524C130.416 24.34 129.408 23.748 128.138 23.748C127.488 23.748 126.901 23.8973 126.378 24.196C125.866 24.4947 125.461 24.9107 125.162 25.444C124.874 25.9667 124.73 26.564 124.73 27.236C124.73 27.908 124.874 28.5053 125.162 29.028C125.461 29.5507 125.866 29.9613 126.378 30.26C126.901 30.548 127.488 30.692 128.138 30.692C129.408 30.692 130.048 30.1 131.162 28.916L132.794 30.068C132.336 30.8893 131.696 31.5347 130.874 32.004C130.053 32.4627 129.136 32.692 128.122 32.692ZM138.106 32.676C137.327 32.676 136.612 32.4947 135.962 32.132C135.322 31.7587 134.815 31.2573 134.442 30.628C134.068 29.988 133.882 29.2893 133.882 28.532C133.882 27.7747 134.068 27.0813 134.442 26.452C134.815 25.812 135.327 25.3107 135.978 24.948C136.628 24.5853 137.343 24.404 138.122 24.404C138.9 24.404 139.615 24.5907 140.266 24.964C140.916 25.3267 141.428 25.8227 141.802 26.452C142.186 27.0813 142.378 27.7747 142.378 28.532C142.378 29.2893 142.186 29.988 141.802 30.628C141.428 31.2573 140.911 31.7587 140.25 32.132C139.599 32.4947 138.884 32.676 138.106 32.676ZM138.122 30.692C138.708 30.692 139.194 30.4893 139.578 30.084C139.972 29.6787 140.17 29.1667 140.17 28.548C140.17 27.9293 139.972 27.412 139.578 26.996C139.194 26.58 138.708 26.372 138.122 26.372C137.524 26.372 137.034 26.58 136.65 26.996C136.266 27.4013 136.074 27.9187 136.074 28.548C136.074 29.1667 136.266 29.6787 136.65 30.084C137.034 30.4893 137.524 30.692 138.122 30.692ZM148.71 32.5L147.014 29.972L145.302 32.5H142.886L145.782 28.42L143.078 24.58H145.494L147.014 26.868L148.518 24.58H150.934L148.214 28.404L151.126 32.5H148.71ZM156.858 24.404C157.594 24.404 158.25 24.5853 158.826 24.948C159.412 25.3 159.871 25.7907 160.202 26.42C160.532 27.0387 160.698 27.7427 160.698 28.532C160.698 29.3213 160.532 30.0307 160.202 30.66C159.871 31.2893 159.412 31.7853 158.826 32.148C158.25 32.5107 157.594 32.692 156.858 32.692C156.378 32.692 155.935 32.612 155.53 32.452C155.124 32.2813 154.778 32.0413 154.49 31.732V35.38H152.33V24.58H154.314V25.572C154.58 25.1987 154.932 24.9107 155.37 24.708C155.818 24.5053 156.314 24.404 156.858 24.404ZM156.458 30.724C157.034 30.724 157.519 30.5267 157.914 30.132C158.308 29.7267 158.506 29.1987 158.506 28.548C158.506 27.8867 158.308 27.3587 157.914 26.964C157.53 26.5587 157.044 26.356 156.458 26.356C155.914 26.356 155.444 26.5427 155.05 26.916C154.655 27.2787 154.458 27.8173 154.458 28.532C154.458 29.236 154.65 29.78 155.034 30.164C155.428 30.5373 155.903 30.724 156.458 30.724ZM165.64 24.404C166.675 24.404 167.496 24.6973 168.104 25.284C168.723 25.86 169.032 26.6973 169.032 27.796V32.5H167.048V31.732C166.76 32.0307 166.408 32.2653 165.992 32.436C165.587 32.6067 165.134 32.692 164.632 32.692C163.79 32.692 163.123 32.4733 162.632 32.036C162.142 31.588 161.896 31.0173 161.896 30.324C161.896 29.6093 162.163 29.0493 162.696 28.644C163.24 28.228 163.971 28.02 164.888 28.02H166.872V27.668C166.872 27.2307 166.744 26.8893 166.488 26.644C166.243 26.3987 165.88 26.276 165.4 26.276C164.995 26.276 164.632 26.3667 164.312 26.548C163.992 26.7187 163.656 26.9907 163.304 27.364L162.184 26.036C163.102 24.948 164.254 24.404 165.64 24.404ZM165.208 31.108C165.678 31.108 166.072 30.964 166.392 30.676C166.712 30.3773 166.872 29.9987 166.872 29.54V29.444H165.176C164.824 29.444 164.552 29.5133 164.36 29.652C164.168 29.78 164.072 29.9773 164.072 30.244C164.072 30.5107 164.174 30.724 164.376 30.884C164.59 31.0333 164.867 31.108 165.208 31.108ZM171.159 24.58H173.303V27.476H176.231V24.58H178.375V32.5H176.231V29.316H173.303V32.5H171.159V24.58ZM187.892 24.404V32.5H185.732V28.212L181.316 32.692H180.612V24.58H182.756V28.9L187.188 24.404H187.892ZM191.664 26.404H189.232V24.58H196.256V26.404H193.808V32.5H191.664V26.404ZM197.597 24.58H199.741V26.868H201.181C202.151 26.868 202.941 27.1187 203.549 27.62C204.167 28.1213 204.477 28.804 204.477 29.668C204.477 30.5427 204.167 31.236 203.549 31.748C202.941 32.2493 202.151 32.5 201.181 32.5H197.597V24.58ZM201.117 30.676C201.479 30.676 201.762 30.596 201.965 30.436C202.178 30.2653 202.285 30.02 202.285 29.7C202.285 29.3907 202.178 29.1453 201.965 28.964C201.751 28.7827 201.469 28.692 201.117 28.692H199.741V30.676H201.117Z" fill="#141414"/>
                </svg>
            </button>
        </div>
      )}

      <style jsx global>{` body { background-color: var(--bg-color); } ::-webkit-scrollbar { display: none; } .hide-scrollbar::-webkit-scrollbar { display: none; } `}</style>
    </div>
  );
}
