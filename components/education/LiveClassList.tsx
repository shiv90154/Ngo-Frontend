// LiveClassList.tsx
import React, { useState, useEffect, useCallback } from 'react';

// Type definition for a live class object
interface LiveClass {
  id: string;
  name: string;
  teacher: string;
  startTime: string;        // ISO string or formatted time
  participantCount: number;
  isLive: boolean;          // whether the session is currently active
  thumbnail?: string;       // optional image URL
}

// Props accepted by the component
interface LiveClassListProps {
  refreshIntervalMs?: number;   // auto-refresh interval (default: 30000 ms)
  className?: string;           // additional CSS classes for the container
  onJoinClass?: (classId: string) => void; // callback when user clicks "Join"
}

// Mock API call – replace with your actual endpoint
const fetchLiveClasses = async (): Promise<LiveClass[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return mock data (in reality you would fetch from your backend)
  return [
    {
      id: '1',
      name: 'Advanced React Patterns',
      teacher: 'Sarah Johnson',
      startTime: new Date().toISOString(),
      participantCount: 42,
      isLive: true,
      thumbnail: 'https://via.placeholder.com/120x80?text=React',
    },
    {
      id: '2',
      name: 'Introduction to TypeScript',
      teacher: 'Michael Chen',
      startTime: new Date(Date.now() + 15 * 60000).toISOString(), // starts in 15 min
      participantCount: 18,
      isLive: false,
      thumbnail: 'https://via.placeholder.com/120x80?text=TS',
    },
    {
      id: '3',
      name: 'CSS Grid & Flexbox Mastery',
      teacher: 'Emma Davis',
      startTime: new Date().toISOString(),
      participantCount: 97,
      isLive: true,
      thumbnail: 'https://via.placeholder.com/120x80?text=CSS',
    },
  ];
};

const LiveClassList: React.FC<LiveClassListProps> = ({
  refreshIntervalMs = 30000,
  className = '',
  onJoinClass,
}) => {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load classes from the API
  const loadClasses = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchLiveClasses();
      setClasses(data);
    } catch (err) {
      setError('Failed to load live classes. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and auto‑refresh setup
  useEffect(() => {
    loadClasses();

    // Set up interval for periodic refresh
    const intervalId = setInterval(() => {
      loadClasses();
    }, refreshIntervalMs);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [loadClasses, refreshIntervalMs]);

  // Manual refresh handler
  const handleRefresh = () => {
    setLoading(true);
    loadClasses();
  };

  // Handle join button click
  const handleJoin = (classId: string) => {
    if (onJoinClass) {
      onJoinClass(classId);
    } else {
      alert(`Joining class ${classId} – implement your own onJoinClass handler`);
    }
  };

  if (loading && classes.length === 0) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div className="text-gray-500">Loading live classes...</div>
      </div>
    );
  }

  if (error && classes.length === 0) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`live-class-list ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Live Classes</h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {classes.length === 0 && !loading && (
        <p className="text-gray-500 text-center py-8">No live classes available at the moment.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((liveClass) => (
          <div
            key={liveClass.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            {liveClass.thumbnail && (
              <img
                src={liveClass.thumbnail}
                alt={liveClass.name}
                className="w-full h-32 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{liveClass.name}</h3>
                {liveClass.isLive && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <span className="w-2 h-2 mr-1 bg-red-600 rounded-full animate-pulse"></span>
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">Teacher: {liveClass.teacher}</p>
              <div className="flex justify-between items-center mt-3 text-sm">
                <span className="text-gray-500">
                  👥 {liveClass.participantCount} participants
                </span>
                <button
                  onClick={() => handleJoin(liveClass.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Join
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Starts at: {new Date(liveClass.startTime).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveClassList;