// Script để migrate data từ events.json lên Firebase Firestore
// Chạy script này một lần trong browser console để upload data

async function migrateEventsToFirebase() {
  try {
    console.log('Bắt đầu migrate dữ liệu từ events.json lên Firebase...');
    
    // Fetch data từ events.json
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error('Không thể tải events.json');
    }
    
    const events = await response.json();
    console.log('Đã tải được', events.length, 'sự kiện từ events.json');
    
    // Upload từng event lên Firestore
    const batch = db.batch();
    const eventsRef = db.collection('events');
    
    for (const event of events) {
      // Tạo document với ID tùy chỉnh hoặc auto-generated
      const docRef = eventsRef.doc(); // Auto-generated ID
      
      const eventData = {
        id: event.id,
        event_title: event.event_title,
        event_date: event.event_date,
        event_content: event.event_content,
        event_img: event.event_img,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
      
      batch.set(docRef, eventData);
    }
    
    // Commit batch
    await batch.commit();
    console.log('✅ Đã migrate thành công', events.length, 'sự kiện lên Firebase!');
    
    // Verify data
    const snapshot = await db.collection('events').get();
    console.log('✅ Xác nhận: Hiện có', snapshot.size, 'sự kiện trong Firestore');
    
    return true;
    
  } catch (error) {
    console.error('❌ Lỗi khi migrate data:', error);
    return false;
  }
}

// Hàm helper để chạy migration
function runMigration() {
  if (typeof db === 'undefined') {
    console.error('❌ Firebase chưa được khởi tạo! Vui lòng chạy trên trang có Firebase.');
    return;
  }
  
  if (confirm('Bạn có chắc muốn migrate dữ liệu từ events.json lên Firebase không?')) {
    migrateEventsToFirebase()
      .then(success => {
        if (success) {
          alert('✅ Migration hoàn tất! Kiểm tra console để xem chi tiết.');
        } else {
          alert('❌ Migration thất bại! Kiểm tra console để xem lỗi.');
        }
      });
  }
}

// Export functions để có thể sử dụng
window.migrateEventsToFirebase = migrateEventsToFirebase;
window.runMigration = runMigration;

console.log('📥 Script migrate-data.js đã được tải!');
console.log('💡 Để chạy migration, gọi: runMigration()');
