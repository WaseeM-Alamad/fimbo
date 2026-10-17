import { useEffect, useState } from "react";
import "./Navbar.scss";

const testImage =
  "https://www.karmenkraft.com/cdn/shop/files/IMG_9808_2048x.jpg?v=1761929372";

const Navbar = () => {
  const [time, setTime] = useState<{ hours: string; minutes: string }>({
    hours: "00",
    minutes: "00",
  });

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();

      setTime({
        hours: date.getHours().toString().padStart(2, "0"),
        minutes: date.getMinutes().toString().padStart(2, "0"),
      });
    };

    updateTime();

    const intervalId = setInterval(updateTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="nav">
      <div className="nav__logo">FIMBO</div>

      <div className="nav__middle">
        <button>rituals</button>
        <button>PRINTS</button>
        <button>SHOP</button>
        <button>ABOUT</button>
      </div>

      <div className="nav__profile">
        <div className="nav__profile--time">
          {`${time.hours}:${time.minutes}`}
        </div>
        <div className="nav__profile--img-wrapper">
          <img src={testImage} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
