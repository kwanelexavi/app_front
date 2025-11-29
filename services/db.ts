
import { BlogPost, Comment, User, Report, DonationRequest } from '../types';

// Configuration for the Flask Backend (Default port is 5000)
const API_BASE_URL = 'http://localhost:5000/api';

const POSTS_KEY = 'safehaven_posts';
const REPORTS_KEY = 'safehaven_reports';
const DONATIONS_KEY = 'safehaven_donations';

// Helper to create recent timestamps
const getTimeAgo = (minutes: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
};

// Initial Mock Data (Fallback)
const INITIAL_POSTS: BlogPost[] = [
    {
      id: '1',
      author: 'Sarah Jenkins',
      content: 'Recovery is not a straight line. Some days are harder than others, but finding a community that understands has been my saving grace. Remember, you are not alone in this journey.',
      timestamp: getTimeAgo(120), // 2 hours ago
      likes: 24,
      comments: [
        { id: 'c1', author: 'Mike T.', content: 'Thank you for sharing this. Needed to hear it today.', timestamp: getTimeAgo(60) } // 1 hour ago
      ]
    },
    {
      id: '2',
      author: 'Anonymous',
      content: 'Today marks one year since I left my abusive situation. It was the hardest thing I ever did, but the freedom I feel now is worth every struggle. To anyone thinking about leaving: You can do it.',
      timestamp: getTimeAgo(300), // 5 hours ago
      likes: 156,
      comments: []
    }
];

export const db = {
  // Utility to check connection status for the UI
  checkHealth: async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/`, { method: 'GET' }); 
        return response.ok;
    } catch (e) {
        return false;
    }
  },

  // --- Auth Logic ---
  login: async (email: string, password: string): Promise<User> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Login failed');
        }

        return await response.json();
      } catch (error: any) {
          // Fallback simulation if backend is down (for demo continuity)
          if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
             console.warn("Backend offline, using mock login.");
             await new Promise(resolve => setTimeout(resolve, 800));
             if (email && password.length >= 6) {
                // Mock Admin Check
                const isAdmin = email.includes('admin');
                return {
                    id: 'u_' + Date.now(),
                    name: isAdmin ? 'Admin User' : email.split('@')[0],
                    email: email,
                    isAdmin: isAdmin,
                    avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=${isAdmin ? 'ef4444' : '6366f1'}&color=fff`
                };
             }
          }
          throw error;
      }
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Registration failed');
        }

        return await response.json();
      } catch (error: any) {
          // Fallback simulation
          if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
             console.warn("Backend offline, using mock register.");
             await new Promise(resolve => setTimeout(resolve, 800));
             return {
                id: 'u_' + Date.now(),
                name: name,
                email: email,
                avatar: `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`
             };
          }
          throw error;
      }
  },

  // --- Blog Logic ---
  getPosts: async (): Promise<BlogPost[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/`);
        if (!response.ok) throw new Error('Backend unavailable');
        return await response.json();
    } catch (error) {
        console.warn("Flask backend unreachable. Using LocalStorage.");
        const stored = localStorage.getItem(POSTS_KEY);
        if (!stored) {
            localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
            return INITIAL_POSTS;
        }
        return JSON.parse(stored);
    }
  },

  addPost: async (post: BlogPost): Promise<BlogPost[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        });
        if (!response.ok) throw new Error('Backend Error');
        return await response.json();
    } catch (error) {
        const posts = await db.getPosts(); 
        const newPosts = [post, ...posts];
        localStorage.setItem(POSTS_KEY, JSON.stringify(newPosts));
        return newPosts;
    }
  },

  addComment: async (postId: string, comment: Comment): Promise<BlogPost[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comment)
        });
        if (!response.ok) throw new Error('Backend Error');
        return await response.json();
    } catch (error) {
        const posts = await db.getPosts();
        const updatedPosts = posts.map(p => {
            if (p.id === postId) {
                return { ...p, comments: [...p.comments, comment] };
            }
            return p;
        });
        localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts));
        return updatedPosts;
    }
  },

  toggleLike: async (postId: string): Promise<BlogPost[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/like/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Backend Error');
        return await response.json();
    } catch (error) {
        const posts = await db.getPosts();
        const updatedPosts = posts.map(p => {
            if (p.id === postId) {
                return { ...p, likes: p.likes + 1 };
            }
            return p;
        });
        localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts));
        return updatedPosts;
    }
  },

  // --- Reports Logic ---
  saveReport: async (reportData: Partial<Report>): Promise<{id: string, accessCode: string}> => {
    try {
        const response = await fetch(`${API_BASE_URL}/reports/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportData)
        });
        if (!response.ok) throw new Error('Backend Error');
        
        const data = await response.json();
        return { id: data.report_id, accessCode: data.access_code };
    } catch (error) {
        console.warn("Flask backend unreachable. Saving report locally.");
        const stored = localStorage.getItem(REPORTS_KEY);
        const reports: Report[] = stored ? JSON.parse(stored) : [];
        
        const accessCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const newReport: Report = {
            id: Date.now().toString(),
            userId: reportData.userId,
            isAnonymous: reportData.isAnonymous || false,
            name: reportData.name,
            contact: reportData.contact,
            accessCode: accessCode,
            type: reportData.type || 'Other',
            description: reportData.description || '',
            date: reportData.date || new Date().toISOString(),
            submittedAt: new Date().toISOString(),
            status: 'received',
            adminResponse: undefined,
            location: reportData.location
        };

        reports.push(newReport);
        localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
        return { id: newReport.id, accessCode: accessCode };
    }
  },

  getUserReports: async (userId: string): Promise<Report[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/reports/user/${userId}`);
        if (!response.ok) throw new Error('Backend Error');
        return await response.json();
      } catch (error) {
          const stored = localStorage.getItem(REPORTS_KEY);
          if (!stored) return [];
          const reports: Report[] = JSON.parse(stored);
          return reports
            .filter(r => r.userId === userId)
            .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      }
  },

  // Track a single report (Guest access)
  trackReport: async (reportId: string, accessCode: string): Promise<Report | null> => {
      try {
        const response = await fetch(`${API_BASE_URL}/reports/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reportId, accessCode })
        });
        if (response.ok) return await response.json();
        return null;
      } catch (error) {
        // Local fallback
        const stored = localStorage.getItem(REPORTS_KEY);
        if (!stored) return null;
        const reports: Report[] = JSON.parse(stored);
        return reports.find(r => r.id === reportId && r.accessCode === accessCode) || null;
      }
  },

  // --- Admin Logic ---
  getAllReports: async (): Promise<Report[]> => {
      try {
          const response = await fetch(`${API_BASE_URL}/admin/reports`);
          if (!response.ok) throw new Error('Failed to fetch admin reports');
          return await response.json();
      } catch (error) {
          // Local fallback
          const stored = localStorage.getItem(REPORTS_KEY);
          return stored ? JSON.parse(stored) : [];
      }
  },

  adminRespond: async (reportId: string, response: string, status: string): Promise<Report> => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/reports/${reportId}/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ response, status })
        });
        if(!res.ok) throw new Error("Failed");
        return await res.json();
      } catch (error) {
        // Local fallback
        const stored = localStorage.getItem(REPORTS_KEY);
        if (!stored) throw new Error("No local data");
        let reports: Report[] = JSON.parse(stored);
        const index = reports.findIndex(r => r.id === reportId);
        if(index > -1) {
            reports[index] = { ...reports[index], adminResponse: response, status: status as any };
            localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
            return reports[index];
        }
        throw new Error("Report not found");
      }
  },

  // --- Donation/Support Logic ---
  requestDonation: async (request: Omit<DonationRequest, 'id' | 'status' | 'timestamp'>): Promise<DonationRequest> => {
    // Simulate backend delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newRequest: DonationRequest = {
      id: 'req_' + Date.now(),
      ...request,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    const stored = localStorage.getItem(DONATIONS_KEY);
    const requests = stored ? JSON.parse(stored) : [];
    requests.push(newRequest);
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(requests));
    
    return newRequest;
  },

  getDonationRequests: async (userId?: string): Promise<DonationRequest[]> => {
    const stored = localStorage.getItem(DONATIONS_KEY);
    const requests: DonationRequest[] = stored ? JSON.parse(stored) : [];
    
    if (userId) {
      return requests.filter(r => r.userId === userId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return requests.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};