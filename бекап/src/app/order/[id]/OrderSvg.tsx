'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getActiveRole } from '@/utils/userData';

export const OrderSvg = ({ order, activeTab, onTabChange }: { order: any, activeTab: 'details' | 'chat', onTabChange: (tab: 'details' | 'chat') => void }) => {
    const router = useRouter();
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [role, setRole] = useState<'client' | 'seller'>('client');

    useEffect(() => {
        const activeRole = getActiveRole();
        setRole(activeRole);

        // Use temp_order_client.svg for clients and temp_order.svg for sellers
        const svgPath = activeRole === 'seller' ? '/temp_order.svg' : '/temp_order_client.svg';

        fetch(svgPath)
            .then(res => res.text())
            .then(text => {
                // Remove the home indicator bar at the bottom
                let processed = text.replace(/<rect x="121" y="798" width="134" height="5" rx="2.5" fill="#F5F5F5"\/>/g, '');
                setSvgContent(processed);
            });
    }, []);

    if (!svgContent) return <div className="min-h-screen bg-[var(--bg-color)]" />;

    // Helper formatting
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('ru-RU');
    };

    return (
        <div className="relative w-full overflow-hidden bg-[var(--bg-color)] transition-colors duration-300" style={{ aspectRatio: '375/812' }}>
            {/* The SVG acts as the "Design Layer" */}
            <div
                className="absolute top-0 left-0 w-full h-full"
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />

            {/* Dynamic Content Layer - Overlays real data exactly where mockup texts are */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none text-[var(--text-primary)] font-sans">

                {/* 1. Order Title Overlay */}
                <div className="absolute top-[174px] left-[24px] w-[240px] bg-[var(--bg-color)] pointer-events-none transition-colors duration-300">
                    <h1 className="text-[28px] font-black leading-[1.1] tracking-tight">
                        {order.title || 'В разработке'}
                    </h1>
                </div>

                {/* 2. Price/Tariff Overlay (matches the look under the title) */}
                <div className="absolute top-[242px] left-[24px] bg-[var(--bg-color)] flex items-baseline gap-2 transition-colors duration-300">
                    <span className="text-[var(--text-secondary)] text-[16px] font-bold">{order.tariff || 'Базовый'}</span>
                    <span className="text-[var(--text-primary)] text-[16px] font-bold">{order.price?.toLocaleString()} ₽</span>
                </div>

                {/* 3. Status Badge Overlay */}
                <div className="absolute top-[174px] right-[24px] w-[72px] h-[20px] flex items-center justify-center bg-[#4AC99B] rounded-[10px]">
                    <span className="text-[#141414] text-[8px] font-black">
                        {order.status === 'in_progress' ? 'В работе' : order.status === 'completed' ? 'Готов' : 'Ждет'}
                    </span>
                </div>

                {/* 4. Information Grid Overlays (Positioned line-by-line where static rows are) */}
                <div className="absolute top-[345px] left-[24px] right-[24px] space-y-[21px]">
                    {/* Executor / Client Row */}
                    <div className="flex justify-between items-center bg-[var(--bg-color)] transition-colors duration-300">
                        <span className="text-[var(--text-secondary)] text-[11px] font-black tracking-[0.2em]">
                            {role === 'seller' ? 'Заказчик' : 'Исполнитель'}
                        </span>
                        <div className="flex-1 mx-2 border-b border-[var(--border-color)]" />
                        <span className="text-[var(--text-primary)] text-[13px] font-black">
                            {role === 'seller' ? (order.clientName || 'Иван Петров') : (order.partnerName || 'Твэлви')}
                        </span>
                    </div>

                    {/* Created Date Row */}
                    <div className="flex justify-between items-center bg-[var(--bg-color)] transition-colors duration-300">
                        <span className="text-[var(--text-secondary)] text-[11px] font-black tracking-[0.2em]">Создан</span>
                        <div className="flex-1 mx-2 border-b border-[var(--border-color)]" />
                        <span className="text-[var(--text-primary)] text-[13px] font-black">{formatDate(order.createdAt)}</span>
                    </div>

                    {/* Updated Date Row */}
                    <div className="flex justify-between items-center bg-[var(--bg-color)] transition-colors duration-300">
                        <span className="text-[var(--text-secondary)] text-[11px] font-black tracking-[0.2em]">Обновлен</span>
                        <div className="flex-1 mx-2 border-b border-[var(--border-color)]" />
                        <span className="text-[var(--text-primary)] text-[13px] font-black">{formatDate(order.updatedAt || order.createdAt)}</span>
                    </div>

                    {/* Email Row */}
                    <div className="flex justify-between items-center bg-[var(--bg-color)] transition-colors duration-300">
                        <span className="text-[var(--text-secondary)] text-[11px] font-black tracking-[0.2em]">E-mail</span>
                        <div className="flex-1 mx-2 border-b border-[var(--border-color)]" />
                        <span className="text-[var(--text-primary)] text-[13px] font-black lowercase truncate max-w-[150px]">
                            {order.clientEmail || 'mail@tvelv.ru'}
                        </span>
                    </div>

                    {/* Phone Row */}
                    <div className="flex justify-between items-center bg-[var(--bg-color)] transition-colors duration-300">
                        <span className="text-[var(--text-secondary)] text-[11px] font-black tracking-[0.2em]">Телефон</span>
                        <div className="flex-1 mx-2 border-b border-[var(--border-color)]" />
                        <span className="text-[var(--text-primary)] text-[13px] font-black">
                            {role === 'seller' ? order.clientPhone : '+7 (900) 000-00-00'}
                        </span>
                    </div>
                </div>

                {/* Interaction Handlers (Buttons) */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="absolute top-[60px] left-[20px] w-12 h-12 pointer-events-auto cursor-pointer"
                        aria-label="Назад"
                    />

                    {/* Tab Switching Buttons */}
                    <button
                        onClick={() => onTabChange('details')}
                        className={`absolute top-[286px] left-[24px] pointer-events-auto cursor-pointer ${role === 'seller' ? 'w-[137px]' : 'w-[160px]'} h-[30px]`}
                    />
                    <button
                        onClick={() => onTabChange('chat')}
                        className={`absolute top-[286px] ${role === 'seller' ? 'left-[169px] w-[144px]' : 'left-[190px] w-[160px]'} h-[30px]`}
                    />

                    {/* Support Link */}
                    <button
                        className="absolute bottom-[50px] left-[24px] right-[24px] h-[64px] pointer-events-auto cursor-pointer"
                        onClick={() => window.open('https://t.me/tvelv_support', '_blank')}
                    />
                </div>
            </div>
        </div>
    );
};
