
import { Component } from 'react'
import SearchIcon from '@material-ui/icons/Search';

export const SearchInput = ({ onSetFilter, placeHolder }) => {

    const handelChange = (ev) => {
        const { value } = ev.target
        onSetFilter(value)
    };
    
    return (

        <section className="search-field">
            <SearchIcon />
            <input id="standard-basic" label="Search" name="txt"
                onChange={handelChange} autoComplete="off" placeholder={`Search ${placeHolder}`} />
        </section>

    )


}