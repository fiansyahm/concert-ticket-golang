module concert-ticket-golang

go 1.24.5

replace github.com/fiansyahm/concert-ticket-golang/booking-service => ./booking-service

replace github.com/fiansyahm/concert-ticket-golang/payment-service => ./payment-service

replace github.com/fiansyahm/concert-ticket-golang/user-service => ./user-service

require (
	github.com/fiansyahm/concert-ticket-golang/booking-service v0.0.0-00010101000000-000000000000
	github.com/fiansyahm/concert-ticket-golang/payment-service v0.0.0-00010101000000-000000000000
	github.com/fiansyahm/concert-ticket-golang/user-service v0.0.0-00010101000000-000000000000
	gorm.io/driver/sqlite v1.6.0
	gorm.io/gorm v1.30.0
)

require (
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
	github.com/mattn/go-sqlite3 v1.14.22 // indirect
	golang.org/x/text v0.26.0 // indirect
)
