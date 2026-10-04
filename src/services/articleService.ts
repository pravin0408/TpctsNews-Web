import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Query,
  QueryConstraint,
} from 'firebase/firestore';

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  imageUrl: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  featured: boolean;
}

export interface CreateArticleInput {
  title: string;
  content: string;
  summary: string;
  author: string;
  imageUrl: string;
  category: string;
}

const ARTICLES_COLLECTION = 'articles';

export const articleService = {
  // Fetch all articles with optional filtering
  async getArticles(constraints: QueryConstraint[] = []) {
    const defaultConstraints: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
      limit(20),
    ];
    
    const q: Query = query(
      collection(db, ARTICLES_COLLECTION),
      ...defaultConstraints,
      ...constraints
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    })) as Article[];
  },

  // Fetch a single article by ID
  async getArticleById(id: string) {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Article not found');
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
      updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
    } as Article;
  },

  // Create a new article
  async createArticle(data: CreateArticleInput) {
    const now = new Date();
    const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), {
      ...data,
      views: 0,
      featured: false,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: docRef.id,
      ...data,
      views: 0,
      featured: false,
      createdAt: now,
      updatedAt: now,
    } as Article;
  },

  // Update an article
  async updateArticle(id: string, data: Partial<CreateArticleInput>) {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });

    return this.getArticleById(id);
  },

  // Delete an article
  async deleteArticle(id: string) {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Increment article views
  async incrementViews(id: string) {
    const article = await this.getArticleById(id);
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    await updateDoc(docRef, {
      views: (article.views || 0) + 1,
    });
  },
};
