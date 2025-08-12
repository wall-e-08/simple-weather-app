import Image from "next/image";
import {poppins} from "./layout";
import HourlyCard from "../components/HourlyCard";
import {Button} from "../components/ui/button";
import {Filter, MapPin, Search} from "lucide-react";
import CurrentTime from "../components/CurrentTime";

const hourly = [
  { t: '1 PM', temp: 20, label: 'Cloudy', rotation: 50, speed: 1 },
  { t: '2 PM', temp: 21, label: 'Cloudy', rotation: 70, speed: 21 },
  { t: '3 PM', temp: 21, label: 'Cloudy', rotation: 90, speed: 1 },
  { t: '4 PM', temp: 20, label: 'Cloudy', rotation: 250, speed: 33 },
  { t: '5 PM', temp: 21, label: 'Cloudy', rotation: 120, speed: 1 },
  { t: '6 PM', temp: 21, label: 'Cloudy', rotation: 180, speed: 50 }
]

const favouriteCities = [
  { city: "London" },
  { city: "Leeds" },
  { city: "Manchester" },
]

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="max-w-[1200px] w-full bg-white rounded-xl card-main
                      p-4 md:py-8 md:pl-8 md:pr-0 flex flex-col md:flex-row overflow-hidden">
        <section className="flex-1 md:pr-8 lg:w-[70%] flex flex-col justify-between">

          <div className="mt-4 w-full flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-start items-center gap-5 py-2">
            <div className="text-base md:text-lg font-bold flex items-center space-x-2">
              <MapPin size={16} color="red"/>
              <span>London</span>
            </div>
            <div className="text-center text-xs md:text-sm small-muted">12 Aug 2025</div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex items-start md:items-center space-x-2 md:space-x-4">
              <div className={`text-[5rem] md:text-[12rem] leading-none text-gray-600 ${poppins.className}`}>20</div>
              <div className="text-4xl md:text-6xl text-gray-600 self-start mt-4">°</div>
            </div>

            <div className="mt-2 md:mt-3 text-xl md:text-md">Feels like 19° • <CurrentTime/></div>

            <div className="mt-2 md:mt-3 text-2xl md:text-4xl text-gray-500">Cloudy</div>
          </div>

          <div className="mt-6 md:mt-8 flex gap-4 md:gap-6">
            {hourly.map((h) => (
              <HourlyCard
                key={h.t}
                time={h.t}
                temp={h.temp}
                label={h.label}
                rotation={h.rotation}
                speed={h.speed}
              />
            ))}
          </div>
        </section>

        <aside className="mt-8 md:-mt-8 md:-mb-8 lg:w-[30%]
                          rounded-xl md:rounded-tl-none md:rounded-bl-none
                          p-4 md:p-6 flex flex-col items-center bg-gray-50 shadow-sm">
          <div className="text-lg md:text-2xl font-medium">Good Morning</div>
          <div className="text-sm md:text-xl small-muted mt-1 md:mt-2">12:27 PM</div>

          <div className="mt-4 md:mt-6 w-full bg-white rounded-lg p-3 md:p-4 card">
            <table className="table-fixed w-full">
              <tbody>
              <tr>
                <td>Wind speed</td>
                <td>6.1 mph</td>
              </tr>
              <tr>
                <td>Precipitation</td>
                <td>10%</td>
              </tr>
              <tr>
                <td>Humidity</td>
                <td>57%</td>
              </tr>
              <tr>
                <td>Pressure</td>
                <td>1031mb</td>
              </tr>
              <tr>
                <td>Visibility</td>
                <td>Good</td>
              </tr>
              </tbody>
            </table>
          </div>

          <hr className="border-t border-gray-300 w-full my-3 md:my-6 "/>

          <div className="w-full flex flex-col gap-2">
            <h3 className="text-xl">
              {favouriteCities.length > 0 ? "Favourite Location" : "Add your Favourite Location"}
            </h3>
            {favouriteCities.map((fav, index) => (
              <div className="w-full flex" key={`fav-city-${index}`}>
                <Button className="flex-1 rounded-none mr-1">
                  {fav.city}
                </Button>
                <Button className="w-10 rounded-none">X</Button>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>

  )
}
