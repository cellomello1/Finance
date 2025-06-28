import { defineStore } from 'pinia'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/init'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    userType: (state) => state.user?.userType // 'lender' or 'borrower'
  },

  actions: {
    async initAuth() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // Get additional user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
            this.user = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc.data()
            }
          } else {
            this.user = null
          }
          resolve(firebaseUser)
        })
      })
    },

    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password)
        
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        this.user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...userDoc.data()
        }
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const { user: firebaseUser } = await createUserWithEmailAndPassword(
          auth, 
          userData.email, 
          userData.password
        )

        // Create user document in Firestore
        const userDocData = {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userType: userData.userType, // 'lender' or 'borrower'
          companyName: userData.companyName,
          phone: userData.phone,
          role: 'user',
          kycStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        await setDoc(doc(db, 'users', firebaseUser.uid), userDocData)

        // Ensure the user is set in the store
        await this.initAuth();

        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await signOut(auth)
        this.user = null
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