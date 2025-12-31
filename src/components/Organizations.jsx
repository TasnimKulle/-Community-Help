import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import supabase from '../lib/supabase'
import toast from 'react-hot-toast'
import {
  FaBuilding,
  FaUsers,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch
} from 'react-icons/fa'

export default function Organizations() {
  const { profile } = useAuth()
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingOrg, setEditingOrg] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contact_email: '',
    location: '',
    phone: '',
    website: ''
  })

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setOrganizations(data || [])
    } catch (error) {
      console.error('Error fetching organizations:', error)
      toast.error('Failed to load organizations')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingOrg) {
        // Update existing organization
        const { error } = await supabase
          .from('organizations')
          .update(formData)
          .eq('id', editingOrg.id)

        if (error) throw error
        toast.success('Organization updated successfully!')
      } else {
        // Create new organization
        const { error } = await supabase
          .from('organizations')
          .insert([formData])

        if (error) throw error
        toast.success('Organization created successfully!')
      }

      setShowCreateForm(false)
      setEditingOrg(null)
      setFormData({
        name: '',
        description: '',
        contact_email: '',
        location: '',
        phone: '',
        website: ''
      })
      fetchOrganizations()
    } catch (error) {
      toast.error('Failed to save organization')
      console.error(error)
    }
  }

  const handleEdit = (org) => {
    setEditingOrg(org)
    setFormData({
      name: org.name,
      description: org.description,
      contact_email: org.contact_email,
      location: org.location,
      phone: org.phone || '',
      website: org.website || ''
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this organization?')) return

    try {
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Organization deleted successfully')
      fetchOrganizations()
    } catch (error) {
      toast.error('Failed to delete organization')
    }
  }

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
              <p className="text-gray-600 mt-2">
                Browse and connect with community organizations
              </p>
            </div>
            {profile?.role === 'admin' && (
              <button
                onClick={() => {
                  setEditingOrg(null)
                  setShowCreateForm(!showCreateForm)
                }}
                className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                {editingOrg ? 'Edit Organization' : 'Add Organization'}
              </button>
            )}
          </div>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingOrg ? 'Edit Organization' : 'Add New Organization'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Organization name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contact_email}
                    onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="contact@organization.org"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1234567890"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Describe the organization's mission and activities..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://organization.org"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingOrg(null)
                    setFormData({
                      name: '',
                      description: '',
                      contact_email: '',
                      location: '',
                      phone: '',
                      website: ''
                    })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingOrg ? 'Update' : 'Create'} Organization
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search organizations by name, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Organizations Grid */}
        {filteredOrgs.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <FaBuilding className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No organizations found' : 'No organizations yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Be the first to add an organization!'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => (
              <div key={org.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <FaBuilding className="text-blue-600 text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {org.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {org.location || 'Location not specified'}
                        </p>
                      </div>
                    </div>
                    
                    {profile?.role === 'admin' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(org)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(org.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {org.description}
                  </p>

                  <div className="space-y-3">
                    {org.contact_email && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FaEnvelope className="mr-2" />
                        <a 
                          href={`mailto:${org.contact_email}`}
                          className="hover:text-blue-600"
                        >
                          {org.contact_email}
                        </a>
                      </div>
                    )}
                    
                    {org.phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FaPhone className="mr-2" />
                        <a 
                          href={`tel:${org.phone}`}
                          className="hover:text-blue-600"
                        >
                          {org.phone}
                        </a>
                      </div>
                    )}
                    
                    {org.website && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FaGlobe className="mr-2" />
                        <a 
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                    
                    {org.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{org.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        // Create organization request
                        // This would open a form to create a help request for this organization
                      }}
                      className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaHandsHelping className="mr-2" />
                      Request Assistance
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaBuilding className="text-blue-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Organizations</p>
                <p className="text-2xl font-bold">{organizations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaUsers className="text-green-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Requests</p>
                <p className="text-2xl font-bold">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaHandsHelping className="text-purple-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Volunteers</p>
                <p className="text-2xl font-bold">--</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
