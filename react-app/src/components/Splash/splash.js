import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import LoginFormModal from "../auth/LoginFormModal";
import SignUpFormModal from "../auth/SignupFormModal";

import "./splash.css";

export default function Splash() {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <>
      <div className="splash-nav">
        {sessionUser && (
          <nav id="splash-logged-out">
            <NavLink
              id="splash-logo"
              className="splash-logo"
              to="/home"
              exact={true}
            >
              Back to Wecord 2.0
            </NavLink>
            <LogoutButton />
          </nav>
        )}
        {!sessionUser && (
          <>
            <NavLink
              id="splash-wecord"
              className="splash-nav-items"
              to="/"
              exact={true}
            >
              Wecord 2.0
            </NavLink>
            <div>
              <span className="splash-nav-items">
                <LoginFormModal />
              </span>
              <span className="splash-nav-items">
                <SignUpFormModal />
              </span>
            </div>
          </>
        )}
      </div>

      <div className="splash-container">
        <div className="background-partition">
          <h1 id="splash-title">Imagine a place...</h1>
          <p id="splash-intro">
            ...where you can belong to any school club, any gaming group, or a
            worldwide art community.
            <div></div>
            <br />
            Where just you and anyone can spend time together.
            <div></div>
            <br />A place where strangers can become acquaintances...or maybe
            even friends.
          </p>
        </div>
        <div className="bg-image-partition"></div>
        <div className="footer">
          <section className="dev-info">
            <img
              className="profile-pic"
              src="https://avatars.githubusercontent.com/u/96600317?v=4"
              alt="Ricky"
            ></img>
            <div className="profile-section">
              <div className="name">Ricky Cheung</div>

              <div className="git-in">
                <a href="https://github.com/WingNinCheung" target="popup">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/wingnincheung/"
                  target="popup"
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="mailto:rickycheung.dev@gmail.com">
                  <i className="fa-solid fa-envelope"></i>
                </a>
              </div>
            </div>
          </section>
          <section className="dev-info">
            <img
              className="profile-pic"
              src="https://avatars.githubusercontent.com/u/8907997?v=4"
              alt="Krista"
            ></img>
            <div className="profile-section">
              <div className="name">Krista Strucke</div>

              <div className="git-in">
                <a href="https://github.com/kurikurichan" target="popup">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/krista-strucke-044b3369/"
                  target="popup"
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="mailto:developerkrista@gmail.com">
                  <i className="fa-solid fa-envelope"></i>
                </a>
              </div>
            </div>
          </section>
          <section className="dev-info">
            <img
              className="profile-pic"
              src="https://avatars.githubusercontent.com/u/101230473?v=4"
              alt="Brendan"
            ></img>
            <div className="profile-section">
              <div className="name">Brendan Lau</div>

              <div className="git-in">
                <a href="https://github.com/BrenLau" target="popup">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/brendan-lau-b6952919a/"
                  target="popup"
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="mailto:blau4000@gmail.com">
                  <i className="fa-solid fa-envelope"></i>
                </a>
              </div>
            </div>
          </section>
          <section className="dev-info">
            <img
              className="profile-pic"
              src="https://avatars.githubusercontent.com/u/92266749?v=4"
              alt="Joyce"
            ></img>
            <div className="profile-section">
              <div className="name">Qiaoyi Liu</div>

              <div className="git-in">
                <a href="https://github.com/dalishuishou668" target="popup">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/qiaoyi-joyce-liu-623204241/"
                  target="popup"
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="">
                  <i className="fa-solid fa-envelope"></i>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
