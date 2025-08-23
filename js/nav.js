document.addEventListener("DOMContentLoaded", function () {
  if (typeof firebase === "undefined" || !firebase.auth) return;

  firebase.auth().onAuthStateChanged(function (user) {
    const loginLink = document.querySelector(".nav_login_btn");
    if (!loginLink) return;

    if (user) {
      loginLink.innerHTML = '<i class="fa-solid fa-user"></i>';
      loginLink.setAttribute("href", "./user.html");
      loginLink.classList.add("user-icon");
    } else {
      loginLink.textContent = "Đăng nhập";
      loginLink.setAttribute("href", "./dangnhap.html");
      loginLink.classList.remove("user-icon");
    }
  });
});
