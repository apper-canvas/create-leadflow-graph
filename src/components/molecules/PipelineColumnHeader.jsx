import React from 'react';

const PipelineColumnHeader = ({ title, count, headerColorClass }) => {
    return (
        <div className={`${headerColorClass} text-white p-4 rounded-t-lg`}>
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">{title}</h3>
                <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                    {count}
                </span>
            </div>
        </div>
    );
};

export default PipelineColumnHeader;