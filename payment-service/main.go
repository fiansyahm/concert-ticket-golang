package main

import (
	"log"
	"os"

	"github.com/fiansyahm/concert-ticket-golang/payment-service/database"
	"github.com/fiansyahm/concert-ticket-golang/payment-service/route"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
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
	route.SetupRouter(router, db)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}
	log.Printf("Server listening on port %s", port)
	router.Run(":" + port)
}
