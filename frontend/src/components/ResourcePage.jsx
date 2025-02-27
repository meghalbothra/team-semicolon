import React, { useState, useEffect } from 'react';
import { PhoneCall, BookOpen, Home } from 'lucide-react';

// Simple UI Components
const Card = ({ className, children }) => (
  <div className={`border rounded-lg shadow-md p-4 ${className} flex flex-col justify-between`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="pb-1 m-0"> {/* Remove margin and reduce padding-bottom */}
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div className="m-0"> {/* Remove any default margin */}
    {children}
  </div>
);

const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 rounded ${className}`}
  >
    {children}
  </button>
);

const MentalHealthResourcePage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6); // Initial count of articles to show

  const helplines = [
    { name: 'AASRA', number: '91-22-2754-6669', description: 'A helpline for those in emotional distress, available 24/7.' },
    { name: 'Vandrevala Foundation Helpline', number: '1860 266 2345', description: 'Provides support for individuals in crisis and offers a safe space to talk.' },
    { name: 'Sangath', number: '91-22-2771-7422', description: 'Offers support for mental health issues and connects you with professionals.' },
    { name: 'iCall', number: '91-9152987821', description: 'A helpline providing emotional support and mental health counseling.' },
    { name: 'Befrienders Worldwide', number: '91-9582208181', description: 'A network of helplines offering emotional support to anyone in distress.' },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://newsapi.org/v2/everything?q=mental health&apiKey=15f9aa6078724bacb3a3f8ba36445e59');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const showMoreArticles = () => {
    setVisibleCount(prevCount => prevCount + 3);
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'helplines':
        return (
          <Card className="bg-purple-100">
            <CardHeader>
              <h1 className="text-2xl font-semibold text-purple-700 flex items-center mx-4 my-3">
                <PhoneCall className="mr-2" /> Emergency Helplines
              </h1>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {helplines.map((helpline, index) => (
                  <li key={index} className="bg-white p-4 shadow-md rounded-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border border-purple-200">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-semibold text-purple-800">{helpline.name}:</span>
                      <span className="text-purple-600">{helpline.description}</span>
                    </div>
                    <Button className="bg-purple-500 text-white hover:bg-purple-600 px-4 py-2 rounded-md">
                      {helpline.number}
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      case 'articles':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-purple-800">Loading articles...</p>
            ) : (
              Array.isArray(articles) && articles.slice(0, visibleCount).map((article, index) => (
                <Card key={index} className="bg-purple-100">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-purple-700 m-0 p-0">
                      {article.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-900 mb-2 mt-1">
                      {article.description || 'No description available.'}
                    </p>
                    <div className="flex justify-center mt-4">
                      <Button 
                        className="bg-purple-600 text-white hover:bg-purple-700"
                        onClick={() => window.open(article.url, '_blank')}
                      >
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        );
      default:
        return (
          <Card className="bg-purple-100">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-purple-700 flex items-center m-0">
                <Home className="mr-2" /> Welcome to Mental Health Resources
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800">
                Welcome to the <strong>Mental Health Resources</strong> page, a dedicated space designed to support individuals seeking information and assistance regarding mental health. Here, you will find valuable resources, including emergency helplines that provide immediate assistance to those in crisis, as well as informative articles that cover a wide range of mental health topics.
              </p>

              <p className="text-purple-800 mt-4">
                The sidebar on the left allows you to easily navigate between two key sections:
              </p>

              <ul className="list-disc list-inside text-purple-800 mt-2">
                <li>
                  <strong>Emergency Helplines</strong>: This section lists vital contact numbers for national and local helplines that are available to offer immediate support. If you or someone you know is experiencing a mental health crisis, do not hesitate to reach out to these resources. They are equipped to provide you with the help you need.
                </li>
                <li>
                  <strong>Informative Articles</strong>: Explore a collection of articles that delve into various aspects of mental health, including coping strategies, wellness tips, and the latest research. These articles aim to educate and empower you, helping you to better understand mental health issues and find ways to enhance your well-being.
                </li>
              </ul>

              <p className="text-purple-800 mt-4">
                Remember, if you are in immediate danger or experiencing a life-threatening situation, please call your local emergency services right away. Your safety and well-being are of utmost importance. We encourage you to explore the resources available here, as you are not alone in your journey towards better mental health.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col sm:flex-row">
      <div className="w-full sm:w-64 bg-purple-200 p-6 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-purple-800 mb-6">Resource Room</h1>

        <Button 
          className={`flex items-center justify-start ${activeSection === 'home' ? 'bg-purple-600 text-white' : 'bg-white text-purple-700'}`}
          onClick={() => setActiveSection('home')}
        >
          <Home className="mr-2" /> 
          Home
        </Button>

        <Button 
          className={`flex items-center justify-start ${activeSection === 'helplines' ? 'bg-purple-600 text-white' : 'bg-white text-purple-700'}`}
          onClick={() => setActiveSection('helplines')}
        >
          <PhoneCall className="mr-2" /> 
          Helplines
        </Button>

        <Button 
          className={`flex items-center justify-start ${activeSection === 'articles' ? 'bg-purple-600 text-white' : 'bg-white text-purple-700'}`}
          onClick={() => setActiveSection('articles')}
        >
          <BookOpen className="mr-2" /> 
          Articles
        </Button>
      </div>

      <div className="p-4 w-full">
        {renderContent()}
        {activeSection === 'articles' && !loading && visibleCount < articles.length && (
          <div className="flex justify-center mt-4">
            <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={showMoreArticles}>
              Show More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalHealthResourcePage;
