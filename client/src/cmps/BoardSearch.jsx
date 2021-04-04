
import { Component } from 'react'
import SearchIcon from '@material-ui/icons/Search';

export class BoardSearch extends Component {

    state = {
        txt: ''
    }

    handelChange = (ev) => {
        const { value } = ev.target
        this.setState({ txt: value }, () => this.props.onSetFilter(this.state.txt));
    };

    render() {
        return <>
            <section className="search-field">
                <SearchIcon />
                <input id="standard-basic" label="Search" name="txt" value={this.state.txt}
                    onChange={this.handelChange} autoComplete="off" placeholder="Search Board" />
            </section>
            <div></div>
        </>
    }


}