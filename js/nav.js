// document.addEventListener("DOMContentLoaded", () => {
//   const loginBtn = document.getElementById("login-btn");

//   firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       const avatarURL = user.photoURL || "default-avatar.png";
//       loginBtn.innerHTML = `
//         <img src="${avatarURL}" alt="Avatar"
//              style="width:30px;height:30px;border-radius:50%;cursor:pointer;"
//              onclick="window.location.href='profile.html'">
//       `;
//     } else {
//       loginBtn.innerHTML = `<a href="login.html">Đăng nhập</a>`;
//     }
//   });
// });
window.addEventListener("DOMContentLoaded", function () {
  const loginNav = document.getElementById("loginNav");
  const userSession = localStorage.getItem("user_session");
  if (loginNav && userSession) {
    const user = JSON.parse(userSession);
    loginNav.innerHTML = `
      <a class="nav-link" href="/profile">
        <img src="${
          user.photoURL || "/img/default-avatar.png"
        }" alt="Avatar" style="width:32px;height:32px;border-radius:50%;">
      </a>
    `;
  }
});
