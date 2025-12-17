import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams, Routes, Route } from 'react-router-dom'
import CompanySidebar from './CompanySidebar.jsx'
import CompanyProfile from './CompanyProfile.jsx'
import EditProfile from './EditProfile.jsx'
import JobsSection from './JobsSection.jsx'
import ApplicationsSection from './ApplicationsSection.jsx'

function CompanyDashboard() {
  const [searchParams] = useSearchParams()
  const companyId = searchParams.get('companyId')
  const [company, setCompany] = useState(null)
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const navigate = useNavigate()
  const location = useLocation()

  // Define branches array
  const branches = [
    "All Branches",
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Telecommunication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering'
  ];

  const isAdminView = companyId && JSON.parse(localStorage.getItem('auth'))?.role === 'admin'

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // Fetch company profile
        const auth = JSON.parse(localStorage.getItem('auth'))
      
        const profileUrl = isAdminView
          ? `${import.meta.env.VITE_API_BASE_URL}/api/company/profile/${companyId}`
          : `${import.meta.env.VITE_API_BASE_URL}/api/company/profile`

        const profileResponse = await fetch(profileUrl, {
          
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth?.token}`,
          },
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          // profileData may be object or wrapped, adapt if your API returns { company: {...} }
          const profile = profileData.company || profileData
          setCompany(profile)
        }

        // Only fetch jobs and applications if not admin view
        if (!isAdminView) {
          // Fetch jobs
          const jobsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/jobs`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth?.token}`,
            },
          })
          if (jobsResponse.ok) {
            const jobsData = await jobsResponse.json()
            setJobs(jobsData)
          }

          // Fetch applications
          const appsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company/applications`, {
            
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth?.token}`,
            },
          })
          if (appsResponse.ok) {
            const appsData = await appsResponse.json()
            setApplications(appsData)
          }
        }
      } catch (err) {
        console.error('Error fetching company data:', err)
      }
    }
    fetchCompanyData()
  }, [companyId, isAdminView])

  if (!company) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isAdminView ? (
        <div className="flex-1 p-6">
          <div className="mb-6">
            <button
              onClick={() => navigate('/admin/companies')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              ← Back to Companies
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Company Profile (Admin View)</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
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
          </div>
        </div>
      ) : (
        <>
          <CompanySidebar />
          <div className="flex-1 p-6 md:ml-0 ml-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Company Dashboard</h1>
            {location.pathname === '/company/dashboard' && <CompanyProfile company={company} />}
            {location.pathname === '/company/dashboard/edit' && <EditProfile />}
            {location.pathname === '/company/dashboard/jobs' && <JobsSection jobs={jobs} company={company} branches={branches} />}
            {location.pathname === '/company/dashboard/applications' && <ApplicationsSection applications={applications} />}

            {!company.verified && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Verification Required</h3>
                <p className="text-yellow-700">
                  Your company needs to be verified by the admin before you can post job openings.
                  Please contact the placement cell for verification.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default CompanyDashboard
