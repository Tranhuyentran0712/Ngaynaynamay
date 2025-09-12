// Mock API Endpoints for "Ngày Này Năm Ấy" application
// Simulate external API calls for development and testing

class MockAPI {
  constructor() {
    this.baseURL = '/api';
    this.events = [
      {
        id: 1,
        event_title: "Chiến thắng Điện Biên Phủ",
        event_date: "07/05/1954",
        event_content: "Trận Điện Biên Phủ (13/3 ~ 7/5/1954) là chiến dịch quân sự quyết định trong cuộc kháng chiến chống Pháp của nhân dân Việt Nam...",
        event_img: "./img/16518946847629.jpeg",
        category: "military",
        tags: ["vietnam", "war", "independence"]
      },
      {
        id: 2,
        event_title: "Chiến dịch Hồ Chí Minh",
        event_date: "30/04/1975",
        event_content: "Chiến dịch Hồ Chí Minh là trận quyết chiến chiến lược cuối cùng của quân và dân Việt Nam trong cuộc kháng chiến chống Mỹ...",
        event_img: "./img/photo-1714290103895-17142901040591609258739.webp",
        category: "military",
        tags: ["vietnam", "war", "unification"]
      },
      {
        id: 3,
        event_title: "Điện Biên Phủ trên không",
        event_date: "18/12/1972",
        event_content: "Chiến dịch Điện Biên Phủ trên không (18–29/12/1972) là cuộc tập kích chiến lược bằng không quân lớn nhất của Mỹ trong chiến tranh Việt Nam...",
        event_img: "./img/ttxvn_dien-bien-phu-tren-khong-1.jpg",
        category: "military",
        tags: ["vietnam", "war", "air-force"]
      }
    ];
    
    this.statistics = {
      totalEvents: this.events.length,
      totalUsers: 1250,
      totalFavorites: 3420,
      todayVisits: 89
    };
  }

  // Simulate network delay
  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET /api/events - Lấy tất cả events
  async getAllEvents(params = {}) {
    await this.delay();
    
    let filteredEvents = [...this.events];
    
    // Filter by category
    if (params.category) {
      filteredEvents = filteredEvents.filter(e => e.category === params.category);
    }
    
    // Filter by date
    if (params.date) {
      filteredEvents = filteredEvents.filter(e => e.event_date === params.date);
    }
    
    // Search by title or content
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredEvents = filteredEvents.filter(e => 
        e.event_title.toLowerCase().includes(searchTerm) ||
        e.event_content.toLowerCase().includes(searchTerm)
      );
    }
    
    // Pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedEvents,
      pagination: {
        page,
        limit,
        total: filteredEvents.length,
        pages: Math.ceil(filteredEvents.length / limit)
      }
    };
  }

  // GET /api/events/:id - Lấy event theo ID
  async getEventById(id) {
    await this.delay(300);
    
    const event = this.events.find(e => e.id === parseInt(id));
    
    if (!event) {
      return {
        success: false,
        error: 'Event not found',
        code: 404
      };
    }
    
    return {
      success: true,
      data: event
    };
  }

  // POST /api/events - Tạo event mới
  async createEvent(eventData) {
    await this.delay(800);
    
    // Validation
    const requiredFields = ['event_title', 'event_date', 'event_content', 'event_img'];
    const missingFields = requiredFields.filter(field => !eventData[field]);
    
    if (missingFields.length > 0) {
      return {
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        code: 400
      };
    }
    
    const newEvent = {
      id: Math.max(...this.events.map(e => e.id)) + 1,
      ...eventData,
      category: eventData.category || 'general',
      tags: eventData.tags || [],
      createdAt: new Date().toISOString()
    };
    
    this.events.push(newEvent);
    this.statistics.totalEvents++;
    
    return {
      success: true,
      data: newEvent,
      message: 'Event created successfully'
    };
  }

  // PUT /api/events/:id - Cập nhật event
  async updateEvent(id, eventData) {
    await this.delay(600);
    
    const eventIndex = this.events.findIndex(e => e.id === parseInt(id));
    
    if (eventIndex === -1) {
      return {
        success: false,
        error: 'Event not found',
        code: 404
      };
    }
    
    const updatedEvent = {
      ...this.events[eventIndex],
      ...eventData,
      id: parseInt(id), // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    this.events[eventIndex] = updatedEvent;
    
    return {
      success: true,
      data: updatedEvent,
      message: 'Event updated successfully'
    };
  }

  // DELETE /api/events/:id - Xóa event
  async deleteEvent(id) {
    await this.delay(400);
    
    const eventIndex = this.events.findIndex(e => e.id === parseInt(id));
    
    if (eventIndex === -1) {
      return {
        success: false,
        error: 'Event not found',
        code: 404
      };
    }
    
    const deletedEvent = this.events.splice(eventIndex, 1)[0];
    this.statistics.totalEvents--;
    
    return {
      success: true,
      data: deletedEvent,
      message: 'Event deleted successfully'
    };
  }

  // GET /api/events/search/:date - Tìm events theo ngày
  async searchEventsByDate(dateString) {
    await this.delay();
    
    const events = this.events.filter(e => e.event_date === dateString);
    
    return {
      success: true,
      data: events,
      query: dateString,
      count: events.length
    };
  }

  // GET /api/stats - Lấy thống kê
  async getStatistics() {
    await this.delay(200);
    
    return {
      success: true,
      data: {
        ...this.statistics,
        lastUpdated: new Date().toISOString()
      }
    };
  }

  // GET /api/events/featured - Lấy events nổi bật
  async getFeaturedEvents(limit = 3) {
    await this.delay(300);
    
    // Sort by some criteria (latest first)
    const featuredEvents = this.events
      .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
      .slice(0, limit);
    
    return {
      success: true,
      data: featuredEvents
    };
  }

  // POST /api/events/:id/favorite - Thêm vào favorites
  async addToFavorites(eventId, userId) {
    await this.delay(400);
    
    const event = this.events.find(e => e.id === parseInt(eventId));
    
    if (!event) {
      return {
        success: false,
        error: 'Event not found',
        code: 404
      };
    }
    
    // Simulate adding to favorites
    this.statistics.totalFavorites++;
    
    return {
      success: true,
      message: 'Added to favorites successfully',
      data: {
        eventId: parseInt(eventId),
        userId,
        addedAt: new Date().toISOString()
      }
    };
  }
}

// Create global instance
const mockAPI = new MockAPI();

// Helper functions to simulate API calls
window.mockAPICall = {
  // GET requests
  get: async (endpoint, params = {}) => {
    console.log(`[Mock API] GET ${endpoint}`, params);
    
    switch (endpoint) {
      case '/api/events':
        return await mockAPI.getAllEvents(params);
      case '/api/stats':
        return await mockAPI.getStatistics();
      case '/api/events/featured':
        return await mockAPI.getFeaturedEvents(params.limit);
      default:
        if (endpoint.startsWith('/api/events/') && endpoint.includes('/search/')) {
          const date = endpoint.split('/search/')[1];
          return await mockAPI.searchEventsByDate(date);
        } else if (endpoint.startsWith('/api/events/')) {
          const id = endpoint.split('/api/events/')[1];
          return await mockAPI.getEventById(id);
        }
        return { success: false, error: 'Endpoint not found', code: 404 };
    }
  },

  // POST requests
  post: async (endpoint, data = {}) => {
    console.log(`[Mock API] POST ${endpoint}`, data);
    
    if (endpoint === '/api/events') {
      return await mockAPI.createEvent(data);
    } else if (endpoint.includes('/favorite')) {
      const eventId = endpoint.split('/')[3];
      return await mockAPI.addToFavorites(eventId, data.userId);
    }
    
    return { success: false, error: 'Endpoint not found', code: 404 };
  },

  // PUT requests
  put: async (endpoint, data = {}) => {
    console.log(`[Mock API] PUT ${endpoint}`, data);
    
    if (endpoint.startsWith('/api/events/')) {
      const id = endpoint.split('/api/events/')[1];
      return await mockAPI.updateEvent(id, data);
    }
    
    return { success: false, error: 'Endpoint not found', code: 404 };
  },

  // DELETE requests
  delete: async (endpoint) => {
    console.log(`[Mock API] DELETE ${endpoint}`);
    
    if (endpoint.startsWith('/api/events/')) {
      const id = endpoint.split('/api/events/')[1];
      return await mockAPI.deleteEvent(id);
    }
    
    return { success: false, error: 'Endpoint not found', code: 404 };
  }
};

// Example usage:
/*
// Get all events
const allEvents = await mockAPICall.get('/api/events');

// Get event by ID
const event = await mockAPICall.get('/api/events/1');

// Search events by date
const searchResults = await mockAPICall.get('/api/events/search/07/05/1954');

// Create new event
const newEvent = await mockAPICall.post('/api/events', {
  event_title: "Test Event",
  event_date: "01/01/2025",
  event_content: "This is a test event",
  event_img: "test.jpg"
});

// Update event
const updatedEvent = await mockAPICall.put('/api/events/1', {
  event_title: "Updated Title"
});

// Delete event
const deleteResult = await mockAPICall.delete('/api/events/1');
*/

console.log('🚀 Mock API endpoints loaded successfully!');
console.log('💡 Use window.mockAPICall.get/post/put/delete() for testing');
console.log('📝 Example: await mockAPICall.get("/api/events")');
