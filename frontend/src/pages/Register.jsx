import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Register form submitted', formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">Create an Account</h2>
          <p className="mt-2 text-gray-300">Join CineMax today</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" name="name" placeholder="Full Name" required className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="email" name="email" placeholder="Email" required className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="password" name="password" placeholder="Password" required className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} />
          </div>
          <button type="submit" className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 flex justify-center items-center">
            <UserPlus className="mr-2" />
            Register
          </button>
        </form>
        <div className="text-center text-gray-300">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

