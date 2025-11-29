import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { User, Report } from '../types';
import { FileText, Calendar, ShieldCheck, Clock, CheckCircle, AlertCircle, MapPin } from 'lucide-react';

interface UserDashboardProps {
  currentUser: User | null;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ currentUser }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (currentUser) {
        setIsLoading(true);
        const userReports = await db.getUserReports(currentUser.id);
        setReports(userReports);
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [currentUser]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'action_taken': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received': return <Clock size={16} />;
      case 'reviewing': return <ShieldCheck size={16} />;
      case 'resolved': return <CheckCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400">Please log in to view your reports.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400">
           <FileText size={24} />
        </div>
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Incident Reports</h1>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Track the status and responses to your submitted reports.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Reports Found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            You haven't submitted any reports yet. If you need to report an incident, use the "Report an Incident" button on the home page.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
              
              {/* Card Header */}
              <div className="p-6 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-wrap justify-between items-start gap-4">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                     <span className="font-bold text-gray-900 dark:text-white">{report.type}</span>
                     {report.isAnonymous && (
                       <span className="text-[10px] uppercase tracking-wider bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full font-bold">
                         Anonymous
                       </span>
                     )}
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                     <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(report.date).toLocaleDateString()}</span>
                     {report.location && (
                       <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><MapPin size={14} /> Location Attached</span>
                     )}
                   </div>
                </div>
                
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 uppercase tracking-wide ${getStatusColor(report.status)}`}>
                   {getStatusIcon(report.status)}
                   {report.status.replace('_', ' ')}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                 <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                 <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                   {report.description}
                 </p>

                 {/* Response Section */}
                 {report.adminResponse ? (
                   <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800/50">
                     <h4 className="flex items-center gap-2 text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-2">
                       <ShieldCheck size={16} />
                       Response from SafeHaven Team
                     </h4>
                     <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed">
                       {report.adminResponse}
                     </p>
                   </div>
                 ) : (
                   <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 text-center border border-dashed border-gray-200 dark:border-gray-700">
                     <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                       No response yet. Our team reviews reports within 24 hours.
                     </p>
                   </div>
                 )}
              </div>
              
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 flex justify-between">
                 <span>ID: #{report.id}</span>
                 <span>Submitted: {new Date(report.submittedAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
