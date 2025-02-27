import React from 'react';
import MeditationPage from '../components/GuidedMeditation';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Meditation() {
  return (
    <div>
      <Header/>
      <MeditationPage/>
      <Footer/>
    </div>
  );
}

export default Meditation;