// Admin Panel JavaScript - Quản lý sự kiện lịch sử

let currentEvents = [];

// Kiểm tra quyền admin khi tải trang
document.addEventListener('DOMContentLoaded', function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      checkAdminPermission(user);
    } else {
      // Redirect to login if not authenticated
      window.location.href = 'dangnhap.html';
    }
  });
  
  // Setup form event listeners
  setupEventListeners();
});

// Kiểm tra quyền admin
async function checkAdminPermission(user) {
  try {
    const userQuery = await db.collection('users').where('email', '==', user.email).get();
    let isAdmin = false;
    
    userQuery.forEach(doc => {
      const userData = doc.data();
      if (userData.role === 'admin') {
        isAdmin = true;
      }
    });
    
    if (!isAdmin) {
      alert('Bạn không có quyền truy cập trang admin!');
      window.location.href = 'index.html';
      return;
    }
    
    // Load events nếu là admin
    loadEvents();
    
  } catch (error) {
    console.error('Lỗi khi kiểm tra quyền admin:', error);
    alert('Lỗi hệ thống. Vui lòng thử lại.');
    window.location.href = 'index.html';
  }
}

// Load tất cả events từ Firestore
async function loadEvents() {
  try {
    const snapshot = await db.collection('events').orderBy('createdAt', 'desc').get();
    currentEvents = [];
    
    snapshot.forEach(doc => {
      currentEvents.push({
        firebaseId: doc.id,
        ...doc.data()
      });
    });
    
    displayEventsTable();
    
  } catch (error) {
    console.error('Lỗi khi tải events:', error);
    document.getElementById('events-table-body').innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger">
          <i class="fas fa-exclamation-triangle"></i> Lỗi khi tải dữ liệu
        </td>
      </tr>
    `;
  }
}

// Hiển thị events trong table
function displayEventsTable() {
  const tbody = document.getElementById('events-table-body');
  
  if (currentEvents.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">
          <i class="fas fa-inbox"></i> Chưa có sự kiện nào
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = currentEvents.map(event => `
    <tr>
      <td>
        <span class="badge bg-primary">${event.id}</span>
      </td>
      <td>
        <strong>${event.event_title}</strong>
      </td>
      <td>
        <span class="badge bg-danger">${event.event_date}</span>
      </td>
      <td>
        <img src="${event.event_img}" alt="${event.event_title}" 
             style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
      </td>
      <td>
        <div class="btn-group btn-group-sm" role="group">
          <button class="btn btn-outline-info" onclick="viewEvent('${event.firebaseId}')" title="Xem chi tiết">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-outline-warning" onclick="editEvent('${event.firebaseId}')" title="Chỉnh sửa">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-outline-danger" onclick="deleteEvent('${event.firebaseId}', '${event.event_title}')" title="Xóa">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Setup event listeners cho forms
function setupEventListeners() {
  // Add Event Form
  document.getElementById('addEventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addNewEvent();
  });
  
  // Edit Event Form
  document.getElementById('editEventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    updateEvent();
  });
}

// Thêm sự kiện mới
async function addNewEvent() {
  try {
    const title = document.getElementById('event-title').value.trim();
    const date = document.getElementById('event-date').value.trim();
    const image = document.getElementById('event-image').value.trim();
    const content = document.getElementById('event-content').value.trim();
    
    if (!title || !date || !image || !content) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    // Tạo ID mới (tìm ID lớn nhất hiện tại + 1)
    const maxId = Math.max(...currentEvents.map(e => parseInt(e.id) || 0), 0);
    const newId = maxId + 1;
    
    const eventData = {
      id: newId,
      event_title: title,
      event_date: date,
      event_img: image,
      event_content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    
    // Thêm vào Firestore
    await db.collection('events').add(eventData);
    
    alert('✅ Đã thêm sự kiện thành công!');
    
    // Reset form và đóng modal
    document.getElementById('addEventForm').reset();
    bootstrap.Modal.getInstance(document.getElementById('addEventModal')).hide();
    
    // Reload events
    loadEvents();
    
  } catch (error) {
    console.error('Lỗi khi thêm sự kiện:', error);
    alert('❌ Lỗi khi thêm sự kiện. Vui lòng thử lại.');
  }
}

// Xem chi tiết sự kiện
function viewEvent(firebaseId) {
  const event = currentEvents.find(e => e.firebaseId === firebaseId);
  if (!event) return;
  
  const content = `
    <div class="card">
      <img src="${event.event_img}" class="card-img-top" alt="${event.event_title}" style="height: 300px; object-fit: cover;">
      <div class="card-body">
        <h5 class="card-title">${event.event_title}</h5>
        <p class="card-text"><strong>Ngày:</strong> ${event.event_date}</p>
        <p class="card-text">${event.event_content}</p>
        <p class="card-text"><small class="text-muted">ID: ${event.id}</small></p>
      </div>
    </div>
  `;
  
  // Tạo modal động để hiển thị
  const modalHtml = `
    <div class="modal fade" id="viewEventModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết sự kiện</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Remove existing modal if any
  const existingModal = document.getElementById('viewEventModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Add new modal
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modal = new bootstrap.Modal(document.getElementById('viewEventModal'));
  modal.show();
}

// Chỉnh sửa sự kiện
function editEvent(firebaseId) {
  const event = currentEvents.find(e => e.firebaseId === firebaseId);
  if (!event) return;
  
  // Điền thông tin vào form
  document.getElementById('edit-event-id').value = firebaseId;
  document.getElementById('edit-event-title').value = event.event_title;
  document.getElementById('edit-event-date').value = event.event_date;
  document.getElementById('edit-event-image').value = event.event_img;
  document.getElementById('edit-event-content').value = event.event_content;
  
  // Hiển thị modal
  const modal = new bootstrap.Modal(document.getElementById('editEventModal'));
  modal.show();
}

// Cập nhật sự kiện
async function updateEvent() {
  try {
    const firebaseId = document.getElementById('edit-event-id').value;
    const title = document.getElementById('edit-event-title').value.trim();
    const date = document.getElementById('edit-event-date').value.trim();
    const image = document.getElementById('edit-event-image').value.trim();
    const content = document.getElementById('edit-event-content').value.trim();
    
    if (!title || !date || !image || !content) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    const updateData = {
      event_title: title,
      event_date: date,
      event_img: image,
      event_content: content,
      updatedAt: new Date()
    };
    
    // Cập nhật trong Firestore
    await db.collection('events').doc(firebaseId).update(updateData);
    
    alert('✅ Đã cập nhật sự kiện thành công!');
    
    // Đóng modal
    bootstrap.Modal.getInstance(document.getElementById('editEventModal')).hide();
    
    // Reload events
    loadEvents();
    
  } catch (error) {
    console.error('Lỗi khi cập nhật sự kiện:', error);
    alert('❌ Lỗi khi cập nhật sự kiện. Vui lòng thử lại.');
  }
}

// Xóa sự kiện
async function deleteEvent(firebaseId, eventTitle) {
  if (!confirm(`Bạn có chắc muốn xóa sự kiện "${eventTitle}"?\n\nHành động này không thể hoàn tác!`)) {
    return;
  }
  
  try {
    // Xóa từ Firestore
    await db.collection('events').doc(firebaseId).delete();
    
    alert('✅ Đã xóa sự kiện thành công!');
    
    // Reload events
    loadEvents();
    
  } catch (error) {
    console.error('Lỗi khi xóa sự kiện:', error);
    alert('❌ Lỗi khi xóa sự kiện. Vui lòng thử lại.');
  }
}

// Utility: Format date
function formatDate(date) {
  if (date && date.toDate) {
    return date.toDate().toLocaleDateString('vi-VN');
  }
  return date || '';
}
