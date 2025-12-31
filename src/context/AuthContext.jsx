import { createContext, useContext, useState, useEffect } from 'react'
import supabase from '../lib/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        // Create profile if it doesn't exist
        await createProfile(userId)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    }
  }

  const createProfile = async (userId) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      const email = userData.user.email
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            full_name: email?.split('@')[0] || 'User',
            role: 'individual',
            location: 'Unknown'
          }
        ])
        .select()
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }

  const signUp = async (email, password, fullName, location = '') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            location: location
          }
        }
      })

      if (error) throw error
      
      if (data.user) {
        // Create profile in database immediately
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: fullName,
              role: 'individual',
              location: location || 'Unknown'
            }
          ])
          .select()
          .single()

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't throw error - user is created, profile can be created later
        } else {
          setProfile(profileData)
        }
        
        toast.success('Account created successfully! Please check your email for verification.')
      }
      
      return data
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      toast.success('Welcome back!')
      return data
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error
      
      setProfile(prev => ({ ...prev, ...updates }))
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
