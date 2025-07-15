package main

import (
	"log"
	"os"

	"github.com/fiansyahm/concert-ticket-golang/payment-service/database"
	"github.com/fiansyahm/concert-ticket-golang/payment-service/route"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/gin-contrib/cors"
)

// @title Payment Service API
// @version 1.0
// @description This is a payment service for a concert ticket booking system.
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.email fiber@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:8083
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

	// Set up Gin router
	router := gin.Default()

	// Configure CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 3600,
	}))

	route.SetupRouter(router, db)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8083"
	}
	log.Printf("Server listening on port %s", port)
	router.Run(":" + port)
}
