import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaBriefcase, FaCamera, FaLock, FaShieldAlt, FaBell, FaMapMarkerAlt, FaCity, FaMapPin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    userId: '',
    photo: null,
    role: 'Administrator',
    joinDate: '',
    lastLogin: '',
    security: {
      twoFactorAuth: false,
      passwordLastChanged: '',
      loginNotifications: true,
      failedLoginAttempts: 0
    }
  });

  // Get admin info from localStorage
  const adminToken = localStorage.getItem('adminToken');
  const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
  const adminId = adminData.id;


  // Check token expiration
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!adminToken) {
        navigate('/admin');
        return;
      }

      try {
        // Decode the token to check expiration
        const tokenData = JSON.parse(atob(adminToken.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

        if (currentTime >= expirationTime) {
          // Token has expired
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          navigate('/admin');
          return;
        }

        // Set up automatic logout when token expires
        const timeUntilExpiration = expirationTime - currentTime;
        const logoutTimer = setTimeout(() => {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          navigate('/admin');
        }, timeUntilExpiration);

        return () => clearTimeout(logoutTimer);
      } catch (error) {
        console.error('Error checking token expiration:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/admin');
      }
    };

    checkTokenExpiration();
  }, [navigate]);

  // Fetch admin profile data
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!adminToken) {
        setNotification({ type: 'error', message: 'Please login to view profile' });
        navigate('/admin');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/admin/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            // Token expired or revoked
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
            navigate('/admin');
            return;
          }
          throw new Error(errorData.message || 'Failed to fetch admin profile');
        }

        const data = await response.json();
        setProfile(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching admin profile:', error);
        setNotification({ type: 'error', message: error.message });
        if (error.message.includes('Token has been revoked')) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          navigate('/admin');
        }
      }
    };

    fetchAdminProfile();
  }, [adminToken, navigate]);

  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  // Form state for editing
  const [formData, setFormData] = useState({...profile});

  // Password data state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          // Token expired or revoked
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          navigate('/admin');
          return;
        }
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedData = await response.json();
      setProfile(updatedData);
      setIsEditing(false);
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
      if (error.message.includes('Token has been revoked')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/admin');
      }
    }

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handlePasswordSave = async () => {
    try {
      // Validate password fields
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setNotification({ type: 'error', message: 'All password fields are required!' });
        return;
      }

      // Validate new password length
      if (passwordData.newPassword.length < 6) {
        setNotification({ type: 'error', message: 'New password must be at least 6 characters long!' });
        return;
      }

      // Validate password match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setNotification({ type: 'error', message: 'New passwords do not match!' });
        return;
      }

      // Validate current password is not same as new password
      if (passwordData.currentPassword === passwordData.newPassword) {
        setNotification({ type: 'error', message: 'New password must be different from current password!' });
        return;
      }

      const response = await fetch('http://localhost:5000/api/admin/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }

      // Clear password fields and show success message
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setNotification({ type: 'success', message: 'Password updated successfully!' });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setNotification({ type: 'error', message: error.message });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await fetch('http://localhost:5000/api/admin/profile/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setProfile(prev => ({ ...prev, profileImage: data.imageUrl }));
      setFormData(prev => ({ ...prev, profileImage: data.imageUrl }));
      setNotification({ type: 'success', message: 'Profile image updated successfully!' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setNotification({ type: 'error', message: 'Failed to upload image' });
    }
  };

  const handleCancel = () => {
    setFormData({...profile});
    setIsEditing(false);
  };

  return (
    <div className="">
      <div className="">
        <div className="relative flex flex-col md:flex-row">
          {/* Profile Photo Section */}
          <div className="w-full md:w-1/3 bg-white p-8 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="relative">
              <div className="mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 mb-4">
                {profile.profileImage ? (
                  <img 
                    src={`http://localhost:5000${profile.profileImage}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <FaUser className="text-white text-6xl" />
                  </div>
                )}
              </div>
              
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-4 right-20 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                  <FaCamera className="text-lg" />
                </button>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-800">{profile.firstName} {profile.lastName}</h1>
                <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {profile.role}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center">
                <FaShieldAlt className="text-gray-500 mr-2" />
                <h2 className="text-gray-600 font-semibold uppercase text-sm tracking-wider mb-3">ADMIN INFO</h2>
              </div>
              <div className="pl-6 space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">User ID</p>
                  <p className="text-gray-800 font-medium">{profile.userId}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Join Date</p>
                  <p className="text-gray-800 font-medium">{new Date(profile.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Last Login</p>
                  <p className="text-gray-800 font-medium">{profile.lastLogin}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Details Section */}
          <div className="w-full md:w-2/3 bg-white p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Admin Settings</h1>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit Settings
                </button>
              ) : (
                <div className="space-x-2">
                  <button 
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                 
                </div>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-1">
                      <FaUser className="text-gray-400 mr-2" />
                      <p className="text-gray-500">Full Name</p>
                    </div>
                    <p className="text-blue-600 font-medium">{profile.firstName} {profile.lastName}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      <p className="text-gray-500">Email</p>
                    </div>
                    <p className="text-blue-600 font-medium">{profile.email}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <FaPhone className="text-gray-400 mr-2" />
                      <p className="text-gray-500">Phone</p>
                    </div>
                    <p className="text-blue-600 font-medium">{profile.phone}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-1">
                      <FaMapMarkerAlt className="text-gray-400 mr-2" />
                      <p className="text-gray-500">Address</p>
                    </div>
                    <p className="text-blue-600 font-medium">{profile.address}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-1">
                      <FaCity className="text-gray-400 mr-2" />
                      <p className="text-gray-500">City</p>
                    </div>  
                    <p className="text-blue-600 font-medium">{profile.city}</p>     
                  </div>

                  <div>
                    <div className="flex items-center mb-1">
                      <FaMapPin className="text-gray-400 mr-2" />
                      <p className="text-gray-500">Pincode</p>
                    </div>
                    <p className="text-blue-600 font-medium">{profile.pincode}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex border-b border-gray-200 mb-6">
                  <button 
                    className={`flex items-center py-2 px-4 border-b-2 ${activeTab === 'about' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
                    onClick={() => setActiveTab('about')}
                  >
                    <FaUser className="mr-2" />
                    Personal Info
                  </button>
                  <button 
                    className={`flex items-center py-2 px-4 border-b-2 ${activeTab === 'security' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
                    onClick={() => setActiveTab('password')}
                  >
                    <FaLock className="mr-2" />
                    Password
                  </button>
            </div>
                
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center mb-1">
                          <FaUser className="text-gray-400 mr-2" />
                          <p className="text-gray-500">First Name</p>
                        </div>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center mb-1">
                          <FaUser className="text-gray-400 mr-2" />
                          <p className="text-gray-500">Last Name</p>
                        </div>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center mb-1">
                          <FaEnvelope className="text-gray-400 mr-2" />
                          <p className="text-gray-500">Email</p>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center mb-1">
                          <FaPhone className="text-gray-400 mr-2" />
                          <p className="text-gray-500">Phone</p>
                        </div>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center mb-1">
                          <FaMapMarkerAlt className="text-gray-400 mr-2" />
                          <p className="text-gray-500">Address</p>
                        </div>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center mb-1">
                          <FaCity className="text-gray-400 mr-2" />
                          <p className="text-gray-500">City</p>
                        </div>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center mb-1">
                          <FaMapMarkerAlt className="text-gray-400 mr-2" />
                          <p className="text-gray-500">State</p>
                        </div>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center mb-1">
                          <FaMapPin className="text-gray-400 mr-2" />
                          <p className="text-gray-500">Pincode</p>
                        </div>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          pattern="[0-9]{6}"
                          maxLength="6"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update
                    </button>
                  </div>
                  </div>
                )}
                
                {activeTab === 'password' && (
                  <div className="space-y-6">

                  
                    <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <div className="flex items-center mb-1">
                      <FaLock className="text-gray-400 mr-2" />
                      <p className="text-gray-500">Current Password</p>
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-1">
                      <FaLock className="text-gray-400 mr-2" />
                      <p className="text-gray-500">New Password</p>
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-1">
                      <FaLock className="text-gray-400 mr-2" />
                      <p className="text-gray-500">Confirm New Password</p>
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handlePasswordSave}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
                )}
              </div>
            )}
          </div>
        </div>
            </div>
      
      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-md ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Settings;
