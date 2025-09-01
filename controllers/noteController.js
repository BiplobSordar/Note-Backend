import pool from "../config/db.js";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)",
      [userId, title, content]
    );

    
    const [newNote] = await pool.query("SELECT * FROM notes WHERE id = ?", [result.insertId]);

    res.status(201).json(newNote[0]);
  } catch (err) {
    console.error("Create Note Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query("SELECT * FROM notes WHERE user_id = ?", [userId]);

    res.json(rows);
  } catch (err) {
    console.error("Get Notes Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      "UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?",
      [title, content, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Note not found" });
    }


    const [updatedNote] = await pool.query("SELECT * FROM notes WHERE id = ? AND user_id = ?", [
      id,
      userId,
    ]);

    res.json(updatedNote[0]);
  } catch (err) {
    console.error("Update Note Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await pool.query("DELETE FROM notes WHERE id = ? AND user_id = ?", [
      id,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Delete Note Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
