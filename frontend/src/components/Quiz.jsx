import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';
import mentalHealthImage from '../Assets/Frame-1.png';

// Categories for different aspects of mental health
const categories = [
  { id: 'stress', name: 'Stress', color: '#FF5252' },
  { id: 'anxiety', name: 'Anxiety', color: '#7C4DFF' },
  { id: 'depression', name: 'Depression', color: '#448AFF' },
  { id: 'wellbeing', name: 'Well-being', color: '#66BB6A' },
  { id: 'productivity', name: 'Productivity', color: '#FFA726' },
];

// Assessment questions and options
const questions = [
  {
    id: 1,
    text: "How often do you feel overwhelmed by your responsibilities?",
    category: 'stress',
    options: [
      { value: 0, label: 'a) Never' },
      { value: 25, label: 'b) Rarely' },
      { value: 50, label: 'c) Sometimes' },
      { value: 75, label: 'd) Often' },
      { value: 100, label: 'e) Always' },
    ],
  },
  {
    id: 2,
    text: "How frequently do you experience physical symptoms of anxiety (e.g., rapid heartbeat, sweating)?",
    category: 'anxiety',
    options: [
      { value: 0, label: 'a) Never' },
      { value: 25, label: 'b) Rarely' },
      { value: 50, label: 'c) Sometimes' },
      { value: 75, label: 'd) Often' },
      { value: 100, label: 'e) Always' },
    ],
  },
  {
    id: 3,
    text: "How often do you feel a lack of interest or pleasure in activities you usually enjoy?",
    category: 'depression',
    options: [
      { value: 0, label: 'a) Never' },
      { value: 25, label: 'b) Rarely' },
      { value: 50, label: 'c) Sometimes' },
      { value: 75, label: 'd) Often' },
      { value: 100, label: 'e) Always' },
    ],
  },
  {
    id: 4,
    text: "How satisfied are you with your overall quality of life?",
    category: 'wellbeing',
    options: [
      { value: 0, label: 'a) Very Dissatisfied' },
      { value: 25, label: 'b) Dissatisfied' },
      { value: 50, label: 'c) Neutral' },
      { value: 75, label: 'd) Satisfied' },
      { value: 100, label: 'e) Very Satisfied' },
    ],
  },
  {
    id: 5,
    text: "How often do you find yourself procrastinating on important tasks?",
    category: 'productivity',
    options: [
      { value: 0, label: 'a) Always' },
      { value: 25, label: 'b) Often' },
      { value: 50, label: 'c) Sometimes' },
      { value: 75, label: 'd) Rarely' },
      { value: 100, label: 'e) Never' },
    ],
  },
];

// Custom Card component
const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow-lg rounded-xl overflow-hidden border border-purple-100 ${className}`}>
    {children}
  </div>
);

// Custom Button component
const Button = ({ onClick, children, className = '', variant = 'default', disabled = false }) => {
  const baseClasses = 'px-4 py-2 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium';
  const variantClasses = {
    default: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 shadow-md hover:shadow-lg',
    outline: 'border border-purple-300 text-gray-700 hover:bg-purple-100 focus:ring-purple-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

// Custom Alert component
const Alert = ({ children, title, type = 'info' }) => {
  const types = {
    info: 'bg-purple-100 border-purple-400 text-purple-800',
    success: 'bg-green-100 border-green-400 text-green-800',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
    error: 'bg-red-100 border-red-400 text-red-800',
  };
  
  return (
    <div className={`${types[type]} border-l-4 p-4 mb-4 rounded-r`}>
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-md font-semibold">{title}</h3>
          <div className="mt-2 text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Progress bar component
const Progress = ({ value, showLabel = true }) => (
  <div className="relative w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
    <div
      className="bg-gradient-to-r from-purple-500 to-purple-700 h-full rounded-full transition-all duration-500 ease-in-out"
      style={{ width: `${value}%` }}
    ></div>
    {showLabel && (
      <span className="absolute right-0 top-0 transform translate-y-5 text-xs font-medium text-purple-700">
        {Math.round(value)}%
      </span>
    )}
  </div>
);

// Category indicator for questions
const CategoryIndicator = ({ category }) => {
  const currentCategory = categories.find(c => c.id === category);
  
  return (
    <span 
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: `${currentCategory.color}20`, 
        color: currentCategory.color 
      }}
    >
      {currentCategory.name}
    </span>
  );
};

// Custom Radio Button for options
const RadioOption = ({ option, selected, onSelect }) => (
  <div 
    onClick={() => onSelect(option.value)}
    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 mb-2
      ${selected === option.value 
        ? 'border-purple-500 bg-purple-50' 
        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'}`}
  >
    <div className="flex items-center">
      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
        ${selected === option.value ? 'border-purple-500' : 'border-gray-300'}`}>
        {selected === option.value && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>}
      </div>
      <span className="text-gray-700">{option.label}</span>
    </div>
  </div>
);

// Intro page before starting the assessment
const IntroPage = ({ onStart }) => (
  <div className="flex flex-col justify-center items-center min-h-[80vh]">
    <div className="text-center px-4 max-w-lg">
      <h1 className="text-4xl font-bold mb-3 text-purple-800">Mind Mirror</h1>
      <div className="h-1 w-20 bg-purple-500 mx-auto mb-6 rounded-full"></div>
      
      <p className="text-lg mb-8 text-gray-600 leading-relaxed">
        Discover insights about your mental well-being through our interactive assessment. 
        Your responses will help create a personalized mental health profile.
      </p>
      
      <div className="mb-8">
        <img
          src={mentalHealthImage}
          alt="Mental Health Illustration"
          className=" mx-auto"
        />
      </div>
      
      <div className="flex flex-col space-y-3">
        <Button
          onClick={onStart}
          className="py-3 text-lg w-full"
        >
          Start Your Assessment
        </Button>
      </div>
    </div>
  </div>
);

const MentalHealthAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [currentTab, setCurrentTab] = useState('chart');
  const [inAssessment, setInAssessment] = useState(false);
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptionSelect = (value) => {
    setSelectedOption(value);
  };

  const handleNextQuestion = () => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: selectedOption });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setLoading(true);
      setTimeout(() => {
        setShowResults(true);
        handleGetInsights();
        setLoading(false);
      }, 1000);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[questions[currentQuestion - 1].id] || null);
    }
  };

  const handleGetInsights = async () => {
    const answersData = {
      stress: calculateCategoryScore('stress'),
      anxiety: calculateCategoryScore('anxiety'),
      depression: calculateCategoryScore('depression'),
      well_being: calculateCategoryScore('wellbeing'),
      productivity: calculateCategoryScore('productivity'),
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/quiz/insights/', answersData);
      const insightsResponse = response.data.insights;
      setInsights(insightsResponse);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsights("We couldn't retrieve personalized insights at this time. Please check your internet connection and try again.");
    }
  };

  const calculateCategoryScore = (category) => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const categoryAnswers = categoryQuestions.map(q => answers[q.id] || 0);
    return categoryAnswers.reduce((sum, value) => sum + value, 0) / categoryQuestions.length;
  };

  const getCategoryLevel = (score) => {
    if (score >= 75) return 'High';
    if (score >= 25) return 'Moderate';
    return 'Low';
  };

  const getScoreColor = (category, score) => {
    const cat = categories.find(c => c.id === category);
    if (cat) {
      if (category === 'wellbeing' || category === 'productivity') {
        // For positive categories, higher is better
        return score >= 75 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600';
      } else {
        // For negative categories (stress, anxiety, depression), lower is better
        return score <= 25 ? 'text-green-600' : score <= 50 ? 'text-yellow-600' : 'text-red-600';
      }
    }
    return '';
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption(null);
    setShowResults(false);
    setInsights('');
    setInAssessment(false);
  };

  const getChartData = () => {
    return categories.map(category => ({
      name: category.name,
      score: calculateCategoryScore(category.id),
      fill: category.color,
    }));
  };

  const getOverallWellnessScore = () => {
    // Calculate overall score, inverting the negative categories
    const stressScore = 100 - calculateCategoryScore('stress');
    const anxietyScore = 100 - calculateCategoryScore('anxiety');
    const depressionScore = 100 - calculateCategoryScore('depression');
    const wellbeingScore = calculateCategoryScore('wellbeing');
    const productivityScore = calculateCategoryScore('productivity');
    
    return (stressScore + anxietyScore + depressionScore + wellbeingScore + productivityScore) / 5;
  };

  const renderQuestion = () => (
    <Card className="transition-all duration-500 transform">
      <div className="p-6">
        <div className="mb-6">
          <Progress value={((currentQuestion + 1) / questions.length) * 100} />
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xl font-semibold text-gray-800">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <CategoryIndicator category={questions[currentQuestion].category} />
          </div>
          <p className="text-gray-700 text-lg mb-6">{questions[currentQuestion].text}</p>
        </div>
        
        <div className="space-y-1 mb-8">
          {questions[currentQuestion].options.map(option => (
            <RadioOption 
              key={option.value}
              option={option}
              selected={selectedOption}
              onSelect={handleOptionSelect}
            />
          ))}
        </div>
        
        <div className="flex justify-between mt-8">
          <Button 
            onClick={handlePrevQuestion} 
            variant="secondary"
            disabled={currentQuestion === 0}
            className="w-24"
          >
            Back
          </Button>
          <Button 
            onClick={handleNextQuestion} 
            disabled={selectedOption === null}
            className="w-24"
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
      <p className="text-gray-600">Analyzing your responses...</p>
    </div>
  );

  const renderResults = () => (
    <Card className="transition-all duration-500">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-center text-purple-800">Your Assessment Results</h2>
        <p className="text-center text-gray-600 mb-6">Here's what we've discovered about your mental well-being</p>
        
        <div className="flex flex-wrap space-x-2 justify-center mb-6">
          <Button onClick={() => setCurrentTab('chart')} variant={currentTab === 'chart' ? 'default' : 'outline'} className="mb-2">
            Chart View
          </Button>
          <Button onClick={() => setCurrentTab('insights')} variant={currentTab === 'insights' ? 'default' : 'outline'} className="mb-2">
            Personal Insights
          </Button>
          <Button onClick={() => setCurrentTab('summary')} variant={currentTab === 'summary' ? 'default' : 'outline'} className="mb-2">
            Summary
          </Button>
        </div>

        {currentTab === 'chart' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Mental Health Profile</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#8884d8" radius={[8, 8, 0, 0]}>
                  {getChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {currentTab === 'insights' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-4 space-x-2">
              <div className="h-8 w-1 bg-purple-600 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">Personal Insights</h3>
            </div>
            {insights ? (
              <div className="prose max-w-none text-gray-700">
                {insights}
              </div>
            ) : (
              <p className="text-gray-600">Loading insights...</p>
            )}
            
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <h4 className="font-medium text-purple-800 mb-2">Overall Wellness Score</h4>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                      {getOverallWellnessScore().toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex h-2 mb-4 overflow-hidden text-xs bg-purple-200 rounded-full">
                  <div 
                    style={{ width: `${getOverallWellnessScore()}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600">
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'summary' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Assessment Summary</h3>
            <div className="space-y-3">
              {categories.map(category => {
                const score = calculateCategoryScore(category.id);
                return (
                  <div key={category.id} className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium text-gray-800">{category.name}:</span>
                      </div>
                      <span className={`font-semibold ${getScoreColor(category.id, score)}`}>
                        {score.toFixed(1)}% - {getCategoryLevel(score)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${score}%`, backgroundColor: category.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button onClick={resetAssessment} className="px-8">
            Retake Assessment
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      {!inAssessment ? (
        <IntroPage onStart={() => setInAssessment(true)} />
      ) : (
        <div>
          {loading ? renderLoading() : !showResults ? renderQuestion() : renderResults()}
        </div>
      )}
    </div>
  );
};

export default MentalHealthAssessment;