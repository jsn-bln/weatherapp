import {Card, CardContent, CardHeader, Divider} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import './CurrentWeather.css'


const CurrentWeather = (props) => {
    const date = moment().format('LLLL')
    const timezone = props.data.timezone
    const weather = props.data.weather[0].main
    const icon = props.data.weather[0].icon

    const  calcDate = (offset) =>{
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        const offsetResult = (offset / 60)/60
        var nd = new Date(utc + (3600000*offsetResult));
        const datetime = moment((nd)).format("dddd, MMM  D YYYY h:mm a")
        return datetime
      }
    
    return(
        <Card className="card-container">
            <CardHeader title={props.data.name} subheader={calcDate(props.data.timezone)}/>
            <CardContent className="sub-card-container">
                <h3 className='description'>Today your experiencing {props.data.weather[0].description}</h3>
                <Divider className="divider"/>
                <div className="weather-day-info">
                    <div className="weather-data">
                        <div>Temperature: {Math.round(props.data.main.temp)}°C</div>
                        <div>Feels like: {Math.round(props.data.main.feels_like)}°C</div>
                        <div>Humidity: {Math.round(props.data.main.humidity)}%</div>
                        <div>Wind Speed: {Math.round(props.data.wind.speed)} km/h</div>
                    </div>
                    <img className="icon" src={`http://openweathermap.org/img/wn/${icon}@2x.png`}/>
                </div>
                    
            </CardContent>
        </Card>
    )
}


export default CurrentWeather