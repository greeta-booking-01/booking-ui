const prod = {
  url: {
    KEYCLOAK_BASE_URL: "https://keycloak.greeta.net",        
    BOOKING_API_BASE_URL: 'https://bookingapi.greeta.net/booking/api'
  }
}

const dev = {
  url: {
    KEYCLOAK_BASE_URL: "http://localhost:8080",      
    BOOKING_API_BASE_URL: 'http://localhost:9000/booking/api'
  }
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod