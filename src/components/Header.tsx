import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return <div className="header">
    <img className="header-svg" src="/heart.svg" alt="" onClick={() => navigate("/")}/>
    <div className="header-info"><span className="header-name">People Finder</span><span>Little catalog of people</span></div>
  </div>
}

export default Header;