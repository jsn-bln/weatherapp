import React,{useState, useContext} from 'react'
import {Card,Divider, Button, Menu, MenuItem,Fade,IconButton} from '@material-ui/core'
import {Link, Switch,Route, useHistory} from 'react-router-dom'
import './WeeklyWeather.css'
import {Line} from 'react-chartjs-2'
import DataContext from '../../context/DataContext'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Carousel,{consts} from 'react-elastic-carousel'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';



const WeeklyWeather = (props) => {
    const hourly_temperature = []
    const hourly_weather = []
    const daily_weather = []
    const hourly_humidity = []
    const {weatherData} = useContext(DataContext)
    const raw_hourly_data = weatherData.hourly
    const hourly_data_temp = raw_hourly_data.forEach(data => hourly_temperature.push(data.temp))
    const hourly_data_humid = raw_hourly_data.forEach(data => hourly_humidity.push(data.humidity))
    const hourly_data_weather = raw_hourly_data.forEach(data => hourly_weather.push(data.weather[0]))
    const daily_data_weather = weatherData.daily.forEach(data => daily_weather.push(data.weather[0]))
    const [menuname, setMenuname] = useState('Hourly Weather')
    const days = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday","Friday","Saturday","Sunday","Monday", "Tuesday", "Wednesday", "Thursday","Friday","Saturday"]
    const getTime = () => {
        const orderedTime = []
        const dict = {  1:'1 am', 2:'2 am', 3:'3 am',4:'4 am',5:'5 am',6:'6 am',7:'7 am',8:'8 am',9:'9 am',10:'10 am',
        11:'11 am',12:'12 pm',13:' 1pm', 14:'2 pm', 15:'3 pm',16:'4 pm',17:'5 pm',18:'6 pm',19:'7 pm',20:'8 pm',21:'9 pm',22:'10 pm',
        23:'11 pm',0:'12 am'}
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
    

    const  breakPoints = [
        { width: 1, itemsToShow: 1, itemsToScroll: 1, pagination: false },
        { width: 200, itemsToShow: 1, itemsToScroll: 1, pagination: false},
        { width: 400, itemsToShow: 4, itemsToScroll: 3,},
      ]


    const myArrow = ({ type, onClick, isEdge }) =>{
        const pointer = type === consts.PREV ? <ArrowBackIosIcon/> : <ArrowForwardIosIcon/>
        return (
          <IconButton className='arrowBtns' onClick={onClick} disabled={isEdge}>
            {pointer}
          </IconButton>
        )
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
    const dailyWeather = () =>{
        history.push('/daily')
        setMenuname('Daily Weather')
        setAnchorEl(null);
    }

    const time = getTime() // FOR THE HOURLY AND DAILY WEATHER CARDS
    let index = 0 // index of time
    let currentDay = new Date().getDay()
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
                <MenuItem onClick={dailyWeather}>Daily Weather</MenuItem>
                <MenuItem onClick={temperature}>Temperature</MenuItem>
                <MenuItem onClick={humidity}>Humidity</MenuItem>
            </Menu>




            <Divider className="divider"/>
            <Switch>
                <Route path="/temperature">
                        <Line
                        className="line-graph"
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
                    className="line-graph"
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
                    <Carousel breakPoints={breakPoints} renderArrow={myArrow}>
                    {hourly_weather.slice(0,24).map(hour =>{
                        index++
                        return <Card className="hourly-weather-card">
                                <div><strong>{time[index-1]}</strong></div>
                                <img src={`http://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                                        className="hourly-weather-img"
                                />
                                <div><strong>{hour.main}</strong></div>
                                <div>{hour.description}</div>
                                <div>{hour.temp}</div>
                            </Card>
                            
                        
                    })}
                    </Carousel>
                    </div>
                </Route>
                <Route path="/daily">
                <div className="daily-card-items">
                    <Carousel breakPoints={breakPoints} renderArrow={myArrow}>
                        {daily_weather.slice(0,7).map(day =>{
                            currentDay++
                            return <Card className="daily-weather-card">
                                    <div><strong>{days[currentDay-1]}</strong></div>
                                    <img src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                            className="hourly-weather-img"
                                    />
                                    <div><strong>{day.main}</strong></div>
                                    <div>{day.description}</div>
                                    <div>{day.temp}</div>
                                </Card>
                            
                        })}
                        </Carousel>
                    </div>
                </Route>
            </Switch>
        </Card>
    )
}


export default WeeklyWeather