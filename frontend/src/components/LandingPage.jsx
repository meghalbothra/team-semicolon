import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, BarChart, Brain, Book, Check, AlertCircle, ArrowRight, Heart, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, link, image }) => (
  <motion.div 
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    className="cursor-pointer h-full"
  >
    <Link to={link} className="h-full border border-purple-100 rounded-xl shadow-md bg-white hover:shadow-xl transition-all duration-300 no-underline flex flex-col justify-between overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <Icon className="h-6 w-6 text-purple-600" />
          </div>
          <h4 className="text-xl font-semibold text-purple-700">{title}</h4>
        </div>
        <p className="text-gray-600 mt-2">{description}</p>
        <div className="mt-4 text-purple-600 font-medium flex items-center">
          Learn more <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </div>
    </Link>
  </motion.div>
);

const BenefitItem = ({ text }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className="flex items-center mb-5"
  >
    <div className="p-1 rounded-full bg-green-100 mr-3">
      <Check className="h-5 w-5 text-green-600" />
    </div>
    <p className="text-gray-700 text-lg">{text}</p>
  </motion.div>
);

const FactCard = ({ statistic, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-md p-6 text-center border-t-4 border-purple-500"
  >
    <h4 className="text-3xl font-bold text-purple-700 mb-3">{statistic}</h4>
    <p className="text-gray-700">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for signing up with email: ${email}`);
    setEmail('');
  };

  const features = [
    { 
      icon: Brain, 
      title: "AI Chat Buddy", 
      description: "A 24/7 chatbot offering support and engaging conversations about mental well-being.", 
      link: "/chat",
      image: "https://plus.unsplash.com/premium_photo-1700483267294-eb01387a17a5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    { 
      icon: BarChart, 
      title: "Mind Mirror", 
      description: "Take quizzes to reflect on your health; receive AI insights for improvement.", 
      link: "/quiz",
      image: "https://images.unsplash.com/photo-1604480132736-44c188fe4d20?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    { 
      icon: Book, 
      title: "Resource Room", 
      description: "Access articles, and emergency helplines for mental health support and guidance.", 
      link: "/resources",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    { 
      icon: Video, 
      title: "Calm Corner", 
      description: "Guided meditations and relaxation exercises for stress relief and mental clarity.", 
      link: "/meditation",
      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
  ];

  const benefits = [
    "100% Free - No hidden costs or premium features",
    "AI-powered support available 24/7",
    "Comprehensive mental health management toolkit",
    "Privacy-focused design for your personal information",
    "Accessible on mobile, tablet, and web",
    "Community Support - Connect with users sharing experiences."
  ];

  const facts = [
    { statistic: "1 in 7", description: "Indians suffer from mental disorders, with many experiencing anxiety and depression." },
    { statistic: "Suicide is the leading cause of death", description: "Among individuals aged 15-29 in India, with over 150,000 deaths annually." },
    { statistic: "75% of people with mental health issues", description: "In India receive no treatment due to stigma and lack of resources." },
    { statistic: "Global prevalence of depression", description: "Is around 4.4%, affecting over 264 million people worldwide." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Navigation */}

      <main className="container mx-auto pt-24 px-4 pb-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-800">Your Free AI Mental Health Companion</h2>
          <p className="text-xl mb-8 text-gray-600">Access personalized support, insights, and tools for your well-being journey, all at no cost.</p>
          <Link to="/signup" className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 inline-flex items-center text-decoration-none">
            Start For Free <ArrowRight className="ml-2" />
          </Link>
        </section>
        
        {/* Comprehensive Features - All Free */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3 text-center text-purple-800">Comprehensive Features - All Free</h2>
            <p className="text-center mb-10 max-w-2xl mx-auto text-gray-600">
              All our tools are completely free, designed to support every aspect of your mental well-being journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Mental Health Matters: Key Facts */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3 text-center text-purple-800">Mental Health Matters: Key Facts</h2>
            <p className="text-center mb-10 max-w-2xl mx-auto text-gray-600">
              Understanding the scale of mental health challenges is the first step toward addressing them effectively.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facts.map((fact, index) => (
                <FactCard key={index} {...fact} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-lg flex items-center justify-center text-gray-700">
                <AlertCircle className="h-5 w-5 text-purple-500 mr-2" />
                Mental health is crucial. MindWell AI is here to help.
              </p>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
