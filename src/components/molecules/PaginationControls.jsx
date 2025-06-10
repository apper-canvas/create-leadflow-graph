import React from 'react';
import Button from '@/components/atoms/Button';

const PaginationControls = ({ currentPage, totalPages, onPageChange, totalResults, itemsPerPage, startIndex }) => {
    return (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalResults)} of {totalResults} results
                </div>
                <div className="flex space-x-1">
                    <Button
                        onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </Button>
                    {[...Array(totalPages)].map((_, i) => (
                        <Button
                            key={i + 1}
                            onClick={() => onPageChange(i + 1)}
                            className={`px-3 py-1 text-sm rounded-md ${
                                currentPage === i + 1
                                    ? 'bg-primary text-white'
                                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button
                        onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaginationControls;