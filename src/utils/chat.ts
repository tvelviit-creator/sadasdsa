export interface ChatMessage {
    id: string;
    orderId: string;
    senderPhone: string;
    text: string;
    timestamp: string;
    isAdminSender?: boolean;
    isSystem?: boolean;
}

const API_URL = "/api/chat";

export async function getChatMessages(orderId: string): Promise<ChatMessage[]> {
    try {
        const res = await fetch(`${API_URL}?orderId=${encodeURIComponent(orderId)}`);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch chat messages:", error);
        return [];
    }
}

export async function sendChatMessage(message: ChatMessage): Promise<void> {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });
    } catch (error) {
        console.error("Failed to send chat message:", error);
    }
}
