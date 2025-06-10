import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import Button from '@/components/atoms/Button';
import { format, formatDistanceToNow } from 'date-fns';

const LeadTimeline = ({ leadId, teamMembers }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState(new Set());

  useEffect(() => {
    loadTimeline();
  }, [leadId]);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock timeline data - would come from service
      const mockTimeline = [
        {
          id: '1',
          type: 'status_change',
          fromStatus: null,
          toStatus: 'new',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 'user1',
          notes: 'Lead created from website contact form',
          metadata: { source: 'website', campaign: 'Q4 2024' }
        },
        {
          id: '2',
          type: 'assignment',
          assignedTo: 'user2',
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 'user1',
          notes: 'Assigned to sales team for initial contact'
        },
        {
          id: '3',
          type: 'status_change',
          fromStatus: 'new',
          toStatus: 'contacted',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 'user2',
          notes: 'Initial contact made via phone. Customer showed strong interest in our premium package. Scheduled follow-up call for next week to discuss pricing and implementation timeline. Customer mentioned they are currently evaluating 3 vendors and want to make a decision by end of month.',
          metadata: { contactMethod: 'phone', duration: '45 minutes' }
        },
        {
          id: '4',
          type: 'note',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 'user2',
          notes: 'Follow-up call completed. Customer requested detailed proposal with ROI analysis. They have budget approval for Q1 2025. Main decision maker is available for demo next week.',
          metadata: { nextAction: 'proposal', deadline: '2024-12-15' }
        },
        {
          id: '5',
          type: 'status_change',
          fromStatus: 'contacted',
          toStatus: 'qualified',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 'user2',
          notes: 'Lead qualified after successful demo. Budget confirmed at $50K+ annually.',
          metadata: { qualificationScore: 85, budget: '$50,000+' }
        }
      ];
      
      setTimeline(mockTimeline);
    } catch (err) {
      setError('Failed to load timeline');
    } finally {
      setLoading(false);
    }
  };

  const getTeamMemberById = (userId) => {
    return teamMembers?.find(member => member.id === userId);
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'status_change':
        return 'TrendingUp';
      case 'assignment':
        return 'UserPlus';
      case 'note':
        return 'MessageSquare';
      case 'email':
        return 'Mail';
      case 'call':
        return 'Phone';
      default:
        return 'Clock';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'status_change':
        return 'bg-blue-500';
      case 'assignment':
        return 'bg-purple-500';
      case 'note':
        return 'bg-green-500';
      case 'email':
        return 'bg-orange-500';
      case 'call':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  const toggleEventExpansion = (eventId) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const formatEventTitle = (event) => {
    switch (event.type) {
      case 'status_change':
        if (!event.fromStatus) {
          return 'Lead Created';
        }
        return `Status changed from ${event.fromStatus} to ${event.toStatus}`;
      case 'assignment':
        const assignee = getTeamMemberById(event.assignedTo);
        return `Assigned to ${assignee?.name || 'Unknown User'}`;
      case 'note':
        return 'Note Added';
      case 'email':
        return 'Email Sent';
      case 'call':
        return 'Call Made';
      default:
        return 'Timeline Event';
    }
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Loading timeline...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Timeline</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={loadTimeline}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (timeline.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <ApperIcon name="Clock" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Timeline Events</h3>
          <p className="text-gray-600">No activity has been recorded for this lead yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <ApperIcon name="Clock" className="w-6 h-6 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
          <span className="text-sm text-gray-500">({timeline.length} events)</span>
        </div>
      </div>

      <div className="p-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            <AnimatePresence>
              {timeline.map((event, index) => {
                const user = getTeamMemberById(event.userId);
                const isExpanded = expandedEvents.has(event.id);
                const hasLongNotes = event.notes && event.notes.length > 120;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-start space-x-4"
                  >
                    {/* Event icon */}
                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${getEventColor(event.type)} shadow-lg`}>
                      <ApperIcon name={getEventIcon(event.type)} className="w-5 h-5 text-white" />
                    </div>

                    {/* Event content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-surface-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        {/* Event header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">
                              {formatEventTitle(event)}
                            </h3>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span>{format(new Date(event.timestamp), 'MMM d, yyyy \'at\' h:mm a')}</span>
                              <span>•</span>
                              <span>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</span>
                            </div>
                          </div>

                          {/* User avatar */}
                          {user && (
                            <div 
                              className="flex items-center space-x-2 ml-4"
                              title={`${user.name} (${user.email})`}
                            >
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                              <span className="text-xs text-gray-600 hidden sm:block">{user.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Event notes/description */}
                        {event.notes && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-700">
                              {isExpanded ? event.notes : truncateText(event.notes)}
                            </p>
                            {hasLongNotes && (
                              <Button
                                onClick={() => toggleEventExpansion(event.id)}
                                className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
                              >
                                {isExpanded ? 'Show less' : 'Show more'}
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Event metadata */}
                        {event.metadata && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(event.metadata).map(([key, value]) => (
                              <span
                                key={key}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                              >
                                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                <span className="ml-1">{value}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadTimeline;