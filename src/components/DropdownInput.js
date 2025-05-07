import React, {useEffect, useState} from 'react';
import {Autocomplete, Button, TextField} from '@mui/material';
import '../resources/dropdown-input.css'

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
        <div className="dropdownInputContainer">
            <Autocomplete
                id="searchUser"
                options={mappedOptions}
                getOptionLabel={(option) => option.label}
                value={selectedMappedOption}
                inputValue={inputValue}
                onChange={handleSelect}
                onInputChange={handleInputChange}
                isOptionEqualToValue={(option, value) => option.user?.email === value.user?.email}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search user"
                        sx={{ backgroundColor: "white", borderRadius: '7px' }}
                    />
                )}
            />
        </div>
    );
};

export default DropdownInput;