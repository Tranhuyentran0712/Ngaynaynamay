// async function loadEventDetail() {
//   const params = new URLSearchParams(window.location.search);
//   const eventId = params.get("id");

//   const res = await fetch("data/event.json");
//   const events = await res.json();

//   const event = events.find((ev) => ev.id == eventId);
//   if (!event) {
//     document.getElementById("event-detail").innerHTML =
//       "<p>Sự kiện không tồn tại.</p>";
//     return;
//   }

//   document.getElementById("event-detail").innerHTML = `
//     <div class="card shadow">
//       <img src="${event.event_image}" class="card-img-top" alt="${
//     event.event_title
//   }">
//       <div class="card-body">
//         <h2 class="card-title">${event.event_title}</h2>
//         <p class="text-muted"> ${new Date(
//           event.event_date
//         ).toLocaleDateString("vi-VN")}</p>
//         <p class="card-text">${event.event_content}</p>
//         <a href="index.html" class="btn btn-secondary mt-3">⬅ Quay lại</a>
//       </div>
//     </div>
//   `;
// }

// document.addEventListener("DOMContentLoaded", loadEventDetail);

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const detailEl = document.getElementById("event-detail");

  if (!eventId) {
    detailEl.innerText = "Thiếu ID sự kiện trong URL.";
    return;
  }

  fetch("events.json")
    .then((res) => {
      if (!res.ok) throw new Error("Không tải được events.json");
      return res.json();
    })
    .then((events) => {
      // chuyển id từ chuỗi sang number nếu cần
      const evt = events.find((e) => e.id.toString() === eventId);
      if (!evt) {
        detailEl.innerText = "Không tìm thấy sự kiện.";
        return;
      }
      // Render chi tiết
      detailEl.innerHTML = `
        <h1>${evt.title}</h1>
        <img src="${evt.img}" alt="${evt.title}">
        <p><strong>Ngày:</strong> ${evt.date}</p>
        <p>${evt.description}</p>
      `;
    })
    .catch((err) => {
      console.error(err);
      detailEl.innerText = "Lỗi khi tải chi tiết sự kiện.";
    });
});
