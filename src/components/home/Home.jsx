import React, { useRef, useState, useEffect } from "react";
import mqtt from "mqtt";
import { useDispatch, useSelector } from "react-redux";
import {
  setAlcoholStatus,
  setDriverImage,
  setIsPlaying,
  setSpeed,
} from "../../store/actions/driverActions";

// Import your assets here
import gif from "../../assets/images/road.mp4";
import car from "../../assets/images/car3.png";
import speedIcon from "../../assets/images/speed.png";
import accelIcon from "../../assets/images/accel.png";
import alcoholIcon from "../../assets/images/alcohol.png";
import greenIcon from "../../assets/images/green.png";
import redIcon from "../../assets/images/red.png";
import logo from "../../assets/images/logo.png";
import driver from "../../assets/images/driver.png";

function Home() {
  const videoRef = useRef(null);
  const mqttRef = useRef(null);
  const dispatch = useDispatch();
  const [mqttDataReceived, setMqttDataReceived] = useState(false);
  const [lastMqttSpeed, setLastMqttSpeed] = useState(0);
  // Get state from Redux
  const { alcoholStatus, speed, driverImage, isPlaying } = useSelector(
    (state) => state.driver
  );

  // Function to normalize speed value
  const normalizeSpeed = (speed) => {
    const speedNum = parseFloat(speed);
    return speedNum > 0 ? speedNum / 120 : 0;
  };

  useEffect(() => {}, [alcoholStatus, speed, isPlaying]);

  // Handle keyboard controls
  const handleKeyDown = (event) => {
    console.log("Key pressed:", event.key);
    console.log("Current alcohol status:", alcoholStatus);

    // Only allow acceleration when alcohol test is passed
    if (alcoholStatus === 1) {
      if (event.key === "a" || event.key === "A") {
        console.log("Accelerating - Alcohol test passed");

        // Ensure video is playing
        if (videoRef.current) {
          videoRef.current
            .play()
            .then(() => {
              dispatch(setIsPlaying(true));

              // Calculate new speed
              const currentSpeed = parseFloat(speed) || 0;
              const newSpeed = Math.min(1, currentSpeed + 0.1);
              console.log(
                "Increasing speed from",
                currentSpeed,
                "to",
                newSpeed
              );

              // Update video playback and speed
              videoRef.current.playbackRate = newSpeed * 2;
              dispatch(setSpeed(newSpeed));
            })
            .catch((err) => console.error("Video play error:", err));
        }
      } else if (event.key === "z" || event.key === "Z") {
        if (videoRef.current) {
          const currentSpeed = parseFloat(speed) || 0;
          const newSpeed = Math.max(0, currentSpeed - 0.1);
          console.log("Decreasing speed from", currentSpeed, "to", newSpeed);

          videoRef.current.playbackRate = newSpeed * 2;
          dispatch(setSpeed(newSpeed));

          if (newSpeed <= 0) {
            videoRef.current.pause();
            dispatch(setIsPlaying(false));
          }
        }
      }
    } else if (alcoholStatus === 3) {
      console.log("Alcohol test required - Cannot accelerate");
    } else if (alcoholStatus === 0) {
      console.log("Alcohol detected - Cannot accelerate");
    }
  };

  useEffect(() => {
    // MQTT Connection Configuration
    const host = process.env.REACT_APP_MQTT_HOST || "app.starkenn.com";
    const port = process.env.REACT_APP_MQTT_PORT || "9001";
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const connectUrl = `ws://${host}:${port}`;

    // Connect to MQTT broker
    mqttRef.current = mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: process.env.REACT_APP_MQTT_USERNAME,
      password: process.env.REACT_APP_MQTT_PASSWORD,
      reconnectPeriod: 1000,
      protocolId: "MQTT",
      protocolVersion: 4,
      rejectUnauthorized: false,
      keepalive: 60,
    });

    mqttRef.current.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttRef.current.subscribe("starkennInv3/DMS_2000A/data", (err) => {
        if (err) {
          console.error("MQTT subscription error:", err);
        } else {
          console.log("Successfully subscribed to MQTT topic");
        }
      });
    });

    // Modified message handler with clear state transitions
    mqttRef.current.on("message", (topic, message) => {
      try {
        const mqttData = JSON.parse(message.toString());
        console.log("Received MQTT Data:", mqttData);

        // Handle alcohol status changes
        if (mqttData.data.result !== undefined) {
          const newAlcoholStatus = mqttData.data.result;
          console.log("Updating alcohol status to:", newAlcoholStatus);

          dispatch(setAlcoholStatus(newAlcoholStatus));

          // Reset speed and video when alcohol status changes
          if (newAlcoholStatus !== 1) {
            if (videoRef.current) {
              videoRef.current.playbackRate = 0;
              videoRef.current.pause();
            }
            dispatch(setIsPlaying(false));
            dispatch(setSpeed(0));
          }
        }

        // Update driver image
        if (mqttData.data.img_url) {
          const newImageUrl = `${
            process.env.REACT_APP_API_URL_PI_IP
          }${mqttData.data.img_url.split("/").splice(3, 5).join("/")}`;
          dispatch(setDriverImage(newImageUrl));
        } else {
          dispatch(setDriverImage(driver));
        }

        // Only process speed data if alcohol test is passed
        if (mqttData.data.result === 1 && mqttData.speed) {
          const normalizedSpeed = normalizeSpeed(mqttData.speed);
          console.log("Processing MQTT speed:", normalizedSpeed);

          if (!isPlaying) {
            dispatch(setSpeed(normalizedSpeed));
          }
        }
      } catch (error) {
        console.error("Error processing MQTT message:", error);
      }
    });

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (mqttRef.current) {
        mqttRef.current.end();
      }
    };
  }, [dispatch, isPlaying, speed, alcoholStatus]);

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
        muted
        style={{ width: "100vw", height: "100vh", objectFit: "fill" }}
        playsInline
      >
        <source src={gif} type='video/mp4' />
        Your browser does not support the video tag.
      </video>

      {alcoholStatus === 3 ? (
        <h2 className='test_text'>TAKE ALCOHOL TEST TO START THE TRIP</h2>
      ) : (
        <h2
          className='pop-alert'
          style={{ color: `${alcoholStatus === 0 ? "red" : "green"}` }}
        >
          {alcoholStatus === 0 ? "Alcohol Detected" : "Alcohol Not Detected"}
        </h2>
      )}

      <div className='car3'>
        <img
          src={driverImage || driver}
          alt="Driver's photograph"
          height='150px'
        />
      </div>

      <div
        className='car2'
        style={{ backgroundColor: "rgba(128, 128, 128, 0.6)" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={speedIcon}
            height='50px'
            style={{ verticalAlign: "center" }}
            alt='Speed Icon'
          />
          <p className='speed' style={{ verticalAlign: "center" }}>
            {alcoholStatus === 3 || alcoholStatus === 0
              ? "0 km/h"
              : `${Math.max(0, (speed * 120).toFixed(1))} km/h`}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={alcoholIcon}
            height='50px'
            style={{ verticalAlign: "center" }}
            alt='Alcohol Icon'
          />
          <div className='speed' style={{ verticalAlign: "center" }}>
            {alcoholStatus === 0 ? (
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

        <div
          style={{ display: "flex", alignItems: "center", margin: "5px 0px" }}
        >
          <img
            src={accelIcon}
            height='50px'
            style={{ verticalAlign: "center" }}
            alt='Acceleration Icon'
          />
          <div className='speed' style={{ verticalAlign: "center" }}>
            {alcoholStatus === 0 ? (
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
      </div>

      <img src={car} alt='roadgif' className='car' />
      <div className='car3'></div>
    </div>
  );
}

export default Home;
