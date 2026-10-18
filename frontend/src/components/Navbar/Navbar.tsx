import "./Navbar.scss";

const testImage =
  "https://www.karmenkraft.com/cdn/shop/files/IMG_9808_2048x.jpg?v=1761929372";

const Navbar = () => {
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
        <div className="nav__profile--img-wrapper">
          <img src={testImage} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
