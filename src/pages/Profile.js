import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaCamera, FaKey } from 'react-icons/fa';
import config from '../config';

const UserProfile = () => {
  const initialProfile = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    profileImage: ''
  };

  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [tempProfile, setTempProfile] = useState(initialProfile);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const fileInputRef = useRef(null);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${config.apiUrl}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const userData = await response.json();
      const mergedProfile = { ...initialProfile, ...userData };
      setProfile(mergedProfile);
      setTempProfile(mergedProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrors({ fetch: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  console.log(localStorage.getItem('token'));
  // Simple input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  // Simple password change handler
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ profileImage: 'Image must be less than 5MB' });
      return;
    }

    if (!file.type.match('image.*')) {
      setErrors({ profileImage: 'Please upload an image file' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/api/user/profile/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      setTempProfile({
        ...tempProfile,
        profileImage: data.imageUrl
      });
      setErrors({});
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors({ profileImage: 'Failed to upload image' });
    }
  };

  // Form validation
  const validateProfileForm = () => {
    const newErrors = {};
    if (!tempProfile.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!tempProfile.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!tempProfile.email?.trim()) newErrors.email = 'Email is required';
    if (tempProfile.email && !/^\S+@\S+\.\S+$/.test(tempProfile.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (tempProfile.phone && !/^\d{10}$/.test(tempProfile.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (tempProfile.pincode && !/^\d{6}$/.test(tempProfile.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    if (passwordData.newPassword && passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save handlers
  const handleSave = async () => {
    if (!validateProfileForm()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${config.apiUrl}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tempProfile)
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const { user } = await response.json();
      setProfile(user);
      setTempProfile(user);
      setIsEditing(false);
      setErrors({});
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: error.message || 'Failed to update profile' });
    }
  };

  const handlePasswordSave = async () => {
    if (!validatePasswordForm()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${config.apiUrl}/api/user/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }

      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      setErrors({ password: error.message || 'Failed to update password' });
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setTempProfile(profile);
    setErrors({});
    setIsEditing(false);
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Form field components
  const FormField = ({ label, name, type = 'text', disabled = false }) => (
    <div className="mb-4">
      <label className="text-sm text-gray-500">{label}</label>
      {isEditing ? (
        <div>
          <input
            type={type}
            name={name}
            defaultValue={tempProfile[name] || ''}
            onBlur={handleChange}
            disabled={disabled}
            className={`w-full p-2 border rounded ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
        </div>
      ) : (
        <p className="text-gray-800 font-medium">{tempProfile[name] || 'Not provided'}</p>
      )}
    </div>
  );

  const PasswordField = ({ label, name }) => (
    <div className="mb-4">
      <label className="text-sm text-gray-500">{label}</label>
      <input
        type="password"
        name={name}
        defaultValue={passwordData[name] || ''}
        onBlur={handlePasswordChange}
        className={`w-full p-2 border rounded ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
                  {tempProfile.profileImage ? (
                    <img
                      src={`${config.apiUrl}${tempProfile.profileImage}`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold uppercase">
                      {tempProfile.firstName?.[0]}{tempProfile.lastName?.[0]}
                    </div>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                    >
                      <FaCamera />
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                {errors.profileImage && (
                  <p className="text-red-500 text-xs mt-1">{errors.profileImage}</p>
                )}
                <h2 className="mt-4 text-xl font-bold text-gray-800">
                  {tempProfile.firstName} {tempProfile.lastName}
                </h2>
                <p className="text-gray-600 text-sm">{tempProfile.email}</p>
              </div>

              <div className="mt-6">
                <button className="w-full flex items-center text-gray-600 hover:bg-gray-100 p-2 rounded-md">
                  <FaUser className="mr-2" /> Profile
                </button>
                <button
                  onClick={() => {
                    if (isEditing || isChangingPassword) {
                      handleCancel();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="w-full flex items-center text-gray-600 hover:bg-gray-100 p-2 rounded-md mt-2"
                >
                  {isEditing ? <FaTimes className="mr-2" /> : <FaEdit className="mr-2" />}
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                <button
                  onClick={() => {
                    if (isChangingPassword || isEditing) {
                      handleCancel();
                    } else {
                      setIsChangingPassword(true);
                    }
                  }}
                  className="w-full flex items-center text-gray-600 hover:bg-gray-100 p-2 rounded-md mt-2"
                >
                  <FaKey className="mr-2" />
                  {isChangingPassword ? 'Cancel' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white shadow-md rounded-lg p-6">
              {!isChangingPassword ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaUser className="mr-2" /> Profile Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="FIRST NAME" name="firstName" />
                    <FormField label="LAST NAME" name="lastName" />
                    <FormField label="EMAIL" name="email" type="email" disabled={true} />
                    <FormField label="PHONE" name="phone" type="tel" />
                    <FormField label="ADDRESS" name="address" />
                    <FormField label="CITY" name="city" />
                    <FormField label="STATE" name="state" />
                    <FormField label="PINCODE" name="pincode" />
                  </div>

                  {isEditing && (
                    <div className="mt-6 flex gap-4">
                      <button
                        onClick={handleSave}
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        <FaSave className="mr-2" /> Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        <FaTimes className="mr-2" /> Cancel
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaKey className="mr-2" /> Change Password
                  </h3>
                  <div className="max-w-md">
                    <PasswordField label="CURRENT PASSWORD" name="currentPassword" />
                    <PasswordField label="NEW PASSWORD" name="newPassword" />
                    <PasswordField label="CONFIRM NEW PASSWORD" name="confirmPassword" />
                    <div className="mt-6 flex gap-4">
                      <button
                        onClick={handlePasswordSave}
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        <FaSave className="mr-2" /> Update Password
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        <FaTimes className="mr-2" /> Cancel
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;