import React, { Component } from 'react'
// import ClickAwayListener from '@material-ui/core/ClickAwayListener';


export class Colors extends Component {

    changeColor = (color) => {
        const { onChangeColor, data } = this.props;
        data ? onChangeColor(color, data) : onChangeColor(color);
    }

    render() {
        return <div className="edit-colors">
            <span onClick={() => this.changeColor('#FF6E6E')} style={{ backgroundColor: "#FF6E6E" }}></span>
            <span onClick={() => this.changeColor('#fb275d')} style={{ backgroundColor: "#fb275d" }}></span>
            <span onClick={() => this.changeColor('#FF642E')} style={{ backgroundColor: "#FF642E" }}></span>
            <span onClick={() => this.changeColor('#037F4C')} style={{ backgroundColor: "#037F4C" }}></span>
            <span onClick={() => this.changeColor('#00ca72')} style={{ backgroundColor: "#00ca72" }}></span>
            <span onClick={() => this.changeColor('#61BD4F')} style={{ backgroundColor: "#61BD4F" }}></span>
            <span onClick={() => this.changeColor('#df5e88')} style={{ backgroundColor: "#df5e88" }}></span>
            <span onClick={() => this.changeColor('#ffcc00')} style={{ backgroundColor: "#ffcc00" }}></span>
            <span onClick={() => this.changeColor('#41EAD4')} style={{ backgroundColor: "#41EAD4" }}></span>
            <span onClick={() => this.changeColor('#e1ccec')} style={{ backgroundColor: "#f09ae9" }}></span>
            <span onClick={() => this.changeColor('#dddddd')} style={{ backgroundColor: "#dddddd" }}></span>
            <span onClick={() => this.changeColor('#7F5347')} style={{ backgroundColor: "#7F5347" }}></span>
            <span onClick={() => this.changeColor('#784BD1')} style={{ backgroundColor: "#784BD1" }}></span>
            <span onClick={() => this.changeColor('#0086C0')} style={{ backgroundColor: "#0086C0" }}></span>
            <span onClick={() => this.changeColor('#0085ff')} style={{ backgroundColor: "#0085ff" }}></span>
            <span onClick={() => this.changeColor('#3D315B')} style={{ backgroundColor: "#3D315B" }}></span>
        </div>
    }
}
