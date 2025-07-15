package main

import (
	"log"
	"os"
	"time"

	"github.com/fiansyahm/concert-ticket-golang/booking-service/database"
	"github.com/fiansyahm/concert-ticket-golang/booking-service/route"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"github.com/joho/godotenv"
)

// @title Booking Service API
// @version 1.0
// @description This is a booking service for a concert ticket booking system.
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.email fiber@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:8082
// @BasePath /api
func main() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file, using environment variables")
	}

	// Initialize database
	db, err := database.InitDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Set Gin to release mode for production
	gin.SetMode(gin.ReleaseMode)

	// Set up Gin router
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// CORS Middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	route.SetupRouter(router, db)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}
	log.Printf("Server listening on port %s", port)
	router.Run(":" + port)
}
