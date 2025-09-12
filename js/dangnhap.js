const inpEmail = document.getElementById("inp-email-login");
const inpPwd = document.getElementById("inp-pwd-login");

document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault();

  let email = inpEmail.value.toLowerCase();
  let password = inpPwd.value;

  if (!email || !password) {
    alert("Vui lòng điền đủ các trường");
    return;
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Lấy thông tin user từ Firestore để kiểm tra role
      db.collection("users")
        .where("email", "==", email)
        .get()
        .then((querySnapshot) => {
          let isAdmin = false;
          
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.role && userData.role === "admin") {
              isAdmin = true;
            }
          });
          
          alert("Đăng nhập thành công");
          
          if (isAdmin) {
            window.location.href = "admin.html";
          } else {
            window.location.href = "index.html";
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin user:", error);
          // Nếu không lấy được role, redirect về trang chủ
          alert("Đăng nhập thành công");
          window.location.href = "index.html";
        });
    })
    .catch((error) => {
      console.error("Lỗi đăng nhập:", error);
      let errorMessage = "Email hoặc mật khẩu không đúng";
      
      // Xử lý các loại lỗi cụ thể
      if (error.code === "auth/user-not-found") {
        errorMessage = "Tài khoản không tồn tại";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Mật khẩu không đúng";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Quá nhiều lần thử. Vui lòng thử lại sau";
      }
      
      alert(errorMessage);
    });
});
