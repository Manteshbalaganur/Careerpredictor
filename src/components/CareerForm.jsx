import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Install: npm install react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import styles
import { Howl } from 'howler'; // Install: npm install howler for sound effects

export default function CareerForm() {
  const [formData, setFormData] = useState({
    age: '',
    cgpa: '',
    risk: '',
    leadership: '',
    networking: '',
    tech: '',
    finance: '',
    siblings: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});

  // Sound effects
  const clickSound = new Howl({
    src: ['/click.mp3'], // Add a click sound file to public folder
    volume: 0.5
  });
  const successSound = new Howl({
    src: ['/success.mp3'], // Add a success sound file to public folder
    volume: 0.5
  });

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (formData.age < 15 || formData.age > 100) newErrors.age = 'Age must be 15-100';
    if (formData.cgpa < 0 || formData.cgpa > 10) newErrors.cgpa = 'CGPA must be 0-10';
    ['risk', 'leadership', 'networking', 'tech', 'finance', 'siblings'].forEach(key => {
      if (formData[key] < 0 || formData[key] > 10) newErrors[key] = 'Must be 0-10';
    });
    if (Object.values(formData).some(value => !value)) newErrors.general = 'All fields are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setProgress(0);
    clickSound.play();

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? 90 : prev + 10));
    }, 500);

    try {
      // Mock API call (replace with your actual endpoint when ready)
      const response = await new Promise(resolve =>
        setTimeout(() => resolve({ data: { prediction: getRandomCareer() } }), 2000)
      );
      setPrediction(response.data.prediction);
      successSound.play();
      toast.success('Prediction successful! 🎉', { autoClose: 2000 });
    } catch (error) {
      toast.error('Prediction failed. Try again!');
      console.error('Prediction failed:', error);
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  // Mock career prediction (replace with real API logic)
  const getRandomCareer = () => {
    const careers = ['Software Engineer', 'Data Scientist', 'Product Manager', 'Financial Analyst', 'Entrepreneur'];
    return careers[Math.floor(Math.random() * careers.length)];
  };

  // Handle share result
  const handleShare = () => {
    const shareText = `My predicted career is ${prediction}! Try it at [Your App Link] #Hackathon2025`;
    if (navigator.share) {
      navigator.share({
        title: 'Career Prediction',
        text: shareText,
        url: window.location.href
      }).then(() => toast.success('Shared successfully!'));
    } else {
      navigator.clipboard.writeText(shareText);
      toast.info('Copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-200 to-blue-200 flex items-center justify-center p-6 font-sans">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl transform transition-all hover:scale-102 duration-300">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 text-center animate-pulse">
          Career Predictor 2025
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(formData).map((key) => (
            <div key={key} className="relative group">
              <label className="block text-gray-700 capitalize mb-1 font-medium text-lg">{key}</label>
              <input
                type="number"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors[key] ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white group-hover:bg-gray-50`}
                placeholder={`Enter your ${key} (0-10 unless age)`}
                min={key === 'age' ? 15 : 0}
                max={key === 'age' ? 100 : 10}
                step={key === 'cgpa' ? '0.1' : '1'}
                disabled={isLoading}
              />
              {errors[key] && <p className="text-red-500 text-sm mt-1 animate-bounce">{errors[key]}</p>}
            </div>
          ))}

          <button
            type="submit"
            className="md:col-span-2 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl w-full transition duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Predicting...
              </span>
            ) : (
              'Get My Career Prediction!'
            )}
          </button>
        </form>

        {isLoading && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-gray-600 mt-2">Analyzing your skills... {progress}%</p>
          </div>
        )}

        {prediction && (
          <div className="mt-8 p-6 bg-gradient-to-br from-green-100 to-green-200 rounded-xl text-center transform transition-all animate-fadeIn">
            <h2 className="text-2xl font-bold text-green-800">Your Predicted Career!</h2>
            <p className="mt-4 text-3xl font-extrabold text-green-700 bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
              {prediction}
            </p>
            <button
              onClick={handleShare}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300"
            >
              Share My Result! 🚀
            </button>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}