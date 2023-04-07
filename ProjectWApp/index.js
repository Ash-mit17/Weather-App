const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const https=require('https')
const axios = require("axios");
require('dotenv').config();               


var ipAddress=process.env.ip;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/",(req,res)=>{
    //ipAddress = req.socket.remoteAddress;
    res.sendFile(__dirname+"/index.html");
})

app.get("/1",(req,res)=>{
    
})

app.post("/1",(req,res)=>{
   

    const options = {
      method: 'GET',
      url: 'https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/',
      params: {ip:`${ipAddress}`},
      headers: {
        'X-RapidAPI-Key': `${process.env.rapidkey}`,
        'X-RapidAPI-Host': 'ip-geolocation-ipwhois-io.p.rapidapi.com'
      }
    };
    axios.request(options).then(function (response) {
        console.log(response.data);
        const lat=response.data.latitude;
        const long=response.data.longitude;
        const url1="https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&units=metric&appid="+process.env.key;
    https.get(url1,(response)=>{
        if(response.statusCode===200){
            response.on("data",(data)=>{
                
                const weatherData1=JSON.parse(data)
                // const name1=weatherData1.city
                console.log(weatherData1)
                // console.log(name1)
                const name1=weatherData1.name
                console.log(name1)
                const temp=weatherData1.main.feels_like;
                const weatherDescription=weatherData1.weather[0].description
                const icon=weatherData1.weather[0].icon
                const imageUrl="http://openweathermap.org/img/wn/"+ icon +"@2x.png"
                res.render("landing",{
                    name:name1,
                    tempCn:temp,
                    humidity:weatherData1.main.humidity,
                    tempDesc:weatherDescription,
                    source:imageUrl
                });
            })
        }
    })
    }).catch(function (error) {
        console.error(error);
    });
})


app.post("/",(req,res)=>{
    const cn=req.body.cityName;
    const url="https://api.openweathermap.org/data/2.5/weather?q="+cn+"&units=metric&appid="+process.env.key;
    https.get(url,(response)=>{
        if(response.statusCode===200){

        response.on("data",(data)=>{
            const weatherData=JSON.parse(data)
            console.log(weatherData)
            const temp=weatherData.main.feels_like;
            const weatherDescription=weatherData.weather[0].description
            const icon=weatherData.weather[0].icon
            const imageUrl="http://openweathermap.org/img/wn/"+ icon +"@2x.png"
            res.render("landing",{
                name:cn.toUpperCase(),
                tempCn:temp,
                humidity:weatherData.main.humidity,
                tempDesc:weatherDescription,
                source:imageUrl
            });
        })
    }
    else{
        res.redirect("/")
    }})

})



app.listen(4000,(req,res)=>{
    console.log("Server is live on port 3000")
})