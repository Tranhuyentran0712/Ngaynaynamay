const inpUsername = document.getElementById("inp-username-register");
const inpEmail = document.getElementById("inp-email-register");
const inpPwd = document.getElementById("inp-pwd-register");
const inpConfirmPwd = document.getElementById("inp-cf-pw-register");

document.getElementById("register-form").addEventListener("submit", (event) => {
  event.preventDefault();

  let username = inpUsername.value.trim();
  let email = inpEmail.value.toLowerCase();
  let password = inpPwd.value;
  let confirmPassword = inpConfirmPwd.value;
  let role = "user";
  if (!username || !email || !password || !confirmPassword) {
    alert("Vui lòng điền đủ các trường.");
    return;
  }
  if (password !== confirmPassword) {
    alert("Mật khẩu không khớp.");
    return;
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Chỉ lưu thông tin cần thiết, không lưu password vào Firestore
      let userData = {
        uid: userCredential.user.uid, // Lưu UID để liên kết với Firebase Auth
        username,
        email,
        role: role,
        createdAt: new Date()
      };

      db.collection("users")
        .add(userData)
        .then((docRef) => {
          alert("Đăng ký thành công!");
          window.location.href = "dangnhap.html";
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          alert("Đăng ký thất bại. Vui lòng thử lại.");
          console.error("Error adding document: ", error);
        });
    })
    .catch((error) => {
      // Hiển thị thông báo lỗi cụ thể của Firebase
      var errorCode = error.code;
      var errorMessage = error.message;

      // Kiểm tra lỗi phổ biến từ Firebase
      if (errorCode === "auth/email-already-in-use") {
        alert("Email đã được sử dụng.");
      } else if (errorCode === "auth/weak-password") {
        alert("Mật khẩu phải có ít nhất 6 ký tự.");
      } else {
        alert(`Lỗi: ${errorMessage}`);
      }
      console.log(errorMessage);
    });
});
