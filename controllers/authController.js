import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "Username and password and email are required" });
    }


    const [existingUser] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

    if (existingUser.length > 0) {

      return res.status(400).json({ message: "User already exists" });
    }


    const hashedPass = await bcrypt.hash(password, 10);


    const [result] = await pool.query(
      "INSERT INTO users (username, password,email) VALUES (?, ?, ?)",
      [username, hashedPass, email]
    );


    const [newUser] = await pool.query(
      "SELECT id, username FROM users WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(newUser[0]);
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
