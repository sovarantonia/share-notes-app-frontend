import React, {useState} from 'react';
import {Autocomplete, TextField} from '@mui/material';

const DropdownInput = ({ options = [], onSearch, onSelect, value }) => {
    const [inputValue, setInputValue] = useState('');

    const mappedOptions = options.map(option => ({
        label: `${option.firstName} ${option.lastName} (${option.email})`,
        user: option,
    }));

    const selectedMappedOption = value
        ? mappedOptions.find(opt => opt.user?.email === value.email)
        : null;

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        onSearch(newInputValue);
    };

    const handleSelect = (e, newValue) => {
        if (newValue) {
            onSelect(newValue.user);
        } else {
            onSelect(null);
        }
    };

    return (
            <Autocomplete
                id="searchUser"
                sx={{
                    width: '100%',
                    maxWidth: 400,
                }}
                options={mappedOptions}
                getOptionLabel={(option) => option.label}
                value={selectedMappedOption}
                inputValue={inputValue}
                onChange={handleSelect}
                onFocus={() => {
                    if (mappedOptions.length === 0) {
                        onSearch('');
                    }
                }}
                onInputChange={handleInputChange}
                isOptionEqualToValue={(option, value) => option.user?.email === value.user?.email}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search user"
                        sx={{
                            fontSize: '1rem',
                            '& .MuiInputBase-input': {
                                padding: '14px',
                            },
                        }}
                    />
                )}
            />
    );
};

export default DropdownInput;