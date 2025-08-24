import React, { useEffect, Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import "./style.css";
import { useProjects } from "../../api/ProjectsContext";
import List from "@mui/material/List";
import ListItem from "@mui/material/List";
import Collapse from "@mui/material/Collapse";

const MobileMenu = () => {
  const { causesData } = useProjects();
  const [openId, setOpenId] = useState(0);
  const [menuActive, setMenuState] = useState(false);
  // State to hold the title of the current language
  const [currentLanguage, setCurrentLanguage] = useState("Language");

  // Function to handle language change from our custom dropdown
  const handleLanguageChange = (lang, langTitle) => {
    if (window.changeLanguage) {
      window.changeLanguage(lang);
      // Update the state with the new language title
      setCurrentLanguage(langTitle);
    } else {
      console.error("Google Translate script not yet loaded.");
    }
  };

  const menus = [
    {
      id: 1,
      title: "Home",
      link: "/",
    },
    {
      id: 2,
      title: "Explore",
      link: "/projects",
      submenu: [
        "Agriculture",
        "Community Building",
        "Education",
        "Food",
        "Health",
        "Human Rights",
        "ICT",
        "Media & Journalism",
        "Water",
        "Health and Environmental Security",
      ].map((category, index) => ({
        id: index,
        title: category,
        link: `/projects/category/${encodeURIComponent(category)}`,
      })),
    },
    {
      id: 3,
      title: "Pages",
      link: "",
      submenu: [
        { id: 30, title: "About", link: "/about" },
        { id: 31, title: "Contact", link: "/contact" },
        { id: 32, title: "How it works", link: "/how-it-works" },
        { id: 33, title: "Privacy Policy", link: "/privacy" },
        { id: 34, title: "Terms Of Use", link: "/terms" },
      ],
    },
    {
      id: 4,
      title: "Login",
      link: "https://dashboard.sokaab.com/login/",
    },
    // The language switcher with a dynamic title
    {
      id: 5,
      title: currentLanguage, // This will change based on the state
      link: "#",
      // icon: "fa fa-globe",
      submenu: [
        // Pass the language code and title to the handler
        { id: 50, title: "English", link: "#", onClick: () => handleLanguageChange("en", "English") },
        { id: 51, title: "Soomaali", link: "#", onClick: () => handleLanguageChange("so", "Soomaali") },
      ],
    },
  ];

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };
  
  return (
    <div>
      <div className={`mobileMenu ${menuActive ? "show" : ""}`}>
        <div className="menu-close">
          <div className="clox" onClick={() => setMenuState(!menuActive)}>
            <i className="fa fa-close"></i>
          </div>
        </div>
        <ul className="responsivemenu">
          {menus.map((item, mn) => (
            <ListItem className={item.id === openId ? "active" : null} key={mn}>
              {item.submenu ? (
                <Fragment>
                  <p
                    onClick={() => setOpenId(item.id === openId ? 0 : item.id)}
                  >
                    <NavLink
                      onClick={() => {
                        ClickHandler();
                        if (item.id !== 3 && item.id !== 5) setMenuState(false);
                      }}
                      to={item.link}
                    >
                      {item.title} 
                      {/* Render icon if it exists */}
                      {item.icon && <i className={item.icon}></i>}
                    </NavLink>
                    <i
                      className={
                        item.id === openId
                          ? "fa fa-angle-up"
                          : "fa fa-angle-down"
                      }
                    ></i>
                  </p>
                  <Collapse
                    in={item.id === openId}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List className="subMenu">
                      {item.submenu.map((submenu, i) => (
                        <ListItem key={i}>
                          <NavLink
                            onClick={() => {
                              // Call the onClick function for the submenu item if it exists
                              if (submenu.onClick) {
                                submenu.onClick();
                              }
                              ClickHandler();
                              setMenuState(false);
                            }}
                            to={submenu.link}
                          >
                            {submenu.title}
                          </NavLink>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </Fragment>
              ) : (
                <NavLink
                  onClick={() => {
                    ClickHandler();
                    setMenuState(false);
                  }}
                  className="active"
                  to={item.link}
                >
                  {item.title}
                </NavLink>
              )}
            </ListItem>
          ))}
        </ul>
      </div>
      <div
        className="showmenu mobail-menu"
        onClick={() => setMenuState(!menuActive)}
      >
        <button type="button" className="navbar-toggler open-btn">
          <span className="icon-bar first-angle"></span>
          <span className="icon-bar middle-angle"></span>
          <span className="icon-bar last-angle"></span>
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
