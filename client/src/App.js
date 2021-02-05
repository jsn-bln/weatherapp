import './App.css'
import axios from 'axios'
import {useState, useContext} from 'react'
import sunny from './svg/sunny-day.svg'
import hot from './svg/hot-day.svg'
import cold from './svg/cold-day.svg'
import cloudy from './svg/cloudy-day.svg'
import clearNight from './svg/sunny-night.svg'
import cloudyNight from './svg/cloudy-night.svg'
import hotNight from './svg/hot-night.svg'
import coldNight from './svg/cold-night.svg'
import CurrentWeather from './components/CurrentWeather/CurrentWeather'
import WeeklyWeather from './components/WeeklyWeather/WeeklyWeather'
import DataContext from './context/DataContext'
import CircularProgress from '@material-ui/core/CircularProgress';

const App = () => {
  const [city, setCity] = useState('')
  const [data, setData] = useState({})
  const [bg, setBg] = useState('')
  const [weatherData, setWeatherData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [time, setTime] = useState('')
  const findCity = () => {
      axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9782b49f3b88030442b9fe6cff72fe64&units=metric`)
      .then(res => {
          setData(res.data)
          const time = calcTime(res.data.timezone)
          setTime(time)
          setBackground(res.data.main.temp,time)
          const lat = res.data.coord.lat
          const lon = res.data.coord.lon
          axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=9782b49f3b88030442b9fe6cff72fe64&units=metric`)
            .then(res => {
              setWeatherData(res.data)
              setIsLoading(false)
            })
            .catch(error => console.log(error))
      })
      .catch(err => console.log(err))
  }

  const setBackground = (temperature, time) => {
    const temp = Math.round(temperature)
    if(temp >= 32 && (time <= 17 && time >=5)){
      setBg(hot)
    }else if((temp >= 20 && temp <=31) && (time <= 17 && time >=5)){
      setBg(sunny)
    }
    else if((temp >= 11 && temp <=19) && (time <= 17 && time >=5)){
      setBg(cloudy)
    }
    else if(temp <= 10 && (time <= 17 && time >=5)){
      setBg(cold)
    }
    else if(temp >= 32 && (time >= 18 || time <=4)){
      setBg(hotNight)
    }
    else if((temp >= 20 && temp <=31) && (time >= 18 || time <=4)){
      setBg(clearNight)
    }
    else if((temp >= 11 && temp <=19) && (time >= 18 || time <=4)){
      setBg(cloudyNight)
    }
    else if(temp <= 10 && (time >= 18 || time <=4)){
      setBg(coldNight)
    }
  }

  const calcTime = (offset) =>{
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const offsetResult = (offset / 60)/60
    var nd = new Date(utc + (3600000*offsetResult));

    return nd.getHours();
  }

  return (
    <div className="App" style={{backgroundImage: `url(${bg}`}}>
      <div className="main-container">
        <h1 className="brand">Weather Forecast</h1>
        <div className="action-group">
          <input className="search-bar" placeholder="Search City" value={city}
              onChange={e => setCity(e.target.value)} 
              onKeyDown={e=> e.key === 'Enter' ?  findCity() : null}/>
          <button className="search-btn" onClick={findCity}>Search</button>
        </div>
      </div>
      {data.main !== undefined?
      <div className="data-container">
            <div className="cards">
              <DataContext.Provider value={{weatherData, setWeatherData}}>
              {isLoading?
                <CircularProgress />
                :
                <>
                <CurrentWeather  data={data}/>
                <WeeklyWeather time={time}/>
                </>

              } 
              </DataContext.Provider>
            </div>
        </div>
        :
        <div>No data yet</div>
      }
    </div>
  );
}

export default App;
