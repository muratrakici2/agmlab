import React, { useEffect, useState } from 'react';
import cities from "./cities.json"
import { YMaps, Map, Placemark } from 'react-yandex-maps';
const HomeScreen = () => {
    const [city, setcity] = useState([]);
    const [county, setcounty] = useState([]);
    const [citys, setcitys] = useState([]);
    const [search, setsearch] = useState("ANKARA");
    const [enyakin, setenyakin] = useState([]);
    const [location, setlocation] = useState([39.35, 34.23]);
    const [say, setsay] = useState(0);
    const [filtreliCities, setfiltreliCities] = useState([]);
    useEffect(() => {
        setcity(cities);
        setfiltreliCities(cities)
    }, []);

    useEffect(() => {
        async function cityList() {
            let citys = await city;
            let cityName = citys.map((i) => i.city);
            let uniqCity = [...new Set(cityName)];
            setcitys(uniqCity)
        }
        cityList();
    }, [city]);

    const selectCounty = (ilce) => {
        let countys = city.filter((i) => i.city === ilce);
        let countyName = countys.map((i) => i.county);
        let uniqCounty = [...new Set(countyName)];
        setcounty(uniqCounty)
    }
    function Deg2Rad(deg) {
        return deg * Math.PI / 180;
    }

    function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
        lat1 = Deg2Rad(lat1);
        lat2 = Deg2Rad(lat2);
        lon1 = Deg2Rad(lon1);
        lon2 = Deg2Rad(lon2);
        var R = 6371; // km
        var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
        var y = (lat2 - lat1);
        var d = Math.sqrt(x * x + y * y) * R;
        return d;
    }

    const yakinyer = () => {
        setsay(1)
        setenyakin([]);
    }

    useEffect(() => {
        if (say === 0) {
            console.log("hiç bir şey yapma")
        } else {
            if (say<4) {
                let filtreliListe = filtreliCities.filter((i) => i.county !== search);
                let filtreliyer = city.filter((i) => i.county === search);
                var lat = filtreliyer[0].centerLat; // user's latitude
                var lon = filtreliyer[0].centerLon; // user's longitude
                var minDif = 99999;
                var closest;
                
                for (var index = 0; index < filtreliListe.length; ++index) {
                    var dif = PythagorasEquirectangular(lat, lon, filtreliListe[index].centerLat, filtreliListe[index].centerLon);
                    if (dif < minDif) {
                        closest = index;
                        minDif = dif;
                    }
    
                }
                setenyakin([...enyakin, filtreliListe[closest]]);
                let ele = filtreliCities.filter((i,x)=>x!==closest+1);
                setfiltreliCities(ele);

                setsay(s=>s+1);
                console.log("çalıştı");
            }else{
                setsay(0)
                setfiltreliCities(city);
            }
        }
    }, [say])




    const changeCity = (e) => {
        let buyut = e.target.value.toUpperCase()
        setsearch(buyut)
    }
    const goLocation = (x, y) => {
        setlocation([x, y])
    }

    return (
        <div>
            <div className="home">
                <div className="listeler">
                    <div className="il">
                        <h3>İller</h3>
                        <ul>
                            {citys.map((i, x) => (
                                <li key={x} className="iller" onClick={() => selectCounty(i)}>{i}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="ilce">
                        <h3>İlçeleri</h3>
                        <ul>
                            {county.map((i, x) => (
                                <li key={x} className="ilceler">{i}</li>
                            ))}
                        </ul>
                    </div>

                </div>
                <div className="enyakin">
                    <div>
                        <input onChange={changeCity} placeholder="İl,İlçe Büyük Harf Kullanınız" />
                        <button onClick={yakinyer}>En Yakın</button>
                    </div>
                    <h3>En Yakın Yer</h3>
                    <ul>
                        {enyakin.map((i, x) => (
                            <li key={x} className="iller" onClick={() => goLocation(i.centerLat, i.centerLon)}>{i.county}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div >
                <YMaps query={{ lang: "tr_TR" }}  >
                    <Map className="harita" defaultState={{ center: [location[0], location[1]], zoom: 5 }} >
                        <Placemark geometry={[location[0], location[1]]} />
                    </Map>
                </YMaps>
            </div>


        </div>
    )
}

export default HomeScreen
