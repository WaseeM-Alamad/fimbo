import "./Navbar.scss";

const testImage =
  "https://cdn.displate.com/artwork/270x380/2023-10-30/f86f749a08295842cdcc4afe41dc016a_60dc6f1906a754983fe9d697b5ad72d8.jpg";

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
