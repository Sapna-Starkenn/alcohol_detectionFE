import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import gif from "../../assets/images/RoadAn.mp4";
import car from "../../assets/images/car3.png";
import speedIcon from "../../assets/images/speed.png";
import accelIcon from "../../assets/images/accel.png";
import alcoholIcon from "../../assets/images/alcohol.png";
import greenIcon from "../../assets/images/green.png";
import redIcon from "../../assets/images/red.png";
import logo from "../../assets/images/logo.png";
import reset from "../../assets/images/reset.png";
import driver from "../../assets/images/driver.png";

// import axios from "axios";
function Home() {
  const videoRef = useRef(null);
  const [speed, setSpeed] = useState(0); // Initial playback speed
  const [acceleration, setAcceleration] = useState(true);
  const [isAlcohol, setIsAlcohol] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    connectToSocket();
    // eslint-disable-next-line
  }, []);

  let connectToSocket = () => {
    const socket = io.connect("http://localhost:8080");

    socket.on("data", (data) => {
      setIsAlcohol(data.alcohol);
      if (data.alcohol) {
        setShow(true);
      }
      setSpeed(data.acceleration[1]);

      videoRef.current.playbackRate = Number(
        data.acceleration[1].toFixed(1) * 4
      );
      if (data.acceleration[1] < data.acceleration[0]) {
        handleSlowStop();
      }
    });
  };

  useEffect(() => {
    if (isAlcohol) {
      handleSlowStop();

      setAcceleration(false);
    }
    // eslint-disable-next-line
  }, [isAlcohol]);

  const handlePause = () => {
    videoRef.current.pause();
  };

  const handlePlay = () => {
    // fetch("http://localhost:8080/"); // call via Axios
    setShow(false);
    connectToSocket();
    setIsAlcohol(false);
    setAcceleration(true);
    videoRef.current.play();
  };

  const handleSlowStop = () => {
    const decreaseAmount = speed / 20; // Amount to decrease per 100ms to reach zero in 3 seconds
    let currentSpeed = speed;

    const decreaseInterval = setInterval(() => {
      currentSpeed -= decreaseAmount;
      if (currentSpeed <= 0) {
        currentSpeed = 0;
        clearInterval(decreaseInterval);
      }
      videoRef.current.playbackRate =
        Number(currentSpeed.toFixed(2)) < 1
          ? 1
          : Number(currentSpeed.toFixed(2));
      setSpeed(Number(currentSpeed.toFixed(2)));
      // console.log(`Current speed: ${currentSpeed.toFixed(2)}`); // Display current speed (you can replace this with your desired action)
    }, 100); // Runs every 100ms

    setTimeout(() => {
      clearInterval(decreaseInterval);
      handlePause();
      setSpeed(currentSpeed);
    }, 3000); // Stops the decrease after 3 seconds
  };

  return (
    <div>
      <img src={logo} alt='Brand Logo' className='logo' />

      <video
        ref={videoRef}
        loop
        autoPlay
        muted
        style={{ width: "100vw", height: "100vh", objectFit: "fill" }}
      >
        <source src={gif} type='video/mp4' />
        Your browser does not support the video tag.
      </video>

      {show && <h2 className='pop-alert'>Alcohol Detected</h2>}

      <div className='car3'>
        <img src={driver} alt="Driver's photograph" height='150px' />
      </div>
      <div className='car2'>
        {/* Speed */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={speedIcon}
            height='50px'
            style={{ verticalAlign: "center" }}
            alt='Speed Icon'
          />{" "}
          <p
            className='speed'
            style={{ verticalAlign: "center", marginLeft: "10px" }}
          >
            {(speed * 120).toFixed(2)} km/h
          </p>
        </div>
        {/* Alcohol */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={alcoholIcon}
            height='50px'
            style={{ verticalAlign: "center" }}
            alt='Alcohol Icon'
          />{" "}
          <div className='speed' style={{ verticalAlign: "center" }}>
            {isAlcohol ? (
              <div style={{ display: "flex" }}>
                <img
                  src={greenIcon}
                  height='30px'
                  style={{ verticalAlign: "center" }}
                  alt='Green Icon'
                />
                <small style={{ fontSize: "18px" }}>Alcohol Detected</small>
              </div>
            ) : (
              <div style={{ display: "flex" }}>
                <img
                  src={redIcon}
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={accelIcon}
            height='50px'
            style={{ verticalAlign: "center" }}
            alt='Accelration Icon'
          />{" "}
          <div className='speed' style={{ verticalAlign: "center" }}>
            {acceleration ? (
              <div style={{ display: "flex" }}>
                <img
                  src={greenIcon}
                  height='30px'
                  style={{ verticalAlign: "center" }}
                  alt='Green Icon'
                />
                <small style={{ fontSize: "18px" }}>Acceleration ON</small>
              </div>
            ) : (
              <div style={{ display: "flex" }}>
                <img
                  src={redIcon}
                  height='30px'
                  style={{ verticalAlign: "center" }}
                  alt='Red Icon'
                />
                <small style={{ fontSize: "18px" }}>Acceleration Cut OFF</small>
              </div>
            )}
          </div>
        </div>
        {isAlcohol && (
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
        )}
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
