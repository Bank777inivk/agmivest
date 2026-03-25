import { useState, useRef, useEffect } from "react";
import {
    Send,
    MessageCircle,
    Paperclip,
    Smile,
    ArrowLeft,
    X,
    Trash2,
    Sparkles,
    Copy,
    CornerDownLeft,
    ChevronDown,
    ChevronUp,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    addDoc,
    deleteDoc,
    getDocs,
    writeBatch,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

// Helper Components
const UserAvatar = ({ name, className }: { name: string; className?: string }) => {
    const initials = name
        ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "??";
    return (
        <div className={cn("flex items-center justify-center font-bold", className)}>
            {initials}
        </div>
    );
};

const COMMON_EMOJIS = ["😊", "👍", "👋", "🙌", "❤️", "✨", "🔥", "🤝", "💡", "✅", "🚀", "📱", "🙏", "💪", "🎉", "💯"];

const SYSTEM_PROMPT = `Tu es un assistant IA expert pour un conseiller financier travaillant sur une plateforme d'investissement. Tu aides l'admin à :
- Rédiger des messages professionnels et bienveillants pour les clients
- Analyser des situations financières ou des dossiers clients
- Préparer des réponses claires, rassurantes et professionnelles
- Formuler des demandes de documents KYC de manière courtoise
Réponds toujours en français, de manière concise et professionnelle.`;

interface AiMessage {
    role: "user" | "assistant";
    content: string;
}

interface AiAssistantPanelProps {
    chatMessages: any[];
    chatUserName: string;
    onInjectText: (text: string) => void;
    onClose: () => void;
}

function AiAssistantPanel({ chatMessages, chatUserName, onInjectText, onClose }: AiAssistantPanelProps) {
    const [aiInput, setAiInput] = useState("");
    const [aiHistory, setAiHistory] = useState<AiMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [contextExpanded, setContextExpanded] = useState(false);
    const aiEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        aiEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiHistory]);

    // Build context from last 10 chat messages
    const buildChatContext = () => {
        if (!chatMessages.length) return "";
        const recent = chatMessages.slice(-10);
        const lines = recent.map((m: any) => {
            const sender = m.sender === "admin" ? "Conseiller" : chatUserName;
            const text = m.fileUrl ? `[Fichier: ${m.fileName || "pièce jointe"}]` : (m.text || "");
            return `${sender}: ${text}`;
        });
        return lines.join("\n");
    };

    const handleSend = async () => {
        const userText = aiInput.trim();
        if (!userText || isLoading) return;

        setAiInput("");
        setIsLoading(true);

        const chatContext = buildChatContext();
        const systemWithContext = chatContext
            ? `${SYSTEM_PROMPT}\n\n--- Contexte de la conversation en cours avec ${chatUserName} ---\n${chatContext}\n---`
            : SYSTEM_PROMPT;

        const newUserMessage: AiMessage = { role: "user", content: userText };
        const updatedHistory = [...aiHistory, newUserMessage];
        setAiHistory(updatedHistory);

        try {
            const response = await fetch("/api/ai-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: systemWithContext },
                        ...updatedHistory
                    ]
                })
            });

            if (!response.ok) throw new Error("API error");
            const data = await response.json();
            const assistantContent = data.content || "Désolé, je n'ai pas pu générer une réponse.";
            setAiHistory(prev => [...prev, { role: "assistant", content: assistantContent }]);
        } catch {
            setAiHistory(prev => [...prev, {
                role: "assistant",
                content: "❌ Erreur de connexion avec l'assistant IA. Vérifiez votre connexion et réessayez."
            }]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const chatContext = buildChatContext();

    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute inset-0 lg:relative lg:w-80 xl:w-96 bg-gradient-to-b from-[#0f172a] to-[#1e293b] flex flex-col z-[60] lg:rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-white uppercase tracking-widest">Assistant IA</p>
                        <p className="text-[9px] text-white/40 font-medium">Mistral · Powered by AI</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Chat Context Preview */}
            {chatContext && (
                <div className="mx-3 mt-3 rounded-2xl border border-white/10 bg-white/5 overflow-hidden shrink-0">
                    <button
                        onClick={() => setContextExpanded(!contextExpanded)}
                        className="w-full px-4 py-2.5 flex items-center justify-between text-left"
                    >
                        <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest">
                            📎 Contexte chat injecté
                        </span>
                        {contextExpanded ? (
                            <ChevronUp className="w-3 h-3 text-white/30" />
                        ) : (
                            <ChevronDown className="w-3 h-3 text-white/30" />
                        )}
                    </button>
                    <AnimatePresence>
                        {contextExpanded && (
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="px-4 pb-3 max-h-32 overflow-y-auto">
                                    <pre className="text-[9px] text-white/40 font-mono whitespace-pre-wrap leading-relaxed">
                                        {chatContext}
                                    </pre>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
                {aiHistory.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center border border-violet-500/20">
                            <Sparkles className="w-6 h-6 text-violet-400" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-white/70">Comment puis-je vous aider ?</p>
                            <p className="text-[10px] text-white/30 max-w-[200px] leading-relaxed">
                                {chatContext
                                    ? `Le contexte de la conversation avec ${chatUserName} est déjà injecté.`
                                    : "Posez une question ou demandez de l'aide pour rédiger un message."}
                            </p>
                        </div>
                        {/* Suggestion chips */}
                        <div className="flex flex-col gap-2 w-full px-2">
                            {[
                                "Rédige une réponse professionnelle",
                                "Résume la situation du client",
                                "Demande des documents KYC poliment"
                            ].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setAiInput(s)}
                                    className="text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-white/60 hover:text-white transition-all"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {aiHistory.map((msg, i) => (
                    <div key={i} className={cn("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                        <div className={cn(
                            "max-w-[88%] px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed whitespace-pre-wrap",
                            msg.role === "user"
                                ? "bg-violet-600 text-white rounded-br-sm"
                                : "bg-white/10 text-white/90 rounded-bl-sm border border-white/10"
                        )}>
                            {msg.content}
                        </div>
                        {msg.role === "assistant" && (
                            <div className="flex items-center gap-1.5 mt-1.5 px-1">
                                <button
                                    onClick={() => navigator.clipboard.writeText(msg.content)}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70 transition-all text-[9px] font-medium"
                                    title="Copier"
                                >
                                    <Copy className="w-2.5 h-2.5" />
                                    Copier
                                </button>
                                <button
                                    onClick={() => onInjectText(msg.content)}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-all text-[9px] font-bold border border-emerald-500/20"
                                    title="Injecter dans le chat"
                                >
                                    <CornerDownLeft className="w-2.5 h-2.5" />
                                    Injecter
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-start">
                        <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/10 border border-white/10 flex items-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                            <span className="text-[11px] text-white/50">Mistral réfléchit...</span>
                        </div>
                    </div>
                )}
                <div ref={aiEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 shrink-0">
                <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
                    <textarea
                        ref={inputRef}
                        rows={1}
                        value={aiInput}
                        onChange={e => {
                            setAiInput(e.target.value);
                            e.target.style.height = "auto";
                            e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Posez votre question... (Entrée pour envoyer)"
                        disabled={isLoading}
                        className="flex-1 bg-transparent resize-none text-[11px] text-white placeholder-white/30 focus:outline-none min-h-[24px] max-h-[100px] leading-relaxed py-0.5 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!aiInput.trim() || isLoading}
                        className="flex-shrink-0 w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30 disabled:opacity-30 disabled:grayscale transition-all active:scale-95"
                    >
                        <Send className="w-3 h-3 text-white" />
                    </button>
                </div>
                <p className="text-[9px] text-white/20 text-center mt-1.5">Shift+Entrée pour nouvelle ligne</p>
            </div>
        </motion.div>
    );
}

export default function AdminChat({ chats, setChats, selectedChat, setSelectedChat }: any) {
    const [newChatMessage, setNewChatMessage] = useState("");
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [showEmojis, setShowEmojis] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showAiPanel, setShowAiPanel] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const getChatUserName = (chat: any) => {
        if (!chat) return "";
        if (chat.userName) return chat.userName;
        if (chat.firstName && chat.lastName) return `${chat.firstName} ${chat.lastName}`;
        return chat.email?.split('@')[0] || "Client";
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, selectedChat]);

    useEffect(() => {
        if (!selectedChat) return;
        const messagesRef = collection(db, "chats", selectedChat.id, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setChatMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            if (selectedChat.unreadAdmin > 0) {
                updateDoc(doc(db, "chats", selectedChat.id), { unreadAdmin: 0 }).catch(console.error);
            }
        });
        return () => unsubscribe();
    }, [selectedChat]);

    // Close AI panel when chat changes
    useEffect(() => {
        setShowAiPanel(false);
    }, [selectedChat]);

    const handleAdminFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedChat) return;
        if (file.size > 10 * 1024 * 1024) {
            alert("Le fichier est trop volumineux (max 10MB)");
            return;
        }
        setUploading(true);
        try {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset!);
            formData.append('folder', `chat/${selectedChat.id}`);
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            const chatRef = doc(db, "chats", selectedChat.id);
            await addDoc(collection(chatRef, "messages"), {
                fileUrl: data.secure_url,
                fileName: file.name,
                fileType: file.type,
                sender: 'admin',
                timestamp: serverTimestamp()
            });
            await updateDoc(chatRef, {
                lastMessage: "📎 Fichier envoyé",
                lastTimestamp: serverTimestamp(),
                unreadClient: (chats.find((c: any) => c.id === selectedChat.id)?.unreadClient || 0) + 1,
                unreadAdmin: 0,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error uploading:", error);
            alert("Erreur upload");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSendAdminMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChatMessage.trim() || !selectedChat) return;
        const text = newChatMessage.trim();
        setNewChatMessage("");
        try {
            const chatRef = doc(db, "chats", selectedChat.id);
            await addDoc(collection(chatRef, "messages"), {
                text,
                sender: 'admin',
                timestamp: serverTimestamp()
            });
            await updateDoc(chatRef, {
                lastMessage: text,
                lastTimestamp: serverTimestamp(),
                unreadClient: (chats.find((c: any) => c.id === selectedChat.id)?.unreadClient || 0) + 1,
                unreadAdmin: 0,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error sending:", error);
        }
    };

    const handleDeleteMessage = async (msgId: string) => {
        if (!selectedChat) return;
        if (!confirm("Supprimer ce message ?")) return;
        try {
            await deleteDoc(doc(db, "chats", selectedChat.id, "messages", msgId));
        } catch (error) {
            console.error("Error deleting message:", error);
            alert("Erreur lors de la suppression du message.");
        }
    };

    const handleDeleteChat = async (id?: string) => {
        const targetChat = id ? chats.find((c: any) => c.id === id) : selectedChat;
        if (!targetChat) return;
        if (!confirm(`⚠️ SUPPRIMER DÉFINITIVEMENT toute cette discussion avec ${getChatUserName(targetChat)} ?\nCette action supprimera également tous les messages.`)) return;
        try {
            const messagesRef = collection(db, "chats", targetChat.id, "messages");
            const snapshot = await getDocs(messagesRef);
            const batch = writeBatch(db);
            snapshot.docs.forEach((d) => batch.delete(d.ref));
            await batch.commit();
            await deleteDoc(doc(db, "chats", targetChat.id));
            if (selectedChat?.id === targetChat.id) setSelectedChat(null);
            alert("La discussion a été supprimée.");
        } catch (error) {
            console.error("Error deleting chat:", error);
            alert("Erreur lors de la suppression de la discussion.");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] lg:h-[calc(100vh-10rem)] gap-0 lg:gap-6 overflow-hidden -mx-4 -mb-4 md:mx-0 md:mb-0 relative">

            {/* --- LISTE DES CHATS --- */}
            <div className={cn(
                "w-full lg:w-80 bg-white rounded-none md:rounded-[2rem] lg:rounded-[2.5rem] border-b md:border border-slate-100 shadow-sm flex flex-col overflow-hidden h-full",
                selectedChat ? "hidden lg:flex" : "flex"
            )}>
                <div className="p-5 md:p-6 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Discussions</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {chats.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                            <MessageCircle className="w-10 h-10 text-slate-200" />
                            <p className="text-xs text-slate-400 font-medium italic">Aucun message.</p>
                        </div>
                    ) : (
                        chats.map((chat: any) => (
                            <div
                                key={chat.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelectedChat(chat)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') setSelectedChat(chat);
                                }}
                                className={cn(
                                    "w-full p-4 rounded-2xl transition-all flex items-center gap-4 text-left border relative group cursor-pointer",
                                    selectedChat?.id === chat.id
                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "bg-white border-transparent hover:bg-slate-50 text-slate-600"
                                )}
                            >
                                <UserAvatar
                                    name={getChatUserName(chat)}
                                    className={cn(
                                        "w-10 h-10 rounded-xl",
                                        selectedChat?.id === chat.id ? "bg-white/20 text-white" : "bg-slate-100"
                                    )}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className={cn("text-xs font-black truncate", selectedChat?.id === chat.id ? "text-white" : "text-slate-900")}>
                                        {getChatUserName(chat)}
                                    </p>
                                    <p className={cn("text-[10px] font-medium truncate opacity-60", selectedChat?.id === chat.id ? "text-white" : "text-slate-500")}>
                                        {chat.lastMessage || "Nouveau message"}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteChat(chat.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    {chat.unreadAdmin > 0 && selectedChat?.id !== chat.id && (
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm shadow-red-500/50" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* --- FENÊTRE DE CHAT + AI PANEL WRAPPER --- */}
            <div className={cn(
                "flex-1 flex overflow-hidden relative",
                selectedChat ? "fixed inset-0 z-50 h-[100dvh] w-full lg:static lg:h-full" : "hidden lg:flex"
            )}>
                {/* Chat Window */}
                <div className={cn(
                    "flex-1 bg-white flex flex-col overflow-hidden relative transition-all duration-300",
                    "lg:rounded-[2.5rem] lg:border lg:border-slate-100 lg:shadow-sm",
                    showAiPanel ? "lg:rounded-r-none" : ""
                )}>
                    {selectedChat ? (
                        <>
                            {/* Header Chat */}
                            <div className="p-4 md:p-6 border-b border-slate-50 flex items-center justify-between bg-white shrink-0 safe-top">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setSelectedChat(null)}
                                        className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-all lg:hidden text-slate-600"
                                    >
                                        <ArrowLeft className="w-6 h-6" />
                                    </button>
                                    <UserAvatar name={getChatUserName(selectedChat)} className="w-10 h-10 rounded-full bg-blue-900 text-white" />
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-sm font-bold text-slate-900 leading-none truncate max-w-[120px] sm:max-w-[200px]">{getChatUserName(selectedChat)}</h4>
                                        <p className="text-[10px] text-emerald-500 font-bold mt-1 uppercase tracking-widest truncate">Client en ligne</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* AI Assistant Toggle */}
                                    <button
                                        onClick={() => setShowAiPanel(!showAiPanel)}
                                        title="Assistant IA Mistral"
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border shadow-sm",
                                            showAiPanel
                                                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-violet-500/30"
                                                : "bg-violet-50 text-violet-600 border-violet-100 hover:bg-violet-100"
                                        )}
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span className="sm:hidden">IA</span>
                                        <span className="hidden sm:inline">Assistant IA</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteChat()}
                                        className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-all"
                                        title="Supprimer la discussion"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 scrollbar-hide">
                                {chatMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex flex-col max-w-[85%] lg:max-w-[70%] group/msg",
                                            msg.sender === 'admin' ? "ml-auto items-end" : "items-start"
                                        )}
                                    >
                                        <div className="relative">
                                            <div className={cn(
                                                "px-4 py-3 rounded-[20px] text-sm shadow-sm leading-relaxed",
                                                msg.sender === 'admin'
                                                    ? "bg-[#002B70] text-white rounded-br-sm"
                                                    : "bg-white border border-slate-100 text-slate-800 rounded-bl-sm"
                                            )}>
                                                {msg.fileUrl ? (
                                                    msg.fileType?.startsWith('image/') ? (
                                                        <img src={msg.fileUrl} alt="Attachement" className="max-w-full rounded-lg" />
                                                    ) : (
                                                        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline">
                                                            <Paperclip className="w-4 h-4" />
                                                            {msg.fileName || "Fichier"}
                                                        </a>
                                                    )
                                                ) : msg.text}
                                            </div>
                                            {msg.sender === 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                    className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/msg:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
                                                    title="Supprimer ce message"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                                            {msg.timestamp?.seconds ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                        <form onSubmit={handleSendAdminMessage} className="p-2 lg:p-3 bg-white border-t border-slate-100 shrink-0 safe-bottom relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAdminFileChange}
                                className="hidden"
                            />
                            <AnimatePresence>
                                {showEmojis && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-20 left-4 p-3 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 grid grid-cols-4 gap-2"
                                    >
                                        {COMMON_EMOJIS.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => {
                                                    setNewChatMessage(prev => prev + emoji);
                                                    setShowEmojis(false);
                                                }}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-xl text-xl"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="flex items-center gap-1.5 lg:gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEmojis(!showEmojis)}
                                    className="flex-shrink-0 w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                                >
                                    <Smile className="w-5 h-5 lg:w-6 lg:h-6" />
                                </button>

                                <div className="flex-1 relative flex items-center">
                                    <input
                                        type="text"
                                        value={newChatMessage}
                                        onChange={(e) => setNewChatMessage(e.target.value)}
                                        placeholder="Message..."
                                        className="w-full h-11 lg:h-12 bg-gray-100 border-0 rounded-[24px] pl-4 pr-10 lg:pl-5 lg:pr-12 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                        disabled={uploading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute right-1 w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-white transition-colors"
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!newChatMessage.trim() || uploading}
                                    className="flex-shrink-0 w-11 h-11 lg:w-12 lg:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                                >
                                    <Send className="w-5 h-5 ml-0.5" />
                                </button>
                            </div>
                        </form>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-300">
                                <MessageCircle className="w-10 h-10" />
                            </div>
                            <p className="text-sm text-slate-500">Sélectionnez une discussion</p>
                        </div>
                    )}
                </div>

                {/* AI Assistant Panel */}
                <AnimatePresence>
                    {showAiPanel && selectedChat && (
                        <AiAssistantPanel
                            chatMessages={chatMessages}
                            chatUserName={getChatUserName(selectedChat)}
                            onInjectText={(text) => {
                                setNewChatMessage(text);
                                setShowAiPanel(false);
                            }}
                            onClose={() => setShowAiPanel(false)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
