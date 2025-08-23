async function loadEventDetail() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  const res = await fetch("data/event.json");
  const events = await res.json();

  const event = events.find((ev) => ev.id == eventId);
  if (!event) {
    document.getElementById("event-detail").innerHTML =
      "<p>Sự kiện không tồn tại.</p>";
    return;
  }

  document.getElementById("event-detail").innerHTML = `
    <div class="card shadow">
      <img src="${event.event_image}" class="card-img-top" alt="${
    event.event_title
  }">
      <div class="card-body">
        <h2 class="card-title">${event.event_title}</h2>
        <p class="text-muted">📅 ${new Date(
          event.event_date
        ).toLocaleDateString("vi-VN")}</p>
        <p class="card-text">${event.event_content}</p>
        <a href="index.html" class="btn btn-secondary mt-3">⬅ Quay lại</a>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", loadEventDetail);
