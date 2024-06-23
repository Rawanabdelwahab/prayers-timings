/* eslint-disable no-unused-vars */
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";

export default function MainContent() {
  //States
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const [timings, setTimings] = useState({
    Fajr: "04:08",

    Dhuhr: "13:02",
    Asr: "16:40",

    Maghrib: "20:07",
    Isha: "21:43",
  });
  const [remainingTime, setRemainingTime] = useState("");
  const [selectedCity, setSelectedCity] = useState({
    displayName: "الاسكندرية",
    apiName: "Alexandria",
  });
  const availableCities = [
    {
      displayName: "الاسكندرية",
      apiName: "Alexandria",
    },
    {
      displayName: "القاهرة",
      apiName: "Cairo",
    },
    {
      displayName: "بورسعيد",
      apiName: "Port Said",
    },
    {
      displayName: "سويس",
      apiName: "Suez",
    },
    {
      displayName: "الاقصر",
      apiName: "Luxor",
    },
    {
      displayName: "طنطا",
      apiName: "Tanta",
    },
    {
      displayName: "اسيوط",
      apiName: "Asyut",
    },
    {
      displayName: "دمنهور",
      apiName: "Damanhur",
    },
    {
      displayName: "شبين الكوم",
      apiName: "Shibin El Kom",
    },
    {
      displayName: "بنها",
      apiName: "Banha",
    },
    {
      displayName: "مدينة السادس من أكتوبر",
      apiName: "6th of October City",
    },
    {
      displayName: "الجيزة",
      apiName: "Gizeh",
    },
    {
      displayName: "المنصورة",
      apiName: "al-Mansura",
    },
    {
      displayName: "الفيوم",
      apiName: "Fayyum",
    },
    {
      displayName: "أسوان",
      apiName: "Aswan",
    },
    {
      displayName: "الغردقة",
      apiName: "Hurghada",
    },
  ];

  const prayerArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];

  const [today, setToday] = useState("");

  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=EG&city=${selectedCity.apiName}`
    );
    setTimings(response.data.data.timings);
  };

  useEffect(() => {
    getTimings();
  }, [selectedCity]);

  useEffect(() => {
    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);
    const t = moment();
    setToday(t.format("MMM Do YYYY | h:mm"));
    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  const setupCountdownTimer = () => {
    const momentNow = moment();
    let prayerIndex = 2;
    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }
    setNextPrayerIndex(prayerIndex);

    const nextPrayerObject = prayerArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );
      const totalDifference = midnightDiff + fajrToMidnightDiff;
      remainingTime = totalDifference;
    }
    console.log(remainingTime);

    const durationRemainingTime = moment.duration(remainingTime);
    setRemainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
    console.log(
      "duration issss ",
      durationRemainingTime.hours(),
      durationRemainingTime.minutes(),
      durationRemainingTime.seconds()
    );
  };

  const handleCityChange = (event) => {
    const cityObject = availableCities.find((city) => {
      return city.apiName == event.target.value;
    });
    console.log(event.target.value);
    setSelectedCity(cityObject);
  };
  return (
    <>
      {/*top row*/}
      <Grid container>
        <Grid xs={6}>
          <div>
            <h2>{today}</h2>
            <h1>{selectedCity.displayName} </h1>
          </div>
        </Grid>
        <Grid xs={6}>
          <div>
            <h2>متبقى حتى صلاة {prayerArray[nextPrayerIndex].displayName}</h2>
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      {/*top row*/}
      <Divider style={{ borderColor: "white", opacity: "0.1" }} />
      {/* prayer cards*/}
      <Stack
        direction="row"
        justifyContent={"space-around"}
        style={{ marginTop: "50px" }}
      >
        <Prayer
          name="الفجر "
          time={timings.Fajr}
          image="https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"
        />
        <Prayer
          name="الظهر "
          time={timings.Dhuhr}
          image="https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"
        />
        <Prayer
          name="العصر "
          time={timings.Asr}
          image="https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf"
        />
        <Prayer
          name="المغرب"
          time={timings.Maghrib}
          image="https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5"
        />
        <Prayer
          name="العشاء "
          time={timings.Isha}
          image="https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d"
        />
      </Stack>
      {/* prayer cards*/}

      {/*select city*/}
      <Stack
        direction="row"
        justifyContent={"center"}
        style={{ marginTop: "40px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "white" }}>المدينة</span>
          </InputLabel>
          <Select
            style={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            // label="Age"
            onChange={handleCityChange}
          >
            {availableCities.map((city) => {
              return (
                <MenuItem key="1" value={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
