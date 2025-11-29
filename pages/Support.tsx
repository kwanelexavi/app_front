
import React, { useState, useEffect } from 'react';
import { Heart, DollarSign, HandHelping, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { User, DonationRequest } from '../types';
import { db } from '../services/db';

interface SupportProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const Support: React.FC<SupportProps> = ({ currentUser, onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'give' | 'request'>('give');
  const [donateAmount, setDonateAmount] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  
  // Request Form State
  const [reqAmount, setReqAmount] = useState('');
  const [reqReason, setReqReason] = useState('');
  const [myRequests, setMyRequests] = useState<DonationRequest[]>([]);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    if (currentUser && activeTab === 'request') {
      loadMyRequests();
    }
  }, [currentUser, activeTab]);

  const loadMyRequests = async () => {
    if (currentUser) {
      const reqs = await db.getDonationRequests(currentUser.id);
      setMyRequests(reqs);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donateAmount) return;
    setIsProcessing(true);
    // Simulate payment gateway
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setDonationSuccess(true);
    setDonateAmount('');
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsProcessing(true);
    try {
      await db.requestDonation({
        userId: currentUser.id,
        userName: currentUser.name,
        amount: Number(reqAmount),
        reason: reqReason
      });
      setRequestSuccess(true);
      setReqAmount('');
      setReqReason('');
      loadMyRequests();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Hero Header */}
      <div className="bg-indigo-600 py-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/600?blur=5')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Heart size={48} className="mx-auto mb-4 text-pink-300 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support & Solidarity</h1>
          <p className="text-xl max-w-2xl mx-auto text-indigo-100">
            Empower survivors through your generosity, or find the financial assistance you need to start a new chapter.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-4xl">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex">
            <button
              onClick={() => setActiveTab('give')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'give'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Heart size={18} />
              Give Support
            </button>
            <button
              onClick={() => setActiveTab('request')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'request'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <HandHelping size={18} />
              Request Aid
            </button>
          </div>
        </div>

        {/* GIVE SUPPORT SECTION */}
        {activeTab === 'give' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden md:flex">
              <div className="md:w-1/2 p-8 bg-indigo-50 dark:bg-indigo-900/20 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200 mb-4">Why Donate?</h2>
                <ul className="space-y-3 text-indigo-800 dark:text-indigo-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
                    <span>Provide emergency shelter for survivors fleeing violence.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
                    <span>Fund legal aid and psychological counseling sessions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
                    <span>Support educational programs on GBV prevention.</span>
                  </li>
                </ul>
              </div>

              <div className="md:w-1/2 p-8">
                {donationSuccess ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart size={32} className="fill-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Your generosity helps us create a safer world.</p>
                    <button 
                      onClick={() => setDonationSuccess(false)}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Make another donation
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDonate}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Make a Contribution</h3>
                    
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[10, 25, 50].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDonateAmount(amt)}
                          className={`py-3 rounded-lg border font-bold transition-all ${
                            donateAmount === amt
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-500'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>

                    <div className="relative mb-6">
                      <DollarSign size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Custom Amount"
                        value={donateAmount}
                        onChange={(e) => setDonateAmount(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        min="1"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!donateAmount || isProcessing}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <Loader2 className="animate-spin" /> : 'Process Donation'}
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                      <Lock size={12} /> Secure Payment Processing
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* REQUEST AID SECTION */}
        {activeTab === 'request' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!currentUser ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Lock size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Account Required</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  To ensure safety and proper verification, only registered users can request financial assistance from the community fund.
                </p>
                <button
                  onClick={onOpenAuth}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
                >
                  Log In / Sign Up
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Request Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                     <HandHelping className="text-indigo-600" size={20} />
                     Submit a Request
                   </h3>
                   
                   {requestSuccess ? (
                     <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center">
                        <CheckCircle size={32} className="text-green-600 mx-auto mb-2" />
                        <h4 className="font-bold text-green-800 dark:text-green-300">Request Submitted</h4>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                          Our team will review your request shortly. You can track the status below.
                        </p>
                        <button 
                          onClick={() => setRequestSuccess(false)}
                          className="mt-4 text-sm text-indigo-600 font-medium hover:underline"
                        >
                          Submit another request
                        </button>
                     </div>
                   ) : (
                     <form onSubmit={handleRequestSubmit} className="space-y-4">
                       <div>
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Amount Needed ($)</label>
                         <input
                            type="number"
                            value={reqAmount}
                            onChange={(e) => setReqAmount(e.target.value)}
                            placeholder="e.g. 150"
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                         />
                       </div>
                       <div>
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Reason for Assistance</label>
                         <textarea
                            rows={4}
                            value={reqReason}
                            onChange={(e) => setReqReason(e.target.value)}
                            placeholder="Please describe how these funds will help you (e.g., transport to shelter, legal fees, groceries)..."
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                         />
                       </div>
                       <button
                         type="submit"
                         disabled={isProcessing}
                         className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                       >
                         {isProcessing ? <Loader2 className="animate-spin" /> : 'Submit Request'}
                       </button>
                       <p className="text-xs text-gray-400 mt-2 text-center">
                         Requests are reviewed anonymously by our admin team before being funded.
                       </p>
                     </form>
                   )}
                </div>

                {/* My Requests List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">My Request History</h3>
                  
                  <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3">
                    {myRequests.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
                        <p>No requests found.</p>
                      </div>
                    ) : (
                      myRequests.map((req) => (
                        <div key={req.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                          <div className="flex justify-between items-start mb-2">
                             <span className="font-bold text-lg text-gray-900 dark:text-white">${req.amount}</span>
                             <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded ${
                               req.status === 'funded' ? 'bg-green-100 text-green-700' : 
                               req.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                               'bg-yellow-100 text-yellow-700'
                             }`}>
                               {req.status}
                             </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{req.reason}</p>
                          <div className="text-xs text-gray-400">
                            {new Date(req.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
