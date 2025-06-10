import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import AddLeadForm from '@/components/organisms/AddLeadForm';

const AddLeadModal = ({ isOpen, onClose, teamMembers, onLeadCreated }) => {
    const handleFormSubmit = (formData) => {
        onLeadCreated(formData);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Add New Lead</h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <ApperIcon name="X" className="w-5 h-5" />
                                </button>
                            </div>

                            <AddLeadForm
                                teamMembers={teamMembers}
                                onSubmit={handleFormSubmit}
                                onCancel={onClose}
                                isModal={true}
                                // Pass loading state if available from parent (e.g., LeadsPage)
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddLeadModal;