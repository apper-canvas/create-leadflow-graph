import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import TextArea from '@/components/atoms/TextArea';

const FormField = ({ label, id, type = 'text', value, onChange, options, rows, error, required = false }) => {
    const labelText = required ? `${label} *` : label;

    const renderField = () => {
        const commonProps = {
            id,
            name: id,
            value,
            onChange: (e) => onChange(e.target.value),
            isInvalid: !!error,
            required
        };

        switch (type) {
            case 'select':
                return <Select options={options} {...commonProps} />;
            case 'textarea':
                return <TextArea rows={rows || 3} {...commonProps} />;
            default:
                return <Input type={type} {...commonProps} />;
        }
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {labelText}
            </label>
            {renderField()}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default FormField;