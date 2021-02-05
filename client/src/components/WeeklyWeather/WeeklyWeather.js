import React,{useState, useContext} from 'react'
import {Card,Divider, Button, Menu, MenuItem,Fade,CardContent} from '@material-ui/core'
import {Link, Switch,Route, useHistory} from 'react-router-dom'
import './WeeklyWeather.css'
import {Line} from 'react-chartjs-2'
import DataContext from '../../context/DataContext'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {AutoRotatingCarousel,Slide} from 'material-auto-rotating-carousel'

const WeeklyWeather = (props) => {
    const hourly_temperature = []
    const hourly_weather = []
    const hourly_humidity = []
    const {weatherData} = useContext(DataContext)
    const raw_hourly_data = weatherData.hourly
    const hourly_data_temp = raw_hourly_data.forEach(data => hourly_temperature.push(data.temp))
    const hourly_data_humid = raw_hourly_data.forEach(data => hourly_humidity.push(data.humidity))
    const hourly_data_weather = raw_hourly_data.forEach(data => hourly_weather.push(data.weather[0]))
    const [menuname, setMenuname] = useState('Hourly Weather')
    console.log(weatherData)
    const getTime = () => {
        const orderedTime = []
        const dict = {  1:'1am', 2:'2am', 3:'3am',4:'4am',5:'5am',6:'6am',7:'7am',8:'8am',9:'9am',10:'10am',
        11:'11am',12:'12pm',13:'1pm', 14:'2pm', 15:'3pm',16:'4pm',17:'5pm',18:'6pm',19:'7pm',20:'8pm',21:'9pm',22:'10pm',
        23:'11pm',0:'12am'}
        for(let time = props.time; time<24; time++){
            orderedTime.push(dict[time])
        } // get initial time upto 11pm
        for(let addedTime = 0; addedTime < props.time; addedTime++){
            orderedTime.push(dict[addedTime])
        }// add time from 12am to initial time
        return orderedTime
        
    }


    const temp_line_data = {
        labels: getTime(),
        datasets: [
            {
            label: 'Temparature',
            fill: true,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: hourly_temperature
            }
        ]
        }
    
    
    
      const humid_line_data = {
        labels: getTime(),
        datasets: [
          {
            label: 'Humidity',
            fill: true,
            lineTension: 0.5,
            backgroundColor: 'orange',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: hourly_humidity
          }
        ]
      }


    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const history = useHistory()
    const temperature = () => {
        history.push('/temperature')
        setMenuname('Temperature')
        setAnchorEl(null);
    }
    const humidity = () => {
        history.push('/humidity')
        setMenuname('Humidity')
        setAnchorEl(null);
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const hourlyWeather = () =>{
        history.push('/')
        setMenuname('Hourly Weather')
        setAnchorEl(null);
    }



    return(
        <Card className="weekly-card-container">
            <Button endIcon={<ArrowDropDownIcon />} aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
                {menuname}
            </Button>
            <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={hourlyWeather}>Hourly Weather</MenuItem>
                <MenuItem onClick={handleClose}>Daily Weather</MenuItem>
                <MenuItem onClick={temperature}>Temperature</MenuItem>
                <MenuItem onClick={humidity}>Humidity</MenuItem>
            </Menu>




            <Divider className="divider"/>
            <Switch>
                <Route path="/temperature">
                        <Line
                        data={temp_line_data}
                        options={{
                            title:{
                            display:true,
                            text:'Temperature',
                            fontSize:15
                            },
                            legend:{
                            display:true,
                            position:'bottom'
                            }
                        }}
                        />
                </Route>
                <Route path="/humidity">
                    <Line
                        data={humid_line_data}
                        options={{
                            title:{
                            display:true,
                            text:'Humidity',
                            fontSize:15
                            },
                            legend:{
                            display:true,
                            position:'bottom'
                            }
                        }}/>
                </Route>
                <Route exact path="/">
                    <div className="weekly-card-items">
                    {hourly_weather.slice(24,47).map(hour =>{
                        return <Card className="hourly-weather-card">
                                <img src={`http://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                                        className="hourly-weather-img"
                                />
                                <h4>{hour.main}</h4>
                                <div>{hour.description}</div>
                                <div>{hour.temp}</div>
                                
                            </Card>
                        
                    })}
                    
                    </div>
                </Route>
            </Switch>
        </Card>
    )
}


export default WeeklyWeather