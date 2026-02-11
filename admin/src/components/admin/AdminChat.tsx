import { useState, useRef, useEffect } from "react";
import {
    Send,
    MessageCircle,
    Paperclip,
    Smile,
    ArrowLeft,
    X
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
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // Assurez-vous que ce chemin est correct
import { cn } from "@/lib/utils"; // Assurez-vous que ce chemin est correct

// Helper Components (si besoin, ou importés d'ailleurs)
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

export default function AdminChat({ chats, setChats, selectedChat, setSelectedChat }: any) {
    const [newChatMessage, setNewChatMessage] = useState("");
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [showEmojis, setShowEmojis] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Helper pour le nom
    const getChatUserName = (chat: any) => {
        if (!chat) return "";
        if (chat.userName) return chat.userName;
        if (chat.firstName && chat.lastName) return `${chat.firstName} ${chat.lastName}`;
        return chat.email?.split('@')[0] || "Client";
    };

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, selectedChat]);

    // Fetch Messages
    useEffect(() => {
        if (!selectedChat) return;

        const messagesRef = collection(db, "chats", selectedChat.id, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setChatMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            // Mark as read
            if (selectedChat.unreadAdmin > 0) {
                updateDoc(doc(db, "chats", selectedChat.id), { unreadAdmin: 0 }).catch(console.error);
            }
        });

        return () => unsubscribe();
    }, [selectedChat]);

    // File Upload
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

    // Send Message
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

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] lg:h-[calc(100vh-10rem)] gap-0 lg:gap-6 overflow-hidden -mx-4 -mb-4 md:mx-0 md:mb-0 relative">

            {/* --- LISTE DES CHATS --- */}
            {/* Visible sur mobile UNIQUEMENT si aucun chat sélectionné. Toujours visible sur Desktop. */}
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
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={cn(
                                    "w-full p-4 rounded-2xl transition-all flex items-center gap-4 text-left border relative group",
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
                                {chat.unreadAdmin > 0 && selectedChat?.id !== chat.id && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* --- FENÊTRE DE CHAT --- */}
            {/* Sur mobile : Overlay plein écran fixée par dessus tout. Sur Desktop : Colonne de droite. */}
            <div className={cn(
                "flex-1 bg-white flex flex-col overflow-hidden relative",
                // Styles Desktop
                "lg:rounded-[2.5rem] lg:border lg:border-slate-100 lg:shadow-sm lg:h-full lg:static",
                // Styles Mobile (Overlay Plein Écran)
                selectedChat ? "fixed inset-0 z-50 h-[100dvh] w-full" : "hidden lg:flex"
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
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 leading-none">{getChatUserName(selectedChat)}</h4>
                                    <p className="text-[10px] text-emerald-500 font-bold mt-1 uppercase tracking-widest">Client en ligne</p>
                                </div>
                            </div>
                            {/* Bouton fermeture mobile optionnel ou autre action */}
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 scrollbar-hide">
                            {chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex flex-col max-w-[85%] lg:max-w-[70%]",
                                        msg.sender === 'admin' ? "ml-auto items-end" : "items-start"
                                    )}
                                >
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
                                        ) : (
                                            msg.text
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
                        <form onSubmit={handleSendAdminMessage} className="p-3 bg-white border-t border-slate-100 shrink-0 safe-bottom">
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

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEmojis(!showEmojis)}
                                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                                >
                                    <Smile className="w-6 h-6" />
                                </button>

                                <input
                                    type="text"
                                    value={newChatMessage}
                                    onChange={(e) => setNewChatMessage(e.target.value)}
                                    placeholder="Message..."
                                    className="flex-1 h-12 bg-gray-100 border-0 rounded-[24px] px-5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    disabled={uploading}
                                />

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                                >
                                    <Paperclip className="w-6 h-6" />
                                </button>

                                <button
                                    type="submit"
                                    disabled={!newChatMessage.trim() || uploading}
                                    className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                                >
                                    <Send className="w-5 h-5 ml-0.5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    /* Vue Vide Desktop */
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-300">
                            <MessageCircle className="w-10 h-10" />
                        </div>
                        <p className="text-sm text-slate-500">Sélectionnez une discussion</p>
                    </div>
                )}
            </div>
        </div>
    );
}
