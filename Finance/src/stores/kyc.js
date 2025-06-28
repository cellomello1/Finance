import { defineStore } from 'pinia'
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/firebase/init'

export const useKYCStore = defineStore('kyc', {
  state: () => ({
    documents: [],
    currentApplication: null,
    loading: false,
    uploading: false,
    error: null
  }),

  getters: {
    pendingDocuments: (state) => state.documents.filter(doc => doc.status === 'pending'),
    approvedDocuments: (state) => state.documents.filter(doc => doc.status === 'approved'),
    rejectedDocuments: (state) => state.documents.filter(doc => doc.status === 'rejected')
  },

  actions: {
    async uploadDocument(file, documentType, userId) {
      this.uploading = true
      this.error = null
      
      try {
        // Create unique filename
        const timestamp = Date.now()
        const fileName = `${userId}/${documentType}/${timestamp}_${file.name}`
        
        // Upload file to Firebase Storage
        const storageRef = ref(storage, `kyc-documents/${fileName}`)
        const snapshot = await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)

        // Save document metadata to Firestore
        const documentData = {
          userId,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          documentType,
          downloadURL,
          storagePath: fileName,
          status: 'pending',
          uploadedAt: new Date().toISOString(),
          comments: []
        }

        const docRef = await addDoc(collection(db, 'kyc-documents'), documentData)
        
        const newDocument = {
          id: docRef.id,
          ...documentData
        }

        this.documents.push(newDocument)
        
        return { success: true, documentId: docRef.id }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.uploading = false
      }
    },

    async getUserDocuments(userId) {
      this.loading = true
      try {
        const q = query(
          collection(db, 'kyc-documents'),
          where('userId', '==', userId),
          orderBy('uploadedAt', 'desc')
        )
        
        const querySnapshot = await getDocs(q)
        this.documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async getAllPendingDocuments() {
      this.loading = true
      try {
        const q = query(
          collection(db, 'kyc-documents'),
          where('status', '==', 'pending'),
          orderBy('uploadedAt', 'desc')
        )
        
        const querySnapshot = await getDocs(q)
        this.documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async reviewDocument(documentId, status, comments) {
      this.loading = true
      try {
        const docRef = doc(db, 'kyc-documents', documentId)
        await updateDoc(docRef, {
          status,
          comments: comments || [],
          reviewedAt: new Date().toISOString()
        })

        // Update local state
        const docIndex = this.documents.findIndex(doc => doc.id === documentId)
        if (docIndex !== -1) {
          this.documents[docIndex] = {
            ...this.documents[docIndex],
            status,
            comments,
            reviewedAt: new Date().toISOString()
          }
        }

        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async updateUserKYCStatus(userId, status) {
      try {
        const userRef = doc(db, 'users', userId)
        await updateDoc(userRef, {
          kycStatus: status,
          updatedAt: new Date().toISOString()
        })
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      }
    },

    clearError() {
      this.error = null
    }
  }
}) 