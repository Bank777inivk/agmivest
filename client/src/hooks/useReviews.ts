import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, Timestamp, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { reviews as staticReviews, Review } from '@/data/reviewsData';

export interface FirestoreReview extends Omit<Review, 'id'> {
    id: string; // Firestore IDs are strings
    status: 'pending' | 'approved' | 'rejected';
    createdAt: any;
}

export function useReviews(isAdmin = false) {
    const [reviews, setReviews] = useState<(Review | FirestoreReview)[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let q;
        if (isAdmin) {
            // Admin sees all Firestore reviews (pending, approved, rejected)
            q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
        } else {
            // Public sees only approved Firestore reviews
            q = query(
                collection(db, 'reviews'),
                where('status', '==', 'approved'),
                orderBy('createdAt', 'desc')
            );
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const firestoreReviews: FirestoreReview[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                firestoreReviews.push({
                    id: doc.id,
                    name: data.name,
                    region: data.region,
                    rating: data.rating,
                    comment: data.comment,
                    date: data.date, // String date YYYY-MM-DD
                    verified: data.verified || false,
                    status: data.status,
                    createdAt: data.createdAt
                });
            });

            if (isAdmin) {
                setReviews(firestoreReviews);
            } else {
                setReviews([...firestoreReviews, ...staticReviews]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching reviews:", error);
            if (!isAdmin) setReviews(staticReviews);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAdmin]);

    const addReview = async (review: Omit<Review, 'id' | 'date' | 'verified'>) => {
        try {
            const newReview = {
                ...review,
                date: new Date().toISOString().split('T')[0],
                verified: false,
                status: 'pending',
                createdAt: Timestamp.now()
            };

            await addDoc(collection(db, 'reviews'), newReview);
            return true;
        } catch (error) {
            console.error("Error adding review:", error);
            throw error;
        }
    };

    const approveReview = async (id: string) => {
        try {
            const reviewRef = doc(db, 'reviews', id);
            await updateDoc(reviewRef, { status: 'approved' });
        } catch (error) {
            console.error("Error approving review:", error);
            throw error;
        }
    };

    const deleteReview = async (id: string) => {
        try {
            const reviewRef = doc(db, 'reviews', id);
            await deleteDoc(reviewRef);
        } catch (error) {
            console.error("Error deleting review:", error);
            throw error;
        }
    };

    return { reviews, loading, addReview, approveReview, deleteReview };
}
