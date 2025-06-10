import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/molecules/StatusBadge';
import { format } from 'date-fns';

const LeadCard = ({ lead, getTeamMemberName, onDragStart, isDragged, index }) => {
    return (
        <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            draggable
            onDragStart={(e) => onDragStart(e, lead)}
            className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
                isDragged ? 'opacity-50' : ''
            }`}
        >
            <div className="space-y-3">
                {/* Lead Name and Company */}
                <div>
                    <h4 className="font-medium text-gray-900 truncate">
                        {lead.name}
                    </h4>
                    {lead.company && (
                        <p className="text-sm text-gray-600 truncate">
                            {lead.company}
                        </p>
                    )}
                </div>

                {/* Contact Info */}
                <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ApperIcon name="Mail" className="w-3 h-3" />
                        <span className="truncate">{lead.email}</span>
                    </div>
                    {lead.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <ApperIcon name="Phone" className="w-3 h-3" />
                            <span>{lead.phone}</span>
                        </div>
                    )}
                </div>

                {/* Lead Source */}
                {lead.leadSource && (
                    <div className="flex items-center space-x-2">
                        <ApperIcon name="Tag" className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{lead.leadSource}</span>
                    </div>
                )}

                {/* Assignee & Follow-up Date */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ApperIcon name="User" className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                            {getTeamMemberName(lead.assignedTo)}
                        </span>
                    </div>

                    {lead.followUpDate && (
                        <div className="text-xs text-gray-500">
                            {format(new Date(lead.followUpDate), 'MMM d')}
                        </div>
                    )}
                </div>

                {/* Notes Preview */}
                {lead.notes && (
                    <div className="border-t border-gray-100 pt-2">
                        <p className="text-xs text-gray-600 line-clamp-2">
                            {lead.notes}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default LeadCard;