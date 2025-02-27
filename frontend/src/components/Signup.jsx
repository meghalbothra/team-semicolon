// src/components/AdvancedAnimatedAuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { User, Lock, Mail, Eye, EyeOff, ArrowRight, Loader } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Firebase imports
import { auth } from '../Firebase/Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

const AdvancedAnimatedAuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const controls = useAnimation();
  const navigate = useNavigate();

  // Toggle between Sign Up and Sign In modes
  const toggleMode = () => {
    setIsSignUp((prevMode) => !prevMode);
    setError(null);
    setEmail('');
    setUsername('');
    setPassword('');
  };

  // Handle form submission for both Sign Up and Sign In
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!email || !password || (isSignUp && !username)) {
      toast.error('All fields are required!');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (isSignUp && password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Create a new account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (username) {
          await updateProfile(userCredential.user, { displayName: username });
        }
        toast.success('Account created successfully! Please sign in to continue.');
        setIsSignUp(false);
        setEmail('');
        setUsername('');
        setPassword('');
      } else {
        // Sign in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
          toast.success('Successfully signed in!');
          setTimeout(() => {
            navigate('/home'); // Redirect to home page
          }, 1000);
        } else {
          toast.error('Sign in failed! Please try again.');
        }
      }
    } catch (err) {
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Animate the background gradient for a dynamic visual effect
  useEffect(() => {
    controls.start({
      background: [
        'linear-gradient(135deg, #f5f0ff 0%, #e7d6f7 100%)',
        'linear-gradient(135deg, #f9f4fe 0%, #e7d6f7 100%)',
        'linear-gradient(135deg, #e7d6f7 0%, #f5f0ff 100%)',
      ],
      transition: {
        duration: 12,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    });
  }, [controls]);

  // Animation variants for the form container and its child elements
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, when: 'beforeChildren', staggerChildren: 0.15 },
    },
    exit: { opacity: 0, y: -50, transition: { duration: 0.4 } },
  };

  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  // Animation variant for the floating bubble background elements
  const floatingBubbleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: [0.2, 0.3, 0.2],
      transition: { duration: 4, repeat: Infinity, repeatType: 'reverse' }
    }
  };

  return (
    <motion.div
      className="h-screen w-screen flex items-center justify-center p-5 relative overflow-hidden"
      animate={controls}
    >
      {/* Dynamic floating bubbles for a vibrant background effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-300 to-purple-200"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${50 + Math.random() * 100}px`,
              height: `${50 + Math.random() * 100}px`,
              opacity: 0.2 + Math.random() * 0.1,
            }}
            variants={floatingBubbleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: i * 0.5, duration: 3 + Math.random() * 5, repeat: Infinity, repeatType: 'reverse' }}
          />
        ))}
      </div>

      {/* Additional decorative gradient shapes */}
      <motion.div
        className="absolute top-10 right-10 w-48 h-48 bg-purple-200 rounded-full opacity-30"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-56 h-56 bg-purple-300 rounded-full opacity-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Form Card */}
      <motion.div
        className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-md w-full max-w-md relative z-10 backdrop-filter backdrop-blur-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          <motion.form
            key={isSignUp ? 'signup' : 'signin'}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center"
          >
            <motion.h2 className="text-3xl font-extrabold text-purple-900 mb-8 text-center" variants={itemVariants}>
              {isSignUp ? 'Join Our Community' : "Welcome Back, It's Great to See You!"}
            </motion.h2>

            {error && (
              <motion.p className="text-red-600 text-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} variants={itemVariants}>
                {error}
              </motion.p>
            )}

            {isSignUp && (
              <motion.div className="mb-4 w-full" variants={itemVariants}>
                <label className="block text-purple-900 mb-2 text-start" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600" size={18} />
                  <input
                    type="text"
                    id="username"
                    className="w-full pl-10 pr-4 py-2 bg-purple-50 border-2 border-purple-400 rounded-lg focus:outline-none focus:border-purple-600 transition-colors"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    aria-label="Username"
                  />
                </div>
              </motion.div>
            )}

            <motion.div className="mb-4 w-full" variants={itemVariants}>
              <label className="block text-purple-900 mb-2 text-start" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600" size={18} />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-2 bg-purple-50 border-2 border-purple-400 rounded-lg focus:outline-none focus:border-purple-600 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email Address"
                />
              </div>
            </motion.div>

            <motion.div className="mb-6 w-full" variants={itemVariants}>
              <label className="block text-purple-900 mb-2 text-start" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full pl-10 pr-12 py-2 bg-purple-50 border-2 border-purple-400 rounded-lg focus:outline-none focus:border-purple-600 transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="text-purple-600" size={18} />
                  ) : (
                    <Eye className="text-purple-600" size={18} />
                  )}
                </div>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-purple-700 text-white py-2 rounded-lg shadow-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors flex items-center justify-center mb-4"
              variants={itemVariants}
            >
              {isLoading ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <>
                  <span className="mr-2">{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            <motion.p className="text-sm text-purple-600 mt-2 cursor-pointer" onClick={toggleMode} variants={itemVariants}>
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </motion.p>
          </motion.form>
        </AnimatePresence>
      </motion.div>
      <ToastContainer />
    </motion.div>
  );
};

export default AdvancedAnimatedAuthPage;
