"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    X,
    MessageCircle,
    User,
    ShieldCheck,
    ChevronDown,
    Paperclip,
    Smile
} from "lucide-react";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    updateDoc,
    setDoc
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    text?: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    sender: 'client' | 'admin';
    timestamp: any;
}

const COMMON_EMOJIS = ["😊", "👍", "👋", "🙌", "❤️", "✨", "🔥", "🤝", "💡", "✅", "🚀", "📱", "🙏", "💪", "🎉", "💯"];

export default function ChatSupport() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const user = auth.currentUser;
    const [userData, setUserData] = useState<{ firstName?: string, lastName?: string } | null>(null);
    const [showEmojis, setShowEmojis] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch user data for his name
    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data() as any);
            }
        });
        return () => unsub();
    }, [user]);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    // Sync userName to chat doc when available
    useEffect(() => {
        if (!user || !userData || !isOpen) return;
        const chatRef = doc(db, "chats", user.uid);
        setDoc(chatRef, {
            userName: `${userData.firstName} ${userData.lastName}`,
            userEmail: user.email,
            updatedAt: serverTimestamp()
        }, { merge: true }).catch(() => { });
    }, [user, userData, isOpen]);

    // Firestore Integration
    useEffect(() => {
        if (!user || !isOpen) return;

        const chatRef = doc(db, "chats", user.uid);
        const messagesRef = collection(chatRef, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Message));
            setMessages(newMessages);

            // Mark as read by client
            updateDoc(chatRef, { unreadClient: 0 }).catch(() => { });
        });

        return () => unsubscribe();
    }, [user, isOpen]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validation de la taille
        if (file.size > 10 * 1024 * 1024) {
            alert("Le fichier est trop volumineux (max 10MB)");
            return;
        }

        setUploading(true);
        try {
            // Upload vers Cloudinary (même configuration que KYC)
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset!);
            formData.append('folder', `chat/${user.uid}`);

            const cloudinaryResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!cloudinaryResponse.ok) {
                throw new Error('Upload failed');
            }

            const cloudinaryData = await cloudinaryResponse.json();
            const downloadURL = cloudinaryData.secure_url;

            const chatRef = doc(db, "chats", user.uid);
            const messagesRef = collection(chatRef, "messages");

            await addDoc(messagesRef, {
                fileUrl: downloadURL,
                fileName: file.name,
                fileType: file.type,
                sender: 'client',
                timestamp: serverTimestamp()
            });

            await setDoc(chatRef, {
                lastMessage: "📎 Fichier envoyé",
                lastTimestamp: serverTimestamp(),
                unreadAdmin: 1,
                updatedAt: serverTimestamp()
            }, { merge: true });

        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Erreur lors de l'envoi du fichier. Veuillez réessayer.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user) return;

        const text = message.trim();
        setMessage("");
        setLoading(true);

        try {
            const chatRef = doc(db, "chats", user.uid);
            const messagesRef = collection(chatRef, "messages");

            // Ensure chat document exists
            await setDoc(chatRef, {
                userId: user.uid,
                userEmail: user.email,
                userName: userData ? `${userData.firstName} ${userData.lastName}` : (user.displayName || user.email),
                lastMessage: text,
                lastTimestamp: serverTimestamp(),
                unreadAdmin: (messages.length > 0 ? 1 : 1), // Simplification for now
                updatedAt: serverTimestamp()
            }, { merge: true });

            await addDoc(messagesRef, {
                text,
                sender: 'client',
                timestamp: serverTimestamp()
            });

        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[60] w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#002B70] to-[#011B45] text-white rounded-full shadow-2xl flex items-center justify-center border border-white/10 group"
                >
                    <MessageCircle className="w-7 h-7 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        className="fixed inset-x-0 bottom-0 top-20 md:top-auto md:bottom-8 md:right-8 md:inset-auto z-[60] w-full md:w-[400px] md:h-[600px] bg-white rounded-none md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100"
                    >
                        {/* Header Minimaliste */}
                        <div className="bg-white border-b border-gray-100 p-4 flex items-center gap-3 shrink-0">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>

                            <div className="w-10 h-10 rounded-full bg-[#002B70] text-white flex items-center justify-center font-bold text-sm">
                                {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-sm">
                                    {userData ? `${userData.firstName} ${userData.lastName}` : user?.displayName || user?.email}
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    <span className="text-xs text-emerald-500 font-semibold">CLIENT EN LIGNE</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-white scrollbar-hide">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                                        <MessageCircle className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-900">Bonjour !</p>
                                        <p className="text-sm text-gray-500">
                                            Votre conseiller est prêt à vous aider.<br />Posez votre question ci-dessous.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex flex-col max-w-[75%]",
                                            msg.sender === 'client' ? "ml-auto items-end" : "items-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "px-4 py-3 rounded-[20px] text-sm leading-relaxed",
                                            msg.sender === 'client'
                                                ? "bg-[#002B70] text-white rounded-br-sm"
                                                : "bg-gray-100 text-gray-900 rounded-bl-sm"
                                        )}>
                                            {msg.fileUrl ? (
                                                <div className="space-y-2">
                                                    {msg.fileType?.startsWith('image/') ? (
                                                        <img src={msg.fileUrl} alt="Attachement" className="max-w-full rounded-lg" />
                                                    ) : (
                                                        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline">
                                                            <Paperclip className="w-4 h-4" />
                                                            {msg.fileName || "Fichier"}
                                                        </a>
                                                    )}
                                                </div>
                                            ) : (
                                                msg.text
                                            )}
                                        </div>
                                        <span className={cn(
                                            "text-xs text-gray-400 mt-1",
                                            msg.sender === 'client' ? "mr-2" : "ml-2"
                                        )}>
                                            {msg.timestamp?.seconds ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                        </span>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form
                            onSubmit={handleSendMessage}
                            className="p-4 bg-white border-t border-gray-100 shrink-0 relative"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <AnimatePresence>
                                {showEmojis && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full left-4 mb-2 p-3 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 grid grid-cols-4 gap-2"
                                    >
                                        {COMMON_EMOJIS.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => {
                                                    setMessage(prev => prev + emoji);
                                                    setShowEmojis(false);
                                                }}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-xl transition-colors text-xl"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>


                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEmojis(!showEmojis)}
                                    className={cn(
                                        "flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-colors",
                                        showEmojis ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    <Smile className="w-5 h-5" />
                                </button>

                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={uploading ? "Chargement du fichier..." : "Répondre au client..."}
                                    className="flex-1 h-11 bg-gray-50 border-0 rounded-[25px] px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    disabled={uploading}
                                />

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <Paperclip className="w-5 h-5" />
                                </button>

                                <button
                                    type="submit"
                                    disabled={!message.trim() || loading || uploading}
                                    className="flex-shrink-0 w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
