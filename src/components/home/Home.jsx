import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import gif from "../../assets/images/road.mp4";
import car from "../../assets/images/car3.png";
import speedIcon from "../../assets/images/speed.png";
import accelIcon from "../../assets/images/accel.png";
import alcoholIcon from "../../assets/images/alcohol.png";
import greenIcon from "../../assets/images/green.png";
import redIcon from "../../assets/images/red.png";
import logo from "../../assets/images/logo.png";
// import reset from "../../assets/images/reset.png";
import driver from "../../assets/images/driver.png";
// import "dotenv/config";

// import axios from "axios";
function Home() {
  const videoRef = useRef(null);
  const [speed, setSpeed] = useState(0);
  const [img, setImg] = useState(driver);
  const [isAlcohol, setIsAlcohol] = useState(3);

  useEffect(() => {
    connectToSocket();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("Imag ::", img);
  }, [img]);

  let connectToSocket = () => {
    const socket = io.connect("http://localhost:8080");

    socket.on("data", (data) => {
      console.log(process.env.REACT_APP_API_URL_PI_IP);
      setIsAlcohol(data.alcohol);
      console.log("data.img_url :::", data.img_url);
      if (!!data.img_url) {
        setImg(
          `${process.env.REACT_APP_API_URL_PI_IP}${data?.img_url
            .split("/")
            .splice(3, 5)
            .join("/")}`
        );
      } else {
        setImg(driver);
      }

      console.log(videoRef.current.playbackRate, "sapna");
      if (data.alcohol === 1) {
        videoRef.current.play();
        setSpeed(data.acceleration[1]);
        console.log("speed", data.acceleration[1]);
        if (data.acceleration[1] < 0.1) {
          videoRef.current.playbackRate = 0;
        } else {
          videoRef.current.playbackRate = Number(
            data.acceleration[1].toFixed(4) * 2
          );
        }
      }
      if (data.alcohol === 3) {
        setSpeed(data.acceleration[1]);
        videoRef.current.playbackRate = 0;
      }
      if (data.alcohol === 0) {
        setSpeed(data.acceleration[1]);
        videoRef.current.playbackRate = 0;
      }
      // if (data.acceleration[1] > 0) {
      //   videoRef.current.play();
      //   videoRef.current.playbackRate = Number(
      //     data.acceleration[1].toFixed(1) * 4
      //   );
      // }
      // if (data.acceleration[1] < data.acceleration[0]) {
      //   handleSlowStop();
      // }
    });
  };

  // useEffect(() => {
  //   if (isAlcohol) {
  //     handleSlowStop();
  //   }
  //   // eslint-disable-next-line
  // }, [isAlcohol]);

  // const handlePause = () => {
  //   videoRef.current.pause();
  // };

  // const handlePlay = () => {
  //   // fetch("http://localhost:8080/"); // call via Axios

  //   connectToSocket();
  // };

  // const handleSlowStop = () => {
  //   const decreaseAmount = speed / 20; // Amount to decrease per 100ms to reach zero in 3 seconds
  //   let currentSpeed = speed;

  //   const decreaseInterval = setInterval(() => {
  //     currentSpeed -= decreaseAmount;
  //     if (currentSpeed <= 0) {
  //       currentSpeed = 0;
  //       clearInterval(decreaseInterval);
  //     }
  //     videoRef.current.playbackRate =
  //       Number(currentSpeed.toFixed(2)) < 1
  //         ? 1
  //         : Number(currentSpeed.toFixed(2));
  //     setSpeed(Number(currentSpeed.toFixed(2)));
  //     // console.log(`Current speed: ${currentSpeed.toFixed(2)}`); // Display current speed (you can replace this with your desired action)
  //   }, 100); // Runs every 100ms

  //   setTimeout(() => {
  //     clearInterval(decreaseInterval);
  //     handlePause();
  //     setSpeed(currentSpeed);
  //   }, 3000); // Stops the decrease after 3 seconds
  // };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <img src={logo} alt='Brand Logo' className='logo' />

      <video
        ref={videoRef}
        loop
        // autoPlay
        muted
        style={{ width: "100vw", height: "100vh", objectFit: "fill" }}
      >
        <source src={gif} type='video/mp4' />
        Your browser does not support the video tag.
      </video>

      {isAlcohol === 3 ? (
        <h2 className='test_text'>TAKE ALCOHOL TEST TO START THE TRIP</h2>
      ) : (
        <h2
          className='pop-alert'
          style={{ color: `${isAlcohol === 0 ? "red" : "green"}` }}
        >
          {isAlcohol === 0 ? "Alcohol Detected" : "Alcohol Not Detected"}
        </h2>
      )}

      <div className='car3'>
        <img src={img} alt="Driver's photograph" height='150px' />
        {/* http://192.168.0.241/html/media/im_0898_20231205_183725.jpg */}
        {/* /var/www/html/media/im_0898_20231205_183725.jpg */}
        {/* .split("/").splice(3,5).join("/") */}
      </div>
      <div
        className='car2'
        style={{ backgroundColor: "rgba(128, 128, 128, 0.6)" }}
      >
        {/* Speed */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={speedIcon}
            height='50px'
            style={{ verticalAlign: "center" }}
            alt='Speed Icon'
          />{" "}
          {isAlcohol === 3 || isAlcohol === 0 ? (
            <p className='speed' style={{ verticalAlign: "center" }}>
              0 km/h
            </p>
          ) : (
            <p className='speed' style={{ verticalAlign: "center" }}>
              {(speed * 120).toFixed(2) < 2 ? 0 : (speed * 120).toFixed(2)} km/h
            </p>
          )}
        </div>
        {/* Alcohol */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={alcoholIcon}
            height='50px'
            style={{ verticalAlign: "center" }}
            alt='Alcohol Icon'
          />{" "}
          <div className='speed' style={{ verticalAlign: "center" }}>
            {isAlcohol === 0 ? (
              <div style={{ display: "flex" }}>
                <img
                  src={redIcon}
                  height='30px'
                  style={{ verticalAlign: "center" }}
                  alt='Green Icon'
                />
                <small style={{ fontSize: "18px" }}>Alcohol Detected</small>
              </div>
            ) : (
              <div style={{ display: "flex", margin: "8px 0px" }}>
                <img
                  src={greenIcon}
                  height='30px'
                  style={{ verticalAlign: "center" }}
                  alt='Red Icon'
                />
                <small style={{ fontSize: "18px" }}>Alcohol Not Detected</small>
              </div>
            )}
          </div>
        </div>

        {/* Accelerator */}
        <div
          style={{ display: "flex", alignItems: "center", margin: "5px 0px" }}
        >
          <img
            src={accelIcon}
            height='50px'
            style={{ verticalAlign: "center" }}
            alt='Accelration Icon'
          />{" "}
          <div className='speed' style={{ verticalAlign: "center" }}>
            {isAlcohol === 0 ? (
              <div style={{ display: "flex" }}>
                <img
                  src={redIcon}
                  height='30px'
                  style={{ verticalAlign: "center" }}
                  alt='Green Icon'
                />
                <small style={{ fontSize: "18px" }}>Acceleration Cut Off</small>
              </div>
            ) : (
              <div style={{ display: "flex" }}>
                <img
                  src={greenIcon}
                  height='30px'
                  style={{ verticalAlign: "center" }}
                  alt='Red Icon'
                />
                <small style={{ fontSize: "18px" }}>Acceleration On</small>
              </div>
            )}
          </div>
        </div>
        {/* {isAlcohol && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={reset}
              height='50px'
              style={{ verticalAlign: "center", cursor: "pointer" }}
              alt='Accelration Icon'
              onClick={handlePlay}
            />{" "}
            <small
              style={{
                fontSize: "18px",
                color: "white",
                textAlign: "end",
                marginLeft: "12px",
                cursor: "pointer",
              }}
              onClick={handlePlay}
            >
              Reset
            </small>
          </div>
        )} */}
      </div>

      <img src={car} alt='roadgif' className='car'></img>
      <div className='car3'>
        {/* <button className='btn' onClick={handlePause}>
          Stop
        </button> 
        <button className='btn' onClick={handlePlay}>
          Reset
        </button>
        <button className='btn' onClick={handleIncreaseSpeed}>
          Increase Speed
        </button>
        <button className='btn' onClick={handleReduceSpeed}>
          Reduce Speed
        </button>
        <button className='btn' onClick={handleAlcohol}>
          Alcohol Toggle
        </button> */}
      </div>
    </div>
  );
}

export default Home;
