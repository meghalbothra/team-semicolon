import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Hero Section */}
      <section className="bg-purple-500 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to MindWell AI</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
          MindWell AI is a comprehensive mental health platform powered by AI, providing personalized resources and support for emotional well-being. 
          Let us guide you towards a healthier, more balanced life.
          </p>
          <div className="mt-8">
            <Link to="/signup" className="bg-white text-purple-700 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center text-purple-800 mb-12">Our Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-2">AI Chat Buddy</h3>
              <p className="text-gray-600">24/7 AI-driven chatbot for mental health conversations and support.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Happy Habits Hub</h3>
              <p className="text-gray-600">Plan, journal, and track wellness habits to boost your daily well-being.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Buddy Connect</h3>
              <p className="text-gray-600">Connect with peers for shared experiences and emotional support.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Mind Mirror</h3>
              <p className="text-gray-600">Take health quizzes and receive insightful AI feedback for growth.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Resource Room</h3>
              <p className="text-gray-600">Access mental health articles, guides, and emergency helplines.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Calm Corner</h3>
              <p className="text-gray-600">Guided meditations and exercises to calm your mind and reduce stress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-purple-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-purple-800 mb-6">Contact Us</h2>
          <p className="text-lg text-gray-600">Have questions or need support? Reach us at <a href="mailto:meghalbothra@gmail.com" className="text-purple-700 hover:underline">meghalbothra@gmail.com</a></p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
