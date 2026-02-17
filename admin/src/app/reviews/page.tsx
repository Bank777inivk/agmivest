"use client";

import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Admin firebase instance
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

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const fetchedReviews = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Review[];
            setReviews(fetchedReviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm("Valider cet avis ?")) return;
        try {
            await updateDoc(doc(db, 'reviews', id), { status: 'approved' });
            fetchReviews();
        } catch (error) {
            console.error("Error approving:", error);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Rejeter cet avis ?")) return;
        try {
            await updateDoc(doc(db, 'reviews', id), { status: 'rejected' });
            fetchReviews();
        } catch (error) {
            console.error("Error rejecting:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer définitivement cet avis ?")) return;
        try {
            await deleteDoc(doc(db, 'reviews', id));
            fetchReviews();
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const pendingReviews = reviews.filter(r => r.status === 'pending');
    const otherReviews = reviews.filter(r => r.status !== 'pending');

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Gestion des Avis</h1>
                <p className="text-slate-500">Modérez les avis clients avant leur publication.</p>
            </div>

            {/* Pending Reviews */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    En attente ({pendingReviews.length})
                </h2>

                {pendingReviews.length === 0 ? (
                    <div className="bg-white p-6 rounded-xl border border-dashed border-slate-300 text-center text-slate-500">
                        Aucun avis en attente de validation.
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
                <h2 className="text-xl font-bold text-slate-700">Historique</h2>
                <div className="grid gap-4 opacity-75">
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
                        <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${review.status === 'approved' ? 'bg-green-100 text-green-700' :
                            review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-orange-100 text-orange-700'
                            }`}>
                            {review.status.toUpperCase()}
                        </div>
                    </div>
                    <div className="flex text-yellow-400 gap-0.5 text-sm">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
                <div className="text-xs text-slate-400">
                    {new Date(review.date).toLocaleDateString()}
                </div>
            </div>

            <p className="text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg italic text-sm">
                "{review.comment}"
            </p>

            <div className="flex justify-end gap-3">
                {review.status === 'pending' && !readOnly && (
                    <>
                        <button onClick={onApprove} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors">
                            <CheckCircle className="w-4 h-4" /> Valider
                        </button>
                        <button onClick={onReject} className="flex items-center gap-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium transition-colors">
                            <XCircle className="w-4 h-4" /> Rejeter
                        </button>
                    </>
                )}
                <button onClick={onDelete} className="flex items-center gap-1 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                    <Trash2 className="w-4 h-4" /> Supprimer
                </button>
            </div>
        </div>
    );
}
