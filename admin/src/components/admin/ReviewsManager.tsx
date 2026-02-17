"use client";

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckCircle, XCircle, Trash2, Clock, Star } from 'lucide-react';

interface Review {
    id: string;
    name: string;
    region: string;
    rating: number;
    comment: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: any;
}

export default function ReviewsManager() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedReviews = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Review[];
            setReviews(fetchedReviews);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching reviews:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleApprove = async (id: string) => {
        if (!confirm("Valider cet avis ?")) return;
        try {
            await updateDoc(doc(db, 'reviews', id), { status: 'approved' });
        } catch (error) {
            console.error("Error approving:", error);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Rejeter cet avis ?")) return;
        try {
            await updateDoc(doc(db, 'reviews', id), { status: 'rejected' });
        } catch (error) {
            console.error("Error rejecting:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer définitivement cet avis ?")) return;
        try {
            await deleteDoc(doc(db, 'reviews', id));
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const pendingReviews = reviews.filter(r => r.status === 'pending');
    const otherReviews = reviews.filter(r => r.status !== 'pending');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Gestion des Avis Clients</h1>
                <p className="text-slate-500">Modérez les avis clients avant leur publication sur le site.</p>
            </div>

            {/* Pending Reviews */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    En attente de validation ({pendingReviews.length})
                </h2>

                {loading ? (
                    <div className="text-center py-8">Chargement...</div>
                ) : pendingReviews.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 flex flex-col items-center gap-2">
                        <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                        <p>Aucun avis en attente de validation.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {pendingReviews.map(review => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                onApprove={() => handleApprove(review.id)}
                                onReject={() => handleReject(review.id)}
                                onDelete={() => handleDelete(review.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* History */}
            <div className="space-y-4 pt-8 border-t border-slate-200">
                <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Historique récent
                </h2>
                <div className="grid gap-4 opacity-80">
                    {otherReviews.map(review => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onDelete={() => handleDelete(review.id)}
                            readOnly={true}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ReviewCard({ review, onApprove, onReject, onDelete, readOnly = false }: any) {
    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border ${review.status === 'pending' ? 'border-orange-200 bg-orange-50/10' : 'border-slate-100'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900">{review.name}</h3>
                        <span className="text-sm text-slate-500">({review.region})</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${review.status === 'approved' ? 'bg-green-100 text-green-700' :
                            review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-orange-100 text-orange-700'
                            }`}>
                            {review.status === 'pending' ? 'En Attente' : review.status === 'approved' ? 'Validé' : 'Refusé'}
                        </span>
                    </div>
                    <div className="flex text-yellow-400 gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                        ))}
                    </div>
                </div>
                <div className="text-xs text-slate-400">
                    {new Date(review.date).toLocaleDateString()}
                    {review.createdAt && <div className="text-[10px] opacity-70">Reçu le {new Date(review.createdAt.seconds * 1000).toLocaleDateString()}</div>}
                </div>
            </div>

            <p className="text-slate-600 mb-4 bg-slate-50 p-4 rounded-lg italic text-sm leading-relaxed border border-slate-100">
                "{review.comment}"
            </p>

            <div className="flex justify-end gap-3">
                {review.status === 'pending' && !readOnly && (
                    <>
                        <button onClick={onApprove} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-bold shadow-sm shadow-emerald-200 transition-all hover:scale-105">
                            <CheckCircle className="w-4 h-4" /> Valider
                        </button>
                        <button onClick={onReject} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-bold transition-colors">
                            <XCircle className="w-4 h-4" /> Rejeter
                        </button>
                    </>
                )}
                <button onClick={onDelete} className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors ml-auto">
                    <Trash2 className="w-4 h-4" />
                    {!readOnly && "Supprimer"}
                </button>
            </div>
        </div>
    );
}
