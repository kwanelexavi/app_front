import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, ShieldCheck, FileText, MapPin, Clock, Loader2 } from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Real-time Date State
  const [incidentDate, setIncidentDate] = useState('');
  const [useLiveTime, setUseLiveTime] = useState(true);

  // Live Location State
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [incidentType, setIncidentType] = useState('Physical Abuse');
  const [description, setDescription] = useState('');

  // Update time periodically if useLiveTime is active
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const updateTime = () => {
      const now = new Date();
      // Adjust for timezone offset to display local time in datetime-local input
      const localIso = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
        .toISOString()
        .slice(0, 16);
      setIncidentDate(localIso);
    };

    if (useLiveTime) {
      updateTime();
      intervalId = setInterval(updateTime, 60000); // Update every minute
    }

    return () => clearInterval(intervalId);
  }, [useLiveTime]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setUseLiveTime(true);
      setLocation(null);
      setLocationError('');
      setLoadingLocation(false);
      setIsSubmitted(false);
      setName(currentUser ? currentUser.name : '');
      setContact(currentUser ? currentUser.email : '');
      setDescription('');
      
      // If user is logged in, default to NOT anonymous, but allow them to change it
      if (currentUser) {
          setIsAnonymous(false);
      } else {
          setIsAnonymous(true);
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct report object
    const reportData = {
        userId: currentUser?.id, // Link to user if logged in
        isAnonymous,
        name: isAnonymous ? 'Anonymous' : name,
        contact: isAnonymous ? null : contact,
        type: incidentType,
        date: incidentDate,
        location: location,
        description: description
    };

    // Save to simulated backend
    db.saveReport(reportData);

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  const handleGetLocation = () => {
    setLoadingLocation(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoadingLocation(false);
      },
      (error) => {
        console.error(error);
        setLocationError('Unable to retrieve location. Please check permissions.');
        setLoadingLocation(false);
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-red-600 p-6 flex justify-between items-start text-white flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <AlertTriangle className="fill-white text-red-600" />
              Report Incident
            </h2>
            <p className="text-red-100 text-sm mt-1">Your safety is our priority. This form is secure.</p>
          </div>
          <button onClick={onClose} className="hover:bg-red-500 p-1 rounded transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Report Submitted</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Thank you for speaking up. Your report has been securely received.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Anonymity Toggle */}
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <div className="flex flex-col">
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Submit Anonymously</span>
                     {currentUser && <span className="text-xs text-gray-500">Linked to your account privately</span>}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact (Optional)</label>
                    <input type="text" value={contact} onChange={e => setContact(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Phone or Email" />
                  </div>
                </div>
              )}

              {/* Type of Incident */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type of Incident</label>
                <select value={incidentType} onChange={e => setIncidentType(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white">
                  <option>Physical Abuse</option>
                  <option>Verbal/Emotional Abuse</option>
                  <option>Sexual Harassment/Assault</option>
                  <option>Cyberstalking/Bullying</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Date & Time with Real-time Toggle */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label>
                <div className="flex items-center gap-3 mb-2">
                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                        <input 
                            type="checkbox" 
                            checked={useLiveTime} 
                            onChange={(e) => setUseLiveTime(e.target.checked)}
                            className="text-red-600 rounded focus:ring-red-500"
                        />
                        <Clock size={14} />
                        Use current time (Live)
                    </label>
                </div>
                <input 
                    type="datetime-local" 
                    value={incidentDate}
                    onChange={(e) => {
                        setIncidentDate(e.target.value);
                        setUseLiveTime(false); // Disable live updates if user manually edits
                    }}
                    className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none text-sm ${useLiveTime ? 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'}`}
                    readOnly={useLiveTime}
                />
              </div>

              {/* Live Location Sharing */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                {!location ? (
                    <div>
                        <button 
                            type="button"
                            onClick={handleGetLocation}
                            disabled={loadingLocation}
                            className="w-full border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-colors"
                        >
                            {loadingLocation ? (
                                <Loader2 size={24} className="animate-spin text-indigo-600 dark:text-indigo-400" />
                            ) : (
                                <MapPin size={24} className="text-red-500" />
                            )}
                            <span className="text-sm font-medium">
                                {loadingLocation ? 'Acquiring Location...' : 'Share Live Location'}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">Click to attach your current coordinates</span>
                        </button>
                        {locationError && (
                            <p className="text-xs text-red-500 mt-2 text-center">{locationError}</p>
                        )}
                    </div>
                ) : (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full text-green-600 dark:text-green-400">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-green-900 dark:text-green-100">Location Attached</p>
                                <p className="text-xs text-green-700 dark:text-green-300 font-mono">
                                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                </p>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => setLocation(null)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                    rows={4} 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                    placeholder="Please describe what happened..." 
                    required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2 sticky bottom-0 bg-white dark:bg-gray-800 pb-2">
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <FileText size={20} />
                  Submit Report
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  In case of immediate danger, please call emergency services directly.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
