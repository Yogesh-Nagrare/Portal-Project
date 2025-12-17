import React from 'react'
import { useNavigate } from 'react-router-dom'

function CompanyProfile({ company }) {
  const navigate = useNavigate()

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and will delete all your jobs and applications.')) {
      return
    }

    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
    
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/profile`, {
        method: 'DELETE',
        
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        }
      })

      if (response.ok) {
        // Clear auth and redirect to signin
        localStorage.removeItem('auth')
        navigate('/Signin/company')
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(errorData.message || 'Failed to delete account')
      }
    } catch (err) {
      console.error('Error deleting account:', err)
      alert('Error deleting account')
    }
  }
  return (
    <div className="bg-white w-3/4 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Company Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <p className="mt-1 text-lg">{company.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-lg">{company.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <p className="mt-1 text-lg">{company.phoneNumber || 'Not provided'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <p className="mt-1 text-lg">{company.location || 'Not provided'}</p>
        </div>
        {/* linkedIn */}
        <div>
          <label className="block text-sm font-medium text-gray-700">LinkedIn </label>
          <a href={company.linkedInUrl} target="_blank" rel="noopener noreferrer" className='text-cyan-700/85 underline' >
            {company.linkedInUrl ? 'LinkedIn Profile' : 'Not provided'}
          </a>
        </div>
        {/* dpiitNumber */}
        <div>
          <label className="block text-sm font-medium text-gray-700">DPIIT Number</label>
          <p className="mt-1 text-lg">{company.dpiitNumber || 'Not provided'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Person</label>
          <p className="mt-1 text-lg">{company.contactPerson || 'Not provided'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Verification Status</label>
          <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
            company.verified
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {company.verified ? 'Verified' : 'Unverified'}
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate('/company/dashboard/edit')}
          className="bg-cyan-700/85 text-white px-6 py-2 rounded hover:bg-cyan-900"
        >
          Edit Profile
        </button>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}

export default CompanyProfile
