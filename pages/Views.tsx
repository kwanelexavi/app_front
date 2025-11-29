import React from 'react';
import { ArrowRight, Shield, Heart, Users, BookOpen, Phone, MapPin, Mail } from 'lucide-react';
import { PageView } from '../types';

// --- Landing Page ---
interface LandingProps {
  onNavigate: (page: PageView) => void;
  onOpenReport: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigate, onOpenReport }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 to-purple-900 text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://media.gettyimages.com/id/1232576456/photo/durban-south-africa-general-view-during-the-gender-based-violence-protest-march-organised-by.jpg?s=612x612&w=0&k=20&c=3HvfcHAJTdwLkduRhv9S83vMKlmhAOVOqAlTnyt88rk=')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Safety, Support, and<br />Solidarity for Everyone.
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Breaking the silence on gender-based violence. providing immediate support, education, and a community that cares.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onOpenReport}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
            >
              <Shield size={24} />
              Report an Incident
            </button>
            <button
              onClick={() => onNavigate('learn')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white font-semibold py-4 px-8 rounded-full transition-all flex items-center justify-center gap-2 text-lg"
            >
              Learn More
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center transition-colors">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Emotional Support</h3>
              <p className="text-gray-600 dark:text-gray-300">Access our AI companion 'Haven' for 24/7 mental health check-ins and emotional guidance.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center transition-colors">
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Education & Rights</h3>
              <p className="text-gray-600 dark:text-gray-300">Understand your rights, recognize signs of abuse, and access legal resources.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center transition-colors">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Community Blog</h3>
              <p className="text-gray-600 dark:text-gray-300">Join a safe space to share stories, find solidarity, and connect with survivors.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- About Page ---
export const About: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-950 py-16 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">About SafeHaven</h2>
          <div className="w-20 h-1 bg-indigo-600 dark:bg-indigo-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <img 
            src="https://media.gettyimages.com/id/1232576608/photo/durban-south-africa-general-view-during-the-gender-based-violence-protest-march-organised-by.jpg?s=612x612&w=0&k=20&c=CEHYyw5uI5_okon6s-IAVF1d943syXTqEP3_vXn_VF8=" 
            alt="Team working together" 
            className="rounded-2xl shadow-lg"
          />
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              SafeHaven was founded with a singular purpose: to create a world where everyone feels safe, respected, and heard. We believe that Gender-Based Violence (GBV) is a preventable violation of human rights.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Through technology, community engagement, and accessible education, we strive to empower survivors and educate the public. Our platform bridges the gap between immediate need and long-term recovery.
            </p>
          </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-8 md:p-12 transition-colors">
          <h3 className="text-2xl font-bold mb-6 text-center text-indigo-900 dark:text-indigo-200">Get in Touch</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <Phone className="text-indigo-600 dark:text-indigo-400 mb-3" size={24} />
              <h4 className="font-semibold mb-1 dark:text-white">Helpline</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">1-800-SAFE-HELP</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Mail className="text-indigo-600 dark:text-indigo-400 mb-3" size={24} />
              <h4 className="font-semibold mb-1 dark:text-white">Email</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">support@safehaven.org</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <MapPin className="text-indigo-600 dark:text-indigo-400 mb-3" size={24} />
              <h4 className="font-semibold mb-1 dark:text-white">Office</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">123 Hope St, Wellness City</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Learn Page ---
export const Learn: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Understanding Gender-Based Violence</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Education is the first step towards prevention. Here is what you need to know.</p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden md:flex transition-colors">
            <div className="md:w-1/3 bg-indigo-600 dark:bg-indigo-700 p-8 flex flex-col justify-center text-white">
              <h3 className="text-2xl font-bold mb-4">What is GBV?</h3>
              <div className="w-10 h-1 bg-white/30 rounded-full"></div>
            </div>
            <div className="p-8 md:w-2/3">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Gender-Based Violence (GBV) refers to harmful acts directed at an individual based on their gender. It is rooted in gender inequality, the abuse of power and harmful norms. GBV is a serious violation of human rights and a life-threatening health and protection issue.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Physical violence</li>
                <li>Verbal and emotional abuse</li>
                <li>Sexual violence</li>
                <li>Economic deprivation</li>
                <li>Stalking and harassment</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden md:flex flex-row-reverse transition-colors">
            <div className="md:w-1/3 bg-purple-600 dark:bg-purple-700 p-8 flex flex-col justify-center text-white">
              <h3 className="text-2xl font-bold mb-4">Signs of Abuse</h3>
              <div className="w-10 h-1 bg-white/30 rounded-full"></div>
            </div>
            <div className="p-8 md:w-2/3">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Recognizing the signs of abuse is crucial for helping yourself or others. Abuse isn't always physical; it can be subtle and grow over time.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">Isolation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cutting you off from family, friends, or work.</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">Control</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monitoring your movements, spending, or communication.</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">Gaslighting</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Making you question your memory or sanity.</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">Threats</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Threatening to hurt you, themselves, or loved ones.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-8 border border-teal-100 dark:border-teal-900/50 text-center transition-colors">
             <h3 className="text-2xl font-bold text-teal-900 dark:text-teal-200 mb-4">Resources & Help</h3>
             <p className="text-teal-800 dark:text-teal-300 mb-6 max-w-2xl mx-auto">
               You are not alone. There are professional organizations ready to help you navigate these challenges safely.
             </p>
             <div className="flex flex-wrap justify-center gap-4">
               <span className="bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full font-semibold border border-teal-200 dark:border-gray-600">National Domestic Violence Hotline</span>
               <span className="bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full font-semibold border border-teal-200 dark:border-gray-600">RAINN (Sexual Assault)</span>
               <span className="bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full font-semibold border border-teal-200 dark:border-gray-600">Local Women's Shelters</span>
               <span className="bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full font-semibold border border-teal-200 dark:border-gray-600">Legal Aid Clinics</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
