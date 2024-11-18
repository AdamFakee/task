# Cài đặt project
**1.** git clone https://github.com/AdamFakee/task.git <br>
**2.** npm install <br>
**3.** npm start <br>
**4.** npm run auth <br>
**5.** open folder "router" to see route (localhost:3000) <br>
**6.** open file "authServer.js" to see authentication route (localhost:8080) <br>

## Mô tả
* Website phân chia công việc.
* Backend : Node.JS (Express), RestFull API.
* Libaries : bcrypt, cors, express-rate-limit, passport, passport-jwt, nodemailer, express-session, dotenv, connect-redis, ioredis, jsonwebtoken, nodemailer, multer, express, body-parser, mongoose.
* Database : MongoDB
* Mô hình cấu trúc thư mục : MVC
  
### Các chức năng chính 
* CRUD 
* Xác thực API bằng JWT thông qua passport-jwt. Đồng thời sử dụng Black-list-token để chứa các Token không còn được sử dụng nữa nhưng vẫn còn thời gian sống. Black-list-token sử dụng cấu trúc SORTED SET của redis.
* Mã hóa password bằng thư viện Bcrypt.
* Cấu hình CORS.
* Sử dụng express-rate-limit để bảo vệ 1 số router tránh việc spam liên tục 
