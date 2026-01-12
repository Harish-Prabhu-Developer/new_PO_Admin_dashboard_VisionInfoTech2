import app from './app';
import dotenv from 'dotenv';
import os from "os";
dotenv.config();

const PORT = process.env.PORT || 5000;

const getLocalIP = (): string => {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
};
const LOCAL_IP = getLocalIP();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  if (process.env.NODE_ENV === "development") {
    console.log(`   ➜ Local:   http://localhost:${PORT}`); 
    if (LOCAL_IP !== "localhost") {
     console.log(`   ➜ Network: http://${LOCAL_IP}:${PORT}`);
    }
    console.log(`📊 Database: ${process.env.DB_DATABASE}@${process.env.DB_HOST}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV ?? "development"}`);
  }
});
