document.addEventListener("DOMContentLoaded", function () {
  let favoriteEvents = [
    {
      title: "Chiến thắng Điện Biên Phủ",
      date: "07/05/1954",
      img: "dienbienphu.jpg",
      desc: "Trận chiến lịch sử của Việt Nam chống thực dân Pháp.",
    },
    {
      title: "Cách mạng tháng 8",
      date: "19/08/1945",
      img: "cachmangthang8.jpg",
      desc: "Cuộc khởi nghĩa giành độc lập cho dân tộc Việt Nam.",
    },
  ];

  let eventContainer = document.getElementById("favorite-events");
  favoriteEvents.forEach((event) => {
    let eventHTML = `
            <div class="col-md-6">
                <div class="event-card">
                    <img src="images/${event.img}" class="img-fluid w-100" alt="${event.title}">
                    <h4 class="mt-2">${event.title}</h4>
                    <p><strong>Ngày:</strong> ${event.date}</p>
                    <p>${event.desc}</p>
                    <button class="btn btn-danger btn-remove" data-title="${event.title}">Xóa khỏi yêu thích</button>
                </div>
            </div>
        `;
    eventContainer.innerHTML += eventHTML;
  });

  document.querySelectorAll(".btn-remove").forEach((button) => {
    button.addEventListener("click", function () {
      alert("Xóa sự kiện: " + this.getAttribute("data-title"));
    });
  });
});
