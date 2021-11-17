import { Geo } from 'aws-amplify';
import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { DebounceInput } from 'react-debounce-input';
import { isMobile } from 'react-device-detect';
import './SearchField.css';

const SearchField = (props) => {

    let [suggestions, setSuggestions] = useState([]);
    let [searchTerm, setSearchTerm] = useState("");


    const renderSuggestion = suggestion => {
        return (
            <div>
                {suggestion.text}
            </div>
        );
    }

    const getSuggestions = async (value) => {

        const searchOptionsWithSearchAreaConstraints = {
            countries: ["DNK"],
            maxResults: 10,
            searchAreaConstraints: [7.94, 54.55, 15.60, 57.86],
        }

        const response = await Geo.searchByText(value, searchOptionsWithSearchAreaConstraints);

        return response.length === 0 ? [] : response.map(res => {
            return {
                text: res.label,
                point: res.geometry.point
            }
        })
    }


    const getSuggestionValue = suggestion => {
        props.map.flyTo({
            center: suggestion.point,
            zoom: 12,
            speed: 1.5,
            curve: 1,
            easing(t) {
                return t;
            }
        });
        return suggestion.text;
    }

    const onSuggestionsFetchRequested = async ({ value }) => {
        const sug = await getSuggestions(value);
        setSuggestions(sug);
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onChange = (event, { newValue }) => {
        setSearchTerm(newValue)
    };

    const inputProps = {
        placeholder: 'Type a city or address',
        value: searchTerm,
        onChange
    };

    const renderSearchInput = (inputProps) => (
        <DebounceInput
            minLength={1}
            debounceTimeout={800}
            autoFocus
            {...inputProps}
        />
    );

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            focusInputOnSuggestionClick={!isMobile}
            renderInputComponent={renderSearchInput}
        />
    )
}

export default SearchField;