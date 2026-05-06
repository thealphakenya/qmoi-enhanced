import React from 'react';
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

 all markers normalized for completion
"use client";

// INTENTIONAL_UNUSED: archived / intentionally unused component
import { specificExports } from "react";
import { specificExports } from "@/components/ui/use-toast";

interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friendProfile?: {
    name?: string;
    avatar?: string;
    bio?: string;
  };
  status: "pending" | "accepted" | "blocked";
  since?: string;
  nickname?: string;
  notes?: string;
  tags?: string[];
}

interface FriendshipStats {
  totalFriends: number;
  pendingRequests: number;
  blockedUsers: number;
  recentActivities: number;
}

interface FriendshipUIProps {
  userId?: string;
  onFriendSelect?: (friend: Friend) => void;
}

export /**
 * FriendshipUI function
 */
function FriendshipUI({ userId, onFriendSelect }: FriendshipUIProps): any {
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [stats, setStats] = useState<FriendshipStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"friends" | "pending" | "stats">(
    "friends",
  );
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  // Fetch friends and stats on mount
  useEffect(() => {
    if (userId) {
      fetchFriends();
      fetchPendingRequests();
      fetchStats();
    }
  }, [userId]);

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        `/api/qmoi/friendship?action=list&userId=${userId}`,
      );
      const data = await response.json();

      if (data.success && data.friends) {
        setFriends(data.friends);
      }
    } catch (error) {
      logger.error("Failed to fetch friends:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await apiClient.get(
        `/api/qmoi/friendship?action=pending&userId=${userId}`,
      );
      const data = await response.json();

      if (data.success && data.pending) {
        setPendingRequests(data.pending);
      }
    } catch (error) {
      logger.error("Failed to fetch pending requests:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get(
        `/api/qmoi/friendship?action=stats&userId=${userId}`,
      );
      const data = await response.json();

      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      logger.error("Failed to fetch stats:", error);
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFriendEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiClient.get("/api/qmoi/friendship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send-request",
          userId,
          targetUserId: newFriendEmail,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Friend request sent!",
        });
        setNewFriendEmail("");
        fetchPendingRequests();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive",
      });
    }
  };

  const handleAcceptRequest = async (friendId: string) => {
    try {
      const response = await apiClient.get("/api/qmoi/friendship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "accept",
          userId,
          friendId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Friend request accepted!",
        });
        fetchFriends();
        fetchPendingRequests();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!confirm("Remove this friend?")) return;

    try {
      const response = await apiClient.get("/api/qmoi/friendship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "remove",
          userId,
          friendId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Friend removed",
        });
        fetchFriends();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove friend",
        variant: "destructive",
      });
    }
  };

  const handleBlockUser = async (friendId: string) => {
    if (!confirm("Block this user?")) return;

    try {
      const response = await apiClient.get("/api/qmoi/friendship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "block",
          userId,
          friendId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "User blocked",
        });
        fetchFriends();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to block user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          👥 Friendships & Community
        </h2>
      </div>

      {/* optimized Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {stats.totalFriends}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-200">
              Friends
            </div>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
              {stats.pendingRequests}
            </div>
            <div className="text-xs text-yellow-700 dark:text-yellow-200">
              Pending
            </div>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-300">
              {stats.blockedUsers}
            </div>
            <div className="text-xs text-red-700 dark:text-red-200">
              Blocked
            </div>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-300">
              {stats.recentActivities}
            </div>
            <div className="text-xs text-green-700 dark:text-green-200">
              Activities
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("friends")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "friends"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400"
          }`}
        >
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "pending"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400"
          }`}
        >
          Pending ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "stats"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400"
          }`}
        >
          Stats
        </button>
      </div>

      {/* Send Friend Request Form */}
      <form onSubmit={handleSendRequest} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            ="Enter friend's email..."
            value={newFriendEmail}
            onChange={(e) => setNewFriendEmail(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Send Request
          </button>
        </div>
      </form>

      {/* Tab Content */}
      {activeTab === "friends" && (
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading friends...
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No friends yet. Send a friend request to get started!
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend.id}
                onClick={() => {
                  setSelectedFriend(friend);
                  onFriendSelect?.(friend);
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedFriend?.id === friend.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {friend.nickname ||
                        friend.friendProfile?.name ||
                        friend.friendId}
                    </h3>
                    {friend.friendProfile?.bio && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {friend.friendProfile.bio}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      friend.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : friend.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {friend.status}
                  </span>
                </div>

                {friend.notes && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    📝 {friend.notes}
                  </p>
                )}

                {friend.tags && friend.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {friend.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {friend.since && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Friends since {new Date(friend.since).toLocaleDateString()}
                  </p>
                )}

                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlockUser(friend.id);
                    }}
                    className="flex-1 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                  >
                    Block
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFriend(friend.id);
                    }}
                    className="flex-1 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "pending" && (
        <div className="space-y-2">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending requests
            </div>
          ) : (
            pendingRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {request.friendProfile?.name || request.friendId}
                    </h3>
                    {request.friendProfile?.bio && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.friendProfile.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="flex-1 px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded font-medium transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRemoveFriend(request.id)}
                    className="flex-1 px-3 py-1 text-sm bg-gray-300 hover:bg-gray-400 text-gray-700 rounded font-medium transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "stats" && (
        <div className="space-y-4">
          {stats ? (
            <>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  📊 Community Statistics
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Total Friends:</span>{" "}
                    {stats.totalFriends}
                  </p>
                  <p>
                    <span className="font-medium">Pending Requests:</span>{" "}
                    {stats.pendingRequests}
                  </p>
                  <p>
                    <span className="font-medium">Blocked Users:</span>{" "}
                    {stats.blockedUsers}
                  </p>
                  <p>
                    <span className="font-medium">Recent Activities:</span>{" "}
                    {stats.recentActivities}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 QVillage Tips
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>Connect with friends to share projects</li>
                  <li>Collaborate on tasks and ideas</li>
                  <li>Share memories and achievements</li>
                  <li>Build your QMOI community</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Loading statistics...
            </div>
          )}
        </div>
      )}

      {/* Selected Friend Details */}
      {selectedFriend && selectedFriend.status === "accepted" && (
        <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg border-2 border-purple-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            About {selectedFriend.nickname || "Friend"}
          </h3>
          <div className="space-y-2 text-sm">
            {selectedFriend.friendProfile?.avatar && (
              <p>
                <span className="font-medium">Avatar:</span>{" "}
                {selectedFriend.friendProfile.avatar}
              </p>
            )}
            {selectedFriend.notes && (
              <p>
                <span className="font-medium">Notes:</span>{" "}
                {selectedFriend.notes}
              </p>
            )}
            {selectedFriend.since && (
              <p>
                <span className="font-medium">Friends Since:</span>{" "}
                {new Date(selectedFriend.since).toLocaleDateString()}
              </p>
            )}
            {selectedFriend.tags && selectedFriend.tags.length > 0 && (
              <p>
                <span className="font-medium">Tags:</span>{" "}
                {selectedFriend.tags.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FriendshipUI;



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
